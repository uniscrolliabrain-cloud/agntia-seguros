import { z } from "zod";

/**
 * Environment contract. There is no insecure default: an unset issuer or audience
 * stops the process instead of silently verifying nothing.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(8080),
  /** Supabase project issuer, e.g. https://<ref>.supabase.co/auth/v1 */
  SUPABASE_ISSUER: z.string().url(),
  /** Expected audience, e.g. `authenticated`. */
  SUPABASE_AUDIENCE: z.string().min(1).max(64),
  /** Pinned JWKS endpoint. Never taken from the token's own headers. */
  SUPABASE_JWKS_URL: z.string().url(),
});

export type Env = z.infer<typeof envSchema>;

export class EnvError extends Error {
  override readonly name = "EnvError";
}

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const missing = parsed.error.issues.map((issue) => issue.path.join(".") || "env").join(", ");
    throw new EnvError(`invalid environment: ${missing}`);
  }
  return parsed.data;
}
