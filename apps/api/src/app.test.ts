import { describe, expect, it } from "vitest";
import { SignJWT, createLocalJWKSet, exportJWK, generateKeyPair } from "jose";
import { createApp } from "./app";
import { createAuthenticator, type MembershipResolver } from "./principal";
import type { AclStore } from "./pep";

const issuer = "https://project-ref.supabase.co/auth/v1";
const audience = "authenticated";

const { privateKey, publicKey } = await generateKeyPair("RS256");
const keys = createLocalJWKSet({ keys: [await exportJWK(publicKey)] });

const memberships: MembershipResolver = {
  resolve: async (userId, tenantId) => {
    if (userId !== "user-a" || tenantId !== "tenant-a") return null;
    return {
      tenantId: "tenant-a",
      roles: ["owner"],
      scopes: ["insurance.policy.read", "insurance.proposal.preview"],
      status: "active",
    };
  },
};

const limitedMemberships: MembershipResolver = {
  resolve: async (userId, tenantId) => {
    if (userId !== "user-a" || tenantId !== "tenant-a") return null;
    return { tenantId: "tenant-a", roles: ["viewer"], scopes: ["insurance.policy.read"], status: "active" };
  },
};

const acl: AclStore = {
  allows: async (principal, resource) => principal.tenantId === "tenant-a" && resource.id.startsWith("policy_a_"),
};

async function bearer(claims: Record<string, unknown> = { app_metadata: { tenant_id: "tenant-a" } }): Promise<string> {
  const token = await new SignJWT(claims)
    .setProtectedHeader({ alg: "RS256" })
    .setIssuer(issuer)
    .setAudience(audience)
    .setSubject("user-a")
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(privateKey);
  return `Bearer ${token}`;
}

function buildApp(resolver: MembershipResolver = memberships) {
  const authenticate = createAuthenticator({ issuer, audience, keys, membership: resolver });
  return createApp({ authenticate, acl });
}

const previewEnvelope = {
  schemaVersion: 1,
  operationId: "op_preview_0001",
  tenantId: "tenant-a",
  actorId: "user-a",
  capability: "insurance.proposal.preview",
  correlationId: "corr-1",
  idempotencyKey: "idem-key-0001",
  dryRun: true,
  payload: { resourceId: "policy_a_0001" },
};

describe("HTTP surface", () => {
  const app = buildApp();

  it("serves an unauthenticated health check", async () => {
    const response = await app.request("/health");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
  });

  it("requires a bearer token for /v1 routes", async () => {
    const response = await app.request("/v1/seguros/me");
    expect(response.status).toBe(401);
    const body = (await response.json()) as { error: { code: string; correlationId: string } };
    expect(body.error.code).toBe("UNAUTHENTICATED");
    expect(typeof body.error.correlationId).toBe("string");
  });

  it("returns the verified principal and nothing else", async () => {
    const response = await app.request("/v1/seguros/me", { headers: { authorization: await bearer() } });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      userId: "user-a",
      tenantId: "tenant-a",
      roles: ["owner"],
      scopes: ["insurance.policy.read", "insurance.proposal.preview"],
    });
  });

  it("returns 404 without leaking a foreign resource", async () => {
    const response = await app.request("/v1/seguros/resources/policy/policy_b_0001", {
      headers: { authorization: await bearer() },
    });
    expect(response.status).toBe(404);
    const raw = await response.text();
    expect(raw).not.toContain("policy_b_0001");
    expect(JSON.parse(raw)).toMatchObject({ error: { code: "NOT_FOUND" } });
  });

  it("allows an in-tenant resource", async () => {
    const response = await app.request("/v1/seguros/resources/policy/policy_a_0001", {
      headers: { authorization: await bearer() },
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ resource: { kind: "policy", id: "policy_a_0001" } });
  });

  it("previews without side effects and returns a payload hash", async () => {
    const response = await app.request("/v1/seguros/proposals/preview", {
      method: "POST",
      headers: { authorization: await bearer(), "content-type": "application/json" },
      body: JSON.stringify(previewEnvelope),
    });
    expect(response.status).toBe(200);
    const body = (await response.json()) as { dryRun: boolean; status: string; payloadHash: string };
    expect(body.dryRun).toBe(true);
    expect(body.status).toBe("proposed");
    expect(body.payloadHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("rejects an envelope that claims another tenant", async () => {
    const response = await app.request("/v1/seguros/proposals/preview", {
      method: "POST",
      headers: { authorization: await bearer(), "content-type": "application/json" },
      body: JSON.stringify({ ...previewEnvelope, tenantId: "tenant-b" }),
    });
    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ error: { code: "FORBIDDEN" } });
  });

  it("rejects an envelope that claims another actor", async () => {
    const response = await app.request("/v1/seguros/proposals/preview", {
      method: "POST",
      headers: { authorization: await bearer(), "content-type": "application/json" },
      body: JSON.stringify({ ...previewEnvelope, actorId: "user-b" }),
    });
    expect(response.status).toBe(403);
  });

  it("rejects a preview over a foreign policy without leaking it", async () => {
    const response = await app.request("/v1/seguros/proposals/preview", {
      method: "POST",
      headers: { authorization: await bearer(), "content-type": "application/json" },
      body: JSON.stringify({ ...previewEnvelope, payload: { resourceId: "policy_b_0001" } }),
    });
    expect(response.status).toBe(404);
    expect(await response.text()).not.toContain("policy_b_0001");
  });

  it("rejects a preview with no identifiable resource", async () => {
    const response = await app.request("/v1/seguros/proposals/preview", {
      method: "POST",
      headers: { authorization: await bearer(), "content-type": "application/json" },
      body: JSON.stringify({ ...previewEnvelope, payload: {} }),
    });
    expect(response.status).toBe(422);
    expect(await response.json()).toMatchObject({ error: { code: "UNPROCESSABLE" } });
  });

  it("rejects unknown envelope fields", async () => {
    const response = await app.request("/v1/seguros/proposals/preview", {
      method: "POST",
      headers: { authorization: await bearer(), "content-type": "application/json" },
      body: JSON.stringify({ ...previewEnvelope, adminOverride: true }),
    });
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: { code: "INVALID_INPUT" } });
  });

  it("rejects an envelope that does not request a dry run", async () => {
    const response = await app.request("/v1/seguros/proposals/preview", {
      method: "POST",
      headers: { authorization: await bearer(), "content-type": "application/json" },
      body: JSON.stringify({ ...previewEnvelope, dryRun: false }),
    });
    expect(response.status).toBe(400);
  });

  it("rejects malformed JSON", async () => {
    const response = await app.request("/v1/seguros/proposals/preview", {
      method: "POST",
      headers: { authorization: await bearer(), "content-type": "application/json" },
      body: "{not json",
    });
    expect(response.status).toBe(400);
  });

  it("denies a capability the membership lacks", async () => {
    const limited = buildApp(limitedMemberships);
    const response = await limited.request("/v1/seguros/proposals/preview", {
      method: "POST",
      headers: { authorization: await bearer(), "content-type": "application/json" },
      body: JSON.stringify(previewEnvelope),
    });
    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ error: { code: "FORBIDDEN" } });
  });

  it("keeps side-effecting capabilities disabled", async () => {
    const response = await app.request("/v1/seguros/intents", {
      method: "POST",
      headers: { authorization: await bearer(), "content-type": "application/json" },
      body: "{}",
    });
    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ error: { code: "FORBIDDEN" } });
  });

  it("returns a closed error envelope for unknown routes", async () => {
    const response = await app.request("/v1/seguros/execute-anything", {
      headers: { authorization: await bearer() },
    });
    expect(response.status).toBe(404);
    const body = (await response.json()) as Record<string, unknown>;
    expect(Object.keys(body)).toEqual(["error"]);
    expect(Object.keys(body["error"] as Record<string, unknown>).sort()).toEqual([
      "code",
      "correlationId",
      "message",
      "reconciliationRequired",
      "retryable",
    ]);
  });
});
