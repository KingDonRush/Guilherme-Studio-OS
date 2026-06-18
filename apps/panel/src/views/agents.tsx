import type { StudioData } from "../api/use-studio-data.js";
import { EntityTable, entityRows } from "../components/entity-table.js";

export function Agents({ data }: { data: StudioData }) {
  const runRows = entityRows(data, ["agentRun"]);
  const harness = data.agentHarness.data?.result;
  const summary = harness?.summary;
  return (
    <>
      <section className="grid three">
        <article className="panel compact">
          <p className="eyebrow">Harness</p>
          <h3>Runs abertos</h3>
          <strong className="big">{summary?.open_runs ?? 0}</strong>
        </article>
        <article className="panel compact">
          <p className="eyebrow">Contexto</p>
          <h3>Context packs</h3>
          <strong className="big">{summary?.context_pack_count ?? 0}</strong>
        </article>
        <article className="panel compact">
          <p className="eyebrow">Continuação</p>
          <h3>Handoffs</h3>
          <strong className="big">{summary?.handoff_count ?? 0}</strong>
        </article>
      </section>
      <EntityTable
        title="Agent harness loop"
        rows={(harness?.runs ?? []).map((run) => ({
          left: `${run.state}/${run.result}`,
          title: run.title,
          right: run.next_valid_action ?? run.latest_action ?? `${run.phase} / ${run.risk}`,
        }))}
        empty="Nenhum run no harness. Use o CLI para iniciar um AgentRun quando a tarefa for material."
      />
      <EntityTable
        title="Context packs"
        rows={(harness?.context_packs ?? []).map((pack) => ({
          left: pack.context_pack_id,
          title: pack.run_title,
          right: `${pack.included_entity_count} entidades / ${pack.checksum.slice(0, 12)}`,
        }))}
        empty="Nenhum context pack gerado ainda."
      />
      <EntityTable
        title="Handoffs"
        rows={(harness?.handoffs ?? []).map((handoff) => ({
          left: handoff.status,
          title: handoff.run_title,
          right: handoff.next_valid_action ?? handoff.summary,
        }))}
        empty="Nenhum handoff pronto."
      />
      <EntityTable
        title="Gaps do harness"
        rows={(harness?.gaps ?? []).map((gap) => ({
          left: gap.source,
          title: gap.run_title,
          right: gap.message,
        }))}
        empty="Nenhuma lacuna registrada no harness."
      />
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
