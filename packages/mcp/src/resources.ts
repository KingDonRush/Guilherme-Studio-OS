import { readFile } from "node:fs/promises";
import path from "node:path";
import { inspectStudioRepositories } from "@guilherme-studio/adapters";
import {
  buildAgentHarnessReport,
  EconomicNextActionResolver,
  evaluatePrdCoverage,
  PreparedActionService,
} from "@guilherme-studio/core";
import { entityId, entityStatus, entityTitle } from "@guilherme-studio/schemas";
import { validateCanonicalFiles } from "@guilherme-studio/storage";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { buildMcpAcceptanceReport } from "./acceptance.js";
import { createMcpContext } from "./command.js";

interface JsonSchemaRecord extends Record<string, unknown> {
  const?: unknown;
}

const ACTIVE_POLICY_SOURCES = [
  {
    id: "constitution",
    title: "Studio OS Constitution",
    resource_uri: "studio://constitution",
    source_path: "docs/studio-os/01-constitution.md",
    role: "non-negotiable operating rules",
  },
  {
    id: "authority-evidence",
    title: "Authority and Evidence Graph",
    source_path: "docs/studio-os/ontology/03-authority-evidence.md",
    role: "authority, confirmation and evidence requirements",
  },
  {
    id: "security-privacy",
    title: "Security and Privacy",
    source_path: "docs/studio-os/security/01-security-privacy.md",
    role: "secret handling, privacy and local runtime boundaries",
  },
  {
    id: "repository-wordpress-topology",
    title: "Repository and WordPress Topology",
    source_path: "docs/studio-os/architecture/04-repository-wordpress-topology.md",
    role: "repository ownership, nested repo and WordPress containment policy",
  },
  {
    id: "quality-gates",
    title: "Quality Gates",
    source_path: "docs/studio-os/operations/02-quality-gates.md",
    role: "verification and release gates",
  },
];

const WORKFLOW_RESOURCES = [
  {
    id: "cross-domain-journeys",
    title: "Cross-domain journeys",
    path: "docs/studio-os/workflows/01-cross-domain-journeys.md",
  },
  {
    id: "visual-reality-loop",
    title: "Visual reality loop",
    path: "docs/studio-os/workflows/02-visual-reality-loop.md",
  },
  {
    id: "agent-execution-handoff",
    title: "Agent execution and handoff",
    path: "docs/studio-os/workflows/03-agent-execution-handoff.md",
  },
];

export function registerStudioMcpResources(server: McpServer, root: string): void {
  server.resource("constitution", "studio://constitution", async () => ({
    contents: [
      {
        uri: "studio://constitution",
        mimeType: "text/markdown",
        text: await readFile(path.join(root, "docs/studio-os/01-constitution.md"), "utf8"),
      },
    ],
  }));

  server.resource("active-policies", "studio://policies/active", async () => ({
    contents: [
      {
        uri: "studio://policies/active",
        mimeType: "application/json",
        text: JSON.stringify(
          {
            api_version: "studio.guilherme.dev/mcp-policies-v1",
            classification: "internal",
            generated_at: new Date().toISOString(),
            sources: ACTIVE_POLICY_SOURCES,
            invariants: [
              "MCP must not expose raw secret stores.",
              "External/public/destructive actions require prepare -> confirm -> execute -> reconcile.",
              "MCP resources provide bounded context, not unrestricted filesystem access.",
              "Panel, MCP and CLI cannot bypass Studio Core gates.",
              "Portfolio remains frozen until the acceptance gate explicitly releases it.",
            ],
          },
          null,
          2,
        ),
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

  server.resource(
    "schema-kind",
    new ResourceTemplate("studio://schemas/{kind}", {
      list: async () => {
        const catalog = await readSchemaCatalog(root);
        return {
          resources: schemaResourceKinds(catalog).map((kind) => ({
            uri: `studio://schemas/${kind}`,
            name: `schema-${kind}`,
            title: `${kind} schema`,
            mimeType: "application/json",
          })),
        };
      },
    }),
    async (uri, variables) => {
      const kind = String(resourceVariable(variables, "kind"));
      const schema = schemaForKind(await readSchemaCatalog(root), kind);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(schema ?? { error: "schema_not_found", kind }, null, 2),
          },
        ],
      };
    },
  );

  server.resource("lifecycles", "studio://lifecycles", async () => ({
    contents: [
      {
        uri: "studio://lifecycles",
        mimeType: "text/markdown",
        text: await readFile(path.join(root, "docs/studio-os/ontology/02-lifecycles.md"), "utf8"),
      },
    ],
  }));

  server.resource("dashboard-summary", "studio://dashboard/summary", async () => {
    const context = await createMcpContext(root);
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
    const context = await createMcpContext(root);
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

  server.resource("acceptance", "studio://acceptance", async () => {
    const context = await createMcpContext(root);
    return {
      contents: [
        {
          uri: "studio://acceptance",
          mimeType: "application/json",
          text: JSON.stringify(await buildMcpAcceptanceReport(root, context), null, 2),
        },
      ],
    };
  });

  server.resource("repository-health", "studio://repositories/health", async () => {
    const context = await createMcpContext(root);
    return {
      contents: [
        {
          uri: "studio://repositories/health",
          mimeType: "application/json",
          text: JSON.stringify(await inspectStudioRepositories(context), null, 2),
        },
      ],
    };
  });

  server.resource("prepared-actions", "studio://prepared-actions", async () => {
    const context = await createMcpContext(root);
    return {
      contents: [
        {
          uri: "studio://prepared-actions",
          mimeType: "application/json",
          text: JSON.stringify(await new PreparedActionService(context).list(), null, 2),
        },
      ],
    };
  });

  server.resource("agent-harness", "studio://agents/harness", async () => {
    const context = await createMcpContext(root);
    const { files } = await validateCanonicalFiles(context.paths.root);
    return {
      contents: [
        {
          uri: "studio://agents/harness",
          mimeType: "application/json",
          text: JSON.stringify(buildAgentHarnessReport(files.map((file) => file.entity)), null, 2),
        },
      ],
    };
  });

  server.resource(
    "entity-context",
    new ResourceTemplate("studio://entities/{id}/context", { list: undefined }),
    async (uri, variables) => {
      const id = String(resourceVariable(variables, "id"));
      const context = await createMcpContext(root);
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

  server.resource(
    "agent-context-pack",
    new ResourceTemplate("studio://agents/{id}/context-pack", { list: undefined }),
    async (uri, variables) => {
      const id = String(resourceVariable(variables, "id"));
      const context = await createMcpContext(root);
      const { files } = await validateCanonicalFiles(context.paths.root);
      const report = buildAgentHarnessReport(files.map((file) => file.entity));
      const contextPack = report.context_packs.find((pack) => pack.run_id === id);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(contextPack ?? { error: "context_pack_not_found", id }, null, 2),
          },
        ],
      };
    },
  );

  server.resource(
    "agent-handoff",
    new ResourceTemplate("studio://agents/{id}/handoff", { list: undefined }),
    async (uri, variables) => {
      const id = String(resourceVariable(variables, "id"));
      const context = await createMcpContext(root);
      const { files } = await validateCanonicalFiles(context.paths.root);
      const report = buildAgentHarnessReport(files.map((file) => file.entity));
      const handoff = report.handoffs.find((item) => item.run_id === id);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(handoff ?? { error: "handoff_not_found", id }, null, 2),
          },
        ],
      };
    },
  );

  server.resource(
    "prepared-action",
    new ResourceTemplate("studio://prepared-actions/{id}", { list: undefined }),
    async (uri, variables) => {
      const id = String(resourceVariable(variables, "id"));
      const context = await createMcpContext(root);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(await new PreparedActionService(context).get(id), null, 2),
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

  server.resource(
    "workflow",
    new ResourceTemplate("studio://workflows/{workflow_id}", {
      list: async () => ({
        resources: WORKFLOW_RESOURCES.map((workflow) => ({
          uri: `studio://workflows/${workflow.id}`,
          name: `workflow-${workflow.id}`,
          title: workflow.title,
          mimeType: "text/markdown",
        })),
      }),
    }),
    async (uri, variables) => {
      const workflowId = String(resourceVariable(variables, "workflow_id"));
      const workflow = WORKFLOW_RESOURCES.find((item) => item.id === workflowId);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: workflow ? "text/markdown" : "application/json",
            text: workflow
              ? await readFile(path.join(root, workflow.path), "utf8")
              : JSON.stringify({ error: "workflow_not_found", workflow_id: workflowId }, null, 2),
          },
        ],
      };
    },
  );

  server.resource("entities", "studio://entities", async () => {
    const context = await createMcpContext(root);
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
}

function resourceVariable(
  variables: Record<string, string | string[]>,
  key: string,
): string | string[] | undefined {
  return variables[key];
}

async function readSchemaCatalog(root: string): Promise<Record<string, unknown>> {
  return JSON.parse(
    await readFile(path.join(root, "docs/studio-os/schemas/generated/catalog.json"), "utf8"),
  ) as Record<string, unknown>;
}

function schemaResourceKinds(catalog: Record<string, unknown>): string[] {
  const schemas = recordValue(catalog, "schemas");
  const directKinds = Object.keys(schemas);
  const entitySchema = recordValue(schemas, "entity");
  const entityKinds = arrayValue(entitySchema, "oneOf")
    .map((schema) => kindConst(schema))
    .filter((kind): kind is string => typeof kind === "string");
  return [...new Set([...directKinds, ...entityKinds])].sort((a, b) => a.localeCompare(b));
}

function schemaForKind(catalog: Record<string, unknown>, kind: string): unknown {
  const schemas = recordValue(catalog, "schemas");
  if (kind in schemas) {
    return schemas[kind];
  }
  const entitySchema = recordValue(schemas, "entity");
  return arrayValue(entitySchema, "oneOf").find((schema) => kindConst(schema) === kind);
}

function kindConst(schema: unknown): unknown {
  return (recordValue(recordValue(schema, "properties"), "kind") as JsonSchemaRecord).const;
}

function recordValue(value: unknown, key: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return {};
  }
  const next = (value as Record<string, unknown>)[key];
  if (typeof next !== "object" || next === null || Array.isArray(next)) {
    return {};
  }
  return next as Record<string, unknown>;
}

function arrayValue(value: unknown, key: string): unknown[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return [];
  }
  const next = (value as Record<string, unknown>)[key];
  return Array.isArray(next) ? next : [];
}
