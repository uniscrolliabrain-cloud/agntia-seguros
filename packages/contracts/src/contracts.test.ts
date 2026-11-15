import { describe, expect, it } from "vitest";
import {
  addMoney,
  approvalBindingSchema,
  assertApprovalValid,
  assertEstimateAdmissible,
  assertProjectionIsNotBinding,
  canonicalJson,
  compareMoney,
  envelopeSchema,
  formatMoney,
  hashPayload,
  moneySchema,
  parseAuthorityMap,
  recordExternalDecision,
  resolveExecutor,
} from "./index";

const sha = (input: string): string => {
  // Deterministic stub for contract tests; the API supplies node:crypto.
  let hash = 0n;
  for (const char of input) hash = (hash * 31n + BigInt(char.codePointAt(0) ?? 0)) % (2n ** 256n);
  return hash.toString(16).padStart(64, "0");
};

describe("money", () => {
  it("represents minor units exactly and formats without floats", () => {
    const value = moneySchema.parse({ amount: "123456", currency: "EUR", exponent: 2 });
    expect(formatMoney(value)).toBe("1234.56 EUR");
    expect(formatMoney({ amount: "-5", currency: "EUR", exponent: 2 })).toBe("-0.05 EUR");
    expect(formatMoney({ amount: "7", currency: "JPY", exponent: 0 })).toBe("7 JPY");
  });

  it("rejects floats, exponents and non-integers", () => {
    expect(moneySchema.safeParse({ amount: 12.34, currency: "EUR", exponent: 2 }).success).toBe(false);
    expect(moneySchema.safeParse({ amount: "1.5", currency: "EUR", exponent: 2 }).success).toBe(false);
    expect(moneySchema.safeParse({ amount: "1e3", currency: "EUR", exponent: 2 }).success).toBe(false);
    expect(moneySchema.safeParse({ amount: "001", currency: "EUR", exponent: 2 }).success).toBe(false);
    expect(moneySchema.safeParse({ amount: "10", currency: "eur", exponent: 2 }).success).toBe(false);
    expect(moneySchema.safeParse({ amount: "10", currency: "EUR", exponent: 9 }).success).toBe(false);
  });

  it("adds and compares only within one denomination", () => {
    const a = { amount: "1000", currency: "EUR", exponent: 2 };
    const b = { amount: "250", currency: "EUR", exponent: 2 };
    expect(addMoney(a, b)).toEqual({ amount: "1250", currency: "EUR", exponent: 2 });
    expect(compareMoney(a, b)).toBe(1);
    expect(() => addMoney(a, { amount: "1", currency: "USD", exponent: 2 })).toThrow(/currency mismatch/);
  });
});

describe("canonical json", () => {
  it("is stable across key order and drops undefined members", () => {
    expect(canonicalJson({ b: 1, a: [2, { d: 3, c: 4 }] })).toBe('{"a":[2,{"c":4,"d":3}],"b":1}');
    expect(canonicalJson({ a: 1, b: undefined })).toBe(canonicalJson({ a: 1 }));
  });

  it("changes the payload hash when any material field changes", () => {
    const before = hashPayload({ amount: "1000", currency: "EUR" }, sha);
    const after = hashPayload({ amount: "1001", currency: "EUR" }, sha);
    expect(before).toMatch(/^[a-f0-9]{64}$/);
    expect(before).not.toBe(after);
  });

  it("rejects values it cannot hash deterministically", () => {
    expect(() => canonicalJson({ a: Number.NaN })).toThrow(/non-finite/);
    expect(() => canonicalJson({ a: () => 1 })).toThrow(/rejects function/);
    const cyclic: Record<string, unknown> = {};
    cyclic["self"] = cyclic;
    expect(() => canonicalJson(cyclic)).toThrow(/cyclic/);
  });
});

describe("envelope", () => {
  const base = {
    schemaVersion: 1,
    operationId: "op_preview_0001",
    tenantId: "tenant-a",
    actorId: "user-a",
    capability: "insurance.proposal.preview",
    correlationId: "corr-1",
    idempotencyKey: "idem-key-0001",
    dryRun: true,
    payload: {},
  };

  it("accepts a strict envelope and fills optional defaults", () => {
    const parsed = envelopeSchema.parse(base);
    expect(parsed.requestId).toBeNull();
    expect(parsed.expectedVersion).toBeNull();
    expect(parsed.approvalRef).toBeNull();
  });

  it("rejects unknown fields and non-dry-run operations", () => {
    expect(envelopeSchema.safeParse({ ...base, privileged: true }).success).toBe(false);
    expect(envelopeSchema.safeParse({ ...base, dryRun: false }).success).toBe(false);
    expect(envelopeSchema.safeParse({ ...base, schemaVersion: 2 }).success).toBe(false);
  });
});

describe("authority map", () => {
  it("rejects two executors for the same effect", () => {
    expect(() =>
      parseAuthorityMap([
        { effect: "policy.bind", custodian: "seguros", executor: "insurer-api", approvedBy: "founder" },
        { effect: "policy.bind", custodian: "seguros", executor: "broker-portal", approvedBy: "founder" },
      ]),
    ).toThrow(/more than one executor/);
  });

  it("denies an effect with no authority entry", () => {
    const map = parseAuthorityMap([
      { effect: "policy.read", custodian: "seguros", executor: "seguros", approvedBy: "founder" },
    ]);
    expect(resolveExecutor(map, "policy.read").executor).toBe("seguros");
    expect(() => resolveExecutor(map, "claim.settle")).toThrow(/no authority entry/);
  });
});

describe("approval binding", () => {
  const payloadHash = hashPayload({ amount: "1000" }, sha);
  const approval = approvalBindingSchema.parse({
    approvalRef: "apr_00000001",
    tenantId: "tenant-a",
    capability: "insurance.claim.prepare",
    principalId: "user-a",
    reviewerId: "reviewer-1",
    reviewerCompetence: "regulated-broker",
    payloadHash,
    resourceVersion: 3,
    recipient: "operator-sandbox",
    channel: "ui",
    issuedAt: "2026-11-14T10:00:00Z",
    expiresAt: "2026-11-14T12:00:00Z",
    revocationVersion: 0,
  });

  const expected = {
    tenantId: "tenant-a",
    capability: "insurance.claim.prepare",
    payloadHash,
    resourceVersion: 3,
    recipient: "operator-sandbox",
    now: new Date("2026-11-14T11:00:00Z"),
    revocationVersion: 0,
  };

  it("accepts an exact, current, competent approval", () => {
    expect(() => assertApprovalValid(approval, expected)).not.toThrow();
  });

  it.each([
    ["payload changed", { payloadHash: hashPayload({ amount: "1001" }, sha) }],
    ["resource version moved", { resourceVersion: 4 }],
    ["other tenant", { tenantId: "tenant-b" }],
    ["other capability", { capability: "insurance.policy.read" }],
    ["recipient changed", { recipient: "real-operator" }],
  ])("rejects when %s", (_label, override) => {
    expect(() => assertApprovalValid(approval, { ...expected, ...override })).toThrow(/approval/);
  });

  it("rejects an expired or revoked approval", () => {
    expect(() => assertApprovalValid(approval, { ...expected, now: new Date("2026-11-14T12:00:00Z") })).toThrow(
      /expired/,
    );
    expect(() => assertApprovalValid(approval, { ...expected, revocationVersion: 1 })).toThrow(/revoked/);
  });

  it("rejects an approval with no established competence", () => {
    expect(() =>
      assertApprovalValid({ ...approval, reviewerCompetence: "a" }, expected),
    ).toThrow(/competence/);
  });
});

describe("domain guards", () => {
  it("estimates are never firm and never admissible with missing inputs", () => {
    const estimate = {
      estimateRef: "est_00000001",
      amount: { amount: "100000", currency: "EUR", exponent: 2 },
      deductible: { amount: "50000", currency: "EUR", exponent: 2 },
      limit: null,
      firmness: "illustrative_only" as const,
      reviewedInputs: true,
      missingInputs: [] as string[],
    };
    expect(() => assertEstimateAdmissible(estimate)).not.toThrow();
    expect(() => assertEstimateAdmissible({ ...estimate, missingInputs: ["deductible"] })).toThrow(/missing inputs/);
    expect(() => assertEstimateAdmissible({ ...estimate, reviewedInputs: false })).toThrow(/not reviewed/);
  });

  it("projections with unknown particular conditions are not binding", () => {
    const projection = {
      policyVersionRef: "pver_0000001",
      sourceDocumentHash: "a".repeat(64),
      effectiveFrom: "2026-01-01T00:00:00Z",
      effectiveTo: null,
      generalConditions: [],
      particularConditions: [
        { clauseRef: "clause_00001", statement: "Franquicia", page: 3, evidenceRef: null, status: "unknown" as const },
      ],
      endorsements: [],
      state: "prepared" as const,
    };
    expect(() => assertProjectionIsNotBinding(projection)).toThrow(/unresolved particular conditions/);
  });

  it("an external decision cannot be verified without operator proof", () => {
    const decision = {
      decisionRef: "dec_00000001",
      sourceAuthority: "insurer-sandbox",
      adverse: true,
      reason: "Documentation incomplete",
      appealInfo: null,
      receivedAt: "2026-11-14T10:00:00Z",
      proofRef: null,
    };
    expect(() => recordExternalDecision(decision)).toThrow(/operator proof/);
    expect(recordExternalDecision({ ...decision, proofRef: "proof_000001" }).verified).toBe(true);
  });
});
