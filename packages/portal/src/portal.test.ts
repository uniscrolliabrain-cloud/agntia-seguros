import { describe, expect, it } from "vitest";
import { createAnamSession, escapeHtml, renderPortalShell } from "./index";

describe("C34 portal shell", () => {
  it("escapes hostile labels and keeps a restrictive CSP", () => {
    const html = renderPortalShell({
      tenantLabel: '<script>alert(1)</script>',
      statuses: ['necesidad "pendiente"'],
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("default-src 'none'");
    expect(html).toContain('lang="es"');
    expect(html).toContain("Saltar al contenido");
    expect(html).toContain("sin decisión de siniestros");
  });

  it("escapes every dangerous character", () => {
    expect(escapeHtml(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&#39;");
  });
});

describe("C34 Anam stub", () => {
  it("reports not_configured without a plan and never returns a token", () => {
    const status = createAnamSession({ apiKeyRef: null, planRef: null });
    expect(status.status).toBe("not_configured");
    expect(Object.keys(status)).not.toContain("token");
  });

  it("still requires human approval when configured", () => {
    const status = createAnamSession({ apiKeyRef: "ref_00000001", planRef: "ref_00000002" });
    expect(status.status).toBe("requires_operator_approval");
    expect(JSON.stringify(status)).not.toMatch(/ref_00000001|ref_00000002/);
  });
});
