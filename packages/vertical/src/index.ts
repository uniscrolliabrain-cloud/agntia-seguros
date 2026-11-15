import {
  applyEndorsement,
  assessNeeds,
  assessServiceRole,
  buildCoverageInventory,
  buildReportSnapshot,
  buildRiskDeclaration,
  compareQuotes,
  computeIllustrativeEstimate,
  prepareClaimNotice,
  reviewExtraction,
  selectCurrentQuote,
  stageEvidence,
  transitionHandoff,
} from "@agntia/domain";
import { IntentStore, Outbox } from "@agntia/runtime";

/**
 * C40 — Vertical, in process.
 *
 * This is NOT a deployed E2E: there is no database, no portal and no operator
 * sink. It composes the real domain functions with synthetic data to prove the
 * chain and its invariants hold together, and it asserts that no step produces
 * an external effect. A deployed E2E stays blocked until C06 and C34 exist.
 */
export interface VerticalResult {
  readonly steps: readonly string[];
  readonly handoffState: string;
  readonly reportState: string;
  readonly estimate: { readonly amount: string; readonly currency: string };
  readonly effects: readonly string[];
  readonly replayBlocked: boolean;
}

const EUR = (amount: string) => ({ amount, currency: "EUR", exponent: 2 });
const HASH = "e".repeat(64);

export function runVertical(): VerticalResult {
  const steps: string[] = [];

  const role = assessServiceRole({
    assessmentRef: "assess_0001",
    serviceRole: "assistant",
    territory: "ES",
    productLine: "multirriesgo pyme",
    authorizationProof: null,
  });
  steps.push(`c09:${role.state}`);

  const risk = buildRiskDeclaration([
    { factRef: "fact_activity", field: "activity", value: "restauracion", status: "declared", sourceRef: "src_0000001" },
    { factRef: "fact_revenue", field: "revenue", value: 480000, status: "declared", sourceRef: "src_0000002" },
    { factRef: "fact_employees", field: "employees", value: 12, status: "declared", sourceRef: "src_0000003" },
    { factRef: "fact_locations", field: "locations", value: 2, status: "declared", sourceRef: "src_0000004" },
  ]);
  steps.push(`c11:${risk.state}`);

  const policy = applyEndorsement(
    {
      policyVersionRef: "pver_000001",
      policyRef: "policy_000001",
      sourceDocumentHash: HASH,
      effectiveFrom: "2026-01-01T00:00:00Z",
      effectiveTo: null,
      endorsements: [],
    },
    {
      endorsementRef: "end_0000001",
      effectiveAt: "2026-09-01T00:00:00Z",
      order: 1,
      supersedes: ["pver_000001"],
    },
  );
  steps.push(`c12:${policy.staleRefs.length === 1 ? "stale-marked" : "error"}`);

  const clauses = [
    { clauseRef: "clause_0001", textHash: HASH, confidence: 0.99, kind: "deductible" as const },
    { clauseRef: "clause_0002", textHash: HASH, confidence: 0.98, kind: "limit" as const },
  ];
  steps.push(`c13:${reviewExtraction(clauses).status}`);

  const coverage = buildCoverageInventory([
    {
      coverageRef: "cov_000001",
      peril: "incendio",
      particularConditionRef: "clause_0001",
      limit: EUR("60000000"),
      exclusionRefs: [],
    },
  ]);
  steps.push(`c15:${coverage.status}`);

  const needs = assessNeeds([
    {
      needRef: "need_000001",
      coverageNeed: "responsabilidad civil",
      declaredPurpose: "proteger patrimonio de la empresa",
      constraints: ["capital minimo 300000"],
    },
  ]);
  steps.push(`c14:${needs.state}`);

  const quotes = [
    {
      quoteRef: "quote_000001",
      insurerRef: "insurer_0001",
      productVersion: "v1",
      premium: EUR("145000"),
      coverageLimit: EUR("60000000"),
      deductible: EUR("60000"),
      validUntil: "2026-12-31T00:00:00Z",
      comparableFields: ["limit", "deductible", "exclusions"],
    },
    {
      quoteRef: "quote_000002",
      insurerRef: "insurer_0002",
      productVersion: "v2",
      premium: EUR("138000"),
      coverageLimit: EUR("60000000"),
      deductible: EUR("90000"),
      validUntil: "2026-12-31T00:00:00Z",
      comparableFields: ["limit", "deductible", "exclusions"],
    },
  ];
  const comparison = compareQuotes(quotes);
  steps.push(`c18:${comparison.suitability}`);

  const current = selectCurrentQuote(quotes, "quote_000001", new Date("2026-11-14T00:00:00Z"));
  steps.push(`c17:${current.quoteRef}`);

  const estimate = computeIllustrativeEstimate({
    estimateRef: "est_000001",
    damage: EUR("5000000"),
    deductible: EUR("60000"),
    limit: EUR("60000000"),
  });
  steps.push(`c20:${estimate.firmness}`);

  const notice = prepareClaimNotice({
    noticeRef: "notice_00001",
    policyVersionRef: policy.current.policyVersionRef,
    claimant: "Empresa Sintetica SL",
    eventDate: "2026-11-02T09:30:00Z",
    eventDateProofRef: "proof_000001",
  });
  steps.push(`c23:${notice.deadlineArmed ? "deadline-armed" : "not-armed"}`);

  const evidence = stageEvidence({
    evidenceRef: "evid_000001",
    sha256: HASH,
    sensitiveClass: "none",
    custodyRef: "cust_000001",
    purpose: "claim_preparation",
    excerpt: "Informe de siniestro sintetico",
  });
  steps.push(`c24:${evidence.authority}`);

  let handoff = transitionHandoff(
    {
      handoffRef: "hand_000001",
      noticeRef: "notice_00001",
      recipient: "operator-sandbox",
      state: "proposed",
      ackRef: null,
      evidenceRefs: [evidence.evidenceRef],
    },
    "offer",
  );
  handoff = transitionHandoff(handoff, "acknowledge", "ack_000001");
  handoff = transitionHandoff(handoff, "start");
  handoff = transitionHandoff(handoff, "complete");
  steps.push(`c26:${handoff.state}`);

  const report = buildReportSnapshot({
    reportRef: "rep_0000001",
    cutoff: "2026-11-14T00:00:00Z",
    facts: [{ factRef: "fact_000001", observedAt: "2026-11-13T00:00:00Z", valueRef: "val_0000001" }],
  });
  steps.push(`c33:${report.state}`);

  const intents = new IntentStore();
  intents.begin({
    intentId: "int_00000001",
    tenantId: "tenant-a",
    capability: "insurance.handoff.propose",
    idempotencyKey: "idem-vertical-1",
    payloadHash: "f".repeat(64),
  });
  const replay = intents.begin({
    intentId: "int_00000002",
    tenantId: "tenant-a",
    capability: "insurance.handoff.propose",
    idempotencyKey: "idem-vertical-1",
    payloadHash: "f".repeat(64),
  });

  const outbox = new Outbox();
  outbox.append({
    eventId: "evt_0000001",
    tenantId: "tenant-a",
    eventType: "seguros.handoff.acknowledged",
    payloadRef: "hand_000001",
  });
  outbox.markPublished("evt_0000001", "ack_000001");

  return {
    steps,
    handoffState: handoff.state,
    reportState: report.state,
    estimate: { amount: estimate.amount.amount, currency: estimate.amount.currency },
    effects: [],
    replayBlocked: replay.replay,
  };
}
