import { describe, expect, it } from "vitest";
import {
  applyEndorsement,
  assessAgentRiskIncident,
  assessNeeds,
  assessServiceRole,
  assertDataMinimisation,
  assertEstimateAllowed,
  assertFirmCoverageConclusion,
  assertNoDuplicateNotice,
  buildCoverageInventory,
  buildQuoteRequest,
  buildReportSnapshot,
  buildRiskDeclaration,
  canReadPrivateDocument,
  compareQuotes,
  computeIllustrativeEstimate,
  evaluateDecisionChain,
  evaluateRules,
  isQuoteCurrent,
  planPrivacyExport,
  planRestore,
  prepareClaimNotice,
  prepareDispute,
  proposeDeadline,
  proposeRenewal,
  requireHumanAuthority,
  reviewExtraction,
  selectCurrentQuote,
  stageEvidence,
  sumLimits,
  transitionHandoff,
} from "./index";

const eur = (amount: string) => ({ amount, currency: "EUR", exponent: 2 });

describe("C09 service role", () => {
  it("keeps middleware in authorization_pending with no acts allowed", () => {
    const result = assessServiceRole({
      assessmentRef: "assess_0001",
      serviceRole: "assistant",
      territory: "ES",
      productLine: "multirriesgo",
      authorizationProof: null,
    });
    expect(result.state).toBe("authorization_pending");
    expect(result.actsAllowed).toEqual([]);
  });

  it("refuses a regulated role without proof", () => {
    expect(() =>
      assessServiceRole({
        assessmentRef: "assess_0002",
        serviceRole: "regulated_broker",
        territory: "ES",
        productLine: "multirriesgo",
        authorizationProof: null,
      }),
    ).toThrow(/authorization proof/);
  });

  it("accepts a regulated role with proof", () => {
    expect(
      assessServiceRole({
        assessmentRef: "assess_0003",
        serviceRole: "regulated_broker",
        territory: "ES",
        productLine: "multirriesgo",
        authorizationProof: "proof_000001",
      }).state,
    ).toBe("prepared");
  });
});

describe("C10 representation", () => {
  const base = {
    authorityRef: "auth_0000001",
    policyRef: "policy_000001",
    partyId: "party_claimant",
    partyRole: "claimant" as const,
    represents: [] as string[],
    sharingScope: "self" as const,
    evidenceRef: null as string | null,
  };

  it("does not grant a claimant access to private documents", () => {
    expect(canReadPrivateDocument({ ...base }, "party_policyholder")).toBe(false);
  });

  it("lets a party read its own documents", () => {
    expect(canReadPrivateDocument({ ...base }, "party_claimant")).toBe(true);
  });

  it("requires representation evidence for another party's documents", () => {
    expect(
      canReadPrivateDocument({ ...base, represents: ["party_policyholder"], evidenceRef: null }, "party_policyholder"),
    ).toBe(false);
    expect(
      canReadPrivateDocument(
        { ...base, represents: ["party_policyholder"], evidenceRef: "proof_000001" },
        "party_policyholder",
      ),
    ).toBe(true);
  });

  it("treats policyholder and insured as distinct ids", () => {
    const asInsured = { ...base, partyId: "party_insured" };
    expect(canReadPrivateDocument(asInsured, "party_policyholder")).toBe(false);
  });
});

describe("C11 risk declaration", () => {
  const fact = (field: string, sourceRef: string | null) => ({
    factRef: `fact_${field}`,
    field,
    value: "declared-value",
    status: "declared" as const,
    sourceRef,
  });

  it("stays collecting_facts while a required field has no source", () => {
    const result = buildRiskDeclaration([fact("activity", "src_0000001"), fact("revenue", null)]);
    expect(result.state).toBe("collecting_facts");
    expect(result.missing).toContain("revenue");
    expect(result.unsourced).toContain("revenue");
  });

  it("never infers health or vulnerability", () => {
    const result = buildRiskDeclaration([
      fact("activity", "src_0000001"),
      fact("revenue", "src_0000001"),
      fact("employees", "src_0000001"),
      fact("locations", "src_0000001"),
    ]);
    expect(result.state).toBe("prepared");
    expect(result.inferred).toEqual([]);
  });
});

describe("C12 policy custody", () => {
  const version = {
    policyVersionRef: "pver_000001",
    policyRef: "policy_000001",
    sourceDocumentHash: "a".repeat(64),
    effectiveFrom: "2026-01-01T00:00:00Z",
    effectiveTo: null,
    endorsements: [
      { endorsementRef: "end_0000001", effectiveAt: "2026-03-01T00:00:00Z", order: 1, supersedes: [] },
    ],
  };

  it("creates a newer version and marks the superseded projection stale", () => {
    const result = applyEndorsement(version, {
      endorsementRef: "end_0000002",
      effectiveAt: "2026-06-01T00:00:00Z",
      order: 2,
      supersedes: ["pver_000001"],
    });
    expect(result.current.endorsements).toHaveLength(2);
    expect(result.staleRefs).toEqual(["pver_000001"]);
    expect(result.revision).toBe(2);
  });

  it("rejects out-of-order endorsements", () => {
    expect(() =>
      applyEndorsement(version, {
        endorsementRef: "end_0000003",
        effectiveAt: "2026-02-01T00:00:00Z",
        order: 1,
        supersedes: [],
      }),
    ).toThrow(/not monotonic/);
  });
});

describe("C13 extraction", () => {
  it("requires review for a low-confidence deductible and blocks estimates", () => {
    const clauses = [
      { clauseRef: "clause_0001", textHash: "b".repeat(64), confidence: 0.72, kind: "deductible" },
    ];
    expect(reviewExtraction(clauses).status).toBe("needs_review");
    expect(() => assertEstimateAllowed(clauses)).toThrow(/unreviewed clauses/);
  });

  it("accepts high-confidence clauses", () => {
    const clauses = [{ clauseRef: "clause_0002", textHash: "c".repeat(64), confidence: 0.99, kind: "limit" }];
    expect(assertEstimateAllowed(clauses)).toBeUndefined();
  });
});

describe("C15 coverage inventory", () => {
  it("reports unknown when a particular condition or limit is missing", () => {
    const inventory = buildCoverageInventory([
      { coverageRef: "cov_000001", peril: "incendio", particularConditionRef: null, limit: eur("100000"), exclusionRefs: [] },
    ]);
    expect(inventory.status).toBe("unknown");
    expect(() => assertFirmCoverageConclusion(inventory)).toThrow(/definitive/);
  });

  it("sums limits in the same denomination only", () => {
    expect(sumLimits([{ limit: eur("100") }, { limit: eur("250") }])).toEqual(eur("350"));
    expect(() => sumLimits([{ limit: eur("100") }, { limit: { amount: "1", currency: "USD", exponent: 2 } }])).toThrow(
      /denominations/,
    );
  });
});

describe("C14 needs", () => {
  it("escalates contradictory needs and never ranks", () => {
    const result = assessNeeds([
      { needRef: "need_000001", coverageNeed: "responsabilidad civil", declaredPurpose: "proteger patrimonio", constraints: [] },
      { needRef: "need_000001", coverageNeed: "responsabilidad civil", declaredPurpose: "reducir prima", constraints: [] },
    ]);
    expect(result.state).toBe("needs_professional_review");
    expect(result.contradictions).toEqual(["need_000001"]);
    expect(result.ranking).toBeNull();
  });
});

describe("C16 quote request", () => {
  const request = {
    requestRef: "qreq_000001",
    needs: [
      { needRef: "need_000001", coverageNeed: "responsabilidad civil", declaredPurpose: "proteger patrimonio", constraints: [] },
    ],
    recipients: ["operator_0001"],
    sharedFields: ["activity", "revenue"],
  };

  it("proposes without sending", () => {
    expect(buildQuoteRequest(request).sends).toBe(false);
  });

  it("refuses data outside the declared purpose", () => {
    expect(() => assertDataMinimisation(request, ["activity", "revenue"])).not.toThrow();
    expect(() =>
      assertDataMinimisation({ ...request, sharedFields: ["activity", "health_status"] }, ["activity", "revenue"]),
    ).toThrow(/outside its purpose/);
  });
});

describe("C17 quote import", () => {
  const quote = {
    quoteRef: "quote_000001",
    insurerRef: "insurer_0001",
    productVersion: "v1",
    premium: eur("50000"),
    coverageLimit: eur("30000000"),
    deductible: eur("60000"),
    validUntil: "2026-12-01T00:00:00Z",
    comparableFields: ["limit", "deductible"],
  };

  it("refuses an expired quote as current", () => {
    expect(isQuoteCurrent(quote, new Date("2026-11-30T00:00:00Z"))).toBe(true);
    expect(() => selectCurrentQuote([quote], "quote_000001", new Date("2026-12-02T00:00:00Z"))).toThrow(
      /not current/,
    );
  });
});

describe("C18 comparison", () => {
  const base = {
    insurerRef: "insurer_0001",
    productVersion: "v1",
    premium: eur("50000"),
    deductible: eur("60000"),
    validUntil: "2026-12-01T00:00:00Z",
    comparableFields: ["limit", "deductible"],
  };

  it("flags non-equivalent products and never assesses suitability", () => {
    const result = compareQuotes([
      { ...base, quoteRef: "quote_000001", coverageLimit: eur("30000000") },
      { ...base, quoteRef: "quote_000002", coverageLimit: eur("60000000") },
    ]);
    expect(result.nonEquivalent).toBe(true);
    expect(result.differences).toContain("coverage limits differ");
    expect(result.suitability).toBe("not_assessed");
  });

  it("returns comparable rows without ordering by price", () => {
    const result = compareQuotes([
      { ...base, quoteRef: "quote_000001", coverageLimit: eur("30000000") },
      { ...base, quoteRef: "quote_000002", coverageLimit: eur("30000000"), premium: eur("40000") },
    ]);
    expect(result.nonEquivalent).toBe(false);
    expect(result.rows.map((row) => row.quoteRef)).toEqual(["quote_000001", "quote_000002"]);
  });
});

describe("C19 rules", () => {
  const rules = [
    {
      ruleRef: "rule_000001",
      ruleVersion: 2,
      whenField: "occupancy",
      whenEquals: "restaurant",
      thenOutcome: "applies" as const,
    },
  ];

  it("propagates a factual variant coherently", () => {
    expect(evaluateRules(rules, { occupancy: "restaurant" }).outcomes[0]?.outcome).toBe("applies");
    expect(evaluateRules(rules, { occupancy: "office" }).outcomes[0]?.outcome).toBe("not_applicable");
  });

  it("treats a missing fact as unknown, not false", () => {
    const result = evaluateRules(rules, {});
    expect(result.outcomes[0]?.outcome).toBe("unknown");
    expect(result.unknownFacts).toEqual(["occupancy"]);
    expect(result.illustrative).toBe(true);
  });
});

describe("C20 estimates", () => {
  it("blocks a firm number when the limit is missing", () => {
    expect(() =>
      computeIllustrativeEstimate({
        estimateRef: "est_000001",
        damage: eur("500000"),
        deductible: eur("50000"),
        limit: null,
      }),
    ).toThrow(/missing inputs/);
  });

  it("subtracts the deductible and caps at the limit without floats", () => {
    const result = computeIllustrativeEstimate({
      estimateRef: "est_000002",
      damage: eur("500000"),
      deductible: eur("50000"),
      limit: eur("400000"),
    });
    expect(result.amount).toEqual(eur("400000"));
    expect(result.firmness).toBe("illustrative_only");
    const belowDeductible = computeIllustrativeEstimate({
      estimateRef: "est_000003",
      damage: eur("30000"),
      deductible: eur("50000"),
      limit: eur("400000"),
    });
    expect(belowDeductible.amount).toEqual(eur("0"));
  });
});

describe("C23 claim intake", () => {
  it("does not arm a deadline without a proven event date", () => {
    const result = prepareClaimNotice({
      noticeRef: "notice_00001",
      policyVersionRef: "pver_000001",
      claimant: "Empresa Sintetica SL",
      eventDate: null,
      eventDateProofRef: null,
    });
    expect(result.state).toBe("collecting_facts");
    expect(result.deadlineArmed).toBe(false);
    expect(result.submission).toBe("not_submitted");
  });

  it("arms a deadline only with date and proof", () => {
    const result = prepareClaimNotice({
      noticeRef: "notice_00002",
      policyVersionRef: "pver_000001",
      claimant: "Empresa Sintetica SL",
      eventDate: "2026-11-01T10:00:00Z",
      eventDateProofRef: "proof_000001",
    });
    expect(result.deadlineArmed).toBe(true);
  });
});

describe("C24 evidence", () => {
  it("stages evidence as data without authority", () => {
    const result = stageEvidence({
      evidenceRef: "evid_000001",
      sha256: "d".repeat(64),
      sensitiveClass: "health",
      custodyRef: "cust_000001",
      purpose: "claim_preparation",
      excerpt: null,
    });
    expect(result.authority).toBe("data_only");
    expect(result.modelVisible).toBe(false);
  });

  it("refuses an effect authorised by evidence", () => {
    expect(() => requireHumanAuthority("evidence")).toThrow(/human or authorized operator/);
    expect(() => requireHumanAuthority("human_reviewer")).not.toThrow();
  });
});

describe("C25 decision chain", () => {
  it("flags a downstream step that ignores an unknown dependency", () => {
    const result = evaluateDecisionChain([
      { stepRef: "step_rule", dependsOn: [], outcome: "unknown" },
      { stepRef: "step_estimate", dependsOn: ["step_rule"], outcome: "applies" },
    ]);
    expect(result.consistent).toBe(false);
    expect(result.inconsistentRefs).toEqual(["step_estimate"]);
  });

  it("accepts a coherent chain", () => {
    expect(
      evaluateDecisionChain([
        { stepRef: "step_rule", dependsOn: [], outcome: "applies" },
        { stepRef: "step_estimate", dependsOn: ["step_rule"], outcome: "applies" },
      ]).consistent,
    ).toBe(true);
  });
});

describe("C26 handoff", () => {
  const handoff = {
    handoffRef: "hand_000001",
    noticeRef: "notice_00001",
    recipient: "operator-sandbox",
    state: "proposed" as const,
    ackRef: null as string | null,
    evidenceRefs: ["evid_000001"],
  };

  it("cannot complete without an acknowledgement", () => {
    const offered = transitionHandoff(handoff, "offer");
    const acknowledged = transitionHandoff(offered, "acknowledge", "ack_000001");
    const working = transitionHandoff(acknowledged, "start");
    expect(transitionHandoff(working, "complete").state).toBe("completed");
    expect(() => transitionHandoff({ ...working, ackRef: null }, "complete")).toThrow(/no acknowledgement/);
  });

  it("rejects illegal transitions and duplicate notices", () => {
    expect(() => transitionHandoff(handoff, "complete")).toThrow(/illegal handoff transition/);
    expect(() =>
      assertNoDuplicateNotice([{ noticeRef: "notice_00001", recipient: "operator-sandbox" }], {
        noticeRef: "notice_00001",
        recipient: "operator-sandbox",
      }),
    ).toThrow(/already handed off/);
  });
});

describe("C28 deadlines", () => {
  const deadline = {
    deadlineRef: "dead_000001",
    jurisdiction: "ES",
    ruleRef: "rule_000001",
    trigger: { date: "2026-11-01T10:00:00Z", proofRef: null as string | null },
    previousTriggerHash: null as string | null,
  };

  it("does not create a calendar entry without proof", () => {
    const result = proposeDeadline(deadline);
    expect(result.state).toBe("collecting_facts");
    expect(result.calendarEntry).toBeNull();
  });

  it("requires a new revision when the trigger changes", () => {
    const result = proposeDeadline({
      ...deadline,
      trigger: { date: "2026-11-01T10:00:00Z", proofRef: "proof_000001" },
      previousTriggerHash: "hash_00000001",
    });
    expect(result.revisionRequired).toBe(true);
    expect(result.calendarEntry?.ruleRef).toBe("rule_000001");
  });
});

describe("C29 renewal", () => {
  it("leaves a voice request as a proposal with no effect", () => {
    const result = proposeRenewal({
      renewalRef: "renew_000001",
      policyRef: "policy_000001",
      requestedChannel: "voice",
      changes: ["aumentar capital"],
    });
    expect(result.effect).toBe("none");
    expect(result.requiresAuthorizedOperator).toBe(true);
  });
});

describe("C30 dispute", () => {
  it("escalates legal risk and preserves evidence", () => {
    const result = prepareDispute({
      disputeRef: "disp_000001",
      facts: ["denegacion parcial"],
      evidenceRefs: ["evid_000001"],
      legalRisk: "high",
    });
    expect(result.escalated).toBe(true);
    expect(result.evidenceRefs).toEqual(["evid_000001"]);
  });
});

describe("C31 agent risk", () => {
  it("never claims exclusion or coverage without policy review", () => {
    const result = assessAgentRiskIncident({
      incidentRef: "inc_0000001",
      modelDependency: "provider-x",
      policyRef: null,
      controlEvidenceRefs: [],
    });
    expect(result.coverage).toBe("unknown");
    expect(result.excluded).toBe(false);
    expect(result.covered).toBe(false);
  });
});

describe("C32 privacy", () => {
  const records = [
    { recordRef: "rec_0000001", subjectRef: "party_alpha", sensitiveClass: "personal" as const, suppressed: false },
    { recordRef: "rec_0000002", subjectRef: "party_beta", sensitiveClass: "health" as const, suppressed: false },
    { recordRef: "rec_0000003", subjectRef: "party_alpha", sensitiveClass: "personal" as const, suppressed: true },
  ];

  it("exports only the requesting insured's unsuppressed records", () => {
    const result = planPrivacyExport(records, "party_alpha");
    expect(result.included).toEqual(["rec_0000001"]);
    expect(result.excluded).toEqual(["rec_0000002", "rec_0000003"]);
  });

  it("reapplies suppressions on restore", () => {
    const result = planRestore(records, ["rec_0000001"]);
    // rec_0000002 was never suppressed, so it comes back; the explicit
    // suppression list and the row-level flag both survive the restore.
    expect(result.restored).toEqual(["rec_0000002"]);
    expect(result.stillSuppressed).toEqual(["rec_0000001", "rec_0000003"]);
  });
});

describe("C33 reports", () => {
  const report = {
    reportRef: "rep_0000001",
    cutoff: "2026-11-10T00:00:00Z",
    facts: [{ factRef: "fact_000001", observedAt: "2026-11-09T00:00:00Z", valueRef: "val_0000001" }],
  };

  it("accepts a snapshot built only from data inside the cutoff", () => {
    expect(buildReportSnapshot(report).state).toBe("accepted");
  });

  it("forces a revision for late data or invented values", () => {
    expect(
      buildReportSnapshot({
        ...report,
        facts: [{ factRef: "fact_000002", observedAt: "2026-11-11T00:00:00Z", valueRef: "val_0000001" }],
      }).state,
    ).toBe("needs_revision");
    expect(
      buildReportSnapshot({
        ...report,
        facts: [{ factRef: "fact_000003", observedAt: "2026-11-09T00:00:00Z", valueRef: null }],
      }).inventedValues,
    ).toEqual(["fact_000003"]);
  });
});
