import {
  createEntity,
  createEntityId,
  createResultEnvelope,
  EventSchema,
  entityId,
  entityRevision,
  entityTitle,
  type LifecycleState,
  nowIso,
  RelationSchema,
  type ResultEnvelope,
  type StudioEntity,
  type StudioEvent,
  type StudioRelation,
  TypedEntitySchema,
  updateEntityMetadata,
} from "@guilherme-studio/schemas";
import type { StudioContext } from "./context.js";
import { LifecycleEngine } from "./lifecycle.js";

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
    const candidate = TypedEntitySchema.parse(mutated);
    const next = TypedEntitySchema.parse({
      ...candidate,
      metadata: {
        ...current.entity.metadata,
        ...candidate.metadata,
        id: current.entity.metadata.id,
        slug: current.entity.metadata.slug,
        schema_version: current.entity.metadata.schema_version,
        created_at: current.entity.metadata.created_at,
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
      const archivedAt = nowIso();
      return TypedEntitySchema.parse({
        ...updateEntityMetadata(entity, { archived_at: archivedAt }),
        spec: { ...entity.spec, status: "archived" },
      });
    });
  }

  async relate(id: string, relation: StudioRelation): Promise<StudioEntity> {
    const parsed = RelationSchema.parse(relation);
    const target = await this.context.entities.get(parsed.target_id);
    if (!target) {
      throw new Error(`Relation target not found: ${parsed.target_id}`);
    }
    const current = await this.context.entities.get(id);
    if (!current) {
      throw new Error(`Entity not found: ${id}`);
    }
    const exists = current.entity.relations.some(
      (entry) => entry.type === parsed.type && entry.target_id === parsed.target_id,
    );
    if (exists) {
      return current.entity;
    }
    const next = await this.update(id, (entity) => ({
      ...entity,
      relations: [...entity.relations, parsed],
    }));
    await this.recordEvent("entity.related", entityId(next), {
      relation_type: parsed.type,
      target_id: parsed.target_id,
    });
    return next;
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
