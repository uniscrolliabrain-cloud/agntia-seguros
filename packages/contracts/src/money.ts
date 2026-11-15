import { z } from "zod";
import { ServiceError } from "./errors";

/**
 * Money is an integer string in minor units plus an exponent, never a float and
 * never a JS number. `{ amount: "1234", currency: "EUR", exponent: 2 }` is 12.34 EUR.
 * Rationale: docs/contracts/01-contratos.md forbids floats for monetary commitments.
 */
export const amountMinorUnitsSchema = z
  .string()
  .regex(/^-?(0|[1-9][0-9]{0,17})$/, "integer minor-unit string expected, no float, no exponent");

export const currencySchema = z.string().regex(/^[A-Z]{3}$/, "ISO-4217 uppercase currency expected");

export const moneySchema = z
  .strictObject({
    amount: amountMinorUnitsSchema,
    currency: currencySchema,
    exponent: z.number().int().min(0).max(6),
  });

export type Money = z.infer<typeof moneySchema>;

function assertSameDenomination(a: Money, b: Money): void {
  if (a.currency !== b.currency) {
    throw new ServiceError("UNPROCESSABLE", "money currency mismatch", { details: { a: a.currency, b: b.currency } });
  }
  if (a.exponent !== b.exponent) {
    throw new ServiceError("UNPROCESSABLE", "money exponent mismatch", { details: { a: a.exponent, b: b.exponent } });
  }
}

export function addMoney(a: Money, b: Money): Money {
  assertSameDenomination(a, b);
  return { amount: (BigInt(a.amount) + BigInt(b.amount)).toString(), currency: a.currency, exponent: a.exponent };
}

export function compareMoney(a: Money, b: Money): -1 | 0 | 1 {
  assertSameDenomination(a, b);
  const left = BigInt(a.amount);
  const right = BigInt(b.amount);
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

/** Deterministic formatting without ever constructing a float. */
export function formatMoney(value: Money): string {
  const parsed = moneySchema.parse(value);
  const negative = parsed.amount.startsWith("-");
  const digits = (negative ? parsed.amount.slice(1) : parsed.amount).padStart(parsed.exponent + 1, "0");
  const integerPart = parsed.exponent === 0 ? digits : digits.slice(0, -parsed.exponent);
  const fractionPart = parsed.exponent === 0 ? "" : digits.slice(-parsed.exponent);
  const sign = negative && !/^0+$/.test(digits) ? "-" : "";
  return `${sign}${integerPart}${parsed.exponent === 0 ? "" : `.${fractionPart}`} ${parsed.currency}`;
}
