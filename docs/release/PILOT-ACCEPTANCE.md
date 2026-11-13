# Aceptación del piloto · pendiente

Todos los puntos **NOT_EXECUTED**; este diseño no acredita producto o aceptación del owner.

| Gate | Evidencia mínima |
|---|---|
| Baseline | SHAs/instrucciones/fuentes/licencias y diferencias |
| Identidad/twin | Supabase JWT, membership/ACL, mandato canónico, scope y revocación |
| Persistencia | FK/RLS/roles reales, CAS/audit/outbox, restore |
| Datos | Fuentes, originales, hash/revisión, missing/stale/conflict explícitos |
| Dominio | Resultado y estado protegido conforme invariantes de cada módulo |
| Revisión | Humano/competencia/representación cuando aplique, approval exacta y vigente |
| Efecto | Intent/key/payloadHash/emisor único, receipt o incertidumbre visible |
| Seguridad | Dos tenants y recursos internos, secretos, prompt injection, SSRF |
| UI/AV | Responsive, accesibilidad/ES-EN-FR, Anam scoped o fallback texto |
| Operación | Backup/restore/rotación/retención/runbooks/costes medidos |
| Integración | Contratos API-SDK-host, fake separado de runtime real, padre intacto |

Vertical: Empresa/póliza sintéticas → alcance y profesional → extracción revisada → necesidades/limitaciones → notice de siniestro con evidencias → preparación → revisión humana → handoff sandbox con ACK; decisión externa referenciada, no generada como autoridad local.

Límite: Sin contratar/cancelar pólizas, cobrar primas, vincular cobertura, fijar precio vinculante, aceptar/denegar/pagar siniestros ni asumir distribución regulada por llamarse middleware. Piloto de preparación/asistencia y handoff a profesional/operador autorizado; ámbito real requiere evaluación jurídica. Criterio particular: PolicyProjection separa condiciones particulares/generales/endosos y fechas, cada conclusión con cláusula/evidencia/unknown. RuleEvaluation guarda reglas atómicas y composición versionada; no inferir exclusiones, franquicias o precedencias. Estimate usa Decimal/currency y parámetros revisados, marcada ilustrativa. AdverseDecision y binding solo se registran desde prueba del operador competente, nunca por mayoría de modelos.

Ejecutar E2E A–I y escenarios de [evaluación](../09-evaluacion.md).0 fuga tenant/recurso,0 secretos centinela,0 approvals/competencia fabricadas,0 duplicado replay y0 efecto fuera de alcance. Un crítico fallido bloquea. p50/p95/coste/calidad/cobertura se miden con entorno/workload/versión; no objetivos ya alcanzados ficticios.

Capacidad opcional sin proveedor/licencia/permiso queda disabled y NOT_VERIFIED; no se oferta como soportada. Un mock PASS no acredita la instalación. Datos reales/producción/compras/wiring en padre necesitan otra autorización. El owner debe poder reconstruir un entregable desde fuente y actor hasta revisión/receipt y entender qué sigue pendiente.
