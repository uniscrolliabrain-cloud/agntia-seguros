# Contratos de diseño v1

Propuesta, no API/SDK existente. TypeScript+validación runtime/JSON Schema, extra fields rechazados, límites de tamaño, IDs opacos y enums cerrados. Dinero Decimal string/currency/exponente, fechas ISO con offset y timezone separada. No forzar UUID a IDs del padre o usar float para compromisos monetarios. schemaVersion del servicio es distinto del SystemEvent nativo string1.0.

## Envelope propuesto

```json
{"schemaVersion":1,"operationId":"opaque","tenantId":"server-resolved","actorId":"server-verified","capability":"seguros.proposal.preview","requestId":"host-if-present","correlationId":"trace","causationId":null,"idempotencyKey":"domain-key","expectedVersion":3,"approvalRef":null,"dryRun":true,"payload":{"resourceId":"opaque"}}
```

Identity/capability del JSON no son prueba; principal/policy las derivan/verifican. Envelope.tenantId es scope de datos, no sustitución del Actor de origen al delegar. Worker con identidad de servicio y DelegationMandate: originatingActor/tenant, targetTenant, WorkOrder/TwinBinding, recursos/campos/capabilities/purpose, budget, issued/expires/revocationVersion/proof. Sin membership implícita o redelegación ampliada.

## Entidades y datos específicos

| Módulo | Campos/refs propuestos | Capacidad nominada interna/propuesta |
|---|---|---|
| Evaluación del rol y actividad | serviceRole, territory, productLine, authorizationProof | insurance.scope.assess |
| Representación y destinatarios | customerAuthority, insuredRole, representative, sharingScope | insurance.authority.preview |
| Declaración de riesgos | declaredFact, source, effectiveAt, unknownFields | insurance.risk.prepare |
| Custodia póliza y endosos | policyHash, endorsementOrder, coveragePeriod, originalRef | insurance.policy.stage |
| Extracción y cláusulas | clauseRef, page, textHash, extractionConfidence | insurance.extract.preview |
| Necesidades y demandas | needRef, declaredPurpose, constraints, evidence | insurance.needs.propose |
| Inventario de coberturas | insuredObject, peril, limits, exclusions, dates | insurance.coverage.preview |
| Solicitud de oferta | quoteRequest, operatorBinding, dataMinimization, approval | insurance.quote.propose |
| Importación de ofertas | quoteSource, validUntil, premiumCurrency, productVersion | insurance.quote.import |
| Comparación explicable | criteria, coverageGaps, exclusions, assumptions | insurance.compare.preview |
| Motor de reglas ilustrativo | ruleId, facts, precedence, evaluatedVersion | insurance.rules.evaluate |
| Estimaciones y franquicias | amount, deductible, limit, currency, policyRefs | insurance.estimate.preview |
| Adaptador openIMIS | instanceBinding, moduleVersion, roleScope, capability | insurance.openimis.preview |
| Oasis y riesgo agregado | modelLicense, exposureAggregate, assumptions, runBudget | insurance.cat-model.propose |
| Intake de siniestro | noticeRef, eventDateProof, policyVersion, claimant | insurance.claim.prepare |
| Evidencias de siniestro | evidenceHash, custodian, sensitiveClass, purpose | insurance.claim-evidence.stage |
| Cadena decisional revisable | atomicRules, moduleDecisions, estimate, reviewer | insurance.claim-review.propose |
| Handoff a operador | operatorScope, submissionDraft, approvedHash, ack | insurance.handoff.propose |
| Decisión externa y explicación | externalDecisionRef, authority, reason, appealInfo | insurance.decision.record |
| Seguimiento y plazos | deadlineRule, triggerProof, calendar, owner | insurance.deadline.propose |
| Renovación y cambios | renewalDate, endorsementProposal, needsUpdate, approval | insurance.renewal.propose |
| Reclamación y recurso | disputeRef, facts, sourceDocuments, professionalReview | insurance.dispute.prepare |
| Riesgo de agentes IA | incidentRefs, modelDependency, concentration, controlEvidence | insurance.agent-risk.propose |
| Privacidad y conservación sectorial | healthScope, retention, legalHold, exportACL | insurance.privacy.preview |

Estas entidades no son aliases automáticos de modelos del proveedor/padre. Tipos públicos contienen refs mínimos/estado/frescura; secretos y documentos restringidos se custodian por backend con permiso. Estado desconocido, dato no verificado, bloqueado y no soportado son valores explícitos, nunca null ambiguo rellenado por LLM.

## DTOs transversales

EvidenceRef: id, tenantId/resourceScope, originalCustodian, sourceObjectRef/hash, mapperVersion, observed/effectiveAt, kind fact/inference/user_assertion/observation y reviewRef. Cuando proyecte provenance nativa, preservar source/actor/updatedAt/confidence? sin convertir confianza en permiso. ExternalLink: tenant/connection/provider/model/externalId string/localKind/localId, remoteVersion, sourceHash y lastSeenAt.

ProposalRevision: resource/version, structuredInputs, artifacts, sources, pendingFacts, scopeHash, modelConfigRef, policyVersion y warnings. ApprovalBinding: principal/reviewer competente según caso, proofRef, payloadHash/resourceVersion/rightsHash/policyHash, tenant/recipient/channel/costCeiling/expiry/revocation. OperationResult discriminado: status/localRefs/remoteRefs/evidenceRefs/payloadHash/warnings/retryable/reconciliationRequired/actualScope. Nunca payload remoto sensible completo.

CapabilityReport: deployment/edition/version, operaciones/campos/ACL confirmados, timestamp/expiry/errors y evidence. SyncJob/Cursor/Conflict/ReportSnapshot: ámbito tenant/recurso, estado/versión/correlación/sourceWatermark/coverage/hash y resolución revisable. Índices únicos por tenant/capability/key, tenant/connection/model/externalId/localKind y tenant/connection/externalEventId; FK compuestas por tenant para cardinalidades explícitas.

## API nominada prevista

Prefijo `/v1/seguros`. GET /me, /resources, /resources/{id}, /integrations/{id}/capabilities, /jobs/{id}, /conflicts y /reports/{id}. POST /imports/preview y /imports; /proposals y /proposals/{id}/preview; /intents; /intents/{id}/reconcile; /reports; /advisor-sessions y /advisor-sessions/{id}/close; /privacy-requests. Acciones específicas anteriores se materializan solo si son capacidades de producto autorizadas, no baseline/admin endpoints por defecto.

Lecturas con fields/filters allowlist, paginación y ACL antes de acceso. Commits con key/expectedVersion/approval según riesgo y revalidación. Trabajo largo202+jobId scoped. Dry-run no muta; test endpoint remoto puede tener efecto y requiere su propia autorización. No /provider/{method}, SQL libre, HTTP/ORM/model/domain de búsqueda arbitrario o /execute-anything.

Errores400/422 input/negocio;401auth;403capacidad;404recurso ajeno/inexistente;409versión/key/conflicto;424dependencia si se adopta;429límite;502respuesta inválida;503proveedor;504timeout. Envelope code/message/correlationId/retryable/reconciliationRequired sin traceback/PII/secretos. Resultado incierto no es failed seguro para retry.

## Tools, eventos y compatibilidad

Tools propuestas: `insurance_policy_read insurance_document_preview insurance_need_propose insurance_comparison_preview insurance_claim_prepare insurance_renewal_propose insurance_explain_evidence`. Tenant/actor/scopes no son input libre del modelo. Approve/send/export_all/admin y efectos sensibles fuera del catálogo inicial. SDK servidor privado y proxy Hono con allowlist exacta de ruta/método/tamaño; MCP/Anam usan mismo PEP. No anunciar paquete npm/pip publicado por este documento.

Eventos nuevos `seguros.proposal.created`, `.review.required`, `.resource.changed`, `.operation.confirmed`, `.operation.outcome_unknown`, `.connection.degraded` con id/schemaVersion/tenant/actorRef/occurredAt/correlation/causation y refs mínimas. No enum host inventado; bridge mapea hechos confirmados al SystemEvent nativo con owner/emittedAt/source permitido. Outbox/inbox/receipt dan entrega at-least-once y ACK posterior al commit, no garantía de exactly-once HTTP.
