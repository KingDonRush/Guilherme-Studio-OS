import type { StudioData } from "../api/use-studio-data.js";
import { CountCard } from "../components/count-card.js";
import { EntityTable, type EntityTableRow } from "../components/entity-table.js";

export function Economy({ data }: { data: StudioData }) {
  const byKind = data.summary.data?.byKind ?? {};
  const preparedActions = data.preparedActions.data ?? [];
  const coverage = data.coverage.data?.result;
  const nextActions = data.summary.data?.nextActions ?? [];
  const contractCount = countKind(byKind, "contract");
  const invoiceCount = countKind(byKind, "invoice");
  const paymentCount = countKind(byKind, "payment");
  const intakeRows: EntityTableRow[] =
    coverage?.prds
      .filter((prd) => prd.status === "intake-required")
      .map((prd) => ({
        left: prd.id,
        title: prd.title,
        right:
          prd.missing_canonical_kinds.length > 0
            ? prd.missing_canonical_kinds.join(", ")
            : "dados reais pendentes",
      })) ?? [];
  const obligationRows: EntityTableRow[] = [
    {
      left: "contratos",
      title: `${contractCount} contratos canônicos`,
      right: contractCount > 0 ? "base para invoices" : "intake financeiro pendente",
    },
    {
      left: "invoices",
      title: `${invoiceCount} invoices registradas`,
      right: invoiceCount > 0 ? "acompanhar vencimento" : "nenhuma cobrança real",
    },
    {
      left: "pagamentos",
      title: `${paymentCount} pagamentos registrados`,
      right: paymentCount > 0 ? "reconciliar quando aplicável" : "nenhum pagamento real",
    },
    {
      left: "preparadas",
      title: `${preparedActions.length} ações aguardando confirmação`,
      right: preparedActions.length > 0 ? "revisar payload exato" : "nenhum envio externo pendente",
    },
  ];

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
      <section className="grid three">
        <CountCard data={data} kind="contract" label="Contratos" />
        <CountCard data={data} kind="invoice" label="Invoices" />
        <CountCard data={data} kind="payment" label="Pagamentos" />
      </section>
      <EntityTable title="Receita, obrigações e envio externo" rows={obligationRows} />
      <EntityTable
        title="Próximas ações"
        rows={nextActions.map((action) => ({
          left: String(action.score),
          title: action.title,
          right: action.reasons.join(", "),
        }))}
        empty="Nenhuma próxima ação econômica calculada. Registre intake real ou evidência para destravar ranking."
      />
      <EntityTable
        title="Lacunas de intake canônico"
        rows={intakeRows}
        empty="Nenhuma lacuna de intake reportada pelo coverage atual."
      />
    </>
  );
}

function countKind(byKind: Record<string, number>, kind: string): number {
  return byKind[kind] ?? 0;
}
