-- 0001_foundations.sql — tenant scoping, approvals, exactly-once intents, outbox.
--
-- STATUS: WRITTEN, NOT EXECUTED. No Postgres/Supabase instance was available in
-- this delivery, so RLS behaviour, constraint violations and role privileges are
-- NOT_VERIFIED. Treat this file as a reviewed proposal until C06 runs it against a
-- real instance with two tenants and adversarial cases.
--
-- The tenant is taken from a session setting that the API sets per connection
-- from the *verified* JWT principal, never from a request body or a model.
-- Without the setting every policy evaluates to NULL, which denies all rows.

begin;

create schema if not exists app;

create or replace function app.current_tenant()
returns text
language sql
stable
as $$
  select nullif(current_setting('app.tenant_id', true), '')
$$;

create table if not exists tenants (
  id          text primary key,
  name        text not null,
  created_at  timestamptz not null default now()
);

create table if not exists memberships (
  tenant_id   text not null references tenants (id) on delete restrict,
  user_id     text not null,
  status      text not null check (status in ('active', 'suspended', 'revoked')),
  roles       text[] not null default '{}',
  scopes      text[] not null default '{}',
  created_at  timestamptz not null default now(),
  primary key (tenant_id, user_id)
);

create table if not exists domain_objects (
  id               text not null,
  tenant_id        text not null references tenants (id) on delete restrict,
  kind             text not null,
  state            text not null,
  current_version  integer not null default 0 check (current_version >= 0),
  created_at       timestamptz not null default now(),
  primary key (tenant_id, id)
);

create table if not exists domain_revisions (
  id            text primary key,
  tenant_id     text not null,
  object_id     text not null,
  version       integer not null check (version >= 1),
  payload_ref   text,
  source_hash   char(64) not null,
  created_at    timestamptz not null default now(),
  constraint domain_revisions_object_fk
    foreign key (tenant_id, object_id) references domain_objects (tenant_id, id) on delete restrict,
  constraint domain_revisions_version_unique unique (tenant_id, object_id, version)
);

create table if not exists approvals (
  approval_ref          text not null,
  tenant_id             text not null references tenants (id) on delete restrict,
  capability            text not null,
  principal_id          text not null,
  reviewer_id           text not null,
  reviewer_competence   text not null,
  payload_hash          char(64) not null,
  resource_version      integer not null check (resource_version >= 0),
  recipient             text not null,
  channel               text not null check (channel in ('ui', 'api', 'portal', 'email')),
  cost_amount           text,
  cost_currency         char(3),
  cost_exponent         smallint check (cost_exponent between 0 and 6),
  issued_at             timestamptz not null,
  expires_at            timestamptz not null,
  revocation_version    integer not null default 0 check (revocation_version >= 0),
  primary key (tenant_id, approval_ref),
  constraint approvals_expiry_after_issue check (expires_at > issued_at)
);

create table if not exists intents (
  id               text not null,
  tenant_id        text not null references tenants (id) on delete restrict,
  capability       text not null,
  idempotency_key  text not null,
  payload_hash     char(64) not null,
  state            text not null,
  created_at       timestamptz not null default now(),
  primary key (tenant_id, id),
  -- Replay with the same key is a read; the same key with another payload is a 409.
  constraint intents_idempotency_unique unique (tenant_id, capability, idempotency_key)
);

create table if not exists receipts (
  id           text primary key,
  tenant_id    text not null references tenants (id) on delete restrict,
  intent_id    text not null,
  remote_ref   text,
  outcome      text not null,
  received_at  timestamptz not null default now(),
  constraint receipts_intent_fk
    foreign key (tenant_id, intent_id) references intents (tenant_id, id) on delete restrict
);

create table if not exists outbox (
  id            text primary key,
  tenant_id     text not null references tenants (id) on delete restrict,
  event_type    text not null,
  payload_ref   text not null,
  created_at    timestamptz not null default now(),
  published_at  timestamptz
);

create table if not exists inbox (
  tenant_id          text not null references tenants (id) on delete restrict,
  external_event_id  text not null,
  received_at        timestamptz not null default now(),
  primary key (tenant_id, external_event_id)
);

create table if not exists audit_log (
  id           text primary key,
  tenant_id    text not null references tenants (id) on delete restrict,
  actor_id     text not null,
  capability   text not null,
  object_id    text,
  payload_hash char(64),
  occurred_at  timestamptz not null default now()
);

-- Row level security: deny by default, tenant-scoped, with check on writes.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'memberships', 'domain_objects', 'domain_revisions', 'approvals',
    'intents', 'receipts', 'outbox', 'inbox', 'audit_log'
  ]
  loop
    execute format('alter table %I enable row level security', table_name);
    execute format('alter table %I force row level security', table_name);
    execute format(
      'create policy %I on %I using (tenant_id = app.current_tenant()) with check (tenant_id = app.current_tenant())',
      table_name || '_tenant_scope', table_name
    );
  end loop;
end
$$;

create index if not exists domain_objects_tenant_kind_idx on domain_objects (tenant_id, kind, state);
create index if not exists outbox_unpublished_idx on outbox (tenant_id, created_at) where published_at is null;
create index if not exists audit_log_tenant_time_idx on audit_log (tenant_id, occurred_at desc);

commit;
