import type { StudioData } from "../api/use-studio-data.js";
import { EntityTable, entityRows } from "../components/entity-table.js";

export function Agents({ data }: { data: StudioData }) {
  return (
    <>
      <EntityTable
        title="Agent runs, decisões e handoffs"
        rows={entityRows(data, ["agentRun", "task", "decision", "evidence"])}
      />
      <EntityTable
        title="Workflow fixtures"
        rows={(data.workflows.data?.result.workflows ?? []).map((workflow) => ({
          left: workflow.ok ? "ok" : "block",
          title: workflow.name,
          right: `${workflow.entity_count} records / ${workflow.event_count} events`,
        }))}
      />
    </>
  );
}
