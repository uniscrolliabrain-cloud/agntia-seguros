import { z } from "zod";
import { ServiceError, opaqueIdSchema } from "@agntia/contracts";

/**
 * C06 — Tenant-scoped repository.
 *
 * `InMemoryRepository` is the working implementation for tests and the dev
 * harness: it enforces the tenant boundary in the key and optimistic
 * concurrency on writes. `PostgresRepository` is a STUB: the DDL exists in
 * `db/migrations/0001_foundations.sql` but no server was available, so every
 * call fails loudly instead of pretending to persist.
 */
export const domainObjectSchema = z.strictObject({
  tenantId: z.string().min(1).max(64),
  id: opaqueIdSchema,
  kind: z.string().min(2).max(40),
  state: z.string().min(2).max(40),
  version: z.number().int().min(0),
});

export type DomainObject = z.infer<typeof domainObjectSchema>;

export interface Repository {
  get(tenantId: string, id: string): Promise<DomainObject | null>;
  put(object: unknown, expectedVersion: number): Promise<DomainObject>;
  list(tenantId: string, kind: string): Promise<readonly DomainObject[]>;
}

export class InMemoryRepository implements Repository {
  private readonly objects = new Map<string, DomainObject>();

  private static key(tenantId: string, id: string): string {
    return `${tenantId}\u0000${id}`;
  }

  async get(tenantId: string, id: string): Promise<DomainObject | null> {
    return this.objects.get(InMemoryRepository.key(tenantId, id)) ?? null;
  }

  async list(tenantId: string, kind: string): Promise<readonly DomainObject[]> {
    return [...this.objects.values()].filter(
      (object) => object.tenantId === tenantId && object.kind === kind,
    );
  }

  async put(input: unknown, expectedVersion: number): Promise<DomainObject> {
    const candidate = domainObjectSchema.parse(input);
    const key = InMemoryRepository.key(candidate.tenantId, candidate.id);
    const existing = this.objects.get(key);
    const currentVersion = existing?.version ?? 0;
    if (currentVersion !== expectedVersion) {
      throw new ServiceError("CONFLICT", "version conflict", {
        details: { reason: "VERSION_CONFLICT", expectedVersion, currentVersion },
      });
    }
    const stored: DomainObject = { ...candidate, version: expectedVersion + 1 };
    this.objects.set(key, stored);
    return stored;
  }
}

export class PostgresRepository implements Repository {
  private static notImplemented(): never {
    throw new ServiceError("INTERNAL", "postgres repository is not implemented", {
      details: { reason: "NOT_IMPLEMENTED", migration: "db/migrations/0001_foundations.sql" },
    });
  }

  async get(_tenantId: string, _id: string): Promise<DomainObject | null> {
    return PostgresRepository.notImplemented();
  }

  async list(_tenantId: string, _kind: string): Promise<readonly DomainObject[]> {
    return PostgresRepository.notImplemented();
  }

  async put(_object: unknown, _expectedVersion: number): Promise<DomainObject> {
    return PostgresRepository.notImplemented();
  }
}

/**
 * Membership store used by tests and the dev harness. It mirrors what the RLS
 * tables would return: an unknown or non-active membership resolves to null, and
 * there is no default tenant.
 */
export interface MembershipRecord {
  readonly tenantId: string;
  readonly userId: string;
  readonly status: "active" | "suspended" | "revoked";
  readonly roles: readonly string[];
  readonly scopes: readonly string[];
}

export class InMemoryMembershipStore {
  private readonly records: MembershipRecord[] = [];

  seed(records: readonly MembershipRecord[]): void {
    this.records.push(...records);
  }

  async resolve(userId: string, tenantId: string): Promise<MembershipRecord | null> {
    const record = this.records.find((item) => item.userId === userId && item.tenantId === tenantId);
    if (!record || record.status !== "active") return null;
    return record;
  }
}

/**
 * Resource ACL: a resource id is only visible to the tenant that owns it. The
 * check is server-side; a token never carries the resource list.
 */
export class TenantResourceAcl {
  private readonly owners = new Map<string, string>();

  assign(tenantId: string, resourceId: string): void {
    const existing = this.owners.get(resourceId);
    if (existing !== undefined && existing !== tenantId) {
      throw new ServiceError("CONFLICT", "resource already owned by another tenant", {
        details: { reason: "RESOURCE_OWNERSHIP_CONFLICT" },
      });
    }
    this.owners.set(resourceId, tenantId);
  }

  async allows(principal: { readonly tenantId: string }, resource: { readonly id: string }): Promise<boolean> {
    return this.owners.get(resource.id) === principal.tenantId;
  }
}
