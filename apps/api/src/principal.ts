import { jwtVerify, type JWTVerifyGetKey } from "jose";
import { ServiceError } from "@agntia/contracts";

/**
 * Principal derivation (C03).
 *
 * A decoded JWT is not proof. Every request:
 *  1. verifies signature, issuer, audience, exp/nbf against a pinned key set,
 *  2. reads the tenant only from signed claims (`app_metadata.tenant_id` or the
 *     top-level `tenant_id`), never from `user_metadata` or the request body,
 *  3. requires a provisioned, active membership for exactly that tenant.
 *
 * There is no `owner`, `default` or first-membership fallback anywhere.
 */
export interface Membership {
  readonly tenantId: string;
  readonly roles: readonly string[];
  readonly scopes: readonly string[];
  readonly status: "active" | "suspended" | "revoked";
}

export interface MembershipResolver {
  resolve(userId: string, tenantId: string): Promise<Membership | null>;
}

export interface Principal {
  readonly userId: string;
  readonly tenantId: string;
  readonly roles: readonly string[];
  readonly scopes: readonly string[];
}

export interface AuthenticatorOptions {
  readonly issuer: string;
  readonly audience: string;
  readonly keys: JWTVerifyGetKey;
  readonly membership: MembershipResolver;
  readonly clockToleranceSeconds?: number;
}

const ALLOWED_ALGORITHMS = ["RS256", "ES256"] as const;

function readSignedTenant(payload: Record<string, unknown>): string | undefined {
  const appMetadata = payload["app_metadata"];
  if (appMetadata !== null && typeof appMetadata === "object") {
    const candidate = (appMetadata as Record<string, unknown>)["tenant_id"];
    if (typeof candidate === "string" && candidate.length > 0) return candidate;
  }
  const topLevel = payload["tenant_id"];
  if (typeof topLevel === "string" && topLevel.length > 0) return topLevel;
  return undefined;
}

export function createAuthenticator(options: AuthenticatorOptions) {
  return async function authenticate(authorizationHeader: string | undefined): Promise<Principal> {
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new ServiceError("UNAUTHENTICATED", "missing bearer token");
    }
    const token = authorizationHeader.slice("Bearer ".length).trim();
    if (token.length === 0) {
      throw new ServiceError("UNAUTHENTICATED", "empty bearer token");
    }

    let payload: Record<string, unknown>;
    try {
      const verified = await jwtVerify(token, options.keys, {
        issuer: options.issuer,
        audience: options.audience,
        algorithms: [...ALLOWED_ALGORITHMS],
        requiredClaims: ["sub", "exp", "iss", "aud"],
        clockTolerance: options.clockToleranceSeconds ?? 5,
      });
      payload = verified.payload as Record<string, unknown>;
    } catch {
      // No detail leak: wrong key, wrong alg, expired and forged all look the same.
      throw new ServiceError("UNAUTHENTICATED", "token verification failed");
    }

    const userId = typeof payload["sub"] === "string" ? payload["sub"] : "";
    if (userId.length === 0) {
      throw new ServiceError("UNAUTHENTICATED", "token subject missing");
    }

    const tenantId = readSignedTenant(payload);
    if (!tenantId) {
      throw new ServiceError("UNAUTHENTICATED", "signed tenant claim missing");
    }

    const membership = await options.membership.resolve(userId, tenantId);
    if (!membership) {
      throw new ServiceError("FORBIDDEN", "no provisioned membership for this tenant");
    }
    if (membership.status !== "active") {
      throw new ServiceError("FORBIDDEN", "membership is not active");
    }
    if (membership.tenantId !== tenantId) {
      throw new ServiceError("FORBIDDEN", "membership tenant does not match token scope");
    }

    return {
      userId,
      tenantId,
      roles: membership.roles,
      scopes: membership.scopes,
    };
  };
}
