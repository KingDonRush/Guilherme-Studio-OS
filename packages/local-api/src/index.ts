import crypto from "node:crypto";
import path from "node:path";
import cookie from "@fastify/cookie";
import fastifyStatic from "@fastify/static";
import { inspectStudioRepositories } from "@guilherme-studio/adapters";
import {
  createStudioCommand,
  createStudioContext,
  EconomicNextActionResolver,
  evaluatePrdCoverage,
  evaluateStudioAcceptance,
  executeStudioCommand,
  executeWorkflowFixtures,
  kindFromAlias,
  operatorActor,
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
import Fastify, { type FastifyInstance } from "fastify";

export interface LocalApiOptions {
  root?: string;
  panelDist?: string;
}

export async function createLocalApi(
  options: LocalApiOptions = {},
): Promise<{ app: FastifyInstance; token: string }> {
  const context = await createStudioContext(options.root);
  const token = crypto.randomBytes(24).toString("hex");
  const sessionExpiresAt = Date.now() + 8 * 60 * 60 * 1000;
  const app = Fastify({ logger: false, bodyLimit: 1024 * 1024 });
  await app.register(cookie);

  app.addHook("onRequest", async (request, reply) => {
    const host = request.headers.host ?? "";
    const allowedHost = `${context.config.panel.host}:${context.config.panel.port}`;
    if (host !== allowedHost && host !== context.config.panel.host) {
      await reply.code(403).send({ error: "Invalid host" });
      return;
    }
    const origin = request.headers.origin;
    if (origin && origin !== `http://${allowedHost}`) {
      await reply.code(403).send({ error: "Invalid origin" });
      return;
    }
    if (!request.url.startsWith("/api/")) {
      reply.setCookie("studio_session", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        path: "/",
        maxAge: 8 * 60 * 60,
      });
      return;
    }
    if (Date.now() >= sessionExpiresAt) {
      await reply.code(401).send({ error: "Session expired" });
      return;
    }
    const bearer = request.headers.authorization === `Bearer ${token}`;
    const { studio_session: studioSession } = request.cookies;
    const cookieAuth = studioSession === token;
    if (!bearer && !cookieAuth) {
      await reply.code(401).send({ error: "Unauthorized" });
    }
  });

  app.setErrorHandler((error, _request, reply) => {
    const normalizedError = error as { statusCode?: number; message?: string };
    const statusCode =
      normalizedError.statusCode && normalizedError.statusCode >= 400
        ? normalizedError.statusCode
        : 500;
    return reply.code(statusCode).send(
      createResultEnvelope({
        status: statusCode >= 500 ? "error" : "blocked",
        error: {
          code: statusCode >= 500 ? "internal_error" : "request_rejected",
          message: normalizedError.message ?? "Unexpected local API error",
          details: {},
        },
        projectionRevision: context.projection.inspect().projectionRevision ?? 0,
      }),
    );
  });

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

  app.get("/api/v1/workflows", async () => {
    return createResultEnvelope({
      result: await executeWorkflowFixtures(),
      projectionRevision: context.projection.inspect().projectionRevision ?? 0,
    });
  });

  app.get("/api/v1/acceptance", async () => {
    const validation = await validateStudio(context.paths.root);
    const { files } = await validateCanonicalFiles(context.paths.root);
    const coverage = evaluatePrdCoverage(files.map((file) => file.entity));
    const workflows = await executeWorkflowFixtures();
    const repositories = await inspectStudioRepositories(context);
    const repositoryBlocks = repositories.filter(
      (repository) =>
        repository.isDirty ||
        repository.rootMismatch ||
        repository.expectedBranchViolation ||
        repository.remotePolicyViolation,
    );
    const { readdir } = await import("node:fs/promises");
    let backups: string[] = [];
    try {
      backups = (await readdir(path.join(context.paths.runtime, "backups"))).filter((entry) =>
        entry.endsWith(".manifest.json"),
      );
    } catch {
      backups = [];
    }
    const explicitDeferralsOk = files.some((file) => {
      if (file.entity.kind !== "decision") {
        return false;
      }
      const decision = Reflect.get(file.entity.spec, "decision");
      return typeof decision === "string" && /defer|deferred|diferid/i.test(decision);
    });
    const report = evaluateStudioAcceptance({
      coverage,
      workflowOk: workflows.ok,
      workflowFailures: workflows.workflows
        .filter((workflow) => !workflow.ok)
        .map((workflow) => workflow.id),
      validationOk: validation.ok,
      repositoryOk: repositoryBlocks.length === 0,
      backupOk: backups.length > 0,
      explicitDeferralsOk,
      detail: {
        repositories: repositoryBlocks,
        backup: { manifest_count: backups.length, latest: backups.sort().at(-1) ?? null },
      },
    });
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

  const runCommand = async (body: {
    command?: unknown;
    target_id?: unknown;
    expected_revision?: unknown;
    idempotency_key?: unknown;
    payload?: unknown;
    dry_run?: unknown;
  }) => {
    if (typeof body.command !== "string") {
      return createResultEnvelope({
        status: "error",
        error: { code: "invalid_input", message: "command is required", details: {} },
      });
    }
    const payload =
      body.payload && typeof body.payload === "object" && !Array.isArray(body.payload)
        ? (body.payload as Record<string, unknown>)
        : {};
    const command = createStudioCommand(context, {
      command: body.command,
      actor: operatorActor(context.config.operator_id),
      payload,
      ...(typeof body.target_id === "string" ? { targetId: body.target_id } : {}),
      ...(typeof body.expected_revision === "number"
        ? { expectedRevision: body.expected_revision }
        : {}),
      ...(typeof body.idempotency_key === "string" ? { idempotencyKey: body.idempotency_key } : {}),
      dryRun: body.dry_run === true,
    });
    return executeStudioCommand(context, command);
  };

  app.post<{ Body: Record<string, unknown> }>("/api/v1/commands/dry-run", async (request) =>
    runCommand({ ...request.body, dry_run: true }),
  );

  app.post<{ Body: Record<string, unknown> }>("/api/v1/commands/execute", async (request) =>
    runCommand({ ...request.body, dry_run: false }),
  );

  app.post<{
    Body: {
      kind: string;
      title: string;
      summary?: string;
      classification?: "public" | "internal" | "confidential";
    };
  }>("/api/v1/entities", async (request, reply) => {
    const body = request.body;
    if (!body || typeof body.kind !== "string" || typeof body.title !== "string") {
      return reply.code(400).send({ ok: false, errors: ["kind and title are required"] });
    }
    return runCommand({
      command: "entity.create",
      payload: {
        kind: kindFromAlias(body.kind),
        title: body.title,
        classification: body.classification ?? "internal",
        ...(body.summary ? { summary: body.summary } : {}),
      },
    });
  });

  app.get("/api/v1/prepared-actions", async () => {
    return new PreparedActionService(context).list();
  });

  app.get("/api/v1/repositories", async () => {
    return inspectStudioRepositories(context);
  });

  app.post<{
    Body: { action_type: string; payload: Record<string, unknown>; ttl_seconds?: number };
  }>("/api/v1/prepared-actions", async (request, reply) => {
    const body = request.body;
    if (
      !body ||
      typeof body.action_type !== "string" ||
      !body.payload ||
      typeof body.payload !== "object"
    ) {
      return reply.code(400).send({ ok: false, errors: ["action_type and payload are required"] });
    }
    return runCommand({
      command: "action.prepare",
      payload: {
        action_type: body.action_type,
        payload: body.payload,
        ...(body.ttl_seconds ? { ttl_seconds: body.ttl_seconds } : {}),
      },
    });
  });

  app.post<{
    Params: { id: string };
    Body: { payload_checksum: string };
  }>("/api/v1/prepared-actions/:id/confirm", async (request, reply) => {
    if (!request.body || typeof request.body.payload_checksum !== "string") {
      return reply.code(400).send({ ok: false, errors: ["payload_checksum is required"] });
    }
    return runCommand({
      command: "action.confirm",
      payload: {
        action_id: request.params.id,
        payload_checksum: request.body.payload_checksum,
      },
    });
  });

  app.post<{
    Params: { id: string };
    Body: { rationale: string; score: number; qualified?: boolean };
  }>("/api/v1/prospects/:id/qualify", async (request, reply) => {
    if (
      !request.body ||
      typeof request.body.rationale !== "string" ||
      typeof request.body.score !== "number"
    ) {
      return reply.code(400).send({ ok: false, errors: ["rationale and score are required"] });
    }
    return runCommand({
      command: "prospect.qualify",
      target_id: request.params.id,
      payload: {
        rationale: request.body.rationale,
        score: request.body.score,
        qualified: request.body.qualified ?? true,
      },
    });
  });

  app.post<{
    Body: {
      title: string;
      evidence_type: "file" | "url" | "command" | "screenshot" | "backup" | "decision" | "manual";
      subject_id?: string;
      path?: string;
      url?: string;
      command?: string;
      checksum?: string;
    };
  }>("/api/v1/evidence", async (request, reply) => {
    if (!request.body || typeof request.body.title !== "string") {
      return reply.code(400).send({ ok: false, errors: ["title is required"] });
    }
    const body = request.body;
    return runCommand({
      command: "evidence.register",
      payload: {
        title: body.title,
        evidence_type: body.evidence_type,
        ...(body.subject_id ? { subject_id: body.subject_id } : {}),
        ...(body.path ? { path: body.path } : {}),
        ...(body.url ? { url: body.url } : {}),
        ...(body.command ? { command: body.command } : {}),
        ...(body.checksum ? { checksum: body.checksum } : {}),
      },
    });
  });

  if (options.panelDist) {
    await app.register(fastifyStatic, {
      root: path.resolve(options.panelDist),
      prefix: "/",
      index: "index.html",
      list: false,
    });
  }

  return { app, token };
}

export async function serveLocalApi(options: LocalApiOptions = {}): Promise<{
  app: FastifyInstance;
  token: string;
  url: string;
}> {
  const context = await createStudioContext(options.root);
  const { app, token } = await createLocalApi(options);
  await app.listen({
    host: context.config.panel.host,
    port: context.config.panel.port,
  });
  return {
    app,
    token,
    url: `http://${context.config.panel.host}:${context.config.panel.port}`,
  };
}
