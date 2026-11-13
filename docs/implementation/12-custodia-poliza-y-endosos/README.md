# SEG-C12 — Custodia póliza y endosos

**SCAFFOLD CONCEPTUAL / NOT_STARTED / NOT_EXECUTED.** [Campaña original](../../campaigns/12-custodia-poliza-y-endosos.md). Leer [factory](../../factory/00-README.md), [pipeline](../../factory/01-PIPELINE.md), [léxico](../../factory/02-LEXICO.md), [ADTC](../../factory/03-TRACE-OBSERVABILITY.md), [producto Seguros](../../factory/04-PRODUCTO-SEGUROS.md), contexto N−1/N/N+1.

## Objetivo
Construir/verificar custodia póliza y endosos para Operaciones y asistencia profesional de seguros, preservando: Original y jerarquía temporal no se sobrescriben.

## Alcance propuesto
Campos/refs a resolver: policyHash, endorsementOrder, coveragePeriod, originalRef. Operación interna o capacidad nominada propuesta `insurance.policy.stage`; no se expone por defecto como endpoint/tool si es tarea de baseline/administración.

Operación `insurance.policy.stage`; campos `policyHash, endorsementOrder, coveragePeriod, originalRef`; fuentes H01, S01, S02, P01; dependencias SEG-C11.

## Invariante
Original y jerarquía temporal no se sobrescriben

## Tareas originales, sin granularizar
- **SEG-C12-T01 Congelar fuentes, ámbito y autoridad:** Cotejar policyHash, endorsementOrder, coveragePeriod, originalRef con originales, contrato del tenant y versiones de fuente/proveedor. Registrar qué es hecho, declaración, inferencia o desconocido; revisar alcance territorial/temporal y reglas del módulo. **Criterio:** AuthorityMap y fixture explícitos; Original y jerarquía temporal no se sobrescriben. La ausencia de fuente genera pendiente, no un valor plausible.
- **SEG-C12-T02 Definir DTO y frontera de datos:** Diseñar esquema runtime para policyHash, endorsementOrder, coveragePeriod, originalRef: tipos, límites, IDs opacos, enums, fechas y versión. Conservar los campos nativos aplicables y declarar nuevos los del servicio. Aislar tenant/proyecto/recurso y minimizar PII. **Criterio:** Round-trip y rechazo de extra/valor inválido; referencias cruzadas no son posibles; source/actor/updatedAt y EvidenceRef preservados donde correspondan.
- **SEG-C12-T03 Aplicar lógica determinista y revisión:** Implementar o documentar el paso `insurance.policy.stage` mediante guards, estados y expectedVersion/CAS. Separar propuesta del modelo de cálculo/decisión verificables. PolicyProjection separa condiciones particulares/generales/endosos y fechas, cada conclusión con cláusula/evidencia/unknown. RuleEvaluation guarda reglas atómicas y composición versionada; no inferir exclusiones, franquicias o precedencias. Estimate usa Decimal/currency y parámetros revisados, marcada ilustrativa. AdverseDecision y binding solo se registran desde prueba del operador competente, nunca por mayoría de modelos. **Criterio:** El estado final, el protegido y los motivos de bloqueo son comprobables; Endoso posterior crea versión y puede invalidar proyección. No eval/SQL/shell/HTTP genérico del LLM.
- **SEG-C12-T04 Adaptar con permisos mínimos:** Comprobar versión/edición/ACL de backend si esta fase lo usa; fields/métodos allowlist y binding de servidor. Si es fase local/documental no añadir HTTP. Normalizar errores y limitar IO/tamaño/tiempo/coste de `insurance.policy.stage`. **Criterio:** Unknown/unsupported/forbidden no se simulan como éxito; cero HTTP con principal o conexión no autorizados; prueba fake no habilita capability real.
- **SEG-C12-T05 Vincular autorización y efectos:** Crear preview sin efecto remoto, diff/hash de datos y revisión; identificar quién acepta el resultado y quién puede ejecutar. Si hay efecto, exigir policy/approval/mandato vigentes y un único intent durable con idempotency key. **Criterio:** Cambiar policyHash o materialidad del payload invalida la autorización aplicable. Replay igual no duplica; distinto contenido con misma key da conflicto.
- **SEG-C12-T06 Ejecutar pruebas de negocio y fallo:** Preparar y ejecutar caso específico: Endoso posterior crea versión y puede invalidar proyección. Añadir A/B/P, humano/agente/colaborador, revocación, dato sin fuente, cambio concurrente y crash pertinente a `insurance.policy.stage`. Verificar ausencia de efectos prohibidos: Análisis o estimación se comunica como cobertura/indemnización garantizada, o se usa un dato sensible no autorizado para decidir. **Criterio:** El contrato estricto exige resultado correcto y trayectoria segura. Test fallido crítico bloquea; sin entorno se registra NOT_VERIFIED, nunca PASS por un mock.
- **SEG-C12-T07 Registrar evidencia y cerrar gate:** Guardar SHA/diff, versiones, fixture antes/después, actor/mandato/correlación, fuentes y receipts mínimos. Registrar tests reales y coste/latencia cuando existan. Actualizar riesgos, rollback y siguiente dependencia sin escribir en agente. **Criterio:** EVIDENCE/TESTS/RISKS y decisión de gate revisables; ninguna cifra, firma, actividad o integración inventadas. Mantener fuera del repo público PII, credenciales y originales restringidos.

## Gates diseñados, no ejecutados
- SEG-C12-G01: Endoso posterior crea versión y puede invalidar proyección — Resultado y estado protegido coherentes con invariante, revisión/receipt donde correspondan.
- SEG-C12-G02: Principal/mandato inválido, recurso o conexión de otro tenant, o versión cambiada intenta insurance.policy.stage. — Fail-closed antes de leer/actuar remotamente; sin fuga o ampliación de scope, con intento auditado.

## Fase futura
Meta-auditoría conceptual → reconciliación → patchsets/handoffs específicos Freebuff, Codex y Arquitecto/Founder, pruebas, evidencia y rollback. No afirmar cobertura ni actuación regulada. Rollback previsto: Deshabilitar capacidad o flag y detener efectos nuevos; conservar audit, links, intents, snapshots y receipts. Restore probado con restricciones/supresiones reaplicadas; no borrar efectos remotos para fingir reversión.
