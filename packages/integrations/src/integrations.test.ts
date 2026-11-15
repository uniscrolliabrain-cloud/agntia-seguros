import { describe, expect, it } from "vitest";
import {
  assertOasisPreconditions,
  createOasisStub,
  createOpenImisStub,
} from "./index";
import { assertWriteForbidden, isOperationUsable, requireUsableOperation } from "@agntia/runtime";

const config = { deployment: "sandbox", edition: "community" };

describe("C21 openIMIS stub", () => {
  it("declares not_configured and refuses reads", async () => {
    const adapter = createOpenImisStub(config);
    const report = await adapter.capabilities();
    expect(isOperationUsable(report, "policy.read")).toBe(false);
    expect(() => assertWriteForbidden(report)).not.toThrow();
    await expect(adapter.readPolicy("policy_000001")).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("fails closed through the shared capability guard", async () => {
    const report = await createOpenImisStub(config).capabilities();
    expect(() => requireUsableOperation(report, "policy.read")).toThrow(/not verified/);
  });

  it("exposes no write operations at all", () => {
    const adapter = createOpenImisStub(config);
    expect(Object.keys(adapter)).not.toContain("bindPolicy");
    expect(Object.keys(adapter)).not.toContain("settleClaim");
  });
});

describe("C22 Oasis stub", () => {
  it("refuses the model run and requires licence plus exposure", async () => {
    const adapter = createOasisStub(config);
    const report = await adapter.capabilities();
    expect(isOperationUsable(report, "cat-model.run")).toBe(false);
    await expect(adapter.readPolicy("policy_000001")).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(() => assertOasisPreconditions({ modelLicenceRef: null, exposureAggregateRef: "exp_000001" })).toThrow(
      /licence or exposure/,
    );
    expect(() =>
      assertOasisPreconditions({ modelLicenceRef: "lic_000001", exposureAggregateRef: "exp_000001" }),
    ).not.toThrow();
  });
});
