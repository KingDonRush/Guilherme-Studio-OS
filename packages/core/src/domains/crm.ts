import {
  type EntityKind,
  entityId,
  entityStatus,
  entityTitle,
  type LifecycleState,
  nowIso,
  type PreparedAction,
  type StudioEntity,
} from "@guilherme-studio/schemas";
import { recordString } from "../record-utils.js";
import { DomainServiceBase } from "./base.js";
import { normalizeComparable, normalizeUrl } from "./utils.js";

export class CrmDomainService extends DomainServiceBase {
  async reviewDuplicates(input: {
    kind?: EntityKind;
    title?: string;
    email?: string;
    website?: string;
  }): Promise<{
    query: Record<string, string>;
    candidates: Array<{
      entity_id: string;
      kind: EntityKind;
      title: string;
      status: LifecycleState;
      reasons: string[];
    }>;
  }> {
    const defaultKinds = new Set<EntityKind>([
      "person",
      "organization",
      "prospect",
      "client",
      "opportunity",
      "jobApplication",
    ]);
    const files = await this.context.entities.scan();
    const queryTitle = input.title ? normalizeComparable(input.title) : "";
    const queryEmail = input.email ? normalizeComparable(input.email) : "";
    const queryWebsite = input.website ? normalizeUrl(input.website) : "";
    const candidates = files
      .map((file) => file.entity)
      .filter((entity) => (input.kind ? entity.kind === input.kind : defaultKinds.has(entity.kind)))
      .map((entity) => {
        const spec = entity.spec as Record<string, unknown>;
        const reasons: string[] = [];
        const title = normalizeComparable(entityTitle(entity));
        const emailValue = recordString(spec, "email");
        const websiteValue = recordString(spec, "website");
        const email = emailValue ? normalizeComparable(emailValue) : "";
        const website = websiteValue ? normalizeUrl(websiteValue) : "";
        if (queryTitle && (title === queryTitle || title.includes(queryTitle))) {
          reasons.push("title");
        }
        if (queryEmail && email === queryEmail) {
          reasons.push("email");
        }
        if (queryWebsite && website === queryWebsite) {
          reasons.push("website");
        }
        return {
          entity_id: entityId(entity),
          kind: entity.kind,
          title: entityTitle(entity),
          status: entityStatus(entity),
          reasons,
        };
      })
      .filter((candidate) => candidate.reasons.length > 0)
      .sort((left, right) => right.reasons.length - left.reasons.length);

    return {
      query: {
        ...(input.kind ? { kind: input.kind } : {}),
        ...(input.title ? { title: input.title } : {}),
        ...(input.email ? { email: input.email } : {}),
        ...(input.website ? { website: input.website } : {}),
      },
      candidates,
    };
  }

  async qualifyProspect(
    id: string,
    input: { rationale: string; score: number; qualified: boolean },
  ): Promise<StudioEntity> {
    return this.entities.update(id, (entity) => {
      if (entity.kind !== "prospect") {
        throw new Error(`Expected prospect entity, got ${entity.kind}`);
      }
      return {
        ...entity,
        spec: {
          ...entity.spec,
          stage: input.qualified ? "qualified" : "disqualified",
          qualification: {
            score: input.score,
            rationale: input.rationale,
            assessed_at: nowIso(),
          },
          status: input.qualified ? "active" : "archived",
        },
      };
    });
  }

  async prepareCommunication(input: {
    subjectId: string;
    channel: string;
    message: string;
  }): Promise<PreparedAction> {
    const subject = await this.context.entities.get(input.subjectId);
    if (!subject) {
      throw new Error(`Communication subject not found: ${input.subjectId}`);
    }
    return this.actions.prepare({
      actionType: "communication.send",
      payload: {
        subject_id: input.subjectId,
        channel: input.channel,
        message: input.message,
      },
    });
  }
}
