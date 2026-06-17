import type { StudioEntity } from "@guilherme-studio/schemas";
import { DomainServiceBase } from "./base.js";

export class PortfolioDomainService extends DomainServiceBase {
  async createPortfolioCaseFromEvidence(input: {
    evidenceId: string;
    title: string;
    caseUrl?: string;
    summary?: string;
  }): Promise<StudioEntity> {
    await this.requireKind(input.evidenceId, "evidence");
    return this.entities.create({
      kind: "portfolioCase",
      title: input.title,
      status: "draft",
      ...(input.summary ? { summary: input.summary } : {}),
      relations: [{ type: "supported_by", target_id: input.evidenceId }],
      data: {
        source_evidence_ids: [input.evidenceId],
        ...(input.caseUrl ? { case_url: input.caseUrl } : {}),
      },
    });
  }
}
