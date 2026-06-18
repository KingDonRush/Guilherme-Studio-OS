import type { StudioData } from "../api/use-studio-data.js";
import { DomainCommandPanel, fieldValue } from "../components/domain-command-panel.js";
import { EntityTable, entityRows } from "../components/entity-table.js";

export function Delivery({ data }: { data: StudioData }) {
  return (
    <>
      <DomainCommandPanel
        definition={{
          id: "delivery-project-create",
          title: "Registrar projeto WordPress",
          description:
            "Cria um projeto real de delivery quando houver trabalho identificado. Repositório e evidência entram depois, em comandos próprios.",
          command: "entity.create",
          fields: [
            {
              name: "title",
              label: "Nome do projeto",
              placeholder: "Site institucional, loja, manutenção",
              required: true,
            },
            {
              name: "summary",
              label: "Escopo inicial",
              placeholder: "Objetivo, stack, restrições conhecidas",
              type: "textarea",
            },
          ],
          buildPayload: (values) => {
            const summary = fieldValue(values, "summary");
            return {
              kind: "project",
              title: fieldValue(values, "title"),
              classification: "internal",
              ...(summary ? { summary } : {}),
            };
          },
        }}
      />
      <EntityTable
        title="Delivery e projetos"
        rows={entityRows(data, ["engagement", "deliverable", "project"])}
        empty="Nenhum delivery real registrado. Use o fluxo acima quando existir trabalho concreto."
      />
      <EntityTable
        title="Saúde dos repositórios"
        rows={(data.repositories.data ?? []).map((repository) => ({
          left: repository.branch || "sem branch",
          title: repository.title,
          right: repository.isDirty || repository.remotePolicyViolation ? "Atenção" : "Limpo",
        }))}
      />
    </>
  );
}
