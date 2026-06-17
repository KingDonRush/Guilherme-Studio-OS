import { createResultEnvelope, type EntityKind } from "@guilherme-studio/schemas";
import { DomainCommandService } from "../../domains/commands.js";
import { entityMutationResult } from "../../entity-service.js";
import { numberValue, optionalString, payloadValue, stringValue } from "../payload.js";
import type { StudioCommandDefinition } from "../types.js";

export const crmCommandDefinitions: Record<string, StudioCommandDefinition> = {
  "crm.review-duplicates": {
    requirement: { capability: "entity.read" },
    handler: async ({ context, command, payload }) => {
      const domains = new DomainCommandService(context);
      const kind = optionalString(payload, "kind");
      const result = await domains.reviewDuplicates({
        ...(kind ? { kind: kind as EntityKind } : {}),
        ...(optionalString(payload, "title") ? { title: stringValue(payload, "title") } : {}),
        ...(optionalString(payload, "email") ? { email: stringValue(payload, "email") } : {}),
        ...(optionalString(payload, "website") ? { website: stringValue(payload, "website") } : {}),
      });
      return createResultEnvelope({ requestId: command.request_id, result });
    },
  },
  "prospect.qualify": {
    requirement: { capability: "entity.transition" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).qualifyProspect(
        command.target_id ?? stringValue(payload, "prospect_id"),
        {
          rationale: stringValue(payload, "rationale"),
          score: numberValue(payload, "score"),
          qualified: payloadValue(payload, "qualified") !== false,
        },
      );
      return entityMutationResult(command.command, entity);
    },
  },
  "communication.prepare": {
    requirement: { capability: "action.prepare" },
    handler: async ({ context, command, payload }) => {
      const action = await new DomainCommandService(context).prepareCommunication({
        subjectId: stringValue(payload, "subject_id"),
        channel: stringValue(payload, "channel"),
        message: stringValue(payload, "message"),
      });
      return createResultEnvelope({ requestId: command.request_id, result: action });
    },
  },
};
