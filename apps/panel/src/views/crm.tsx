import type { StudioData } from "../api/use-studio-data.js";
import { EntityTable, entityRows } from "../components/entity-table.js";

export function Crm({ data }: { data: StudioData }) {
  return (
    <EntityTable
      title="CRM e sales"
      rows={entityRows(data, ["prospect", "opportunity", "proposal", "client", "communication"])}
    />
  );
}
