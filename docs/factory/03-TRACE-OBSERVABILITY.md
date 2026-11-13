# ADTC — Seguros: causalidad y observabilidad distribuida

**Propuesta v0.1, no API implementada.** Padre posee bus, grafo y auditoría canónicos. Ciberseguridad puede consumir telemetría transversal multi-repo/tenant sin bloquear workflows ni obtener acceso universal a pólizas/siniestros.

## Envelope lógico propuesto
```json
{"schemaVersion":"adtc/0.1","eventId":"new-event-id","eventType":"seguros.claim.notice_prepared","tenantId":"verified-tenant","actorId":"verified-actor","taskId":"task-ref","correlationId":"stable-workflow","causationId":"prior-event-id","requestId":"ingress-ref","traceId":"w3c-trace-id","spanId":"current-span-id","idempotencyKey":"effect-specific-key","source":"agntia-seguros","resourceRefs":["policy-ref","claim-ref"],"evidenceRefs":["document-hash-ref"],"payloadRef":"restricted-ref"}
```
Mapping explícito al `SystemEvent` padre real; no suponer que ya soporta estos tipos.

## Propagación
Conservar tenant, actor, delegación, correlationId y evidencias en cada salto; nuevo eventId por evento; causationId al evento causal; spanId por operación, attemptId por intento. Los identificadores de aseguradora/mediador son externos, no reemplazan IDs canónicos. Outbox durable, inbox dedupe, retry budget, DLQ y outcome_unknown con reconciliación antes de reenvío; replay no contrata pólizas ni presenta avisos otra vez.

## Privacidad
No difundir informes médicos, siniestros personales, DNI, domicilios, primas individualizadas o pólizas completas en bus/OTel. Usar referencias con ACL, cifrado, hashes, retención y finalidad. Aislamiento tenant en archivos, búsqueda, cache, logs, workers y export. Evidencia de decisiones y acuses duradera; spans técnicos pueden muestrearse.

## Cadena ejemplar
Cliente solicita revisar renovación → padre delega → Seguros lee póliza autorizada y endosos → identifica fecha y exclusiones → prepara comparativa/aviso → mediador humano revisa → operador autorizado emite resultado/ACK → padre recibe evento → Ciberseguridad reconstruye secuencia causal sin revelar contenido sensible.

## Casos negativos
Tenant B no ve siniestros A; un empleado A sin póliza ACL tampoco; póliza caducada no se presenta activa; reintento no duplica aviso; ausencia de ACK no se declara presentación; caída observador no bloquea negocio.
