/**
 * C34 — Portal shell and presence.
 *
 * The shell is real HTML but carries no data, no session and no avatar: without
 * an Anam plan/session there is nothing to show, and simulating a person on
 * screen would misrepresent the service. The Anam helper returns a status, never
 * a token, and never an API key.
 */
const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ESCAPES[character] ?? character);
}

export interface PortalShellInput {
  readonly tenantLabel: string;
  readonly statuses: readonly string[];
}

export function renderPortalShell(input: PortalShellInput): string {
  const statusItems = input.statuses
    .map((status) => `<li>${escapeHtml(status)}</li>`)
    .join("\n        ");
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; img-src 'none'" />
    <title>Agntia Seguros — ${escapeHtml(input.tenantLabel)}</title>
  </head>
  <body>
    <a href="#contenido">Saltar al contenido</a>
    <header>
      <h1>Asistencia de seguros</h1>
      <p>Ámbito: ${escapeHtml(input.tenantLabel)}</p>
    </header>
    <main id="contenido">
      <h2>Estado del encargo</h2>
      <ul>
        ${statusItems}
      </ul>
      <p>Presencia por avatar no disponible en este entorno. No hay sesión de voz activa.</p>
    </main>
    <footer>
      <p>Modo piloto: sin contratación, sin cobro de primas, sin vinculación de cobertura y sin decisión de siniestros.</p>
    </footer>
  </body>
</html>`;
}

export interface AnamSessionStatus {
  readonly status: "not_configured" | "requires_operator_approval";
  readonly reason: string;
}

export interface AnamConfig {
  readonly apiKeyRef: string | null;
  readonly planRef: string | null;
}

export function createAnamSession(config: AnamConfig): AnamSessionStatus {
  if (config.apiKeyRef === null || config.planRef === null) {
    return { status: "not_configured", reason: "ANAM_NOT_CONFIGURED" };
  }
  return { status: "requires_operator_approval", reason: "ANAM_SESSION_REQUIRES_HUMAN_APPROVAL" };
}
