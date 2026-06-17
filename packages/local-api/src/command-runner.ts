import {
  createStudioCommand,
  executeStudioCommand,
  kindFromAlias,
  operatorActor,
} from "@guilherme-studio/core";
import { createResultEnvelope } from "@guilherme-studio/schemas";
import type { LocalApiContext } from "./types.js";

export interface LocalApiCommandBody {
  command?: unknown;
  target_id?: unknown;
  expected_revision?: unknown;
  idempotency_key?: unknown;
  payload?: unknown;
  dry_run?: unknown;
}

export type LocalCommandRunner = (body: LocalApiCommandBody) => Promise<unknown>;

export function createLocalCommandRunner(context: LocalApiContext): LocalCommandRunner {
  return async (body) => {
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
}

export function normalizeEntityKind(kind: string): string {
  return kindFromAlias(kind);
}
