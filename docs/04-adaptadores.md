# Adaptadores y licencias

Todos NOT_IMPLEMENTED/NOT_VERIFIED en runtime. [Repos por SHA](research/repositories.json); lectura de metadatos/README y licencias selectivas, no auditoría completa. No se han clonado/instalado ni usado cuentas demo ajenas. La elección de release/digest estable queda pendiente.

| ID | Repositorio | Licencia metadata | Uso/precaución |
|---|---|---|---|
| R01 | [openimis/openimis-be_py](https://github.com/openimis/openimis-be_py/tree/8132099903430b5d8abc4ac5e53d6fdf719e080a) | NOASSERTION | Candidato de dominio o referencia; capacidades/edición/ACL se verifican por instalación |
| R02 | [openimis/openimis-fe_js](https://github.com/openimis/openimis-fe_js/tree/8146bb2e5e48da90dbff450294f312fa665d878b) | NOASSERTION | Candidato de dominio o referencia; capacidades/edición/ACL se verifican por instalación |
| R03 | [OasisLMF/OasisLMF](https://github.com/OasisLMF/OasisLMF/tree/b2e63308c7da2024f32d90992098a285e1e77729) | BSD-3-Clause | Candidato de dominio o referencia; capacidades/edición/ACL se verifican por instalación |
| R04 | [finos/common-domain-model](https://github.com/finos/common-domain-model/tree/037e7e96db965e27ac590c284fcec3528c8fa678) | NOASSERTION | Candidato de dominio o referencia; capacidades/edición/ACL se verifican por instalación |

openIMIS backend/frontend declaran AGPLv3 en LICENSE.md, con dependencias/módulos a revisar; son referencia de financiación sanitaria y no equivalen a correduría multirramo española. OasisLMF BSD-3-Clause es modelado de catástrofes con datos/modelos separados, no tarificador universal. FINOS CDM tiene licencia Community Specification y ámbito financiero; se evalúa como referencia de contratos, no se instala como motor de seguros.

La licencia de código no cubre automáticamente pesos/modelos, contenido de cursos, tipografías, plantillas, corpus judiciales, datos actuariales, plugins o servicios cloud. No copiar upstream por comodidad. API/proceso separado es arquitectura recomendada, no excepción jurídica universal. Leer obligaciones de modificación/distribución/servicio en red y compatibilidad antes de incorporar material.

## Registro y discovery

ProviderConnection por tenant/proyecto, endpointRef/secretRef solo servidor, versión/edición y binding remoto. No aceptar URL, base de datos, company/site/course/workspace, token o método libre desde un modelo. Bot mínimo por ámbito, rotación sin perder links y secretos externos. DNS/IP/redirect/tamaño/tiempo/egress protegidos. Public JSON minimizado, no credenciales/nombres internos innecesarios.

CapabilityReport distingue documented, verified_runtime, unknown, unsupported, forbidden y not_configured, con fecha/expiry/evidencia. Un200 con HTML/estructura errónea o empresa equivocada no es healthy. Sin permiso no se cae a admin; no crear registros reales para probar discovery. Unknown deshabilitado y advertencia útil. Cada versión/edición/modulo/rol puede invalidar el report.

## Lectura, staging y sincronización

ExternalLink por tenant/connection/model/externalId/localKind, IDs strings opacos, sourceHash/remoteVersion/mapperVersion. No mapear por nombre o posición. Import preview conserva warnings/campos pendientes/procedencia; aceptación local no fabrica revisión profesional, consentimiento o emisión remota. Repetición idéntica no duplica; cambio legítimo crea nueva revisión/conflicto según AuthorityMap.

Cursores/paginación estables con overlap si hace falta; watermark después de commit local. Barridos detectan archivado/borrado remoto sin destruir historia. Conflicto con dato revisado bloquea overwrite. Dos sistemas que reclaman autoridad por mismo campo/efecto deben acordarlo antes de bidireccionalidad, no last-write-wins silencioso.

## Escritura

Dry-run puro local; preview con diff/alcance/coste y aprobación cuando corresponda. Algunos endpoints llamados test envían o modifican estado: demostrar semántica antes de usarlos. Persistir intent/audit/key/outbox antes de HTTP; cada llamada remota tiene su transacción propia. Si el proveedor acepta y se pierde respuesta, reconciliar por referencia segura; si no existe, bloquear/escalar, no duplicar con otra key/proveedor. No delete/unlink/submit/post/execute genéricos al agente.

El piloto conserva este límite: Sin contratar/cancelar pólizas, cobrar primas, vincular cobertura, fijar precio vinculante, aceptar/denegar/pagar siniestros ni asumir distribución regulada por llamarse middleware. Piloto de preparación/asistencia y handoff a profesional/operador autorizado; ámbito real requiere evaluación jurídica. Un backend faltante queda explícito; un fake útil no se ofrece como conector real. La UI del proveedor puede existir para administración interna, sin ser interfaz obligatoria del cliente. Feature flags detienen nuevas operaciones sin borrar evidencia/links ni simular rollback de efectos externos.
