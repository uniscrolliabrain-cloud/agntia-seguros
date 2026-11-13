# Runtime determinista y revisión

LLM interpreta/redacta/propone/explica; código valida identidad, datos, cálculo, estados, límites, autorización y resultado. Política y máquina de estados viven fuera del prompt. Supervisor/visión/juez añaden señales, no permisos. Cobertura aparente, dato de salud inferido o regla compuesta incorrecta pueden causar perjuicio; un buen acierto local no prueba decisión final.

## Flujo de trabajo

Intake autenticado o ingreso verificado→binding/tenant/recurso→inbox dedup→staging de fuente→normalización/provenance→propuesta→preview→revisión/aprobación→commit local/outbox→worker revalida→proveedor o artefacto→receipt/unknown→reconciliación→snapshot/reporte/handoff. Cada paso tiene versión, guard y motivos de bloqueo. No completar campos con ficción para evitar mostrar pending.

Estados de dominio propuestos: `intake, authorization_pending, collecting_facts, incomplete, prepared, professional_review, submitted_by_authorized_operator, acknowledged, decision_pending, externally_decided, closed, disputed`. Estado de operación separado: proposed, needs_review, approved, queued, running, accepted, confirmed, failed_definitive, outcome_unknown, reconciliation_required, cancelled. Confirmar aceptación remota no confirma entrega, resultado profesional o satisfacción del cliente. La semántica del efecto se define por módulo.

## Núcleo particular

PolicyProjection separa condiciones particulares/generales/endosos y fechas, cada conclusión con cláusula/evidencia/unknown. RuleEvaluation guarda reglas atómicas y composición versionada; no inferir exclusiones, franquicias o precedencias. Estimate usa Decimal/currency y parámetros revisados, marcada ilustrativa. AdverseDecision y binding solo se registran desde prueba del operador competente, nunca por mayoría de modelos.

Los cálculos/validaciones tienen inputs estructurados y fuentes, versiones, units/moneda/fechas, outputs tipados y criterios de admisibilidad. No ejecutar código generado por LLM como parte de un supuesto cálculo determinista. Una aproximación/modelo se etiqueta con supuestos/incertidumbre y revisión, nunca como hecho o autorización. Cobertura documental, vigencia, tiempos de ACK, pendientes y explicación de reglas. No ratios de indemnización o predicción de riesgo como hechos sin fuente/validación; no decisión adversa opaca.

## Revisión y efecto

Preview local puro no crea registro remoto, envía mensaje, firma, contrata o gasta. Lectura pagada, generación IA o AV tiene budget/capacidad aparte. ApprovalBinding liga tenant/recurso/actor humano verificado, hash de contenido/alcance/rights/policy, destinatario/canal, versión/coste y expiry/revocación. Cambio material invalida. Un sí hablado prepara propuesta, no firma sensible del piloto. Competencia profesional o representación se comprueba además de auth cuando corresponde.

Intents durable por tenant/capability/idempotencyKey con payloadHash. Replay idéntico devuelve resultado; mismo key con otro payload da409. Commit local de estado/audit/outbox es atómico, HTTP no. Lease/fencing no impiden por sí solos doble efecto remoto. Timeout después de posible aceptación se reconcilia por referencias fiables; si no hay lookup, bloquear/escalar, no intentar otra key/proveedor. No borrar evidencia para parecer rollback.

Workers revalidan principal/mandato/approval, cambios de fuente, suspensión, restricciones y presupuesto antes del efecto. Cursor avanza tras commit. Backoff de lecturas y retries tienen presupuesto; errores clasificados y sanitizados. No fallback admin/default o actividad ficticia cuando un proveedor cae.

## Límite inicial

Sin contratar/cancelar pólizas, cobrar primas, vincular cobertura, fijar precio vinculante, aceptar/denegar/pagar siniestros ni asumir distribución regulada por llamarse middleware. Piloto de preparación/asistencia y handoff a profesional/operador autorizado; ámbito real requiere evaluación jurídica.

Nada de cron/SOP empresarial paralelo para simular empleados. Timers técnicos de servicio y jobs de cálculo no sustituyen rota del padre. Handoff offered/acknowledged/working/completed/returned con receptor y prueba de finalización; emitir evento no demuestra recepción. Aprendizaje propone SOP/cambio, pasa replay/no regresión y revisión antes de activarse; nunca aprende secretos de otros clientes.
