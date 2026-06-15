import { mkdir, mkdtemp, readdir, readFile, rename, writeFile } from "node:fs/promises";
import os from "node:os";
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
import { executeStudioCommand } from "./command-runtime.js";
import type { PrdCoverageReport } from "./coverage.js";

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
    new LifecycleEngine().assertEntityTransition(current.entity, status);
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
    const evidenceIds = Array.isArray(spec["evidence_ids"])
      ? spec["evidence_ids"].filter((value): value is string => typeof value === "string")
      : [];
    const sourceEvidenceIds = Array.isArray(spec["source_evidence_ids"])
      ? spec["source_evidence_ids"].filter((value): value is string => typeof value === "string")
      : [];
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
      typeof spec["reconciliation_reference"] !== "string"
    ) {
      return ["reconciliation_reference"];
    }
    return [];
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

  async reviewDuplicates(input: {
    kind?: EntityKind;
    title?: string;
    email?: string;
    website?: string;
  }): Promise<{
    query: Record<string, string>;
    candidates: Array<{
      entity_id: string;
      kind: EntityKind;
      title: string;
      status: LifecycleState;
      reasons: string[];
    }>;
  }> {
    const defaultKinds = new Set<EntityKind>([
      "person",
      "organization",
      "prospect",
      "client",
      "opportunity",
      "jobApplication",
    ]);
    const files = await this.context.entities.scan();
    const queryTitle = input.title ? normalizeComparable(input.title) : "";
    const queryEmail = input.email ? normalizeComparable(input.email) : "";
    const queryWebsite = input.website ? normalizeUrl(input.website) : "";
    const candidates = files
      .map((file) => file.entity)
      .filter((entity) => (input.kind ? entity.kind === input.kind : defaultKinds.has(entity.kind)))
      .map((entity) => {
        const spec = entity.spec as Record<string, unknown>;
        const reasons: string[] = [];
        const title = normalizeComparable(entityTitle(entity));
        const email = typeof spec["email"] === "string" ? normalizeComparable(spec["email"]) : "";
        const website = typeof spec["website"] === "string" ? normalizeUrl(spec["website"]) : "";
        if (queryTitle && (title === queryTitle || title.includes(queryTitle))) {
          reasons.push("title");
        }
        if (queryEmail && email === queryEmail) {
          reasons.push("email");
        }
        if (queryWebsite && website === queryWebsite) {
          reasons.push("website");
        }
        return {
          entity_id: entityId(entity),
          kind: entity.kind,
          title: entityTitle(entity),
          status: entityStatus(entity),
          reasons,
        };
      })
      .filter((candidate) => candidate.reasons.length > 0)
      .sort((left, right) => right.reasons.length - left.reasons.length);

    return {
      query: {
        ...(input.kind ? { kind: input.kind } : {}),
        ...(input.title ? { title: input.title } : {}),
        ...(input.email ? { email: input.email } : {}),
        ...(input.website ? { website: input.website } : {}),
      },
      candidates,
    };
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
        opportunity_id: opportunityId,
        stage: "prepared",
        prepared_at: nowIso(),
      },
    });
  }

  async convertOpportunity(input: {
    opportunityId: string;
    clientTitle?: string;
    engagementTitle?: string;
  }): Promise<{ opportunity: StudioEntity; client: StudioEntity; engagement: StudioEntity }> {
    const opportunity = await this.requireKind(input.opportunityId, "opportunity");
    const spec = opportunity.spec as Record<string, unknown>;
    const existingClientId = typeof spec["client_id"] === "string" ? spec["client_id"] : undefined;
    const existingEngagementId =
      typeof spec["engagement_id"] === "string" ? spec["engagement_id"] : undefined;
    if (existingClientId && existingEngagementId) {
      const client = await this.requireKind(existingClientId, "client");
      const engagement = await this.requireKind(existingEngagementId, "engagement");
      return { opportunity, client, engagement };
    }

    const client = createEntity({
      kind: "client",
      title: input.clientTitle ?? entityTitle(opportunity),
      status: "active",
      relations: [{ type: "converted_from", target_id: input.opportunityId }],
      data: {
        relationship_stage: "active",
        source_opportunity_id: input.opportunityId,
      },
    });
    const engagement = createEntity({
      kind: "engagement",
      title: input.engagementTitle ?? `Engagement for ${entityTitle(opportunity)}`,
      status: "draft",
      relations: [
        { type: "originates_from", target_id: input.opportunityId },
        { type: "for_client", target_id: entityId(client) },
      ],
      data: {
        opportunity_id: input.opportunityId,
        client_id: entityId(client),
      },
    });
    const updatedOpportunity = TypedEntitySchema.parse({
      ...opportunity,
      metadata: {
        ...opportunity.metadata,
        revision: entityRevision(opportunity) + 1,
        updated_at: nowIso(),
      },
      spec: {
        ...opportunity.spec,
        status: "won",
        stage: "converted",
        client_id: entityId(client),
        engagement_id: entityId(engagement),
        converted_at: nowIso(),
      },
      relations: [
        ...opportunity.relations.filter(
          (relation) => !["converted_to", "creates_engagement"].includes(relation.type),
        ),
        { type: "converted_to", target_id: entityId(client) },
        { type: "creates_engagement", target_id: entityId(engagement) },
      ],
    });
    await this.context.entities.putMany([
      { entity: client },
      { entity: engagement },
      { entity: updatedOpportunity, expectedRevision: entityRevision(opportunity) },
    ]);
    await this.entities.recordEvent("opportunity.converted", input.opportunityId, {
      client_id: entityId(client),
      engagement_id: entityId(engagement),
    });
    return { opportunity: updatedOpportunity, client, engagement };
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

  async completeDeliverable(input: {
    deliverableId: string;
    evidenceIds: string[];
  }): Promise<StudioEntity> {
    if (input.evidenceIds.length === 0) {
      throw new Error("At least one evidence id is required to complete a deliverable.");
    }
    await this.requireEvidenceIds(input.evidenceIds);
    return this.entities.update(input.deliverableId, (entity) => {
      if (entity.kind !== "deliverable") {
        throw new Error(`Expected deliverable entity, got ${entity.kind}`);
      }
      const evidenceIds = uniqueStrings([
        ...(((entity.spec as Record<string, unknown>)["evidence_ids"] as string[] | undefined) ??
          []),
        ...input.evidenceIds,
      ]);
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: "done",
          evidence_missing: false,
          evidence_ids: evidenceIds,
          completed_at: nowIso(),
        },
        relations: mergeRelations(
          entity.relations,
          input.evidenceIds.map((targetId) => ({ type: "supported_by", target_id: targetId })),
        ),
      };
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
    claims?: string[];
    sourceMutability?: "immutable" | "mutable" | "operator-observed";
  }): Promise<StudioEntity> {
    if (input.subjectId) {
      await this.requireEntity(input.subjectId);
    }
    const validation = new EvidenceClaimService().validate({
      claims: input.claims ?? [],
      evidence: [
        createEntity({
          kind: "evidence",
          title: input.title,
          data: {
            evidence_type: input.evidenceType,
            ...(input.subjectId ? { subject_id: input.subjectId } : {}),
            ...(input.path ? { path: input.path } : {}),
            ...(input.url ? { url: input.url } : {}),
            ...(input.command ? { command: input.command } : {}),
            ...(input.checksum ? { checksum: input.checksum } : {}),
            claims: input.claims ?? [],
            source_mutability: input.sourceMutability ?? "operator-observed",
          },
        }),
      ],
      ...(input.subjectId ? { subjectId: input.subjectId } : {}),
      publicClaim: (input.claims ?? []).length > 0,
    });
    if (!validation.ok) {
      throw new Error(
        `Evidence validation failed: ${validation.issues.map((issue) => issue.message).join("; ")}`,
      );
    }
    return this.entities.create({
      kind: "evidence",
      title: input.title,
      relations: input.subjectId ? [{ type: "supports", target_id: input.subjectId }] : [],
      data: {
        evidence_type: input.evidenceType,
        ...(input.subjectId ? { subject_id: input.subjectId } : {}),
        ...(input.path ? { path: input.path } : {}),
        ...(input.url ? { url: input.url } : {}),
        ...(input.command ? { command: input.command } : {}),
        ...(input.checksum ? { checksum: input.checksum } : {}),
        claims: input.claims ?? [],
        source_mutability: input.sourceMutability ?? "operator-observed",
        validated_at: nowIso(),
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

  async publishRelease(input: {
    releaseId: string;
    evidenceIds: string[];
    demoUrl?: string;
  }): Promise<StudioEntity> {
    if (input.evidenceIds.length === 0) {
      throw new Error("At least one evidence id is required to publish a release.");
    }
    await this.requireEvidenceIds(input.evidenceIds);
    return this.entities.update(input.releaseId, (entity) => {
      if (entity.kind !== "release") {
        throw new Error(`Expected release entity, got ${entity.kind}`);
      }
      const evidenceIds = uniqueStrings([
        ...(((entity.spec as Record<string, unknown>)["evidence_ids"] as string[] | undefined) ??
          []),
        ...input.evidenceIds,
      ]);
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: "published",
          stage: "published",
          evidence_ids: evidenceIds,
          published_at: nowIso(),
          ...(input.demoUrl ? { demo_url: input.demoUrl } : {}),
        },
        relations: mergeRelations(
          entity.relations,
          input.evidenceIds.map((targetId) => ({ type: "supported_by", target_id: targetId })),
        ),
      };
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

  async prepareContent(input: {
    title: string;
    campaignId?: string;
    channel?: string;
    publishAt?: string;
    publicClaims?: string[];
    evidenceIds?: string[];
  }): Promise<StudioEntity> {
    if (input.campaignId) {
      await this.requireKind(input.campaignId, "campaign");
    }
    if (input.evidenceIds) {
      await this.requireEvidenceIds(input.evidenceIds);
    }
    const evidence = await Promise.all(
      (input.evidenceIds ?? []).map((id) => this.requireKind(id, "evidence")),
    );
    const validation = new EvidenceClaimService().validate({
      claims: input.publicClaims ?? [],
      evidence,
      publicClaim: (input.publicClaims ?? []).length > 0,
    });
    if (!validation.ok) {
      throw new Error(
        `Content evidence validation failed: ${validation.issues
          .map((issue) => issue.message)
          .join("; ")}`,
      );
    }
    return this.entities.create({
      kind: "contentItem",
      title: input.title,
      status: "draft",
      relations: [
        ...(input.campaignId ? [{ type: "belongs_to_campaign", target_id: input.campaignId }] : []),
        ...(input.evidenceIds ?? []).map((targetId) => ({
          type: "supported_by",
          target_id: targetId,
        })),
      ],
      data: {
        ...(input.campaignId ? { campaign_id: input.campaignId } : {}),
        ...(input.channel ? { channel: input.channel } : {}),
        ...(input.publishAt ? { publish_at: input.publishAt } : {}),
        public_claims: input.publicClaims ?? [],
        proof_evidence_ids: input.evidenceIds ?? [],
        prepared_at: nowIso(),
      },
    });
  }

  async createContractFromEngagement(input: {
    engagementId: string;
    title?: string;
    valueMinor?: number;
    currency?: string;
  }): Promise<StudioEntity> {
    const engagement = await this.requireKind(input.engagementId, "engagement");
    const contract = createEntity({
      kind: "contract",
      title: input.title ?? `Contract for ${entityTitle(engagement)}`,
      status: "draft",
      relations: [{ type: "contracts_engagement", target_id: input.engagementId }],
      data: {
        engagement_id: input.engagementId,
        ...(input.valueMinor !== undefined ? { value_minor: input.valueMinor } : {}),
        ...(input.currency ? { currency: input.currency } : {}),
      },
    });
    const updatedEngagement = TypedEntitySchema.parse({
      ...engagement,
      metadata: {
        ...engagement.metadata,
        revision: entityRevision(engagement) + 1,
        updated_at: nowIso(),
      },
      spec: {
        ...engagement.spec,
        contract_id: entityId(contract),
      },
      relations: mergeRelations(engagement.relations, [
        { type: "governed_by_contract", target_id: entityId(contract) },
      ]),
    });
    await this.context.entities.putMany([
      { entity: contract },
      { entity: updatedEngagement, expectedRevision: entityRevision(engagement) },
    ]);
    await this.entities.recordEvent("contract.created", entityId(contract), {
      engagement_id: input.engagementId,
    });
    return contract;
  }

  async createInvoiceForContract(input: {
    contractId: string;
    title?: string;
    amountMinor: number;
    currency: string;
    dueAt?: string;
    reference?: string;
  }): Promise<StudioEntity> {
    const contract = await this.requireKind(input.contractId, "contract");
    return this.entities.create({
      kind: "invoice",
      title: input.title ?? `Invoice for ${entityTitle(contract)}`,
      status: "active",
      relations: [{ type: "bills_contract", target_id: input.contractId }],
      data: {
        contract_id: input.contractId,
        amount_minor: input.amountMinor,
        currency: input.currency,
        ...(input.dueAt ? { due_at: input.dueAt } : {}),
        ...(input.reference ? { reference: input.reference } : {}),
      },
    });
  }

  async recordPaymentForInvoice(input: {
    invoiceId: string;
    title?: string;
    amountMinor: number;
    currency: string;
    expectedAt?: string;
  }): Promise<StudioEntity> {
    const invoice = await this.requireKind(input.invoiceId, "invoice");
    return this.entities.create({
      kind: "payment",
      title: input.title ?? `Payment for ${entityTitle(invoice)}`,
      status: "waiting",
      relations: [{ type: "pays_invoice", target_id: input.invoiceId }],
      data: {
        invoice_id: input.invoiceId,
        amount_minor: input.amountMinor,
        currency: input.currency,
        ...(input.expectedAt ? { expected_at: input.expectedAt } : {}),
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

  async scheduleApplicationFollowUp(input: {
    applicationId: string;
    followUpAt: string;
    message?: string;
    channel?: string;
  }): Promise<{ application: StudioEntity; action?: PreparedAction }> {
    const application = await this.entities.update(input.applicationId, (entity) => {
      if (entity.kind !== "jobApplication") {
        throw new Error(`Expected jobApplication entity, got ${entity.kind}`);
      }
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: "waiting",
          stage: "follow-up",
          follow_up_at: input.followUpAt,
        },
      };
    });
    const action = input.message
      ? await this.prepareCommunication({
          subjectId: input.applicationId,
          channel: input.channel ?? "email",
          message: input.message,
        })
      : undefined;
    return { application, ...(action ? { action } : {}) };
  }

  async recordApplicationInterview(input: {
    applicationId: string;
    interviewAt: string;
    notes?: string;
  }): Promise<StudioEntity> {
    return this.entities.update(input.applicationId, (entity) => {
      if (entity.kind !== "jobApplication") {
        throw new Error(`Expected jobApplication entity, got ${entity.kind}`);
      }
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: "active",
          stage: "interview",
          interview_at: input.interviewAt,
          ...(input.notes ? { interview_notes: input.notes } : {}),
        },
      };
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

  async recordDecision(input: {
    title: string;
    decision: string;
    rationale?: string;
    evidenceIds?: string[];
  }): Promise<StudioEntity> {
    if (input.evidenceIds) {
      await this.requireEvidenceIds(input.evidenceIds);
    }
    return this.entities.create({
      kind: "decision",
      title: input.title,
      status: "done",
      relations: (input.evidenceIds ?? []).map((targetId) => ({
        type: "supported_by",
        target_id: targetId,
      })),
      data: {
        decision: input.decision,
        ...(input.rationale ? { rationale: input.rationale } : {}),
        evidence_ids: input.evidenceIds ?? [],
        decided_at: nowIso(),
      },
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

  private async requireEvidenceIds(ids: string[]): Promise<void> {
    for (const id of ids) {
      await this.requireKind(id, "evidence");
    }
  }
}

function normalizeComparable(input: string): string {
  return input.trim().toLowerCase();
}

function normalizeUrl(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter((value) => typeof value === "string" && value.length > 0))];
}

function mergeRelations(
  current: StudioEntity["relations"],
  additions: StudioEntity["relations"],
): StudioEntity["relations"] {
  const seen = new Set(current.map((relation) => `${relation.type}:${relation.target_id}`));
  const next = [...current];
  for (const relation of additions) {
    const key = `${relation.type}:${relation.target_id}`;
    if (!seen.has(key)) {
      next.push(relation);
      seen.add(key);
    }
  }
  return next;
}

export interface WorkflowVerification {
  id: string;
  name: string;
  ok: boolean;
  missingKinds: EntityKind[];
  requiredGates: string[];
  requiredEvidence: string[];
}

export type StudioGateId =
  | "duplicate-check"
  | "missing-evidence"
  | "public-claim"
  | "external-confirmation"
  | "payment-delivery"
  | "confidential-data"
  | "destructive"
  | "stale-revision"
  | "restore-required";

export interface StudioGateDefinition {
  id: StudioGateId;
  owner: string;
  applies_when: string;
  risk: "normal" | "high" | "critical";
  required_evidence: string[];
  failure_recovery: string;
}

export const GATE_CATALOG: StudioGateDefinition[] = [
  {
    id: "duplicate-check",
    owner: "CRM and sales",
    applies_when: "Creating or qualifying relationship, prospect, client or application records.",
    risk: "normal",
    required_evidence: ["duplicate review result"],
    failure_recovery: "Review candidates and link or reuse the existing record.",
  },
  {
    id: "missing-evidence",
    owner: "Studio Core",
    applies_when: "Completing, publishing or publicly claiming work.",
    risk: "high",
    required_evidence: ["supporting evidence id"],
    failure_recovery: "Register evidence before advancing the lifecycle.",
  },
  {
    id: "public-claim",
    owner: "Marketing and portfolio",
    applies_when: "Publishing claims or preparing outbound public communication.",
    risk: "high",
    required_evidence: ["claim map", "proof evidence", "exact payload confirmation"],
    failure_recovery: "Remove unsupported claims or attach supporting evidence.",
  },
  {
    id: "external-confirmation",
    owner: "Adapters",
    applies_when: "Any action that may send, publish or mutate outside the local Studio root.",
    risk: "high",
    required_evidence: ["prepared action", "human confirmation", "reconciliation result"],
    failure_recovery: "Keep the action local until exact payload confirmation exists.",
  },
  {
    id: "payment-delivery",
    owner: "Finance and delivery",
    applies_when: "Delivery completes while payment, contract or invoice state is unresolved.",
    risk: "high",
    required_evidence: ["invoice status", "delivery acceptance"],
    failure_recovery: "Rank the unresolved obligation as an economic next action.",
  },
  {
    id: "confidential-data",
    owner: "Security",
    applies_when: "A mutation touches confidential or secret classified material.",
    risk: "critical",
    required_evidence: ["classification review"],
    failure_recovery: "Redact or lower scope before writing or preparing a payload.",
  },
  {
    id: "destructive",
    owner: "Operations",
    applies_when: "A command deletes, restores, overwrites or changes external state.",
    risk: "critical",
    required_evidence: ["backup", "explicit confirmation", "reconciliation result"],
    failure_recovery: "Stop and require a prepared destructive action with recovery evidence.",
  },
  {
    id: "stale-revision",
    owner: "Storage",
    applies_when: "A command has an expected revision and the canonical record changed.",
    risk: "high",
    required_evidence: ["fresh entity revision"],
    failure_recovery: "Reload the entity and re-run the dry-run before confirming.",
  },
  {
    id: "restore-required",
    owner: "Recovery",
    applies_when: "Acceptance depends on backup or restore rehearsal freshness.",
    risk: "high",
    required_evidence: ["backup manifest", "restore rehearsal result"],
    failure_recovery: "Run backup and restore-check before release or portfolio work.",
  },
];

export function gateCatalogIds(): StudioGateId[] {
  return GATE_CATALOG.map((gate) => gate.id);
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

export interface WorkflowExecutionStep {
  command: string;
  status: ResultEnvelope["status"];
  entity_id?: string;
  prepared_action_id?: string;
}

export interface WorkflowExecutionReport {
  id: string;
  name: string;
  ok: boolean;
  root: string;
  steps: WorkflowExecutionStep[];
  entity_count: number;
  event_count: number;
  prepared_action_count: number;
  coverage: WorkflowVerification;
}

export async function executeWorkflowFixtures(input: { workflowId?: string } = {}): Promise<{
  ok: boolean;
  mode: "executed-fixtures";
  workflows: WorkflowExecutionReport[];
}> {
  const selected = input.workflowId
    ? WORKFLOW_REQUIREMENTS.filter((workflow) => workflow.id === input.workflowId)
    : WORKFLOW_REQUIREMENTS;
  if (selected.length === 0) {
    throw new Error(`Unknown workflow fixture: ${input.workflowId}`);
  }
  const workflows: WorkflowExecutionReport[] = [];
  for (const workflow of selected) {
    workflows.push(await executeSingleWorkflowFixture(workflow.id));
  }
  return {
    ok: workflows.every((workflow) => workflow.ok),
    mode: "executed-fixtures",
    workflows,
  };
}

async function executeSingleWorkflowFixture(workflowId: string): Promise<WorkflowExecutionReport> {
  const root = await createWorkflowFixtureRoot(workflowId);
  const context = await createStudioContext(root);
  const steps: WorkflowExecutionStep[] = [];
  const run = async (
    command: string,
    payload: Record<string, unknown>,
    targetId?: string,
  ): Promise<ResultEnvelope> => {
    const result = await executeStudioCommand(
      context,
      createStudioCommand(context, {
        command,
        actor: operatorActor(context.config.operator_id),
        payload,
        ...(targetId ? { targetId } : {}),
        idempotencyKey: `${workflowId}:${steps.length + 1}:${command}`,
      }),
    );
    const resultObject =
      result.result && typeof result.result === "object"
        ? (result.result as Record<string, unknown>)
        : {};
    steps.push({
      command,
      status: result.status,
      ...(typeof resultObject["entity_id"] === "string"
        ? { entity_id: resultObject["entity_id"] }
        : {}),
      ...(typeof resultObject["id"] === "string" ? { prepared_action_id: resultObject["id"] } : {}),
    });
    if (!["ok", "warning", "confirmation_required"].includes(result.status)) {
      throw new Error(
        `Workflow fixture ${workflowId} command ${command} failed: ${result.error?.message}`,
      );
    }
    return result;
  };
  const executor = WORKFLOW_EXECUTORS[workflowId];
  if (!executor) {
    throw new Error(`Workflow fixture executor is missing: ${workflowId}`);
  }
  await executor(run);
  const entities = (await context.entities.scan()).map((file) => file.entity);
  const coverage = verifyWorkflowCoverage(entities).find((entry) => entry.id === workflowId);
  if (!coverage) {
    throw new Error(`Workflow coverage not found after execution: ${workflowId}`);
  }
  const preparedActions = await new PreparedActionService(context).list();
  return {
    id: coverage.id,
    name: coverage.name,
    ok: coverage.ok && steps.every((step) => ["ok", "warning"].includes(step.status)),
    root,
    steps,
    entity_count: entities.length,
    event_count: (await context.events.list()).length,
    prepared_action_count: preparedActions.length,
    coverage,
  };
}

type WorkflowRunner = (
  run: (
    command: string,
    payload: Record<string, unknown>,
    targetId?: string,
  ) => Promise<ResultEnvelope>,
) => Promise<void>;

const WORKFLOW_EXECUTORS: Record<string, WorkflowRunner> = {
  "prospect-to-client": async (run) => {
    const organization = entityResult(
      await run("entity.create", { kind: "organization", title: "Fixture Agency" }),
    );
    const prospect = entityResult(
      await run("entity.create", { kind: "prospect", title: "Fixture Agency lead" }),
    );
    await run("crm.review-duplicates", { title: "Fixture Agency" });
    const opportunity = entityResult(
      await run("entity.create", { kind: "opportunity", title: "Fixture WordPress build" }),
    );
    await run("proposal.prepare", { opportunity_id: opportunity });
    await run("communication.prepare", {
      subject_id: prospect,
      channel: "email",
      message: "Prepared local outreach fixture.",
    });
    await run("entity.create", {
      kind: "communication",
      title: "Fixture Agency outreach record",
    });
    await run("opportunity.convert", {
      opportunity_id: opportunity,
      client_title: "Fixture Agency",
      engagement_title: "Fixture Agency WordPress engagement",
    });
    await run("evidence.register", {
      title: "Fixture prospect acceptance",
      evidence_type: "manual",
      subject_id: organization,
      claims: ["Fixture prospect accepted scope"],
    });
  },
  "multi-site-engagement": async (run) => {
    await run("entity.create", { kind: "client", title: "Fixture Client" });
    const engagement = entityResult(
      await run("entity.create", { kind: "engagement", title: "Fixture multi-site engagement" }),
    );
    const contract = entityResult(
      await run("contract.create-from-engagement", {
        engagement_id: engagement,
        value_minor: 240_000,
        currency: "USD",
      }),
    );
    const invoice = entityResult(
      await run("invoice.create-for-contract", {
        contract_id: contract,
        amount_minor: 120_000,
        currency: "USD",
        reference: "FIX-INV-001",
      }),
    );
    await run("payment.record-for-invoice", {
      invoice_id: invoice,
      amount_minor: 120_000,
      currency: "USD",
    });
    const project = entityResult(
      await run("entity.create", { kind: "project", title: "Fixture delivery project" }),
    );
    await run("project.register-repo", {
      project_id: project,
      title: "Fixture delivery repository",
      repository_path: ".",
      remote_policy: "allowed",
    });
    const evidence = entityResult(
      await run("evidence.register", {
        title: "Fixture delivery acceptance",
        evidence_type: "manual",
        claims: ["Fixture delivery accepted"],
      }),
    );
    const deliverable = entityResult(
      await run("entity.create", { kind: "deliverable", title: "Fixture accepted deliverable" }),
    );
    await run(
      "deliverable.complete",
      {
        deliverable_id: deliverable,
        evidence_ids: [evidence],
      },
      deliverable,
    );
  },
  "work-to-opportunity": async (run) => {
    const deliverable = entityResult(
      await run("entity.create", { kind: "deliverable", title: "Fixture completed work" }),
    );
    const evidence = entityResult(
      await run("evidence.register", {
        title: "Fixture completed work proof",
        evidence_type: "manual",
        claims: ["Fixture completed work proof"],
      }),
    );
    await run("deliverable.complete", { deliverable_id: deliverable, evidence_ids: [evidence] });
    await run("case.create-from-evidence", {
      evidence_id: evidence,
      title: "Fixture completed work case",
    });
    const campaign = entityResult(
      await run("entity.create", { kind: "campaign", title: "Fixture case campaign" }),
    );
    await run("content.prepare", {
      campaign_id: campaign,
      title: "Fixture case post",
      channel: "linkedin",
      public_claims: ["Fixture completed work proof"],
      evidence_ids: [evidence],
    });
    await run("entity.create", { kind: "prospect", title: "Fixture follow-on prospect" });
  },
  "plugin-release-case": async (run) => {
    const product = entityResult(
      await run("entity.create", { kind: "product", title: "Fixture Plugin" }),
    );
    const release = entityResult(
      await run("release.prepare", { product_id: product, version: "1.0.0-fixture" }),
    );
    const evidence = entityResult(
      await run("evidence.register", {
        title: "Fixture release tests",
        evidence_type: "manual",
        claims: ["Fixture release tests passed"],
      }),
    );
    await run("release.publish", { release_id: release, evidence_ids: [evidence] }, release);
    await run("entity.create", { kind: "repository", title: "Fixture plugin repository" });
    await run("entity.create", { kind: "environment", title: "Fixture WordPress environment" });
    await run("case.create-from-evidence", {
      evidence_id: evidence,
      title: "Fixture release case",
    });
    await run("entity.create", { kind: "campaign", title: "Fixture release campaign" });
    await run("entity.create", { kind: "prospect", title: "Fixture plugin prospect" });
  },
  "international-application": async (run) => {
    const organization = entityResult(
      await run("entity.create", { kind: "organization", title: "Fixture International Co" }),
    );
    const application = entityResult(
      await run("application.prepare", {
        title: "Fixture international application",
        source_url: "https://example.com/jobs/fixture",
        organization_id: organization,
      }),
    );
    await run("evidence.register", {
      title: "Fixture application evidence matrix",
      evidence_type: "manual",
      subject_id: application,
      claims: ["Fixture application materials match role"],
    });
    await run("communication.prepare", {
      subject_id: application,
      channel: "email",
      message: "Prepared local application follow-up.",
    });
    await run("entity.create", { kind: "communication", title: "Fixture application receipt" });
    await run("entity.create", { kind: "task", title: "Fixture application follow-up task" });
  },
  "visual-feedback": async (run) => {
    await run("entity.create", { kind: "project", title: "Fixture visual project" });
    const task = entityResult(
      await run("entity.create", { kind: "task", title: "Fixture visual implementation task" }),
    );
    const evidence = entityResult(
      await run("evidence.register", {
        title: "Fixture visual before-after approval",
        evidence_type: "manual",
        claims: ["Fixture visual implementation approved"],
      }),
    );
    await run("decision.record", {
      title: "Fixture visual approval decision",
      decision: "Visual implementation accepted for fixture.",
      evidence_ids: [evidence],
    });
    await run("handoff.create", {
      task_id: task,
      title: "Fixture visual handoff",
      objective: "Continue from approved visual fixture.",
      summary: "Use the visual evidence before changing implementation.",
    });
  },
  "security-incident": async (run) => {
    const repository = entityResult(
      await run("entity.create", { kind: "repository", title: "Fixture incident repository" }),
    );
    const task = entityResult(
      await run("entity.create", { kind: "task", title: "Fixture security incident task" }),
    );
    const evidence = entityResult(
      await run("evidence.register", {
        title: "Fixture redacted forensics",
        evidence_type: "manual",
        claims: ["Fixture redacted forensics captured"],
      }),
    );
    await run("decision.record", {
      title: "Fixture incident containment decision",
      decision: "Incident remains contained in fixture.",
      evidence_ids: [evidence],
    });
    await run("handoff.create", {
      task_id: task,
      title: "Fixture incident handoff",
      objective: "Continue recovery from redacted evidence.",
      summary: "Review forensics and prevention evidence first.",
      repository_ids: [repository],
    });
  },
  "agent-handoff": async (run) => {
    const repository = entityResult(
      await run("entity.create", { kind: "repository", title: "Fixture handoff repository" }),
    );
    const task = entityResult(
      await run("entity.create", { kind: "task", title: "Fixture handoff task" }),
    );
    const evidence = entityResult(
      await run("evidence.register", {
        title: "Fixture context pack evidence",
        evidence_type: "manual",
        claims: ["Fixture context pack accepted"],
      }),
    );
    await run("decision.record", {
      title: "Fixture handoff decision",
      decision: "New agent starts from context pack fixture.",
      evidence_ids: [evidence],
    });
    await run("handoff.create", {
      task_id: task,
      title: "Fixture agent handoff",
      objective: "Resume from context pack.",
      summary: "Use repository health and evidence before changes.",
      repository_ids: [repository],
    });
  },
};

async function createWorkflowFixtureRoot(workflowId: string): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), `studio-workflow-${workflowId}-`));
  await writeFile(
    path.join(root, "studio.config.yaml"),
    [
      "api_version: studio.guilherme.dev/config-v1",
      `root_name: Workflow fixture ${workflowId}`,
      "operator_id: per_20260614_guilherme-silva",
      "canonical_roots:",
      "  - data",
      "  - clients",
      "  - products",
      "  - portfolio",
      "  - marketing",
      "  - sales",
      "  - career",
      "  - operations",
      "  - docs/studio-os",
      "runtime_path: runtime",
      "panel:",
      "  host: 127.0.0.1",
      "  port: 47839",
      "adapters: {}",
      "",
    ].join("\n"),
  );
  return root;
}

function entityResult(result: ResultEnvelope): string {
  const value =
    result.result && typeof result.result === "object"
      ? (result.result as Record<string, unknown>)
      : {};
  if (typeof value["entity_id"] === "string") {
    return value["entity_id"];
  }
  const entity = value["entity"];
  if (entity && typeof entity === "object") {
    const metadata = (entity as Record<string, unknown>)["metadata"];
    if (metadata && typeof metadata === "object") {
      const id = (metadata as Record<string, unknown>)["id"];
      if (typeof id === "string") {
        return id;
      }
    }
  }
  throw new Error(`Command did not return an entity id: ${JSON.stringify(result.result)}`);
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
        gate: "confidential-data",
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
        gate: input.destructive ? "destructive" : "external-confirmation",
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

export interface EvidenceValidationIssue {
  code:
    | "missing-evidence"
    | "missing-claim"
    | "missing-checksum"
    | "mutable-source"
    | "subject-mismatch";
  evidence_id?: string;
  claim?: string;
  message: string;
}

export interface EvidenceValidationResult {
  ok: boolean;
  issues: EvidenceValidationIssue[];
}

export class EvidenceClaimService {
  validate(input: {
    claims?: string[];
    evidence: StudioEntity[];
    subjectId?: string;
    publicClaim?: boolean;
  }): EvidenceValidationResult {
    const claims = uniqueStrings(input.claims ?? []);
    const issues: EvidenceValidationIssue[] = [];
    if ((input.publicClaim || claims.length > 0) && input.evidence.length === 0) {
      issues.push({
        code: "missing-evidence",
        message: "Public claims require at least one evidence record.",
      });
    }
    const evidenceClaims = new Set(
      input.evidence.flatMap((entity) =>
        Array.isArray((entity.spec as Record<string, unknown>)["claims"])
          ? ((entity.spec as Record<string, unknown>)["claims"] as unknown[]).filter(
              (value): value is string => typeof value === "string" && value.length > 0,
            )
          : [],
      ),
    );
    for (const claim of claims) {
      if (!evidenceClaims.has(claim)) {
        issues.push({
          code: "missing-claim",
          claim,
          message: `No evidence record explicitly supports claim: ${claim}`,
        });
      }
    }
    for (const entity of input.evidence) {
      const spec = entity.spec as Record<string, unknown>;
      const type = spec["evidence_type"];
      const checksum = spec["checksum"];
      const mutability = spec["source_mutability"];
      const subjectId = spec["subject_id"];
      if (
        ["file", "screenshot", "backup"].includes(typeof type === "string" ? type : "") &&
        typeof checksum !== "string"
      ) {
        issues.push({
          code: "missing-checksum",
          evidence_id: entityId(entity),
          message: `Evidence ${entityId(entity)} requires a checksum.`,
        });
      }
      if (mutability === "mutable" && typeof checksum !== "string") {
        issues.push({
          code: "mutable-source",
          evidence_id: entityId(entity),
          message: `Mutable evidence ${entityId(entity)} requires a checksum or snapshot.`,
        });
      }
      if (input.subjectId && subjectId && subjectId !== input.subjectId) {
        issues.push({
          code: "subject-mismatch",
          evidence_id: entityId(entity),
          message: `Evidence ${entityId(entity)} is attached to ${subjectId}, not ${input.subjectId}.`,
        });
      }
    }
    return { ok: issues.length === 0, issues };
  }
}

export type AcceptanceCheckStatus = "pass" | "warn" | "block" | "not_checked";

export interface AcceptanceCheck {
  name: string;
  status: AcceptanceCheckStatus;
  summary: string;
  remediation?: string;
  detail?: unknown;
}

export interface StudioAcceptanceReport {
  ok: boolean;
  generated_at: string;
  checks: AcceptanceCheck[];
  blockers: string[];
  coverage_summary: PrdCoverageReport["summary"];
  workflow_summary: {
    ok: boolean;
    total: number;
    failed: string[];
  };
  portfolio_release: {
    allowed: boolean;
    reasons: string[];
  };
}

export function evaluateStudioAcceptance(input: {
  coverage: PrdCoverageReport;
  workflowOk: boolean;
  workflowFailures?: string[];
  validationOk: boolean;
  repositoryOk: boolean;
  backupOk: boolean;
  panelSmokeOk?: boolean;
  mcpSmokeOk?: boolean;
  explicitDeferralsOk?: boolean;
  detail?: Record<string, unknown>;
}): StudioAcceptanceReport {
  const checks: AcceptanceCheck[] = [
    {
      name: "coverage",
      status: input.coverage.summary.missing_capability === 0 ? "pass" : "block",
      summary: `${input.coverage.summary.capability_complete} PRDs have implemented capability; ${input.coverage.summary.intake_required} still need real intake.`,
      remediation: "Implement missing capability or register explicit decision deferrals.",
      detail: input.coverage.summary,
    },
    {
      name: "workflows",
      status: input.workflowOk ? "pass" : "block",
      summary: input.workflowOk
        ? "Executable workflow fixtures pass."
        : "Workflow fixtures failed.",
      remediation: "Run studio workflow --fixtures --execute --json and fix failed journeys.",
      detail: input.workflowFailures ?? [],
    },
    {
      name: "canonical_data",
      status: input.validationOk ? "pass" : "block",
      summary: input.validationOk ? "Canonical records validate." : "Canonical validation failed.",
      remediation: "Run studio validate and fix invalid records.",
    },
    {
      name: "repositories",
      status: input.repositoryOk ? "pass" : "block",
      summary: input.repositoryOk
        ? "Registered repositories are clean."
        : "Repository health blocks acceptance.",
      remediation:
        "Resolve dirty state, root mismatch, branch mismatch or remote-policy violation.",
      detail: input.detail?.["repositories"],
    },
    {
      name: "backup_restore",
      status: input.backupOk ? "pass" : "block",
      summary: input.backupOk
        ? "Backup evidence is present."
        : "Backup or restore evidence is missing.",
      remediation: "Run studio backup and WordPress restore-check before portfolio release.",
      detail: input.detail?.["backup"],
    },
    {
      name: "panel_smoke",
      status:
        input.panelSmokeOk === undefined ? "not_checked" : input.panelSmokeOk ? "pass" : "block",
      summary:
        input.panelSmokeOk === undefined
          ? "Panel smoke was not provided to acceptance."
          : input.panelSmokeOk
            ? "Panel smoke passed."
            : "Panel smoke failed.",
      remediation: "Run the Playwright panel smoke on the final path.",
    },
    {
      name: "mcp_smoke",
      status: input.mcpSmokeOk === undefined ? "not_checked" : input.mcpSmokeOk ? "pass" : "block",
      summary:
        input.mcpSmokeOk === undefined
          ? "MCP smoke was not provided to acceptance."
          : input.mcpSmokeOk
            ? "MCP smoke passed."
            : "MCP smoke failed.",
      remediation: "Run MCP smoke against the final Studio root.",
    },
    {
      name: "deferrals",
      status: input.explicitDeferralsOk ? "pass" : "warn",
      summary: input.explicitDeferralsOk
        ? "Intake gaps are accepted by explicit decision."
        : "Real-data intake gaps remain visible and are not fabricated.",
      remediation:
        "Record decision deferrals or collect real intake before declaring full data readiness.",
    },
  ];
  const blockers = checks
    .filter((check) => check.status === "block" || check.status === "not_checked")
    .map((check) => check.name);
  const portfolioReasons = blockers.length > 0 ? blockers : ["All acceptance checks passed."];
  return {
    ok: blockers.length === 0,
    generated_at: nowIso(),
    checks,
    blockers,
    coverage_summary: input.coverage.summary,
    workflow_summary: {
      ok: input.workflowOk,
      total: WORKFLOW_REQUIREMENTS.length,
      failed: input.workflowFailures ?? [],
    },
    portfolio_release: {
      allowed: blockers.length === 0,
      reasons: portfolioReasons,
    },
  };
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
