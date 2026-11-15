import { z } from "zod";

/**
 * Opaque identifier. Never a sequential integer, never a provider-native UUID
 * assumed to carry meaning. Length-bounded so a hostile payload cannot smuggle
 * log-sized strings into storage.
 */
export const opaqueIdSchema = z
  .string()
  .regex(/^[A-Za-z0-9][A-Za-z0-9_-]{7,63}$/, "opaque id expected");

export type OpaqueId = z.infer<typeof opaqueIdSchema>;

/** Named capability, e.g. `insurance.claim.prepare`. No wildcards. */
export const capabilitySchema = z
  .string()
  .regex(/^[a-z][a-z0-9]*(\.[a-z0-9-]+){1,4}$/, "capability name expected");

/** ISO-8601 timestamp with explicit offset or Z. Never a bare local date. */
export const isoInstantSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/,
    "ISO-8601 instant with offset expected",
  );

/** Lowercase hex SHA-256, used for payload/source/evidence hashes. */
export const sha256HexSchema = z.string().regex(/^[a-f0-9]{64}$/, "sha256 hex expected");
