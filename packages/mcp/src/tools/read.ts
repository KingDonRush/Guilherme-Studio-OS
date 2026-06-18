import { inspectStudioRepositories } from "@guilherme-studio/adapters";
import {
  buildAgentHarnessReport,
  createWorkflowFixtureEntities,
  EconomicNextActionResolver,
  evaluatePrdCoverage,
  executeWorkflowFixtures,
  validateStudio,
  verifyWorkflowCoverage,
} from "@guilherme-studio/core";
import { entityId, entityStatus, entityTitle } from "@guilherme-studio/schemas";
import { validateCanonicalFiles } from "@guilherme-studio/storage";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { buildMcpAcceptanceReport } from "../acceptance.js";
import { createMcpContext } from "../command.js";
import { jsonContent } from "../responses.js";

export function registerStudioMcpReadTools(server: McpServer, root: string): void {
  server.tool("studio_validate", {}, async () => jsonContent(await validateStudio(root)));

  server.tool("studio_query_entities", { kind: z.string().optional() }, async ({ kind }) => {
    const context = await createMcpContext(root);
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
    return jsonContent(entities);
  });

  server.tool("studio_get_entity", { id: z.string() }, async ({ id }) => {
    const context = await createMcpContext(root);
    const file = await context.entities.get(id);
    return jsonContent(
      file ? { entity: file.entity, path: file.relativePath } : { error: "not_found", id },
    );
  });

  server.tool("studio_get_next_actions", {}, async () => {
    const context = await createMcpContext(root);
    const { files } = await validateCanonicalFiles(context.paths.root);
    return jsonContent(new EconomicNextActionResolver().rank(files.map((file) => file.entity)));
  });

  server.tool("studio_get_prd_coverage", {}, async () => {
    const context = await createMcpContext(root);
    const { files } = await validateCanonicalFiles(context.paths.root);
    return jsonContent(evaluatePrdCoverage(files.map((file) => file.entity)));
  });

  server.tool("studio_get_acceptance", {}, async () => {
    const context = await createMcpContext(root);
    return jsonContent(await buildMcpAcceptanceReport(root, context));
  });

  server.tool("studio_get_agent_harness", {}, async () => {
    const context = await createMcpContext(root);
    const { files } = await validateCanonicalFiles(context.paths.root);
    return jsonContent(buildAgentHarnessReport(files.map((file) => file.entity)));
  });

  server.tool("studio_get_context_pack", { run_id: z.string() }, async ({ run_id }) => {
    const context = await createMcpContext(root);
    const { files } = await validateCanonicalFiles(context.paths.root);
    const report = buildAgentHarnessReport(files.map((file) => file.entity));
    return jsonContent(
      report.context_packs.find((pack) => pack.run_id === run_id) ?? {
        error: "context_pack_not_found",
        run_id,
      },
    );
  });

  server.tool("studio_get_run_handoff", { run_id: z.string() }, async ({ run_id }) => {
    const context = await createMcpContext(root);
    const { files } = await validateCanonicalFiles(context.paths.root);
    const report = buildAgentHarnessReport(files.map((file) => file.entity));
    return jsonContent(
      report.handoffs.find((handoff) => handoff.run_id === run_id) ?? {
        error: "handoff_not_found",
        run_id,
      },
    );
  });

  server.tool(
    "studio_execute_workflow_fixtures",
    { workflow_id: z.string().optional() },
    async ({ workflow_id }) =>
      jsonContent(
        await executeWorkflowFixtures({
          ...(workflow_id ? { workflowId: workflow_id } : {}),
        }),
      ),
  );

  server.tool("studio_inspect_repository", { id: z.string().optional() }, async ({ id }) => {
    const context = await createMcpContext(root);
    const repositories = await inspectStudioRepositories(context);
    return jsonContent(
      id ? repositories.filter((repository) => repository.id === id) : repositories,
    );
  });

  server.tool(
    "studio_verify_workflows",
    { fixtures: z.boolean().default(false) },
    async ({ fixtures }) => {
      const context = await createMcpContext(root);
      const entities = fixtures
        ? createWorkflowFixtureEntities()
        : (await context.entities.scan()).map((file) => file.entity);
      const workflows = verifyWorkflowCoverage(entities);
      return jsonContent({
        ok: workflows.every((workflow) => workflow.ok),
        mode: fixtures ? "fixtures" : "canonical",
        workflows,
      });
    },
  );

  server.tool("studio_list_entities", { kind: z.string().optional() }, async ({ kind }) => {
    const context = await createMcpContext(root);
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
    return jsonContent(entities);
  });
}
