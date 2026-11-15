import { z } from "zod";
import { capabilitySchema, opaqueIdSchema } from "./ids";

/**
 * Operation envelope (docs/contracts/01-contratos.md).
 *
 * IMPORTANT: `tenantId` and `actorId` here are *claims about scope*, never proof.
 * The server resolves the principal from a verified Supabase JWT and rejects any
 * envelope whose scope does not match it. `user_metadata` and model output are
 * never consulted.
 */
export const envelopeSchema = z.strictObject({
  schemaVersion: z.literal(1),
  operationId: opaqueIdSchema,
  tenantId: z.string().min(1).max(64),
  actorId: z.string().min(1).max(64),
  capability: capabilitySchema,
  requestId: z.string().min(1).max(128).nullable().default(null),
  correlationId: z.string().min(1).max(128),
  causationId: z.string().min(1).max(128).nullable().default(null),
  idempotencyKey: z.string().min(8).max(128),
  expectedVersion: z.number().int().min(0).nullable().default(null),
  approvalRef: opaqueIdSchema.nullable().default(null),
  dryRun: z.literal(true),
  payload: z.record(z.string(), z.unknown()),
});

export type Envelope = z.infer<typeof envelopeSchema>;

/** Operation states are distinct from domain states (no shared enum). */
export const operationStateSchema = z.enum([
  "proposed",
  "needs_review",
  "approved",
  "queued",
  "running",
  "accepted",
  "confirmed",
  "failed_definitive",
  "outcome_unknown",
  "reconciliation_required",
  "cancelled",
]);

export const domainStateSchema = z.enum([
  "intake",
  "authorization_pending",
  "collecting_facts",
  "incomplete",
  "prepared",
  "professional_review",
  "submitted_by_authorized_operator",
  "acknowledged",
  "decision_pending",
  "externally_decided",
  "closed",
  "disputed",
]);

export type DomainState = z.infer<typeof domainStateSchema>;
