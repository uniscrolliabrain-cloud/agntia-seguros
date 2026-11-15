# Informe final Freebuff — agntia-seguros

**2026-11-14 · baseline `main` = `d92af6fb645c479d1b24c4c8004dcbc2a7ca67c4`**

## Este documento NO es una aceptación

No se declara producto terminado, paridad, cumplimiento ni `PRODUCTION_READY`. Se han recorrido
las 42 campañas y cada una tiene reporte propio dentro de su `CAMPAIGN.md`. El resultado honesto es:

| Resultado | Campañas | Significado |
|---|---|---|
| PASS | 28 (27 unitario + 1 documental) | La invariante del módulo está implementada y cubierta por tests unitarios |
| STUB | 9 (C04, C06, C21, C22, C34, C36, C38, C40, C41) | Código y tests reales que fallan cerrado; falta proveedor, entorno o puente al padre |
| PARTIAL | 4 (C02, C27, C37, C39) | Lógica presente, sin persistencia o sin cooperación real |
| NOT_PASS | 1 (C42) | Aceptación explícitamente no declarada |

**Ningún gate de los 84 tiene evidencia de entorno real.** Los gates G01 de dominio están cubiertos
en miniatura por tests unitarios; los G02 transversales se cubren parcialmente con la matriz JWT y
el PEP de dos tenants simulados. Un mock nunca se ha contado como proveedor.

## Qué existe y se ejecuta

| Superficie | Verificación |
|---|---|
| `packages/contracts` — dinero, envelope, errores, canonical, authority, approval, dominio | 21 tests |
| `packages/domain` — C09–C20, C23–C33 | 42 tests |
| `packages/runtime` — intents idempotentes, outbox con ACK, discovery | 10 tests |
| `packages/sdk` — catálogo de tools y cliente allowlistado | 6 tests |
| `packages/identity` — twin binding, mandato e host bridge stub | 4 tests |
| `packages/integrations` — stubs openIMIS/Oasis fail-closed | 4 tests |
| `packages/persistence` — repositorio tenant-scoped y stub Postgres | 6 tests |
| `packages/portal` — shell HTML con CSP y stub Anam | 4 tests |
| `packages/telemetry` — presupuesto, uso medido y logs redactados | 5 tests |
| `packages/vertical` — vertical en proceso C40 | 3 tests |
| `apps/api` — JWT Supabase, PEP, rutas nominadas, envelope cerrado | 28 tests |
| `db/migrations/0001_foundations.sql` | escrito, **no ejecutado** |
| `.github/workflows/ci.yml` | instalación, typecheck y tests; sin despliegue |

Comandos: `pnpm run typecheck` (11 proyectos) y `pnpm run test` (12 archivos, 133 tests).

## Límites duros que quedan abiertos

1. **Sin Postgres/Supabase real**: RLS, constraints, privilegios y `service_role` sin probar.
2. **Sin proveedor**: openIMIS y OASISLMF siguen `not_configured`; ninguna capacidad `verified_runtime`.
3. **Sin sesión de voz**: hay shell HTML real con CSP, pero no hay avatar ni plan Anam; el stub lo declara.
4. **Sin bridge operativo al padre**: existe contrato y stub que devuelve `HOST_BRIDGE_NOT_VERIFIED`; no hay transporte.
5. **Sin efectos externos**: `insurance.intent.execute` declarada y deshabilitada; nunca se envió nada.
6. **Sin auditoría Codex ni meta-auditoría Astra**: los contratos pueden cambiar.

## Qué significa STUB aquí

Un stub es código real, tipado y con tests, que **falla cerrado y lo declara**: openIMIS y Oasis responden
`FORBIDDEN` con `CAPABILITY_NOT_VERIFIED`, el repositorio Postgres lanza `NOT_IMPLEMENTED`, el bridge no
resuelve identidad y Anam no devuelve token. Ninguno simula un proveedor ni aprueba un gate. Cuando
exista el entorno, el mismo contrato recibe la implementación real sin cambiar a los llamadores.

## Decisiones tomadas ante ambigüedad

- El ACL de una propuesta se aplica al **recurso real** del payload, no al `operationId` del cliente.
- `reviewExtraction` usa umbral 0.95 por defecto: por debajo, revisión competente obligatoria.
- Un hecho ausente en el motor de reglas produce `unknown`, nunca `false`.
- La comparación de ofertas no ordena por precio y devuelve `suitability: not_assessed`.
- La restauración de privacidad devuelve lo no suprimido y conserva las supresiones explícitas.
- C04/C21/C22/C34/C36/C38/C40/C41 se marcan BLOCKED en lugar de implementar un simulacro.

## Para la auditoría (Codex)

Revisar, por este orden: `apps/api/src/principal.ts` (derivación de principal), `pep.ts` (deny-by-default),
`packages/contracts/src/approval.ts` (binding), `packages/runtime/src/index.ts` (idempotencia y
reconciliación), `packages/domain/src/market.ts` (reglas y estimación), y el DDL de RLS.
Reproducir con `pnpm install && pnpm run check`. Cualquier afirmación de este informe sin comando
asociado debe tratarse como no verificada.
