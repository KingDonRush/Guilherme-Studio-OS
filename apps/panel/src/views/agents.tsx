import type { StudioData } from "../api/use-studio-data.js";
import { EntityTable, entityRows } from "../components/entity-table.js";

export function Agents({ data }: { data: StudioData }) {
  const runRows = entityRows(data, ["agentRun"]);
  return (
    <>
      <EntityTable title="Agent harness runs" rows={runRows} empty="Nenhum AgentRun registrado." />
      <EntityTable
        title="Governança e evidência"
        rows={entityRows(data, ["task", "decision", "evidence"])}
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
