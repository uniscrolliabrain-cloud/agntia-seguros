# SEG-C06 — Persistencia, RLS y migraciones

**DESIGN_ONLY · NOT_STARTED · 6/42.** [Campaña original](../../../campaigns/06-persistencia-rls-y-migraciones.md). Esta documentación no acredita cobertura ni implementación.

## Objetivo y límites
Construir/verificar persistencia, rls y migraciones para Operaciones y asistencia profesional de seguros, preservando: FK/consultas/roles reales impiden contaminación.

**Operación nominada:** `storage.migrate`. **Campos:** tenantFK, objectVersion, outbox, audit, idempotency. **Invariante:** FK/consultas/roles reales impiden contaminación. **Dependencias:** SEG-C05.

## Ownership y archivos propuestos
- Superficie primaria: `packages/db/migrations/001_init.sql` (validar en checkout, no asumir existencia).
- DTO Zod: `packages/contracts/src/06.ts` si corresponde.
- API Hono: `apps/api/src/routes/06.ts` solo si operación autorizada.
- Tests: `tests/campaigns/006.test.ts`, fixtures `tests/fixtures/006/`.
- Artefactos originales: `docs/implementation/06-persistencia-rls-y-migraciones/README.md`, `docs/implementation/06-persistencia-rls-y-migraciones/EVIDENCE.md`, `docs/implementation/06-persistencia-rls-y-migraciones/TESTS.md`, `docs/implementation/06-persistencia-rls-y-migraciones/RISKS.md`.
- Reporte de Freebuff en este CAMPAIGN.md; evidencia extendida en docs/implementation/06-persistencia-rls-y-migraciones/.

## Patchsets secuenciales
### 006.01 — SEG-C06-T01: Congelar fuentes, ámbito y autoridad
**Acción:** Cotejar tenantFK, objectVersion, outbox, audit, idempotency con originales, contrato del tenant y versiones de fuente/proveedor. Registrar qué es hecho, declaración, inferencia o desconocido; revisar alcance territorial/temporal y reglas del módulo.

**Superficie:** `packages/db/migrations/001_init.sql`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** AuthorityMap y fixture explícitos; FK/consultas/roles reales impiden contaminación. La ausencia de fuente genera pendiente, no un valor plausible.

**Dependencia:** inicio. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 006.02 — SEG-C06-T02: Definir DTO y frontera de datos
**Acción:** Diseñar esquema runtime para tenantFK, objectVersion, outbox, audit, idempotency: tipos, límites, IDs opacos, enums, fechas y versión. Conservar los campos nativos aplicables y declarar nuevos los del servicio. Aislar tenant/proyecto/recurso y minimizar PII.

**Superficie:** `packages/db/migrations/001_init.sql`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** Round-trip y rechazo de extra/valor inválido; referencias cruzadas no son posibles; source/actor/updatedAt y EvidenceRef preservados donde correspondan.

**Dependencia:** SEG-C06-T01. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 006.03 — SEG-C06-T03: Aplicar lógica determinista y revisión
**Acción:** Implementar o documentar el paso `storage.migrate` mediante guards, estados y expectedVersion/CAS. Separar propuesta del modelo de cálculo/decisión verificables. PolicyProjection separa condiciones particulares/generales/endosos y fechas, cada conclusión con cláusula/evidencia/unknown. RuleEvaluation guarda reglas atómicas y composición versionada; no inferir exclusiones, franquicias o precedencias. Estimate usa Decimal/currency y parámetros revisados, marcada ilustrativa. AdverseDecision y binding solo se registran desde prueba del operador competente, nunca por mayoría de modelos.

**Superficie:** `packages/db/migrations/001_init.sql`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** El estado final, el protegido y los motivos de bloqueo son comprobables; Caída durante commit no deja historia/intención parcial. No eval/SQL/shell/HTTP genérico del LLM.

**Dependencia:** SEG-C06-T02. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 006.04 — SEG-C06-T04: Adaptar con permisos mínimos
**Acción:** Comprobar versión/edición/ACL de backend si esta fase lo usa; fields/métodos allowlist y binding de servidor. Si es fase local/documental no añadir HTTP. Normalizar errores y limitar IO/tamaño/tiempo/coste de `storage.migrate`.

**Superficie:** `packages/db/migrations/001_init.sql`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** Unknown/unsupported/forbidden no se simulan como éxito; cero HTTP con principal o conexión no autorizados; prueba fake no habilita capability real.

**Dependencia:** SEG-C06-T03. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 006.05 — SEG-C06-T05: Vincular autorización y efectos
**Acción:** Crear preview sin efecto remoto, diff/hash de datos y revisión; identificar quién acepta el resultado y quién puede ejecutar. Si hay efecto, exigir policy/approval/mandato vigentes y un único intent durable con idempotency key.

**Superficie:** `packages/db/migrations/001_init.sql`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** Cambiar tenantFK o materialidad del payload invalida la autorización aplicable. Replay igual no duplica; distinto contenido con misma key da conflicto.

**Dependencia:** SEG-C06-T04. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 006.06 — SEG-C06-T06: Ejecutar pruebas de negocio y fallo
**Acción:** Preparar y ejecutar caso específico: Caída durante commit no deja historia/intención parcial. Añadir A/B/P, humano/agente/colaborador, revocación, dato sin fuente, cambio concurrente y crash pertinente a `storage.migrate`. Verificar ausencia de efectos prohibidos: Análisis o estimación se comunica como cobertura/indemnización garantizada, o se usa un dato sensible no autorizado para decidir.

**Superficie:** `packages/db/migrations/001_init.sql`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** El contrato estricto exige resultado correcto y trayectoria segura. Test fallido crítico bloquea; sin entorno se registra NOT_VERIFIED, nunca PASS por un mock.

**Dependencia:** SEG-C06-T05. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 006.07 — SEG-C06-T07: Registrar evidencia y cerrar gate
**Acción:** Guardar SHA/diff, versiones, fixture antes/después, actor/mandato/correlación, fuentes y receipts mínimos. Registrar tests reales y coste/latencia cuando existan. Actualizar riesgos, rollback y siguiente dependencia sin escribir en agente.

**Superficie:** `packages/db/migrations/001_init.sql`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** EVIDENCE/TESTS/RISKS y decisión de gate revisables; ninguna cifra, firma, actividad o integración inventadas. Mantener fuera del repo público PII, credenciales y originales restringidos.

**Dependencia:** SEG-C06-T06. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.


## Wiring transversal
JWT Supabase+membresía → actor/twin+tenant y mandato → ACL cliente/póliza/siniestro → Zod DTO → policy/AuthorityMap y rol regulado → documento original+endosos+vigencia → PolicyProjection con cláusulas/evidence/unknown → propuesta/revisión profesional → RLS+audit/outbox → adaptador allowlist → receipt del operador → bridge padre. No suscribir, vincular cobertura, denegar siniestros, calcular indemnización definitiva ni presentar reclamaciones automáticamente. Estimaciones Decimal ilustrativas; datos sensibles minimizados.

## Gates pendientes
- **SEG-C06-G01 / NOT_EXECUTED:** Caída durante commit no deja historia/intención parcial. **Esperado:** Resultado y estado protegido coherentes con invariante, revisión/receipt donde correspondan.
- **SEG-C06-G02 / NOT_EXECUTED:** Principal/mandato inválido, recurso o conexión de otro tenant, o versión cambiada intenta storage.migrate.. **Esperado:** Fail-closed antes de leer/actuar remotamente; sin fuga o ampliación de scope, con intento auditado.

**Bloqueos:** Cross-tenant o secretos expuestos; Approval/mandato/scope ampliados sin autorización; Pérdida de historia o duplicación tras timeout; Conclusión sensible sin fuentes/revisión competente.

**Rollback:** Deshabilitar capacidad o flag y detener efectos nuevos; conservar audit, links, intents, snapshots y receipts. Restore probado con restricciones/supresiones reaplicadas; no borrar efectos remotos para fingir reversión.

## Reporte Freebuff — completar al terminar
Estado: STUB (sin entorno/proveedor). SHA inicial: d92af6f (main congelado). Archivos: packages/persistence/src/index.ts (InMemoryRepository, PostgresRepository stub, membership y ACL) + db/migrations/0001_foundations.sql.
Tests/fixtures: 6 tests
Gates: G01 PASS unitario (aislamiento por tenant y conflicto de version); G02 NOT_VERIFIED (RLS real)
Incoherencias/decisiones: PostgresRepository lanza NOT_IMPLEMENTED a proposito; el DDL existe pero no se ha ejecutado.
Riesgos/deuda: stub honesto, no capacidad real; requiere proveedor/entorno para PASS.
Aprendizajes: un stub que falla cerrado y lo dice es mejor que un mock que aparenta.
