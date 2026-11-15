import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { randomUUID } from "node:crypto";
import { ServiceError, envelopeSchema, hashPayload, isServiceError, opaqueIdSchema } from "@agntia/contracts";
import type { ErrorEnvelope } from "@agntia/contracts";
import { authorize, type AclStore } from "./pep";
import type { Principal } from "./principal";
import { sha256Hex } from "./hash";

export interface AppDependencies {
  readonly authenticate: (authorizationHeader: string | undefined) => Promise<Principal>;
  readonly acl: AclStore;
}

interface AppVariables {
  correlationId: string;
  principal: Principal;
}

function toErrorEnvelope(error: ServiceError, correlationId: string): ErrorEnvelope {
  return {
    error: {
      code: error.code,
      message: error.message,
      correlationId,
      retryable: error.retryable,
      reconciliationRequired: error.reconciliationRequired,
    },
  };
}

/**
 * HTTP surface (C35 shape, C03 auth, C05 envelopes).
 * Only named, allowlisted routes exist. There is no generic proxy, no free SQL,
 * no arbitrary HTTP and no `/execute`.
 */
export function createApp(deps: AppDependencies) {
  const app = new Hono<{ Variables: AppVariables }>();

  app.use("*", async (c, next) => {
    const correlationId = c.req.header("x-correlation-id") ?? randomUUID();
    c.set("correlationId", correlationId);
    await next();
    c.header("x-correlation-id", correlationId);
  });

  app.get("/health", (c) => c.json({ status: "ok" }));

  app.use("/v1/*", async (c, next) => {
    const principal = await deps.authenticate(c.req.header("authorization"));
    c.set("principal", principal);
    await next();
  });

  app.get("/v1/seguros/me", (c) => {
    const principal = c.get("principal");
    return c.json({
      userId: principal.userId,
      tenantId: principal.tenantId,
      roles: [...principal.roles],
      scopes: [...principal.scopes],
    });
  });

  app.get("/v1/seguros/resources/:kind/:id", async (c) => {
    const principal = c.get("principal");
    const resource = { kind: c.req.param("kind"), id: c.req.param("id") };
    await authorize({ principal, capability: "insurance.policy.read", resource, acl: deps.acl });
    return c.json({ resource });
  });

  app.post("/v1/seguros/proposals/preview", async (c) => {
    const principal = c.get("principal");
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      throw new ServiceError("INVALID_INPUT", "body must be valid JSON");
    }

    const parsed = envelopeSchema.safeParse(body);
    if (!parsed.success) {
      throw new ServiceError("INVALID_INPUT", "invalid envelope", {
        details: parsed.error.issues.map((issue) => ({ path: issue.path.join("."), code: issue.code })),
      });
    }
    const envelope = parsed.data;

    // The ACL applies to the real resource the proposal is about, not to a
    // client-chosen operation id.
    const resourceId = opaqueIdSchema.safeParse(envelope.payload["resourceId"]);
    if (!resourceId.success) {
      throw new ServiceError("UNPROCESSABLE", "payload.resourceId must be an opaque resource id");
    }

    await authorize({
      principal,
      capability: "insurance.proposal.preview",
      resource: { kind: "policy", id: resourceId.data },
      acl: deps.acl,
    });

    // Envelope scope is a claim; the verified principal is the authority.
    if (envelope.tenantId !== principal.tenantId || envelope.actorId !== principal.userId) {
      throw new ServiceError("FORBIDDEN", "envelope scope does not match verified principal");
    }
    if (envelope.capability !== "insurance.proposal.preview") {
      throw new ServiceError("FORBIDDEN", "envelope capability does not match the route");
    }

    // Preview only: no write, no outbox, no remote call.
    return c.json({
      schemaVersion: 1,
      operationId: envelope.operationId,
      status: "proposed" as const,
      dryRun: true as const,
      payloadHash: hashPayload(envelope.payload, sha256Hex),
    });
  });

  app.post("/v1/seguros/intents", async (c) => {
    const principal = c.get("principal");
    await authorize({
      principal,
      capability: "insurance.intent.execute",
      resource: { kind: "intent", id: "blocked_by_policy" },
      acl: deps.acl,
    });
    // Unreachable while the capability is disabled.
    throw new ServiceError("FORBIDDEN", "side-effecting intents are disabled in this deployment");
  });

  app.onError((error, c) => {
    const correlationId = c.get("correlationId") ?? randomUUID();
    if (isServiceError(error)) {
      return c.json(toErrorEnvelope(error, correlationId), error.status as ContentfulStatusCode);
    }
    // Unknown failure: generic body, no stack, no details.
    return c.json(
      toErrorEnvelope(new ServiceError("INTERNAL", "internal error"), correlationId),
      500 as ContentfulStatusCode,
    );
  });

  app.notFound((c) =>
    c.json(
      toErrorEnvelope(new ServiceError("NOT_FOUND", "route not found"), c.get("correlationId") ?? randomUUID()),
      404 as ContentfulStatusCode,
    ),
  );

  return app;
}
