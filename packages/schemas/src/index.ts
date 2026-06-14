import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";

export const STUDIO_SCHEMA_VERSION = "studio.guilherme.dev/entity-v1" as const;

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
  jobApplication: "job",
  engagement: "eng",
  deliverable: "del",
  project: "prj",
  repository: "rep",
  environment: "env",
  product: "prd",
  release: "rel",
  portfolioCase: "case",
  evidence: "evd",
  campaign: "cmp",
  contentItem: "cnt",
  proposal: "ppl",
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

export const RelationSchema = z
  .object({
    type: z.string().min(1),
    targetId: z.string().min(1),
    note: z.string().optional(),
  })
  .strict();

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

export const EntityBaseSchema = z
  .object({
    apiVersion: z.literal(STUDIO_SCHEMA_VERSION).default(STUDIO_SCHEMA_VERSION),
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
    relations: z.array(RelationSchema).default([]),
  })
  .strict();

export const GenericEntitySchema = EntityBaseSchema.extend({
  data: z.record(z.string(), z.unknown()).default({}),
}).strict();

export type GenericEntity = z.infer<typeof GenericEntitySchema>;

export const EvidenceDataSchema = z
  .object({
    evidenceType: z.enum(["file", "url", "command", "screenshot", "backup", "decision", "manual"]),
    path: z.string().optional(),
    url: z.string().url().optional(),
    command: z.string().optional(),
    checksum: z.string().optional(),
    observedAt: z.string().datetime().optional(),
  })
  .strict();

export const TaskDataSchema = z
  .object({
    priority: z.enum(["now", "high", "normal", "low"]).default("normal"),
    economicReason: z.string().optional(),
    acceptance: z.array(z.string()).default([]),
    blockedBy: z.array(z.string()).default([]),
  })
  .strict();

export const AgentRunDataSchema = z
  .object({
    objective: z.string().min(1),
    startedAt: z.string().datetime(),
    finishedAt: z.string().datetime().optional(),
    model: z.string().optional(),
    result: z.enum(["running", "complete", "blocked", "failed"]).default("running"),
    evidenceIds: z.array(z.string()).default([]),
  })
  .strict();

export const TypedEntitySchema = z.discriminatedUnion("kind", [
  GenericEntitySchema.extend({ kind: z.literal("evidence"), data: EvidenceDataSchema }),
  GenericEntitySchema.extend({ kind: z.literal("task"), data: TaskDataSchema }),
  GenericEntitySchema.extend({ kind: z.literal("agentRun"), data: AgentRunDataSchema }),
  GenericEntitySchema.extend({ kind: z.literal("person") }),
  GenericEntitySchema.extend({ kind: z.literal("organization") }),
  GenericEntitySchema.extend({ kind: z.literal("prospect") }),
  GenericEntitySchema.extend({ kind: z.literal("client") }),
  GenericEntitySchema.extend({ kind: z.literal("opportunity") }),
  GenericEntitySchema.extend({ kind: z.literal("jobApplication") }),
  GenericEntitySchema.extend({ kind: z.literal("engagement") }),
  GenericEntitySchema.extend({ kind: z.literal("deliverable") }),
  GenericEntitySchema.extend({ kind: z.literal("project") }),
  GenericEntitySchema.extend({ kind: z.literal("repository") }),
  GenericEntitySchema.extend({ kind: z.literal("environment") }),
  GenericEntitySchema.extend({ kind: z.literal("product") }),
  GenericEntitySchema.extend({ kind: z.literal("release") }),
  GenericEntitySchema.extend({ kind: z.literal("portfolioCase") }),
  GenericEntitySchema.extend({ kind: z.literal("campaign") }),
  GenericEntitySchema.extend({ kind: z.literal("contentItem") }),
  GenericEntitySchema.extend({ kind: z.literal("proposal") }),
  GenericEntitySchema.extend({ kind: z.literal("contract") }),
  GenericEntitySchema.extend({ kind: z.literal("invoice") }),
  GenericEntitySchema.extend({ kind: z.literal("payment") }),
  GenericEntitySchema.extend({ kind: z.literal("decision") }),
  GenericEntitySchema.extend({ kind: z.literal("asset") }),
  GenericEntitySchema.extend({ kind: z.literal("communication") }),
]);

export type StudioEntity = z.infer<typeof TypedEntitySchema>;

export const EventSchema = z
  .object({
    apiVersion: z.literal("studio.guilherme.dev/event-v1").default("studio.guilherme.dev/event-v1"),
    id: z.string().min(3),
    type: z.string().min(1),
    entityId: z.string().optional(),
    actorId: z.string().optional(),
    createdAt: z.string().datetime(),
    data: z.record(z.string(), z.unknown()).default({}),
  })
  .strict();
export type StudioEvent = z.infer<typeof EventSchema>;

export const GateDecisionSchema = z
  .object({
    result: z.enum(["allow", "warn", "require_confirmation", "block"]),
    reason: z.string(),
    evidenceRequired: z.array(z.string()).default([]),
  })
  .strict();
export type GateDecision = z.infer<typeof GateDecisionSchema>;

export const PreparedActionSchema = z
  .object({
    apiVersion: z
      .literal("studio.guilherme.dev/prepared-action-v1")
      .default("studio.guilherme.dev/prepared-action-v1"),
    id: z.string().min(3),
    actionType: z.string().min(1),
    createdAt: z.string().datetime(),
    expiresAt: z.string().datetime(),
    actorId: z.string().optional(),
    payload: z.record(z.string(), z.unknown()).default({}),
    status: z
      .enum(["prepared", "confirmed", "executed", "expired", "cancelled"])
      .default("prepared"),
  })
  .strict();
export type PreparedAction = z.infer<typeof PreparedActionSchema>;

export function nowIso(): string {
  return new Date().toISOString();
}

export function createEntityId(kind: EntityKind, seed?: string): string {
  const prefix = ENTITY_PREFIX[kind];
  if (!seed) {
    return `${prefix}_${randomUUID().replaceAll("-", "").slice(0, 20)}`;
  }
  const digest = createHash("sha256").update(`${kind}:${seed}`).digest("hex").slice(0, 20);
  return `${prefix}_${digest}`;
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
  relations?: z.infer<typeof RelationSchema>[];
  data?: Record<string, unknown>;
}): StudioEntity {
  const timestamp = nowIso();
  const slug = input.slug ?? slugify(input.title);
  return TypedEntitySchema.parse({
    apiVersion: STUDIO_SCHEMA_VERSION,
    kind: input.kind,
    id: input.id ?? createEntityId(input.kind, slug),
    slug,
    title: input.title,
    status: input.status ?? "active",
    classification: input.classification ?? "internal",
    revision: 1,
    createdAt: timestamp,
    updatedAt: timestamp,
    ownerId: input.ownerId,
    summary: input.summary,
    labels: input.labels ?? [],
    relations: input.relations ?? [],
    data: input.data ?? {},
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
