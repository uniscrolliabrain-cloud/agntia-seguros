import { describe, expect, it } from "vitest";
import { IntentStore, Outbox, assertWriteForbidden, isOperationUsable, requireUsableOperation } from "./index";

const hash = (char: string) => char.repeat(64);

const baseIntent = {
  intentId: "int_00000001",
  tenantId: "tenant-a",
  capability: "insurance.handoff.propose",
  idempotencyKey: "idem-key-0001",
  payloadHash: hash("a"),
};

describe("durable intents", () => {
  it("replays an identical intent instead of duplicating it", () => {
    const store = new IntentStore();
    const first = store.begin(baseIntent);
    const second = store.begin({ ...baseIntent, intentId: "int_00000002" });
    expect(first.replay).toBe(false);
    expect(second.replay).toBe(true);
    expect(second.intent.intentId).toBe("int_00000001");
  });

  it("rejects the same key with a different payload", () => {
    const store = new IntentStore();
    store.begin(baseIntent);
    expect(() => store.begin({ ...baseIntent, payloadHash: hash("b") })).toThrow(/different payload/);
  });

  it("turns a timeout after a possible effect into an unknown outcome", () => {
    const store = new IntentStore();
    store.begin(baseIntent);
    store.markRunning(baseIntent.intentId);
    expect(store.markUnknown(baseIntent.intentId).state).toBe("outcome_unknown");
    expect(store.requireReconciliation(baseIntent.intentId).state).toBe("reconciliation_required");
    expect(store.reconcile(baseIntent.intentId, "confirmed", { receipt: "rcpt_000001" }).state).toBe("confirmed");
  });

  it("refuses to reconcile an intent that was never uncertain", () => {
    const store = new IntentStore();
    store.begin(baseIntent);
    expect(() => store.requireReconciliation(baseIntent.intentId)).toThrow(/unknown outcome/);
  });

  it("refuses to complete an intent that is not running", () => {
    const store = new IntentStore();
    store.begin(baseIntent);
    expect(() => store.complete(baseIntent.intentId, {})).toThrow(/not running/);
  });
});

describe("outbox", () => {
  const event = {
    eventId: "evt_0000001",
    tenantId: "tenant-a",
    eventType: "seguros.operation.confirmed",
    payloadRef: "pay_0000001",
  };

  it("publishes separately from the local commit and records an ACK", () => {
    const outbox = new Outbox();
    outbox.append(event);
    expect(outbox.pending()).toHaveLength(1);
    const published = outbox.markPublished(event.eventId, "ack_000001");
    expect(published.ackRef).toBe("ack_000001");
    expect(outbox.pending()).toHaveLength(0);
  });

  it("refuses duplicate events", () => {
    const outbox = new Outbox();
    outbox.append(event);
    expect(() => outbox.append(event)).toThrow(/already appended/);
  });
});

describe("capability discovery", () => {
  const report = {
    providerRef: "prov_000001",
    deployment: "sandbox",
    edition: "community",
    operations: [
      { operation: "policy.read", state: "verified_runtime" as const, evidenceRef: "evid_000001", checkedAt: "2026-11-14T00:00:00Z" },
      { operation: "claim.read", state: "documented" as const, evidenceRef: null, checkedAt: "2026-11-14T00:00:00Z" },
    ],
  };

  it("only treats verified_runtime as usable", () => {
    expect(isOperationUsable(report, "policy.read")).toBe(true);
    expect(isOperationUsable(report, "claim.read")).toBe(false);
    expect(() => requireUsableOperation(report, "claim.read")).toThrow(/not verified/);
  });

  it("denies undeclared operations without an admin fallback", () => {
    expect(() => requireUsableOperation(report, "policy.bind")).toThrow(/not declared/);
  });

  it("rejects a report that declares forbidden write operations", () => {
    expect(() =>
      assertWriteForbidden({
        ...report,
        operations: [
          ...report.operations,
          { operation: "policy.bind", state: "verified_runtime" as const, evidenceRef: null, checkedAt: "2026-11-14T00:00:00Z" },
        ],
      }),
    ).toThrow(/forbidden effect operations/);
  });
});
