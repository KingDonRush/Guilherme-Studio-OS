import type { StudioData } from "../api/use-studio-data.js";
import { EntityTable, entityRows } from "../components/entity-table.js";

export function Finance({ data }: { data: StudioData }) {
  return (
    <EntityTable
      title="Finance"
      rows={entityRows(data, ["contract", "invoice", "payment", "engagement"])}
    />
  );
}
