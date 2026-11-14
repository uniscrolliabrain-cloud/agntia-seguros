# SEG-C38 — Modelos, coste y observabilidad

**DESIGN_ONLY · NOT_STARTED · 38/42.** [Campaña original](../../../campaigns/38-modelos-coste-y-observabilidad.md). Esta documentación no acredita cobertura ni implementación.

## Objetivo y límites
Construir/verificar modelos, coste y observabilidad para Operaciones y asistencia profesional de seguros, preservando: Bolsas30/70/300 hipótesis, no gasto o plan contratado.

**Operación nominada:** `usage.measure`. **Campos:** modelConfig, tokenUsage, budgetReservation, p95, trace. **Invariante:** Bolsas30/70/300 hipótesis, no gasto o plan contratado. **Dependencias:** SEG-C37.

## Ownership y archivos propuestos
- Superficie primaria: `packages/observability/src/costs.ts` (validar en checkout, no asumir existencia).
- DTO Zod: `packages/contracts/src/38.ts` si corresponde.
- API Hono: `apps/api/src/routes/38.ts` solo si operación autorizada.
- Tests: `tests/campaigns/038.test.ts`, fixtures `tests/fixtures/038/`.
- Artefactos originales: `docs/implementation/c38/README.md`, `docs/implementation/c38/EVIDENCE.md`, `docs/implementation/c38/TESTS.md`, `docs/implementation/c38/RISKS.md`.
- Reporte de Freebuff en este CAMPAIGN.md; evidencia extendida en docs/implementation/c38/.

## Patchsets secuenciales
### 038.01 — SEG-C38-T01: Congelar fuentes, ámbito y autoridad
**Acción:** Cotejar modelConfig, tokenUsage, budgetReservation, p95, trace con originales, contrato del tenant y versiones de fuente/proveedor. Registrar qué es hecho, declaración, inferencia o desconocido; revisar alcance territorial/temporal y reglas del módulo.

**Superficie:** `packages/observability/src/costs.ts`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** AuthorityMap y fixture explícitos; Bolsas30/70/300 hipótesis, no gasto o plan contratado. La ausencia de fuente genera pendiente, no un valor plausible.

**Dependencia:** inicio. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 038.02 — SEG-C38-T02: Definir DTO y frontera de datos
**Acción:** Diseñar esquema runtime para modelConfig, tokenUsage, budgetReservation, p95, trace: tipos, límites, IDs opacos, enums, fechas y versión. Conservar los campos nativos aplicables y declarar nuevos los del servicio. Aislar tenant/proyecto/recurso y minimizar PII.

**Superficie:** `packages/observability/src/costs.ts`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** Round-trip y rechazo de extra/valor inválido; referencias cruzadas no son posibles; source/actor/updatedAt y EvidenceRef preservados donde correspondan.

**Dependencia:** SEG-C38-T01. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 038.03 — SEG-C38-T03: Aplicar lógica determinista y revisión
**Acción:** Implementar o documentar el paso `usage.measure` mediante guards, estados y expectedVersion/CAS. Separar propuesta del modelo de cálculo/decisión verificables. PolicyProjection separa condiciones particulares/generales/endosos y fechas, cada conclusión con cláusula/evidencia/unknown. RuleEvaluation guarda reglas atómicas y composición versionada; no inferir exclusiones, franquicias o precedencias. Estimate usa Decimal/currency y parámetros revisados, marcada ilustrativa. AdverseDecision y binding solo se registran desde prueba del operador competente, nunca por mayoría de modelos.

**Superficie:** `packages/observability/src/costs.ts`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** El estado final, el protegido y los motivos de bloqueo son comprobables; Coste/retención no aprobados bloquean fallback de proveedor. No eval/SQL/shell/HTTP genérico del LLM.

**Dependencia:** SEG-C38-T02. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 038.04 — SEG-C38-T04: Adaptar con permisos mínimos
**Acción:** Comprobar versión/edición/ACL de backend si esta fase lo usa; fields/métodos allowlist y binding de servidor. Si es fase local/documental no añadir HTTP. Normalizar errores y limitar IO/tamaño/tiempo/coste de `usage.measure`.

**Superficie:** `packages/observability/src/costs.ts`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** Unknown/unsupported/forbidden no se simulan como éxito; cero HTTP con principal o conexión no autorizados; prueba fake no habilita capability real.

**Dependencia:** SEG-C38-T03. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 038.05 — SEG-C38-T05: Vincular autorización y efectos
**Acción:** Crear preview sin efecto remoto, diff/hash de datos y revisión; identificar quién acepta el resultado y quién puede ejecutar. Si hay efecto, exigir policy/approval/mandato vigentes y un único intent durable con idempotency key.

**Superficie:** `packages/observability/src/costs.ts`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** Cambiar modelConfig o materialidad del payload invalida la autorización aplicable. Replay igual no duplica; distinto contenido con misma key da conflicto.

**Dependencia:** SEG-C38-T04. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 038.06 — SEG-C38-T06: Ejecutar pruebas de negocio y fallo
**Acción:** Preparar y ejecutar caso específico: Coste/retención no aprobados bloquean fallback de proveedor. Añadir A/B/P, humano/agente/colaborador, revocación, dato sin fuente, cambio concurrente y crash pertinente a `usage.measure`. Verificar ausencia de efectos prohibidos: Análisis o estimación se comunica como cobertura/indemnización garantizada, o se usa un dato sensible no autorizado para decidir.

**Superficie:** `packages/observability/src/costs.ts`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** El contrato estricto exige resultado correcto y trayectoria segura. Test fallido crítico bloquea; sin entorno se registra NOT_VERIFIED, nunca PASS por un mock.

**Dependencia:** SEG-C38-T05. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 038.07 — SEG-C38-T07: Registrar evidencia y cerrar gate
**Acción:** Guardar SHA/diff, versiones, fixture antes/después, actor/mandato/correlación, fuentes y receipts mínimos. Registrar tests reales y coste/latencia cuando existan. Actualizar riesgos, rollback y siguiente dependencia sin escribir en agente.

**Superficie:** `packages/observability/src/costs.ts`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** EVIDENCE/TESTS/RISKS y decisión de gate revisables; ninguna cifra, firma, actividad o integración inventadas. Mantener fuera del repo público PII, credenciales y originales restringidos.

**Dependencia:** SEG-C38-T06. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.


## Wiring transversal
JWT Supabase+membresía → actor/twin+tenant y mandato → ACL cliente/póliza/siniestro → Zod DTO → policy/AuthorityMap y rol regulado → documento original+endosos+vigencia → PolicyProjection con cláusulas/evidence/unknown → propuesta/revisión profesional → RLS+audit/outbox → adaptador allowlist → receipt del operador → bridge padre. No suscribir, vincular cobertura, denegar siniestros, calcular indemnización definitiva ni presentar reclamaciones automáticamente. Estimaciones Decimal ilustrativas; datos sensibles minimizados.

## Gates pendientes
- **SEG-C38-G01 / NOT_EXECUTED:** Coste/retención no aprobados bloquean fallback de proveedor. **Esperado:** Resultado y estado protegido coherentes con invariante, revisión/receipt donde correspondan.
- **SEG-C38-G02 / NOT_EXECUTED:** Principal/mandato inválido, recurso o conexión de otro tenant, o versión cambiada intenta usage.measure.. **Esperado:** Fail-closed antes de leer/actuar remotamente; sin fuga o ampliación de scope, con intento auditado.

**Bloqueos:** Cross-tenant o secretos expuestos; Approval/mandato/scope ampliados sin autorización; Pérdida de historia o duplicación tras timeout; Conclusión sensible sin fuentes/revisión competente.

**Rollback:** Deshabilitar capacidad o flag y detener efectos nuevos; conservar audit, links, intents, snapshots y receipts. Restore probado con restricciones/supresiones reaplicadas; no borrar efectos remotos para fingir reversión.

## Reporte Freebuff — completar al terminar
Estado: PENDING. SHA: PENDING. Archivos/diff: PENDING. Tests/fixtures: PENDING. Gates: PENDING. Incoherencias/decisiones: PENDING. Riesgos/deuda: PENDING. Aprendizajes para próximas campañas: PENDING. Continuar autónomamente; Codex audita después de C42.
