import type { StudioData } from "../api/use-studio-data.js";
import { EntityTable, entityRows } from "../components/entity-table.js";

export function Delivery({ data }: { data: StudioData }) {
  return (
    <>
      <EntityTable
        title="Delivery e projetos"
        rows={entityRows(data, ["engagement", "deliverable", "project"])}
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
