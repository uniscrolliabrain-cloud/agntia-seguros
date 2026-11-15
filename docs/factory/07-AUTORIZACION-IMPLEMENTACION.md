# Autorización de implementación — registro de decisión

**2026-11-14 · decisión del founder · IMPLEMENTING**

## Qué se autoriza

El founder ha instruido ejecutar la implementación de este repositorio. A partir de esta fecha:

- `agntia-seguros` deja de ser `DOCUMENTATION_ONLY` y pasa a `IMPLEMENTING`.
- Freebuff implementa el programa de 42 campañas (`docs/campaigns/`, `docs/execution-program/campaigns/`) en una rama de trabajo aislada.
- Se permite crear código de aplicación, esquemas, migraciones SQL, tests ejecutables y artefactos de evidencia.

## Qué gate se levanta y cuál no

| Gate | Estado previo | Decisión |
|---|---|---|
| `AGENTS.md` "solo documentación" | Bloqueante | **Levantado** por instrucción directa del founder. |
| `docs/factory/06-READINESS-AUDIT.md`: código bloqueado hasta meta-auditoría Astra | Bloqueante | **Levantado** para implementación; Astra pasa a auditoría conceptual *posterior*, no a precondición. |
| `docs/execution-program` (ejecución continua C01→C42) | Vigente | Se adopta como programa de ejecución. |
| Auditoría Codex tras C42 | Vigente | Se mantiene: nada se declara `PRODUCTION_READY` antes de esa auditoría. |

El conflicto entre PREP y execution-program queda así resuelto de forma explícita, tal y como exigía `FreeBuff/HANDOFF-RECONCILIADO-42-CAMPANAS.md` ("verificar aprobación del founder o registrar el conflicto como gate antes de código irreversible").

## Qué sigue prohibido (sin cambios)

- Modificar el repo padre `uniscrolliabrain-cloud/agente` o cualquier repo hermano.
- Escribir en `main`; el trabajo vive en rama aislada y los merges los decide el founder.
- Activar proveedores reales, contratar planes, consumir APIs de pago o crear cuentas.
- Usar datos reales de clientes, pólizas reales o credenciales reales.
- Desplegar, publicar, enviar mensajes o realizar cualquier efecto externo.
- Presentar, firmar, pagar, contratar, vincular cobertura, denegar o indemnizar siniestros, ni acreditar rol regulado para superar un gate.
- Declarar `PASS` un gate por un mock, un documento o un test planeado.

## Consecuencias asumidas

- La auditoría conceptual independiente (Astra) llega después; sus hallazgos podrán invalidar contratos ya implementados.
- Los gates que dependen de infraestructura no disponible (Supabase real, Postgres con RLS ejecutado, operador regulado acreditado) quedan `NOT_VERIFIED`/`BLOCKED`, no aprobados.
- Baseline congelado al abrir la implementación: `main` = `d92af6fb645c479d1b24c4c8004dcbc2a7ca67c4` (174 archivos, 169 `.md` + 5 `.json`, cero código previo).
