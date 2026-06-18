import type { StudioData } from "../api/use-studio-data.js";
import {
  DomainCommandPanel,
  fieldValue,
  linesFieldValue,
  numberFieldValue,
} from "../components/domain-command-panel.js";
import { optionsForKind } from "../components/entity-options.js";
import { EntityTable, entityRows } from "../components/entity-table.js";

export function Finance({ data }: { data: StudioData }) {
  const contractOptions = optionsForKind(data.entities.data, "contract");
  const invoiceOptions = optionsForKind(data.entities.data, "invoice");
  const paymentOptions = optionsForKind(data.entities.data, "payment");
  const evidenceOptions = optionsForKind(data.entities.data, "evidence");

  return (
    <>
      <DomainCommandPanel
        definition={{
          id: "finance-commercial-terms",
          title: "Registrar termos comerciais",
          description:
            "Atualiza termos comerciais de um contrato real, separando valor, depósito, garantia e condições de aceite sem criar receita fictícia.",
          command: "contract.register-terms",
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
              name: "price_basis",
              label: "Base do preço",
              placeholder: "Projeto fechado, mensal, milestone",
            },
            {
              name: "total_minor",
              label: "Valor total em centavos",
              placeholder: "10000",
              type: "number",
            },
            { name: "currency", label: "Moeda", defaultValue: "USD" },
            {
              name: "deposit_minor",
              label: "Depósito em centavos",
              placeholder: "3000",
              type: "number",
            },
            {
              name: "deposit_due_at",
              label: "Vencimento do depósito ISO",
              placeholder: "2026-07-01T12:00:00.000Z",
            },
            {
              name: "warranty_ends_at",
              label: "Fim da garantia ISO",
              placeholder: "2026-09-01T12:00:00.000Z",
            },
            {
              name: "acceptance_conditions",
              label: "Condições de aceite",
              placeholder: "Uma condição por linha",
              type: "textarea",
            },
          ],
          buildPayload: (values) => ({
            contract_id: fieldValue(values, "contract_id"),
            ...(fieldValue(values, "price_basis")
              ? { price_basis: fieldValue(values, "price_basis") }
              : {}),
            ...(fieldValue(values, "total_minor")
              ? { total_minor: numberFieldValue(values, "total_minor") }
              : {}),
            ...(fieldValue(values, "currency") ? { currency: fieldValue(values, "currency") } : {}),
            ...(fieldValue(values, "deposit_minor")
              ? { deposit_minor: numberFieldValue(values, "deposit_minor") }
              : {}),
            ...(fieldValue(values, "deposit_due_at")
              ? { deposit_due_at: fieldValue(values, "deposit_due_at") }
              : {}),
            ...(fieldValue(values, "warranty_ends_at")
              ? { warranty_ends_at: fieldValue(values, "warranty_ends_at") }
              : {}),
            installments: [],
            acceptance_conditions: linesFieldValue(values, "acceptance_conditions"),
          }),
        }}
      />
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
            deliverable_ids: [],
          }),
        }}
      />
      <DomainCommandPanel
        definition={{
          id: "finance-invoice-issue",
          title: "Emitir invoice",
          description:
            "Move uma invoice registrada para emitida. Evidência é opcional aqui, mas a confirmação de pagamento continua exigindo evidência.",
          command: "invoice.issue",
          fields: [
            {
              name: "invoice_id",
              label: "Invoice",
              required: true,
              type: "select",
              options: invoiceOptions,
              emptyOptionLabel:
                invoiceOptions.length > 0 ? "Selecione uma invoice" : "Nenhuma invoice disponível",
            },
            { name: "issued_at", label: "Emissão ISO", placeholder: "2026-07-01T12:00:00.000Z" },
            {
              name: "evidence_id",
              label: "Evidência",
              type: "select",
              options: evidenceOptions,
              emptyOptionLabel:
                evidenceOptions.length > 0 ? "Evidência opcional" : "Nenhuma evidência disponível",
            },
          ],
          buildPayload: (values) => {
            const evidenceId = fieldValue(values, "evidence_id");
            return {
              invoice_id: fieldValue(values, "invoice_id"),
              ...(fieldValue(values, "issued_at")
                ? { issued_at: fieldValue(values, "issued_at") }
                : {}),
              evidence_ids: evidenceId ? [evidenceId] : [],
            };
          },
        }}
      />
      <DomainCommandPanel
        definition={{
          id: "finance-payment-confirm",
          title: "Confirmar pagamento",
          description:
            "Confirma pagamento somente com evidência de provider. Isso ainda não reconcilia caixa; reconciliação é outro passo.",
          command: "payment.confirm",
          fields: [
            {
              name: "payment_id",
              label: "Pagamento esperado",
              required: true,
              type: "select",
              options: paymentOptions,
              emptyOptionLabel:
                paymentOptions.length > 0
                  ? "Selecione um pagamento"
                  : "Nenhum pagamento disponível",
            },
            {
              name: "provider_evidence_id",
              label: "Evidência do provider",
              required: true,
              type: "select",
              options: evidenceOptions,
              emptyOptionLabel:
                evidenceOptions.length > 0 ? "Selecione evidência" : "Nenhuma evidência disponível",
            },
            { name: "provider", label: "Provider", placeholder: "bank, stripe, manual" },
            { name: "provider_reference", label: "Referência do provider" },
          ],
          buildPayload: (values) => ({
            payment_id: fieldValue(values, "payment_id"),
            provider_evidence_id: fieldValue(values, "provider_evidence_id"),
            ...(fieldValue(values, "provider") ? { provider: fieldValue(values, "provider") } : {}),
            ...(fieldValue(values, "provider_reference")
              ? { provider_reference: fieldValue(values, "provider_reference") }
              : {}),
          }),
        }}
      />
      <DomainCommandPanel
        definition={{
          id: "finance-payment-reminder",
          title: "Preparar lembrete",
          description:
            "Cria prepared action fake/local para cobrança ou follow-up financeiro. Nada é enviado sem confirmação/reconcile.",
          command: "payment.prepare-reminder",
          fields: [
            {
              name: "invoice_id",
              label: "Invoice",
              required: true,
              type: "select",
              options: invoiceOptions,
              emptyOptionLabel:
                invoiceOptions.length > 0 ? "Selecione uma invoice" : "Nenhuma invoice disponível",
            },
            { name: "channel", label: "Canal", defaultValue: "email" },
            {
              name: "message",
              label: "Mensagem",
              required: true,
              type: "textarea",
              placeholder: "Mensagem exata a revisar antes de qualquer envio externo",
            },
          ],
          buildPayload: (values) => ({
            invoice_id: fieldValue(values, "invoice_id"),
            channel: fieldValue(values, "channel") || "email",
            message: fieldValue(values, "message"),
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
