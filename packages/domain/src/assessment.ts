import { z } from "zod";
import { ServiceError, opaqueIdSchema } from "@agntia/contracts";

/**
 * C09 — Service role assessment.
 * Constructive decision: this service is middleware. Unless a regulated role
 * with a proof of authorisation is declared, the state is
 * `authorization_pending`. Calling the product "software" or "middleware" never
 * grants distribution rights.
 */
export const serviceRoleSchema = z.enum(["assistant", "broker_support", "regulated_broker", "insurer_operator"]);

export const roleAssessmentSchema = z.strictObject({
  assessmentRef: opaqueIdSchema,
  serviceRole: serviceRoleSchema,
  territory: z.string().length(2),
  productLine: z.string().min(2).max(64),
  authorizationProof: opaqueIdSchema.nullable(),
});

export interface RoleAssessmentResult {
  readonly assessmentRef: string;
  readonly state: "authorization_pending" | "prepared";
  readonly limitations: readonly string[];
  readonly actsAllowed: readonly string[];
}

const REGULATED = new Set<string>(["regulated_broker", "insurer_operator"]);

export function assessServiceRole(input: unknown): RoleAssessmentResult {
  const parsed = roleAssessmentSchema.parse(input);
  if (REGULATED.has(parsed.serviceRole)) {
    if (parsed.authorizationProof === null) {
      throw new ServiceError("UNPROCESSABLE", "regulated role declared without authorization proof");
    }
    return {
      assessmentRef: parsed.assessmentRef,
      state: "prepared",
      limitations: [],
      actsAllowed: ["insurance.handoff.propose", "insurance.decision.record"],
    };
  }
  return {
    assessmentRef: parsed.assessmentRef,
    state: "authorization_pending",
    limitations: [
      "middleware does not carry a distribution licence",
      "binding, premium collection and claim settlement stay with the authorized operator",
    ],
    actsAllowed: [],
  };
}

/**
 * C10 — Representation and recipients.
 * Policyholder, insured, beneficiary and claimant are different parties. A
 * claimant does not inherit document access from being named in a claim.
 */
export const partyRoleSchema = z.enum(["policyholder", "insured", "beneficiary", "claimant", "third_party"]);

export const customerAuthoritySchema = z.strictObject({
  authorityRef: opaqueIdSchema,
  policyRef: opaqueIdSchema,
  partyId: opaqueIdSchema,
  partyRole: partyRoleSchema,
  represents: z.array(opaqueIdSchema).max(20),
  sharingScope: z.enum(["self", "company", "none"]),
  evidenceRef: opaqueIdSchema.nullable(),
});

export type CustomerAuthority = z.infer<typeof customerAuthoritySchema>;

export function canReadPrivateDocument(
  authority: CustomerAuthority | null,
  documentOwnerPartyId: string,
): boolean {
  if (!authority) return false;
  if (authority.sharingScope === "none") return false;
  if (authority.partyId === documentOwnerPartyId) return true;
  if (authority.evidenceRef === null) return false;
  return authority.represents.includes(documentOwnerPartyId);
}

/**
 * C11 — Risk declaration.
 * Facts without a source are not facts. Health or vulnerability is never
 * inferred: an absent field stays absent and the declaration stays incomplete.
 */
export const riskFieldSchema = z.enum([
  "activity",
  "revenue",
  "employees",
  "locations",
  "assets",
  "prior_claims",
  "occupancy",
  "health_status",
]);

export const declaredFactSchema = z.strictObject({
  factRef: opaqueIdSchema,
  field: riskFieldSchema,
  value: z.union([z.string().max(200), z.number(), z.boolean()]),
  status: z.enum(["declared", "verified"]),
  sourceRef: opaqueIdSchema.nullable(),
});

export const RISK_REQUIRED_FIELDS = ["activity", "revenue", "employees", "locations"] as const;

export interface RiskDeclarationResult {
  readonly state: "collecting_facts" | "prepared";
  readonly missing: readonly string[];
  readonly unsourced: readonly string[];
  /** Deliberately always empty: no attribute is inferred. */
  readonly inferred: readonly string[];
}

export function buildRiskDeclaration(input: unknown): RiskDeclarationResult {
  const facts = z.array(declaredFactSchema).parse(input);
  const sourced = new Set(facts.filter((fact) => fact.sourceRef !== null).map((fact) => fact.field));
  const missing = RISK_REQUIRED_FIELDS.filter((field) => !sourced.has(field));
  const unsourced = facts.filter((fact) => fact.sourceRef === null).map((fact) => fact.field);
  return {
    state: missing.length === 0 ? "prepared" : "collecting_facts",
    missing,
    unsourced,
    inferred: [],
  };
}
