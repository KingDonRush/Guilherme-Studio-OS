import type { StudioData } from "../api/use-studio-data.js";
import {
  DomainCommandPanel,
  fieldValue,
  linesFieldValue,
} from "../components/domain-command-panel.js";
import { EntityTable, entityRows } from "../components/entity-table.js";

export function PortfolioMarketing({ data }: { data: StudioData }) {
  return (
    <>
      <DomainCommandPanel
        definition={{
          id: "marketing-content-prepare",
          title: "Preparar conteúdo",
          description:
            "Prepara uma peça real de conteúdo ou campanha. Claims públicos precisam de evidência antes de publicação.",
          command: "content.prepare",
          fields: [
            {
              name: "title",
              label: "Título",
              placeholder: "Post LinkedIn, case, artigo",
              required: true,
            },
            { name: "channel", label: "Canal", placeholder: "linkedin, portfolio, blog" },
            {
              name: "public_claims",
              label: "Claims públicos",
              placeholder: "Um claim por linha",
              type: "textarea",
            },
            {
              name: "evidence_ids",
              label: "Evidências",
              placeholder: "Um evidence id por linha",
              type: "textarea",
            },
          ],
          buildPayload: (values) => ({
            title: fieldValue(values, "title"),
            ...(fieldValue(values, "channel") ? { channel: fieldValue(values, "channel") } : {}),
            public_claims: linesFieldValue(values, "public_claims"),
            evidence_ids: linesFieldValue(values, "evidence_ids"),
          }),
        }}
      />
      <EntityTable
        title="Portfolio, campanhas e conteúdo"
        rows={entityRows(data, ["portfolioCase", "campaign", "contentItem", "asset", "evidence"])}
        empty="Sem conteúdo real preparado. Não crie campanhas fictícias para preencher a visão."
      />
    </>
  );
}
