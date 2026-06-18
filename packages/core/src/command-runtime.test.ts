import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createCommandEnvelope } from "@guilherme-studio/schemas";
import { describe, expect, it } from "vitest";
import YAML from "yaml";
import { executeStudioCommand } from "./command-runtime.js";
import { createStudioContext, operatorActor } from "./index.js";

describe("Studio command runtime", () => {
  it("executes the same semantic command through the normalized command contract", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "studio-runtime-"));
    await writeFile(
      path.join(root, "studio.config.yaml"),
      YAML.stringify({
        api_version: "studio.guilherme.dev/config-v1",
        root_name: "Runtime test",
        operator_id: "per_20260614_guilherme-silva",
        canonical_roots: ["operations"],
        runtime_path: "runtime",
        panel: { host: "127.0.0.1", port: 47835 },
        adapters: {},
      }),
    );
    const context = await createStudioContext(root);
    const result = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "entity.create",
        actor: operatorActor(context.config.operator_id),
        payload: { kind: "task", title: "Runtime task" },
        idempotencyKey: "runtime-task-create",
      }),
    );

    expect(result).toMatchObject({
      status: "ok",
      result: {
        action: "entity.create",
        entity: { kind: "task" },
      },
    });
  });

  it("archives and relates canonical entities through the command runtime", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "studio-runtime-entity-governance-"));
    await writeFile(
      path.join(root, "studio.config.yaml"),
      YAML.stringify({
        api_version: "studio.guilherme.dev/config-v1",
        root_name: "Runtime entity governance test",
        operator_id: "per_20260614_guilherme-silva",
        canonical_roots: ["operations"],
        runtime_path: "runtime",
        panel: { host: "127.0.0.1", port: 47835 },
        adapters: {},
      }),
    );
    const context = await createStudioContext(root);
    const actor = operatorActor(context.config.operator_id);
    const task = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "entity.create",
        actor,
        payload: { kind: "task", title: "Governed source" },
      }),
    );
    const target = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "entity.create",
        actor,
        payload: { kind: "task", title: "Governed target" },
      }),
    );
    const taskId = entityIdFromResult(task);
    const targetId = entityIdFromResult(target);

    const related = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "entity.relate",
        actor,
        targetId: taskId,
        payload: {
          relation_type: "supports",
          target_id: targetId,
          note: "Runtime relation",
        },
      }),
    );
    const archived = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "entity.archive",
        actor,
        targetId: taskId,
        expectedRevision: 2,
        payload: {},
      }),
    );

    expect(related).toMatchObject({
      status: "ok",
      result: {
        action: "entity.relate",
        revision: 2,
        entity: {
          relations: [{ type: "supports", target_id: targetId, note: "Runtime relation" }],
        },
      },
    });
    expect(archived).toMatchObject({
      status: "ok",
      result: {
        action: "entity.archive",
        revision: 3,
        entity: {
          spec: { status: "archived" },
          metadata: { archived_at: expect.any(String) },
        },
      },
    });
  });
});

function entityIdFromResult(result: { result?: unknown }): string {
  const payload = result.result as { entity_id?: unknown };
  if (typeof payload?.entity_id !== "string") {
    throw new Error(`Missing entity_id in result: ${JSON.stringify(result)}`);
  }
  return payload.entity_id;
}
