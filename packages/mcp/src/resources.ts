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
