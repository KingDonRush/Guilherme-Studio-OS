import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";

export const STUDIO_SCHEMA_VERSION = "studio.guilherme.dev/v1" as const;
export const LEGACY_STUDIO_SCHEMA_VERSION = "studio.guilherme.dev/entity-v1" as const;

export const EntityKindSchema = z.enum([
  "person",
  "organization",
  "prospect",
  "client",
  "opportunity",
  "jobApplication",
  "engagement",
  "deliverable",
  "project",
  "repository",
  "environment",
  "product",
  "release",
  "portfolioCase",
  "evidence",
  "campaign",
  "contentItem",
  "proposal",
  "contract",
  "invoice",
  "payment",
  "task",
  "decision",
  "asset",
  "communication",
  "agentRun",
]);

export type EntityKind = z.infer<typeof EntityKindSchema>;

export const ENTITY_PREFIX: Record<EntityKind, string> = {
  person: "per",
  organization: "org",
  prospect: "pro",
  client: "cli",
  opportunity: "opp",
  jobApplication: "app",
  engagement: "eng",
  deliverable: "del",
  project: "prj",
  repository: "repo",
  environment: "env",
  product: "prod",
  release: "rel",
  portfolioCase: "case",
  evidence: "evd",
  campaign: "cmp",
  contentItem: "cnt",
  proposal: "prp",
  contract: "ctr",
  invoice: "inv",
  payment: "pay",
  task: "tsk",
  decision: "dec",
  asset: "ast",
  communication: "com",
  agentRun: "run",
};

export const ClassificationSchema = z.enum(["public", "internal", "confidential", "secret"]);
export type Classification = z.infer<typeof ClassificationSchema>;

export const CapabilitySchema = z.enum([
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
]);
export type Capability = z.infer<typeof CapabilitySchema>;

export const ActorSchema = z
  .object({
    id: z.string().min(3),
    type: z.enum(["human", "agent", "cli", "panel", "automation", "adapter"]),
    capabilities: z.array(CapabilitySchema).default([]),
    classification_ceiling: ClassificationSchema.default("internal"),
    delegated_by: z.string().optional(),
    delegated_at: z.string().datetime().optional(),
    expires_at: z.string().datetime().optional(),
  })
  .strict();
export type Actor = z.infer<typeof ActorSchema>;

export const LifecycleStateSchema = z.enum([
  "draft",
  "active",
  "waiting",
  "blocked",
  "done",
  "archived",
  "lost",
  "won",
  "published",
  "paid",
  "cancelled",
]);
export type LifecycleState = z.infer<typeof LifecycleStateSchema>;

export const RelationSchema = z
  .object({
    type: z.string().min(1),
    target_id: z.string().min(1),
    note: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export const LegacyRelationSchema = z
  .object({
    type: z.string().min(1),
    targetId: z.string().min(1),
    note: z.string().optional(),
  })
  .strict();

export const EntityMetadataSchema = z
  .object({
    id: z.string().min(3),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    schema_version: z.number().int().min(1).default(1),
    revision: z.number().int().min(1).default(1),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    owner_id: z.string().optional(),
    classification: ClassificationSchema.default("internal"),
    labels: z.array(z.string()).default([]),
    archived_at: z.string().datetime().nullable().optional(),
  })
  .strict();

export const GenericSpecSchema = z
  .object({
    title: z.string().min(1),
    status: LifecycleStateSchema.default("active"),
    summary: z.string().optional(),
  })
  .catchall(z.unknown());

export const EvidenceSpecSchema = GenericSpecSchema.extend({
  evidence_type: z.enum(["file", "url", "command", "screenshot", "backup", "decision", "manual"]),
  path: z.string().optional(),
  url: z.string().url().optional(),
  command: z.string().optional(),
  checksum: z.string().optional(),
  observed_at: z.string().datetime().optional(),
});

export const TaskSpecSchema = GenericSpecSchema.extend({
  priority: z.enum(["now", "high", "normal", "low"]).default("normal"),
  economic_reason: z.string().optional(),
  acceptance: z.array(z.string()).default([]),
  blocked_by: z.array(z.string()).default([]),
});

export const AgentRunSpecSchema = GenericSpecSchema.extend({
  objective: z.string().min(1),
  started_at: z.string().datetime(),
  finished_at: z.string().datetime().optional(),
  result: z.enum(["running", "complete", "blocked", "failed"]).default("running"),
  evidence_ids: z.array(z.string()).default([]),
  model: z.string().optional(),
});

const BaseCanonicalEntitySchema = z
  .object({
    api_version: z.literal(STUDIO_SCHEMA_VERSION).default(STUDIO_SCHEMA_VERSION),
    kind: EntityKindSchema,
    metadata: EntityMetadataSchema,
    spec: GenericSpecSchema,
    relations: z.array(RelationSchema).default([]),
    extensions: z.record(z.string(), z.unknown()).default({}),
  })
  .strict();

export const TypedEntitySchema = z.discriminatedUnion("kind", [
  BaseCanonicalEntitySchema.extend({ kind: z.literal("evidence"), spec: EvidenceSpecSchema }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("task"), spec: TaskSpecSchema }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("agentRun"), spec: AgentRunSpecSchema }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("person") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("organization") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("prospect") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("client") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("opportunity") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("jobApplication") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("engagement") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("deliverable") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("project") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("repository") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("environment") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("product") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("release") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("portfolioCase") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("campaign") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("contentItem") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("proposal") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("contract") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("invoice") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("payment") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("decision") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("asset") }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("communication") }),
]);

export type StudioEntity = z.infer<typeof TypedEntitySchema>;
export type StudioRelation = z.infer<typeof RelationSchema>;

export const LegacyEntitySchema = z
  .object({
    apiVersion: z.literal(LEGACY_STUDIO_SCHEMA_VERSION),
    kind: EntityKindSchema,
    id: z.string().min(3),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    status: LifecycleStateSchema.default("active"),
    classification: ClassificationSchema.default("internal"),
    revision: z.number().int().min(1).default(1),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    archivedAt: z.string().datetime().optional(),
    ownerId: z.string().optional(),
    summary: z.string().optional(),
    labels: z.array(z.string()).default([]),
    relations: z.array(LegacyRelationSchema).default([]),
    data: z.record(z.string(), z.unknown()).default({}),
  })
  .strict();

export type LegacyEntity = z.infer<typeof LegacyEntitySchema>;

export const EventSchema = z
  .object({
    api_version: z
      .literal("studio.guilherme.dev/event-v1")
      .default("studio.guilherme.dev/event-v1"),
    id: z.string().min(3),
    type: z.string().min(1),
    request_id: z.string().optional(),
    command_id: z.string().optional(),
    correlation_id: z.string().optional(),
    entity_id: z.string().optional(),
    actor_id: z.string().optional(),
    created_at: z.string().datetime(),
    classification: ClassificationSchema.default("internal"),
    data: z.record(z.string(), z.unknown()).default({}),
  })
  .strict();
export type StudioEvent = z.infer<typeof EventSchema>;

export const GateDecisionSchema = z
  .object({
    gate: z.string().default("general"),
    result: z.enum(["allow", "warn", "require_confirmation", "block"]),
    reason: z.string(),
    capability_required: CapabilitySchema.optional(),
    evidence_required: z.array(z.string()).default([]),
    confirmation_scope: z.string().optional(),
  })
  .strict();
export type GateDecision = z.infer<typeof GateDecisionSchema>;

export const CommandEnvelopeSchema = z
  .object({
    api_version: z
      .literal("studio.guilherme.dev/command-v1")
      .default("studio.guilherme.dev/command-v1"),
    id: z.string().min(3),
    request_id: z.string().min(3),
    command: z.string().min(1),
    actor: ActorSchema,
    target_id: z.string().optional(),
    expected_revision: z.number().int().min(1).optional(),
    idempotency_key: z.string().min(8).max(200).optional(),
    dry_run: z.boolean().default(false),
    payload: z.record(z.string(), z.unknown()).default({}),
    created_at: z.string().datetime(),
  })
  .strict();
export type CommandEnvelope = z.infer<typeof CommandEnvelopeSchema>;

export const PreparedActionSchema = z
  .object({
    api_version: z
      .literal("studio.guilherme.dev/prepared-action-v1")
      .default("studio.guilherme.dev/prepared-action-v1"),
    id: z.string().min(3),
    action_type: z.string().min(1),
    provider: z.string().optional(),
    target: z.string().optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    expires_at: z.string().datetime(),
    actor_id: z.string().optional(),
    source_revisions: z.record(z.string(), z.number().int().min(1)).default({}),
    payload: z.record(z.string(), z.unknown()).default({}),
    payload_checksum: z.string().regex(/^[a-f0-9]{64}$/),
    status: z
      .enum([
        "draft",
        "validated",
        "awaiting_confirmation",
        "confirmed",
        "executing",
        "executed",
        "reconciled",
        "failed",
        "expired",
        "cancelled",
        "superseded",
      ])
      .default("awaiting_confirmation"),
    confirmation_id: z.string().optional(),
    confirmed_at: z.string().datetime().optional(),
    execution_started_at: z.string().datetime().optional(),
    executed_at: z.string().datetime().optional(),
    reconciled_at: z.string().datetime().optional(),
    failure: z.string().optional(),
    reconciliation: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();
export type PreparedAction = z.infer<typeof PreparedActionSchema>;

export const EvidenceReferenceSchema = z
  .object({
    id: z.string().min(3),
    claim: z.string().optional(),
    reliability: z.enum(["observed", "verified", "reported", "inferred"]).default("observed"),
    checksum: z
      .string()
      .regex(/^[a-f0-9]{64}$/)
      .optional(),
  })
  .strict();
export type EvidenceReference = z.infer<typeof EvidenceReferenceSchema>;

export const ResultStatusSchema = z.enum([
  "ok",
  "warning",
  "confirmation_required",
  "blocked",
  "conflict",
  "error",
]);
export type ResultStatus = z.infer<typeof ResultStatusSchema>;

export const StudioErrorSchema = z
  .object({
    code: z.string().min(1),
    message: z.string().min(1),
    details: z.record(z.string(), z.unknown()).default({}),
  })
  .strict();
export type StudioError = z.infer<typeof StudioErrorSchema>;

export const ResultEnvelopeSchema = z
  .object({
    api_version: z.literal("studio.guilherme.dev/v1").default("studio.guilherme.dev/v1"),
    request_id: z.string().min(3),
    status: ResultStatusSchema,
    result: z.unknown().nullable().default(null),
    warnings: z.array(z.string()).default([]),
    required_actions: z.array(z.string()).default([]),
    evidence: z.array(EvidenceReferenceSchema).default([]),
    projection_revision: z.number().int().min(0).default(0),
    error: StudioErrorSchema.optional(),
  })
  .strict();
export type ResultEnvelope = z.infer<typeof ResultEnvelopeSchema>;

export const AdapterRequestSchema = z
  .object({
    api_version: z
      .literal("studio.guilherme.dev/adapter-request-v1")
      .default("studio.guilherme.dev/adapter-request-v1"),
    request_id: z.string().min(3),
    adapter: z.string().min(1),
    operation: z.string().min(1),
    actor: ActorSchema,
    dry_run: z.boolean().default(false),
    payload: z.record(z.string(), z.unknown()).default({}),
  })
  .strict();
export type AdapterRequest = z.infer<typeof AdapterRequestSchema>;

export const AdapterResultSchema = z
  .object({
    api_version: z
      .literal("studio.guilherme.dev/adapter-result-v1")
      .default("studio.guilherme.dev/adapter-result-v1"),
    request_id: z.string().min(3),
    adapter: z.string().min(1),
    operation: z.string().min(1),
    status: z.enum(["ok", "warning", "blocked", "error"]),
    data: z.unknown().nullable().default(null),
    evidence: z.array(EvidenceReferenceSchema).default([]),
    error: StudioErrorSchema.optional(),
  })
  .strict();
export type AdapterResult = z.infer<typeof AdapterResultSchema>;

export function nowIso(): string {
  return new Date().toISOString();
}

export function dateStamp(input = new Date()): string {
  return input.toISOString().slice(0, 10).replaceAll("-", "");
}

export function createEntityId(kind: EntityKind, seed?: string, createdAt?: string): string {
  const prefix = ENTITY_PREFIX[kind];
  const stamp = createdAt ? createdAt.slice(0, 10).replaceAll("-", "") : dateStamp();
  if (!seed) {
    return `${prefix}_${stamp}_${randomUUID().replaceAll("-", "").slice(0, 12)}`;
  }
  return `${prefix}_${stamp}_${slugify(seed)}`;
}

export function createRecordId(
  prefix: "act" | "cmd" | "evt" | "req" | "cnf",
  seed?: string,
): string {
  const stamp = dateStamp();
  if (!seed) {
    return `${prefix}_${stamp}_${randomUUID().replaceAll("-", "").slice(0, 12)}`;
  }
  const digest = createHash("sha256").update(`${prefix}:${seed}`).digest("hex").slice(0, 12);
  return `${prefix}_${stamp}_${digest}`;
}

export function slugify(input: string): string {
  const normalized = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
  return normalized || "item";
}

function camelToSnake(input: string): string {
  return input.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

function normalizeSpecValue(value: unknown, idMap: Record<string, string> = {}): unknown {
  if (typeof value === "string") {
    return idMap[value] ?? value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalizeSpecValue(item, idMap));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        camelToSnake(key),
        normalizeSpecValue(item, idMap),
      ]),
    );
  }
  return value;
}

export function normalizeSpecData(
  value: Record<string, unknown>,
  idMap: Record<string, string> = {},
): Record<string, unknown> {
  return normalizeSpecValue(value, idMap) as Record<string, unknown>;
}

export function createEntity(input: {
  kind: EntityKind;
  title: string;
  slug?: string;
  id?: string;
  status?: LifecycleState;
  classification?: Classification;
  ownerId?: string;
  summary?: string;
  labels?: string[];
  relations?: StudioRelation[];
  spec?: Record<string, unknown>;
  data?: Record<string, unknown>;
  extensions?: Record<string, unknown>;
}): StudioEntity {
  const timestamp = nowIso();
  const slug = input.slug ?? slugify(input.title);
  return TypedEntitySchema.parse({
    api_version: STUDIO_SCHEMA_VERSION,
    kind: input.kind,
    metadata: {
      id: input.id ?? createEntityId(input.kind, slug, timestamp),
      slug,
      schema_version: 1,
      revision: 1,
      created_at: timestamp,
      updated_at: timestamp,
      owner_id: input.ownerId,
      classification: input.classification ?? "internal",
      labels: input.labels ?? [],
      archived_at: null,
    },
    spec: {
      title: input.title,
      status: input.status ?? "active",
      ...(input.summary ? { summary: input.summary } : {}),
      ...(input.data ? normalizeSpecData(input.data) : {}),
      ...(input.spec ?? {}),
    },
    relations: input.relations ?? [],
    extensions: input.extensions ?? {},
  });
}

export function canonicalIdForLegacy(entity: LegacyEntity): string {
  if (entity.id.startsWith(`${ENTITY_PREFIX[entity.kind]}_`)) {
    const documentedPrefix = ENTITY_PREFIX[entity.kind];
    const [, maybeStamp, ...rest] = entity.id.split("_");
    if (
      maybeStamp &&
      /^\d{8}$/.test(maybeStamp) &&
      rest.length > 0 &&
      entity.id.startsWith(`${documentedPrefix}_`)
    ) {
      return entity.id;
    }
  }
  return createEntityId(entity.kind, entity.slug, entity.createdAt);
}

export function legacyToCanonical(
  legacy: LegacyEntity,
  idMap: Record<string, string> = {},
): StudioEntity {
  const canonicalId = idMap[legacy.id] ?? canonicalIdForLegacy(legacy);
  const previousIds = canonicalId === legacy.id ? [] : [legacy.id];
  return TypedEntitySchema.parse({
    api_version: STUDIO_SCHEMA_VERSION,
    kind: legacy.kind,
    metadata: {
      id: canonicalId,
      slug: legacy.slug,
      schema_version: 1,
      revision: legacy.revision,
      created_at: legacy.createdAt,
      updated_at: legacy.updatedAt,
      owner_id: legacy.ownerId ? (idMap[legacy.ownerId] ?? legacy.ownerId) : undefined,
      classification: legacy.classification,
      labels: legacy.labels,
      archived_at: legacy.archivedAt ?? null,
    },
    spec: {
      title: legacy.title,
      status: legacy.status,
      ...(legacy.summary ? { summary: legacy.summary } : {}),
      ...normalizeSpecData(legacy.data, idMap),
    },
    relations: legacy.relations.map((relation) => ({
      type: relation.type,
      target_id: idMap[relation.targetId] ?? relation.targetId,
      ...(relation.note ? { note: relation.note } : {}),
    })),
    extensions:
      previousIds.length > 0
        ? { migration: { previous_ids: previousIds, migrated_from: LEGACY_STUDIO_SCHEMA_VERSION } }
        : {},
  });
}

export function entityId(entity: StudioEntity): string {
  return entity.metadata.id;
}

export function entitySlug(entity: StudioEntity): string {
  return entity.metadata.slug;
}

export function entityTitle(entity: StudioEntity): string {
  return entity.spec.title;
}

export function entityStatus(entity: StudioEntity): LifecycleState {
  return entity.spec.status;
}

export function entityClassification(entity: StudioEntity): Classification {
  return entity.metadata.classification;
}

export function entityRevision(entity: StudioEntity): number {
  return entity.metadata.revision;
}

export function entityUpdatedAt(entity: StudioEntity): string {
  return entity.metadata.updated_at;
}

export function entitySummary(entity: StudioEntity): string | undefined {
  return entity.spec.summary;
}

export function updateEntityMetadata(
  entity: StudioEntity,
  patch: Partial<StudioEntity["metadata"]>,
): StudioEntity {
  return TypedEntitySchema.parse({
    ...entity,
    metadata: {
      ...entity.metadata,
      ...patch,
    },
  });
}

const secretKeyPattern =
  /(api[_-]?key|token|secret|password|passwd|oauth|credential|private[_-]?key)/i;

export function findSecretLikePaths(value: unknown, path: string[] = []): string[] {
  const hits: string[] = [];
  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      hits.push(...findSecretLikePaths(entry, [...path, String(index)]));
    });
    return hits;
  }
  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      const nextPath = [...path, key];
      if (secretKeyPattern.test(key)) {
        hits.push(nextPath.join("."));
      }
      hits.push(...findSecretLikePaths(nested, nextPath));
    }
  }
  return [...new Set(hits)];
}

export function assertNoSecrets(value: unknown): void {
  const hits = findSecretLikePaths(value);
  if (hits.length > 0) {
    throw new Error(
      `Secret-like fields are not allowed in canonical Studio files: ${hits.join(", ")}`,
    );
  }
}

export const KIND_DIRECTORY: Record<EntityKind, string> = {
  person: "data/people",
  organization: "data/organizations",
  prospect: "sales/prospects",
  client: "clients",
  opportunity: "sales/opportunities",
  jobApplication: "career/applications",
  engagement: "clients",
  deliverable: "clients",
  project: "portfolio/projects",
  repository: "data/repositories",
  environment: "data/environments",
  product: "products",
  release: "products",
  portfolioCase: "portfolio/cases",
  evidence: "operations/records/evidence",
  campaign: "marketing/campaigns",
  contentItem: "marketing/content",
  proposal: "sales/proposals",
  contract: "operations/records/contracts",
  invoice: "operations/records/invoices",
  payment: "operations/records/payments",
  task: "operations/records/tasks",
  decision: "docs/studio-os/decisions",
  asset: "portfolio/assets",
  communication: "sales/communications",
  agentRun: "operations/records/agent-runs",
};

export function stableChecksum(value: unknown): string {
  return createHash("sha256").update(stableStringify(value)).digest("hex");
}

export function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`);
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(value);
}

export function createActor(input: Partial<Actor> & Pick<Actor, "id" | "type">): Actor {
  return ActorSchema.parse({
    capabilities: [],
    classification_ceiling: "internal",
    ...input,
  });
}

export function createCommandEnvelope(input: {
  command: string;
  actor: Actor;
  payload?: Record<string, unknown>;
  targetId?: string;
  expectedRevision?: number;
  idempotencyKey?: string;
  dryRun?: boolean;
  requestId?: string;
}): CommandEnvelope {
  const createdAt = nowIso();
  const requestId = input.requestId ?? createRecordId("req");
  return CommandEnvelopeSchema.parse({
    id: createRecordId("cmd", `${requestId}:${input.command}`),
    request_id: requestId,
    command: input.command,
    actor: input.actor,
    target_id: input.targetId,
    expected_revision: input.expectedRevision,
    idempotency_key: input.idempotencyKey,
    dry_run: input.dryRun ?? false,
    payload: input.payload ?? {},
    created_at: createdAt,
  });
}

export function createResultEnvelope(input: {
  requestId?: string;
  status?: ResultStatus;
  result?: unknown;
  warnings?: string[];
  requiredActions?: string[];
  evidence?: EvidenceReference[];
  projectionRevision?: number;
  error?: StudioError;
}): ResultEnvelope {
  return ResultEnvelopeSchema.parse({
    request_id: input.requestId ?? createRecordId("req"),
    status: input.status ?? "ok",
    result: input.result ?? null,
    warnings: input.warnings ?? [],
    required_actions: input.requiredActions ?? [],
    evidence: input.evidence ?? [],
    projection_revision: input.projectionRevision ?? 0,
    error: input.error,
  });
}
