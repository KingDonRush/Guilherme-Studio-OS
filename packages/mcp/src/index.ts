import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  createStudioContext,
  DomainCommandService,
  EntityService,
  entityMutationResult,
  kindFromAlias,
  PreparedActionService,
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
        text: await readFile(path.join(root, "docs/studio-os/01-constitution.md"), "utf8"),
      },
    ],
  }));

  server.resource("schemas", "studio://schemas", async () => ({
    contents: [
      {
        uri: "studio://schemas",
        mimeType: "application/json",
        text: await readFile(
          path.join(root, "docs/studio-os/schemas/generated/catalog.json"),
          "utf8",
        ),
      },
    ],
  }));

  server.resource("workflows", "studio://workflows", async () => ({
    contents: [
      {
        uri: "studio://workflows",
        mimeType: "text/markdown",
        text: await readFile(
          path.join(root, "docs/studio-os/workflows/01-cross-domain-journeys.md"),
          "utf8",
        ),
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
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(entityMutationResult("entity.create", entity), null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    "studio_prepare_external_action",
    {
      action_type: z.string(),
      payload: z.record(z.string(), z.unknown()),
      ttl_seconds: z.number().int().positive().max(86400).default(900),
    },
    async ({ action_type, payload, ttl_seconds }) => {
      const context = await createStudioContext(root);
      const action = await new PreparedActionService(context).prepare({
        actionType: action_type,
        payload,
        ttlSeconds: ttl_seconds,
      });
      return { content: [{ type: "text", text: JSON.stringify(action, null, 2) }] };
    },
  );

  server.tool("studio_check_confirmation", { action_id: z.string() }, async ({ action_id }) => {
    const context = await createStudioContext(root);
    const action = await new PreparedActionService(context).get(action_id);
    return { content: [{ type: "text", text: JSON.stringify(action, null, 2) }] };
  });

  server.tool(
    "studio_confirm_prepared_action",
    { action_id: z.string(), payload_checksum: z.string().length(64) },
    async ({ action_id, payload_checksum }) => {
      const context = await createStudioContext(root);
      const action = await new PreparedActionService(context).confirm(action_id, payload_checksum);
      return { content: [{ type: "text", text: JSON.stringify(action, null, 2) }] };
    },
  );

  server.tool(
    "studio_qualify_prospect",
    {
      prospect_id: z.string(),
      rationale: z.string().min(1),
      score: z.number().int().min(0).max(100),
      qualified: z.boolean().default(true),
    },
    async ({ prospect_id, rationale, score, qualified }) => {
      const context = await createStudioContext(root);
      const entity = await new DomainCommandService(context).qualifyProspect(prospect_id, {
        rationale,
        score,
        qualified,
      });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(entityMutationResult("prospect.qualify", entity), null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    "studio_register_evidence",
    {
      title: z.string(),
      evidence_type: z.enum([
        "file",
        "url",
        "command",
        "screenshot",
        "backup",
        "decision",
        "manual",
      ]),
      subject_id: z.string().optional(),
      path: z.string().optional(),
      url: z.string().optional(),
      command: z.string().optional(),
      checksum: z.string().optional(),
    },
    async ({ title, evidence_type, subject_id, path, url, command, checksum }) => {
      const context = await createStudioContext(root);
      const entity = await new DomainCommandService(context).registerEvidence({
        title,
        evidenceType: evidence_type,
        ...(subject_id ? { subjectId: subject_id } : {}),
        ...(path ? { path } : {}),
        ...(url ? { url } : {}),
        ...(command ? { command } : {}),
        ...(checksum ? { checksum } : {}),
      });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(entityMutationResult("evidence.register", entity), null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    "studio_prepare_proposal",
    { opportunity_id: z.string(), title: z.string().optional() },
    async ({ opportunity_id, title }) => {
      const context = await createStudioContext(root);
      const entity = await new DomainCommandService(context).prepareProposal(opportunity_id, title);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(entityMutationResult("proposal.prepare", entity), null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    "studio_create_engagement_from_opportunity",
    { opportunity_id: z.string(), title: z.string().optional() },
    async ({ opportunity_id, title }) => {
      const context = await createStudioContext(root);
      const entity = await new DomainCommandService(context).createEngagementFromOpportunity(
        opportunity_id,
        title,
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              entityMutationResult("engagement.create-from-opportunity", entity),
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  return server;
}

export async function runStudioMcp(root = process.cwd()): Promise<void> {
  const server = await createStudioMcpServer(root);
  await server.connect(new StdioServerTransport());
}
