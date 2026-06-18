import type { StudioData } from "../api/use-studio-data.js";
import { DomainCommandPanel, fieldValue } from "../components/domain-command-panel.js";
import { EntityTable, entityRows } from "../components/entity-table.js";

export function Crm({ data }: { data: StudioData }) {
  return (
    <>
      <DomainCommandPanel
        definition={{
          id: "crm-prospect-create",
          title: "Registrar prospect",
          description:
            "Cria um prospect real quando houver uma pessoa, empresa ou agência para acompanhar. Não use para preencher dashboard.",
          command: "entity.create",
          fields: [
            {
              name: "title",
              label: "Nome do prospect",
              placeholder: "Agência, empresa ou contato",
              required: true,
            },
            {
              name: "summary",
              label: "Contexto inicial",
              placeholder: "Origem, hipótese de fit, próximo passo",
              type: "textarea",
            },
          ],
          buildPayload: (values) => {
            const title = fieldValue(values, "title");
            const summary = fieldValue(values, "summary");
            return {
              kind: "prospect",
              title,
              classification: "internal",
              ...(summary ? { summary } : {}),
            };
          },
        }}
      />
      <EntityTable
        title="CRM e sales"
        rows={entityRows(data, ["prospect", "opportunity", "proposal", "client", "communication"])}
        empty="Sem prospects ou oportunidades reais. Registre apenas quando existir um alvo concreto."
      />
    </>
  );
}
