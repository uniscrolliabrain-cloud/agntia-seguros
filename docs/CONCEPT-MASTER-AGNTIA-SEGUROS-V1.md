# CONCEPT MASTER — AGNTIA SEGUROS

**Versión:** 1.0 · **Fecha:** 2026-11-15 · **Serie:** 06/14 · **Estado:** concepto y arquitectura documental, no producto validado

> Principio rector: el sistema prepara y verifica; la aseguradora y el profesional autorizado conservan las decisiones y efectos que les corresponden. **DOCUMENTATION_ONLY**.

## 01. Visión

Agntia Seguros es un departamento agéntico de gestión de riesgos asegurables, documentación de pólizas, prevención, comparación explicable y asistencia en siniestros. Convierte datos dispersos en expedientes verificables y flujos supervisados, sin atribuirse condición de aseguradora, mediador autorizado, perito o decisor de indemnizaciones.

## 02. Estado de partida

El README del 13-11-2026 declara DOCUMENTATION_ONLY: no hay aplicación, SDK, proveedores conectados ni pruebas de producto ejecutadas. Las 42 campañas están NOT_STARTED, con 294 tareas y 84 escenarios NOT_EXECUTED. Este documento expresa el objetivo y no debe interpretarse como certificación de funcionamiento. No modificar /agente.

## 03. Modelo de producto

Servicio para autónomos, pymes, empresas medianas y operadores profesionales con acceso legítimo: inventario de riesgos declarados, cartera de pólizas, vencimientos, necesidades de cobertura, ofertas comparables, evidencias de siniestro y handoff a operador habilitado. Portal propio para clientes externos y servicio especialista dentro de AgntiaPro. El valor es preparación rigurosa y continuidad de seguimiento, no contratación automática.

## 04. Catálogo de 72 capacidades objetivo

01 intake; 02 evaluación del rol regulado; 03 representación; 04 mandato; 05 consentimiento/finalidad; 06 inventario de riesgos; 07 declaraciones versionadas; 08 activos asegurados; 09 cartera de pólizas; 10 endosos; 11 condiciones generales; 12 particulares; 13 custodia y hash; 14 OCR; 15 extracción de cláusulas; 16 vigencia; 17 necesidades y demandas; 18 gaps de cobertura; 19 límites; 20 franquicias; 21 exclusiones; 22 precedencias; 23 solicitudes de oferta; 24 importación de ofertas; 25 comparación explicable; 26 escenarios; 27 reglas atómicas; 28 cálculo decimal; 29 estimación ilustrativa; 30 trazabilidad de supuestos; 31 renovación; 32 modificaciones; 33 cancelación propuesta; 34 alertas; 35 aviso de siniestro; 36 cronología; 37 custodia de pruebas; 38 daños documentados; 39 clasificación de expediente; 40 revisión profesional; 41 handoff; 42 ACK; 43 estado externo; 44 decisión externa; 45 explicación; 46 reclamaciones; 47 recursos; 48 privacidad; 49 datos sensibles; 50 retención; 51 legal hold; 52 antifraude con garantías; 53 riesgo cibernético; 54 riesgo agéntico; 55 continuidad; 56 modelización agregada; 57 openIMIS opcional; 58 Oasis opcional; 59 conectores autorizados; 60 capacidad de proveedor; 61 dashboards; 62 reportes; 63 auditoría; 64 identidad multitenant; 65 ACL; 66 aprobaciones; 67 SOPs; 68 portal; 69 chat/avatar; 70 SDK/bridge; 71 observabilidad; 72 recuperación. Objetivos, no implementaciones.

## 05. Arquitectura

Portal externo o AgntiaPro → JWT Supabase y membership/ACL verificados → API TypeScript/Hono → core determinista de policy, FSM, PolicyProjection, RuleEvaluation, approvals y evidencias → Postgres/Supabase con RLS, audit, inbox/outbox → workers y adaptadores con discovery → recibos, reportes y handoff. LLM prepara, explica y señala incertidumbre; el core valida datos, reglas, permisos y estados. No importar el OS del padre como librería ni duplicar su scheduler.

## 06. Fronteras de autoridad

Póliza original, endosos y aseguradora/operador competente son fuentes de autoridad para cobertura y decisión efectiva. Agntia custodia declaraciones, snapshots, cálculos ilustrativos y propuestas. ServiceRoleAssessment documenta territorio, producto, rol, autorización y vigencia. CustomerAuthority acredita representación y finalidad. No hay inferencia de licencia a partir del nombre del agente, proveedor o SaaS. AuthorityMap asigna custodio y único ejecutor por efecto.

## 07. Entidades

ServiceRoleAssessment, CustomerAuthority, RiskDeclaration, CoverageNeed, PolicyVersion, Endorsement, InsuredObject, QuoteRequest, QuoteSnapshot, CoverageComparison, ClaimNotice, ClaimEvidence, RuleEvaluation, ReserveEstimate, RenewalProposal, BrokerHandoff, ProfessionalDecision, EvidenceRef, CapabilityReport, ApprovalBinding, OperationIntent, Receipt, AuditEvent. Los IDs remotos se vinculan mediante ExternalLink tenant-scoped, nunca se mezclan con IDs locales.

## 08. Motor de coberturas y reglas

PolicyProjection mantiene condiciones generales, particulares y endosos, fechas y precedencias, cláusulas citadas, hechos conocidos y unknowns. RuleEvaluation registra reglas atómicas, composición, inputs y versión; una regla ilustrativa no equivale a decisión aseguradora. Estimate usa Decimal, moneda, límites, franquicias, deducibles y supuestos documentados. Sin texto original suficiente: resultado INCOMPLETE/REVIEW_REQUIRED, nunca cobertura garantizada.

## 09. Siniestros y cadena decisional

Notice de siniestro: fecha y hecho, póliza y versión, persona autorizada, pruebas, alcance, plazos revisables y estado. ClaimEvidence conserva hash, custodio, fuente y finalidad. El sistema prepara una presentación, obtiene revisión y autorización específica, realiza handoff a operador competente y espera ACK verificable. La aceptación/denegación/pago solo se registra como decisión externa con prueba; no se fabrica mediante votación de LLMs.

## 10. Riesgo de IA y resiliencia

El repositorio puede analizar exposición de sistemas agénticos, incidentes y dependencias digitales en cooperación con Ciberseguridad, pero un hallazgo técnico no determina por sí solo cobertura de una póliza. Explorar en el futuro esquemas de evidencias de resiliencia, controles verificables y análisis de riesgo para aseguradores, sujetos a acuerdos, validación actuarial y requisitos regulatorios. No presentar una certificación propia como acreditación oficial.

## 11. SOPs

S01 intake y evaluación de rol; S02 autoridad/representación; S03 inventario de riesgos; S04 ingesta y custodia de póliza; S05 extracción y revisión; S06 necesidades; S07 comparación; S08 simulación ilustrativa; S09 renovación; S10 notice de siniestro; S11 evidencias; S12 revisión; S13 handoff y ACK; S14 seguimiento; S15 reclamación; S16 cierre/auditoría. Cada SOP: precondiciones, permisos, versiones, fuentes, idempotencia, approval, recibos, estados y reconciliación.

## 12. Seguridad y datos

Deny-by-default, RLS y ACL por tenant/póliza/expediente/campo, separación operadorP/tenantA/B, permisos de Storage, Realtime, RAG, exports y backups. No inferir salud ni otros datos sensibles para suscripción o siniestros; base jurídica y minimización específicas. Defensas contra prompt injection en documentos, SSRF, CSV/HTML activos, fuga de secretos y replay. Revocaciones se revalidan antes de cada efecto, incluso en workers.

## 13. UX de servicio

Portal con vistas cartera, coberturas, brechas, renovaciones, expedientes, evidencias, solicitudes, decisiones externas y revisiones. Laia y agentes especialistas comunican estado real; Anam es presentación opcional. Diferenciar propuesta, simulación, revisión, enviado, ACK y decidido externamente. Nunca afirmar contratación o indemnización por tener un borrador o una respuesta conversacional.

## 14. Integraciones

openIMIS y Oasis como opciones a evaluar por licencia, alcance y compatibilidad; no son requisito de P0 ni prueba de cobertura universal. Integración con operadores, brokers y plataformas autorizadas mediante contratos nominados, credenciales segregadas y CapabilityReport. Una API de prueba o mock no equivale a conectividad real ni a autorización de distribución. Cooperación con Finanzas, Gestoría, Legal y Ciberseguridad por WorkOrder y AuthorityMap.

## 15. Roadmap y vertical P0

Preservar exactamente C01–C42 de docs/campaigns/README.md y campaign.json: C01–C08 fundaciones; C09–C32 dominio; C33–C42 portal, SDK, bridge, cooperación, coste, seguridad, E2E y release. Vertical sintético: empresa/póliza → alcance y profesional → extracción revisada → necesidades/limitaciones → notice con evidencias → preparación → revisión humana → handoff sandbox con ACK → decisión externa referenciada. No contratación ni pagos.

## 16. Pruebas y gates

Fixtures operadorP y tenantsA/B; asegurados similares; pólizas con endosos contradictorios; cláusula ilegible; franquicia errónea; quote caducada; dato sensible no autorizado; siniestro con fecha incierta; ACK perdido; revocación en cola; decisión adversa inventada; restore que resucita permisos. Cero fugas, secretos, approvals fabricadas, efectos sin mandato y duplicados replay. Mocks separados de tests de proveedor. Informes con PASS/FAIL/BLOCKED/NOT_VERIFIED y evidencia.

## 17. Operación y métricas

Outbox/inbox, intents durables, reintentos acotados, DLQ, reconciliación tras timeout, leases y fencing. Medir cobertura documental, vencimientos con evidencia, comparaciones revisadas, tiempos de ACK, errores de extracción, costes, latencia y tasa de casos incompletos. No convertir ratios de siniestralidad ni estimaciones en hechos validados sin muestras, fuentes y metodología.

## 18. Límites y evolución

Fuera del piloto: contratar o cancelar pólizas, cobrar primas, fijar precios vinculantes, vincular cobertura, aceptar/denegar/pagar siniestros, decidir con datos sensibles o actuar como distribuidor sin habilitación. Expansión condicionada a evaluación legal por jurisdicción, profesional autorizado, pruebas y contratos. El Concept Master evoluciona con reportes de campañas, pruebas reales y feedback de pilotos.

## 19. Fuentes internas

README.md; docs/01-producto.md; docs/architecture/01-arquitectura.md; docs/contracts/01-contratos.md; docs/09-evaluacion.md; docs/campaigns/README.md; docs/campaigns/campaign.json. Esta revisión es selectiva de documentación y no auditoría de ejecución.

## Control de cambios

V1.0: 72 capacidades objetivo, 19 secciones, preservación de 42 campañas y límites regulatorios. No se modifica `/agente`.
