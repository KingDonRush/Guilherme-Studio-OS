import {
  createEntity,
  entityId,
  entityRevision,
  entityStatus,
  entityTitle,
  nowIso,
  type StudioEntity,
  TypedEntitySchema,
} from "@guilherme-studio/schemas";
import { recordString } from "../record-utils.js";
import { DomainServiceBase } from "./base.js";

export class SalesDomainService extends DomainServiceBase {
  async prepareProposal(opportunityId: string, title?: string): Promise<StudioEntity> {
    const opportunity = await this.requireKind(opportunityId, "opportunity");
    return this.entities.create({
      kind: "proposal",
      title: title ?? `Proposal for ${entityTitle(opportunity)}`,
      status: "draft",
      relations: [{ type: "proposes_for", target_id: opportunityId }],
      data: {
        opportunity_id: opportunityId,
        stage: "prepared",
        prepared_at: nowIso(),
      },
    });
  }

  async convertOpportunity(input: {
    opportunityId: string;
    clientTitle?: string;
    engagementTitle?: string;
  }): Promise<{ opportunity: StudioEntity; client: StudioEntity; engagement: StudioEntity }> {
    const opportunity = await this.requireKind(input.opportunityId, "opportunity");
    const spec = opportunity.spec as Record<string, unknown>;
    const existingClientId = recordString(spec, "client_id");
    const existingEngagementId = recordString(spec, "engagement_id");
    if (existingClientId && existingEngagementId) {
      const client = await this.requireKind(existingClientId, "client");
      const engagement = await this.requireKind(existingEngagementId, "engagement");
      return { opportunity, client, engagement };
    }

    const client = createEntity({
      kind: "client",
      title: input.clientTitle ?? entityTitle(opportunity),
      status: "active",
      relations: [{ type: "converted_from", target_id: input.opportunityId }],
      data: {
        relationship_stage: "active",
        source_opportunity_id: input.opportunityId,
      },
    });
    const engagement = createEntity({
      kind: "engagement",
      title: input.engagementTitle ?? `Engagement for ${entityTitle(opportunity)}`,
      status: "draft",
      relations: [
        { type: "originates_from", target_id: input.opportunityId },
        { type: "for_client", target_id: entityId(client) },
      ],
      data: {
        opportunity_id: input.opportunityId,
        client_id: entityId(client),
      },
    });
    const updatedOpportunity = TypedEntitySchema.parse({
      ...opportunity,
      metadata: {
        ...opportunity.metadata,
        revision: entityRevision(opportunity) + 1,
        updated_at: nowIso(),
      },
      spec: {
        ...opportunity.spec,
        status: "won",
        stage: "converted",
        client_id: entityId(client),
        engagement_id: entityId(engagement),
        converted_at: nowIso(),
      },
      relations: [
        ...opportunity.relations.filter(
          (relation) => !["converted_to", "creates_engagement"].includes(relation.type),
        ),
        { type: "converted_to", target_id: entityId(client) },
        { type: "creates_engagement", target_id: entityId(engagement) },
      ],
    });
    await this.context.entities.putMany([
      { entity: client },
      { entity: engagement },
      { entity: updatedOpportunity, expectedRevision: entityRevision(opportunity) },
    ]);
    await this.entities.recordEvent("opportunity.converted", input.opportunityId, {
      client_id: entityId(client),
      engagement_id: entityId(engagement),
    });
    return { opportunity: updatedOpportunity, client, engagement };
  }

  async createEngagementFromOpportunity(
    opportunityId: string,
    title?: string,
  ): Promise<StudioEntity> {
    const opportunity = await this.requireKind(opportunityId, "opportunity");
    if (entityStatus(opportunity) !== "won") {
      throw new Error("Engagements can only be created from won opportunities.");
    }
    return this.entities.create({
      kind: "engagement",
      title: title ?? `Engagement for ${entityTitle(opportunity)}`,
      status: "draft",
      relations: [{ type: "originates_from", target_id: opportunityId }],
      data: { created_from_opportunity_at: nowIso() },
    });
  }
}
