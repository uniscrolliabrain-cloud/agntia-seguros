# SEG-C17 — Importación de ofertas

**SCAFFOLD CONCEPTUAL / NOT_STARTED / NOT_EXECUTED.** [Campaña original](../../campaigns/17-importacion-de-ofertas.md). Leer [factory](../../factory/00-README.md), [pipeline](../../factory/01-PIPELINE.md), [léxico](../../factory/02-LEXICO.md), [ADTC](../../factory/03-TRACE-OBSERVABILITY.md), [producto Seguros](../../factory/04-PRODUCTO-SEGUROS.md), contexto N−1/N/N+1.

## Objetivo
Construir/verificar importación de ofertas para Operaciones y asistencia profesional de seguros, preservando: Oferta no equivale póliza vinculada.

## Alcance propuesto
Campos/refs a resolver: quoteSource, validUntil, premiumCurrency, productVersion. Operación interna o capacidad nominada propuesta `insurance.quote.import`; no se expone por defecto como endpoint/tool si es tarea de baseline/administración.

Operación `insurance.quote.import`; campos `quoteSource, validUntil, premiumCurrency, productVersion`; fuentes H01, S01, S02, P01; dependencias SEG-C16.

## Invariante
Oferta no equivale póliza vinculada

## Tareas originales, sin granularizar
- **SEG-C17-T01 Congelar fuentes, ámbito y autoridad:** Cotejar quoteSource, validUntil, premiumCurrency, productVersion con originales, contrato del tenant y versiones de fuente/proveedor. Registrar qué es hecho, declaración, inferencia o desconocido; revisar alcance territorial/temporal y reglas del módulo. **Criterio:** AuthorityMap y fixture explícitos; Oferta no equivale póliza vinculada. La ausencia de fuente genera pendiente, no un valor plausible.
- **SEG-C17-T02 Definir DTO y frontera de datos:** Diseñar esquema runtime para quoteSource, validUntil, premiumCurrency, productVersion: tipos, límites, IDs opacos, enums, fechas y versión. Conservar los campos nativos aplicables y declarar nuevos los del servicio. Aislar tenant/proyecto/recurso y minimizar PII. **Criterio:** Round-trip y rechazo de extra/valor inválido; referencias cruzadas no son posibles; source/actor/updatedAt y EvidenceRef preservados donde correspondan.
- **SEG-C17-T03 Aplicar lógica determinista y revisión:** Implementar o documentar el paso `insurance.quote.import` mediante guards, estados y expectedVersion/CAS. Separar propuesta del modelo de cálculo/decisión verificables. PolicyProjection separa condiciones particulares/generales/endosos y fechas, cada conclusión con cláusula/evidencia/unknown. RuleEvaluation guarda reglas atómicas y composición versionada; no inferir exclusiones, franquicias o precedencias. Estimate usa Decimal/currency y parámetros revisados, marcada ilustrativa. AdverseDecision y binding solo se registran desde prueba del operador competente, nunca por mayoría de modelos. **Criterio:** El estado final, el protegido y los motivos de bloqueo son comprobables; Quote caducada no puede seleccionarse como vigente. No eval/SQL/shell/HTTP genérico del LLM.
- **SEG-C17-T04 Adaptar con permisos mínimos:** Comprobar versión/edición/ACL de backend si esta fase lo usa; fields/métodos allowlist y binding de servidor. Si es fase local/documental no añadir HTTP. Normalizar errores y limitar IO/tamaño/tiempo/coste de `insurance.quote.import`. **Criterio:** Unknown/unsupported/forbidden no se simulan como éxito; cero HTTP con principal o conexión no autorizados; prueba fake no habilita capability real.
- **SEG-C17-T05 Vincular autorización y efectos:** Crear preview sin efecto remoto, diff/hash de datos y revisión; identificar quién acepta el resultado y quién puede ejecutar. Si hay efecto, exigir policy/approval/mandato vigentes y un único intent durable con idempotency key. **Criterio:** Cambiar quoteSource o materialidad del payload invalida la autorización aplicable. Replay igual no duplica; distinto contenido con misma key da conflicto.
- **SEG-C17-T06 Ejecutar pruebas de negocio y fallo:** Preparar y ejecutar caso específico: Quote caducada no puede seleccionarse como vigente. Añadir A/B/P, humano/agente/colaborador, revocación, dato sin fuente, cambio concurrente y crash pertinente a `insurance.quote.import`. Verificar ausencia de efectos prohibidos: Análisis o estimación se comunica como cobertura/indemnización garantizada, o se usa un dato sensible no autorizado para decidir. **Criterio:** El contrato estricto exige resultado correcto y trayectoria segura. Test fallido crítico bloquea; sin entorno se registra NOT_VERIFIED, nunca PASS por un mock.
- **SEG-C17-T07 Registrar evidencia y cerrar gate:** Guardar SHA/diff, versiones, fixture antes/después, actor/mandato/correlación, fuentes y receipts mínimos. Registrar tests reales y coste/latencia cuando existan. Actualizar riesgos, rollback y siguiente dependencia sin escribir en agente. **Criterio:** EVIDENCE/TESTS/RISKS y decisión de gate revisables; ninguna cifra, firma, actividad o integración inventadas. Mantener fuera del repo público PII, credenciales y originales restringidos.

## Gates diseñados, no ejecutados
- SEG-C17-G01: Quote caducada no puede seleccionarse como vigente — Resultado y estado protegido coherentes con invariante, revisión/receipt donde correspondan.
- SEG-C17-G02: Principal/mandato inválido, recurso o conexión de otro tenant, o versión cambiada intenta insurance.quote.import. — Fail-closed antes de leer/actuar remotamente; sin fuga o ampliación de scope, con intento auditado.

## Fase futura
Meta-auditoría conceptual → reconciliación → patchsets/handoffs específicos Freebuff, Codex y Arquitecto/Founder, pruebas, evidencia y rollback. No afirmar cobertura ni actuación regulada. Rollback previsto: Deshabilitar capacidad o flag y detener efectos nuevos; conservar audit, links, intents, snapshots y receipts. Restore probado con restricciones/supresiones reaplicadas; no borrar efectos remotos para fingir reversión.
