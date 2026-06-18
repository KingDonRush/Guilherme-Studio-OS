import { inspectStudioRepositories } from "@guilherme-studio/adapters";
import {
  buildAgentHarnessReport,
  EconomicNextActionResolver,
  evaluatePrdCoverage,
  executeWorkflowFixtures,
  PreparedActionService,
  validateStudio,
} from "@guilherme-studio/core";
import {
  createResultEnvelope,
  entityId,
  entityStatus,
  entityTitle,
} from "@guilherme-studio/schemas";
import { validateCanonicalFiles } from "@guilherme-studio/storage";
import type { FastifyInstance } from "fastify";
import { buildLocalAcceptanceReport } from "../acceptance.js";
import type { LocalApiContext } from "../types.js";

export function registerReadRoutes(app: FastifyInstance, context: LocalApiContext): void {
  app.get("/favicon.ico", async (_request, reply) => reply.code(204).send());

  app.get("/api/v1/summary", async () => {
    const validation = await validateStudio(context.paths.root);
    const { files } = await validateCanonicalFiles(context.paths.root);
    const byKind = Object.fromEntries(
      [...new Set(files.map((file) => file.entity.kind))]
        .sort((a, b) => a.localeCompare(b))
        .map((kind) => [kind, files.filter((file) => file.entity.kind === kind).length]),
    );
    return {
      ok: validation.ok,
      entityCount: files.length,
      byKind,
      operatorId: context.config.operator_id,
      root: context.paths.root,
      projectionRevision: context.projection.inspect().projectionRevision ?? 0,
      nextActions: new EconomicNextActionResolver()
        .rank(files.map((file) => file.entity))
        .slice(0, 5),
    };
  });

  app.get("/api/v1/entities", async () => {
    const { files } = await validateCanonicalFiles(context.paths.root);
    return files.map((file) => ({
      id: entityId(file.entity),
      kind: file.entity.kind,
      title: entityTitle(file.entity),
      status: entityStatus(file.entity),
      path: file.relativePath,
    }));
  });

  app.get<{ Params: { id: string } }>("/api/v1/entities/:id", async (request, reply) => {
    const file = await context.entities.get(request.params.id);
    if (!file) {
      return reply.code(404).send(
        createResultEnvelope({
          status: "error",
          error: {
            code: "entity_not_found",
            message: `Entity not found: ${request.params.id}`,
            details: {},
          },
        }),
      );
    }
    return createResultEnvelope({
      result: {
        entity: file.entity,
        path: file.relativePath,
      },
      projectionRevision: context.projection.inspect().projectionRevision ?? 0,
    });
  });

  app.get("/api/v1/next-actions", async () => {
    const { files } = await validateCanonicalFiles(context.paths.root);
    return createResultEnvelope({
      result: new EconomicNextActionResolver().rank(files.map((file) => file.entity)),
      projectionRevision: context.projection.inspect().projectionRevision ?? 0,
    });
  });

  app.get("/api/v1/coverage", async () => {
    const { files } = await validateCanonicalFiles(context.paths.root);
    return createResultEnvelope({
      result: evaluatePrdCoverage(files.map((file) => file.entity)),
      projectionRevision: context.projection.inspect().projectionRevision ?? 0,
    });
  });

  app.get("/api/v1/workflows", async () =>
    createResultEnvelope({
      result: await executeWorkflowFixtures(),
      projectionRevision: context.projection.inspect().projectionRevision ?? 0,
    }),
  );

  app.get("/api/v1/acceptance", async () => {
    const report = await buildLocalAcceptanceReport(context);
    return createResultEnvelope({
      status: report.ok ? "ok" : "blocked",
      result: report,
      requiredActions: report.portfolio_release.allowed
        ? []
        : ["resolve_acceptance_blockers_before_portfolio"],
      projectionRevision: context.projection.inspect().projectionRevision ?? 0,
    });
  });

  app.get("/api/v1/events", async () =>
    createResultEnvelope({
      result: await context.events.list(),
      projectionRevision: context.projection.inspect().projectionRevision ?? 0,
    }),
  );

  app.get("/api/v1/diagnostics", async () => {
    const validation = await validateStudio(context.paths.root);
    return createResultEnvelope({
      status: validation.ok ? "ok" : "warning",
      result: {
        validation,
        projection: context.projection.inspect(),
        pending_transactions: await context.entities.pendingTransactions(),
        locks: await context.entities.inspectLocks(),
        repositories: await inspectStudioRepositories(context),
      },
      projectionRevision: context.projection.inspect().projectionRevision ?? 0,
    });
  });

  app.get("/api/v1/prepared-actions", async () => new PreparedActionService(context).list());

  app.get("/api/v1/agent-runs", async () => {
    const { files } = await validateCanonicalFiles(context.paths.root);
    return createResultEnvelope({
      result: buildAgentHarnessReport(files.map((file) => file.entity)),
      projectionRevision: context.projection.inspect().projectionRevision ?? 0,
    });
  });

  app.get<{ Params: { id: string } }>(
    "/api/v1/agent-runs/:id/context-pack",
    async (request, reply) => {
      const { files } = await validateCanonicalFiles(context.paths.root);
      const report = buildAgentHarnessReport(files.map((file) => file.entity));
      const contextPack = report.context_packs.find((pack) => pack.run_id === request.params.id);
      if (!contextPack) {
        return reply.code(404).send(
          createResultEnvelope({
            status: "error",
            error: {
              code: "context_pack_not_found",
              message: `Context pack not found for agent run: ${request.params.id}`,
              details: {},
            },
            projectionRevision: context.projection.inspect().projectionRevision ?? 0,
          }),
        );
      }
      return createResultEnvelope({
        result: contextPack,
        projectionRevision: context.projection.inspect().projectionRevision ?? 0,
      });
    },
  );

  app.get<{ Params: { id: string } }>("/api/v1/agent-runs/:id/handoff", async (request, reply) => {
    const { files } = await validateCanonicalFiles(context.paths.root);
    const report = buildAgentHarnessReport(files.map((file) => file.entity));
    const handoff = report.handoffs.find((item) => item.run_id === request.params.id);
    if (!handoff) {
      return reply.code(404).send(
        createResultEnvelope({
          status: "error",
          error: {
            code: "handoff_not_found",
            message: `Handoff not found for agent run: ${request.params.id}`,
            details: {},
          },
          projectionRevision: context.projection.inspect().projectionRevision ?? 0,
        }),
      );
    }
    return createResultEnvelope({
      result: handoff,
      projectionRevision: context.projection.inspect().projectionRevision ?? 0,
    });
  });

  app.get("/api/v1/repositories", async () => inspectStudioRepositories(context));
}
