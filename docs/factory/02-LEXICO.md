# Léxico canónico y Seguros — v0.1 conceptual

## Identidad y causalidad
`tenantId` = ámbito empresa, no `owner`, `sub`, `actorId`, `policyId` o `claimId`. Agentes y roles canónicos en padre; `TwinBinding` y `DelegationMandate` propuestos. `Task` ≠ `SOP` ≠ `Action` ≠ `Approval` ≠ `Event`. `correlationId` cadena de negocio; `causationId` evento causante; `eventId` evento único; `traceId`/`spanId` telemetría; `requestId` ingreso; `idempotencyKey` efecto. Contratos del padre se cotejan por SHA antes de integración.

## Conceptos de Seguros (PROPOSED)
`InsuranceMatter` = expediente de asistencia; `ServiceRoleAssessment` = evaluación de rol/territorio/habilitación; `CustomerAuthority` = facultad y consentimiento/base para actuar/compartir; `DeclaredRisk` = riesgo declarado, no verificado; `PolicyDocument` = documento de póliza original; `Endorsement` = modificación con precedencia/fecha; `CoverageProjection` = resumen interpretativo, no cobertura vinculante; `NeedsAssessment` = análisis de necesidades; `QuoteRequest` = propuesta de solicitud; `InsurerQuote` = oferta del operador con vigencia; `RenewalReminder` = aviso, no renovación; `ClaimNoticeDraft` = borrador de comunicación; `ClaimEvidenceRef` = evidencia con cadena de custodia; `ClaimSubmissionReceipt` = acuse externo; `InsurerDecision` = decisión de aseguradora, no LLM; `PremiumProjection` = previsión, no cobro; `CoverageGapFinding` = posible brecha, no dictamen definitivo.

## Distinciones críticas
`policyUploaded` ≠ `policyInForce`; `coverageEstimated` ≠ `coverageConfirmed`; `quoteImported` ≠ `offerAccepted` ≠ `policyBound`; `claimDrafted` ≠ `claimSubmitted` ≠ `claimAccepted` ≠ `claimPaid`; `renewalReminder` ≠ `renewalExecuted`; `premiumDue` ≠ `premiumCollected`. La aseguradora/mediador autorizado conserva autoridad de sus actos. Fecha de siniestro, período de cobertura, endosos, límites, exclusiones, franquicias, moneda, jurisdicción y fuente son datos distintos. Unknown ≠ false.
