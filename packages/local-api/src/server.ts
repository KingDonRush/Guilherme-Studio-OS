import crypto from "node:crypto";
import path from "node:path";
import cookie from "@fastify/cookie";
import fastifyStatic from "@fastify/static";
import { createStudioContext } from "@guilherme-studio/core";
import Fastify from "fastify";
import { createLocalCommandRunner } from "./command-runner.js";
import { registerMutationRoutes } from "./routes/mutations.js";
import { registerReadRoutes } from "./routes/read.js";
import { registerLocalApiSecurity } from "./security.js";
import type { LocalApiInstance, LocalApiOptions } from "./types.js";

export async function createLocalApi(options: LocalApiOptions = {}): Promise<LocalApiInstance> {
  const context = await createStudioContext(options.root);
  const token = crypto.randomBytes(24).toString("hex");
  const app = Fastify({ logger: false, bodyLimit: 1024 * 1024 });
  await app.register(cookie);

  registerLocalApiSecurity(app, context, token);
  registerReadRoutes(app, context);
  registerMutationRoutes(app, createLocalCommandRunner(context));

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
  app: LocalApiInstance["app"];
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
