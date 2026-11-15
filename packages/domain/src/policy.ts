import { z } from "zod";
import {
  ServiceError,
  isoInstantSchema,
  moneySchema,
  opaqueIdSchema,
  sha256HexSchema,
  type Money,
} from "@agntia/contracts";

/**
 * C12 — Policy custody and endorsements.
 * The original document and the temporal hierarchy are never overwritten: a new
 * endorsement creates a newer version and marks the projections it supersedes
 * as stale. Out-of-order endorsements are a conflict, not a silent overwrite.
 */
export const endorsementSchema = z.strictObject({
  endorsementRef: opaqueIdSchema,
  effectiveAt: isoInstantSchema,
  order: z.number().int().min(1),
  supersedes: z.array(opaqueIdSchema).max(20),
});

export type Endorsement = z.infer<typeof endorsementSchema>;

export const policyVersionSchema = z.strictObject({
  policyVersionRef: opaqueIdSchema,
  policyRef: opaqueIdSchema,
  sourceDocumentHash: sha256HexSchema,
  effectiveFrom: isoInstantSchema,
  effectiveTo: isoInstantSchema.nullable(),
  endorsements: z.array(endorsementSchema),
});

export type PolicyVersion = z.infer<typeof policyVersionSchema>;

export interface EndorsementResult {
  readonly current: PolicyVersion;
  readonly staleRefs: readonly string[];
  readonly revision: number;
}

export function applyEndorsement(input: unknown, endorsementInput: unknown): EndorsementResult {
  const current = policyVersionSchema.parse(input);
  const endorsement = endorsementSchema.parse(endorsementInput);
  const highestOrder = current.endorsements.reduce((max, item) => Math.max(max, item.order), 0);
  if (endorsement.order <= highestOrder) {
    throw new ServiceError("CONFLICT", "endorsement order is not monotonic", {
      details: { order: endorsement.order, highestOrder },
    });
  }
  const known = new Set(current.endorsements.map((item) => item.endorsementRef));
  for (const superseded of endorsement.supersedes) {
    if (superseded !== current.policyVersionRef && !known.has(superseded)) {
      throw new ServiceError("CONFLICT", "endorsement supersedes an unknown element", {
        details: { superseded },
      });
    }
  }
  return {
    current: { ...current, endorsements: [...current.endorsements, endorsement] },
    staleRefs: [...endorsement.supersedes],
    revision: current.endorsements.length + 1,
  };
}

/**
 * C13 — Extraction and clauses.
 * OCR/LLM extraction is a proposal. Low confidence on a money-relevant clause
 * requires competent review and blocks estimates built on it.
 */
export const clauseKindSchema = z.enum(["deductible", "limit", "exclusion", "precedence", "period"]);

export const extractedClauseSchema = z.strictObject({
  clauseRef: opaqueIdSchema,
  textHash: sha256HexSchema,
  confidence: z.number().min(0).max(1),
  kind: clauseKindSchema,
});

export type ExtractedClause = z.infer<typeof extractedClauseSchema>;

export interface ExtractionReview {
  readonly status: "needs_review" | "accepted";
  readonly needsReview: readonly string[];
}

const MONEY_RELEVANT: ReadonlySet<string> = new Set(["deductible", "limit", "exclusion"]);

export function reviewExtraction(input: unknown, threshold = 0.95): ExtractionReview {
  const clauses = z.array(extractedClauseSchema).parse(input);
  const needsReview = clauses
    .filter((clause) => MONEY_RELEVANT.has(clause.kind) && clause.confidence < threshold)
    .map((clause) => clause.clauseRef);
  return { status: needsReview.length > 0 ? "needs_review" : "accepted", needsReview };
}

export function assertEstimateAllowed(input: unknown, threshold = 0.95): void {
  const review = reviewExtraction(input, threshold);
  if (review.status === "needs_review") {
    throw new ServiceError("UNPROCESSABLE", "estimate blocked by unreviewed clauses", {
      details: { reason: "CLAUSE_REVIEW_REQUIRED", clauses: review.needsReview },
    });
  }
}

/**
 * C15 — Coverage inventory.
 * A missing particular condition makes coverage `unknown`. It is never reported
 * as covered or not covered.
 */
export const coverageItemSchema = z.strictObject({
  coverageRef: opaqueIdSchema,
  peril: z.string().min(2).max(80),
  particularConditionRef: opaqueIdSchema.nullable(),
  limit: moneySchema.nullable(),
  exclusionRefs: z.array(opaqueIdSchema).max(50),
});

export interface CoverageInventory {
  readonly status: "identified" | "unknown";
  readonly unknownRefs: readonly string[];
  readonly items: readonly z.infer<typeof coverageItemSchema>[];
}

export function buildCoverageInventory(input: unknown): CoverageInventory {
  const items = z.array(coverageItemSchema).parse(input);
  const unknownRefs = items
    .filter((item) => item.particularConditionRef === null || item.limit === null)
    .map((item) => item.coverageRef);
  return { status: unknownRefs.length > 0 ? "unknown" : "identified", unknownRefs, items };
}

export function assertFirmCoverageConclusion(inventory: CoverageInventory): void {
  if (inventory.status === "unknown") {
    throw new ServiceError("UNPROCESSABLE", "coverage cannot be stated as definitive", {
      details: { reason: "COVERAGE_UNKNOWN", unknownRefs: inventory.unknownRefs },
    });
  }
}

export function sumLimits(items: readonly { limit: Money | null }[]): Money | null {
  const withLimit = items.flatMap((item) => (item.limit === null ? [] : [item.limit]));
  const first = withLimit[0];
  if (!first) return null;
  let total = BigInt(first.amount);
  for (const item of withLimit.slice(1)) {
    if (item.currency !== first.currency || item.exponent !== first.exponent) {
      throw new ServiceError("UNPROCESSABLE", "cannot sum limits in different denominations");
    }
    total += BigInt(item.amount);
  }
  return { amount: total.toString(), currency: first.currency, exponent: first.exponent };
}
