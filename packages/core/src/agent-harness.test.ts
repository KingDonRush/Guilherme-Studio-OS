import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  type ContextPack,
  entityId,
  type ResultEnvelope,
  type StudioEntity,
  TypedEntitySchema,
} from "@guilherme-studio/schemas";
import { describe, expect, it } from "vitest";
import YAML from "yaml";
import { createStudioCommand, createStudioContext, executeStudioCommand } from "./index.js";

let commandSequence = 0;

describe("Agent harness loop", () => {
  it("starts, orients, authorizes, observes, records, verifies, hands off and closes a run", async () => {
    const context = await createTestContext();
    const task = await createEntity(context, { kind: "task", title: "Harness task" });
    const evidence = await commandEntity(context, "evidence.register", {
      title: "Harness verification command",
      evidence_type: "command",
      command: "npm test -- packages/core/src/agent-harness.test.ts",
      claims: ["Agent harness fixture passed"],
    });

    const run = await commandEntity(context, "agent.start", {
      objective: "Implement the PRD 10 harness fixture.",
      task_id: entityId(task),
      allowed: ["read_context", "edit_core", "run_tests"],
      confirmation_required: ["external_send"],
      prohibited: ["destructive_execute"],
    });
    expect(run.spec).toMatchObject({ state: "draft", result: "running" });

    const oriented = await commandEntity(
      context,
      "agent.context",
      {
        next_valid_action: "Inspect current state and run focused tests.",
        work_type: "development",
        method_lens_answers: developmentLensAnswers(),
      },
      entityId(run),
    );
    expect(oriented.spec).toMatchObject({
      state: "oriented",
      context_pack: {
        objective: "Implement the PRD 10 harness fixture.",
        included_entity_ids: expect.arrayContaining([entityId(run), entityId(task)]),
        method_lens: {
          work_type: "development",
          missing_required: [],
        },
      },
    });

    await commandEntity(
      context,
      "agent.authorize",
      {
        allowed: ["read_context", "edit_core", "run_tests"],
        confirmation_required: ["external_send"],
        prohibited: ["destructive_execute"],
      },
      entityId(run),
    );
    await commandEntity(
      context,
      "agent.observe",
      {
        source: "git",
        summary: "Temporary fixture root is clean before mutation.",
      },
      entityId(run),
    );
    await commandEntity(
      context,
      "agent.record-action",
      {
        action: "Implemented harness lifecycle fixture.",
        command: "npm test -- packages/core/src/agent-harness.test.ts",
        result_summary: "Focused test passed.",
        evidence_ids: [entityId(evidence)],
      },
      entityId(run),
    );
    await commandEntity(
      context,
      "agent.verify",
      {
        status: "passed",
        command: "npm test -- packages/core/src/agent-harness.test.ts",
        result_summary: "1 focused file passed.",
      },
      entityId(run),
    );
    await commandEntity(
      context,
      "agent.handoff",
      {
        summary: "Harness loop fixture is complete.",
        next_valid_action: "Use the run ID to inspect the closed record.",
        forbidden_reopenings: ["Do not reimplement the same lifecycle in a parallel service."],
        evidence_ids: [entityId(evidence)],
      },
      entityId(run),
    );
    const closed = await commandEntity(
      context,
      "agent.close",
      {
        outcome: "Closed with verification evidence and handoff.",
      },
      entityId(run),
    );

    expect(closed.spec).toMatchObject({
      state: "closed",
      status: "done",
      result: "complete",
      evidence_ids: [entityId(evidence)],
    });
  });

  it("blocks closure when a development method lens is incomplete", async () => {
    const context = await createTestContext();
    const evidence = await commandEntity(context, "evidence.register", {
      title: "Incomplete method lens verification command",
      evidence_type: "command",
      command: "npm test -- packages/core/src/agent-harness.test.ts",
      claims: ["Incomplete method lens fixture reached close gate"],
    });
    const run = await commandEntity(context, "agent.start", {
      objective: "Try to close a development run with missing method lens answers.",
      allowed: ["read_context", "edit_core", "run_tests"],
    });

    const oriented = await commandEntity(
      context,
      "agent.context",
      {
        next_valid_action: "Answer missing method lens fields before closing.",
        work_type: "development",
        method_lens_answers: {
          lifecycle: "Implementation work in a temporary Studio fixture.",
          business_value: "Proves the close gate treats Praxis lens gaps as real blockers.",
        },
      },
      entityId(run),
    );
    const contextPack = oriented.spec.context_pack as ContextPack;
    expect(contextPack.method_lens?.missing_required).toContain("requirements_solution");
    expect(contextPack.gaps.join("\n")).toContain(
      "Method lens missing required development answer",
    );

    await commandEntity(context, "agent.authorize", {}, entityId(run));
    await commandEntity(
      context,
      "agent.observe",
      {
        source: "docs",
        summary: "The context pack has an intentionally incomplete development method lens.",
      },
      entityId(run),
    );
    await commandEntity(
      context,
      "agent.record-action",
      {
        action: "Attempted to finish with incomplete method lens.",
        evidence_ids: [entityId(evidence)],
      },
      entityId(run),
    );
    await commandEntity(
      context,
      "agent.verify",
      {
        status: "passed",
        command: "npm test -- packages/core/src/agent-harness.test.ts",
        result_summary: "Verification ran, but method lens is still incomplete.",
      },
      entityId(run),
    );
    await commandEntity(
      context,
      "agent.handoff",
      {
        summary: "Run should remain uncloseable until method lens is complete.",
        next_valid_action: "Fill missing method lens fields and rebuild context.",
        evidence_ids: [entityId(evidence)],
      },
      entityId(run),
    );

    const result = await execute(context, "agent.close", {}, entityId(run));
    expect(result.status).not.toBe("ok");
    expect(result.error?.message).toContain("method_lens answers");
  });

  it("blocks closure until the handoff exists", async () => {
    const context = await createTestContext();
    const run = await commandEntity(context, "agent.start", {
      objective: "Attempt to skip handoff.",
      allowed: ["read_context"],
    });
    await expectOk(
      execute(
        context,
        "agent.context",
        { next_valid_action: "Continue harness test." },
        entityId(run),
      ),
    );
    await expectOk(execute(context, "agent.authorize", {}, entityId(run)));
    await expectOk(
      execute(
        context,
        "agent.observe",
        { source: "git", summary: "Observed test root before closure." },
        entityId(run),
      ),
    );
    await expectOk(
      execute(
        context,
        "agent.verify",
        { status: "not_run", not_run_reason: "Testing the close gate." },
        entityId(run),
      ),
    );

    const result = await execute(context, "agent.close", {}, entityId(run));
    expect(result.status).not.toBe("ok");
    expect(result.error?.message).toContain("cannot close");
  });

  it("rejects secret-shaped values in generated context packs", async () => {
    const context = await createTestContext();
    const run = await commandEntity(context, "agent.start", {
      objective: "Do not leak secret-shaped data into context.",
      allowed: ["token=abcdefghijklmnopqrstuvwxyz"],
    });

    const result = await execute(
      context,
      "agent.context",
      { next_valid_action: "This should be rejected." },
      entityId(run),
    );

    expect(result.status).toBe("blocked");
    expect(result.error?.message).toMatch(/Secret-like value/i);
  });

  it("omits referenced entities above the run classification budget", async () => {
    const context = await createTestContext();
    const confidentialTask = await createEntity(context, {
      kind: "task",
      title: "Confidential context task",
      classification: "confidential",
    });
    const internalRun = await commandEntity(context, "agent.start", {
      objective: "Build a minimized internal context pack.",
      classification: "internal",
      owning_entity_ids: [entityId(confidentialTask)],
      allowed: ["read_context"],
    });

    const oriented = await commandEntity(
      context,
      "agent.context",
      { next_valid_action: "Continue only with visible context." },
      entityId(internalRun),
    );

    const contextPack = oriented.spec.context_pack as ContextPack;
    expect(contextPack.included_entity_ids).not.toContain(entityId(confidentialTask));
    expect(contextPack.source_revisions).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ entity_id: entityId(confidentialTask) })]),
    );
    expect(contextPack.redactions.join("\n")).toContain("Omitted confidential task");
    expect(contextPack.gaps).toContain(
      `Referenced entity omitted by classification budget: ${entityId(confidentialTask)}`,
    );
  });
});

async function createTestContext() {
  const root = await mkdtemp(path.join(os.tmpdir(), "studio-agent-harness-"));
  await writeFile(
    path.join(root, "studio.config.yaml"),
    YAML.stringify({
      api_version: "studio.guilherme.dev/config-v1",
      root_name: "Agent harness test",
      operator_id: "per_20260614_guilherme-silva",
      canonical_roots: ["operations", "data"],
      runtime_path: "runtime",
      panel: { host: "127.0.0.1", port: 47840 },
      adapters: {},
    }),
  );
  return createStudioContext(root);
}

async function createEntity(
  context: Awaited<ReturnType<typeof createStudioContext>>,
  payload: Record<string, unknown>,
): Promise<StudioEntity> {
  return commandEntity(context, "entity.create", payload);
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
      idempotencyKey: `agent-test-${++commandSequence}`,
    }),
  );
}

async function expectOk(promise: Promise<ResultEnvelope>): Promise<ResultEnvelope> {
  const result = await promise;
  if (result.status !== "ok") {
    throw new Error(JSON.stringify(result.error ?? result, null, 2));
  }
  expect(result.status).toBe("ok");
  return result;
}

function developmentLensAnswers(): Record<string, string> {
  return {
    lifecycle: "Implementation work in the Studio OS agent harness lifecycle.",
    business_value: "Reduces future rebriefing and makes agent work auditable.",
    requirements_solution: "PRD 10 harness loop acceptance controls the change.",
    systems: "The system of interest is the local-first Studio OS coordinator.",
    software: "Core command runtime, schemas and tests are the affected software surfaces.",
    governance: "The run must pass close gates, evidence and handoff requirements.",
    quality_risk_security: "Secret redaction, evidence and close preconditions must hold.",
    delivery_operations: "The actual entrypoint is npm test for the focused harness fixture.",
    knowledge_documentation: "The AgentRun record and handoff become operational memory.",
    methods_models_practices: "Use the Studio operating north star as the tailored method lens.",
  };
}
