import { DomainCommandService } from "../../domains/commands.js";
import { entityMutationResult } from "../../entity-service.js";
import { optionalString, stringArray, stringValue } from "../payload.js";
import type { StudioCommandDefinition } from "../types.js";

export const productCommandDefinitions: Record<string, StudioCommandDefinition> = {
  "release.prepare": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).prepareRelease({
        productId: stringValue(payload, "product_id"),
        version: stringValue(payload, "version"),
        ...(optionalString(payload, "changelog")
          ? { changelog: stringValue(payload, "changelog") }
          : {}),
        ...(optionalString(payload, "compatibility_notes")
          ? { compatibilityNotes: stringValue(payload, "compatibility_notes") }
          : {}),
        ...(optionalString(payload, "migration_notes")
          ? { migrationNotes: stringValue(payload, "migration_notes") }
          : {}),
        ...(optionalString(payload, "public_api_notes")
          ? { publicApiNotes: stringValue(payload, "public_api_notes") }
          : {}),
        ...(optionalString(payload, "package_path")
          ? { packagePath: stringValue(payload, "package_path") }
          : {}),
        testCommands: stringArray(payload, "test_commands"),
        assetIds: stringArray(payload, "asset_ids"),
        roadmapClaims: stringArray(payload, "roadmap_claims"),
        implementedCapabilities: stringArray(payload, "implemented_capabilities"),
      });
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
