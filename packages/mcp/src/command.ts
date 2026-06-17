import {
  createStudioCommand,
  createStudioContext,
  executeStudioCommand,
  operatorActor,
  type StudioContext,
} from "@guilherme-studio/core";

export interface McpCommandInput {
  command: string;
  payload: Record<string, unknown>;
  targetId?: string;
  expectedRevision?: number;
  idempotencyKey?: string;
  dryRun?: boolean;
}

export function createMcpContext(root: string): Promise<StudioContext> {
  return createStudioContext(root);
}

export async function executeMcpCommand(root: string, input: McpCommandInput): Promise<unknown> {
  const context = await createStudioContext(root);
  return executeStudioCommand(
    context,
    createStudioCommand(context, {
      command: input.command,
      actor: operatorActor(context.config.operator_id),
      payload: input.payload,
      ...(input.targetId ? { targetId: input.targetId } : {}),
      ...(input.expectedRevision !== undefined ? { expectedRevision: input.expectedRevision } : {}),
      ...(input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : {}),
      dryRun: input.dryRun === true,
    }),
  );
}
