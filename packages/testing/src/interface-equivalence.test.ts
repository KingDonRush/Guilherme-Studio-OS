import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { ResultEnvelope } from "@guilherme-studio/schemas";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createProgram } from "../../cli/src/index.js";
import {
  createStudioCommand,
  createStudioContext,
  executeStudioCommand,
} from "../../core/src/index.js";
import { createLocalApi } from "../../local-api/src/index.js";
import { createStudioMcpServer } from "../../mcp/src/server.js";

describe("Studio interface equivalence", () => {
  afterEach(() => {
    process.exitCode = undefined;
    vi.restoreAllMocks();
  });

  it("keeps AgentRun dry-run mutation envelopes equivalent across core, CLI, API and MCP", async () => {
    const root = await createConfiguredRoot();
    const payload = {
      objective: "Prove PRD 11 interface equivalence for AgentRun start.",
      owning_entity_ids: [],
      target_repository_ids: [],
      target_environment_ids: [],
      allowed: ["read_context", "run_tests"],
      confirmation_required: ["external_send"],
      prohibited: ["destructive_execute"],
      material: true,
    };
    const context = await createStudioContext(root);
    const core = await executeStudioCommand(
      context,
      createStudioCommand(context, {
        command: "agent.start",
        payload,
        dryRun: true,
        idempotencyKey: "equivalence-core",
      }),
    );
    const cli = await runCliJson([
      "--root",
      root,
      "--json",
      "--dry-run",
      "--idempotency-key",
      "equivalence-cli",
      "agent",
      "start",
      "--objective",
      payload.objective,
      "--allowed",
      ...payload.allowed,
      "--confirmation-required",
      ...payload.confirmation_required,
      "--prohibited",
      ...payload.prohibited,
    ]);
    const { app, token } = await createLocalApi({ root });
    const apiResponse = await app.inject({
      method: "POST",
      url: "/api/v1/commands/dry-run",
      headers: {
        host: "127.0.0.1:47845",
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      payload: {
        command: "agent.start",
        idempotency_key: "equivalence-api",
        payload,
      },
    });
    const api = apiResponse.json() as ResultEnvelope;
    await app.close();
    const { client, close } = await connectMcp(root);
    const mcp = await callMcpJson(client, "studio_start_agent_run", {
      ...payload,
      dry_run: true,
      idempotency_key: "equivalence-mcp",
    });
    await close();

    expect(normalizeDryRun(core)).toEqual(normalizeDryRun(cli as ResultEnvelope));
    expect(normalizeDryRun(api)).toEqual(normalizeDryRun(core));
    expect(normalizeDryRun(mcp)).toEqual(normalizeDryRun(core));
  });
});

async function createConfiguredRoot(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "studio-interface-equivalence-"));
  await writeFile(
    path.join(root, "studio.config.yaml"),
    [
      "api_version: studio.guilherme.dev/config-v1",
      "root_name: Interface equivalence test",
      "operator_id: per_20260614_guilherme-silva",
      "canonical_roots:",
      "  - operations",
      "  - data",
      "runtime_path: runtime",
      "panel:",
      "  host: 127.0.0.1",
      "  port: 47845",
      "adapters: {}",
      "",
    ].join("\n"),
  );
  return root;
}

async function runCliJson(args: string[]): Promise<Record<string, unknown>> {
  const logs: string[] = [];
  vi.spyOn(console, "log").mockImplementation((value: unknown) => {
    logs.push(typeof value === "string" ? value : JSON.stringify(value));
  });
  const program = createProgram();
  program.exitOverride();
  await program.parseAsync(["node", "studio", ...args], { from: "node" });
  const last = logs.at(-1);
  if (!last) {
    throw new Error("CLI produced no JSON output.");
  }
  return JSON.parse(last) as Record<string, unknown>;
}

function normalizeDryRun(envelope: ResultEnvelope): unknown {
  return {
    status: envelope.status,
    result: envelope.result,
    warnings: envelope.warnings,
    required_actions: envelope.required_actions,
  };
}

async function connectMcp(root: string): Promise<{ client: Client; close: () => Promise<void> }> {
  const server = await createStudioMcpServer(root);
  const client = new Client({ name: "studio-equivalence-test", version: "1.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return {
    client,
    close: async () => {
      await client.close();
      await server.close();
    },
  };
}

async function callMcpJson(
  client: Client,
  name: string,
  args: Record<string, unknown>,
): Promise<ResultEnvelope> {
  const result = await client.callTool({ name, arguments: args });
  const content = Array.isArray(result.content) ? result.content[0] : undefined;
  if (!content || typeof content !== "object" || !("text" in content)) {
    throw new Error(`MCP tool ${name} did not return text content`);
  }
  const text = Reflect.get(content, "text");
  if (typeof text !== "string") {
    throw new Error(`MCP tool ${name} text content is invalid`);
  }
  return JSON.parse(text) as ResultEnvelope;
}
