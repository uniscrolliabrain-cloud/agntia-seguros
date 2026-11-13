# Investigación y decisiones

Fuentes primarias consultadas selectivamente 2026-11-13; no revisión sistemática ni benchmarks reproducidos. El registro separa abstract/README/documentación/anuncio, acceso fallido y validación de runtime. Revalidar al implementar porque versiones, planes y leyes pueden cambiar.

| Paper | Decisión de diseño (inferencia propia) |
|---|---|
| P01: InsClaimBench · [arXiv](https://arxiv.org/abs/2610.09671) | Evaluar reglas, módulos, decisión e importe conjuntamente; variantes de hechos deben propagarse coherentemente. |
| P02: UNDERWRITE · [arXiv](https://arxiv.org/abs/2602.00456) | Expertos, interfaces ruidosas y conocimiento de producto importan; eficiencia/confianza no igualan corrección de suscripción. |
| P03: Underwriting the Agent Economy · [arXiv](https://arxiv.org/abs/2607.11999) | Marco conceptual de riesgo de agentes, no tabla actuarial validada ni cobertura afirmativa garantizada para clientes. |

No se trasladan scores, porcentajes, tamaños de muestra o eficacia de los autores a Agntia. Leer un abstract no demuestra replicación de método o licencia de sus datasets. Se diseñarán fixtures originales con datos sintéticos y criterios de estado/efecto/proceso; antes de incorporar harness/datos ajenos revisar licencia, splits, dependencia de modelos y términos.

## Conceptos propuestos

Evidence-to-Effect Ledger une fuente, versión, actor, mandato, propuesta, approval y resultado confirmado. Scope-bound Twin conserva una identidad canónica y especialización local por cliente sin memoria global. Reviewable Decision Contract define hechos, estado protegido, resultado y qué requiere humano/competencia. Son propuestas de ingeniería de esta entrega, no afirmación de novedad científica o patente.

Para Operaciones y asistencia profesional de seguros, la decisión particular es: PolicyProjection separa condiciones particulares/generales/endosos y fechas, cada conclusión con cláusula/evidencia/unknown. RuleEvaluation guarda reglas atómicas y composición versionada; no inferir exclusiones, franquicias o precedencias. Estimate usa Decimal/currency y parámetros revisados, marcada ilustrativa. AdverseDecision y binding solo se registran desde prueba del operador competente, nunca por mayoría de modelos.

## Referentes actuales

| Referencia | Patrón estudiado |
|---|---|
| V01: Guidewire | Patrón de policy/claims/billing y agentes contextualizados; no acceso o licencia Community asumidos. |
| V02: EIOPA | Opinión de gobernanza/riesgo de IA consultada: proporcionalidad y controles contextualizados, no licencia del servicio. |
| V03: Duck Creek | Plataforma agéntica de seguro como referencia; API/contrato/capacidades reales pendientes. |

Las páginas oficiales describen oferta y novedades, no se probaron productos ni cuentas. No adoptar sus claims de cumplimiento, seguridad, productividad o certificaciones como propios. API/plan/edición/territorio y coste son gates de implementación. Fuentes no accesibles se registran, no sustituyen con una afirmación de capacidad. Algunas URLs cambian de ruta o versión: conservar el origen/redirect y no fijar un endpoint por memoria.

## Repos públicos

Se consultaron metadatos, SHA y README de los candidatos de [repositories.json](research/repositories.json). No son una auditoría completa ni se han instalado. Rama main/master/develop/hotfix no es un pin de release. Selección posterior por compatibilidad/licencia/recursos/ACL y evidencia con una instancia aislada. openIMIS backend/frontend declaran AGPLv3 en LICENSE.md, con dependencias/módulos a revisar; son referencia de financiación sanitaria y no equivalen a correduría multirramo española. OasisLMF BSD-3-Clause es modelado de catástrofes con datos/modelos separados, no tarificador universal. FINOS CDM tiene licencia Community Specification y ámbito financiero; se evalúa como referencia de contratos, no se instala como motor de seguros.

## Fuentes jurídicas y de seguridad

Supabase JWT/RLS y Anam se estudiaron en documentación oficial; nunca credenciales ni sesiones reales. Normativa común y específica en Dxx requiere interpretación contextual, territorio/fecha y revisión humana. No prometer cumplimiento universal por importar una librería o tener un dashboard. Un uso no cubierto debe quedar unsupported/needs_review.

| Fuente específica | Qué exige al diseño |
|---|---|
| D01: [Distribución seguros](https://www.boe.es/eli/es/rdl/2020/02/04/3/con) | Analizar actividad concreta, cualificación/registro/responsabilidad y contrato antes de operar; la etiqueta software no elimina requisitos. |
| D02: [Contrato seguro](https://www.boe.es/buscar/act.php?id=BOE-A-1980-22501) | Interpretación de póliza, comunicaciones y plazos requieren contexto, documentos y profesional competente. |
| D03: [EIOPA AI](https://www.eiopa.europa.eu/publications/opinion-artificial-intelligence-governance-and-risk-management_en) | Gobernanza, documentación y supervisión según uso/rol; no convierte modelo en decisor autorizado. |

Mantener preguntas abiertas: derechos/ediciones, fuente incompleta, verificación real de proveedor, operación humana y coste medido. El mapa del padre conserva lecturas heredadas y nuevas por el mismo SHA; no supone una relectura total. Cualquier divergencia futura se coteja antes del wiring. Nunca modificar el padre para que una prueba propia pase.
