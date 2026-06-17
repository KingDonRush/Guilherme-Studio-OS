import type { StudioContext } from "@guilherme-studio/core";
import type { FastifyInstance } from "fastify";

export interface LocalApiOptions {
  root?: string;
  panelDist?: string;
}

export interface LocalApiInstance {
  app: FastifyInstance;
  token: string;
}

export type LocalApiContext = StudioContext;
