# SEG-C09 — Evaluación del rol y actividad

**DESIGN_ONLY · NOT_STARTED · 9/42.** [Campaña original](../../../campaigns/09-evaluacion-del-rol-y-actividad.md). Esta documentación no acredita cobertura ni implementación.

## Objetivo y límites
Construir/verificar evaluación del rol y actividad para Operaciones y asistencia profesional de seguros, preservando: Llamarse middleware no elimina regulación de la actividad real.

**Operación nominada:** `insurance.scope.assess`. **Campos:** serviceRole, territory, productLine, authorizationProof. **Invariante:** Llamarse middleware no elimina regulación de la actividad real. **Dependencias:** SEG-C08.

## Ownership y archivos propuestos
- Superficie primaria: `packages/domain/src/distribution-role.ts` (validar en checkout, no asumir existencia).
- DTO Zod: `packages/contracts/src/09.ts` si corresponde.
- API Hono: `apps/api/src/routes/09.ts` solo si operación autorizada.
- Tests: `tests/campaigns/009.test.ts`, fixtures `tests/fixtures/009/`.
- Artefactos originales: `docs/implementation/c09/README.md`, `docs/implementation/c09/EVIDENCE.md`, `docs/implementation/c09/TESTS.md`, `docs/implementation/c09/RISKS.md`.
- Reporte de Freebuff en este CAMPAIGN.md; evidencia extendida en docs/implementation/c09/.

## Patchsets secuenciales
### 009.01 — SEG-C09-T01: Congelar fuentes, ámbito y autoridad
**Acción:** Cotejar serviceRole, territory, productLine, authorizationProof con originales, contrato del tenant y versiones de fuente/proveedor. Registrar qué es hecho, declaración, inferencia o desconocido; revisar alcance territorial/temporal y reglas del módulo.

**Superficie:** `packages/domain/src/distribution-role.ts`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** AuthorityMap y fixture explícitos; Llamarse middleware no elimina regulación de la actividad real. La ausencia de fuente genera pendiente, no un valor plausible.

**Dependencia:** inicio. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 009.02 — SEG-C09-T02: Definir DTO y frontera de datos
**Acción:** Diseñar esquema runtime para serviceRole, territory, productLine, authorizationProof: tipos, límites, IDs opacos, enums, fechas y versión. Conservar los campos nativos aplicables y declarar nuevos los del servicio. Aislar tenant/proyecto/recurso y minimizar PII.

**Superficie:** `packages/domain/src/distribution-role.ts`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** Round-trip y rechazo de extra/valor inválido; referencias cruzadas no son posibles; source/actor/updatedAt y EvidenceRef preservados donde correspondan.

**Dependencia:** SEG-C09-T01. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 009.03 — SEG-C09-T03: Aplicar lógica determinista y revisión
**Acción:** Implementar o documentar el paso `insurance.scope.assess` mediante guards, estados y expectedVersion/CAS. Separar propuesta del modelo de cálculo/decisión verificables. PolicyProjection separa condiciones particulares/generales/endosos y fechas, cada conclusión con cláusula/evidencia/unknown. RuleEvaluation guarda reglas atómicas y composición versionada; no inferir exclusiones, franquicias o precedencias. Estimate usa Decimal/currency y parámetros revisados, marcada ilustrativa. AdverseDecision y binding solo se registran desde prueba del operador competente, nunca por mayoría de modelos.

**Superficie:** `packages/domain/src/distribution-role.ts`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** El estado final, el protegido y los motivos de bloqueo son comprobables; Sin operador/alcance competente queda authorization_pending. No eval/SQL/shell/HTTP genérico del LLM.

**Dependencia:** SEG-C09-T02. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 009.04 — SEG-C09-T04: Adaptar con permisos mínimos
**Acción:** Comprobar versión/edición/ACL de backend si esta fase lo usa; fields/métodos allowlist y binding de servidor. Si es fase local/documental no añadir HTTP. Normalizar errores y limitar IO/tamaño/tiempo/coste de `insurance.scope.assess`.

**Superficie:** `packages/domain/src/distribution-role.ts`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** Unknown/unsupported/forbidden no se simulan como éxito; cero HTTP con principal o conexión no autorizados; prueba fake no habilita capability real.

**Dependencia:** SEG-C09-T03. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 009.05 — SEG-C09-T05: Vincular autorización y efectos
**Acción:** Crear preview sin efecto remoto, diff/hash de datos y revisión; identificar quién acepta el resultado y quién puede ejecutar. Si hay efecto, exigir policy/approval/mandato vigentes y un único intent durable con idempotency key.

**Superficie:** `packages/domain/src/distribution-role.ts`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** Cambiar serviceRole o materialidad del payload invalida la autorización aplicable. Replay igual no duplica; distinto contenido con misma key da conflicto.

**Dependencia:** SEG-C09-T04. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 009.06 — SEG-C09-T06: Ejecutar pruebas de negocio y fallo
**Acción:** Preparar y ejecutar caso específico: Sin operador/alcance competente queda authorization_pending. Añadir A/B/P, humano/agente/colaborador, revocación, dato sin fuente, cambio concurrente y crash pertinente a `insurance.scope.assess`. Verificar ausencia de efectos prohibidos: Análisis o estimación se comunica como cobertura/indemnización garantizada, o se usa un dato sensible no autorizado para decidir.

**Superficie:** `packages/domain/src/distribution-role.ts`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** El contrato estricto exige resultado correcto y trayectoria segura. Test fallido crítico bloquea; sin entorno se registra NOT_VERIFIED, nunca PASS por un mock.

**Dependencia:** SEG-C09-T05. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.

### 009.07 — SEG-C09-T07: Registrar evidencia y cerrar gate
**Acción:** Guardar SHA/diff, versiones, fixture antes/después, actor/mandato/correlación, fuentes y receipts mínimos. Registrar tests reales y coste/latencia cuando existan. Actualizar riesgos, rollback y siguiente dependencia sin escribir en agente.

**Superficie:** `packages/domain/src/distribution-role.ts`. Separar dominio, contrato, adapter, worker y tests cuando proceda. No añadir endpoints para investigación documental.

**Aceptación:** EVIDENCE/TESTS/RISKS y decisión de gate revisables; ninguna cifra, firma, actividad o integración inventadas. Mantener fuera del repo público PII, credenciales y originales restringidos.

**Dependencia:** SEG-C09-T06. **Pruebas:** positivo, cross-tenant, falta de mandato, revocación, cláusula no acreditada, fecha/territorio incorrectos, dato sensible no autorizado, replay y timeout si hay efecto. Registrar SHA/diff/fixture/comando.


## Wiring transversal
JWT Supabase+membresía → actor/twin+tenant y mandato → ACL cliente/póliza/siniestro → Zod DTO → policy/AuthorityMap y rol regulado → documento original+endosos+vigencia → PolicyProjection con cláusulas/evidence/unknown → propuesta/revisión profesional → RLS+audit/outbox → adaptador allowlist → receipt del operador → bridge padre. No suscribir, vincular cobertura, denegar siniestros, calcular indemnización definitiva ni presentar reclamaciones automáticamente. Estimaciones Decimal ilustrativas; datos sensibles minimizados.

## Gates pendientes
- **SEG-C09-G01 / NOT_EXECUTED:** Sin operador/alcance competente queda authorization_pending. **Esperado:** Resultado y estado protegido coherentes con invariante, revisión/receipt donde correspondan.
- **SEG-C09-G02 / NOT_EXECUTED:** Principal/mandato inválido, recurso o conexión de otro tenant, o versión cambiada intenta insurance.scope.assess.. **Esperado:** Fail-closed antes de leer/actuar remotamente; sin fuga o ampliación de scope, con intento auditado.

**Bloqueos:** Cross-tenant o secretos expuestos; Approval/mandato/scope ampliados sin autorización; Pérdida de historia o duplicación tras timeout; Conclusión sensible sin fuentes/revisión competente.

**Rollback:** Deshabilitar capacidad o flag y detener efectos nuevos; conservar audit, links, intents, snapshots y receipts. Restore probado con restricciones/supresiones reaplicadas; no borrar efectos remotos para fingir reversión.

## Reporte Freebuff — completar al terminar
Estado: PENDING. SHA: PENDING. Archivos/diff: PENDING. Tests/fixtures: PENDING. Gates: PENDING. Incoherencias/decisiones: PENDING. Riesgos/deuda: PENDING. Aprendizajes para próximas campañas: PENDING. Continuar autónomamente; Codex audita después de C42.
