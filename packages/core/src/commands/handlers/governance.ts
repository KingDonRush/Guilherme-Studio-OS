import { DomainCommandService } from "../../domains/commands.js";
import { entityMutationResult } from "../../entity-service.js";
import { optionalString, payloadValue, stringArray, stringValue } from "../payload.js";
import type { StudioCommandDefinition } from "../types.js";

export const governanceCommandDefinitions: Record<string, StudioCommandDefinition> = {
  "agent.start": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).startAgentRun({
        title: optionalString(payload, "title"),
        objective: stringValue(payload, "objective"),
        requestedBy: optionalString(payload, "requested_by"),
        actorId: optionalString(payload, "actor_id") ?? command.actor.id,
        phase: optionalEnum(payload, "phase", [
          "discovery",
          "planning",
          "implementation",
          "stabilization",
          "release",
          "migration",
          "recovery",
        ]),
        risk: optionalEnum(payload, "risk", ["low", "normal", "high", "critical"]),
        model: optionalString(payload, "model"),
        classification: optionalEnum(payload, "classification", [
          "public",
          "internal",
          "confidential",
          "secret",
        ]),
        taskId: optionalString(payload, "task_id"),
        owningEntityIds: stringArray(payload, "owning_entity_ids"),
        targetRepositoryIds: stringArray(payload, "target_repository_ids"),
        targetEnvironmentIds: stringArray(payload, "target_environment_ids"),
        allowed: stringArray(payload, "allowed"),
        confirmationRequired: stringArray(payload, "confirmation_required"),
        prohibited: stringArray(payload, "prohibited"),
        material: optionalBoolean(payload, "material"),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "agent.context": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).buildContextPack({
        runId: runId(command.target_id, payload),
        nextValidAction: optionalString(payload, "next_valid_action"),
        forbiddenReopenings: stringArray(payload, "forbidden_reopenings"),
        workType: optionalEnum(payload, "work_type", ["development"]),
        methodLensAnswers: optionalStringRecord(payload, "method_lens_answers"),
        methodLensNotMaterial: optionalMethodLensAreas(payload, "method_lens_not_material"),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "agent.authorize": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).authorizeAgentRun({
        runId: runId(command.target_id, payload),
        allowed: optionalStringArray(payload, "allowed"),
        confirmationRequired: optionalStringArray(payload, "confirmation_required"),
        prohibited: optionalStringArray(payload, "prohibited"),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "agent.observe": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).recordObservation({
        runId: runId(command.target_id, payload),
        source: enumValue(payload, "source", [
          "git",
          "runtime",
          "user",
          "handoff",
          "docs",
          "code",
          "other",
        ]),
        summary: stringValue(payload, "summary"),
        repositoryId: optionalString(payload, "repository_id"),
        contradictions: stringArray(payload, "contradictions"),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "agent.record-action": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).recordAgentAction({
        runId: runId(command.target_id, payload),
        action: stringValue(payload, "action"),
        status: optionalEnum(payload, "status", ["planned", "executed", "blocked", "failed"]),
        command: optionalString(payload, "command"),
        targetId: optionalString(payload, "target_id"),
        resultSummary: optionalString(payload, "result_summary"),
        evidenceIds: stringArray(payload, "evidence_ids"),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "agent.record-evidence": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).recordAgentEvidence({
        runId: runId(command.target_id, payload),
        evidenceIds: stringArray(payload, "evidence_ids"),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "agent.verify": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).completeVerification({
        runId: runId(command.target_id, payload),
        status: enumValue(payload, "status", ["passed", "failed", "not_run"]),
        command: optionalString(payload, "command"),
        resultSummary: optionalString(payload, "result_summary"),
        artifactPath: optionalString(payload, "artifact_path"),
        notRunReason: optionalString(payload, "not_run_reason"),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "agent.handoff": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).createRunHandoff({
        runId: runId(command.target_id, payload),
        summary: stringValue(payload, "summary"),
        nextValidAction: stringValue(payload, "next_valid_action"),
        gaps: stringArray(payload, "gaps"),
        forbiddenReopenings: stringArray(payload, "forbidden_reopenings"),
        confirmationRequired: stringArray(payload, "confirmation_required"),
        evidenceIds: stringArray(payload, "evidence_ids"),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "agent.close": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).closeAgentRun({
        runId: runId(command.target_id, payload),
        outcome: optionalString(payload, "outcome"),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "knowledge.route": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const rationale = optionalString(payload, "rationale");
      const targetId = optionalString(payload, "target_id");
      const entity = await new DomainCommandService(context).routeKnowledge({
        title: stringValue(payload, "title"),
        content: stringValue(payload, "content"),
        destination: enumValue(payload, "destination", [
          "constitution",
          "prd",
          "decision",
          "entity",
          "workflow",
          "evidence",
          "lesson",
          "temporary_note",
        ]),
        ...(targetId ? { targetId } : {}),
        ...(rationale ? { rationale } : {}),
        evidenceIds: stringArray(payload, "evidence_ids"),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "case.create-from-evidence": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const caseUrl = optionalString(payload, "case_url");
      const summary = optionalString(payload, "summary");
      const entity = await new DomainCommandService(context).createPortfolioCaseFromEvidence({
        evidenceId: stringValue(payload, "evidence_id"),
        title: stringValue(payload, "title"),
        ...(caseUrl ? { caseUrl } : {}),
        ...(summary ? { summary } : {}),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "decision.record": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const rationale = optionalString(payload, "rationale");
      const impact = optionalString(payload, "impact");
      const reversibility = optionalEnum(payload, "reversibility", [
        "reversible",
        "hard_to_reverse",
        "irreversible",
      ]);
      const authoritySource = optionalEnum(payload, "authority_source", [
        "guilherme",
        "agent",
        "policy",
        "evidence",
      ]);
      const authorityOwner = optionalString(payload, "authority_owner_id");
      const confirmationRequired = optionalBoolean(payload, "confirmation_required");
      const entity = await new DomainCommandService(context).recordDecision({
        title: stringValue(payload, "title"),
        decision: stringValue(payload, "decision"),
        ...(rationale ? { rationale } : {}),
        alternatives: stringArray(payload, "alternatives"),
        ...(impact ? { impact } : {}),
        ...(reversibility ? { reversibility } : {}),
        ...(authoritySource || authorityOwner || confirmationRequired !== undefined
          ? {
              authority: {
                ...(authoritySource ? { source: authoritySource } : {}),
                ...(authorityOwner ? { ownerId: authorityOwner } : {}),
                ...(confirmationRequired !== undefined ? { confirmationRequired } : {}),
              },
            }
          : {}),
        contradictionIds: stringArray(payload, "contradiction_ids"),
        evidenceIds: stringArray(payload, "evidence_ids"),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "decision.amend": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const title = optionalString(payload, "title");
      const rationale = optionalString(payload, "rationale");
      const impact = optionalString(payload, "impact");
      const reversibility = optionalEnum(payload, "reversibility", [
        "reversible",
        "hard_to_reverse",
        "irreversible",
      ]);
      const entity = await new DomainCommandService(context).amendDecision({
        decisionId: targetOrPayloadId(command.target_id, payload, "decision_id"),
        ...(title ? { title } : {}),
        decision: stringValue(payload, "decision"),
        ...(rationale ? { rationale } : {}),
        alternatives: stringArray(payload, "alternatives"),
        ...(impact ? { impact } : {}),
        ...(reversibility ? { reversibility } : {}),
        evidenceIds: stringArray(payload, "evidence_ids"),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "learning.propose": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const rationale = optionalString(payload, "rationale");
      const runIdValue = optionalString(payload, "run_id");
      const entity = await new DomainCommandService(context).proposeLearningPromotion({
        title: stringValue(payload, "title"),
        failureClass: stringValue(payload, "failure_class"),
        proposal: stringValue(payload, "proposal"),
        destination: enumValue(payload, "destination", [
          "workflow",
          "schema",
          "test",
          "decision",
          "constitution",
          "repository_instruction",
        ]),
        ...(rationale ? { rationale } : {}),
        ...(runIdValue ? { runId: runIdValue } : {}),
        evidenceIds: stringArray(payload, "evidence_ids"),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "handoff.create": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const repositoryIdValues = payloadValue(payload, "repository_ids");
      const repositoryIds = Array.isArray(repositoryIdValues)
        ? repositoryIdValues.filter((value): value is string => typeof value === "string")
        : [];
      const entity = await new DomainCommandService(context).createHandoff({
        taskId: stringValue(payload, "task_id"),
        title: stringValue(payload, "title"),
        objective: stringValue(payload, "objective"),
        summary: stringValue(payload, "summary"),
        repositoryIds,
      });
      return entityMutationResult(command.command, entity);
    },
  },
};

function runId(targetId: string | undefined, payload: Record<string, unknown>): string {
  return targetId ?? stringValue(payload, "run_id");
}

function targetOrPayloadId(
  targetId: string | undefined,
  payload: Record<string, unknown>,
  key: string,
): string {
  return targetId ?? stringValue(payload, key);
}

function optionalBoolean(payload: Record<string, unknown>, key: string): boolean | undefined {
  const value = payloadValue(payload, key);
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "boolean") {
    throw new Error(`${key} must be a boolean`);
  }
  return value;
}

function optionalStringArray(payload: Record<string, unknown>, key: string): string[] | undefined {
  return payloadValue(payload, key) === undefined ? undefined : stringArray(payload, key);
}

function optionalStringRecord(
  payload: Record<string, unknown>,
  key: string,
): Record<string, string> | undefined {
  const value = payloadValue(payload, key);
  if (value === undefined) {
    return undefined;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${key} must be an object`);
  }
  const result: Record<string, string> = {};
  for (const [entryKey, entryValue] of Object.entries(value)) {
    if (typeof entryValue !== "string") {
      throw new Error(`${key}.${entryKey} must be a string`);
    }
    result[entryKey] = entryValue;
  }
  return result;
}

function optionalMethodLensAreas(
  payload: Record<string, unknown>,
  key: string,
):
  | Array<
      | "lifecycle"
      | "business_value"
      | "requirements_solution"
      | "systems"
      | "software"
      | "governance"
      | "quality_risk_security"
      | "delivery_operations"
      | "knowledge_documentation"
      | "methods_models_practices"
    >
  | undefined {
  const values = optionalStringArray(payload, key);
  if (!values) {
    return undefined;
  }
  const allowed = [
    "lifecycle",
    "business_value",
    "requirements_solution",
    "systems",
    "software",
    "governance",
    "quality_risk_security",
    "delivery_operations",
    "knowledge_documentation",
    "methods_models_practices",
  ] as const;
  for (const value of values) {
    if (!allowed.includes(value as (typeof allowed)[number])) {
      throw new Error(`${key} must contain only: ${allowed.join(", ")}`);
    }
  }
  return values as Array<(typeof allowed)[number]>;
}

function enumValue<const T extends string>(
  payload: Record<string, unknown>,
  key: string,
  allowed: readonly T[],
): T {
  const value = stringValue(payload, key);
  if (!allowed.includes(value as T)) {
    throw new Error(`${key} must be one of: ${allowed.join(", ")}`);
  }
  return value as T;
}

function optionalEnum<const T extends string>(
  payload: Record<string, unknown>,
  key: string,
  allowed: readonly T[],
): T | undefined {
  const value = payloadValue(payload, key);
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new Error(`${key} must be one of: ${allowed.join(", ")}`);
  }
  return value as T;
}
