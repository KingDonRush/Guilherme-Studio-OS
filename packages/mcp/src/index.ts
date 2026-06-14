import { createStudioContext, validateStudio } from "@guilherme-studio/core";
import { validateCanonicalFiles } from "@guilherme-studio/storage";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

export async function createStudioMcpServer(root = process.cwd()): Promise<McpServer> {
  const server = new McpServer({
    name: "guilherme-studio-os",
    version: "1.0.0",
  });

  server.resource("constitution", "studio://constitution", async () => ({
    contents: [
      {
        uri: "studio://constitution",
        mimeType: "text/markdown",
        text: "Guilherme Studio OS: local-first operating system. External actions require prepare -> confirm -> execute -> reconcile.",
      },
    ],
  }));

  server.tool("studio_validate", {}, async () => ({
    content: [{ type: "text", text: JSON.stringify(await validateStudio(root), null, 2) }],
  }));

  server.tool("studio_list_entities", { kind: z.string().optional() }, async ({ kind }) => {
    const context = await createStudioContext(root);
    const { files } = await validateCanonicalFiles(context.paths.root);
    const entities = files
      .filter((file) => !kind || file.entity.kind === kind)
      .map((file) => ({
        id: file.entity.id,
        kind: file.entity.kind,
        title: file.entity.title,
        status: file.entity.status,
        path: file.relativePath,
      }));
    return { content: [{ type: "text", text: JSON.stringify(entities, null, 2) }] };
  });

  return server;
}

export async function runStudioMcp(root = process.cwd()): Promise<void> {
  const server = await createStudioMcpServer(root);
  await server.connect(new StdioServerTransport());
}
