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

  it("prepares and publishes product releases with explicit evidence", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "studio-runtime-release-governance-"));
    await writeFile(
      path.join(root, "studio.config.yaml"),
      YAML.stringify({
        api_version: "studio.guilherme.dev/config-v1",
        root_name: "Runtime release governance test",
        operator_id: "per_20260614_guilherme-silva",
        canonical_roots: ["products", "operations"],
        runtime_path: "runtime",
        panel: { host: "127.0.0.1", port: 47835 },
        adapters: {},
      }),
    );
    const context = await createStudioContext(root);
    const actor = operatorActor(context.config.operator_id);
    const product = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "entity.create",
        actor,
        payload: { kind: "product", title: "Governed product" },
      }),
    );
    const productId = entityIdFromResult(product);
    const prepared = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "release.prepare",
        actor,
        payload: {
          product_id: productId,
          version: "1.0.0",
          changelog: "Initial release.",
          compatibility_notes: "Compatible with the local WordPress fixture.",
          migration_notes: "No migration required.",
          public_api_notes: "No public API break.",
          test_commands: ["npm run verify"],
          asset_ids: ["ast_fixture"],
          package_path: "products/governed/dist/plugin.zip",
          roadmap_claims: ["Future marketplace automation"],
          implemented_capabilities: ["Elementor widget"],
        },
      }),
    );
    const releaseId = entityIdFromResult(prepared);
    const evidence = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "evidence.register",
        actor,
        payload: {
          title: "Release verification",
          evidence_type: "command",
          command: "npm run verify",
          claims: ["Release verified"],
        },
      }),
    );
    const evidenceId = entityIdFromResult(evidence);
    const published = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "release.publish",
        actor,
        targetId: releaseId,
        payload: {
          release_id: releaseId,
          evidence_ids: [evidenceId],
          demo_url: "https://example.com/demo",
        },
      }),
    );

    expect(prepared).toMatchObject({
      status: "ok",
      result: {
        action: "release.prepare",
        entity: {
          spec: {
            version: "1.0.0",
            stage: "prepared",
            changelog: "Initial release.",
            compatibility_notes: "Compatible with the local WordPress fixture.",
            migration_notes: "No migration required.",
            test_commands: ["npm run verify"],
            asset_ids: ["ast_fixture"],
            roadmap_claims: ["Future marketplace automation"],
            implemented_capabilities: ["Elementor widget"],
          },
        },
      },
    });
    expect(published).toMatchObject({
      status: "ok",
      result: {
        action: "release.publish",
        entity: {
          spec: {
            status: "published",
            stage: "published",
            evidence_ids: [evidenceId],
            demo_url: "https://example.com/demo",
          },
          relations: expect.arrayContaining([{ type: "supported_by", target_id: evidenceId }]),
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
