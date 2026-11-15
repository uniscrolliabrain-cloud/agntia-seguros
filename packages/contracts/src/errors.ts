import { z } from "zod";

/**
 * Closed error taxonomy from docs/contracts/01-contratos.md.
 * No free-form codes: an unknown condition is UNPROCESSABLE or INTERNAL, never a
 * new invented string, so clients can branch deterministically.
 */
export const errorCodeSchema = z.enum([
  "INVALID_INPUT",
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "UNPROCESSABLE",
  "RATE_LIMITED",
  "UPSTREAM_INVALID",
  "PROVIDER_UNAVAILABLE",
  "TIMEOUT",
  "INTERNAL",
]);

export type ErrorCode = z.infer<typeof errorCodeSchema>;

const HTTP_STATUS: Record<ErrorCode, number> = {
  INVALID_INPUT: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  RATE_LIMITED: 429,
  UPSTREAM_INVALID: 502,
  PROVIDER_UNAVAILABLE: 503,
  TIMEOUT: 504,
  INTERNAL: 500,
};

export interface ServiceErrorOptions {
  /** Internal-only diagnostic detail. Never serialised to the client. */
  readonly details?: unknown;
  readonly retryable?: boolean;
  readonly reconciliationRequired?: boolean;
}

export class ServiceError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly retryable: boolean;
  readonly reconciliationRequired: boolean;
  readonly details: unknown;

  constructor(code: ErrorCode, message: string, options: ServiceErrorOptions = {}) {
    super(message);
    this.name = "ServiceError";
    this.code = code;
    this.status = HTTP_STATUS[code];
    this.retryable = options.retryable ?? false;
    this.reconciliationRequired = options.reconciliationRequired ?? false;
    this.details = options.details;
  }
}

export function isServiceError(value: unknown): value is ServiceError {
  return value instanceof ServiceError;
}

/** Wire shape. Deliberately excludes stack traces, SQL, payloads and PII. */
export const errorEnvelopeSchema = z.strictObject({
  error: z.strictObject({
    code: errorCodeSchema,
    message: z.string().min(1).max(500),
    correlationId: z.string().min(1),
    retryable: z.boolean(),
    reconciliationRequired: z.boolean(),
  }),
});

export type ErrorEnvelope = z.infer<typeof errorEnvelopeSchema>;
