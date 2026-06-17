import { Archive, CircleAlert, ShieldCheck } from "lucide-react";
import type { StudioData } from "../api/use-studio-data.js";
import { EntityTable } from "../components/entity-table.js";
import { PreparedActionReview } from "../components/prepared-action-review.js";

export function Control({ data }: { data: StudioData }) {
  const diagnostics = data.diagnostics.data?.result;
  const coverage = data.coverage.data?.result;
  const acceptance = data.acceptance.data?.result;
  return (
    <>
      <section className="grid three">
        <article className="panel compact">
          <ShieldCheck size={24} />
          <h3>Capacidade PRD</h3>
          <strong className="big">{coverage?.summary.capability_complete ?? "-"}</strong>
        </article>
        <article className="panel compact">
          <Archive size={24} />
          <h3>Intake pendente</h3>
          <strong className="big">{coverage?.summary.needs_intake ?? "-"}</strong>
        </article>
        <article className="panel compact">
          <CircleAlert size={24} />
          <h3>Acceptance blockers</h3>
          <strong className="big">{acceptance?.blockers.length ?? "-"}</strong>
        </article>
      </section>
      <EntityTable
        title="Acceptance"
        rows={(acceptance?.checks ?? []).map((check) => ({
          left: check.status,
          title: check.name,
          right: check.summary,
        }))}
        empty="Acceptance ainda não carregado."
      />
      <EntityTable
        title="Cobertura dos PRDs"
        rows={(coverage?.prds ?? []).map((prd) => ({
          left: prd.status,
          title: prd.title,
          right:
            prd.missing_canonical_kinds.length > 0
              ? prd.missing_canonical_kinds.join(", ")
              : "Sem lacuna canônica",
        }))}
        empty="Cobertura ainda não carregada."
      />
      <PreparedActionReview actions={data.preparedActions.data ?? []} />
      <section className="panel">
        <h3>Diagnósticos</h3>
        <div className="table">
          <div className="row">
            <span>validate</span>
            <strong>{diagnostics?.validation.ok ? "Sem erros" : "Com pendências"}</strong>
            <em>{diagnostics?.validation.errors.length ?? "-"}</em>
          </div>
          <div className="row">
            <span>locks</span>
            <strong>Locks ativos</strong>
            <em>{diagnostics?.locks.length ?? "-"}</em>
          </div>
          <div className="row">
            <span>tx</span>
            <strong>Transações pendentes</strong>
            <em>{diagnostics?.pending_transactions.length ?? "-"}</em>
          </div>
        </div>
      </section>
      {data.entities.isError ? (
        <p className="error">
          <CircleAlert size={16} /> A sessão local não pôde carregar as entidades.
        </p>
      ) : null}
    </>
  );
}
