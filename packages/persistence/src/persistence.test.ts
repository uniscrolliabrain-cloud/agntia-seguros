import { describe, expect, it } from "vitest";
import {
  InMemoryMembershipStore,
  InMemoryRepository,
  PostgresRepository,
  TenantResourceAcl,
} from "./index";

const object = (tenantId: string, id: string) => ({
  tenantId,
  id,
  kind: "policy",
  state: "prepared",
  version: 0,
});

describe("C06 in-memory repository", () => {
  it("never returns another tenant's object", async () => {
    const repository = new InMemoryRepository();
    await repository.put(object("tenant-a", "policy_000001"), 0);
    expect(await repository.get("tenant-b", "policy_000001")).toBeNull();
    expect(await repository.get("tenant-a", "policy_000001")).not.toBeNull();
  });

  it("rejects a stale write instead of overwriting", async () => {
    const repository = new InMemoryRepository();
    await repository.put(object("tenant-a", "policy_000001"), 0);
    await expect(repository.put(object("tenant-a", "policy_000001"), 0)).rejects.toThrow(/version conflict/);
    const updated = await repository.put(object("tenant-a", "policy_000001"), 1);
    expect(updated.version).toBe(2);
  });

  it("lists only the tenant's objects of a kind", async () => {
    const repository = new InMemoryRepository();
    await repository.put(object("tenant-a", "policy_000001"), 0);
    await repository.put(object("tenant-b", "policy_000002"), 0);
    expect((await repository.list("tenant-a", "policy")).map((item) => item.id)).toEqual(["policy_000001"]);
  });
});

describe("C06 postgres stub", () => {
  it("fails loudly instead of pretending to persist", async () => {
    const repository = new PostgresRepository();
    await expect(repository.get("tenant-a", "policy_000001")).rejects.toMatchObject({ code: "INTERNAL" });
    await expect(repository.put(object("tenant-a", "policy_000001"), 0)).rejects.toThrow(/not implemented/);
  });
});

describe("membership and ACL", () => {
  it("resolves only active provisioned memberships", async () => {
    const store = new InMemoryMembershipStore();
    store.seed([
      { tenantId: "tenant-a", userId: "user-a", status: "active", roles: ["owner"], scopes: ["insurance.policy.read"] },
      { tenantId: "tenant-a", userId: "user-suspended", status: "suspended", roles: [], scopes: [] },
    ]);
    expect(await store.resolve("user-a", "tenant-a")).not.toBeNull();
    expect(await store.resolve("user-suspended", "tenant-a")).toBeNull();
    expect(await store.resolve("user-a", "tenant-b")).toBeNull();
  });

  it("keeps resource ownership single and tenant-scoped", async () => {
    const acl = new TenantResourceAcl();
    acl.assign("tenant-a", "policy_000001");
    expect(await acl.allows({ tenantId: "tenant-a" }, { id: "policy_000001" })).toBe(true);
    expect(await acl.allows({ tenantId: "tenant-b" }, { id: "policy_000001" })).toBe(false);
    expect(await acl.allows({ tenantId: "tenant-a" }, { id: "policy_unknown1" })).toBe(false);
    expect(() => acl.assign("tenant-b", "policy_000001")).toThrow(/another tenant/);
  });
});
