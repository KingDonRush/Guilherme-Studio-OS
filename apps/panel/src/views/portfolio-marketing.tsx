import type { StudioData } from "../api/use-studio-data.js";
import { EntityTable, entityRows } from "../components/entity-table.js";

export function PortfolioMarketing({ data }: { data: StudioData }) {
  return (
    <EntityTable
      title="Portfolio, campanhas e conteúdo"
      rows={entityRows(data, ["portfolioCase", "campaign", "contentItem", "asset", "evidence"])}
    />
  );
}
