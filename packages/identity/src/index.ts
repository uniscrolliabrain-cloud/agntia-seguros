import { z } from "zod";
import { ServiceError, capabilitySchema, isoInstantSchema, opaqueIdSchema } from "@agntia/contracts";

/**
 * C04 — Scoped twin binding.
 * The canonical agent lives in the parent. This service only stores a binding
 * that references it, with a bounded mandate. Nothing here creates a new
 * canonical identity, and an expired or revoked mandate blocks new effects.
 */
export const twinBindingSchema = z.strictObject({
  twinBindingRef: opaqueIdSchema,
  tenantId: z.string().min(1).max(64),
  canonicalAgentRef: opaqueIdSchema,
  canonicalRevision: z.string().min(1).max(80),
  localInstanceRef: opaqueIdSchema,
  workOrderRef: opaqueIdSchema,
  capabilities: z.array(capabilitySchema).min(1).max(50),
  purpose: z.string().min(3).max(160),
  budgetRef: opaqueIdSchema.nullable(),
  issuedAt: isoInstantSchema,
  expiresAt: isoInstantSchema,
  revocationVersion: z.number().int().min(0),
  proofRef: opaqueIdSchema,
});

export type TwinBinding = z.infer<typeof twinBindingSchema>;

export interface MandateCheck {
  readonly capability: string;
  readonly tenantId: string;
  readonly now: Date;
  readonly revocationVersion: number;
}

export function assertTwinMandate(input: unknown, check: MandateCheck): TwinBinding {
  const binding = twinBindingSchema.parse(input);
  if (binding.tenantId !== check.tenantId) {
    throw new ServiceError("FORBIDDEN", "twin mandate belongs to another tenant", {
      details: { reason: "MANDATE_TENANT_MISMATCH" },
    });
  }
  const expiresAt = Date.parse(binding.expiresAt);
  if (!Number.isFinite(expiresAt) || check.now.getTime() >= expiresAt) {
    throw new ServiceError("FORBIDDEN", "twin mandate expired", { details: { reason: "MANDATE_EXPIRED" } });
  }
  if (check.revocationVersion > binding.revocationVersion) {
    throw new ServiceError("FORBIDDEN", "twin mandate revoked", { details: { reason: "MANDATE_REVOKED" } });
  }
  if (!binding.capabilities.includes(check.capability)) {
    throw new ServiceError("FORBIDDEN", "capability is outside the twin mandate", {
      details: { reason: "MANDATE_CAPABILITY_MISSING", capability: check.capability },
    });
  }
  return binding;
}

/**
 * C36 — Host bridge.
 * Reading canonical identity from the parent would require a verified port; it
 * is not available in this repository and must never be faked. The stub reports
 * `HOST_BRIDGE_NOT_VERIFIED` and every caller fails closed.
 */
export interface CanonicalIdentity {
  readonly runtimeId: string;
  readonly roleId: string | null;
  readonly personaId: string | null;
  readonly revision: string;
}

export interface HostBridge {
  resolveCanonicalIdentity(canonicalAgentRef: string): Promise<CanonicalIdentity | null>;
  emitEvent(event: unknown): Promise<{ readonly acked: boolean; readonly reason: string }>;
}

export class UnavailableHostBridge implements HostBridge {
  async resolveCanonicalIdentity(_canonicalAgentRef: string): Promise<CanonicalIdentity | null> {
    return null;
  }

  async emitEvent(_event: unknown): Promise<{ readonly acked: boolean; readonly reason: string }> {
    return { acked: false, reason: "HOST_BRIDGE_NOT_VERIFIED" };
  }
}

export function requireCanonicalIdentity(identity: CanonicalIdentity | null): CanonicalIdentity {
  if (identity === null) {
    throw new ServiceError("UPSTREAM_INVALID", "canonical identity could not be resolved", {
      details: { reason: "HOST_BRIDGE_NOT_VERIFIED" },
    });
  }
  return identity;
}

/** A bridge that has not acknowledged an event has not delivered it. */
export function assertEventAcknowledged(result: { readonly acked: boolean; readonly reason: string }): void {
  if (!result.acked) {
    throw new ServiceError("UNPROCESSABLE", "event was not acknowledged by the host", {
      details: { reason: result.reason },
    });
  }
}
