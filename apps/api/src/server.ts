import { serve } from "@hono/node-server";
import { createRemoteJWKSet } from "jose";
import { createApp } from "./app";
import { loadEnv } from "./env";
import { createAuthenticator, type MembershipResolver } from "./principal";
import type { AclStore } from "./pep";

/**
 * Development harness only.
 *
 * Membership and resource ACL live in Postgres behind RLS (C06) and are NOT
 * implemented yet. This harness therefore fails closed: every authenticated
 * request is forbidden until a real resolver is wired. It never falls back to
 * an in-memory allow-list, an `owner` role or a default tenant.
 */
const denyAllMemberships: MembershipResolver = {
  resolve: async () => null,
};

const denyAllAcl: AclStore = {
  allows: async () => false,
};

const env = loadEnv();
const authenticator = createAuthenticator({
  issuer: env.SUPABASE_ISSUER,
  audience: env.SUPABASE_AUDIENCE,
  keys: createRemoteJWKSet(new URL(env.SUPABASE_JWKS_URL)),
  membership: denyAllMemberships,
});

const app = createApp({ authenticate: authenticator, acl: denyAllAcl });

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  // eslint-disable-next-line no-console
  console.log(`agntia-seguros api listening on ${info.port} (membership/ACL not wired: fail-closed)`);
});
