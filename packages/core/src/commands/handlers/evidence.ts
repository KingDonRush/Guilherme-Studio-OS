import { createResultEnvelope } from "@guilherme-studio/schemas";
import { DomainCommandService } from "../../domains/commands.js";
import { entityMutationResult } from "../../entity-service.js";
import { PreparedActionService } from "../../prepared-actions/service.js";
import {
  optionalNumber,
  optionalString,
  payloadValue,
  stringArray,
  stringValue,
} from "../payload.js";
import type { StudioCommandDefinition } from "../types.js";

export const evidenceCommandDefinitions: Record<string, StudioCommandDefinition> = {
  "evidence.register": {
    requirement: { capability: "evidence.register" },
    handler: async ({ context, command, payload }) => {
      const subjectId = optionalString(payload, "subject_id");
      const evidencePath = optionalString(payload, "path");
      const url = optionalString(payload, "url");
      const evidenceCommand = optionalString(payload, "command");
      const checksum = optionalString(payload, "checksum");
      const sourceMutability = optionalString(payload, "source_mutability");
      const entity = await new DomainCommandService(context).registerEvidence({
        title: stringValue(payload, "title"),
        evidenceType: stringValue(payload, "evidence_type") as
          | "file"
          | "url"
          | "command"
          | "screenshot"
          | "backup"
          | "decision"
          | "manual",
        ...(subjectId ? { subjectId } : {}),
        ...(evidencePath ? { path: evidencePath } : {}),
        ...(url ? { url } : {}),
        ...(evidenceCommand ? { command: evidenceCommand } : {}),
        ...(checksum ? { checksum } : {}),
        claims: stringArray(payload, "claims"),
        ...(sourceMutability
          ? {
              sourceMutability: sourceMutability as "immutable" | "mutable" | "operator-observed",
            }
          : {}),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "action.prepare": {
    requirement: { capability: "action.prepare" },
    handler: async ({ context, command, payload }) => {
      const actionPayload = payloadValue(payload, "payload");
      if (!actionPayload || typeof actionPayload !== "object" || Array.isArray(actionPayload)) {
        throw new Error("payload is required");
      }
      const provider = optionalString(payload, "provider");
      const target = optionalString(payload, "target");
      const ttlSeconds = optionalNumber(payload, "ttl_seconds");
      const action = await new PreparedActionService(context).prepare({
        actionType: stringValue(payload, "action_type"),
        payload: actionPayload as Record<string, unknown>,
        ...(provider ? { provider } : {}),
        ...(target ? { target } : {}),
        ...(ttlSeconds ? { ttlSeconds } : {}),
      });
      return createResultEnvelope({ requestId: command.request_id, result: action });
    },
  },
  "action.confirm": {
    requirement: { capability: "action.confirm" },
    handler: async ({ context, command, payload }) => {
      const action = await new PreparedActionService(context).confirm(
        stringValue(payload, "action_id"),
        stringValue(payload, "payload_checksum"),
      );
      return createResultEnvelope({ requestId: command.request_id, result: action });
    },
  },
  "action.reconcile": {
    requirement: { capability: "action.reconcile" },
    handler: async ({ context, command, payload }) => {
      const result = payloadValue(payload, "result");
      if (!result || typeof result !== "object" || Array.isArray(result)) {
        throw new Error("result is required");
      }
      const action = await new PreparedActionService(context).reconcile(
        stringValue(payload, "action_id"),
        result as Record<string, unknown>,
      );
      return createResultEnvelope({ requestId: command.request_id, result: action });
    },
  },
};
