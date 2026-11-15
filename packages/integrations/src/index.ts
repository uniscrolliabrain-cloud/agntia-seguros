import { z } from "zod";
import { ServiceError, opaqueIdSchema } from "@agntia/contracts";
import { capabilityReportSchema, type CapabilityReport } from "@agntia/runtime";

/**
 * C21 / C22 — Provider adapters.
 *
 * Both are STUBS on purpose. Installing openIMIS (AGPLv3, modules and
 * dependencies unreviewed) or OasisLMF (model licence and exposure data
 * required) is out of scope, and a simulated backend would be a fabricated
 * capability. The stubs declare `not_configured` and refuse every operation;
 * they expose no write methods at all, so there is no hidden path to `bind`,
 * `settle` or `pay`.
 *
 * When a real instance exists, `capabilities()` must only report
 * `verified_runtime` after an authenticated probe, and this file is the place to
 * add the transport.
 */
export interface ProviderAdapter {
  readonly providerRef: string;
  readonly kind: "openimis" | "oasis";
  capabilities(): Promise<CapabilityReport>;
  readPolicy(policyRef: string): Promise<never>;
}

const CHECKED_AT = "1970-01-01T00:00:00Z";

export interface AdapterConfig {
  readonly deployment: string;
  readonly edition: string;
}

export function createOpenImisStub(config: AdapterConfig): ProviderAdapter {
  const report: CapabilityReport = capabilityReportSchema.parse({
    providerRef: "prov_openimis",
    deployment: config.deployment,
    edition: config.edition,
    operations: [
      { operation: "policy.read", state: "not_configured", evidenceRef: null, checkedAt: CHECKED_AT },
      { operation: "claim.read", state: "not_configured", evidenceRef: null, checkedAt: CHECKED_AT },
    ],
  });
  return {
    providerRef: "prov_openimis",
    kind: "openimis",
    capabilities: async () => report,
    readPolicy: async (policyRef: string) => {
      opaqueIdSchema.parse(policyRef);
      throw new ServiceError("FORBIDDEN", "openIMIS adapter is not configured", {
        details: { reason: "CAPABILITY_NOT_VERIFIED", provider: "openimis" },
      });
    },
  };
}

export function createOasisStub(config: AdapterConfig): ProviderAdapter {
  const report: CapabilityReport = capabilityReportSchema.parse({
    providerRef: "prov_oasis",
    deployment: config.deployment,
    edition: config.edition,
    operations: [{ operation: "cat-model.run", state: "not_configured", evidenceRef: null, checkedAt: CHECKED_AT }],
  });
  return {
    providerRef: "prov_oasis",
    kind: "oasis",
    capabilities: async () => report,
    readPolicy: async (policyRef: string) => {
      opaqueIdSchema.parse(policyRef);
      throw new ServiceError("FORBIDDEN", "Oasis adapter is not configured", {
        details: { reason: "CAPABILITY_NOT_VERIFIED", provider: "oasis" },
      });
    },
  };
}

/** Oasis also requires a model licence; without it the job must not exist. */
export const oasisLicenceRequirementSchema = z.strictObject({
  modelLicenceRef: opaqueIdSchema.nullable(),
  exposureAggregateRef: opaqueIdSchema.nullable(),
});

export function assertOasisPreconditions(input: unknown): void {
  const parsed = oasisLicenceRequirementSchema.parse(input);
  if (parsed.modelLicenceRef === null || parsed.exposureAggregateRef === null) {
    throw new ServiceError("FORBIDDEN", "catastrophe model is blocked by licence or exposure", {
      details: {
        reason: "CAT_MODEL_PRECONDITIONS_MISSING",
        missing:
          parsed.modelLicenceRef === null
            ? ["modelLicence"]
            : ["exposure"],
      },
    });
  }
}
