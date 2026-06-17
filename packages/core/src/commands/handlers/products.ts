import { DomainCommandService } from "../../domains/commands.js";
import { entityMutationResult } from "../../entity-service.js";
import { optionalString, stringArray, stringValue } from "../payload.js";
import type { StudioCommandDefinition } from "../types.js";

export const productCommandDefinitions: Record<string, StudioCommandDefinition> = {
  "release.prepare": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).prepareRelease(
        stringValue(payload, "product_id"),
        stringValue(payload, "version"),
      );
      return entityMutationResult(command.command, entity);
    },
  },
  "release.publish": {
    requirement: { capability: "entity.transition" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).publishRelease({
        releaseId: command.target_id ?? stringValue(payload, "release_id"),
        evidenceIds: stringArray(payload, "evidence_ids"),
        ...(optionalString(payload, "demo_url")
          ? { demoUrl: stringValue(payload, "demo_url") }
          : {}),
      });
      return entityMutationResult(command.command, entity);
    },
  },
};
