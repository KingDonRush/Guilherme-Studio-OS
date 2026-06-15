import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  createActor,
  createCommandEnvelope,
  createResultEnvelope,
} from "@guilherme-studio/schemas";
import { describe, expect, it } from "vitest";
import YAML from "yaml";
import { StudioCommandService } from "./command-service.js";
import { createStudioContext } from "./index.js";

describe("Studio command service", () => {
  it("normalizes authorization failures and replays idempotent results", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "studio-command-"));
    await writeFile(
      path.join(root, "studio.config.yaml"),
      YAML.stringify({
        api_version: "studio.guilherme.dev/config-v1",
        root_name: "Command test",
        operator_id: "per_20260614_guilherme-silva",
        canonical_roots: ["operations"],
        runtime_path: "runtime",
        panel: { host: "127.0.0.1", port: 47833 },
        adapters: {},
      }),
    );
    const context = await createStudioContext(root);
    const restricted = createCommandEnvelope({
      command: "entity.create",
      actor: createActor({
        id: "run_20260614_restricted",
        type: "agent",
        capabilities: ["entity.read"],
      }),
      idempotencyKey: "restricted-command",
    });
    const blocked = await new StudioCommandService(context).execute(
      restricted,
      { capability: "entity.write" },
      async () => createResultEnvelope({ result: { should_not_run: true } }),
    );
    expect(blocked).toMatchObject({
      status: "blocked",
      error: { code: "authority_block" },
    });

    const allowed = createCommandEnvelope({
      command: "entity.create",
      actor: createActor({
        id: "per_20260614_guilherme-silva",
        type: "human",
        capabilities: ["entity.write"],
      }),
      idempotencyKey: "allowed-command",
    });
    const service = new StudioCommandService(context);
    const first = await service.execute(allowed, { capability: "entity.write" }, async () =>
      createResultEnvelope({ result: { created: true } }),
    );
    const second = await service.execute(allowed, { capability: "entity.write" }, async () =>
      createResultEnvelope({ result: { created: false } }),
    );
    expect(second).toEqual(first);
  });
});
