import crypto from "node:crypto";
import path from "node:path";
import cookie from "@fastify/cookie";
import fastifyStatic from "@fastify/static";
import { inspectStudioRepositories } from "@guilherme-studio/adapters";
import {
  createStudioContext,
  EntityService,
  entityMutationResult,
  kindFromAlias,
  PreparedActionService,
  validateStudio,
} from "@guilherme-studio/core";
import { entityId, entityStatus, entityTitle } from "@guilherme-studio/schemas";
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
  const app = Fastify({ logger: false });
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
        httpOnly: false,
        sameSite: "strict",
        secure: false,
        path: "/",
      });
      return;
    }
    const bearer = request.headers.authorization === `Bearer ${token}`;
    const { studio_session: studioSession } = request.cookies;
    const cookieAuth = studioSession === token;
    if (!bearer && !cookieAuth) {
      await reply.code(401).send({ error: "Unauthorized" });
    }
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
    const entity = await new EntityService(context).create({
      kind: kindFromAlias(body.kind),
      title: body.title,
      classification: body.classification ?? "internal",
      ...(body.summary ? { summary: body.summary } : {}),
    });
    return entityMutationResult("entity.create", entity);
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
    return new PreparedActionService(context).prepare({
      actionType: body.action_type,
      payload: body.payload,
      ...(body.ttl_seconds ? { ttlSeconds: body.ttl_seconds } : {}),
    });
  });

  app.post<{
    Params: { id: string };
    Body: { payload_checksum: string };
  }>("/api/v1/prepared-actions/:id/confirm", async (request, reply) => {
    if (!request.body || typeof request.body.payload_checksum !== "string") {
      return reply.code(400).send({ ok: false, errors: ["payload_checksum is required"] });
    }
    return new PreparedActionService(context).confirm(
      request.params.id,
      request.body.payload_checksum,
    );
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
