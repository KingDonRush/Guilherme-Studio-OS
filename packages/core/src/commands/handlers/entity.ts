import type { Classification, EntityKind, LifecycleState } from "@guilherme-studio/schemas";
import { EntityService, entityMutationResult } from "../../entity-service.js";
import { optionalString, stringValue } from "../payload.js";
import type { StudioCommandDefinition } from "../types.js";

export const entityCommandDefinitions: Record<string, StudioCommandDefinition> = {
  "entity.create": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const summary = optionalString(payload, "summary");
      const entity = await new EntityService(context).create({
        kind: stringValue(payload, "kind") as EntityKind,
        title: stringValue(payload, "title"),
        ...(summary ? { summary } : {}),
        classification:
          (optionalString(payload, "classification") as Classification | undefined) ?? "internal",
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "entity.transition": {
    requirement: { capability: "entity.transition" },
    handler: async ({ context, command, payload }) => {
      const entity = await new EntityService(context).transition(
        command.target_id ?? stringValue(payload, "id"),
        stringValue(payload, "status") as LifecycleState,
      );
      return entityMutationResult(command.command, entity);
    },
  },
};
