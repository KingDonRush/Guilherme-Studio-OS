import {
  type Capability,
  type CommandEnvelope,
  createResultEnvelope,
  EventSchema,
  type ResultEnvelope,
  type ResultStatus,
} from "@guilherme-studio/schemas";
import { IdempotencyStore } from "./idempotency.js";
import type { StudioContext } from "./index.js";

export interface CommandRequirement {
  capability: Capability;
  classification?: "public" | "internal" | "confidential" | "secret";
}

function classificationLevel(value: string): number {
  return ["public", "internal", "confidential", "secret"].indexOf(value);
}

export function classifyStudioError(error: unknown): {
  status: ResultStatus;
  code: string;
  message: string;
} {
  const message = error instanceof Error ? error.message : String(error);
  if (/revision conflict|changed after/i.test(message)) {
    return { status: "conflict", code: "revision_conflict", message };
  }
  if (/confirmation|must be confirmed|payload checksum/i.test(message)) {
    return { status: "confirmation_required", code: "confirmation_required", message };
  }
  if (/lacks capability|classification ceiling|invalid .* transition|secret/i.test(message)) {
    return { status: "blocked", code: "authority_block", message };
  }
  if (/not found|required|invalid|unknown/i.test(message)) {
    return { status: "error", code: "invalid_input", message };
  }
  return { status: "error", code: "internal_error", message };
}

export class StudioCommandService {
  readonly idempotency: IdempotencyStore;

  constructor(readonly context: StudioContext) {
    this.idempotency = new IdempotencyStore(context.paths.runtime);
  }

  async execute(
    command: CommandEnvelope,
    requirement: CommandRequirement,
    operation: () => Promise<ResultEnvelope>,
  ): Promise<ResultEnvelope> {
    try {
      this.authorize(command, requirement);
      if (command.target_id && command.expected_revision !== undefined) {
        const current = await this.context.entities.get(command.target_id);
        if (!current) {
          throw new Error(`Entity not found: ${command.target_id}`);
        }
        if (current.entity.metadata.revision !== command.expected_revision) {
          throw new Error(
            `Revision conflict for ${command.target_id}: expected ${command.expected_revision}, got ${current.entity.metadata.revision}`,
          );
        }
      }
      const execution = await this.idempotency.execute(command, async () => {
        const result = await operation();
        return createResultEnvelope({
          requestId: command.request_id,
          status: result.status,
          result: result.result,
          warnings: result.warnings,
          requiredActions: result.required_actions,
          evidence: result.evidence,
          projectionRevision: this.context.projection.inspect().projectionRevision ?? 0,
          ...(result.error ? { error: result.error } : {}),
        });
      });
      await this.context.events.append(
        EventSchema.parse({
          id: `evt_${command.id.slice(4)}`,
          type: execution.replayed ? "command.replayed" : "command.completed",
          request_id: command.request_id,
          command_id: command.id,
          correlation_id: command.request_id,
          entity_id: command.target_id,
          actor_id: command.actor.id,
          created_at: new Date().toISOString(),
          classification: requirement.classification ?? "internal",
          data: {
            command: command.command,
            status: execution.result.status,
            replayed: execution.replayed,
          },
        }),
      );
      return execution.result;
    } catch (error) {
      const classified = classifyStudioError(error);
      return createResultEnvelope({
        requestId: command.request_id,
        status: classified.status,
        requiredActions:
          classified.status === "confirmation_required" ? ["confirm_exact_payload"] : [],
        error: {
          code: classified.code,
          message: classified.message,
          details: {},
        },
        projectionRevision: this.context.projection.inspect().projectionRevision ?? 0,
      });
    }
  }

  private authorize(command: CommandEnvelope, requirement: CommandRequirement): void {
    const actor = command.actor;
    if (actor.expires_at && Date.parse(actor.expires_at) <= Date.now()) {
      throw new Error(`Actor delegation expired: ${actor.id}`);
    }
    if (!actor.capabilities.includes(requirement.capability)) {
      throw new Error(`Actor ${actor.id} lacks capability ${requirement.capability}`);
    }
    const requested = requirement.classification ?? "internal";
    if (classificationLevel(requested) > classificationLevel(actor.classification_ceiling)) {
      throw new Error(`Actor ${actor.id} classification ceiling does not allow ${requested}`);
    }
  }
}
