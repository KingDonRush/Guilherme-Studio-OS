import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createEntity, entityId, entityTitle } from "@guilherme-studio/schemas";
import { describe, expect, it } from "vitest";
import YAML from "yaml";
import { EntityStore, migrateCanonicalV1, resolveInsideRoot, SQLiteProjection } from "./index.js";

describe("storage", () => {
  const createTempStudioRoot = () => mkdtemp(path.join(os.tmpdir(), "studio-os-test-"));

  it("blocks path traversal outside the Studio root", async () => {
    const root = await createTempStudioRoot();
    await expect(resolveInsideRoot(root, "../escape.yaml")).rejects.toThrow(/Path traversal/);
  });

  it("writes canonical YAML and rebuilds a derived SQLite projection", async () => {
    const root = await createTempStudioRoot();
    const store = new EntityStore(root);
    const entity = createEntity({ kind: "task", title: "Test task" });

    const relativePath = await store.put(entity);
    const stored = await store.get(entityId(entity));
    expect(relativePath).toContain("operations/records/tasks/test-task");
    expect(stored ? entityTitle(stored.entity) : undefined).toBe("Test task");

    const projection = new SQLiteProjection(path.join(root, "runtime", "studio.sqlite"));
    const result = await projection.rebuild(await store.scan());
    expect(result.entityCount).toBe(1);
    expect(result.checksum).toHaveLength(64);
  });

  it("does not follow a parent symlink that escapes the root", async () => {
    const root = await createTempStudioRoot();
    const outside = await createTempStudioRoot();
    await mkdir(path.join(root, "data"), { recursive: true });
    await writeFile(path.join(outside, "marker"), "outside");
    await import("node:fs/promises").then((fs) =>
      fs.symlink(outside, path.join(root, "data", "people")),
    );

    await expect(resolveInsideRoot(root, "data/people/escaped.yaml")).rejects.toThrow(
      /escapes Studio root/,
    );
  });

  it("migrates legacy entities with aliases and rewritten relations idempotently", async () => {
    const root = await createTempStudioRoot();
    const personPath = path.join(root, "data/people/guilherme.per_legacy.yaml");
    const projectPath = path.join(root, "portfolio/projects/portfolio.prj_legacy.yaml");
    await mkdir(path.dirname(personPath), { recursive: true });
    await mkdir(path.dirname(projectPath), { recursive: true });
    await writeFile(
      personPath,
      YAML.stringify({
        apiVersion: "studio.guilherme.dev/entity-v1",
        kind: "person",
        id: "per_legacy",
        slug: "guilherme",
        title: "Guilherme",
        status: "active",
        classification: "internal",
        revision: 1,
        createdAt: "2026-06-14T12:00:00.000Z",
        updatedAt: "2026-06-14T12:00:00.000Z",
        labels: [],
        relations: [],
        data: {},
      }),
    );
    await writeFile(
      projectPath,
      YAML.stringify({
        apiVersion: "studio.guilherme.dev/entity-v1",
        kind: "project",
        id: "prj_legacy",
        slug: "portfolio",
        title: "Portfolio",
        status: "active",
        classification: "internal",
        revision: 1,
        createdAt: "2026-06-14T12:00:00.000Z",
        updatedAt: "2026-06-14T12:00:00.000Z",
        ownerId: "per_legacy",
        labels: [],
        relations: [{ type: "owned_by", targetId: "per_legacy" }],
        data: {},
      }),
    );

    const preview = await migrateCanonicalV1(root, { dryRun: true });
    expect(preview.entries).toHaveLength(2);

    const applied = await migrateCanonicalV1(root);
    expect(applied.migrated).toBe(2);
    const second = await migrateCanonicalV1(root);
    expect(second.migrated).toBe(0);

    const store = new EntityStore(root);
    const project = (await store.scan()).find((file) => file.entity.kind === "project");
    expect(project?.entity.metadata.owner_id).toBe("per_20260614_guilherme");
    expect(project?.entity.relations[0]?.target_id).toBe("per_20260614_guilherme");
    expect(project?.entity.extensions).toMatchObject({
      migration: { previous_ids: ["prj_legacy"] },
    });
    expect(YAML.parse(await readFile(project?.absolutePath ?? "", "utf8"))).toHaveProperty(
      "api_version",
      "studio.guilherme.dev/v1",
    );
  });
});
