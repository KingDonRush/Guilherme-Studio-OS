import type { EntitySummary } from "../api/types.js";
import type { StudioData } from "../api/use-studio-data.js";

export interface EntityTableRow {
  left: string;
  title: string;
  right: string;
}

export function EntityTable({
  title,
  rows,
  empty = "Nada registrado nessa visão.",
}: {
  title: string;
  rows: EntityTableRow[];
  empty?: string;
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      <div className="table">
        {rows.map((row) => (
          <div className="row" key={`${row.left}-${row.title}-${row.right}`}>
            <span>{row.left}</span>
            <strong>{row.title}</strong>
            <em>{row.right}</em>
          </div>
        ))}
        {rows.length === 0 ? <p className="empty">{empty}</p> : null}
      </div>
    </section>
  );
}

export function entityRows(data: StudioData, kinds: string[]) {
  return (data.entities.data ?? [])
    .filter((entity) => kinds.includes(entity.kind))
    .map(rowFromEntity);
}

function rowFromEntity(entity: EntitySummary): EntityTableRow {
  return {
    left: entity.kind,
    title: entity.title,
    right: entity.status,
  };
}
