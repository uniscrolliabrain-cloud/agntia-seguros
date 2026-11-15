import { z } from "zod";
import { ServiceError } from "./errors";
import { domainStateSchema } from "./envelope";
import { isoInstantSchema, opaqueIdSchema, sha256HexSchema } from "./ids";
import { moneySchema } from "./money";

/**
 * Domain contracts. Each conclusion carries its clause, its evidence and its
 * epistemic status. `unknown` is a first-class value: a missing particular
 * condition blocks a firm conclusion instead of being filled by a model.
 */
export const conclusionStatusSchema = z.enum(["supported", "unknown", "conflicting"]);

export const clauseConclusionSchema = z.strictObject({
  clauseRef: opaqueIdSchema,
  statement: z.string().min(1).max(4000),
  page: z.number().int().positive().nullable().default(null),
  evidenceRef: opaqueIdSchema.nullable().default(null),
  status: conclusionStatusSchema,
});

export type ClauseConclusion = z.infer<typeof clauseConclusionSchema>;

export const endorsementSchema = z.strictObject({
  endorsementRef: opaqueIdSchema,
  effectiveAt: isoInstantSchema,
  /** Monotonic order within the policy; used to detect precedence conflicts. */
  order: z.number().int().min(1),
  supersedes: z.array(opaqueIdSchema).max(50),
});

export const policyProjectionSchema = z.strictObject({
  policyVersionRef: opaqueIdSchema,
  sourceDocumentHash: sha256HexSchema,
  effectiveFrom: isoInstantSchema,
  effectiveTo: isoInstantSchema.nullable().default(null),
  generalConditions: z.array(clauseConclusionSchema),
  particularConditions: z.array(clauseConclusionSchema),
  endorsements: z.array(endorsementSchema),
  state: domainStateSchema,
});

export type PolicyProjection = z.infer<typeof policyProjectionSchema>;

/** A projection may never be presented as binding in-force coverage. */
export function assertProjectionIsNotBinding(projection: PolicyProjection): void {
  if (projection.state === "externally_decided" || projection.state === "closed") {
    return;
  }
  if (projection.particularConditions.some((condition) => condition.status === "unknown")) {
    throw new ServiceError("UNPROCESSABLE", "projection has unresolved particular conditions", {
      details: { reason: "COVERAGE_UNKNOWN" },
    });
  }
}

export const ruleOutcomeSchema = z.enum(["applies", "not_applicable", "unknown", "needs_professional_review"]);

export const atomicRuleSchema = z.strictObject({
  ruleRef: opaqueIdSchema,
  outcome: ruleOutcomeSchema,
  appliesTo: z.string().min(2).max(120),
});

export const ruleEvaluationSchema = z.strictObject({
  ruleId: opaqueIdSchema,
  ruleVersion: z.number().int().min(1),
  compositionVersion: z.string().min(1).max(32),
  factsHash: sha256HexSchema,
  atomicRules: z.array(atomicRuleSchema).min(1),
  illustrative: z.literal(true),
  evaluatedAt: isoInstantSchema,
});

export type RuleEvaluation = z.infer<typeof ruleEvaluationSchema>;

/** A local evaluation is never binding: the network/operator decides. */
export function assertRuleEvaluationIsIllustrative(evaluation: RuleEvaluation): void {
  if (evaluation.illustrative !== true) {
    throw new ServiceError("UNPROCESSABLE", "rule evaluation must be illustrative");
  }
  if (evaluation.atomicRules.length === 0) {
    throw new ServiceError("UNPROCESSABLE", "rule evaluation has no atomic rules");
  }
}

export const estimateSchema = z.strictObject({
  estimateRef: opaqueIdSchema,
  amount: moneySchema,
  deductible: moneySchema.nullable().default(null),
  limit: moneySchema.nullable().default(null),
  /** Firm numbers are never produced locally. */
  firmness: z.literal("illustrative_only"),
  reviewedInputs: z.boolean(),
  missingInputs: z.array(z.string().min(1).max(80)).max(50),
});

export type Estimate = z.infer<typeof estimateSchema>;

export function assertEstimateAdmissible(estimate: Estimate): void {
  if (estimate.missingInputs.length > 0) {
    throw new ServiceError("UNPROCESSABLE", "estimate blocked by missing inputs", {
      details: { reason: "ESTIMATE_INPUTS_MISSING", missing: estimate.missingInputs },
    });
  }
  if (!estimate.reviewedInputs) {
    throw new ServiceError("UNPROCESSABLE", "estimate inputs were not reviewed", {
      details: { reason: "ESTIMATE_INPUTS_UNREVIEWED" },
    });
  }
}

/**
 * Decisions are recorded, not produced. `verified` can only become true from
 * operator proof; a model majority never sets it.
 */
export const externalDecisionInputSchema = z.strictObject({
  decisionRef: opaqueIdSchema,
  sourceAuthority: z.string().min(3).max(120),
  adverse: z.boolean(),
  reason: z.string().min(1).max(2000),
  appealInfo: z.string().min(1).max(2000).nullable().default(null),
  receivedAt: isoInstantSchema,
  proofRef: opaqueIdSchema.nullable().default(null),
});

export const externalDecisionSchema = externalDecisionInputSchema.extend({
  verified: z.boolean(),
});

export type ExternalDecision = z.infer<typeof externalDecisionSchema>;

export function recordExternalDecision(input: unknown): ExternalDecision {
  const parsed = externalDecisionInputSchema.parse(input);
  if (parsed.proofRef === null) {
    throw new ServiceError("UNPROCESSABLE", "external decision requires operator proof", {
      details: { reason: "DECISION_UNVERIFIED" },
    });
  }
  return { ...parsed, verified: true };
}
