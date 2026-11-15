# Evidencia — fundaciones C01/C02/C03/C05/C06/C07

**Fecha:** 2026-11-14 · **Baseline:** `main` = `d92af6fb645c479d1b24c4c8004dcbc2a7ca67c4`
**Estado global:** fundaciones parcialmente implementadas. **Ningún gate de proveedor, RLS ni Supabase real está verificado.**

## Qué se ha construido

| Superficie | Archivos | Estado |
|---|---|---|
| Workspace pnpm + TS estricto | `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `pnpm-lock.yaml` | Funciona |
| Contratos runtime (C05) | `packages/contracts/src/{errors,ids,money,envelope,canonical,authority,approval,insurance}.ts` | 21 tests verdes |
| Auth Supabase (C03) | `apps/api/src/principal.ts` | 12 tests verdes |
| PEP y API nominada (C02/C35) | `apps/api/src/{pep,app,server,env,hash}.ts` | 14 tests verdes |
| Persistencia (C06) | `db/migrations/0001_foundations.sql` | **Escrita, NO ejecutada** |

## Comandos ejecutados y resultado real

```
npx --yes pnpm@10.20.0 install        -> exit 0 (pnpm-lock.yaml generado)
npx --yes pnpm@10.20.0 run typecheck  -> exit 0
npx --yes pnpm@10.20.0 run test       -> exit 0, 49 tests
```

Detalle de la última ejecución: 21 tests de contratos + 14 de API + 14 `it.each` heredados = 49 casos, 0 fallos.

## Gates

| Gate | Resultado | Evidencia |
|---|---|---|
| C01-G01 baseline congelado | PASS (documental) | SHA `d92af6f`, 174 archivos, cero código previo |
| C02-G01 un solo ejecutor por efecto | PASS | duplicado → `CONFLICT` |
| C03-G01 cross-tenant / token ajeno | PASS (unitario) | 12 casos JWT |
| C03-G02 fail-closed | PASS (unitario) | sin membresía → `FORBIDDEN`, sin fallback |
| C05-G01 floats/NaN/campos extra | PASS | `moneySchema`, `envelopeSchema` estricto |
| C06-G01/G02 RLS real | **NOT_VERIFIED** | sin Postgres disponible |
| C07-G01 approval invalidada por cambio | PASS | hash, versión, tenant, destinatario |
| C07-G02 approval antes de efecto | PASS (unitario) | `assertApprovalValid` previo a cualquier intención |

## Lo que NO está hecho (no confundir con terminado)

- **RLS sin ejecutar.** La migración no se ha aplicado; ni constraints, ni políticas, ni privilegios probados.
- **Supabase real sin probar.** `createRemoteJWKSet` no se ha ejercitado contra un proyecto; los tests usan JWKS local con claves generadas.
- **Membresía y ACL son interfaces.** `server.ts` arranca con resolutores que niegan todo (fail-closed honesto). No hay persistencia todavía.
- **No hay outbox, workers, intents durables ni receipts.** C06/C07 los exigen; solo existe el DDL propuesto.
- **C02 AuthorityMap es contrato en memoria**, no un registro por encargo en base de datos.
- **No hay efecto externo alguno implementado**: `insurance.intent.execute` está declarada y deshabilitada, y su ruta devuelve 403 por diseño.
- **Sin auditoría Codex.** Los contratos pueden cambiar tras la meta-auditoría de Astra.

## Siguiente tramo

C06 real (Postgres desechable, dos tenants, pruebas de RLS con rol de aplicación) → outbox/inbox/intents con idempotencia durable → C08 discovery con `CapabilityReport` y allowlist de endpoints.
