import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { describe, expect, it } from "vitest";
import { createStudioMcpServer } from "./server.js";

describe("Studio MCP server", () => {
  it("exposes PRD 11 resources, tools and prompts over the MCP transport", async () => {
    const root = await createConfiguredRoot();
    const server = await createStudioMcpServer(root);
    const client = new Client({ name: "studio-mcp-smoke", version: "1.0.0" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

    try {
      const tools = await client.listTools();
      expect(tools.tools.map((tool) => tool.name)).toEqual(
        expect.arrayContaining([
          "studio_validate",
          "studio_get_agent_harness",
          "studio_start_agent_run",
          "studio_build_context_pack",
          "studio_authorize_agent_run",
          "studio_record_agent_observation",
          "studio_complete_agent_verification",
          "studio_create_agent_handoff",
          "studio_close_agent_run",
        ]),
      );

      const resources = await client.listResources();
      expect(resources.resources.map((resource) => resource.uri)).toEqual(
        expect.arrayContaining(["studio://agents/harness", "studio://dashboard/prd-coverage"]),
      );

      const harness = await client.readResource({ uri: "studio://agents/harness" });
      const harnessContent = harness.contents[0];
      expect(harnessContent).toBeDefined();
      expect(harnessContent).toMatchObject({
        uri: "studio://agents/harness",
        mimeType: "application/json",
      });
      expect(JSON.parse(textFromContent(harnessContent))).toMatchObject({
        summary: { total_runs: 0 },
      });

      const validation = await client.callTool({ name: "studio_validate", arguments: {} });
      const validationContent = Array.isArray(validation.content)
        ? validation.content[0]
        : undefined;
      expect(validationContent).toBeDefined();
      expect(validationContent).toMatchObject({ type: "text" });
      expect(JSON.parse(textFromContent(validationContent))).toMatchObject({ ok: true });

      const prompts = await client.listPrompts();
      expect(prompts.prompts.map((prompt) => prompt.name)).toEqual(
        expect.arrayContaining(["handoff_creation", "implementation_diagnosis"]),
      );

      const handoffPrompt = await client.getPrompt({
        name: "handoff_creation",
        arguments: {
          run_id: "run_20260618_smoke",
          continuation_goal: "Continue the PRD 11 smoke.",
        },
      });
      expect(handoffPrompt.messages[0]?.content).toMatchObject({
        type: "text",
        text: expect.stringContaining("AgentRun: run_20260618_smoke"),
      });

      const started = await callToolJson(client, "studio_start_agent_run", {
        objective: "Run MCP Agent Harness lifecycle smoke.",
        allowed: ["read_context"],
        prohibited: ["external_send"],
        material: false,
        idempotency_key: "mcp-agent-start",
      });
      const runId = String(
        (started.result as { entity_id?: unknown } | undefined)?.entity_id ?? "",
      );
      expect(runId).toMatch(/^run_/);

      await callToolJson(client, "studio_build_context_pack", {
        run_id: runId,
        next_valid_action: "Authorize the smoke run.",
        idempotency_key: "mcp-agent-context",
      });
      await callToolJson(client, "studio_authorize_agent_run", {
        run_id: runId,
        allowed: ["read_context"],
        prohibited: ["external_send"],
        idempotency_key: "mcp-agent-authorize",
      });
      await callToolJson(client, "studio_record_agent_observation", {
        run_id: runId,
        source: "runtime",
        summary: "MCP in-memory transport is connected.",
        idempotency_key: "mcp-agent-observe",
      });
      await callToolJson(client, "studio_complete_agent_verification", {
        run_id: runId,
        status: "not_run",
        not_run_reason: "Smoke checks transport and command routing only.",
        idempotency_key: "mcp-agent-verify",
      });
      await callToolJson(client, "studio_create_agent_handoff", {
        run_id: runId,
        summary: "MCP lifecycle smoke reached handoff.",
        next_valid_action: "Continue with full PRD 11 lifecycle equivalence.",
        gaps: ["Full cross-interface lifecycle event comparison remains pending."],
        idempotency_key: "mcp-agent-handoff",
      });
      const closed = await callToolJson(client, "studio_close_agent_run", {
        run_id: runId,
        outcome: "Closed MCP smoke as blocked by explicit remaining lifecycle comparison.",
        idempotency_key: "mcp-agent-close",
      });
      expect(closed).toMatchObject({
        status: "ok",
        result: {
          action: "agent.close",
          entity: {
            spec: {
              state: "closed",
              result: "blocked",
            },
          },
        },
      });
    } finally {
      await client.close();
      await server.close();
    }
  });
});

async function createConfiguredRoot(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "studio-mcp-smoke-"));
  await writeFile(
    path.join(root, "studio.config.yaml"),
    [
      "api_version: studio.guilherme.dev/config-v1",
      "root_name: MCP smoke test",
      "operator_id: per_20260614_guilherme-silva",
      "canonical_roots:",
      "  - operations",
      "  - data",
      "runtime_path: runtime",
      "panel:",
      "  host: 127.0.0.1",
      "  port: 47846",
      "adapters: {}",
      "",
    ].join("\n"),
  );
  return root;
}

async function callToolJson(
  client: Client,
  name: string,
  args: Record<string, unknown>,
): Promise<ToolEnvelope> {
  const result = await client.callTool({ name, arguments: args });
  const content = Array.isArray(result.content) ? result.content[0] : undefined;
  return JSON.parse(textFromContent(content)) as ToolEnvelope;
}

interface ToolEnvelope extends Record<string, unknown> {
  result?: unknown;
}

function textFromContent(content: unknown): string {
  if (content && typeof content === "object" && "text" in content) {
    const text = Reflect.get(content, "text");
    if (typeof text === "string") {
      return text;
    }
  }
  throw new Error("Expected MCP text content");
}
