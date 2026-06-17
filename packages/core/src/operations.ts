import {
  createEntity,
  type EntityKind,
  entityId,
  nowIso,
  type StudioEntity,
} from "@guilherme-studio/schemas";
import { validateCanonicalFiles } from "@guilherme-studio/storage";
import { createStudioContext } from "./context.js";
import { EntityService } from "./entity-service.js";

export async function validateStudio(root = process.cwd()): Promise<{
  ok: boolean;
  entityCount: number;
  errors: string[];
}> {
  const context = await createStudioContext(root);
  const { files, errors } = await validateCanonicalFiles(context.paths.root);
  return {
    ok: errors.length === 0,
    entityCount: files.length,
    errors,
  };
}

export async function rebuildProjection(root = process.cwd()): Promise<{
  entityCount: number;
  relationCount: number;
  checksum: string;
  projectionRevision: number;
}> {
  const context = await createStudioContext(root);
  const { files, errors } = await validateCanonicalFiles(context.paths.root);
  if (errors.length > 0) {
    throw new Error(`Cannot rebuild projection with validation errors: ${errors.join("; ")}`);
  }
  return context.projection.rebuild(files, await context.events.list());
}

export { executeStudioCommand } from "./command-runtime.js";
export {
  type CommandRequirement,
  classifyStudioError,
  StudioCommandService,
} from "./command-service.js";
export {
  coverageEntityIds,
  evaluatePrdCoverage,
  PRD_COVERAGE_REQUIREMENTS,
  type PrdCoverageReport,
  type PrdCoverageRequirement,
  type PrdCoverageStatus,
} from "./coverage.js";
export { type EconomicNextAction, EconomicNextActionResolver } from "./economics.js";
export { IdempotencyStore } from "./idempotency.js";

export async function createTaskEvidenceRun(root = process.cwd()): Promise<{
  task: StudioEntity;
  run: StudioEntity;
  evidence: StudioEntity;
}> {
  const context = await createStudioContext(root);
  const service = new EntityService(context);
  const getOrCreate = async (input: Parameters<typeof createEntity>[0]): Promise<StudioEntity> => {
    const draft = createEntity(input);
    const existing = await context.entities.get(entityId(draft));
    if (existing) {
      return existing.entity;
    }
    return service.create(input);
  };
  const task = await getOrCreate({
    kind: "task",
    title: "Bootstrap Studio OS vertical",
    summary: "First validated vertical connecting Task, AgentRun and Evidence.",
    labels: ["studio-os", "bootstrap"],
    data: {
      priority: "now",
      economic_reason: "Create a repeatable operating layer before portfolio work resumes.",
      acceptance: [
        "schemas validate",
        "storage writes canonical YAML",
        "CLI rebuilds SQLite projection",
      ],
      blocked_by: [],
    },
  });
  const run = await getOrCreate({
    kind: "agentRun",
    title: "Initial Studio OS implementation run",
    relations: [{ type: "executes", target_id: entityId(task) }],
    data: {
      objective: "Create the first Studio OS V1 executable vertical.",
      started_at: nowIso(),
      result: "running",
      evidence_ids: [],
    },
  });
  const evidence = await getOrCreate({
    kind: "evidence",
    title: "Studio OS foundation install and audit",
    relations: [{ type: "supports", target_id: entityId(task) }],
    data: {
      evidence_type: "command",
      command: "npm install && npm audit --audit-level=moderate",
      observed_at: nowIso(),
    },
  });
  const completedRun = await service.update(entityId(run), (entity) => {
    if (entity.kind !== "agentRun") {
      throw new Error(`Expected agentRun entity, got ${entity.kind}`);
    }
    return {
      ...entity,
      spec: {
        ...entity.spec,
        status: "done",
        objective: entity.spec.objective,
        started_at: entity.spec.started_at,
        finished_at: nowIso(),
        result: "complete",
        evidence_ids: [entityId(evidence)],
      },
    };
  });
  return { task, run: completedRun, evidence };
}

export function kindFromAlias(alias: string): EntityKind {
  const map: Record<string, EntityKind> = {
    person: "person",
    organization: "organization",
    prospect: "prospect",
    client: "client",
    opportunity: "opportunity",
    engagement: "engagement",
    project: "project",
    deliverable: "deliverable",
    repo: "repository",
    repository: "repository",
    environment: "environment",
    product: "product",
    case: "portfolioCase",
    portfolioCase: "portfolioCase",
    evidence: "evidence",
    campaign: "campaign",
    content: "contentItem",
    contentItem: "contentItem",
    proposal: "proposal",
    release: "release",
    payment: "payment",
    invoice: "invoice",
    contract: "contract",
    application: "jobApplication",
    jobApplication: "jobApplication",
    task: "task",
    decision: "decision",
    asset: "asset",
    communication: "communication",
    agentRun: "agentRun",
  };
  const kind = map[alias];
  if (!kind) {
    throw new Error(`Unknown entity alias: ${alias}`);
  }
  return kind;
}
