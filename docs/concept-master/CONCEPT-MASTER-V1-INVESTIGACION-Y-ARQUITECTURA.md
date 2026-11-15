# AGNTIA SEGUROS — CONCEPT MASTER V1
## Insurance Intelligence & Resilience Operating System
**Investigación state of the art · 15 noviembre 2026 · Visión de producto y arquitectura final**

> Documento estratégico-técnico de investigación. No es auditoría de desarrollo ni aceptación de código. Investigación externa selectiva y referencias verificables; conceptos originales identificados como propuestas.

**Principio rector:** el sistema puede comprender y preparar; no puede atribuirse autorización para suscribir, mediar, decidir cobertura, rechazar o pagar un siniestro.

## Índice
- 01 · Tesis y posicionamiento
- 02 · El nuevo mapa del sector
- 03 · Investigación científica: del paper al sistema
- 04 · Panorama competitivo mundial
- 05 · Repositorios públicos y estándares abiertos
- 06 · Conceptos diferenciales propios
- 07 · Arquitectura conceptual: 16 planos
- 08 · Casos de uso y experiencia radicalmente útil
- 09 · Economía, mercado y estrategia
- 10 · Regulación, ética y riesgos
- 11 · Evaluación científica y pruebas adversariales
- 12 · Horizonte de investigación y convergencia


## 01 · Tesis y posicionamiento

Agntia Seguros debe ser un **Insurance Intelligence & Resilience Operating System**: una capa agéntica de comprensión, prevención, cobertura y gestión de evidencias para empresas, autónomos y profesionales, interoperable con operadores regulados. No un clon apresurado de Guidewire ni una aseguradora sintética. El diferencial es convertir los activos, operaciones, riesgos, pólizas, cláusulas, pérdidas, obligaciones y cambios del negocio en un **grafo verificable de exposición y protección**. El usuario no quiere «comprar un seguro» como flujo aislado: quiere saber qué protege su empresa, qué queda descubierto, qué decisiones previenen daños y qué hacer cuando ocurre un siniestro.

**North Star:** «Cada empresa entiende sus riesgos reales, puede demostrar qué está cubierto y por qué, anticipa brechas, prepara sus reclamaciones y aprende de sus pérdidas sin delegar decisiones reguladas en un LLM». El sistema construye conocimiento persistente, no una colección de respuestas de chat.

**Cuatro productos complementarios:** (1) *Insurance Observatory*: inventario y vigencia de pólizas, activos y riesgos; (2) *Coverage Intelligence*: comparación trazable de condiciones y exclusiones, no sentencia vinculante; (3) *Claims & Recovery Desk*: reconstrucción de hechos, custodia de evidencia y seguimiento; (4) *Risk & Resilience Studio*: escenarios, prevención, continuidad y recomendaciones económicas con incertidumbre explícita.

**Modelo de autoridad:** usuario y LAIA solicitan trabajo; agente especializado en seguros propone; motor determinista calcula y verifica; mediador, aseguradora, perito o profesional autorizado decide según su función; el operador externo confirma la ejecución. Separar asistencia tecnológica de distribución, mediación, suscripción y gestión decisoria de siniestros. La clasificación legal depende de la actividad efectiva y del territorio, no del nombre «software».


## 02 · El nuevo mapa del sector

El seguro se está convirtiendo en un sistema de datos y gestión de riesgo continuo. El núcleo histórico —pólizas, facturación y siniestros— convive con sensores, modelos geoespaciales, riesgo climático, fraude organizado, modelos de lenguaje, ciberseguros, embedded insurance, paramétricos y resiliencia. Las oportunidades para una pyme son distintas de las de una aseguradora: menor complejidad actuarial, pero gran fragmentación documental y enormes asimetrías informativas.

**EIOPA, encuesta GenAI de febrero de 2026:** respuestas de 347 entidades de 25 países; aproximadamente 65% ya empleaba GenAI, pero el 64% de casos estaba aún en prueba de concepto. El trabajo de back-office y siniestros predomina, y la supervisión humana sigue siendo esencial. Implicación: evitar vender autonomía como madurez; construir trazabilidad, evaluación y límites por rol. Fuente primaria: https://www.eiopa.europa.eu/publications/generative-ai-market-survey-outlook-use-cases-and-risk-management_en.

**EIOPA, estabilidad financiera junio 2026:** IA, dependencia de proveedores, ciberamenazas y clima se relacionan con nuevos riesgos operativos y sistémicos. La ventaja competitiva no puede ser solo precisión del modelo; también diversidad de proveedores, recuperación, capacidad de abstención y gobernanza. https://www.eiopa.europa.eu/

**OCDE, Global Insurance Market Trends 2026:** identifica clima/catástrofes y ciber como riesgos recurrentes; señala brechas de protección de pymes. Implicación: un *Protection Gap Ledger* útil para pymes, sin atribuir causalidad ni precisión de mercado al software. https://www.oecd.org/en/publications/global-insurance-market-trends-2026_c8be6585-en.html.

**Tendencias a investigar por mercado:** coberturas modulares y usage-based; ciberseguro conectado con postura de seguridad; riesgos climáticos y parametrización; IA en FNOL y triage; reaseguro y acumulación; salud y longevidad con salvaguardas; fraude multimodal; contratos legibles por máquina; open insurance con consentimiento; atención por voz/avatar; reconfiguración de riesgos de agentes autónomos. Cada tendencia requiere identificar qué usuario tiene el incentivo, quién posee el dato y quién asume el riesgo.


## 03 · Investigación científica: del paper al sistema

**P01 InsClaimBench — https://arxiv.org/abs/2610.09671 (investigación selectiva previa):** benchmark para tareas de siniestros. Transferencia propuesta: evaluación conjunta de hechos, cláusulas, reglas, decisiones e importes; no basta con que una respuesta suene convincente. Diseñar pares contrafactuales que alteren un endoso, fecha o exclusión y obliguen a cambiar la salida.

**P02 UNDERWRITE — https://arxiv.org/abs/2602.00456 (investigación selectiva previa):** interfaz, datos ruidosos y juicio experto importan. Transferencia: *underwriting assistant* como preparador de evidencia, no tarificador autónomo; medir discrepancias, abstenciones y correcciones de experto.

**P03 Underwriting the Agent Economy — https://arxiv.org/abs/2607.11999 (investigación selectiva previa):** conceptualiza riesgo de agentes. Transferencia: *Agent Liability Passport* con capacidad, mandato, permisos, trazas, exposición, terceros y límites. No inferir prima ni cobertura actuarial.

**P04 Towards foundation models for insurance risk modelling — https://arxiv.org/abs/2609.14576 (abstract consultado):** revisión de modelos de lenguaje, visión, geoespacial, series temporales, tabular y científicos para riesgo asegurador. Propone conectar representaciones a cálculos actuariales y evaluar contribución, estabilidad y conformidad. Límite: retraso en conocer el coste final de siniestros, rareza de grandes pérdidas, transferencia entre carteras y privacidad. Transferencia: modelo multimodal como extractor/feature producer, motor actuarial separado, pruebas out-of-time y drift.

**P05 Explainable boosting machine for predicting claim severity and frequency in car insurance — European Actuarial Journal, 2026, DOI 10.1007/s13385-026-00461-y:** estudia trade-off entre interpretabilidad y rendimiento predictivo. Transferencia: comparar GLM, GAM/EBM y boosting con calibración, estabilidad y explicaciones; no adoptar un predictor de automóvil como estimador de pyme.

**P06 Artificial Intelligence Approaches for Insurance Claim Analytics in Synthetic Environments — Systems, octubre 2026, DOI 10.3390/systems14101275:** entorno sintético para severidad, desarrollo de pagos y retrasos; útil como metodología de simulación, no como prueba de eficacia en producción.

**P07 Machine learning-based insurance risk assessment pipeline for natural disaster prediction and claims estimation — Frontiers in AI, junio 2026, DOI 10.3389/frai.2026.1802461:** referencia de modelado de desastres y estimación. Exigir evaluación de fuga temporal, distribución geográfica, exposición y escenarios extremos.

**Líneas científicas adicionales a estudiar:** probabilistic graphical models; Bayesian hierarchical reserving; Mack chain ladder y Bornhuetter-Ferguson; extreme value theory; compound Poisson; copulas y tail dependence; causal inference para prevención; survival analysis para tiempos de cierre; GNN para fraude con riesgo de falsos positivos; conformal prediction; selective classification; OOD detection; counterfactual explanations; robust optimization; climate downscaling; satellite remote sensing; multi-agent simulation; actuarial fairness; privacy-preserving learning; synthetic data evaluation.

**Ficha obligatoria por paper:** objetivo, corpus, jurisdicción, población, definición de target, leakage, splits temporales, baselines, métricas de calibración y error extremo, fairness, incertidumbre, reproducibilidad, licencia, resultado medido, límites y decisión. Los papers son referencias de investigación, no certificaciones de Agntia.


## 04 · Panorama competitivo mundial

| Empresa/plataforma | Núcleo que estudiar | Oportunidad Agntia | Estado de investigación |
|---|---|---|---|
| Guidewire | PolicyCenter, ClaimCenter, BillingCenter, IA | capa agéntica de evidencia sobre sistemas existentes | referencia oficial selectiva |
| Duck Creek | core P&C, inteligencia y distribución | interoperabilidad y contexto pyme | referencia oficial selectiva |
| Sapiens | core insurance, digitalización | modelo multirramo y workflows | candidato |
| Majesco | cloud core insurance | orquestación de ciclo completo | candidato |
| EIS | plataforma insurance core | productos y APIs | candidato |
| Insurity | core P&C y analytics | riesgo comercial | candidato |
| BriteCore | core cloud P&C | modularidad | candidato |
| Socotra | core insurance API-first | contratos y versionado | candidato |
| OneShield | policy/claims/billing | límites de especialización | candidato |
| Applied Systems | broker management | intermediarios y CRM | candidato |
| Vertafore | distribución y agencias | gestión de cartera | candidato |
| Novidea | insurance management | broker operating model | candidato |
| Akur8 | pricing y reserving | modelos interpretables | candidato |
| Earnix | pricing y personalización | simulación con control | candidato |
| hyperexponential | pricing decision intelligence | evaluación de escenarios | candidato |
| Cytora | risk digitization | ingestión y calidad de datos | candidato |
| Send Technology | underwriting workbench | revisión y priorización | candidato |
| Tractable | visión en siniestros | estimación visual asistida | candidato |
| CCC Intelligent Solutions | auto claims y reparación | cadena de evidencias | candidato |
| Shift Technology | fraude y claims | anomalías explicables | candidato |
| FRISS | fraude/riesgo | investigación humana | candidato |
| CLARA Analytics | analítica de siniestros | señales de severidad | candidato |
| ICEYE | observación satelital y catástrofes | verificación geoespacial | candidato |
| Moody's RMS | modelos de catástrofe | escenarios y incertidumbre | candidato |
| Verisk | datos, riesgo y claims | gobernanza de datos | candidato |
| Swiss Re | reaseguro, investigación y riesgo | conocimiento de acumulación | candidato |
| Munich Re | riesgo, ciber y paramétricos | prevención y resiliencia | candidato |
| AXA | aseguradora multirramo | journeys y atención | candidato |
| Allianz | aseguradora global | cartera y servicios | candidato |
| Lemonade | digital insurance/claims | experiencia de usuario y límites | candidato |
| Wefox | distribución digital | intermediación y compliance | candidato |
| CoverWallet | seguros para empresas | comparación y necesidades de pymes | candidato |
| Qover | embedded insurance | APIs y journeys integrados | candidato |
| bolttech | embedded insurance | ecosistema de distribución | candidato |
| Coalition | ciberseguro + seguridad | conexión con Agntia Ciberseguridad | candidato |
| At-Bay | ciberseguro y prevención | continuous risk management | candidato |
| Marsh McLennan | corretaje y risk advisory | metodología de asesoramiento | candidato |
| Aon | brokerage y analytics | consultoría de riesgos | candidato |

**Método de comparación, no ranking publicitario:** fichas por empresa con URL primaria, fecha, segmento, producto, territorio, rol regulado, interoperabilidad, IA, provenance, data residency, API real, licencia, precio contractual, límites, demo probada, seguridad, capacidades confirmadas y lagunas. No afirmar que una compañía carece de una característica sin haberlo comprobado. **Ventaja buscada:** no sustituir la plataforma del carrier; crear el gemelo de riesgo de la empresa cliente y conectarlo con sus procesos reales.


## 05 · Repositorios públicos y estándares abiertos

**openIMIS** (https://github.com/openimis): arquitectura modular para financiación sanitaria y protección social; backend Python y frontend JS. Licencia AGPLv3 en componentes consultados previamente. Valioso para modelado de beneficiario/proveedor/pagador y workflow de reclamaciones; **no** equivalente a un core multirramo comercial ni instalable sin revisar obligaciones AGPL, extensiones y entorno.

**Oasis Loss Modelling Framework** (https://github.com/OasisLMF/OasisLMF; https://oasislmf.org/): modelado abierto de catástrofes con motor de simulación, formatos de hazard/vulnerability y API; licencia BSD-3-Clause del core según metadata previa, pero modelos/datasets pueden tener derechos distintos. **No** es motor de tarifas ni de cobertura contractual. Investigar ktools, Open Data Standards y arquitectura de escenarios.

**FINOS Common Domain Model** (https://github.com/finos/common-domain-model): contratos/eventos estandarizados para finanzas; inspiración de interoperabilidad, no un modelo asegurador listo para copiar. Licencia Community Specification requiere evaluación jurídica específica.

**OpenInsurance wiki** (https://github.com/sluyasu/OpenInsurance): iniciativa pública que transforma PDFs de condiciones generales en una base enlazada y citada, con interfaz MCP descrita por el autor. Hipótesis de gran interés para *Policy Knowledge Graph*: verificar fidelidad de citas, jurisdicción, cobertura de fuentes, actualizaciones, licencia y mantenimiento antes de adoptarlo.

**aposin/openinsuranceplatform** (https://github.com/aposin/openinsuranceplatform): la página del proyecto anuncia una plataforma core amplia, pero el README visible indica «Coming soon». **No tratar como core implementado o probado**; observar evolución.

**Otros candidatos a investigación, no auditados:** OpenL Tablets (reglas de negocio), Drools (reglas y decisiones), Camunda/Temporal (orquestación con revisión de licencias), Open Policy Agent (autorización), PostgreSQL/pgvector (provenance), Apache Arrow/Parquet (datasets), DuckDB (análisis), GeoPandas/Rasterio/xarray (geoespacial), H3 (indexación espacial), MLflow (versionado de modelos), Evidently (drift), SHAP (explicabilidad), scikit-learn/statsmodels (baselines), PyMC (incertidumbre), DVC (datasets), OpenTelemetry (trazas), Presidio (redacción PII), Tika/Marker (documentos). Cada candidato exige ADR de licencia, calidad, coste, límites y compatibilidad.

**Estándares y esquemas a estudiar:** ACORD (mensajería y modelos de seguros, **licencias/derechos por verificar**); Open Insurance de EIOPA como tendencia, no API universal; ISO 8601 y monedas ISO 4217; EIOPA Solvency II taxonomies cuando aplique al operador; IFRS 17 para contabilidad de aseguradoras, no para cualquier pyme; OGC y STAC para geodatos; OpenAPI/JSON Schema para adaptadores; SBOM/SLSA para cadena de suministro; W3C PROV para procedencia; verifiable credentials para documentos donde exista aceptación jurídica; ODRL para derechos de uso de datos.

**Shas de investigación interna 13/11:** openIMIS backend `8132099903430b5d8abc4ac5e53d6fdf719e080a`; frontend `8146bb2e5e48da90dbff450294f312fa665d878b`; OasisLMF `b2e63308c7da2024f32d90992098a285e1e77729`; FINOS CDM `037e7e96db965e27ac590c284fcec3528c8fa678`. Lecturas README/metadata, no auditorías completas ni pins de producción.


## 06 · Conceptos diferenciales propios

**I. Insurance Reality Graph:** grafo de activos, ubicaciones, procesos, personas autorizadas, terceros, riesgos, controles, incidentes, contratos, pólizas, exclusiones, deducibles y siniestros. Cada arista incluye fuente, fecha, responsable y certeza.

**II. Protection Gap Compiler:** calcula *hipótesis de brecha* al contrastar exposición declarada, cláusulas, límites, periodos, endosos y exclusiones. Estados: `documented`, `possible_gap`, `unverified`, `needs_broker_review`. Nunca «asegurado» sin prueba contractual y confirmación cuando corresponda.

**III. Coverage Proof Graph:** una afirmación sobre cobertura apunta a versión de póliza, sección, texto, jurisdicción, hecho, periodo, excepción y responsable. No confundir similitud textual con cobertura legal.

**IV. Risk & Resilience Digital Twin:** escenarios sobre activos y procesos: incendio, inundación, interrupción, ransomware, responsabilidad civil, transporte, cese de actividad. Modelo probabilístico separado de regla contractual.

**V. Claim Evidence-to-Recovery Chain:** cronología de hecho, daño, peritación, mitigación, documentación, comunicaciones y resolución. No automatizar una decisión adversa.

**VI. Insurance Event Ledger:** todos los hitos de renovación, cambios de riesgo, notificaciones, reservas, primas y claims con semántica de evento, versiones y causalidad; eventos observados no equivalen a efectos confirmados.

**VII. Clause Conflict Observatory:** detecta contradicciones y precedencias entre condiciones particulares, generales, endosos, exclusiones, renovaciones y versiones.

**VIII. Preventive ROI Engine:** compara coste de controles, reducción hipotética de exposición y costes de interrupción; incertidumbre y supuestos explícitos, no garantía de prima inferior.

**IX. Agent Liability Passport:** registro de capacidades, mandato, decisiones automatizadas, supervisión, herramientas, datos y exposiciones de agentes que operan en la empresa; conecta con Ciberseguridad y Legal.

**X. Parametric Trigger Studio:** simula disparadores objetivos (lluvia, viento, temperatura, índice) con fuentes y bases de riesgo; **no** crea ni activa un contrato paramétrico ni paga indemnizaciones.

**XI. Renewal Intelligence Loop:** observa vencimientos, cambios de negocio, claims, exposición y condiciones, prepara revisión de cartera y decisiones del cliente/mediador.

**XII. Insurance Knowledge Commons:** corpus documental permitido y versionado de productos, glosarios y normas, con cobertura por mercado y derechos de reutilización.

**XIII. Explainable Risk Model Registry:** cada modelo declara población, fecha, entrenamiento, incertidumbre, drift, fairness y límites. Nunca usar un score opaco como único fundamento de rechazo.

**XIV. Business Interruption Causality Map:** relaciona procesos, proveedores, ingresos, dependencias digitales, RTO/RPO, mitigaciones y cláusulas de interrupción, con estimaciones revisables.

**XV. Recovery Confidence Ledger:** distingue recepción, evaluación, petición de información, decisión del operador, pago y cierre; ninguna predicción se presenta como indemnización debida.

**XVI. Cross-Domain Insurance Mesh:** eventos mínimos entre Finanzas, Gestoría, Legal, Ciberseguridad, RRHH, Clientes y Operaciones, con AuthorityMap y propósito, sin duplicar propiedad de datos.

Estos motores son **hipótesis originales de producto y arquitectura**, no patentes, implementaciones ni pruebas de superioridad.


## 07 · Arquitectura conceptual: 16 planos

1. **Enterprise Context:** actividades, sedes, empleados, vehículos, activos, inventarios, servicios y terceros.
2. **Risk Ontology:** taxonomía de peligros, vulnerabilidades, exposición, impacto y mitigaciones.
3. **Asset & Exposure Graph:** valores, ubicaciones, concentraciones, procesos críticos y provenance.
4. **Policy Document Intelligence:** ingesta de PDF/Word, OCR, cláusulas, endosos y versiones.
5. **Coverage Knowledge Graph:** riesgos cubiertos, exclusiones, franquicias, límites, agregados y periodos.
6. **Applicability & Temporal Rules:** territorios, sujetos, fechas, condiciones y precedencias.
7. **Market Intelligence:** productos y condiciones públicos con derechos de reutilización.
8. **Quote & Suitability Workspace:** comparación neutral y revisión del distribuidor competente.
9. **Claims Evidence Desk:** FNOL preparatorio, custodia, cronología, comunicaciones y seguimiento.
10. **Risk Simulation Lab:** catástrofes, ciber, interrupción, sensibilidad y escenarios.
11. **Model Governance:** calibración, incertidumbre, sesgo, drift y revisión humana.
12. **Regulated Authority Gateway:** mandatos, competencias, approvals, actos externos y receipts.
13. **Provider Adapter Mesh:** carriers, brokers, openIMIS, Oasis, documentos, sensores, GIS.
14. **Agent & Conversation Plane:** LAIA supervisa, especialista prepara, avatar explica; permisos en runtime.
15. **Privacy, Evidence & Audit:** segregación, retención, minimización, provenance, custodia y acceso.
16. **Learning & Feedback Loop:** cambios de riesgo, resultados de siniestros, revisión de hipótesis y mejora sin contaminación entre clientes.

**Secuencia cognitiva:** `Question → Scope → Facts & Evidence → PolicySnapshot → RuleApplicability → CompetingHypotheses → Uncertainty → Human/Regulated Review → Deliverable/Authorized Effect → Receipt → Memory Promotion`. Cada capa puede abstenerse. El LLM propone narrativas, pero el estado jurídico/contractual se decide fuera del modelo.

**Contratos propuestos, no equivalentes a contratos implementados:**
```ts
type InsuranceCaseScope = {
  originTenantId: string; targetTenantId: string; matterId: string;
  jurisdiction: string; purpose: string; mandateRef: string;
  actorRef: string; expiresAt: string; professionalRef?: string;
};
type PolicySnapshot = {
  policyRef: string; versionRef: string; insurerRef: string;
  effectiveFrom: string; effectiveTo: string | null;
  generalConditionsRefs: string[]; particularConditionsRefs: string[];
  endorsementRefs: string[]; documentHashes: string[];
  currency: string; reviewState: "unverified"|"reviewed";
};
type CoverageAssertion = {
  riskRef: string; policyVersionRef: string; clauseRefs: string[];
  eventFactsRefs: string[]; jurisdiction: string; relevantAt: string;
  interpretation: "possible"|"excluded_hypothesis"|"unknown";
  uncertainty: string[]; reviewerRef?: string;
};
type ClaimEvidence = {
  evidenceRef: string; claimRef: string; contentHash: string;
  sourceRef: string; custodyRef: string; collectedAt: string;
  sensitiveClass: "none"|"personal"|"health"|"financial";
  authority: "data_only";
};
type LossScenario = {
  scenarioRef: string; assetRefs: string[]; hazardModelRef: string;
  exposureSnapshotRef: string; assumptions: string[];
  lossDistributionRef?: string; validationRef?: string;
  coverageEstimate: "not_assessed"|"illustrative";
};
type RegulatedAction = {
  tenantId: string; operation: "request_review"|"export_case"|"prepare_notice";
  payloadHash: string; mandateRef: string; approvalRef: string;
  targetOperatorRef?: string; execution: "proposal_only";
};
```
**Invariantes:** fuente documental no concede autoridad; `null` o `unknown` no es `false`; moneda y unidades explícitas; no usar floats para dinero; deducibles y límites se aplican solo con regla versionada; temporalidad y ámbito son campos obligatorios; approval vinculada a contenido; un receipt de transporte no equivale a aceptación del siniestro.

**Integración AgntiaPro:** el padre es dueño de identidad canónica, tareas, aprobaciones, memoria global permitida, eventos y agentes. Este hijo posee el dominio de pólizas, exposición, claims y escenarios. Ciberseguridad aporta postura técnica; Legal aporta interpretación y obligaciones; Finanzas valora impacto; Gestoría clasifica registros; Ventas gestiona relación comercial; Comunicación gestiona mensajes. No duplicar tablas maestras ni exponer expedientes completos a hermanos.


## 08 · Casos de uso y experiencia radicalmente útil

**Caso A — autónomo:** sube tres pólizas, recibos y descripción de actividad. LAIA muestra calendario, riesgos declarados, dudas de cobertura y tareas de revisión. El usuario ve cada frase con enlace a cláusula. Resultado: dossier para mediador, no dictamen de cobertura.

**Caso B — comercio:** el sistema relaciona inventario, alquiler, TPV, proveedor logístico, interrupción y pólizas. Presenta escenarios y una lista priorizada de preguntas sobre límites, franquicias, daños eléctricos, lucro cesante y dependencia de terceros.

**Caso C — ciberincidente:** Agntia Ciberseguridad registra incidente técnico; Seguros prepara evidencia de cronología, controles, notificaciones y cláusulas; Legal evalúa deberes; el operador autorizado gestiona cobertura. No remitir automáticamente secretos a aseguradoras.

**Caso D — inundación:** datos de precipitación/satélite y ubicación alimentan escenario; el sistema diferencia hazard, daño observado, riesgo contractual, requisitos documentales y estimación ilustrativa. Evitar «el satélite confirma el daño interior».

**Caso E — renovación:** antes de vencer, detectar cambio de facturación, plantilla, activos, ubicación, actividad y proveedores; preparar preguntas y anexos para broker; no renovar ni cancelar automáticamente.

**Caso F — flota:** compara límites, asistencia, franquicias, conductores, uso, kilometraje y siniestralidad; explica incertidumbre y dependencia del texto contractual.

**Caso G — profesionales:** responsabilidad civil profesional, ciber, protección jurídica, D&O, accidentes y continuidad; mapa de exclusiones y agregados.

**Caso H — empresa con agentes IA:** construir *Agent Liability Passport* y riesgos por errores de herramientas, pagos, comunicaciones, datos y acciones autónomas; preparar consulta con mediador sobre coberturas disponibles.

**UI de destino:** Insurance Home, Company Risk Twin, Policy Vault, Coverage Explorer, Clause Proof, Protection Gaps, Renewal Radar, Claims Desk, Evidence Timeline, Risk Simulator, Broker Review Inbox, Regulatory Authority, Privacy & Consent, Audit/Cost, Agent Office. La experiencia se articula en preguntas y pruebas, no en dashboards llenos de porcentajes sin origen.


## 09 · Economía, mercado y estrategia

**Segmento inicial:** pymes españolas de 1–50 empleados con pólizas fragmentadas, ciberdependencia, activos y poca capacidad interna de gestión de riesgos. AgntiaPro ya compila empresas con relación de servicio gestionado: Seguros debe entrar como capacidad progresiva, sin afirmar distribución regulada ni vender productos sin intermediario habilitado.

**Tres wedges:** (1) inventario y vencimientos de pólizas; (2) diagnóstico documental de posibles brechas con fuentes; (3) carpeta de siniestro y preparación de reclamación. Cada uno ahorra coordinación y errores de documentación sin necesitar un core asegurador ni acceso a una aseguradora.

**Modelo comercial:** servicio tecnológico de inteligencia y preparación, opcionalmente complementado por mediadores/operadores autorizados mediante contratos separados. Nunca asumir comisión de distribución, asesoramiento regulado o acceso a datos de aseguradora sin evaluación legal.

**Cost drivers:** páginas/OCR, embeddings, LLM, almacenamiento de originales, geodatos, APIs de terceros, revisión profesional, tiempo de custodia, reindexación por endoso, recuperación y soporte. Medir coste por póliza procesada, por siniestro y por renovación; asignar budgets por tenant y etapa.

**North-star metrics verificables:** porcentaje de pólizas con versión y fecha acreditadas; proporción de claims con evidence manifest; plazo de preparación de expediente; citas/cláusulas verificadas; renovaciones no olvidadas; falsos positivos de brecha; errores críticos por revisión; coste por caso; cobertura de fuentes y abstención apropiada. No confundir satisfacción con validez contractual.


## 10 · Regulación, ética y riesgos

**España:** Real Decreto-ley 3/2020, distribución de seguros (https://www.boe.es/eli/es/rdl/2020/02/04/3/con); Ley 50/1980 de Contrato de Seguro (https://www.boe.es/buscar/act.php?id=BOE-A-1980-22501); supervisión DGSFP y normas por ramo; RGPD y LOPDGDD. La distribución, asesoramiento personalizado, comparación con intervención comercial y tratamiento de datos pueden activar obligaciones específicas. Revisión jurídica previa a producto, no suponer que «solo API» elimina regulación.

**UE:** Solvencia II para entidades aseguradoras, IDD, DORA para entidades financieras dentro de su ámbito, AI Act según clasificación/rol/uso y fechas aplicables, eIDAS, GDPR y normas sectoriales. No aplicar automáticamente obligaciones de aseguradora a un SaaS externo ni excluirlo sin análisis. EIOPA Opinion on AI governance and risk management: https://www.eiopa.europa.eu/publications/opinion-artificial-intelligence-governance-and-risk-management_en.

**Riesgos de justicia:** discriminación por proxies de salud, edad, discapacidad, territorio, género o renta; automatización de denegaciones; asimetría de información; falta de explicaciones; datos históricos sesgados; riesgo de segmentación excesiva que erosione mutualización. Evitar usar variables sensibles o inferidas sin base legal, necesidad y evaluación.

**Riesgos de conocimiento:** condiciones generales sin particulares; endosos omitidos; fecha incorrecta; fuente de póliza desactualizada; exclusiones contextuales; contratos colectivos; clausulado ambiguo; divisas; franquicias agregadas; límites por evento vs anualidad; sumas aseguradas insuficientes; doble seguro; infraseguro/sobreseguro; causalidad de siniestro; retrasos de denuncia. **Ningún modelo convierte una interpretación probable en decisión vinculante.**

**Riesgos de seguridad:** inyección en PDFs, OCR manipulado, exfiltración por conectores, leakage cross-tenant, health data, SSRF, suplantación de mediador, firma falsa, pagos fraudulentos, prompt injection en documentos, transferencias a proveedores de modelos y retención indebida. Preservar evidencia mínima y cadena de custodia.

**Frontera ética:** no perfilar a una persona para denegar o encarecer cobertura automáticamente; no generar sospecha de fraude como acusación; no automatizar decisiones adversas; no utilizar «simulación» para inducir certeza contractual.


## 11 · Evaluación científica y pruebas adversariales

**A. Policy Understanding:** extracción de versiones, cláusulas, límites, franquicias, periodos y endosos; medir precisión/recall por campo y errores críticos. Dataset con PDFs sintéticos, escaneos, tablas, anexos y contradicciones.

**B. Coverage Reasoning:** evaluar afirmación con fuente exacta, temporalidad, hechos y excepciones; medir tasa de abstención correcta, falsa cobertura y falsa exclusión. Variar un hecho a la vez.

**C. Claim Preparation:** distinguir notificación preparada de presentada; cadena de evidencia; fechas y plazos; métricas de completitud y errores de autoridad.

**D. Risk Modeling:** GLM baseline, calibración, backtesting temporal, incertidumbre, tail losses, sensibilidad, drift y OOD. Modelos científicos de clima con validación espacial y escenarios, no predicción meteorológica determinista.

**E. Fairness & Privacy:** análisis por subgrupos con salvaguardas, proxy detection, minimización, acceso, retención y finalidad; no generar datasets sensibles sin base legal.

**F. Cross-Domain:** ciberincidente con pérdidas, contrato, factura y obligación; comprobar que cada dominio conserva ownership y que una actualización se propaga como revisión, no como hecho inventado.

**32 pruebas adversariales mínimas:** (1) póliza caducada; (2) endoso omitido; (3) condiciones particulares contradicen generales; (4) límite anual vs por siniestro; (5) franquicia porcentual con mínimo; (6) divisa distinta; (7) prima confundida con capital; (8) cláusula OCR «no» omitido; (9) página faltante; (10) texto inyectado en PDF; (11) imagen falsa de sello; (12) evento anterior al inicio; (13) renovación sin aceptación; (14) actividad no declarada; (15) ubicación incorrecta; (16) evento climático geolocalizado erróneo; (17) satélite sin resolución; (18) FNOL sin fecha acreditada; (19) peritaje contradictorio; (20) evidencia de otro tenant; (21) datos de salud sin finalidad; (22) prompt solicita denegación; (23) agente intenta contratar; (24) mediador no acreditado; (25) proveedor no configurado; (26) cotización obsoleta; (27) timeout tras posible efecto; (28) duplicado con idempotency key; (29) restore reintroduce datos suprimidos; (30) modelo predice fraude por proxy sensible; (31) dos modelos discrepan; (32) se pretende presentar indemnización estimada como confirmada.

**Gates científicos:** no comparar por un solo accuracy; reportar coste, latencia, falsos positivos/negativos graves, cobertura de fuentes, incertidumbre, human review burden, fiabilidad por ramo y periodo. Los resultados de papers o proveedores no son resultados propios.


## 12 · Horizonte de investigación y convergencia

**Ola I — Insurance Knowledge Atlas:** mapa mundial de productos, normas, vendors, papers, OSS, licencias, datos y costes. Distinguir acceso público de licencia de uso comercial.

**Ola II — Insurance Reality Graph:** ontología de empresa/activo/riesgo/póliza/claim, bitemporalidad y provenance.

**Ola III — Policy Intelligence:** OCR, condiciones, endosos, semántica, comparaciones, contradicciones y abstención.

**Ola IV — Protection Gap Compiler:** reglas explícitas, evidencia y revisión; prioridad en pymes, no underwriting.

**Ola V — Claims Evidence & Recovery:** cronología, custodia, preparación y seguimiento con humanos autorizados.

**Ola VI — Risk Twin & Resilience:** escenarios de ciber, incendio, inundación, continuidad, terceros y costes ilustrativos.

**Ola VII — Market & Product Intelligence:** catálogos públicos autorizados, comparaciones transparentes y límites regulatorios.

**Ola VIII — Parametric & Geospatial Lab:** sensores, índices, bases de riesgo y OasisLMF cuando existan modelos/datos con licencia.

**Ola IX — Model Science:** GLM/EBM, probabilidades calibradas, causalidad, incertidumbre, drift y fairness.

**Ola X — Agent Liability & Cross-Domain Mesh:** gobernanza de agentes y coordinación con Legal, Finanzas, Gestoría y Ciberseguridad.

**Ola XI — Professional Ecosystem:** interoperabilidad con mediadores/operadores autorizados, consentimientos, receipts y portabilidad.

**Ola XII — Continuous Insurance Intelligence:** aprendizaje de pérdidas y cambios de exposición, revisión continua y auditoría reproducible.

**Landmarks conceptuales, no plan de ejecución de Freebuff:** L1 empresa entiende su cartera; L2 cada hipótesis de cobertura muestra evidencia; L3 un siniestro produce dossier íntegro; L4 se cuantifican escenarios con incertidumbre; L5 el mediador puede revisar y confirmar; L6 el sistema aprende sin atribuirse autoridad regulada.

**Investigaciones pendientes con preguntas falsables:** (1) ¿qué estructura de datos conserva correctamente endosos? (2) ¿cómo comparar cláusulas entre aseguradoras sin sesgo? (3) ¿qué fuentes públicas son reutilizables? (4) ¿qué umbral de OCR requiere revisión? (5) ¿qué modelos de pérdidas generalizan a pymes españolas? (6) ¿cómo validar georiesgo en Canarias y península? (7) ¿qué incertidumbre comunica mejor el usuario? (8) ¿qué documentación mejora tiempo de tramitación? (9) ¿cómo gestionar derechos de salud? (10) ¿qué límites de rol impone distribución? (11) ¿qué acuerdos permiten interoperar con carriers? (12) ¿qué eventos cruzan dominios sin filtrar datos? (13) ¿qué métricas reflejan reducción de pérdidas real y no correlación? (14) ¿cómo evitar fraude adversarial sin acusar inocentes? (15) ¿qué costes de revisión profesional hacen sostenible el servicio?

**Fuentes principales y clasificación:** investigación previa interna en `docs/02-investigacion.md`, `docs/research/sources.json` y `docs/research/repositories.json`; nueva consulta web de EIOPA, OCDE, OasisLMF, openIMIS, OpenInsurance y abstracts/papers citados. Fuentes comerciales en tabla son **candidatos de benchmarking**, no auditorías ejecutadas. Arquitectura, nombres de motores, estrategia y roadmap son **diseño propio**, no software entregado.

**Nota de alcance:** la rama `freebuff/dc29ebb26a238dd104573c94` contiene código inicial y reporte de 133 tests declarados, con 28 campañas PASS, 9 STUB, 4 PARTIAL y 1 NOT_PASS; este documento no audita ni dirige esa implementación. Su misión es **fijar la visión final state-of-the-art**, independientemente del estado coyuntural del desarrollo. No modifica código ni ramas de trabajo.


## Anexo A · Taxonomía de 96 capacidades de destino

**Estas capacidades son aspiracionales, no un inventario de código.** Cada una se convierte en una hipótesis comprobable con dueño de dato, fuente, incertidumbre, revisión y valor al cliente.

### Riesgo empresarial
- **INS-001 · inventario de activos:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-002 · mapa de procesos:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-003 · mapa de dependencias:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-004 · clasificación de peligros:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-005 · ubicaciones geoespaciales:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-006 · exposición a terceros:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-007 · continuidad operativa:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-008 · histórico de incidentes:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-009 · valoración de pérdidas:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-010 · vulnerabilidades mitigables:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-011 · riesgo cibernético:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-012 · riesgo climático:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.

### Conocimiento contractual
- **INS-013 · versionado de pólizas:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-014 · condiciones particulares:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-015 · condiciones generales:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-016 · endosos:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-017 · cláusulas y fragmentos:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-018 · franquicias:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-019 · límites y agregados:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-020 · vigencia:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-021 · exclusiones:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-022 · sublímites:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-023 · carencias:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-024 · obligaciones del asegurado:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.

### Inteligencia de cobertura
- **INS-025 · evidencia por afirmación:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-026 · ambigüedad contractual:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-027 · conflictos de cláusulas:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-028 · hipótesis de brecha:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-029 · comparación entre versiones:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-030 · infraseguro:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-031 · sobreseguro:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-032 · doble seguro:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-033 · territorio aplicable:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-034 · hechos desencadenantes:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-035 · fuentes oficiales:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-036 · revisión profesional:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.

### Siniestros
- **INS-037 · preparación FNOL:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-038 · cronología:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-039 · custodia de fotos:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-040 · custodia de facturas:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-041 · prueba de evento:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-042 · reporte de daños:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-043 · solicitudes de información:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-044 · seguimiento de estado:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-045 · estimación ilustrativa:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-046 · revisión pericial:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-047 · comunicación autorizada:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-048 · cierre con receipts:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.

### Modelado avanzado
- **INS-049 · escenarios probabilísticos:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-050 · simulación de catástrofes:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-051 · sensibilidad de parámetros:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-052 · distribución de pérdidas:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-053 · riesgo de cola:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-054 · modelos de frecuencia:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-055 · modelos de severidad:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-056 · calibración:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-057 · explicabilidad:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-058 · drift temporal:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-059 · riesgo geoespacial:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-060 · validación fuera de distribución:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.

### Mercado y prevención
- **INS-061 · inventario de productos:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-062 · comparación neutral:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-063 · renovaciones:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-064 · cambios de actividad:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-065 · simulación paramétrica:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-066 · priorización de mitigaciones:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-067 · ROI preventivo:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-068 · benchmark con derechos:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-069 · alertas de protección:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-070 · consultas a mediador:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-071 · registro de preferencias:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-072 · explicación de trade-offs:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.

### Operación agéntica
- **INS-073 · LAIA supervisora:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-074 · especialista de seguros:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-075 · twin por cliente:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-076 · mandato acotado:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-077 · approval por hash:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-078 · Evidence-to-Effect:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-079 · event ledger:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-080 · handoff a Legal:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-081 · handoff a Finanzas:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-082 · handoff a Ciberseguridad:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-083 · seguimiento de tareas:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-084 · memoria con consentimiento:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.

### Gobernanza
- **INS-085 · aislamiento tenant:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-086 · acceso por expediente:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-087 · datos sensibles:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-088 · registro de finalidad:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-089 · retención:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-090 · procedencia de fuente:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-091 · abstención:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-092 · revisión competente:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-093 · prevención de sesgos:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-094 · auditoría de modelos:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-095 · costos y presupuestos:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.
- **INS-096 · reconciliación de efectos:** entrada con procedencia y ámbito; salida inspeccionable y versionada; fallo como `unknown/needs_review`; prohibición de efecto regulado sin operador competente.

## Anexo B · Referencias prioritarias

- EIOPA GenAI survey (2026): https://www.eiopa.europa.eu/publications/generative-ai-market-survey-outlook-use-cases-and-risk-management_en
- EIOPA Financial Stability (junio 2026): https://www.eiopa.europa.eu/
- OCDE Global Insurance Market Trends 2026: https://www.oecd.org/en/publications/global-insurance-market-trends-2026_c8be6585-en.html
- EIOPA protection gaps: https://www.eiopa.europa.eu/insurance-protection-gaps-changing-climate-2026-04-16_en
- Oasis LMF: https://oasislmf.org/ ; https://github.com/OasisLMF/OasisLMF
- openIMIS: https://github.com/openimis
- OpenInsurance: https://github.com/sluyasu/OpenInsurance
- Openinsuranceplatform (prelanzamiento): https://github.com/aposin/openinsuranceplatform
- InsClaimBench: https://arxiv.org/abs/2610.09671
- UNDERWRITE: https://arxiv.org/abs/2602.00456
- Underwriting the Agent Economy: https://arxiv.org/abs/2607.11999
- Towards foundation models for insurance risk modelling: https://arxiv.org/abs/2609.14576
- EBM claim severity/frequency: https://doi.org/10.1007/s13385-026-00461-y
- Synthetic claims analytics: https://doi.org/10.3390/systems14101275
- Catastrophe ML: https://doi.org/10.3389/frai.2026.1802461
- RDL 3/2020: https://www.boe.es/eli/es/rdl/2020/02/04/3/con
- Ley de Contrato de Seguro: https://www.boe.es/buscar/act.php?id=BOE-A-1980-22501
- EIOPA AI opinion: https://www.eiopa.europa.eu/publications/opinion-artificial-intelligence-governance-and-risk-management_en

**Siguiente investigación:** profundizar los papers íntegros, reproducir baselines sobre corpus sintético español, auditar repos externos por código/licencias, contrastar productos comerciales mediante pruebas autorizadas y revisar legalmente la frontera de distribución. Ninguna de esas tareas se declara realizada en esta V1.
