import { DomainCommandService } from "../../domains/commands.js";
import { entityMutationResult } from "../../entity-service.js";
import { optionalString, payloadValue, stringArray, stringValue } from "../payload.js";
import type { StudioCommandDefinition } from "../types.js";

export const governanceCommandDefinitions: Record<string, StudioCommandDefinition> = {
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
      const entity = await new DomainCommandService(context).recordDecision({
        title: stringValue(payload, "title"),
        decision: stringValue(payload, "decision"),
        ...(optionalString(payload, "rationale")
          ? { rationale: stringValue(payload, "rationale") }
          : {}),
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
