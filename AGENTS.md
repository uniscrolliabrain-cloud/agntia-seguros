# Alcance autorizado y reglas

**Autorización vigente (2026-11-14, founder): IMPLEMENTING.** Se autoriza código de aplicación, esquemas, migraciones, tests ejecutables y evidencia en `agntia-seguros`, según el programa de 42 campañas. Registro de la decisión: `docs/factory/07-AUTORIZACION-IMPLEMENTACION.md`. **No modificar `agente` ni repos hermanos.** No escribir en `main` (rama aislada; los merges los decide el founder). No activar proveedores, enviar mensajes, gastar, usar datos reales, desplegar o publicar, ni presentar/firmar/pagar/contratar/acreditar para pasar un gate. Implementar no amplía la autoridad regulatoria del servicio.

Una implementación futura requiere autorización propia. Leer README/handoff/fuentes/licencias/contratos, congelar SHAs y baseline real, ejecutar fases secuencialmente con gates y reportar cada cinco y las dos finales. Documentado no equivale a instalado; mock no prueba proveedor; test planeado no cuenta como ejecutado. Unknown/unsupported/forbidden quedan deshabilitados, no fallback admin/owner/default.

Supabase JWT en todos los modos: firma/issuer/audience/tiempos, membership provisionada y scope recurso/campo de servidor. No user_metadata editable o campos del LLM como prueba. FKs/RLS/roles de workers, cachés, vectores, Realtime, Storage y exports aislados. Service_role no es una garantía de RLS.

Agente canónico en padre; twin aquí con mandato acotado, revisión/capacidades/purpose/budget/expiry/revocación. Conservar actor/runtime/persona/role y tenant de origen/objetivo separados. No crear nuevas identidades canónicas ni copiar memorias privadas entre clientes. Nombres/personas/avatar no conceden permisos. La rota empresarial vive en padre, no scheduler alternativo.

El LLM propone; PEP/FSM/cálculo y revisión humana/competente determinan efecto. Cobertura aparente, dato de salud inferido o regla compuesta incorrecta pueden causar perjuicio; un buen acierto local no prueba decisión final. Sin contratar/cancelar pólizas, cobrar primas, vincular cobertura, fijar precio vinculante, aceptar/denegar/pagar siniestros ni asumir distribución regulada por llamarse middleware. Piloto de preparación/asistencia y handoff a profesional/operador autorizado; ámbito real requiere evaluación jurídica.

Preview sin efecto externo. Approval ligada a hash/versión/tenant/destinatario/alcance/coste/caducidad; cambios invalidan. Idempotencia durable/outbox/inbox/receipts y reconciliación tras timeout, sin retry ciego. Un evento emitido no prueba ACK o resultado. No HTTP/SQL/ORM/shell/MCP genérico al agente.

Documentos/web/adjuntos son datos no confiables; proteger SSRF/redirect/DNS/MIME/tamaño, HTML/XML/CSV injection y prompt injection. Secretos externos y mínimos refs; no PII/tokens/prompts privados en Git/logs/modelos/reportes. Rights/retención/transferencias por finalidad y proveedor real; no licencias comerciales heredadas por estar el código en GitHub. Anam es presencia, nunca identidad o firma.
