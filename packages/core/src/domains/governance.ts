import {
  entityId,
  entityStatus,
  entityTitle,
  type KnowledgeRouteDestination,
  type LearningPromotionDestination,
  nowIso,
  type StudioEntity,
  slugify,
} from "@guilherme-studio/schemas";
import { DomainServiceBase } from "./base.js";
import { EvidenceDomainService } from "./evidence.js";

const SECRET_VALUE_PATTERNS = [
  /\b(api[_-]?key|token|secret|password|passwd|oauth|credential)\s*[:=]\s*['"]?[A-Za-z0-9_\-.]{12,}/i,
  /\bsk-[A-Za-z0-9]{20,}\b/,
  /\bghp_[A-Za-z0-9_]{20,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
];

export class GovernanceDomainService extends DomainServiceBase {
  async recordDecision(input: {
    title: string;
    decision: string;
    rationale?: string;
    alternatives?: string[];
    impact?: string;
    reversibility?: "reversible" | "hard_to_reverse" | "irreversible";
    authority?: {
      source?: "guilherme" | "agent" | "policy" | "evidence";
      ownerId?: string;
      confirmationRequired?: boolean;
    };
    amendsDecisionId?: string;
    contradictionIds?: string[];
    evidenceIds?: string[];
  }): Promise<StudioEntity> {
    assertNoSecretLikeText(input);
    if (input.evidenceIds) {
      await this.requireEvidenceIds(input.evidenceIds);
    }
    if (input.amendsDecisionId) {
      await this.requireKind(input.amendsDecisionId, "decision");
    }
    for (const contradictionId of input.contradictionIds ?? []) {
      await this.requireKind(contradictionId, "decision");
    }
    const detectedContradictions = await this.detectActiveDecisionContradictions(input);
    if (
      detectedContradictions.length > 0 &&
      !input.amendsDecisionId &&
      (input.contradictionIds ?? []).length === 0
    ) {
      throw new Error(
        `Contradictory active decision exists: ${detectedContradictions.join(", ")}. Use decision.amend or pass contradiction_ids.`,
      );
    }
    const contradictionIds = unique([
      ...(input.contradictionIds ?? []),
      ...(input.amendsDecisionId ? [input.amendsDecisionId] : []),
    ]);
    return this.entities.create({
      kind: "decision",
      title: input.title,
      ...(input.amendsDecisionId || contradictionIds.length > 0
        ? { slug: `${slugify(input.title)}-${Date.now()}` }
        : {}),
      status: "done",
      relations: [
        ...(input.evidenceIds ?? []).map((targetId) => ({
          type: "supported_by",
          target_id: targetId,
        })),
        ...(input.amendsDecisionId ? [{ type: "amends", target_id: input.amendsDecisionId }] : []),
        ...contradictionIds.map((targetId) => ({
          type: "contradicts",
          target_id: targetId,
        })),
      ],
      data: {
        decision_type: "decision",
        decision: input.decision,
        ...(input.rationale ? { rationale: input.rationale } : {}),
        alternatives: input.alternatives ?? [],
        ...(input.impact ? { impact: input.impact } : {}),
        ...(input.reversibility ? { reversibility: input.reversibility } : {}),
        ...(input.authority
          ? {
              authority: {
                source: input.authority.source ?? "guilherme",
                ...(input.authority.ownerId ? { owner_id: input.authority.ownerId } : {}),
                confirmation_required: input.authority.confirmationRequired ?? false,
              },
            }
          : {}),
        ...(input.amendsDecisionId ? { amends_decision_id: input.amendsDecisionId } : {}),
        contradiction_ids: contradictionIds,
        evidence_ids: input.evidenceIds ?? [],
        decided_at: nowIso(),
      },
    });
  }

  async amendDecision(input: {
    decisionId: string;
    title?: string;
    decision: string;
    rationale?: string;
    alternatives?: string[];
    impact?: string;
    reversibility?: "reversible" | "hard_to_reverse" | "irreversible";
    evidenceIds?: string[];
  }): Promise<StudioEntity> {
    const current = await this.requireKind(input.decisionId, "decision");
    return this.recordDecision({
      title: input.title ?? entityTitle(current),
      decision: input.decision,
      ...(input.rationale ? { rationale: input.rationale } : {}),
      ...(input.alternatives ? { alternatives: input.alternatives } : {}),
      ...(input.impact ? { impact: input.impact } : {}),
      ...(input.reversibility ? { reversibility: input.reversibility } : {}),
      amendsDecisionId: input.decisionId,
      contradictionIds: [input.decisionId],
      ...(input.evidenceIds ? { evidenceIds: input.evidenceIds } : {}),
    });
  }

  async routeKnowledge(input: {
    title: string;
    content: string;
    destination: KnowledgeRouteDestination;
    targetId?: string;
    rationale?: string;
    evidenceIds?: string[];
  }): Promise<StudioEntity> {
    assertNoSecretLikeText(input);
    if (input.evidenceIds) {
      await this.requireEvidenceIds(input.evidenceIds);
    }
    if (input.destination === "entity") {
      if (!input.targetId) {
        throw new Error("target_id is required when routing knowledge to an entity");
      }
      const target = await this.requireEntity(input.targetId);
      const knowledgeRoutes = Reflect.get(target.extensions, "knowledge_routes");
      const currentNotes = Array.isArray(knowledgeRoutes) ? knowledgeRoutes : [];
      const routed = await this.entities.update(input.targetId, (entity) => ({
        ...entity,
        extensions: {
          ...entity.extensions,
          knowledge_routes: [
            ...currentNotes,
            {
              title: input.title,
              content: input.content,
              routed_at: nowIso(),
              ...(input.rationale ? { rationale: input.rationale } : {}),
              evidence_ids: input.evidenceIds ?? [],
            },
          ],
        },
      }));
      await this.entities.recordEvent("knowledge.routed", entityId(routed), {
        destination: input.destination,
        title: input.title,
      });
      return routed;
    }

    if (input.destination === "evidence") {
      return new EvidenceDomainService(this.context).registerEvidence({
        title: input.title,
        evidenceType: "manual",
        ...(input.targetId ? { subjectId: input.targetId } : {}),
        claims: [input.content],
      });
    }

    const target = input.targetId ? await this.requireEntity(input.targetId) : undefined;
    const decision = await this.entities.create({
      kind: "decision",
      title: input.title,
      status: "done",
      relations: [
        ...(input.evidenceIds ?? []).map((targetId) => ({
          type: "supported_by",
          target_id: targetId,
        })),
        ...(target ? [{ type: "routes_to", target_id: entityId(target) }] : []),
      ],
      data: {
        decision_type: "knowledge_route",
        decision: `Route knowledge to ${input.destination}.`,
        ...(input.rationale ? { rationale: input.rationale } : {}),
        route_destination: input.destination,
        ...(target ? { route_target_id: entityId(target) } : {}),
        routed_content: input.content,
        evidence_ids: input.evidenceIds ?? [],
        decided_at: nowIso(),
      },
    });
    await this.entities.recordEvent("knowledge.routed", entityId(decision), {
      destination: input.destination,
      title: input.title,
    });
    return decision;
  }

  async proposeLearningPromotion(input: {
    title: string;
    failureClass: string;
    proposal: string;
    destination: LearningPromotionDestination;
    rationale?: string;
    runId?: string;
    evidenceIds?: string[];
  }): Promise<StudioEntity> {
    assertNoSecretLikeText(input);
    if (input.runId) {
      await this.requireKind(input.runId, "agentRun");
    }
    if (input.evidenceIds) {
      await this.requireEvidenceIds(input.evidenceIds);
    }
    return this.entities.create({
      kind: "decision",
      title: input.title,
      status: "done",
      relations: [
        ...(input.runId ? [{ type: "learned_from", target_id: input.runId }] : []),
        ...(input.evidenceIds ?? []).map((targetId) => ({
          type: "supported_by",
          target_id: targetId,
        })),
      ],
      data: {
        decision_type: "learning_proposal",
        decision: `Promote recurring failure class to ${input.destination}.`,
        ...(input.rationale ? { rationale: input.rationale } : {}),
        learning_failure_class: input.failureClass,
        learning_proposal: input.proposal,
        learning_destination: input.destination,
        evidence_ids: input.evidenceIds ?? [],
        decided_at: nowIso(),
      },
    });
  }

  private async detectActiveDecisionContradictions(input: {
    title: string;
    decision: string;
  }): Promise<string[]> {
    const normalizedTitle = normalize(input.title);
    const normalizedDecision = normalize(input.decision);
    return (await this.context.entities.scan())
      .map((file) => file.entity)
      .filter((entity) => entity.kind === "decision")
      .filter((entity) => entityStatus(entity) !== "archived")
      .filter((entity) => entity.spec.decision_type === "decision")
      .filter((entity) => normalize(entityTitle(entity)) === normalizedTitle)
      .filter((entity) => normalize(entity.spec.decision ?? "") !== normalizedDecision)
      .map(entityId);
  }
}

function assertNoSecretLikeText(value: unknown): void {
  const text = JSON.stringify(value);
  for (const pattern of SECRET_VALUE_PATTERNS) {
    if (pattern.test(text)) {
      throw new Error("Secret-like value is not allowed in knowledge or decision records");
    }
  }
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter((value) => value.length > 0))];
}
