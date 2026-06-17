import type { Actor } from "../classification.js";
import { createRecordId, nowIso } from "../ids.js";
import { type CommandEnvelope, CommandEnvelopeSchema } from "./command.js";
import {
  type EvidenceReference,
  type ResultEnvelope,
  ResultEnvelopeSchema,
  type ResultStatus,
  type StudioError,
} from "./result.js";

export function createCommandEnvelope(input: {
  command: string;
  actor: Actor;
  payload?: Record<string, unknown>;
  targetId?: string;
  expectedRevision?: number;
  idempotencyKey?: string;
  dryRun?: boolean;
  requestId?: string;
}): CommandEnvelope {
  const createdAt = nowIso();
  const requestId = input.requestId ?? createRecordId("req");
  return CommandEnvelopeSchema.parse({
    id: createRecordId("cmd", `${requestId}:${input.command}`),
    request_id: requestId,
    command: input.command,
    actor: input.actor,
    target_id: input.targetId,
    expected_revision: input.expectedRevision,
    idempotency_key: input.idempotencyKey,
    dry_run: input.dryRun ?? false,
    payload: input.payload ?? {},
    created_at: createdAt,
  });
}
export function createResultEnvelope(input: {
  requestId?: string;
  status?: ResultStatus;
  result?: unknown;
  warnings?: string[];
  requiredActions?: string[];
  evidence?: EvidenceReference[];
  projectionRevision?: number;
  error?: StudioError;
}): ResultEnvelope {
  return ResultEnvelopeSchema.parse({
    request_id: input.requestId ?? createRecordId("req"),
    status: input.status ?? "ok",
    result: input.result ?? null,
    warnings: input.warnings ?? [],
    required_actions: input.requiredActions ?? [],
    evidence: input.evidence ?? [],
    projection_revision: input.projectionRevision ?? 0,
    error: input.error,
  });
}
