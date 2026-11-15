import { z } from "zod";
import {
  ServiceError,
  isoInstantSchema,
  moneySchema,
  opaqueIdSchema,
  type Money,
} from "@agntia/contracts";

/**
 * C14 — Needs and demands.
 * A contradictory need produces professional review. The service never emits a
 * sales ranking: `ranking` is always null.
 */
export const needSchema = z.strictObject({
  needRef: opaqueIdSchema,
  coverageNeed: z.string().min(3).max(160),
  declaredPurpose: z.string().min(3).max(160),
  constraints: z.array(z.string().min(1).max(80)).max(20),
});

export interface NeedsAssessment {
  readonly state: "prepared" | "needs_professional_review";
  readonly contradictions: readonly string[];
  readonly ranking: null;
}

export function assessNeeds(input: unknown): NeedsAssessment {
  const needs = z.array(needSchema).min(1).parse(input);
  const purposes = new Map<string, Set<string>>();
  for (const need of needs) {
    const seen = purposes.get(need.needRef) ?? new Set<string>();
    seen.add(need.declaredPurpose);
    purposes.set(need.needRef, seen);
  }
  const contradictions = [...purposes.entries()]
    .filter(([, declaredPurposes]) => declaredPurposes.size > 1)
    .map(([needRef]) => needRef);
  return {
    state: contradictions.length > 0 ? "needs_professional_review" : "prepared",
    contradictions,
    ranking: null,
  };
}

/**
 * C16 — Quote request preparation.
 * Never sent from here. Data minimisation is enforced against an allowlist:
 * fields outside the declared purpose are refused, not silently dropped.
 */
export const quoteRequestSchema = z.strictObject({
  requestRef: opaqueIdSchema,
  needs: z.array(needSchema).min(1),
  recipients: z.array(opaqueIdSchema).min(1).max(10),
  sharedFields: z.array(z.string().min(1).max(60)).max(40),
});

export function buildQuoteRequest(input: unknown): {
  readonly requestRef: string;
  readonly state: "proposed";
  readonly sends: false;
  readonly recipients: readonly string[];
} {
  const parsed = quoteRequestSchema.parse(input);
  return {
    requestRef: parsed.requestRef,
    state: "proposed",
    sends: false,
    recipients: parsed.recipients,
  };
}

export function assertDataMinimisation(input: unknown, allowedFields: readonly string[]): void {
  const parsed = quoteRequestSchema.parse(input);
  const allowed = new Set(allowedFields);
  const surplus = parsed.sharedFields.filter((field) => !allowed.has(field));
  if (surplus.length > 0) {
    throw new ServiceError("FORBIDDEN", "quote request shares data outside its purpose", {
      details: { reason: "DATA_MINIMISATION_VIOLATION", surplus },
    });
  }
}

/**
 * C17 — Quote import.
 * An expired quote cannot be selected as current, and a quote is not a bound
 * policy.
 */
export const insurerQuoteSchema = z.strictObject({
  quoteRef: opaqueIdSchema,
  insurerRef: opaqueIdSchema,
  productVersion: z.string().min(1).max(60),
  premium: moneySchema,
  coverageLimit: moneySchema,
  deductible: moneySchema,
  validUntil: isoInstantSchema,
  comparableFields: z.array(z.string().min(1).max(60)).min(1),
});

export type InsurerQuote = z.infer<typeof insurerQuoteSchema>;

export function isQuoteCurrent(quote: InsurerQuote, at: Date): boolean {
  const validUntil = Date.parse(quote.validUntil);
  return Number.isFinite(validUntil) && at.getTime() < validUntil;
}

export function selectCurrentQuote(input: unknown, quoteRef: string, at: Date): InsurerQuote {
  const quotes = z.array(insurerQuoteSchema).parse(input);
  const quote = quotes.find((candidate) => candidate.quoteRef === quoteRef);
  if (!quote) {
    throw new ServiceError("NOT_FOUND", "quote not found");
  }
  if (!isQuoteCurrent(quote, at)) {
    throw new ServiceError("CONFLICT", "quote is not current", {
      details: { reason: "QUOTE_EXPIRED", quoteRef, validUntil: quote.validUntil },
    });
  }
  return quote;
}

/**
 * C18 — Explainable comparison.
 * Differences are surfaced; equivalence is never assumed and suitability is
 * never inferred from price.
 */
export interface QuoteComparison {
  readonly rows: readonly {
    readonly quoteRef: string;
    readonly premium: Money;
    readonly coverageLimit: Money;
    readonly deductible: Money;
  }[];
  readonly nonEquivalent: boolean;
  readonly differences: readonly string[];
  readonly suitability: "not_assessed";
}

export function compareQuotes(input: unknown): QuoteComparison {
  const quotes = z.array(insurerQuoteSchema).parse(input);
  if (quotes.length === 0) {
    throw new ServiceError("UNPROCESSABLE", "no quotes to compare");
  }
  const limits = new Set(quotes.map((quote) => `${quote.coverageLimit.amount}/${quote.coverageLimit.currency}`));
  const currencies = new Set(quotes.map((quote) => quote.premium.currency));
  const fieldSets = new Set(quotes.map((quote) => [...quote.comparableFields].sort().join(",")));
  const differences: string[] = [];
  if (limits.size > 1) differences.push("coverage limits differ");
  if (currencies.size > 1) differences.push("premium currencies differ");
  if (fieldSets.size > 1) differences.push("comparable fields differ");
  return {
    rows: quotes.map((quote) => ({
      quoteRef: quote.quoteRef,
      premium: quote.premium,
      coverageLimit: quote.coverageLimit,
      deductible: quote.deductible,
    })),
    nonEquivalent: differences.length > 0,
    differences,
    suitability: "not_assessed",
  };
}

/**
 * C19 — Illustrative rule engine.
 * Atomic rules, versioned composition. A missing fact yields `unknown`, never
 * `false`. Evaluation is illustrative and never binding.
 */
export const ruleOutcomeSchema = z.enum(["applies", "not_applicable", "unknown", "needs_professional_review"]);

export const atomicRuleDefinitionSchema = z.strictObject({
  ruleRef: opaqueIdSchema,
  ruleVersion: z.number().int().min(1),
  whenField: z.string().min(1).max(60),
  whenEquals: z.union([z.string().max(200), z.number(), z.boolean()]),
  thenOutcome: ruleOutcomeSchema,
});

export interface RuleEvaluationResult {
  readonly compositionVersion: string;
  readonly outcomes: readonly { readonly ruleRef: string; readonly outcome: string }[];
  readonly unknownFacts: readonly string[];
  readonly illustrative: true;
}

export function evaluateRules(
  input: unknown,
  facts: Readonly<Record<string, string | number | boolean | undefined>>,
): RuleEvaluationResult {
  const rules = z.array(atomicRuleDefinitionSchema).min(1).parse(input);
  const outcomes: { ruleRef: string; outcome: string }[] = [];
  const unknownFacts: string[] = [];
  for (const rule of rules) {
    const fact = facts[rule.whenField];
    if (fact === undefined) {
      unknownFacts.push(rule.whenField);
      outcomes.push({ ruleRef: rule.ruleRef, outcome: "unknown" });
      continue;
    }
    outcomes.push({
      ruleRef: rule.ruleRef,
      outcome: fact === rule.whenEquals ? rule.thenOutcome : "not_applicable",
    });
  }
  const compositionVersion = rules
    .map((rule) => `${rule.ruleRef}@${rule.ruleVersion}`)
    .sort()
    .join("|");
  return { compositionVersion, outcomes, unknownFacts: [...new Set(unknownFacts)], illustrative: true };
}

/**
 * C20 — Illustrative estimates.
 * Missing limit or deductible blocks a firm number; the result is always marked
 * illustrative and never exceeds the limit.
 */
export function computeIllustrativeEstimate(input: unknown): {
  readonly estimateRef: string;
  readonly amount: Money;
  readonly firmness: "illustrative_only";
  readonly missingInputs: readonly string[];
} {
  const parsed = z
    .strictObject({
      estimateRef: opaqueIdSchema,
      damage: moneySchema,
      deductible: moneySchema.nullable(),
      limit: moneySchema.nullable(),
    })
    .parse(input);

  const missing: string[] = [];
  if (parsed.deductible === null) missing.push("deductible");
  if (parsed.limit === null) missing.push("limit");
  if (missing.length > 0) {
    throw new ServiceError("UNPROCESSABLE", "estimate blocked by missing inputs", {
      details: { reason: "ESTIMATE_INPUTS_MISSING", missing },
    });
  }
  const deductible = parsed.deductible as Money;
  const limit = parsed.limit as Money;
  for (const money of [deductible, limit]) {
    if (money.currency !== parsed.damage.currency || money.exponent !== parsed.damage.exponent) {
      throw new ServiceError("UNPROCESSABLE", "estimate mixes denominations");
    }
  }
  const damage = BigInt(parsed.damage.amount);
  const afterDeductible = damage - BigInt(deductible.amount);
  const floor = afterDeductible > 0n ? afterDeductible : 0n;
  const cap = BigInt(limit.amount);
  const amount = floor < cap ? floor : cap;
  return {
    estimateRef: parsed.estimateRef,
    amount: { amount: amount.toString(), currency: parsed.damage.currency, exponent: parsed.damage.exponent },
    firmness: "illustrative_only",
    missingInputs: [],
  };
}
