import {
  createStudioContext,
  EntityService,
  kindFromAlias,
  validateStudio,
} from "@guilherme-studio/core";
import { createEntity, entityId, entityStatus, entityTitle } from "@guilherme-studio/schemas";
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

  server.resource("entities", "studio://entities", async () => {
    const context = await createStudioContext(root);
    const { files } = await validateCanonicalFiles(context.paths.root);
    return {
      contents: [
        {
          uri: "studio://entities",
          mimeType: "application/json",
          text: JSON.stringify(
            files.map((file) => ({
              id: entityId(file.entity),
              kind: file.entity.kind,
              title: entityTitle(file.entity),
              status: entityStatus(file.entity),
              path: file.relativePath,
            })),
            null,
            2,
          ),
        },
      ],
    };
  });

  server.tool("studio_validate", {}, async () => ({
    content: [{ type: "text", text: JSON.stringify(await validateStudio(root), null, 2) }],
  }));

  server.tool("studio_list_entities", { kind: z.string().optional() }, async ({ kind }) => {
    const context = await createStudioContext(root);
    const { files } = await validateCanonicalFiles(context.paths.root);
    const entities = files
      .filter((file) => !kind || file.entity.kind === kind)
      .map((file) => ({
        id: entityId(file.entity),
        kind: file.entity.kind,
        title: entityTitle(file.entity),
        status: entityStatus(file.entity),
        path: file.relativePath,
      }));
    return { content: [{ type: "text", text: JSON.stringify(entities, null, 2) }] };
  });

  server.tool(
    "studio_prepare_entity_create",
    {
      kind: z.string(),
      title: z.string(),
      summary: z.string().optional(),
      classification: z.enum(["public", "internal", "confidential"]).default("internal"),
    },
    async ({ kind, title, summary, classification }) => {
      const draft = createEntity({
        kind: kindFromAlias(kind),
        title,
        classification,
        ...(summary ? { summary } : {}),
      });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                prepared: true,
                action: "entity.create",
                draft,
                note: "Prepared local mutation only. Use studio_create_entity to execute.",
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.tool(
    "studio_create_entity",
    {
      kind: z.string(),
      title: z.string(),
      summary: z.string().optional(),
      classification: z.enum(["public", "internal", "confidential"]).default("internal"),
    },
    async ({ kind, title, summary, classification }) => {
      const context = await createStudioContext(root);
      const service = new EntityService(context);
      const entity = await service.create({
        kind: kindFromAlias(kind),
        title,
        classification,
        ...(summary ? { summary } : {}),
      });
      return { content: [{ type: "text", text: JSON.stringify(entity, null, 2) }] };
    },
  );

  return server;
}

export async function runStudioMcp(root = process.cwd()): Promise<void> {
  const server = await createStudioMcpServer(root);
  await server.connect(new StdioServerTransport());
}
