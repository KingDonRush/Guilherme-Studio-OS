import { nowIso, type PreparedAction, type StudioEntity } from "@guilherme-studio/schemas";
import { DomainServiceBase } from "./base.js";
import { CrmDomainService } from "./crm.js";

export class CareerDomainService extends DomainServiceBase {
  async prepareApplication(input: {
    title: string;
    organizationId?: string;
    sourceUrl: string;
  }): Promise<StudioEntity> {
    if (input.organizationId) {
      await this.requireKind(input.organizationId, "organization");
    }
    return this.entities.create({
      kind: "jobApplication",
      title: input.title,
      status: "draft",
      relations: input.organizationId
        ? [{ type: "applies_to", target_id: input.organizationId }]
        : [],
      data: {
        source_url: input.sourceUrl,
        stage: "prepared",
        prepared_at: nowIso(),
      },
    });
  }

  async scheduleApplicationFollowUp(input: {
    applicationId: string;
    followUpAt: string;
    message?: string;
    channel?: string;
  }): Promise<{ application: StudioEntity; action?: PreparedAction }> {
    const application = await this.entities.update(input.applicationId, (entity) => {
      if (entity.kind !== "jobApplication") {
        throw new Error(`Expected jobApplication entity, got ${entity.kind}`);
      }
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: "waiting",
          stage: "follow-up",
          follow_up_at: input.followUpAt,
        },
      };
    });
    const action = input.message
      ? await new CrmDomainService(this.context).prepareCommunication({
          subjectId: input.applicationId,
          channel: input.channel ?? "email",
          message: input.message,
        })
      : undefined;
    return { application, ...(action ? { action } : {}) };
  }

  async recordApplicationInterview(input: {
    applicationId: string;
    interviewAt: string;
    notes?: string;
  }): Promise<StudioEntity> {
    return this.entities.update(input.applicationId, (entity) => {
      if (entity.kind !== "jobApplication") {
        throw new Error(`Expected jobApplication entity, got ${entity.kind}`);
      }
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: "active",
          stage: "interview",
          interview_at: input.interviewAt,
          ...(input.notes ? { interview_notes: input.notes } : {}),
        },
      };
    });
  }
}
