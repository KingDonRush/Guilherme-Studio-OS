import { readFile } from "node:fs/promises";
import path from "node:path";
import { inspectStudioRepositories } from "@guilherme-studio/adapters";
import {
  createStudioCommand,
  createStudioContext,
  createWorkflowFixtureEntities,
  EconomicNextActionResolver,
  evaluatePrdCoverage,
  executeStudioCommand,
  kindFromAlias,
  operatorActor,
  PreparedActionService,
  validateStudio,
  verifyWorkflowCoverage,
} from "@guilherme-studio/core";
import {
  createEntity,
  createResultEnvelope,
  entityId,
  entityStatus,
  entityTitle,
} from "@guilherme-studio/schemas";
import { validateCanonicalFiles } from "@guilherme-studio/storage";
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
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

  server.resource("dashboard-summary", "studio://dashboard/summary", async () => {
    const context = await createStudioContext(root);
    const { files } = await validateCanonicalFiles(context.paths.root);
    return {
      contents: [
        {
          uri: "studio://dashboard/summary",
          mimeType: "application/json",
          text: JSON.stringify(
            {
              entity_count: files.length,
              by_kind: Object.fromEntries(
                [...new Set(files.map((file) => file.entity.kind))]
                  .sort((a, b) => a.localeCompare(b))
                  .map((kind) => [kind, files.filter((file) => file.entity.kind === kind).length]),
              ),
              next_actions: new EconomicNextActionResolver()
                .rank(files.map((file) => file.entity))
                .slice(0, 10),
              projection_revision: context.projection.inspect().projectionRevision ?? 0,
            },
            null,
            2,
          ),
        },
      ],
    };
  });

  server.resource("prd-coverage", "studio://dashboard/prd-coverage", async () => {
    const context = await createStudioContext(root);
    const { files } = await validateCanonicalFiles(context.paths.root);
    return {
      contents: [
        {
          uri: "studio://dashboard/prd-coverage",
          mimeType: "application/json",
          text: JSON.stringify(evaluatePrdCoverage(files.map((file) => file.entity)), null, 2),
        },
      ],
    };
  });

  server.resource(
    "entity-context",
    new ResourceTemplate("studio://entities/{id}/context", { list: undefined }),
    async (uri, variables) => {
      const id = String(resourceVariable(variables, "id"));
      const context = await createStudioContext(root);
      const file = await context.entities.get(id);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(
              file
                ? {
                    entity: file.entity,
                    path: file.relativePath,
                    classification: file.entity.metadata.classification,
                    projection_revision: context.projection.inspect().projectionRevision ?? 0,
                  }
                : {
                    error: "entity_not_found",
                    id,
                  },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

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

  server.tool("studio_query_entities", { kind: z.string().optional() }, async ({ kind }) => {
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
        classification: file.entity.metadata.classification,
      }));
    return { content: [{ type: "text", text: JSON.stringify(entities, null, 2) }] };
  });

  server.tool("studio_get_entity", { id: z.string() }, async ({ id }) => {
    const context = await createStudioContext(root);
    const file = await context.entities.get(id);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            file ? { entity: file.entity, path: file.relativePath } : { error: "not_found", id },
            null,
            2,
          ),
        },
      ],
    };
  });

  server.tool("studio_get_next_actions", {}, async () => {
    const context = await createStudioContext(root);
    const { files } = await validateCanonicalFiles(context.paths.root);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            new EconomicNextActionResolver().rank(files.map((file) => file.entity)),
            null,
            2,
          ),
        },
      ],
    };
  });

  server.tool("studio_get_prd_coverage", {}, async () => {
    const context = await createStudioContext(root);
    const { files } = await validateCanonicalFiles(context.paths.root);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(evaluatePrdCoverage(files.map((file) => file.entity)), null, 2),
        },
      ],
    };
  });

  server.tool("studio_inspect_repository", { id: z.string().optional() }, async ({ id }) => {
    const context = await createStudioContext(root);
    const repositories = await inspectStudioRepositories(context);
    const result = id ? repositories.filter((repository) => repository.id === id) : repositories;
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  });

  server.tool(
    "studio_verify_workflows",
    { fixtures: z.boolean().default(false) },
    async ({ fixtures }) => {
      const context = await createStudioContext(root);
      const entities = fixtures
        ? createWorkflowFixtureEntities()
        : (await context.entities.scan()).map((file) => file.entity);
      const workflows = verifyWorkflowCoverage(entities);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                ok: workflows.every((workflow) => workflow.ok),
                mode: fixtures ? "fixtures" : "canonical",
                workflows,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

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
      const entity = await executeStudioCommand(
        context,
        createStudioCommand(context, {
          command: "entity.create",
          actor: operatorActor(context.config.operator_id),
          payload: {
            kind: kindFromAlias(kind),
            title,
            classification,
            ...(summary ? { summary } : {}),
          },
        }),
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(entity, null, 2),
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
      const action = await executeStudioCommand(
        context,
        createStudioCommand(context, {
          command: "action.prepare",
          actor: operatorActor(context.config.operator_id),
          payload: {
            action_type,
            payload,
            ttl_seconds,
          },
        }),
      );
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
      const action = await executeStudioCommand(
        context,
        createStudioCommand(context, {
          command: "action.confirm",
          actor: operatorActor(context.config.operator_id),
          payload: { action_id, payload_checksum },
        }),
      );
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
      const entity = await executeStudioCommand(
        context,
        createStudioCommand(context, {
          command: "prospect.qualify",
          actor: operatorActor(context.config.operator_id),
          targetId: prospect_id,
          payload: { rationale, score, qualified },
        }),
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(entity, null, 2),
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
      const entity = await executeStudioCommand(
        context,
        createStudioCommand(context, {
          command: "evidence.register",
          actor: operatorActor(context.config.operator_id),
          payload: {
            title,
            evidence_type,
            ...(subject_id ? { subject_id } : {}),
            ...(path ? { path } : {}),
            ...(url ? { url } : {}),
            ...(command ? { command } : {}),
            ...(checksum ? { checksum } : {}),
          },
        }),
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(entity, null, 2),
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
      const entity = await executeStudioCommand(
        context,
        createStudioCommand(context, {
          command: "proposal.prepare",
          actor: operatorActor(context.config.operator_id),
          payload: {
            opportunity_id,
            ...(title ? { title } : {}),
          },
        }),
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(entity, null, 2),
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
      const entity = await executeStudioCommand(
        context,
        createStudioCommand(context, {
          command: "engagement.create-from-opportunity",
          actor: operatorActor(context.config.operator_id),
          payload: {
            opportunity_id,
            ...(title ? { title } : {}),
          },
        }),
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(entity, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    "studio_create_case_from_evidence",
    {
      evidence_id: z.string(),
      title: z.string(),
      summary: z.string().optional(),
      case_url: z.string().optional(),
    },
    async ({ evidence_id, title, summary, case_url }) => {
      const context = await createStudioContext(root);
      const entity = await executeStudioCommand(
        context,
        createStudioCommand(context, {
          command: "case.create-from-evidence",
          actor: operatorActor(context.config.operator_id),
          payload: {
            evidence_id,
            title,
            ...(summary ? { summary } : {}),
            ...(case_url ? { case_url } : {}),
          },
        }),
      );
      return { content: [{ type: "text", text: JSON.stringify(entity, null, 2) }] };
    },
  );

  server.tool(
    "studio_create_handoff",
    {
      task_id: z.string(),
      title: z.string(),
      objective: z.string(),
      summary: z.string(),
      repository_ids: z.array(z.string()).default([]),
    },
    async ({ task_id, title, objective, summary, repository_ids }) => {
      const context = await createStudioContext(root);
      const entity = await executeStudioCommand(
        context,
        createStudioCommand(context, {
          command: "handoff.create",
          actor: operatorActor(context.config.operator_id),
          payload: { task_id, title, objective, summary, repository_ids },
        }),
      );
      return { content: [{ type: "text", text: JSON.stringify(entity, null, 2) }] };
    },
  );

  server.tool(
    "studio_reconcile_prepared_action",
    { action_id: z.string(), result: z.record(z.string(), z.unknown()) },
    async ({ action_id, result }) => {
      const context = await createStudioContext(root);
      const action = await executeStudioCommand(
        context,
        createStudioCommand(context, {
          command: "action.reconcile",
          actor: operatorActor(context.config.operator_id),
          payload: { action_id, result },
        }),
      );
      return { content: [{ type: "text", text: JSON.stringify(action, null, 2) }] };
    },
  );

  server.tool(
    "studio_execute_confirmed_action",
    { action_id: z.string() },
    async ({ action_id }) => {
      const context = await createStudioContext(root);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              createResultEnvelope({
                status: "blocked",
                requiredActions: ["enable_specific_adapter_provider"],
                error: {
                  code: "adapter_disabled",
                  message: `Action execution is not available without an enabled adapter: ${action_id}`,
                  details: { action_id },
                },
                projectionRevision: context.projection.inspect().projectionRevision ?? 0,
              }),
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.prompt(
    "implementation_diagnosis",
    "Diagnose implementation mismatch using governed Studio context.",
    { subject_id: z.string().optional(), feedback: z.string() },
    ({ subject_id, feedback }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              "Diagnose this implementation mismatch without mutating files first.",
              subject_id ? `Subject: ${subject_id}` : "Subject: not provided",
              `Feedback: ${feedback}`,
              "Use studio_get_entity, studio_inspect_repository and studio_register_evidence as needed.",
              "Separate observation, inference, decision and required evidence.",
            ].join("\n"),
          },
        },
      ],
    }),
  );

  return server;
}

function resourceVariable(
  variables: Record<string, string | string[]>,
  key: string,
): string | string[] | undefined {
  return variables[key];
}

export async function runStudioMcp(root = process.cwd()): Promise<void> {
  const server = await createStudioMcpServer(root);
  await server.connect(new StdioServerTransport());
}
