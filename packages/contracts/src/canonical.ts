import { ServiceError } from "./errors";
import { sha256HexSchema } from "./ids";

/**
 * Deterministic JSON: object keys sorted, no whitespace, no `undefined` members.
 * Used to bind an approval to the exact payload that was reviewed, so any
 * material edit changes the hash and invalidates the authorisation.
 */
export function canonicalJson(value: unknown): string {
  return stringify(value, new WeakSet<object>());
}

function stringify(value: unknown, seen: WeakSet<object>): string {
  if (value === null) return "null";
  if (value === undefined) {
    throw new ServiceError("INVALID_INPUT", "canonicalJson rejects undefined");
  }
  switch (typeof value) {
    case "string":
      return JSON.stringify(value);
    case "boolean":
      return value ? "true" : "false";
    case "number":
      if (!Number.isFinite(value)) {
        throw new ServiceError("INVALID_INPUT", "canonicalJson rejects non-finite numbers");
      }
      return JSON.stringify(value);
    case "object":
      break;
    default:
      throw new ServiceError("INVALID_INPUT", `canonicalJson rejects ${typeof value}`);
  }

  const object = value as object;
  if (seen.has(object)) {
    throw new ServiceError("INVALID_INPUT", "canonicalJson rejects cyclic structures");
  }
  seen.add(object);
  try {
    if (Array.isArray(value)) {
      return `[${value.map((item) => stringify(item, seen)).join(",")}]`;
    }
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record)
      .filter((key) => record[key] !== undefined)
      .sort();
    const members = keys.map((key) => `${JSON.stringify(key)}:${stringify(record[key], seen)}`);
    return `{${members.join(",")}}`;
  } finally {
    seen.delete(object);
  }
}

/**
 * Hash hook is injected so this package stays runtime-agnostic: the API supplies
 * node:crypto today, a Workers/edge build can supply WebCrypto later.
 */
export function hashPayload(payload: unknown, sha256Hex: (input: string) => string, domain = "payload"): string {
  const digest = sha256Hex(`${domain}:${canonicalJson(payload)}`);
  return sha256HexSchema.parse(digest);
}
