import {
  type EntityKind,
  entityStatus,
  type LifecycleState,
  type StudioEntity,
} from "@guilherme-studio/schemas";
import { recordString, recordStringArray } from "./record-utils.js";

const TERMINAL_STATES = new Set<LifecycleState>([
  "archived",
  "cancelled",
  "done",
  "lost",
  "paid",
  "published",
  "won",
]);

const DEFAULT_TRANSITIONS: Partial<Record<LifecycleState, LifecycleState[]>> = {
  draft: ["active", "cancelled", "archived"],
  active: [
    "waiting",
    "blocked",
    "done",
    "won",
    "lost",
    "published",
    "paid",
    "cancelled",
    "archived",
  ],
  waiting: ["active", "blocked", "done", "won", "lost", "cancelled", "archived"],
  blocked: ["active", "waiting", "cancelled", "archived"],
};

const KIND_TRANSITIONS: Partial<
  Record<EntityKind, Partial<Record<LifecycleState, LifecycleState[]>>>
> = {
  opportunity: {
    active: ["waiting", "won", "lost", "archived"],
    waiting: ["active", "won", "lost", "archived"],
  },
  jobApplication: {
    draft: ["active", "cancelled", "archived"],
    active: ["waiting", "won", "lost", "cancelled", "archived"],
    waiting: ["active", "won", "lost", "cancelled", "archived"],
  },
  invoice: {
    draft: ["active", "cancelled", "archived"],
    active: ["waiting", "paid", "cancelled", "archived"],
    waiting: ["active", "paid", "cancelled", "archived"],
  },
  portfolioCase: {
    draft: ["active", "archived"],
    active: ["published", "archived"],
  },
  release: {
    draft: ["active", "cancelled", "archived"],
    active: ["published", "cancelled", "archived"],
  },
};

export class LifecycleEngine {
  canTransition(kind: EntityKind, current: LifecycleState, next: LifecycleState): boolean {
    if (current === next) {
      return true;
    }
    if (TERMINAL_STATES.has(current)) {
      return next === "archived";
    }
    const allowed = KIND_TRANSITIONS[kind]?.[current] ?? DEFAULT_TRANSITIONS[current] ?? [];
    return allowed.includes(next);
  }

  assertTransition(kind: EntityKind, current: LifecycleState, next: LifecycleState): void {
    if (!this.canTransition(kind, current, next)) {
      throw new Error(`Invalid ${kind} lifecycle transition: ${current} -> ${next}`);
    }
  }

  assertEntityTransition(entity: StudioEntity, next: LifecycleState): void {
    this.assertTransition(entity.kind, entityStatus(entity), next);
    const missing = this.missingPreconditions(entity, next);
    if (missing.length > 0) {
      throw new Error(
        `Missing ${entity.kind} lifecycle preconditions for ${entityStatus(entity)} -> ${next}: ${missing.join(", ")}`,
      );
    }
  }

  private missingPreconditions(entity: StudioEntity, next: LifecycleState): string[] {
    const spec = entity.spec as Record<string, unknown>;
    const evidenceIds = recordStringArray(spec, "evidence_ids");
    const sourceEvidenceIds = recordStringArray(spec, "source_evidence_ids");
    const hasEvidence =
      evidenceIds.length > 0 ||
      sourceEvidenceIds.length > 0 ||
      entity.relations.some((relation) =>
        ["supports", "supported_by", "verified_by"].includes(relation.type),
      );

    if (entity.kind === "deliverable" && next === "done" && !hasEvidence) {
      return ["evidence_ids or supporting evidence relation"];
    }
    if (entity.kind === "portfolioCase" && next === "published" && !hasEvidence) {
      return ["source_evidence_ids or supporting evidence relation"];
    }
    if (entity.kind === "release" && next === "published" && !hasEvidence) {
      return ["evidence_ids or supporting evidence relation"];
    }
    if (
      entity.kind === "payment" &&
      next === "paid" &&
      typeof recordString(spec, "reconciliation_reference") !== "string"
    ) {
      return ["reconciliation_reference"];
    }
    return [];
  }
}
