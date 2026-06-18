import type { EntitySummary } from "../api/types.js";

export function optionsForKind(
  entities: EntitySummary[] | undefined,
  kind: string,
): Array<{ value: string; label: string }> {
  return (entities ?? [])
    .filter((entity) => entity.kind === kind)
    .map((entity) => ({
      value: entity.id,
      label: `${entity.title} (${entity.id})`,
    }));
}
