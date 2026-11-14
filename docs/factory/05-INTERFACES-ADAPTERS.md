# Autoridad, cooperación y adaptadores de Seguros

## Autoridad
AgntiaPro padre conserva kernel, agentes, bus, grafo, policy y SOPs; Seguros propone y organiza expedientes bajo mandato; aseguradora/mediador autorizado conserva actos reservados y decisiones vinculantes. Duplicación de conocimiento permitida; efecto externo único por intención, aprobación y scope.

## Repos hermanos
- **Legal:** interpretación contractual, reclamaciones y obligaciones; no sustituye aseguradora ni mediador.
- **Finanzas:** presupuesto de primas, cash flow, indemnizaciones observadas; no cobrar primas desde Finanzas sin autoridad.
- **Gestoría/RRHH:** empleados, siniestralidad laboral, seguros colectivos y datos autorizados; no exponer datos de salud a otras áreas.
- **Ciberseguridad:** riesgos tecnológicos, ciberseguro, incidentes y observabilidad, con minimización estricta.
- **Clientes/Ventas:** CRM, comunicación comercial y seguimiento de solicitudes; no distribuir seguros sin habilitación.
- **Branding/Marketing/Redes/Vídeo:** materiales y comunicaciones, con claims revisados y autorización.
- **Formación:** alfabetización en riesgos y pólizas.

## Puertos propuestos
`PolicyReadPort`, `PolicyCustodyPort`, `RiskAssessmentPort`, `QuoteReadPort`, `RenewalCalendarPort`, `ClaimEvidencePort`, `ClaimHandoffPort`, `InsurerDecisionReadPort`, `AuditEvidencePort`; `PolicyBindPort`, `PremiumCollectionPort` y `ClaimSettlementPort` **DISABLED** en piloto.

## Adapter declaration
Provider/mediatorBinding, regulatoryRole, jurisdiction, tenantBinding, policy/claim scope, authorizedRecipient, consent/legalBasis, purpose, dataMinimization, schemaVersion, idempotency, ACK/reconciliation, retry/timeout, rateLimit, audit, retention, encryption. API/MCP de aseguradora, CRM o portal no otorga habilitación regulatoria. No compartir siniestros completos con hermanos por conveniencia.
