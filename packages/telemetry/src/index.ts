import { z } from "zod";
import { ServiceError, addMoney, compareMoney, moneySchema, opaqueIdSchema, type Money } from "@agntia/contracts";

/**
 * C38 — Budgets, metering and redacted logs.
 * The 30/70/300 € bundles are hypotheses, not contracted plans; nothing here
 * reads a price list or invents a target. Budgets are reserved per operation key
 * so concurrency cannot double-spend the last euro.
 */
export interface BudgetReservation {
  readonly reservationRef: string;
  readonly tenantId: string;
  readonly operationKey: string;
  readonly ceiling: Money;
  consumed: Money;
  state: "reserved" | "released";
}

export class BudgetLedger {
  private readonly byRef = new Map<string, BudgetReservation>();
  private readonly byOperation = new Map<string, string>();

  reserve(input: unknown): BudgetReservation {
    const parsed = z
      .strictObject({
        reservationRef: opaqueIdSchema,
        tenantId: z.string().min(1).max(64),
        operationKey: z.string().min(3).max(120),
        ceiling: moneySchema,
      })
      .parse(input);

    const operationKey = `${parsed.tenantId}\u0000${parsed.operationKey}`;
    if (this.byOperation.has(operationKey)) {
      throw new ServiceError("CONFLICT", "budget already reserved for this operation", {
        details: { reason: "BUDGET_ALREADY_RESERVED" },
      });
    }
    const reservation: BudgetReservation = {
      ...parsed,
      consumed: { amount: "0", currency: parsed.ceiling.currency, exponent: parsed.ceiling.exponent },
      state: "reserved",
    };
    this.byRef.set(reservation.reservationRef, reservation);
    this.byOperation.set(operationKey, reservation.reservationRef);
    return reservation;
  }

  private require(reservationRef: string): BudgetReservation {
    const reservation = this.byRef.get(reservationRef);
    if (!reservation) throw new ServiceError("NOT_FOUND", "reservation not found");
    return reservation;
  }

  consume(reservationRef: string, amount: unknown): BudgetReservation {
    const reservation = this.require(reservationRef);
    if (reservation.state !== "reserved") {
      throw new ServiceError("CONFLICT", "reservation is released");
    }
    const parsedAmount = moneySchema.parse(amount);
    const next = addMoney(reservation.consumed, parsedAmount);
    if (compareMoney(next, reservation.ceiling) > 0) {
      throw new ServiceError("UNPROCESSABLE", "budget ceiling exceeded", {
        details: { reason: "BUDGET_EXCEEDED" },
      });
    }
    reservation.consumed = next;
    return reservation;
  }

  release(reservationRef: string): BudgetReservation {
    const reservation = this.require(reservationRef);
    if (reservation.state === "released") {
      throw new ServiceError("CONFLICT", "reservation already released");
    }
    reservation.state = "released";
    return reservation;
  }
}

export type UsageKind = "input_tokens" | "output_tokens" | "av_seconds" | "documents";

export interface UsageEntry {
  readonly tenantId: string;
  readonly operationKey: string;
  readonly kind: UsageKind;
  readonly quantity: number;
}

/** Only measured quantities. No forecasts, no percentage targets. */
export class UsageMeter {
  private readonly entries: UsageEntry[] = [];

  record(input: unknown): UsageEntry {
    const parsed = z
      .strictObject({
        tenantId: z.string().min(1).max(64),
        operationKey: z.string().min(3).max(120),
        kind: z.enum(["input_tokens", "output_tokens", "av_seconds", "documents"]),
        quantity: z.number().int().min(0).max(10_000_000),
      })
      .parse(input);
    this.entries.push(parsed);
    return parsed;
  }

  summary(tenantId: string): Readonly<Record<UsageKind, number>> {
    const totals: Record<UsageKind, number> = {
      input_tokens: 0,
      output_tokens: 0,
      av_seconds: 0,
      documents: 0,
    };
    for (const entry of this.entries) {
      if (entry.tenantId !== tenantId) continue;
      totals[entry.kind] += entry.quantity;
    }
    return totals;
  }
}

const SENSITIVE_KEY = /token|secret|password|authorization|api[_-]?key|email|dni|iban|health|diagnos/i;
const REDACTED = "[redacted]";

export function redact(value: unknown, depth = 0): unknown {
  if (depth > 6) return REDACTED;
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((item) => redact(item, depth + 1));
  const result: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    result[key] = SENSITIVE_KEY.test(key) ? REDACTED : redact(child, depth + 1);
  }
  return result;
}

export interface Logger {
  info(event: string, fields: Record<string, unknown>): void;
}

export function createRedactingLogger(sink: (line: string) => void): Logger {
  return {
    info(event, fields) {
      sink(JSON.stringify({ event, ...(redact(fields) as Record<string, unknown>) }));
    },
  };
}
