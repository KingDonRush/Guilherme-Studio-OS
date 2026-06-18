import type { StudioData } from "../api/use-studio-data.js";
import { DomainCommandPanel, fieldValue } from "../components/domain-command-panel.js";
import { optionsForKind } from "../components/entity-options.js";
import { EntityTable, entityRows } from "../components/entity-table.js";

export function Products({ data }: { data: StudioData }) {
  const productOptions = optionsForKind(data.entities.data, "product");

  return (
    <>
      <DomainCommandPanel
        definition={{
          id: "product-create",
          title: "Registrar produto",
          description:
            "Cria um produto próprio real, como plugin ou toolkit. Release, demo e case continuam como etapas separadas.",
          command: "entity.create",
          fields: [
            {
              name: "title",
              label: "Nome do produto",
              placeholder: "Simple Budget Plugin",
              required: true,
            },
            {
              name: "summary",
              label: "Sinal do produto",
              placeholder: "Problema, usuário, diferencial verificável",
              type: "textarea",
            },
          ],
          buildPayload: (values) => {
            const summary = fieldValue(values, "summary");
            return {
              kind: "product",
              title: fieldValue(values, "title"),
              classification: "internal",
              ...(summary ? { summary } : {}),
            };
          },
        }}
      />
      <DomainCommandPanel
        definition={{
          id: "product-release-prepare",
          title: "Preparar release",
          description:
            "Prepara um release para produto existente, mantendo produto, versão e evidência separados antes de publicar qualquer claim.",
          command: "release.prepare",
          fields: [
            {
              name: "product_id",
              label: "Produto",
              required: true,
              type: "select",
              options: productOptions,
              emptyOptionLabel:
                productOptions.length > 0 ? "Selecione um produto" : "Nenhum produto disponível",
            },
            {
              name: "version",
              label: "Versão",
              placeholder: "1.0.0",
              required: true,
            },
          ],
          buildPayload: (values) => ({
            product_id: fieldValue(values, "product_id"),
            version: fieldValue(values, "version"),
          }),
        }}
      />
      <EntityTable
        title="Produtos, releases e ambientes"
        rows={entityRows(data, ["product", "release", "repository", "environment"])}
        empty="Nenhum produto novo registrado nessa visão."
      />
    </>
  );
}
