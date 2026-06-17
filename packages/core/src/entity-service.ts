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
  type ResultEnvelope,
  type StudioEntity,
  type StudioEvent,
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
