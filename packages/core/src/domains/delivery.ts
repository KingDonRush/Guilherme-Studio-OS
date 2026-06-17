import { nowIso, type StudioEntity } from "@guilherme-studio/schemas";
import { recordStringArray } from "../record-utils.js";
import { DomainServiceBase } from "./base.js";
import { mergeRelations, uniqueStrings } from "./utils.js";

export class DeliveryDomainService extends DomainServiceBase {
  async completeDeliverable(input: {
    deliverableId: string;
    evidenceIds: string[];
  }): Promise<StudioEntity> {
    if (input.evidenceIds.length === 0) {
      throw new Error("At least one evidence id is required to complete a deliverable.");
    }
    await this.requireEvidenceIds(input.evidenceIds);
    return this.entities.update(input.deliverableId, (entity) => {
      if (entity.kind !== "deliverable") {
        throw new Error(`Expected deliverable entity, got ${entity.kind}`);
      }
      const evidenceIds = uniqueStrings([
        ...recordStringArray(entity.spec as Record<string, unknown>, "evidence_ids"),
        ...input.evidenceIds,
      ]);
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: "done",
          evidence_missing: false,
          evidence_ids: evidenceIds,
          completed_at: nowIso(),
        },
        relations: mergeRelations(
          entity.relations,
          input.evidenceIds.map((targetId) => ({ type: "supported_by", target_id: targetId })),
        ),
      };
    });
  }
}
