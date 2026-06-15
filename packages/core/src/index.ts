import { mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  type Actor,
  assertNoSecrets,
  type Capability,
  type CommandEnvelope,
  createActor,
  createCommandEnvelope,
  createEntity,
  createEntityId,
  createRecordId,
  createResultEnvelope,
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

  async update(
    id: string,
    mutate: (entity: StudioEntity) => unknown,
    expectedRevision?: number,
  ): Promise<StudioEntity> {
    const current = await this.context.entities.get(id);
    if (!current) {
      throw new Error(`Entity not found: ${id}`);
    }
    if (expectedRevision !== undefined && entityRevision(current.entity) !== expectedRevision) {
      throw new Error(
        `Revision conflict for ${id}: expected ${expectedRevision}, got ${entityRevision(current.entity)}`,
      );
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
  return createResultEnvelope({
    result: {
      action,
      entity_id: entityId(entity),
      revision: entityRevision(entity),
      entity,
    },
  });
}

const CAPABILITY_LEVEL: Record<string, number> = {
  public: 0,
  internal: 1,
  confidential: 2,
  secret: 3,
};

export class AuthorityService {
  assertCapability(actor: Actor, capability: Capability, classification = "internal"): void {
    if (actor.expires_at && Date.parse(actor.expires_at) <= Date.now()) {
      throw new Error(`Actor delegation expired: ${actor.id}`);
    }
    if (!actor.capabilities.includes(capability)) {
      throw new Error(`Actor ${actor.id} lacks capability ${capability}`);
    }
    const ceiling = CAPABILITY_LEVEL[actor.classification_ceiling] ?? -1;
    const requested = CAPABILITY_LEVEL[classification] ?? Number.POSITIVE_INFINITY;
    if (requested > ceiling) {
      throw new Error(`Actor ${actor.id} classification ceiling does not allow ${classification}`);
    }
  }
}

export function operatorActor(operatorId: string): Actor {
  return createActor({
    id: operatorId,
    type: "human",
    classification_ceiling: "confidential",
    capabilities: [
      "entity.read",
      "entity.write",
      "entity.transition",
      "evidence.register",
      "repository.inspect",
      "repository.mutate",
      "environment.inspect",
      "environment.mutate",
      "action.prepare",
      "action.confirm",
      "action.execute",
      "action.reconcile",
      "external.execute",
      "destructive.execute",
      "public.publish",
      "finance.reconcile",
    ],
  });
}

export function createStudioCommand(
  context: StudioContext,
  input: Omit<Parameters<typeof createCommandEnvelope>[0], "actor"> & { actor?: Actor },
): CommandEnvelope {
  return createCommandEnvelope({
    ...input,
    actor: input.actor ?? operatorActor(context.config.operator_id),
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
    provider?: string;
    target?: string;
    sourceRevisions?: Record<string, number>;
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
      provider: input.provider,
      target: input.target,
      created_at: createdAt,
      updated_at: createdAt,
      expires_at: new Date(Date.parse(createdAt) + (input.ttlSeconds ?? 900) * 1000).toISOString(),
      actor_id: input.actorId ?? this.context.config.operator_id,
      source_revisions: input.sourceRevisions ?? {},
      payload: input.payload,
      payload_checksum: stableChecksum(input.payload),
      status: "awaiting_confirmation",
    });
    await this.write(action);
    return action;
  }

  async get(id: string): Promise<PreparedAction> {
    const action = PreparedActionSchema.parse(
      JSON.parse(await readFile(path.join(this.directory, `${id}.json`), "utf8")),
    );
    if (
      ["draft", "validated", "awaiting_confirmation", "confirmed"].includes(action.status) &&
      Date.parse(action.expires_at) <= Date.now()
    ) {
      const expired = PreparedActionSchema.parse({
        ...action,
        status: "expired",
        updated_at: nowIso(),
      });
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
    if (action.status !== "awaiting_confirmation") {
      throw new Error(`Prepared action cannot be confirmed from status ${action.status}`);
    }
    if (action.payload_checksum !== payloadChecksum) {
      throw new Error(`Prepared action payload checksum mismatch: ${id}`);
    }
    const confirmed = PreparedActionSchema.parse({
      ...action,
      status: "confirmed",
      updated_at: nowIso(),
      confirmation_id: createRecordId("cnf", `${id}:${payloadChecksum}:${nowIso()}`),
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
    const executing = PreparedActionSchema.parse({
      ...action,
      status: "executing",
      updated_at: nowIso(),
      execution_started_at: nowIso(),
    });
    await this.write(executing);
    try {
      const execution = await executor(executing);
      const executed = PreparedActionSchema.parse({
        ...executing,
        status: "executed",
        updated_at: nowIso(),
        executed_at: nowIso(),
        reconciliation: execution,
      });
      await this.write(executed);
      return executed;
    } catch (error) {
      const failed = PreparedActionSchema.parse({
        ...executing,
        status: "failed",
        updated_at: nowIso(),
        failure: error instanceof Error ? error.message : String(error),
      });
      await this.write(failed);
      throw error;
    }
  }

  async reconcile(id: string, result: Record<string, unknown>): Promise<PreparedAction> {
    const action = await this.get(id);
    if (action.status !== "executed") {
      throw new Error(`Prepared action must be executed before reconciliation: ${id}`);
    }
    const reconciled = PreparedActionSchema.parse({
      ...action,
      status: "reconciled",
      updated_at: nowIso(),
      reconciled_at: nowIso(),
      reconciliation: {
        ...(action.reconciliation ?? {}),
        ...result,
      },
    });
    await this.write(reconciled);
    return reconciled;
  }

  async revise(id: string, payload: Record<string, unknown>): Promise<PreparedAction> {
    assertNoSecrets(payload);
    const action = await this.get(id);
    if (!["awaiting_confirmation", "confirmed"].includes(action.status)) {
      throw new Error(`Prepared action cannot be revised from status ${action.status}`);
    }
    const revised = PreparedActionSchema.parse({
      ...action,
      payload,
      payload_checksum: stableChecksum(payload),
      status: "awaiting_confirmation",
      confirmation_id: undefined,
      confirmed_at: undefined,
      updated_at: nowIso(),
    });
    await this.write(revised);
    return revised;
  }

  private async write(action: PreparedAction): Promise<void> {
    await mkdir(this.directory, { recursive: true });
    const target = path.join(this.directory, `${action.id}.json`);
    const temporary = path.join(this.directory, `.action-${process.pid}-${Date.now()}.tmp`);
    await writeFile(temporary, `${JSON.stringify(action, null, 2)}\n`, { mode: 0o600 });
    await rename(temporary, target);
  }
}

export class DomainCommandService {
  readonly entities: EntityService;
  readonly actions: PreparedActionService;

  constructor(readonly context: StudioContext) {
    this.entities = new EntityService(context);
    this.actions = new PreparedActionService(context);
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

  async prepareProposal(opportunityId: string, title?: string): Promise<StudioEntity> {
    const opportunity = await this.requireKind(opportunityId, "opportunity");
    return this.entities.create({
      kind: "proposal",
      title: title ?? `Proposal for ${entityTitle(opportunity)}`,
      status: "draft",
      relations: [{ type: "proposes_for", target_id: opportunityId }],
      data: {
        stage: "prepared",
        prepared_at: nowIso(),
      },
    });
  }

  async createEngagementFromOpportunity(
    opportunityId: string,
    title?: string,
  ): Promise<StudioEntity> {
    const opportunity = await this.requireKind(opportunityId, "opportunity");
    if (entityStatus(opportunity) !== "won") {
      throw new Error("Engagements can only be created from won opportunities.");
    }
    return this.entities.create({
      kind: "engagement",
      title: title ?? `Engagement for ${entityTitle(opportunity)}`,
      status: "draft",
      relations: [{ type: "originates_from", target_id: opportunityId }],
      data: { created_from_opportunity_at: nowIso() },
    });
  }

  async registerEvidence(input: {
    title: string;
    evidenceType: "file" | "url" | "command" | "screenshot" | "backup" | "decision" | "manual";
    subjectId?: string;
    path?: string;
    url?: string;
    command?: string;
    checksum?: string;
  }): Promise<StudioEntity> {
    if (input.subjectId) {
      await this.requireEntity(input.subjectId);
    }
    return this.entities.create({
      kind: "evidence",
      title: input.title,
      relations: input.subjectId ? [{ type: "supports", target_id: input.subjectId }] : [],
      data: {
        evidence_type: input.evidenceType,
        ...(input.path ? { path: input.path } : {}),
        ...(input.url ? { url: input.url } : {}),
        ...(input.command ? { command: input.command } : {}),
        ...(input.checksum ? { checksum: input.checksum } : {}),
        observed_at: nowIso(),
      },
    });
  }

  async prepareRelease(productId: string, version: string): Promise<StudioEntity> {
    const product = await this.requireKind(productId, "product");
    return this.entities.create({
      kind: "release",
      title: `${entityTitle(product)} ${version}`,
      status: "draft",
      relations: [{ type: "releases", target_id: productId }],
      data: { version, stage: "prepared", prepared_at: nowIso() },
    });
  }

  async createPortfolioCaseFromEvidence(input: {
    evidenceId: string;
    title: string;
    caseUrl?: string;
    summary?: string;
  }): Promise<StudioEntity> {
    await this.requireKind(input.evidenceId, "evidence");
    return this.entities.create({
      kind: "portfolioCase",
      title: input.title,
      status: "draft",
      ...(input.summary ? { summary: input.summary } : {}),
      relations: [{ type: "supported_by", target_id: input.evidenceId }],
      data: {
        source_evidence_ids: [input.evidenceId],
        ...(input.caseUrl ? { case_url: input.caseUrl } : {}),
      },
    });
  }

  async registerProjectRepository(input: {
    projectId: string;
    title: string;
    repositoryPath: string;
    branch?: string;
    remotePolicy?: "allowed" | "forbidden" | "no-remote-in-v1";
  }): Promise<{ project: StudioEntity; repository: StudioEntity }> {
    const project = await this.requireKind(input.projectId, "project");
    const repository = createEntity({
      kind: "repository",
      title: input.title,
      relations: [{ type: "repository_for", target_id: input.projectId }],
      data: {
        path: input.repositoryPath,
        ...(input.branch ? { branch: input.branch } : {}),
        remote_policy: input.remotePolicy ?? "allowed",
      },
    });
    if (await this.context.entities.get(entityId(repository))) {
      throw new Error(`Repository entity already exists: ${entityId(repository)}`);
    }
    const updatedProject = TypedEntitySchema.parse({
      ...project,
      metadata: {
        ...project.metadata,
        revision: entityRevision(project) + 1,
        updated_at: nowIso(),
      },
      spec: {
        ...project.spec,
        repository_id: entityId(repository),
      },
      relations: [
        ...project.relations.filter((relation) => relation.type !== "uses_repository"),
        { type: "uses_repository", target_id: entityId(repository) },
      ],
    });
    await this.context.entities.putMany([
      { entity: repository },
      { entity: updatedProject, expectedRevision: entityRevision(project) },
    ]);
    await this.entities.recordEvent("repository.registered", entityId(repository), {
      project_id: input.projectId,
      path: input.repositoryPath,
    });
    return { project: updatedProject, repository };
  }

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

  async prepareApplication(input: {
    title: string;
    organizationId?: string;
    sourceUrl: string;
  }): Promise<StudioEntity> {
    if (input.organizationId) {
      await this.requireKind(input.organizationId, "organization");
    }
    return this.entities.create({
      kind: "jobApplication",
      title: input.title,
      status: "draft",
      relations: input.organizationId
        ? [{ type: "applies_to", target_id: input.organizationId }]
        : [],
      data: {
        source_url: input.sourceUrl,
        stage: "prepared",
        prepared_at: nowIso(),
      },
    });
  }

  async reconcilePayment(id: string, input: { reference: string }): Promise<StudioEntity> {
    return this.entities.update(id, (entity) => {
      if (entity.kind !== "payment") {
        throw new Error(`Expected payment entity, got ${entity.kind}`);
      }
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: "paid",
          reconciled_at: nowIso(),
          reconciliation_reference: input.reference,
        },
      };
    });
  }

  private async requireEntity(id: string): Promise<StudioEntity> {
    const file = await this.context.entities.get(id);
    if (!file) {
      throw new Error(`Entity not found: ${id}`);
    }
    return file.entity;
  }

  private async requireKind(id: string, kind: EntityKind): Promise<StudioEntity> {
    const entity = await this.requireEntity(id);
    if (entity.kind !== kind) {
      throw new Error(`Expected ${kind} entity, got ${entity.kind}`);
    }
    return entity;
  }
}

export interface WorkflowVerification {
  id: string;
  name: string;
  ok: boolean;
  missingKinds: EntityKind[];
  requiredGates: string[];
  requiredEvidence: string[];
}

export const WORKFLOW_REQUIREMENTS: Array<{
  id: string;
  name: string;
  requiredKinds: EntityKind[];
  requiredGates: string[];
  requiredEvidence: string[];
}> = [
  {
    id: "prospect-to-client",
    name: "Prospect to Client",
    requiredKinds: [
      "organization",
      "prospect",
      "opportunity",
      "proposal",
      "client",
      "engagement",
      "communication",
      "evidence",
    ],
    requiredGates: ["duplicate-check", "public-claim", "external-confirmation"],
    requiredEvidence: ["research", "qualification", "acceptance"],
  },
  {
    id: "multi-site-engagement",
    name: "Client Engagement with Multiple Sites",
    requiredKinds: [
      "client",
      "engagement",
      "contract",
      "invoice",
      "payment",
      "deliverable",
      "project",
      "repository",
      "evidence",
    ],
    requiredGates: ["payment-delivery", "missing-evidence"],
    requiredEvidence: ["scope", "approval", "handoff"],
  },
  {
    id: "work-to-opportunity",
    name: "Completed Work to New Opportunity",
    requiredKinds: [
      "deliverable",
      "portfolioCase",
      "campaign",
      "contentItem",
      "prospect",
      "evidence",
    ],
    requiredGates: ["confidential-data", "public-claim", "external-confirmation"],
    requiredEvidence: ["claim-map", "publication-preview"],
  },
  {
    id: "plugin-release-case",
    name: "Plugin to Release, Demo, Case, and Prospecting",
    requiredKinds: [
      "product",
      "release",
      "repository",
      "environment",
      "portfolioCase",
      "campaign",
      "prospect",
      "evidence",
    ],
    requiredGates: ["missing-evidence", "public-claim", "external-confirmation"],
    requiredEvidence: ["tests", "artifact", "demo"],
  },
  {
    id: "international-application",
    name: "International Job Application",
    requiredKinds: ["organization", "jobApplication", "communication", "evidence", "task"],
    requiredGates: ["duplicate-check", "public-claim", "external-confirmation"],
    requiredEvidence: ["job-source", "evidence-matrix", "submission-receipt"],
  },
  {
    id: "visual-feedback",
    name: "Visual Feedback to Validated Implementation",
    requiredKinds: ["project", "task", "decision", "evidence", "agentRun"],
    requiredGates: ["missing-evidence"],
    requiredEvidence: ["environment-calibration", "before-after", "human-approval"],
  },
  {
    id: "security-incident",
    name: "Security or Sensitive-Data Incident",
    requiredKinds: ["decision", "task", "evidence", "repository", "agentRun"],
    requiredGates: ["confidential-data", "destructive"],
    requiredEvidence: ["redacted-forensics", "recovery", "prevention"],
  },
  {
    id: "agent-handoff",
    name: "New Agent Handoff",
    requiredKinds: ["task", "decision", "evidence", "agentRun", "repository"],
    requiredGates: ["stale-revision", "missing-evidence"],
    requiredEvidence: ["context-pack", "repository-health", "acceptance"],
  },
];

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
    actor?: Actor;
    capability?: Capability;
  }): GateDecision {
    if (input.actor && input.capability) {
      try {
        new AuthorityService().assertCapability(
          input.actor,
          input.capability,
          input.classification ?? "internal",
        );
      } catch (error) {
        return {
          gate: "authority",
          result: "block",
          reason: error instanceof Error ? error.message : String(error),
          capability_required: input.capability,
          evidence_required: [],
        };
      }
    }
    if (input.classification === "secret") {
      return {
        gate: "secret-data",
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
        gate: "stale-revision",
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
        gate: "missing-evidence",
        result: "block",
        reason: `Required evidence is missing: ${missingEvidence.join(", ")}`,
        evidence_required: missingEvidence,
      };
    }
    if (input.deliveryStatus === "done" && input.paymentStatus && input.paymentStatus !== "paid") {
      return {
        gate: "payment-delivery",
        result: "warn",
        reason: "Delivery is complete while payment is still pending.",
        evidence_required: ["invoice status", "delivery acceptance"],
      };
    }
    if (input.external || input.destructive) {
      return {
        gate: input.destructive ? "destructive" : "external",
        result: "require_confirmation",
        reason: "External or destructive actions must be prepared, confirmed and reconciled.",
        evidence_required: ["prepared action", "human confirmation", "reconciliation result"],
        confirmation_scope: input.action,
      };
    }
    if (input.publicClaim || input.action.includes("publish") || input.action.includes("send")) {
      return {
        gate: "public-claim",
        result: "require_confirmation",
        reason: "Public communication requires explicit confirmation.",
        evidence_required: ["final content", "target channel", "confirmation"],
        confirmation_scope: input.action,
      };
    }
    return {
      gate: "local-reversible",
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
