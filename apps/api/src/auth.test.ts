import { describe, expect, it } from "vitest";
import { SignJWT, createLocalJWKSet, exportJWK, generateKeyPair } from "jose";
import { createAuthenticator, type MembershipResolver } from "./principal";

const issuer = "https://project-ref.supabase.co/auth/v1";
const audience = "authenticated";

const { privateKey, publicKey } = await generateKeyPair("RS256");
const { privateKey: otherPrivateKey } = await generateKeyPair("RS256");
const keys = createLocalJWKSet({ keys: [await exportJWK(publicKey)] });

const memberships: MembershipResolver = {
  resolve: async (userId, tenantId) => {
    if (userId === "user-a" && tenantId === "tenant-a") {
      return { tenantId: "tenant-a", roles: ["owner"], scopes: ["insurance.policy.read"], status: "active" };
    }
    if (userId === "user-suspended" && tenantId === "tenant-a") {
      return { tenantId: "tenant-a", roles: [], scopes: [], status: "suspended" };
    }
    return null;
  },
};

const authenticate = createAuthenticator({ issuer, audience, keys, membership: memberships });

interface IssueOptions {
  readonly issuer?: string;
  readonly audience?: string;
  readonly expiresIn?: string;
  readonly subject?: string;
  readonly signingKey?: Awaited<ReturnType<typeof generateKeyPair>>["privateKey"];
}

async function issue(claims: Record<string, unknown>, options: IssueOptions = {}): Promise<string> {
  const jwt = new SignJWT(claims)
    .setProtectedHeader({ alg: "RS256" })
    .setIssuer(options.issuer ?? issuer)
    .setAudience(options.audience ?? audience)
    .setSubject(options.subject ?? "user-a")
    .setIssuedAt()
    .setExpirationTime(options.expiresIn ?? "5m");
  return jwt.sign(options.signingKey ?? privateKey);
}

const tenantA = { app_metadata: { tenant_id: "tenant-a" } };

describe("Supabase JWT verification", () => {
  it("accepts a signed token with a provisioned active membership", async () => {
    const principal = await authenticate(`Bearer ${await issue(tenantA)}`);
    expect(principal).toEqual({
      userId: "user-a",
      tenantId: "tenant-a",
      roles: ["owner"],
      scopes: ["insurance.policy.read"],
    });
  });

  it("rejects a missing bearer token", async () => {
    await expect(authenticate(undefined)).rejects.toMatchObject({ code: "UNAUTHENTICATED" });
    await expect(authenticate("Basic abc")).rejects.toMatchObject({ code: "UNAUTHENTICATED" });
  });

  it("rejects a token for another audience", async () => {
    await expect(authenticate(`Bearer ${await issue(tenantA, { audience: "other" })}`)).rejects.toMatchObject({
      code: "UNAUTHENTICATED",
    });
  });

  it("rejects a token for another issuer", async () => {
    await expect(
      authenticate(`Bearer ${await issue(tenantA, { issuer: "https://evil.example/auth/v1" })}`),
    ).rejects.toMatchObject({ code: "UNAUTHENTICATED" });
  });

  it("rejects an expired token", async () => {
    await expect(authenticate(`Bearer ${await issue(tenantA, { expiresIn: "-1m" })}`)).rejects.toMatchObject({
      code: "UNAUTHENTICATED",
    });
  });

  it("rejects a token signed by another key", async () => {
    await expect(authenticate(`Bearer ${await issue(tenantA, { signingKey: otherPrivateKey })}`)).rejects.toMatchObject(
      { code: "UNAUTHENTICATED" },
    );
  });

  it("rejects a symmetric token even if the caller knows the secret", async () => {
    const forged = await new SignJWT({ ...tenantA })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuer(issuer)
      .setAudience(audience)
      .setSubject("user-a")
      .setIssuedAt()
      .setExpirationTime("5m")
      .sign(new TextEncoder().encode("secret"));
    await expect(authenticate(`Bearer ${forged}`)).rejects.toMatchObject({ code: "UNAUTHENTICATED" });
  });

  it("rejects a token with no signed tenant claim", async () => {
    await expect(authenticate(`Bearer ${await issue({})}`)).rejects.toMatchObject({ code: "UNAUTHENTICATED" });
  });

  it("ignores user_metadata as an authority source", async () => {
    await expect(
      authenticate(`Bearer ${await issue({ user_metadata: { tenant_id: "tenant-a" } })}`),
    ).rejects.toMatchObject({ code: "UNAUTHENTICATED" });
  });

  it("prefers the signed app_metadata tenant over a spoofed user_metadata value", async () => {
    const principal = await authenticate(
      `Bearer ${await issue({ app_metadata: { tenant_id: "tenant-a" }, user_metadata: { tenant_id: "tenant-b" } })}`,
    );
    expect(principal.tenantId).toBe("tenant-a");
  });

  it("rejects a valid token whose membership is suspended", async () => {
    await expect(authenticate(`Bearer ${await issue(tenantA, { subject: "user-suspended" })}`)).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("does not fall back to another tenant's membership", async () => {
    await expect(authenticate(`Bearer ${await issue({ tenant_id: "tenant-z" })}`)).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });
});
