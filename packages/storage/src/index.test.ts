import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createEntity } from "@guilherme-studio/schemas";
import { describe, expect, it } from "vitest";
import { EntityStore, resolveInsideRoot, SQLiteProjection } from "./index.js";

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
    const stored = await store.get(entity.id);
    expect(relativePath).toContain("operations/records/tasks/test-task");
    expect(stored?.entity.title).toBe("Test task");

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
});
