import { nowIso, type StudioEntity } from "@guilherme-studio/schemas";
import { EvidenceClaimService } from "../evidence/claims.js";
import { DomainServiceBase } from "./base.js";

export class MarketingDomainService extends DomainServiceBase {
  async prepareContent(input: {
    title: string;
    campaignId?: string;
    channel?: string;
    publishAt?: string;
    publicClaims?: string[];
    evidenceIds?: string[];
  }): Promise<StudioEntity> {
    if (input.campaignId) {
      await this.requireKind(input.campaignId, "campaign");
    }
    if (input.evidenceIds) {
      await this.requireEvidenceIds(input.evidenceIds);
    }
    const evidence = await Promise.all(
      (input.evidenceIds ?? []).map((id) => this.requireKind(id, "evidence")),
    );
    const validation = new EvidenceClaimService().validate({
      claims: input.publicClaims ?? [],
      evidence,
      publicClaim: (input.publicClaims ?? []).length > 0,
    });
    if (!validation.ok) {
      throw new Error(
        `Content evidence validation failed: ${validation.issues
          .map((issue) => issue.message)
          .join("; ")}`,
      );
    }
    return this.entities.create({
      kind: "contentItem",
      title: input.title,
      status: "draft",
      relations: [
        ...(input.campaignId ? [{ type: "belongs_to_campaign", target_id: input.campaignId }] : []),
        ...(input.evidenceIds ?? []).map((targetId) => ({
          type: "supported_by",
          target_id: targetId,
        })),
      ],
      data: {
        ...(input.campaignId ? { campaign_id: input.campaignId } : {}),
        ...(input.channel ? { channel: input.channel } : {}),
        ...(input.publishAt ? { publish_at: input.publishAt } : {}),
        public_claims: input.publicClaims ?? [],
        proof_evidence_ids: input.evidenceIds ?? [],
        prepared_at: nowIso(),
      },
    });
  }
}
