import type { EntityKind, StudioEntity } from "@guilherme-studio/schemas";
import type { StudioContext } from "../context.js";
import { EntityService } from "../entity-service.js";
import { PreparedActionService } from "../prepared-actions/service.js";

export abstract class DomainServiceBase {
  readonly entities: EntityService;
  readonly actions: PreparedActionService;

  constructor(readonly context: StudioContext) {
    this.entities = new EntityService(context);
    this.actions = new PreparedActionService(context);
  }

  protected async requireEntity(id: string): Promise<StudioEntity> {
    const file = await this.context.entities.get(id);
    if (!file) {
      throw new Error(`Entity not found: ${id}`);
    }
    return file.entity;
  }

  protected async requireKind(id: string, kind: EntityKind): Promise<StudioEntity> {
    const entity = await this.requireEntity(id);
    if (entity.kind !== kind) {
      throw new Error(`Expected ${kind} entity, got ${entity.kind}`);
    }
    return entity;
  }

  protected async requireEvidenceIds(ids: string[]): Promise<void> {
    for (const id of ids) {
      await this.requireKind(id, "evidence");
    }
  }
}
