import {
  classifyStudioError,
  createStudioCommand,
  createStudioContext,
  executeStudioCommand,
  operatorActor,
} from "@guilherme-studio/core";
import { createActor, createResultEnvelope, type ResultEnvelope } from "@guilherme-studio/schemas";
import type { Command } from "commander";

export interface GlobalOptions {
  root?: string;
  json?: boolean;
  dryRun?: boolean;
  quiet?: boolean;
  verbose?: boolean;
  actor?: string;
  idempotencyKey?: string;
  expectedRevision?: string;
  yes?: boolean;
}

export function print(value: unknown, json = false, quiet = false): void {
  if (quiet) {
    return;
  }
  if (json) {
    console.log(JSON.stringify(value, null, 2));
    return;
  }
  if (typeof value === "string") {
    console.log(value);
    return;
  }
  console.log(JSON.stringify(value, null, 2));
}

export function exitCodeForEnvelope(result: ResultEnvelope): number {
  switch (result.status) {
    case "ok":
    case "warning":
      return 0;
    case "confirmation_required":
      return 5;
    case "blocked":
      return 4;
    case "conflict":
      return 6;
    case "error":
      return result.error?.code === "invalid_input" ? 2 : 10;
  }
}

export function globalOptions(command: Command): GlobalOptions {
  return command.optsWithGlobals<GlobalOptions>();
}

export async function executeCliCommand(
  options: GlobalOptions,
  command: string,
  payload: Record<string, unknown>,
  targetId?: string,
): Promise<ResultEnvelope> {
  try {
    const context = await createStudioContext(options.root);
    const actor =
      !options.actor || options.actor === context.config.operator_id
        ? operatorActor(context.config.operator_id)
        : createActor({
            id: options.actor,
            type: "agent",
            capabilities: ["entity.read", "repository.inspect", "environment.inspect"],
            classification_ceiling: "internal",
          });
    const envelope = createStudioCommand(context, {
      command,
      actor,
      payload,
      ...(targetId ? { targetId } : {}),
      ...(options.expectedRevision
        ? { expectedRevision: parseExpectedRevision(options.expectedRevision) }
        : {}),
      ...(options.idempotencyKey ? { idempotencyKey: options.idempotencyKey } : {}),
      dryRun: options.dryRun ?? false,
    });
    const result = await executeStudioCommand(context, envelope);
    process.exitCode = exitCodeForEnvelope(result);
    print(result, options.json, options.quiet);
    return result;
  } catch (error) {
    const classified = classifyStudioError(error);
    const result = createResultEnvelope({
      status: classified.status,
      error: {
        code: classified.code,
        message: classified.message,
        details: {},
      },
    });
    process.exitCode = exitCodeForEnvelope(result);
    print(result, options.json, options.quiet);
    return result;
  }
}

function parseExpectedRevision(value: string): number {
  const revision = Number(value);
  if (!Number.isInteger(revision) || revision < 1) {
    throw new Error(`Invalid expected revision: ${value}. Expected a positive integer.`);
  }
  return revision;
}

export function pathJoin(root: string, relativeOrAbsolute: string): string {
  if (relativeOrAbsolute.startsWith("/")) {
    return relativeOrAbsolute;
  }
  return `${root.replace(/\/$/, "")}/${relativeOrAbsolute}`;
}
