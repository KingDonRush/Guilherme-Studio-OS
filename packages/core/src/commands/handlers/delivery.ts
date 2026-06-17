import { createResultEnvelope } from "@guilherme-studio/schemas";
import { DomainCommandService } from "../../domains/commands.js";
import { entityMutationResult } from "../../entity-service.js";
import { optionalString, stringArray, stringValue } from "../payload.js";
import type { StudioCommandDefinition } from "../types.js";

export const deliveryCommandDefinitions: Record<string, StudioCommandDefinition> = {
  "deliverable.complete": {
    requirement: { capability: "entity.transition" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).completeDeliverable({
        deliverableId: command.target_id ?? stringValue(payload, "deliverable_id"),
        evidenceIds: stringArray(payload, "evidence_ids"),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "project.register-repo": {
    requirement: { capability: "repository.mutate" },
    handler: async ({ context, command, payload }) => {
      const remotePolicy = optionalString(payload, "remote_policy");
      const branch = optionalString(payload, "branch");
      const result = await new DomainCommandService(context).registerProjectRepository({
        projectId: stringValue(payload, "project_id"),
        title: stringValue(payload, "title"),
        repositoryPath: stringValue(payload, "repository_path"),
        ...(branch ? { branch } : {}),
        ...(remotePolicy
          ? {
              remotePolicy: remotePolicy as "allowed" | "forbidden" | "no-remote-in-v1",
            }
          : {}),
      });
      return createResultEnvelope({ requestId: command.request_id, result });
    },
  },
};
