import { createResultEnvelope } from "@guilherme-studio/schemas";
import { DomainCommandService } from "../../domains/commands.js";
import { entityMutationResult } from "../../entity-service.js";
import { optionalString, stringValue } from "../payload.js";
import type { StudioCommandDefinition } from "../types.js";

export const careerCommandDefinitions: Record<string, StudioCommandDefinition> = {
  "application.prepare": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const organizationId = optionalString(payload, "organization_id");
      const entity = await new DomainCommandService(context).prepareApplication({
        title: stringValue(payload, "title"),
        sourceUrl: stringValue(payload, "source_url"),
        ...(organizationId ? { organizationId } : {}),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "application.follow-up": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const result = await new DomainCommandService(context).scheduleApplicationFollowUp({
        applicationId: command.target_id ?? stringValue(payload, "application_id"),
        followUpAt: stringValue(payload, "follow_up_at"),
        ...(optionalString(payload, "message") ? { message: stringValue(payload, "message") } : {}),
        ...(optionalString(payload, "channel") ? { channel: stringValue(payload, "channel") } : {}),
      });
      return createResultEnvelope({ requestId: command.request_id, result });
    },
  },
  "application.record-interview": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).recordApplicationInterview({
        applicationId: command.target_id ?? stringValue(payload, "application_id"),
        interviewAt: stringValue(payload, "interview_at"),
        ...(optionalString(payload, "notes") ? { notes: stringValue(payload, "notes") } : {}),
      });
      return entityMutationResult(command.command, entity);
    },
  },
};
