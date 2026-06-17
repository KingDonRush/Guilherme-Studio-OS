import type { StudioData } from "../api/use-studio-data.js";
import { EntityTable, entityRows } from "../components/entity-table.js";

export function Career({ data }: { data: StudioData }) {
  return (
    <EntityTable
      title="Career pipeline"
      rows={entityRows(data, ["organization", "jobApplication", "communication", "portfolioCase"])}
    />
  );
}
