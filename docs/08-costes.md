# Coste y presupuesto por tenant

Escenarios ilustrativos Lite30€, L70€ y XL300€/mes, basados en preferencia previa de contener gasto. No tarifas comerciales aprobadas, precios actuales contratados o volúmenes garantizados. No se ha comprado plan, creado sesión AV o ejecutado proveedor. Medir antes de ofertar.

| Bolsa hipotética | Lite30 | L70 | XL300 |
|---|---|---|---|
| Infra/DB/backups | 10 | 20 | 65 |
| Modelos/retrieval | 8 | 20 | 80 |
| Procesamiento/adaptadores | 5 | 10 | 50 |
| AV opcional | 0 | 5 | 40 |
| Observabilidad/storage | 2 | 5 | 25 |
| Reserva | 5 | 10 | 40 |
| Total | 30 | 70 | 300 |

Personal humano/profesional, impuestos, margen y efectos de negocio no se incluyen implícitamente. Un pago, prima, registro, firma, licencia enterprise, marketplace o servicio de otro dominio usa presupuesto/permiso específico; el plan del SaaS no lo autoriza. Si un mínimo Anam/licencia/cómputo no cabe, deshabilitar extra o presentar propuesta al owner, no ampliar gasto silenciosamente.

Para Operaciones y asistencia profesional de seguros: openIMIS backend/frontend declaran AGPLv3 en LICENSE.md, con dependencias/módulos a revisar; son referencia de financiación sanitaria y no equivalen a correduría multirramo española. OasisLMF BSD-3-Clause es modelado de catástrofes con datos/modelos separados, no tarificador universal. FINOS CDM tiene licencia Community Specification y ámbito financiero; se evalúa como referencia de contratos, no se instala como motor de seguros. Código libre no significa coste operativo cero o permiso sobre modelos/datos. Demo local evita hosting facturado pero consume equipo/energía/operación; recursos de render/OCR/modelado/LMS se miden con workload real. No correr tareas para llenar una rota ni activar entrenamiento compartido para reducir precio.

## Modelo económico

Coste fijo asignado + tokens entrada/salida + embeddings/retrieval + CPU/GPU de procesamiento + storage/egress + minutos AV/voz + APIs/conectores/licencias + backups/observabilidad + soporte/revisión. Registrar tarifas/moneda/fecha/IVA/minimos y límites desde fuentes/contratos aprobados. Precios unknown bloquean gasto no autorizado. Coste por resultado válido importa además de coste por request.

Ejemplo de workload, no coste monetario observado:1000propuestas×2000tokens entrada/500salida son2M/0.5M antes de tools/retries;40sesionesAV×5min son200min. Multiplicar por tarifas aprobadas y añadir mínimos, storage y reintentos. Un documento grande o render/modelo estadístico puede dominar el coste; presupuesto de tamaño/tiempo/cómputo por job evita sorpresa.

## Control determinista

BudgetReservation tenant/operationKey/currency, reserva transaccional, consumo observado/receipt y reconciliación/liberación. Concurrencia no doble gasta último saldo. Rate-limit y budget separados. Gateway permite modelos configurados por aptitud/idioma/región/retención/purpose/coste; no endpoint libre o fallback a proveedor no aprobado. Límite de tamaño/pasos/concurrencia y DLQ/backoff finitos.

Anam tiene duración/concurrencia y saldo; al agotarlo usar texto si política permite y conservar estado. No bajar aislamiento/consentimiento por plan barato. Jobs técnicos conservan caducidad/mandato/revisión. p50/p95/coste/errores se medirán, no objetivos alcanzados inventados. Un forecast de gasto/negocio no es autorización de pago ni garantía de resultado.
