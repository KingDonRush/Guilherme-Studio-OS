import { mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  assertNoSecrets,
  createEntity,
  createEntityId,
  createRecordId,
  type EntityKind,
  EventSchema,
  entityId,
  entityRevision,
  entityStatus,
  entityTitle,
  type GateDecision,
  type LifecycleState,
  nowIso,
  type PreparedAction,
  PreparedActionSchema,
  type ResultEnvelope,
  ResultEnvelopeSchema,
  type StudioEntity,
  type StudioEvent,
  stableChecksum,
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
    entities: new EntityStore(paths.root, paths.runtime),
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
    const current = await this.context.entities.get(id);
    if (!current) {
      throw new Error(`Entity not found: ${id}`);
    }
    new LifecycleEngine().assertTransition(
      current.entity.kind,
      entityStatus(current.entity),
      status,
    );
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

export function entityMutationResult(action: string, entity: StudioEntity): ResultEnvelope {
  return ResultEnvelopeSchema.parse({
    ok: true,
    action,
    entity_id: entityId(entity),
    revision: entityRevision(entity),
    data: entity,
    errors: [],
  });
}

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
}

export class PreparedActionService {
  readonly directory: string;

  constructor(readonly context: StudioContext) {
    this.directory = path.join(context.paths.runtime, "prepared-actions");
  }

  async prepare(input: {
    actionType: string;
    payload: Record<string, unknown>;
    actorId?: string;
    ttlSeconds?: number;
  }): Promise<PreparedAction> {
    assertNoSecrets(input.payload);
    const createdAt = nowIso();
    const action = PreparedActionSchema.parse({
      api_version: "studio.guilherme.dev/prepared-action-v1",
      id: createRecordId(
        "act",
        `${input.actionType}:${createdAt}:${JSON.stringify(input.payload)}`,
      ),
      action_type: input.actionType,
      created_at: createdAt,
      expires_at: new Date(Date.parse(createdAt) + (input.ttlSeconds ?? 900) * 1000).toISOString(),
      actor_id: input.actorId ?? this.context.config.operator_id,
      payload: input.payload,
      payload_checksum: stableChecksum(input.payload),
      status: "prepared",
    });
    await this.write(action);
    return action;
  }

  async get(id: string): Promise<PreparedAction> {
    const action = PreparedActionSchema.parse(
      JSON.parse(await readFile(path.join(this.directory, `${id}.json`), "utf8")),
    );
    if (action.status === "prepared" && Date.parse(action.expires_at) <= Date.now()) {
      const expired = PreparedActionSchema.parse({ ...action, status: "expired" });
      await this.write(expired);
      return expired;
    }
    return action;
  }

  async list(): Promise<PreparedAction[]> {
    await mkdir(this.directory, { recursive: true });
    const files = (await readdir(this.directory))
      .filter((entry) => entry.endsWith(".json"))
      .sort((a, b) => a.localeCompare(b));
    return Promise.all(files.map((file) => this.get(file.slice(0, -5))));
  }

  async confirm(id: string, payloadChecksum: string): Promise<PreparedAction> {
    const action = await this.get(id);
    if (action.status !== "prepared") {
      throw new Error(`Prepared action cannot be confirmed from status ${action.status}`);
    }
    if (action.payload_checksum !== payloadChecksum) {
      throw new Error(`Prepared action payload checksum mismatch: ${id}`);
    }
    const confirmed = PreparedActionSchema.parse({
      ...action,
      status: "confirmed",
      confirmed_at: nowIso(),
    });
    await this.write(confirmed);
    return confirmed;
  }

  async execute(
    id: string,
    executor: (action: PreparedAction) => Promise<Record<string, unknown>>,
  ): Promise<PreparedAction> {
    const action = await this.get(id);
    if (action.status !== "confirmed") {
      throw new Error(`Prepared action must be confirmed before execution: ${id}`);
    }
    const reconciliation = await executor(action);
    const executed = PreparedActionSchema.parse({
      ...action,
      status: "executed",
      executed_at: nowIso(),
      reconciliation,
    });
    await this.write(executed);
    return executed;
  }

  private async write(action: PreparedAction): Promise<void> {
    await mkdir(this.directory, { recursive: true });
    const target = path.join(this.directory, `${action.id}.json`);
    const temporary = path.join(this.directory, `.action-${process.pid}-${Date.now()}.tmp`);
    await writeFile(temporary, `${JSON.stringify(action, null, 2)}\n`, { mode: 0o600 });
    await rename(temporary, target);
  }
}

export class GateEngine {
  evaluate(input: {
    action: string;
    classification?: string;
    external?: boolean;
    destructive?: boolean;
    publicClaim?: boolean;
    expectedRevision?: number;
    actualRevision?: number;
    evidenceIds?: string[];
    requiredEvidence?: string[];
    paymentStatus?: string;
    deliveryStatus?: string;
  }): GateDecision {
    if (input.classification === "secret") {
      return {
        result: "block",
        reason: "Secret material cannot be written to canonical Studio files.",
        evidence_required: [],
      };
    }
    if (
      input.expectedRevision !== undefined &&
      input.actualRevision !== undefined &&
      input.expectedRevision !== input.actualRevision
    ) {
      return {
        result: "block",
        reason: "The entity changed after the command was prepared.",
        evidence_required: ["fresh entity revision"],
      };
    }
    const missingEvidence = (input.requiredEvidence ?? []).filter(
      (required) => !(input.evidenceIds ?? []).includes(required),
    );
    if (missingEvidence.length > 0) {
      return {
        result: "block",
        reason: `Required evidence is missing: ${missingEvidence.join(", ")}`,
        evidence_required: missingEvidence,
      };
    }
    if (input.deliveryStatus === "done" && input.paymentStatus && input.paymentStatus !== "paid") {
      return {
        result: "warn",
        reason: "Delivery is complete while payment is still pending.",
        evidence_required: ["invoice status", "delivery acceptance"],
      };
    }
    if (input.external || input.destructive) {
      return {
        result: "require_confirmation",
        reason: "External or destructive actions must be prepared, confirmed and reconciled.",
        evidence_required: ["prepared action", "human confirmation", "reconciliation result"],
      };
    }
    if (input.publicClaim || input.action.includes("publish") || input.action.includes("send")) {
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
