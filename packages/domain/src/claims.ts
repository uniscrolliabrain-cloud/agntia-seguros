import { z } from "zod";
import {
  ServiceError,
  isoInstantSchema,
  opaqueIdSchema,
  sha256HexSchema,
} from "@agntia/contracts";

/**
 * C23 — Claim intake.
 * A prepared notice is neither accepted nor submitted. A doubtful event date
 * does not arm a deadline.
 */
export const claimNoticeDraftSchema = z.strictObject({
  noticeRef: opaqueIdSchema,
  policyVersionRef: opaqueIdSchema,
  claimant: z.string().min(2).max(120),
  eventDate: isoInstantSchema.nullable(),
  eventDateProofRef: opaqueIdSchema.nullable(),
});

export interface ClaimNoticePreparation {
  readonly noticeRef: string;
  readonly state: "collecting_facts" | "prepared";
  readonly deadlineArmed: boolean;
  readonly submission: "not_submitted";
  readonly missing: readonly string[];
}

export function prepareClaimNotice(input: unknown): ClaimNoticePreparation {
  const parsed = claimNoticeDraftSchema.parse(input);
  const missing: string[] = [];
  if (parsed.eventDate === null) missing.push("eventDate");
  if (parsed.eventDateProofRef === null) missing.push("eventDateProof");
  return {
    noticeRef: parsed.noticeRef,
    state: missing.length === 0 ? "prepared" : "collecting_facts",
    deadlineArmed: missing.length === 0,
    submission: "not_submitted",
    missing,
  };
}

/**
 * C24 — Claim evidence.
 * Evidence is data with custody and provenance; it never carries authority. Any
 * effect whose authority is an evidence reference is refused.
 */
export const evidenceSchema = z.strictObject({
  evidenceRef: opaqueIdSchema,
  sha256: sha256HexSchema,
  sensitiveClass: z.enum(["none", "personal", "health", "financial"]),
  custodyRef: opaqueIdSchema,
  purpose: z.enum(["claim_preparation", "policy_review"]),
  /** Bounded excerpt for review; full documents stay in custody. */
  excerpt: z.string().max(2000).nullable(),
});

export const HUMAN_AUTHORITIES = ["human_reviewer", "regulated_operator", "insurer"] as const;

export function stageEvidence(input: unknown): {
  readonly evidenceRef: string;
  readonly modelVisible: false;
  readonly authority: "data_only";
  readonly excerptDropped: boolean;
} {
  const parsed = evidenceSchema.parse(input);
  return {
    evidenceRef: parsed.evidenceRef,
    modelVisible: false,
    authority: "data_only",
    excerptDropped: parsed.excerpt === null,
  };
}

/** Guards the invariant: only human/operator authority can authorise an effect. */
export function requireHumanAuthority(authorityKind: string): void {
  if (!(HUMAN_AUTHORITIES as readonly string[]).includes(authorityKind)) {
    throw new ServiceError("FORBIDDEN", "effect requires human or authorized operator authority", {
      details: { reason: "AUTHORITY_NOT_HUMAN", authorityKind },
    });
  }
}

/**
 * C25 — Reviewable decision chain.
 * If a dependency outcome is `unknown`, no downstream step may claim `applies`.
 * That is how a factual variant surfaces as an inconsistency instead of a
 * plausible but wrong amount.
 */
export const chainOutcomeSchema = z.enum(["applies", "not_applicable", "unknown", "needs_professional_review"]);

export const chainStepSchema = z.strictObject({
  stepRef: opaqueIdSchema,
  dependsOn: z.array(opaqueIdSchema).max(20),
  outcome: chainOutcomeSchema,
});

export interface DecisionChainResult {
  readonly consistent: boolean;
  readonly inconsistentRefs: readonly string[];
}

export function evaluateDecisionChain(input: unknown): DecisionChainResult {
  const steps = z.array(chainStepSchema).min(1).parse(input);
  const outcomes = new Map(steps.map((step) => [step.stepRef, step.outcome]));
  const inconsistentRefs = steps
    .filter(
      (step) =>
        step.outcome === "applies" &&
        step.dependsOn.some((dependency) => {
          const outcome = outcomes.get(dependency);
          return outcome === "unknown" || outcome === "needs_professional_review";
        }),
    )
    .map((step) => step.stepRef);
  return { consistent: inconsistentRefs.length === 0, inconsistentRefs };
}
