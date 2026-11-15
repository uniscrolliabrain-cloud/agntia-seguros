import { z } from "zod";
import { ServiceError } from "./errors";

/**
 * AuthorityMap (C02): duplication of *knowledge* between services is allowed;
 * duplication of *effect* is not. Each external effect has exactly one custodian
 * and one executor, agreed per engagement.
 */
export const authorityEntrySchema = z.strictObject({
  effect: z.string().min(3).max(80),
  custodian: z.string().min(2).max(64),
  executor: z.string().min(2).max(64),
  approvedBy: z.string().min(2).max(64),
});

export type AuthorityEntry = z.infer<typeof authorityEntrySchema>;
export type AuthorityMap = readonly AuthorityEntry[];

export function parseAuthorityMap(input: unknown): AuthorityMap {
  const entries = z.array(authorityEntrySchema).parse(input);
  const seen = new Map<string, string>();
  for (const entry of entries) {
    const previous = seen.get(entry.effect);
    if (previous !== undefined && previous !== entry.executor) {
      throw new ServiceError("CONFLICT", "effect has more than one executor", {
        details: { effect: entry.effect, executors: [previous, entry.executor] },
      });
    }
    seen.set(entry.effect, entry.executor);
  }
  return entries;
}

/** Deny-by-default: an effect absent from the map cannot be executed locally. */
export function resolveExecutor(map: AuthorityMap, effect: string): AuthorityEntry {
  const entry = map.find((candidate) => candidate.effect === effect);
  if (!entry) {
    throw new ServiceError("UNPROCESSABLE", "effect has no authority entry", { details: { effect } });
  }
  return entry;
}
