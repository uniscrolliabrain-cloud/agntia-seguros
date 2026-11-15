import { describe, expect, it } from "vitest";
import { assertToolAllowed, createSegurosClient, toolCatalogueFor } from "./index";

describe("tool catalogue", () => {
  it("allows the read and propose tools", () => {
    expect(() => assertToolAllowed("insurance_policy_read")).not.toThrow();
    expect(() => assertToolAllowed("insurance_claim_prepare")).not.toThrow();
  });

  it("refuses effect, shell, SQL and admin style tools", () => {
    for (const name of [
      "insurance_execute",
      "insurances_approve",
      "export_all",
      "insurance_bind_policy",
      "admin_shell",
      "run_sql",
      "http_fetch_url",
    ]) {
      expect(() => assertToolAllowed(name)).toThrow(/not in the catalogue/);
    }
  });

  it("refuses unknown names", () => {
    expect(() => assertToolAllowed("totally_made_up")).toThrow(/unknown tool/);
  });

  it("filters the catalogue by granted scopes", () => {
    expect(toolCatalogueFor(["insurance.policy.read"])).toEqual([
      "insurance_policy_read",
      "insurance_explain_evidence",
    ]);
    expect(toolCatalogueFor([])).toEqual([]);
  });
});

describe("server sdk", () => {
  it("calls only allowlisted paths with the bearer token", async () => {
    const calls: string[] = [];
    const fetchImpl = async (input: string | URL | Request) => {
      calls.push(String(input));
      return new Response(JSON.stringify({ userId: "user-a", tenantId: "tenant-a" }), { status: 200 });
    };
    const client = createSegurosClient({
      baseUrl: "https://api.example/",
      accessToken: "token-123",
      fetchImpl: fetchImpl as typeof fetch,
    });
    await client.me();
    expect(calls).toEqual(["https://api.example/v1/seguros/me"]);
  });

  it("surfaces an api error as a service error without leaking body shape", async () => {
    const fetchImpl = async () =>
      new Response(JSON.stringify({ error: { code: "FORBIDDEN" } }), { status: 403 });
    const client = createSegurosClient({
      baseUrl: "https://api.example",
      accessToken: "token-123",
      fetchImpl: fetchImpl as typeof fetch,
    });
    await expect(client.me()).rejects.toMatchObject({ code: "UPSTREAM_INVALID" });
  });
});
