import type { CommandEnvelope, ResultEnvelope } from "@guilherme-studio/schemas";
import type { CommandRequirement } from "../command-service.js";
import type { StudioContext } from "../context.js";

export interface CommandHandlerInput {
  context: StudioContext;
  command: CommandEnvelope;
  payload: Record<string, unknown>;
}

export type StudioCommandHandler = (input: CommandHandlerInput) => Promise<ResultEnvelope>;

export interface StudioCommandDefinition {
  requirement: CommandRequirement;
  handler: StudioCommandHandler;
}
