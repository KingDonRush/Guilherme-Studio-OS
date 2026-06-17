import { DomainCommandService } from "../../domains/commands.js";
import { entityMutationResult } from "../../entity-service.js";
import { optionalString, stringArray, stringValue } from "../payload.js";
import type { StudioCommandDefinition } from "../types.js";

export const marketingCommandDefinitions: Record<string, StudioCommandDefinition> = {
  "content.prepare": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).prepareContent({
        title: stringValue(payload, "title"),
        ...(optionalString(payload, "campaign_id")
          ? { campaignId: stringValue(payload, "campaign_id") }
          : {}),
        ...(optionalString(payload, "channel") ? { channel: stringValue(payload, "channel") } : {}),
        ...(optionalString(payload, "publish_at")
          ? { publishAt: stringValue(payload, "publish_at") }
          : {}),
        publicClaims: stringArray(payload, "public_claims"),
        evidenceIds: stringArray(payload, "evidence_ids"),
      });
      return entityMutationResult(command.command, entity);
    },
  },
};
