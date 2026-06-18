import type { StudioData } from "../api/use-studio-data.js";
import { DomainCommandPanel } from "../components/domain-command-panel.js";
import { EntityTable, entityRows } from "../components/entity-table.js";

export function Career({ data }: { data: StudioData }) {
  return (
    <>
      <DomainCommandPanel
        definition={{
          id: "career-linkedin-application",
          title: "Preparar candidatura LinkedIn",
          description:
            "Registra uma vaga real do LinkedIn como candidatura preparada. O envio continua fora do sistema até confirmação humana.",
          command: "application.prepare",
          fields: [
            {
              name: "title",
              label: "Título da vaga",
              placeholder: "WordPress Developer, Elementor Specialist",
              required: true,
            },
            {
              name: "source_url",
              label: "URL LinkedIn",
              placeholder: "https://www.linkedin.com/jobs/view/...",
              required: true,
              type: "url",
            },
            {
              name: "organization_id",
              label: "Organization ID",
              placeholder: "Opcional, se a organização já existir",
            },
          ],
          buildPayload: (values) => {
            const organizationId = fieldValue(values, "organization_id");
            return {
              title: fieldValue(values, "title"),
              source_url: fieldValue(values, "source_url"),
              ...(organizationId ? { organization_id: organizationId } : {}),
            };
          },
        }}
      />
      <EntityTable
        title="Career pipeline"
        rows={entityRows(data, [
          "organization",
          "jobApplication",
          "communication",
          "portfolioCase",
        ])}
        empty="Nenhuma candidatura real registrada. Use o fluxo acima quando tiver uma vaga concreta."
      />
    </>
  );
}

function fieldValue(values: Record<string, string>, key: string): string {
  return values[key] ?? "";
}
