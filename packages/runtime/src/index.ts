import { z } from "zod";
import { ServiceError, opaqueIdSchema } from "@agntia/contracts";

/**
 * C06 (logical half) — Durable intent semantics.
 * Same tenant + capability + idempotency key with the same payload hash replays
 * the previous result. The same key with another payload is a conflict. A
 * timeout after a possible effect becomes `outcome_unknown` and requires
 * reconciliation: never a blind retry.
 */
export const intentStateSchema = z.enum([
  "proposed",
  "running",
  "accepted",
  "confirmed",
  "failed_definitive",
  "outcome_unknown",
  "reconciliation_required",
  "cancelled",
]);

export type IntentState = z.infer<typeof intentStateSchema>;

export interface IntentRecord {
  readonly intentId: string;
  readonly tenantId: string;
  readonly capability: string;
  readonly idempotencyKey: string;
  readonly payloadHash: string;
  state: IntentState;
  result: unknown;
}

export interface BeginIntentInput {
  readonly intentId: string;
  readonly tenantId: string;
  readonly capability: string;
  readonly idempotencyKey: string;
  readonly payloadHash: string;
}

export interface BeginIntentResult {
  readonly intent: IntentRecord;
  readonly replay: boolean;
}

export class IntentStore {
  private readonly byKey = new Map<string, IntentRecord>();
  private readonly byId = new Map<string, IntentRecord>();

  private static key(tenantId: string, capability: string, idempotencyKey: string): string {
    return `${tenantId}\u0000${capability}\u0000${idempotencyKey}`;
  }

  begin(input: BeginIntentInput): BeginIntentResult {
    const parsed = z
      .strictObject({
        intentId: opaqueIdSchema,
        tenantId: z.string().min(1).max(64),
        capability: z.string().min(3).max(80),
        idempotencyKey: z.string().min(8).max(128),
        payloadHash: z.string().regex(/^[a-f0-9]{64}$/),
      })
      .parse(input);

    const key = IntentStore.key(parsed.tenantId, parsed.capability, parsed.idempotencyKey);
    const existing = this.byKey.get(key);
    if (existing) {
      if (existing.payloadHash !== parsed.payloadHash) {
        throw new ServiceError("CONFLICT", "idempotency key reused with a different payload", {
          details: { reason: "IDEMPOTENCY_PAYLOAD_MISMATCH" },
        });
      }
      return { intent: existing, replay: true };
    }

    const record: IntentRecord = { ...parsed, state: "proposed", result: null };
    this.byKey.set(key, record);
    this.byId.set(record.intentId, record);
    return { intent: record, replay: false };
  }

  private require(intentId: string): IntentRecord {
    const record = this.byId.get(intentId);
    if (!record) throw new ServiceError("NOT_FOUND", "intent not found");
    return record;
  }

  markRunning(intentId: string): IntentRecord {
    const record = this.require(intentId);
    if (record.state !== "proposed") {
      throw new ServiceError("CONFLICT", "intent is not proposed", { details: { state: record.state } });
    }
    record.state = "running";
    return record;
  }

  complete(intentId: string, result: unknown): IntentRecord {
    const record = this.require(intentId);
    if (record.state !== "running") {
      throw new ServiceError("CONFLICT", "intent is not running", { details: { state: record.state } });
    }
    record.state = "confirmed";
    record.result = result;
    return record;
  }

  /** Timeout after a possible effect: uncertain, never "failed". */
  markUnknown(intentId: string): IntentRecord {
    const record = this.require(intentId);
    if (record.state !== "running") {
      throw new ServiceError("CONFLICT", "only a running intent can become unknown");
    }
    record.state = "outcome_unknown";
    return record;
  }

  requireReconciliation(intentId: string): IntentRecord {
    const record = this.require(intentId);
    if (record.state !== "outcome_unknown") {
      throw new ServiceError("CONFLICT", "only an unknown outcome needs reconciliation");
    }
    record.state = "reconciliation_required";
    return record;
  }

  reconcile(intentId: string, outcome: "confirmed" | "failed_definitive", result: unknown): IntentRecord {
    const record = this.require(intentId);
    if (record.state !== "reconciliation_required") {
      throw new ServiceError("CONFLICT", "intent is not awaiting reconciliation");
    }
    record.state = outcome;
    record.result = result;
    return record;
  }

  get(intentId: string): IntentRecord | null {
    return this.byId.get(intentId) ?? null;
  }
}

/**
 * Transactional outbox. The local commit owns the event; publication is separate
 * and an ACK is recorded after delivery.
 */
export interface OutboxEvent {
  readonly eventId: string;
  readonly tenantId: string;
  readonly eventType: string;
  readonly payloadRef: string;
  publishedAt: string | null;
  ackRef: string | null;
}

export class Outbox {
  private readonly events: OutboxEvent[] = [];

  append(input: unknown): OutboxEvent {
    const parsed = z
      .strictObject({
        eventId: opaqueIdSchema,
        tenantId: z.string().min(1).max(64),
        eventType: z.string().min(3).max(80),
        payloadRef: opaqueIdSchema,
      })
      .parse(input);
    if (this.events.some((event) => event.eventId === parsed.eventId)) {
      throw new ServiceError("CONFLICT", "event already appended");
    }
    const event: OutboxEvent = { ...parsed, publishedAt: null, ackRef: null };
    this.events.push(event);
    return event;
  }

  pending(): readonly OutboxEvent[] {
    return this.events.filter((event) => event.publishedAt === null);
  }

  /** Publication without an ACK is not delivery. */
  markPublished(eventId: string, ackRef: string): OutboxEvent {
    const event = this.events.find((candidate) => candidate.eventId === eventId);
    if (!event) throw new ServiceError("NOT_FOUND", "event not found");
    if (event.publishedAt !== null) throw new ServiceError("CONFLICT", "event already published");
    event.publishedAt = new Date().toISOString();
    event.ackRef = ackRef;
    return event;
  }
}

/**
 * C08 / C21 / C22 — Capability discovery.
 * A provider operation is usable only when `verified_runtime`. `documented`,
 * `unknown`, `unsupported`, `forbidden` and `not_configured` are all unusable.
 * There is no admin fallback.
 */
export const capabilityStateSchema = z.enum([
  "documented",
  "verified_runtime",
  "unknown",
  "unsupported",
  "forbidden",
  "not_configured",
]);

export const capabilityReportSchema = z.strictObject({
  providerRef: opaqueIdSchema,
  deployment: z.string().min(1).max(80),
  edition: z.string().min(1).max(80),
  operations: z
    .array(
      z.strictObject({
        operation: z.string().min(3).max(80),
        state: capabilityStateSchema,
        evidenceRef: opaqueIdSchema.nullable(),
        checkedAt: z.string().min(1).max(40),
      }),
    )
    .min(1),
});

export type CapabilityReport = z.infer<typeof capabilityReportSchema>;

export function isOperationUsable(report: CapabilityReport, operation: string): boolean {
  const entry = report.operations.find((candidate) => candidate.operation === operation);
  return entry?.state === "verified_runtime";
}

export function requireUsableOperation(report: CapabilityReport, operation: string): void {
  const entry = report.operations.find((candidate) => candidate.operation === operation);
  if (!entry) {
    throw new ServiceError("FORBIDDEN", "operation not declared by provider", {
      details: { reason: "CAPABILITY_UNKNOWN", operation },
    });
  }
  if (entry.state !== "verified_runtime") {
    throw new ServiceError("FORBIDDEN", "operation is not verified in this deployment", {
      details: { reason: "CAPABILITY_NOT_VERIFIED", operation, state: entry.state },
    });
  }
}

export function assertWriteForbidden(report: CapabilityReport): void {
  const writeLike = report.operations.filter((entry) => /\.(bind|issue|settle|pay|delete|cancel)$/.test(entry.operation));
  if (writeLike.length > 0) {
    throw new ServiceError("FORBIDDEN", "provider report declares forbidden effect operations", {
      details: { operations: writeLike.map((entry) => entry.operation) },
    });
  }
}
