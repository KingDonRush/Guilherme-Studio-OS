import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerStudioMcpPrompts } from "./prompts.js";
import { registerStudioMcpResources } from "./resources.js";
import { registerStudioMcpMutationTools } from "./tools/mutations.js";
import { registerStudioMcpReadTools } from "./tools/read.js";

export async function createStudioMcpServer(root = process.cwd()): Promise<McpServer> {
  const server = new McpServer({
    name: "guilherme-studio-os",
    version: "1.0.0",
  });

  registerStudioMcpResources(server, root);
  registerStudioMcpReadTools(server, root);
  registerStudioMcpMutationTools(server, root);
  registerStudioMcpPrompts(server);

  return server;
}

export async function runStudioMcp(root = process.cwd()): Promise<void> {
  const server = await createStudioMcpServer(root);
  await server.connect(new StdioServerTransport());
}
