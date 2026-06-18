import type { StudioData } from "../api/use-studio-data.js";
import {
  DomainCommandPanel,
  fieldValue,
  numberFieldValue,
} from "../components/domain-command-panel.js";
import { optionsForKind } from "../components/entity-options.js";
import { EntityTable, entityRows } from "../components/entity-table.js";

export function Finance({ data }: { data: StudioData }) {
  const contractOptions = optionsForKind(data.entities.data, "contract");

  return (
    <>
      <DomainCommandPanel
        definition={{
          id: "finance-invoice-create",
          title: "Criar invoice para contrato",
          description:
            "Cria uma invoice somente quando já existir contrato real. Valores são informados em centavos para evitar ambiguidade.",
          command: "invoice.create-for-contract",
          fields: [
            {
              name: "contract_id",
              label: "Contrato",
              required: true,
              type: "select",
              options: contractOptions,
              emptyOptionLabel:
                contractOptions.length > 0 ? "Selecione um contrato" : "Nenhum contrato disponível",
            },
            {
              name: "amount_minor",
              label: "Valor em centavos",
              placeholder: "10000",
              required: true,
              type: "number",
            },
            { name: "currency", label: "Moeda", defaultValue: "USD", required: true },
            { name: "title", label: "Título", placeholder: "Invoice milestone 1" },
            { name: "due_at", label: "Vencimento ISO", placeholder: "2026-07-01T12:00:00.000Z" },
            { name: "reference", label: "Referência", placeholder: "Contrato, milestone ou PO" },
          ],
          buildPayload: (values) => ({
            contract_id: fieldValue(values, "contract_id"),
            amount_minor: numberFieldValue(values, "amount_minor"),
            currency: fieldValue(values, "currency"),
            ...(fieldValue(values, "title") ? { title: fieldValue(values, "title") } : {}),
            ...(fieldValue(values, "due_at") ? { due_at: fieldValue(values, "due_at") } : {}),
            ...(fieldValue(values, "reference")
              ? { reference: fieldValue(values, "reference") }
              : {}),
          }),
        }}
      />
      <EntityTable
        title="Finance"
        rows={entityRows(data, ["contract", "invoice", "payment", "engagement"])}
        empty="Nenhum contrato, invoice ou pagamento real registrado."
      />
    </>
  );
}
