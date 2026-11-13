# Campaña de42 fases

Diseño para una implementación futura autorizada. **42 campañas,294 tareas,84 escenarios, NOT_STARTED/NOT_EXECUTED.** No plazo ficticio de siete días. No modificar agente. Fuentes/contratos no equivalen a capacidades probadas.

[Manifest estructurado](campaign.json): IDs/dependencias, campos, operaciones, invariantes, tareas/aceptación, gates, bloqueos y rollback. Rutas de artefactos son propuestas, no archivos existentes.

C01–C08 fundaciones; C09–C32 dominio; C33–C42 exposición/servicio/seguridad/operaciones/aceptación. Avance por gates con capacidades no verificadas deshabilitadas; un fake no pasa gate real. Checkpoints cada 5 y al final de 2.

| Fase | Documento | Estado | Checkpoint |
|---|---|---|---|
| 01 | [Baseline, fuentes y alcance](01-baseline-fuentes-y-alcance.md) | NOT_STARTED | — |
| 02 | [Autoridad por dominio y contrato SaaS](02-autoridad-por-dominio-y-contrato-saas.md) | NOT_STARTED | — |
| 03 | [Supabase JWT y principal](03-supabase-jwt-y-principal.md) | NOT_STARTED | — |
| 04 | [Twins y nomenclatura canónica](04-twins-y-nomenclatura-canonica.md) | NOT_STARTED | — |
| 05 | [DTOs, esquemas y errores](05-dtos-esquemas-y-errores.md) | NOT_STARTED | Informe |
| 06 | [Persistencia, RLS y migraciones](06-persistencia-rls-y-migraciones.md) | NOT_STARTED | — |
| 07 | [Mandatos, finalidad y aprobaciones](07-mandatos-finalidad-y-aprobaciones.md) | NOT_STARTED | — |
| 08 | [Secretos, discovery y aislamiento remoto](08-secretos-discovery-y-aislamiento-remoto.md) | NOT_STARTED | — |
| 09 | [Evaluación del rol y actividad](09-evaluacion-del-rol-y-actividad.md) | NOT_STARTED | — |
| 10 | [Representación y destinatarios](10-representacion-y-destinatarios.md) | NOT_STARTED | Informe |
| 11 | [Declaración de riesgos](11-declaracion-de-riesgos.md) | NOT_STARTED | — |
| 12 | [Custodia póliza y endosos](12-custodia-poliza-y-endosos.md) | NOT_STARTED | — |
| 13 | [Extracción y cláusulas](13-extraccion-y-clausulas.md) | NOT_STARTED | — |
| 14 | [Necesidades y demandas](14-necesidades-y-demandas.md) | NOT_STARTED | — |
| 15 | [Inventario de coberturas](15-inventario-de-coberturas.md) | NOT_STARTED | Informe |
| 16 | [Solicitud de oferta](16-solicitud-de-oferta.md) | NOT_STARTED | — |
| 17 | [Importación de ofertas](17-importacion-de-ofertas.md) | NOT_STARTED | — |
| 18 | [Comparación explicable](18-comparacion-explicable.md) | NOT_STARTED | — |
| 19 | [Motor de reglas ilustrativo](19-motor-de-reglas-ilustrativo.md) | NOT_STARTED | — |
| 20 | [Estimaciones y franquicias](20-estimaciones-y-franquicias.md) | NOT_STARTED | Informe |
| 21 | [Adaptador openIMIS](21-adaptador-openimis.md) | NOT_STARTED | — |
| 22 | [Oasis y riesgo agregado](22-oasis-y-riesgo-agregado.md) | NOT_STARTED | — |
| 23 | [Intake de siniestro](23-intake-de-siniestro.md) | NOT_STARTED | — |
| 24 | [Evidencias de siniestro](24-evidencias-de-siniestro.md) | NOT_STARTED | — |
| 25 | [Cadena decisional revisable](25-cadena-decisional-revisable.md) | NOT_STARTED | Informe |
| 26 | [Handoff a operador](26-handoff-a-operador.md) | NOT_STARTED | — |
| 27 | [Decisión externa y explicación](27-decision-externa-y-explicacion.md) | NOT_STARTED | — |
| 28 | [Seguimiento y plazos](28-seguimiento-y-plazos.md) | NOT_STARTED | — |
| 29 | [Renovación y cambios](29-renovacion-y-cambios.md) | NOT_STARTED | — |
| 30 | [Reclamación y recurso](30-reclamacion-y-recurso.md) | NOT_STARTED | Informe |
| 31 | [Riesgo de agentes IA](31-riesgo-de-agentes-ia.md) | NOT_STARTED | — |
| 32 | [Privacidad y conservación sectorial](32-privacidad-y-conservacion-sectorial.md) | NOT_STARTED | — |
| 33 | [Reportes, dashboard e infografías](33-reportes-dashboard-e-infografias.md) | NOT_STARTED | — |
| 34 | [Portal responsive, chat y Anam](34-portal-responsive-chat-y-anam.md) | NOT_STARTED | — |
| 35 | [SDK TypeScript, Hono y tools](35-sdk-typescript-hono-y-tools.md) | NOT_STARTED | Informe |
| 36 | [Bridge de agente y eventos](36-bridge-de-agente-y-eventos.md) | NOT_STARTED | — |
| 37 | [Cooperación y handoff empresarial](37-cooperacion-y-handoff-empresarial.md) | NOT_STARTED | — |
| 38 | [Modelos, coste y observabilidad](38-modelos-coste-y-observabilidad.md) | NOT_STARTED | — |
| 39 | [Privacidad y pruebas adversariales](39-privacidad-y-pruebas-adversariales.md) | NOT_STARTED | — |
| 40 | [Vertical E2E y fallos distribuidos](40-vertical-e2e-y-fallos-distribuidos.md) | NOT_STARTED | Informe |
| 41 | [Operaciones, CI, backup y release](41-operaciones-ci-backup-y-release.md) | NOT_STARTED | — |
| 42 | [Aceptación, evidencia y handoff final](42-aceptacion-evidencia-y-handoff-final.md) | NOT_STARTED | Informe |

Informe: SHA/PR/diff, versiones/entorno, fases PASS/BLOCKED/NOT_VERIFIED, tests realmente ejecutados/pasados/fallidos/skipped, fixtures/receipts/fuentes, costo/riesgos y siguiente dependencia. No contar escenarios planeados como tests. STOP ante fuga, bypass de autorización/revisión, secreto, doble efecto o pérdida de audit. Producción/pagos/firmas/actos regulados fuera de esta entrega.
