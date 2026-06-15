import { entityId, entityStatus, entityTitle, type StudioEntity } from "@guilherme-studio/schemas";

export interface EconomicNextAction {
  entity_id: string;
  kind: StudioEntity["kind"];
  title: string;
  score: number;
  reasons: string[];
  blocked: boolean;
  due_at?: string;
}

const PRIORITY_SCORE: Record<string, number> = {
  now: 80,
  high: 55,
  normal: 30,
  low: 10,
};

function numberField(entity: StudioEntity, key: string): number | undefined {
  const value = Reflect.get(entity.spec, key);
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function stringField(entity: StudioEntity, key: string): string | undefined {
  const value = Reflect.get(entity.spec, key);
  return typeof value === "string" ? value : undefined;
}

function booleanField(entity: StudioEntity, key: string): boolean {
  return Reflect.get(entity.spec, key) === true;
}

export class EconomicNextActionResolver {
  rank(entities: StudioEntity[], now = new Date()): EconomicNextAction[] {
    return entities
      .filter(
        (entity) =>
          !["done", "archived", "cancelled", "lost", "paid", "published"].includes(
            entityStatus(entity),
          ),
      )
      .map((entity) => this.evaluate(entity, now))
      .filter((action) => action.score > 0)
      .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title));
  }

  private evaluate(entity: StudioEntity, now: Date): EconomicNextAction {
    const reasons: string[] = [];
    let score = 0;
    const priority = stringField(entity, "priority");
    if (priority) {
      score += PRIORITY_SCORE[priority] ?? 0;
      reasons.push(`priority:${priority}`);
    }

    const amountMinor =
      numberField(entity, "amount_minor") ??
      numberField(entity, "potential_value_minor") ??
      numberField(entity, "value_minor");
    if (amountMinor && amountMinor > 0) {
      score += Math.min(60, Math.round(amountMinor / 100_00));
      reasons.push("revenue");
    }

    if (entity.kind === "invoice" && entityStatus(entity) !== "paid") {
      score += 90;
      reasons.push("receivable");
    }
    if (["opportunity", "proposal", "engagement"].includes(entity.kind)) {
      score += 25;
      reasons.push("commercial-pipeline");
    }
    if (entity.kind === "jobApplication") {
      score += 20;
      reasons.push("international-career");
    }
    if (
      booleanField(entity, "international_relevance") ||
      entity.metadata.labels.includes("international")
    ) {
      score += 20;
      reasons.push("international-relevance");
    }
    if (booleanField(entity, "evidence_missing")) {
      score += 25;
      reasons.push("missing-evidence");
    }

    const dueAt =
      stringField(entity, "due_at") ??
      stringField(entity, "deadline_at") ??
      stringField(entity, "follow_up_at");
    if (dueAt) {
      const distanceDays = (Date.parse(dueAt) - now.getTime()) / 86_400_000;
      if (distanceDays <= 0) {
        score += 70;
        reasons.push("overdue");
      } else if (distanceDays <= 3) {
        score += 45;
        reasons.push("due-soon");
      } else if (distanceDays <= 7) {
        score += 20;
        reasons.push("due-this-week");
      }
    }

    const blocked = entityStatus(entity) === "blocked";
    if (blocked) {
      score = Math.max(1, score - 35);
      reasons.push("blocked");
    }
    const effort = numberField(entity, "effort_hours");
    if (effort && effort > 0) {
      score -= Math.min(20, Math.round(effort / 2));
      reasons.push("effort-cost");
    }

    return {
      entity_id: entityId(entity),
      kind: entity.kind,
      title: entityTitle(entity),
      score,
      reasons,
      blocked,
      ...(dueAt ? { due_at: dueAt } : {}),
    };
  }
}
