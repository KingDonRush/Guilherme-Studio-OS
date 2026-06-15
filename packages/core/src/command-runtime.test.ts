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
});
