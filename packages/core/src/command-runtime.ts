import {
  type CommandEnvelope,
  createResultEnvelope,
  type ResultEnvelope,
} from "@guilherme-studio/schemas";
import { StudioCommandService } from "./command-service.js";
import { getStudioCommandDefinition } from "./commands/registry.js";
import type { StudioContext } from "./context.js";

export async function executeStudioCommand(
  context: StudioContext,
  command: CommandEnvelope,
): Promise<ResultEnvelope> {
  const definition = getStudioCommandDefinition(command.command);
  if (!definition) {
    return createResultEnvelope({
      requestId: command.request_id,
      status: "error",
      error: {
        code: "unknown_command",
        message: `Unknown Studio command: ${command.command}`,
        details: {},
      },
    });
  }

  return new StudioCommandService(context).execute(command, definition.requirement, async () => {
    if (command.dry_run) {
      return createResultEnvelope({
        requestId: command.request_id,
        result: {
          dry_run: true,
          command: command.command,
          target_id: command.target_id ?? null,
          payload: command.payload,
        },
      });
    }
    return definition.handler({ context, command, payload: command.payload });
  });
}
