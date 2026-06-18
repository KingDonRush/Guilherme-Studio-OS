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
        expect.arrayContaining(["studio_validate", "studio_get_agent_harness"]),
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

function textFromContent(content: unknown): string {
  if (content && typeof content === "object" && "text" in content) {
    const text = Reflect.get(content, "text");
    if (typeof text === "string") {
      return text;
    }
  }
  throw new Error("Expected MCP text content");
}
