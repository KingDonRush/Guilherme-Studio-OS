import { createResultEnvelope } from "@guilherme-studio/schemas";
import { DomainCommandService } from "../../domains/commands.js";
import { entityMutationResult } from "../../entity-service.js";
import { optionalString, stringValue } from "../payload.js";
import type { StudioCommandDefinition } from "../types.js";

export const salesCommandDefinitions: Record<string, StudioCommandDefinition> = {
  "proposal.prepare": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).prepareProposal(
        stringValue(payload, "opportunity_id"),
        optionalString(payload, "title"),
      );
      return entityMutationResult(command.command, entity);
    },
  },
  "opportunity.convert": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const result = await new DomainCommandService(context).convertOpportunity({
        opportunityId: stringValue(payload, "opportunity_id"),
        ...(optionalString(payload, "client_title")
          ? { clientTitle: stringValue(payload, "client_title") }
          : {}),
        ...(optionalString(payload, "engagement_title")
          ? { engagementTitle: stringValue(payload, "engagement_title") }
          : {}),
      });
      return createResultEnvelope({ requestId: command.request_id, result });
    },
  },
  "engagement.create-from-opportunity": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).createEngagementFromOpportunity(
        stringValue(payload, "opportunity_id"),
        optionalString(payload, "title"),
      );
      return entityMutationResult(command.command, entity);
    },
  },
};
