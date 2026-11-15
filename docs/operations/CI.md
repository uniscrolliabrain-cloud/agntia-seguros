# CI — qué hace y qué no

`.github/workflows/ci.yml` ejecuta, en cada push y pull request:

1. `pnpm install --frozen-lockfile`
2. `pnpm run typecheck` (5+ proyectos TypeScript)
3. `pnpm run test` (Vitest, sin red)

## Lo que la CI no hace

- **No despliega** y no publica nada.
- **No provisiona** Postgres ni Supabase: la migración `db/migrations/0001_foundations.sql` no se
  aplica aquí, así que RLS sigue `NOT_VERIFIED`.
- **No llama a proveedores** ni usa credenciales.
- **No mide cobertura** ni compara con umbrales que no han sido acordados.

Un verde en CI significa que compila y que las invariantes unitarias se cumplen. No significa que el
servicio esté listo, ni que los gates de entorno real hayan pasado.
