import {
  createEntity,
  createEntityId,
  type EntityKind,
  EventSchema,
  entityId,
  entityRevision,
  entityTitle,
  type GateDecision,
  type LifecycleState,
  nowIso,
  type StudioEntity,
  type StudioEvent,
  TypedEntitySchema,
  updateEntityMetadata,
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
    const existing = await this.context.entities.get(entityId(entity));
    if (existing) {
      throw new Error(`Entity already exists: ${entityId(entity)}`);
    }
    await this.context.entities.put(entity);
    await this.recordEvent("entity.created", entityId(entity), {
      kind: entity.kind,
      title: entityTitle(entity),
    });
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
      metadata: {
        ...current.entity.metadata,
        revision: entityRevision(current.entity) + 1,
        updated_at: nowIso(),
      },
    });
    await this.context.entities.put(next, entityRevision(current.entity));
    await this.recordEvent("entity.updated", entityId(next), { revision: entityRevision(next) });
    return next;
  }

  async transition(id: string, status: LifecycleState): Promise<StudioEntity> {
    return this.update(id, (entity) => ({ ...entity, spec: { ...entity.spec, status } }));
  }

  async archive(id: string): Promise<StudioEntity> {
    return this.update(id, (entity) => {
      const archived = TypedEntitySchema.parse({
        ...entity,
        spec: { ...entity.spec, status: "archived" },
      });
      return updateEntityMetadata(archived, { archived_at: nowIso() });
    });
  }

  async recordEvent(
    type: string,
    entityId: string | undefined,
    data: Record<string, unknown>,
  ): Promise<StudioEvent> {
    const event = EventSchema.parse({
      id: createEntityId("agentRun", `${type}:${entityId ?? "system"}:${nowIso()}`),
      type,
      entity_id: entityId,
      actor_id: this.context.config.operator_id,
      created_at: nowIso(),
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
        evidence_required: [],
      };
    }
    if (input.external || input.destructive) {
      return {
        result: "require_confirmation",
        reason: "External or destructive actions must be prepared, confirmed and reconciled.",
        evidence_required: ["prepared action", "human confirmation", "reconciliation result"],
      };
    }
    if (input.action.includes("publish") || input.action.includes("send")) {
      return {
        result: "require_confirmation",
        reason: "Public communication requires explicit confirmation.",
        evidence_required: ["final content", "target channel", "confirmation"],
      };
    }
    return {
      result: "allow",
      reason: "Local reversible action within canonical files.",
      evidence_required: [],
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
