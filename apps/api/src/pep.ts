import { ServiceError } from "@agntia/contracts";
import type { Principal } from "./principal";

/**
 * Named capability catalogue (C02/C35). Deny-by-default: anything absent here is
 * unknown and therefore forbidden. Side-effecting capabilities are declared but
 * *disabled* in the pilot; declaring them does not enable them.
 */
export const CAPABILITIES = {
  "insurance.policy.read": { sideEffects: false, enabled: true },
  "insurance.proposal.preview": { sideEffects: false, enabled: true },
  "insurance.claim.prepare": { sideEffects: false, enabled: true },
  "insurance.estimate.preview": { sideEffects: false, enabled: true },
  "insurance.intent.execute": { sideEffects: true, enabled: false },
} as const;

export type CapabilityName = keyof typeof CAPABILITIES;

export interface ResourceRef {
  readonly kind: string;
  readonly id: string;
}

/** Resource ACL is server-side and tenant-scoped; it is never read from the token. */
export interface AclStore {
  allows(principal: Principal, resource: ResourceRef): Promise<boolean>;
}

export interface AuthorizeInput {
  readonly principal: Principal;
  readonly capability: string;
  readonly resource: ResourceRef;
  readonly acl: AclStore;
}

export async function authorize(input: AuthorizeInput): Promise<void> {
  const spec = (CAPABILITIES as Record<string, { sideEffects: boolean; enabled: boolean } | undefined>)[
    input.capability
  ];
  if (!spec) {
    throw new ServiceError("FORBIDDEN", "unknown capability");
  }
  if (!spec.enabled) {
    throw new ServiceError("FORBIDDEN", "capability is declared but disabled in this deployment", {
      details: { capability: input.capability },
    });
  }
  if (!input.principal.scopes.includes(input.capability)) {
    throw new ServiceError("FORBIDDEN", "capability not granted to principal");
  }
  const allowed = await input.acl.allows(input.principal, input.resource);
  if (!allowed) {
    // 404, not 403: a foreign resource must not confirm its existence.
    throw new ServiceError("NOT_FOUND", "resource not found");
  }
}
