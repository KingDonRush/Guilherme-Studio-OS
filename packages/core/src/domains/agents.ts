import { nowIso, type StudioEntity } from "@guilherme-studio/schemas";
import { DomainServiceBase } from "./base.js";

export class AgentsDomainService extends DomainServiceBase {
  async createHandoff(input: {
    taskId: string;
    title: string;
    objective: string;
    summary: string;
    repositoryIds?: string[];
  }): Promise<StudioEntity> {
    await this.requireKind(input.taskId, "task");
    for (const repositoryId of input.repositoryIds ?? []) {
      await this.requireKind(repositoryId, "repository");
    }
    return this.entities.create({
      kind: "agentRun",
      title: input.title,
      status: "active",
      relations: [
        { type: "hands_off", target_id: input.taskId },
        ...(input.repositoryIds ?? []).map((targetId) => ({
          type: "uses_repository",
          target_id: targetId,
        })),
      ],
      data: {
        objective: input.objective,
        started_at: nowIso(),
        result: "running",
        evidence_ids: [],
        handoff: {
          summary: input.summary,
          created_at: nowIso(),
        },
      },
    });
  }
}
