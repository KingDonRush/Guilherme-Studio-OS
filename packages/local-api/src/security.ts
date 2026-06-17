import { createResultEnvelope } from "@guilherme-studio/schemas";
import type { FastifyInstance } from "fastify";
import type { LocalApiContext } from "./types.js";

export function registerLocalApiSecurity(
  app: FastifyInstance,
  context: LocalApiContext,
  token: string,
): void {
  const sessionExpiresAt = Date.now() + 8 * 60 * 60 * 1000;

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
}
