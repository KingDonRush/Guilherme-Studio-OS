import { nowIso, type StudioEntity } from "@guilherme-studio/schemas";
import { DomainServiceBase } from "./base.js";

export class GovernanceDomainService extends DomainServiceBase {
  async recordDecision(input: {
    title: string;
    decision: string;
    rationale?: string;
    evidenceIds?: string[];
  }): Promise<StudioEntity> {
    if (input.evidenceIds) {
      await this.requireEvidenceIds(input.evidenceIds);
    }
    return this.entities.create({
      kind: "decision",
      title: input.title,
      status: "done",
      relations: (input.evidenceIds ?? []).map((targetId) => ({
        type: "supported_by",
        target_id: targetId,
      })),
      data: {
        decision: input.decision,
        ...(input.rationale ? { rationale: input.rationale } : {}),
        evidence_ids: input.evidenceIds ?? [],
        decided_at: nowIso(),
      },
    });
  }
}
