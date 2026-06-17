import type { Classification } from "../classification.js";
import { createEntityId, nowIso, slugify } from "../ids.js";
import { LEGACY_STUDIO_SCHEMA_VERSION, STUDIO_SCHEMA_VERSION } from "../versions.js";
import { ENTITY_PREFIX, type EntityKind } from "./kinds.js";
import type { LegacyEntity } from "./legacy.js";
import type { LifecycleState } from "./lifecycle.js";
import { normalizeSpecData } from "./normalization.js";
import type { StudioRelation } from "./relations.js";
import { type StudioEntity, TypedEntitySchema } from "./typed-entity.js";

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
