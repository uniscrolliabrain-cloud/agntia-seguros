import { describe, expect, it } from "vitest";
import {
  UnavailableHostBridge,
  assertEventAcknowledged,
  assertTwinMandate,
  requireCanonicalIdentity,
} from "./index";

const binding = {
  twinBindingRef: "twin_000001",
  tenantId: "tenant-a",
  canonicalAgentRef: "agent_000001",
  canonicalRevision: "rev-2026-11",
  localInstanceRef: "inst_000001",
  workOrderRef: "word_000001",
  capabilities: ["insurance.policy.read", "insurance.claim.prepare"],
  purpose: "asistencia de siniestros sinteticos",
  budgetRef: null,
  issuedAt: "2026-11-01T00:00:00Z",
  expiresAt: "2026-12-01T00:00:00Z",
  revocationVersion: 2,
  proofRef: "proof_000001",
};

const check = {
  capability: "insurance.policy.read",
  tenantId: "tenant-a",
  now: new Date("2026-11-14T00:00:00Z"),
  revocationVersion: 2,
};

describe("C04 twin mandate", () => {
  it("accepts a current mandate with the capability", () => {
    expect(assertTwinMandate(binding, check).canonicalAgentRef).toBe("agent_000001");
  });

  it("blocks an expired, revoked, foreign or out-of-scope mandate", () => {
    expect(() => assertTwinMandate(binding, { ...check, now: new Date("2026-12-02T00:00:00Z") })).toThrow(
      /expired/,
    );
    expect(() => assertTwinMandate(binding, { ...check, revocationVersion: 3 })).toThrow(/revoked/);
    expect(() => assertTwinMandate(binding, { ...check, tenantId: "tenant-b" })).toThrow(/another tenant/);
    expect(() => assertTwinMandate(binding, { ...check, capability: "insurance.intent.execute" })).toThrow(
      /outside the twin mandate/,
    );
  });
});

describe("C36 host bridge stub", () => {
  it("cannot resolve canonical identity and fails closed", async () => {
    const bridge = new UnavailableHostBridge();
    expect(await bridge.resolveCanonicalIdentity("agent_000001")).toBeNull();
    expect(() => requireCanonicalIdentity(null)).toThrow(/canonical identity/);
  });

  it("never reports an unacknowledged event as delivered", async () => {
    const bridge = new UnavailableHostBridge();
    const result = await bridge.emitEvent({ type: "seguros.proposal.created" });
    expect(result).toEqual({ acked: false, reason: "HOST_BRIDGE_NOT_VERIFIED" });
    expect(() => assertEventAcknowledged(result)).toThrow(/not acknowledged/);
  });
});
