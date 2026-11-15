import { describe, expect, it } from "vitest";
import { BudgetLedger, UsageMeter, createRedactingLogger, redact } from "./index";

const eur = (amount: string) => ({ amount, currency: "EUR", exponent: 2 });

describe("C38 budgets", () => {
  const input = {
    reservationRef: "resv_000001",
    tenantId: "tenant-a",
    operationKey: "op-preview-1",
    ceiling: eur("3000"),
  };

  it("reserves once per operation and prevents double spending", () => {
    const ledger = new BudgetLedger();
    ledger.reserve(input);
    expect(() => ledger.reserve({ ...input, reservationRef: "resv_000002" })).toThrow(/already reserved/);
    ledger.consume("resv_000001", eur("1000"));
    expect(() => ledger.consume("resv_000001", eur("2500"))).toThrow(/ceiling exceeded/);
    expect(ledger.consume("resv_000001", eur("2000")).consumed).toEqual(eur("3000"));
  });

  it("cannot consume a released reservation", () => {
    const ledger = new BudgetLedger();
    ledger.reserve(input);
    ledger.release("resv_000001");
    expect(() => ledger.consume("resv_000001", eur("10"))).toThrow(/released/);
  });
});

describe("C38 usage", () => {
  it("sums only measured quantities per tenant", () => {
    const meter = new UsageMeter();
    meter.record({ tenantId: "tenant-a", operationKey: "op-1", kind: "input_tokens", quantity: 2000 });
    meter.record({ tenantId: "tenant-a", operationKey: "op-1", kind: "output_tokens", quantity: 500 });
    meter.record({ tenantId: "tenant-b", operationKey: "op-2", kind: "input_tokens", quantity: 9999 });
    expect(meter.summary("tenant-a")).toEqual({
      input_tokens: 2000,
      output_tokens: 500,
      av_seconds: 0,
      documents: 0,
    });
  });
});

describe("C38 logging", () => {
  it("redacts secrets, identifiers and health data", () => {
    const redacted = redact({
      accessToken: "abc",
      userEmail: "a@b.c",
      nested: { authorization: "Bearer x", safe: 1 },
      healthStatus: "diabetes",
      list: [{ iban: "ES00" }],
    });
    const text = JSON.stringify(redacted);
    expect(text).not.toContain("abc");
    expect(text).not.toContain("a@b.c");
    expect(text).not.toContain("Bearer x");
    expect(text).not.toContain("diabetes");
    expect(text).not.toContain("ES00");
    expect(text).toContain("[redacted]");
  });

  it("emits one JSON line per event", () => {
    const lines: string[] = [];
    const logger = createRedactingLogger((line) => lines.push(line));
    logger.info("operation.confirmed", { tenantId: "tenant-a", apiKey: "leak" });
    expect(lines).toHaveLength(1);
    expect(lines[0]).not.toContain("leak");
  });
});
