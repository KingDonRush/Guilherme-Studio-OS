import { createEntity, nowIso, type StudioEntity } from "@guilherme-studio/schemas";
import { WORKFLOW_REQUIREMENTS } from "./requirements.js";
import type { WorkflowVerification } from "./types.js";

export function verifyWorkflowCoverage(entities: StudioEntity[]): WorkflowVerification[] {
  const kinds = new Set(entities.map((entity) => entity.kind));
  return WORKFLOW_REQUIREMENTS.map((workflow) => {
    const missingKinds = workflow.requiredKinds.filter((kind) => !kinds.has(kind));
    return {
      id: workflow.id,
      name: workflow.name,
      ok: missingKinds.length === 0,
      missingKinds,
      requiredGates: workflow.requiredGates,
      requiredEvidence: workflow.requiredEvidence,
    };
  });
}

export function createWorkflowFixtureEntities(): StudioEntity[] {
  const kinds = [...new Set(WORKFLOW_REQUIREMENTS.flatMap((workflow) => workflow.requiredKinds))];
  return kinds.map((kind) => {
    const common = { kind, title: `Workflow fixture ${kind}` };
    if (kind === "evidence") {
      return createEntity({
        ...common,
        data: { evidence_type: "manual", observed_at: nowIso() },
      });
    }
    if (kind === "task") {
      return createEntity({
        ...common,
        data: { priority: "normal", acceptance: [], blocked_by: [] },
      });
    }
    if (kind === "agentRun") {
      return createEntity({
        ...common,
        data: {
          objective: "Verify workflow fixture coverage",
          started_at: nowIso(),
          result: "complete",
          evidence_ids: [],
        },
      });
    }
    return createEntity(common);
  });
}
