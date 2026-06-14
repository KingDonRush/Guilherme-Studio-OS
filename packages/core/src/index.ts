import {
  createEntity,
  createEntityId,
  type EntityKind,
  EventSchema,
  type GateDecision,
  type LifecycleState,
  nowIso,
  type StudioEntity,
  type StudioEvent,
  TypedEntitySchema,
} from "@guilherme-studio/schemas";
import {
  EntityStore,
  EventStore,
  loadStudioConfig,
  SQLiteProjection,
  type StudioConfig,
  type StudioPaths,
  validateCanonicalFiles,
} from "@guilherme-studio/storage";

export interface StudioContext {
  config: StudioConfig;
  paths: StudioPaths;
  entities: EntityStore;
  events: EventStore;
  projection: SQLiteProjection;
}

export async function createStudioContext(root = process.cwd()): Promise<StudioContext> {
  const { config, paths } = await loadStudioConfig(root);
  return {
    config,
    paths,
    entities: new EntityStore(paths.root),
    events: new EventStore(paths.eventsPath),
    projection: new SQLiteProjection(paths.sqlitePath),
  };
}

export class EntityService {
  readonly context: StudioContext;

  constructor(context: StudioContext) {
    this.context = context;
  }

  async create(input: Parameters<typeof createEntity>[0]): Promise<StudioEntity> {
    const entity = createEntity(input);
    const existing = await this.context.entities.get(entity.id);
    if (existing) {
      throw new Error(`Entity already exists: ${entity.id}`);
    }
    await this.context.entities.put(entity);
    await this.recordEvent("entity.created", entity.id, { kind: entity.kind, title: entity.title });
    return entity;
  }

  async update(id: string, mutate: (entity: StudioEntity) => unknown): Promise<StudioEntity> {
    const current = await this.context.entities.get(id);
    if (!current) {
      throw new Error(`Entity not found: ${id}`);
    }
    const mutated = mutate(current.entity);
    if (!mutated || typeof mutated !== "object") {
      throw new Error(`Entity update must return an object for ${id}`);
    }
    const next = TypedEntitySchema.parse({
      ...mutated,
      revision: current.entity.revision + 1,
      updatedAt: nowIso(),
    });
    await this.context.entities.put(next, current.entity.revision);
    await this.recordEvent("entity.updated", next.id, { revision: next.revision });
    return next;
  }

  async transition(id: string, status: LifecycleState): Promise<StudioEntity> {
    return this.update(id, (entity) => ({ ...entity, status }));
  }

  async archive(id: string): Promise<StudioEntity> {
    return this.update(id, (entity) => ({ ...entity, status: "archived", archivedAt: nowIso() }));
  }

  async recordEvent(
    type: string,
    entityId: string | undefined,
    data: Record<string, unknown>,
  ): Promise<StudioEvent> {
    const event = EventSchema.parse({
      id: createEntityId("agentRun", `${type}:${entityId ?? "system"}:${nowIso()}`),
      type,
      entityId,
      actorId: this.context.config.operator_id,
      createdAt: nowIso(),
      data,
    });
    await this.context.events.append(event);
    return event;
  }
}

export class GateEngine {
  evaluate(input: {
    action: string;
    classification?: string;
    external?: boolean;
    destructive?: boolean;
  }): GateDecision {
    if (input.classification === "secret") {
      return {
        result: "block",
        reason: "Secret material cannot be written to canonical Studio files.",
        evidenceRequired: [],
      };
    }
    if (input.external || input.destructive) {
      return {
        result: "require_confirmation",
        reason: "External or destructive actions must be prepared, confirmed and reconciled.",
        evidenceRequired: ["prepared action", "human confirmation", "reconciliation result"],
      };
    }
    if (input.action.includes("publish") || input.action.includes("send")) {
      return {
        result: "require_confirmation",
        reason: "Public communication requires explicit confirmation.",
        evidenceRequired: ["final content", "target channel", "confirmation"],
      };
    }
    return {
      result: "allow",
      reason: "Local reversible action within canonical files.",
      evidenceRequired: [],
    };
  }
}

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
}> {
  const context = await createStudioContext(root);
  const { files, errors } = await validateCanonicalFiles(context.paths.root);
  if (errors.length > 0) {
    throw new Error(`Cannot rebuild projection with validation errors: ${errors.join("; ")}`);
  }
  return context.projection.rebuild(files);
}

export async function createTaskEvidenceRun(root = process.cwd()): Promise<{
  task: StudioEntity;
  run: StudioEntity;
  evidence: StudioEntity;
}> {
  const context = await createStudioContext(root);
  const service = new EntityService(context);
  const getOrCreate = async (input: Parameters<typeof createEntity>[0]): Promise<StudioEntity> => {
    const draft = createEntity(input);
    const existing = await context.entities.get(draft.id);
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
      economicReason: "Create a repeatable operating layer before portfolio work resumes.",
      acceptance: [
        "schemas validate",
        "storage writes canonical YAML",
        "CLI rebuilds SQLite projection",
      ],
      blockedBy: [],
    },
  });
  const run = await getOrCreate({
    kind: "agentRun",
    title: "Initial Studio OS implementation run",
    relations: [{ type: "executes", targetId: task.id }],
    data: {
      objective: "Create the first Studio OS V1 executable vertical.",
      startedAt: nowIso(),
      result: "running",
      evidenceIds: [],
    },
  });
  const evidence = await getOrCreate({
    kind: "evidence",
    title: "Studio OS foundation install and audit",
    relations: [{ type: "supports", targetId: task.id }],
    data: {
      evidenceType: "command",
      command: "npm install && npm audit --audit-level=moderate",
      observedAt: nowIso(),
    },
  });
  const completedRun = await service.update(run.id, (entity) => {
    if (entity.kind !== "agentRun") {
      throw new Error(`Expected agentRun entity, got ${entity.kind}`);
    }
    return {
      ...entity,
      status: "done",
      data: {
        objective: entity.data.objective,
        startedAt: entity.data.startedAt,
        finishedAt: nowIso(),
        result: "complete",
        evidenceIds: [evidence.id],
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
    repo: "repository",
    repository: "repository",
    product: "product",
    case: "portfolioCase",
    portfolioCase: "portfolioCase",
    evidence: "evidence",
    campaign: "campaign",
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
