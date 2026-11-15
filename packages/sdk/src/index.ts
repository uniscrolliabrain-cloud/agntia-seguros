import { ServiceError, capabilitySchema } from "@agntia/contracts";

/**
 * C35 — Tool catalogue exposed to the model.
 * Only read/propose tools. Anything that approves, sends, exports everything,
 * binds, pays or executes is absent by construction, so a prompt cannot request
 * it: the name does not exist.
 */
export const TOOL_CATALOGUE = [
  { name: "insurance_policy_read", capability: "insurance.policy.read", sideEffects: false },
  { name: "insurance_document_preview", capability: "insurance.proposal.preview", sideEffects: false },
  { name: "insurance_need_propose", capability: "insurance.proposal.preview", sideEffects: false },
  { name: "insurance_comparison_preview", capability: "insurance.estimate.preview", sideEffects: false },
  { name: "insurance_claim_prepare", capability: "insurance.claim.prepare", sideEffects: false },
  { name: "insurance_explain_evidence", capability: "insurance.policy.read", sideEffects: false },
] as const;

export type ToolName = (typeof TOOL_CATALOGUE)[number]["name"];

const FORBIDDEN_PATTERN =
  /(^|_)(execute|approve|send|export_all|bind|pay|settle|delete|admin|shell|sql|http|fetch_url)($|_)/;

export function assertToolAllowed(name: string): void {
  if (FORBIDDEN_PATTERN.test(name)) {
    throw new ServiceError("FORBIDDEN", "tool is not in the catalogue");
  }
  const tool = TOOL_CATALOGUE.find((candidate) => candidate.name === name);
  if (!tool) {
    throw new ServiceError("FORBIDDEN", "unknown tool");
  }
  if (tool.sideEffects) {
    throw new ServiceError("FORBIDDEN", "side-effecting tool is disabled");
  }
  capabilitySchema.parse(tool.capability);
}

export function toolCatalogueFor(scopes: readonly string[]): readonly ToolName[] {
  const granted = new Set(scopes);
  return TOOL_CATALOGUE.filter((tool) => granted.has(tool.capability)).map((tool) => tool.name);
}

/**
 * Server SDK. Named endpoints only; no path is taken from the caller's input.
 */
export interface SegurosClientOptions {
  readonly baseUrl: string;
  readonly accessToken: string;
  readonly fetchImpl?: typeof fetch;
}

export interface SegurosClient {
  me(): Promise<unknown>;
  previewProposal(envelope: unknown): Promise<unknown>;
}

const ALLOWED_PATHS = new Set(["/v1/seguros/me", "/v1/seguros/proposals/preview"]);

function assertAllowedPath(path: string): void {
  if (!ALLOWED_PATHS.has(path)) {
    throw new ServiceError("FORBIDDEN", "path is not allowlisted");
  }
}

export function createSegurosClient(options: SegurosClientOptions): SegurosClient {
  const base = options.baseUrl.replace(/\/+$/, "");
  const doFetch = options.fetchImpl ?? fetch;

  async function call(path: string, init?: RequestInit): Promise<unknown> {
    assertAllowedPath(path);
    const response = await doFetch(`${base}${path}`, {
      ...init,
      headers: {
        authorization: `Bearer ${options.accessToken}`,
        "content-type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
    const body: unknown = await response.json();
    if (!response.ok) {
      throw new ServiceError("UPSTREAM_INVALID", "seguros api returned an error", { details: body });
    }
    return body;
  }

  return {
    me: () => call("/v1/seguros/me"),
    previewProposal: (envelope) =>
      call("/v1/seguros/proposals/preview", { method: "POST", body: JSON.stringify(envelope) }),
  };
}
