# Base de datos — estado real

`migrations/0001_foundations.sql` está **escrito y revisado, pero NO ejecutado**: en esta
entrega no había instancia Postgres/Supabase disponible.

## Qué está verificado

- Nada de comportamiento en runtime. Ni RLS, ni constraints, ni privilegios.

## Qué falta para dar C06 por PASS

1. Ejecutar la migración en un Postgres desechable (`docker run postgres:16` o Supabase local).
2. Crear dos tenants sintéticos A/B y un operador P, con memberships provisionadas.
3. Probar con el rol de aplicación (no `postgres`, no `service_role`, no `BYPASSRLS`):
   - A no ve filas de B en cada tabla, incluidos `audit_log`, `outbox` e `inbox`.
   - Sin `app.tenant_id` fijado, toda consulta devuelve cero filas.
   - `with check` impide insertar una fila con `tenant_id` ajeno.
   - Un `receipts` cuyo `intent_id` pertenece a otro tenant es rechazado por la FK.
4. Revisar explícitamente qué roles pueden saltarse RLS y por qué.

## Problemas conocidos del archivo actual

- `receipts` declara una FK contra un placeholder (`intents (tenant_id_intent_placeholder)`) que
  **no existe**: hay que sustituirla por una FK compuesta real. No se ha inventado una columna
  inexistente porque el diseño de `intents` aún no fija su clave natural compuesta; es deuda
  bloqueante para ejecutar la migración.
- `domain_objects` tiene `primary key (tenant_id, id)` y además un `unique` redundante; se
  eliminará uno cuando el diseño de índices se revise en C06.
