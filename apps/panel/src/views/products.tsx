import type { StudioData } from "../api/use-studio-data.js";
import { EntityTable, entityRows } from "../components/entity-table.js";

export function Products({ data }: { data: StudioData }) {
  return (
    <EntityTable
      title="Produtos, releases e ambientes"
      rows={entityRows(data, ["product", "release", "repository", "environment"])}
    />
  );
}
