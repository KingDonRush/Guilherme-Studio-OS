import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  entityId,
  type ResultEnvelope,
  type StudioEntity,
  TypedEntitySchema,
} from "@guilherme-studio/schemas";
import { describe, expect, it } from "vitest";
import YAML from "yaml";
import { createStudioCommand, createStudioContext, executeStudioCommand } from "./index.js";

let commandSequence = 0;

describe("knowledge and decision governance", () => {
  it("blocks contradictory active decisions unless they are amended", async () => {
    const context = await createTestContext();
    const original = await commandEntity(context, "decision.record", {
      title: "Repository remote policy",
      decision: "Coordinator root stays private without a remote by default.",
      rationale: "Avoid accidental publication.",
      alternatives: ["Push coordinator root to GitHub"],
      impact: "Root operations stay local until explicitly released.",
      reversibility: "reversible",
    });

    const conflict = await execute(context, "decision.record", {
      title: "Repository remote policy",
      decision: "Coordinator root should be pushed publicly by default.",
    });
    expect(conflict).toMatchObject({
      status: "conflict",
      error: { code: "decision_contradiction" },
    });

    const amended = await commandEntity(
      context,
      "decision.amend",
      {
        decision: "Coordinator root stays private; public release requires an explicit decision.",
        rationale: "This narrows the original policy without silent override.",
      },
      entityId(original),
    );
    expect(amended.spec).toMatchObject({
      decision_type: "decision",
      amends_decision_id: entityId(original),
      contradiction_ids: expect.arrayContaining([entityId(original)]),
    });
  });

  it("routes knowledge to evidence and entity records without dumping unclassified notes", async () => {
    const context = await createTestContext();
    const task = await commandEntity(context, "entity.create", {
      kind: "task",
      title: "Knowledge route target",
    });

    const evidence = await commandEntity(context, "knowledge.route", {
      title: "Observed recurring harness issue",
      content: "Agent must rebuild dist before CLI smoke when commands changed.",
      destination: "evidence",
      target_id: entityId(task),
    });
    expect(evidence).toMatchObject({
      kind: "evidence",
      spec: {
        evidence_type: "manual",
        claims: ["Agent must rebuild dist before CLI smoke when commands changed."],
      },
    });

    const updatedTask = await commandEntity(context, "knowledge.route", {
      title: "Task-specific continuation note",
      content: "Continue from the current harness test fixture.",
      destination: "entity",
      target_id: entityId(task),
    });
    expect(updatedTask.extensions).toMatchObject({
      knowledge_routes: [
        expect.objectContaining({
          title: "Task-specific continuation note",
          content: "Continue from the current harness test fixture.",
        }),
      ],
    });
  });

  it("records learning promotion proposals and rejects secret-shaped routed content", async () => {
    const context = await createTestContext();
    const proposal = await commandEntity(context, "learning.propose", {
      title: "Promote dist rebuild check",
      failure_class: "CLI smoke used stale dist after command changes",
      proposal: "Add a test or workflow check that builds CLI before command smoke.",
      destination: "test",
      rationale: "The failure can recur whenever CLI source changes.",
    });
    expect(proposal.spec).toMatchObject({
      decision_type: "learning_proposal",
      learning_destination: "test",
      learning_failure_class: "CLI smoke used stale dist after command changes",
    });

    const blocked = await execute(context, "knowledge.route", {
      title: "Bad route",
      content: "token=abcdefghijklmnopqrstuvwxyz",
      destination: "temporary_note",
    });
    expect(blocked).toMatchObject({
      status: "blocked",
      error: { code: "authority_block" },
    });
  });
});

async function createTestContext() {
  const root = await mkdtemp(path.join(os.tmpdir(), "studio-knowledge-governance-"));
  await writeFile(
    path.join(root, "studio.config.yaml"),
    YAML.stringify({
      api_version: "studio.guilherme.dev/config-v1",
      root_name: "Knowledge governance test",
      operator_id: "per_20260614_guilherme-silva",
      canonical_roots: ["operations", "data"],
      runtime_path: "runtime",
      panel: { host: "127.0.0.1", port: 47841 },
      adapters: {},
    }),
  );
  return createStudioContext(root);
}

async function commandEntity(
  context: Awaited<ReturnType<typeof createStudioContext>>,
  command: string,
  payload: Record<string, unknown>,
  targetId?: string,
): Promise<StudioEntity> {
  const result = await expectOk(execute(context, command, payload, targetId));
  return TypedEntitySchema.parse((result.result as { entity?: unknown }).entity);
}

async function execute(
  context: Awaited<ReturnType<typeof createStudioContext>>,
  command: string,
  payload: Record<string, unknown>,
  targetId?: string,
): Promise<ResultEnvelope> {
  return executeStudioCommand(
    context,
    createStudioCommand(context, {
      command,
      payload,
      ...(targetId ? { targetId } : {}),
      idempotencyKey: `knowledge-test-${++commandSequence}`,
    }),
  );
}

async function expectOk(promise: Promise<ResultEnvelope>): Promise<ResultEnvelope> {
  const result = await promise;
  expect(result, JSON.stringify(result, null, 2)).toMatchObject({ status: "ok" });
  return result;
}
