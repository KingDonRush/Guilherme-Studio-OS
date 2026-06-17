import type { StudioData } from "../api/use-studio-data.js";
import { CountCard } from "../components/count-card.js";
import { EntityTable } from "../components/entity-table.js";

export function Economy({ data }: { data: StudioData }) {
  return (
    <>
      <section className="panel hero">
        <p className="eyebrow">Prioridade econômica</p>
        <h2>O próximo passo precisa proteger ou criar renda.</h2>
        <p>
          O Studio cruza tarefas, evidências, produtos, candidaturas, repositórios e pagamentos para
          deixar claro o que merece execução agora.
        </p>
      </section>
      <section className="grid three">
        <CountCard data={data} kind="opportunity" label="Oportunidades" />
        <CountCard data={data} kind="engagement" label="Engagements" />
        <CountCard data={data} kind="jobApplication" label="Candidaturas" />
      </section>
      <EntityTable
        title="Próximas ações"
        rows={(data.summary.data?.nextActions ?? []).map((action) => ({
          left: String(action.score),
          title: action.title,
          right: action.reasons.join(", "),
        }))}
      />
    </>
  );
}
