import crypto from "node:crypto";
import path from "node:path";
import cookie from "@fastify/cookie";
import fastifyStatic from "@fastify/static";
import { createStudioContext, validateStudio } from "@guilherme-studio/core";
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

  app.get("/api/v1/summary", async () => {
    const validation = await validateStudio(context.paths.root);
    const { files } = await validateCanonicalFiles(context.paths.root);
    return {
      ok: validation.ok,
      entityCount: files.length,
      operatorId: context.config.operator_id,
      root: context.paths.root,
    };
  });

  app.get("/api/v1/entities", async () => {
    const { files } = await validateCanonicalFiles(context.paths.root);
    return files.map((file) => ({
      id: file.entity.id,
      kind: file.entity.kind,
      title: file.entity.title,
      status: file.entity.status,
      path: file.relativePath,
    }));
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
