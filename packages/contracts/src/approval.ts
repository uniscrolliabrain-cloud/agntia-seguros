import { z } from "zod";
import { ServiceError } from "./errors";
import { capabilitySchema, isoInstantSchema, opaqueIdSchema, sha256HexSchema } from "./ids";
import { moneySchema } from "./money";

/**
 * ApprovalBinding: the reviewer authorises one exact effect, not a category.
 * Any material change (payload, tenant, capability, version, recipient, cost)
 * invalidates it. Revocation and expiry are checked before every effect.
 */
export const approvalBindingSchema = z
  .strictObject({
    approvalRef: opaqueIdSchema,
    tenantId: z.string().min(1).max(64),
    capability: capabilitySchema,
    principalId: z.string().min(1).max(64),
    reviewerId: z.string().min(1).max(64),
    /** Professional competence claimed for this decision (e.g. `regulated-broker`). */
    reviewerCompetence: z.string().min(3).max(64),
    payloadHash: sha256HexSchema,
    resourceVersion: z.number().int().min(0),
    rightsHash: sha256HexSchema.nullable().default(null),
    policyHash: sha256HexSchema.nullable().default(null),
    recipient: z.string().min(1).max(128),
    channel: z.enum(["ui", "api", "portal", "email"]),
    costCeiling: moneySchema.nullable().default(null),
    issuedAt: isoInstantSchema,
    expiresAt: isoInstantSchema,
    revocationVersion: z.number().int().min(0),
  });

export type ApprovalBinding = z.infer<typeof approvalBindingSchema>;

export type ApprovalExpectation = {
  readonly tenantId: string;
  readonly capability: string;
  readonly payloadHash: string;
  readonly resourceVersion: number;
  readonly recipient: string;
  readonly now: Date;
  readonly revocationVersion: number;
};

function reject(reason: string, message: string, details: Record<string, unknown>): never {
  throw new ServiceError("CONFLICT", message, { details: { reason, ...details } });
}

export function assertApprovalValid(approval: ApprovalBinding, expected: ApprovalExpectation): void {
  if (approval.reviewerCompetence.trim().length < 3) {
    throw new ServiceError("FORBIDDEN", "reviewer competence not established", {
      details: { reason: "APPROVAL_COMPETENCE_MISSING" },
    });
  }
  if (approval.tenantId !== expected.tenantId) {
    reject("APPROVAL_TENANT_MISMATCH", "approval was issued for another tenant", {
      approvalTenant: approval.tenantId,
    });
  }
  if (approval.capability !== expected.capability) {
    reject("APPROVAL_CAPABILITY_MISMATCH", "approval does not cover this capability", {
      approvalCapability: approval.capability,
    });
  }
  if (approval.payloadHash !== expected.payloadHash) {
    reject("APPROVAL_PAYLOAD_CHANGED", "payload changed after approval", {});
  }
  if (approval.resourceVersion !== expected.resourceVersion) {
    reject("APPROVAL_VERSION_STALE", "approval targets a stale resource version", {
      approvalVersion: approval.resourceVersion,
      currentVersion: expected.resourceVersion,
    });
  }
  if (approval.recipient !== expected.recipient) {
    reject("APPROVAL_RECIPIENT_CHANGED", "recipient changed after approval", {});
  }
  if (expected.revocationVersion > approval.revocationVersion) {
    reject("APPROVAL_REVOKED", "approval was revoked", {
      approvalRevocationVersion: approval.revocationVersion,
      currentRevocationVersion: expected.revocationVersion,
    });
  }
  const expiresAt = Date.parse(approval.expiresAt);
  if (!Number.isFinite(expiresAt)) {
    reject("APPROVAL_EXPIRED", "approval expiry is unreadable", {});
  }
  if (expected.now.getTime() >= expiresAt) {
    reject("APPROVAL_EXPIRED", "approval has expired", { expiresAt: approval.expiresAt });
  }
}
