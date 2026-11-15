# SEG-C32 — Privacidad y conservación sectorial

**DESIGN_ONLY · NOT_STARTED · 32/42.** [Campaña original](../../../campaigns/32-privacidad-y-conservacion-sectorial.md). Esta documentación no acredita cobertura ni implementación.

## Objetivo y límites
Construir/verificar privacidad y conservación sectorial para Operaciones y asistencia profesional de seguros, preservando: Datos sensibles con purpose mínimo y acceso por expediente.

**Operación nominada:** `insurance.privacy.preview`. **Campos:** healthScope, retention, legalHold, exportACL. **Invariante:** Datos sensibles con purpose mínimo y acceso por expediente. **Dependencias:** SEG-C31.

## Ownership y archivos propuestos
- Superficie primaria: `packages/security/src/sector-retention.ts` (validar en checkout, no asumir existencia).
- DTO Zod: `packages/contracts/src/32.ts` si corresponde.
- API Hono: `apps/api/src/routes/32.ts` solo si operación autorizada.
- Tests: `tests/campaigns/032.test.ts`, fixtures `tests/fixtures/032/`.
- Artefactos originales: `docs/implementation/32-privacidad-y-conservacion-sectorial/README.md`, `docs/implementation/32-privacidad-y-conservacion-sectorial/EVIDENCE.md`, `docs/implementation/32-privacidad-y-conservacion-sectorial/TESTS.md`, `docs/implementation/32-privacidad-y-conservacion-sectorial/RISKS.md`.
- Reporte de Freebuff en este CAMPAIGN.md; evidencia extendida en docs/implementation/32-privacidad-y-conservacion-sectorial/.

## Patchsets secuenciales
### 032.01 — SEG-C32-T01: Congelar fuentes, ámbito y autoridad
**Acción:** Cotejar healthScope, retention, legalHold, exportACL con originales, contrato del tenant y versiones de fuente/proveedor. Registrar qué es hecho, declaración, inferencia o desconocido; revisar alcance territorial/temporal y reglas del módulo.

**Superficie:** `packages/security/src/sector-retention.ts`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** AuthorityMap y fixture explícitos; Datos sensibles con purpose mínimo y acceso por expediente. La ausencia de fuente genera pendiente, no un valor plausible.

**Dependencia:** inicio. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 032.02 — SEG-C32-T02: Definir DTO y frontera de datos
**Acción:** Diseñar esquema runtime para healthScope, retention, legalHold, exportACL: tipos, límites, IDs opacos, enums, fechas y versión. Conservar los campos nativos aplicables y declarar nuevos los del servicio. Aislar tenant/proyecto/recurso y minimizar PII.

**Superficie:** `packages/security/src/sector-retention.ts`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** Round-trip y rechazo de extra/valor inválido; referencias cruzadas no son posibles; source/actor/updatedAt y EvidenceRef preservados donde correspondan.

**Dependencia:** SEG-C32-T01. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 032.03 — SEG-C32-T03: Aplicar lógica determinista y revisión
**Acción:** Implementar o documentar el paso `insurance.privacy.preview` mediante guards, estados y expectedVersion/CAS. Separar propuesta del modelo de cálculo/decisión verificables. PolicyProjection separa condiciones particulares/generales/endosos y fechas, cada conclusión con cláusula/evidencia/unknown. RuleEvaluation guarda reglas atómicas y composición versionada; no inferir exclusiones, franquicias o precedencias. Estimate usa Decimal/currency y parámetros revisados, marcada ilustrativa. AdverseDecision y binding solo se registran desde prueba del operador competente, nunca por mayoría de modelos.

**Superficie:** `packages/security/src/sector-retention.ts`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** El estado final, el protegido y los motivos de bloqueo son comprobables; Restore y export no reexponen datos de otro asegurado. No eval/SQL/shell/HTTP genérico del LLM.

**Dependencia:** SEG-C32-T02. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 032.04 — SEG-C32-T04: Adaptar con permisos mínimos
**Acción:** Comprobar versión/edición/ACL de backend si esta fase lo usa; fields/métodos allowlist y binding de servidor. Si es fase local/documental no añadir HTTP. Normalizar errores y limitar IO/tamaño/tiempo/coste de `insurance.privacy.preview`.

**Superficie:** `packages/security/src/sector-retention.ts`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** Unknown/unsupported/forbidden no se simulan como éxito; cero HTTP con principal o conexión no autorizados; prueba fake no habilita capability real.

**Dependencia:** SEG-C32-T03. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 032.05 — SEG-C32-T05: Vincular autorización y efectos
**Acción:** Crear preview sin efecto remoto, diff/hash de datos y revisión; identificar quién acepta el resultado y quién puede ejecutar. Si hay efecto, exigir policy/approval/mandato vigentes y un único intent durable con idempotency key.

**Superficie:** `packages/security/src/sector-retention.ts`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** Cambiar healthScope o materialidad del payload invalida la autorización aplicable. Replay igual no duplica; distinto contenido con misma key da conflicto.

**Dependencia:** SEG-C32-T04. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 032.06 — SEG-C32-T06: Ejecutar pruebas de negocio y fallo
**Acción:** Preparar y ejecutar caso específico: Restore y export no reexponen datos de otro asegurado. Añadir A/B/P, humano/agente/colaborador, revocación, dato sin fuente, cambio concurrente y crash pertinente a `insurance.privacy.preview`. Verificar ausencia de efectos prohibidos: Análisis o estimación se comunica como cobertura/indemnización garantizada, o se usa un dato sensible no autorizado para decidir.

**Superficie:** `packages/security/src/sector-retention.ts`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** El contrato estricto exige resultado correcto y trayectoria segura. Test fallido crítico bloquea; sin entorno se registra NOT_VERIFIED, nunca PASS por un mock.

**Dependencia:** SEG-C32-T05. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 032.07 — SEG-C32-T07: Registrar evidencia y cerrar gate
**Acción:** Guardar SHA/diff, versiones, fixture antes/después, actor/mandato/correlación, fuentes y receipts mínimos. Registrar tests reales y coste/latencia cuando existan. Actualizar riesgos, rollback y siguiente dependencia sin escribir en agente.

**Superficie:** `packages/security/src/sector-retention.ts`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** EVIDENCE/TESTS/RISKS y decisión de gate revisables; ninguna cifra, firma, actividad o integración inventadas. Mantener fuera del repo público PII, credenciales y originales restringidos.

**Dependencia:** SEG-C32-T06. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.


## Wiring transversal
JWT Supabase+membresía → actor/twin+tenant y mandato → ACL cliente/póliza/siniestro → Zod DTO → policy/AuthorityMap y rol regulado → documento original+endosos+vigencia → PolicyProjection con cláusulas/evidence/unknown → propuesta/revisión profesional → RLS+audit/outbox → adaptador allowlist → receipt del operador → bridge padre. No suscribir, vincular cobertura, denegar siniestros, calcular indemnización definitiva ni presentar reclamaciones automáticamente. Estimaciones Decimal ilustrativas; datos sensibles minimizados.

## Gates pendientes
- **SEG-C32-G01 / NOT_EXECUTED:** Restore y export no reexponen datos de otro asegurado. **Esperado:** Resultado y estado protegido coherentes con invariante, revisión/receipt donde correspondan.
- **SEG-C32-G02 / NOT_EXECUTED:** Principal/mandato inválido, recurso o conexión de otro tenant, o versión cambiada intenta insurance.privacy.preview.. **Esperado:** Fail-closed antes de leer/actuar remotamente; sin fuga o ampliación de scope, con intento auditado.

**Bloqueos:** Cross-tenant o secretos expuestos; Approval/mandato/scope ampliados sin autorización; Pérdida de historia o duplicación tras timeout; Conclusión sensible sin fuentes/revisión competente.

**Rollback:** Deshabilitar capacidad o flag y detener efectos nuevos; conservar audit, links, intents, snapshots y receipts. Restore probado con restricciones/supresiones reaplicadas; no borrar efectos remotos para fingir reversión.

## Reporte Freebuff — completar al terminar
Estado: PASS (unitario). SHA inicial: d92af6f (main congelado). Archivos: life.ts (planPrivacyExport, planRestore).
Tests/fixtures: 2 tests
Gates: G01 PASS: export/restore no reexponen datos de otro asegurado
Incoherencias/decisiones: Supresiones se reaplican; no hay resurreccion de datos.
Riesgos/deuda: sin auditoria Codex; contratos pueden cambiar tras Astra.
Aprendizajes: documentar el limite no basta; el codigo debe impedir el atajo.
