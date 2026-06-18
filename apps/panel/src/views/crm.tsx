import type { StudioData } from "../api/use-studio-data.js";
import {
  DomainCommandPanel,
  fieldValue,
  linesFieldValue,
  numberFieldValue,
} from "../components/domain-command-panel.js";
import { optionsForKind } from "../components/entity-options.js";
import { EntityTable, entityRows } from "../components/entity-table.js";

const ZERO_CHECKSUM = "0".repeat(64);

export function Crm({ data }: { data: StudioData }) {
  const prospectOptions = optionsForKind(data.entities.data, "prospect");
  const opportunityOptions = optionsForKind(data.entities.data, "opportunity");
  const proposalOptions = optionsForKind(data.entities.data, "proposal");
  const evidenceOptions = optionsForKind(data.entities.data, "evidence");

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
      <DomainCommandPanel
        definition={{
          id: "sales-prospect-research",
          title: "Registrar pesquisa do prospect",
          description:
            "Registra fonte, situação observada, necessidade provável e razão verificável de contato antes de outreach.",
          command: "prospect.research",
          fields: [
            {
              name: "prospect_id",
              label: "Prospect",
              required: true,
              type: "select",
              options: prospectOptions,
              emptyOptionLabel:
                prospectOptions.length > 0 ? "Selecione um prospect" : "Nenhum prospect real",
            },
            { name: "source", label: "Fonte", required: true },
            { name: "source_url", label: "URL da fonte", type: "url" },
            { name: "observed_situation", label: "Situação observada", required: true },
            { name: "likely_need", label: "Necessidade provável", required: true },
            { name: "reason_for_contact", label: "Razão de contato", required: true },
            { name: "fit_evidence", label: "Sinais de fit", type: "textarea" },
            { name: "risks", label: "Riscos", type: "textarea" },
            { name: "freshness", label: "Freshness", defaultValue: "fresh" },
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
              prospect_id: fieldValue(values, "prospect_id"),
              source: fieldValue(values, "source"),
              ...(fieldValue(values, "source_url")
                ? { source_url: fieldValue(values, "source_url") }
                : {}),
              observed_situation: fieldValue(values, "observed_situation"),
              likely_need: fieldValue(values, "likely_need"),
              reason_for_contact: fieldValue(values, "reason_for_contact"),
              fit_evidence: linesFieldValue(values, "fit_evidence"),
              risks: linesFieldValue(values, "risks"),
              freshness: fieldValue(values, "freshness") || "fresh",
              evidence_ids: evidenceId ? [evidenceId] : [],
            };
          },
        }}
      />
      <DomainCommandPanel
        definition={{
          id: "sales-outreach-prepare",
          title: "Preparar outreach",
          description:
            "Cria prepared action fake/local com destinatário, mensagem exata, evidência, CTA e bloqueio de envio externo.",
          command: "outreach.prepare",
          fields: [
            {
              name: "subject_id",
              label: "Prospect",
              required: true,
              type: "select",
              options: prospectOptions,
              emptyOptionLabel:
                prospectOptions.length > 0 ? "Selecione um prospect" : "Nenhum prospect real",
            },
            { name: "recipient", label: "Destinatário", required: true },
            { name: "channel", label: "Canal", defaultValue: "linkedin" },
            { name: "message", label: "Mensagem exata", required: true, type: "textarea" },
            { name: "cta", label: "CTA", required: true },
            { name: "reason_for_contact", label: "Razão override" },
            {
              name: "evidence_id",
              label: "Evidência",
              required: true,
              type: "select",
              options: evidenceOptions,
              emptyOptionLabel:
                evidenceOptions.length > 0 ? "Selecione evidência" : "Nenhuma evidência disponível",
            },
          ],
          buildPayload: (values) => ({
            subject_id: fieldValue(values, "subject_id"),
            recipient: fieldValue(values, "recipient"),
            channel: fieldValue(values, "channel") || "linkedin",
            message: fieldValue(values, "message"),
            cta: fieldValue(values, "cta"),
            ...(fieldValue(values, "reason_for_contact")
              ? { reason_for_contact: fieldValue(values, "reason_for_contact") }
              : {}),
            evidence_ids: [fieldValue(values, "evidence_id")].filter(Boolean),
          }),
        }}
      />
      <DomainCommandPanel
        definition={{
          id: "sales-opportunity-register",
          title: "Registrar oportunidade",
          description:
            "Abre oportunidade real com owner e próximo passo explícitos, sem fingir descoberta comercial.",
          command: "opportunity.create",
          fields: [
            { name: "title", label: "Título", required: true },
            {
              name: "prospect_id",
              label: "Prospect",
              type: "select",
              options: prospectOptions,
              emptyOptionLabel:
                prospectOptions.length > 0 ? "Prospect opcional" : "Nenhum prospect real",
            },
            { name: "owner_id", label: "Owner", required: true, defaultValue: "guilherme" },
            { name: "next_action", label: "Próximo passo", required: true },
            { name: "source_url", label: "Fonte", type: "url" },
            { name: "value_minor", label: "Valor minor", type: "number" },
            { name: "currency", label: "Moeda", defaultValue: "USD" },
          ],
          buildPayload: (values) => ({
            title: fieldValue(values, "title"),
            ...(fieldValue(values, "prospect_id")
              ? { prospect_id: fieldValue(values, "prospect_id") }
              : {}),
            owner_id: fieldValue(values, "owner_id"),
            next_action: fieldValue(values, "next_action"),
            ...(fieldValue(values, "source_url")
              ? { source_url: fieldValue(values, "source_url") }
              : {}),
            ...(fieldValue(values, "value_minor")
              ? { potential_value_minor: numberFieldValue(values, "value_minor") }
              : {}),
            ...(fieldValue(values, "currency") ? { currency: fieldValue(values, "currency") } : {}),
          }),
        }}
      />
      <DomainCommandPanel
        definition={{
          id: "sales-discovery-record",
          title: "Registrar discovery",
          description:
            "Captura necessidade, urgência, budget, autoridade, competição, probabilidade e próximo passo.",
          command: "opportunity.record-discovery",
          fields: [
            {
              name: "opportunity_id",
              label: "Oportunidade",
              required: true,
              type: "select",
              options: opportunityOptions,
              emptyOptionLabel:
                opportunityOptions.length > 0
                  ? "Selecione uma oportunidade"
                  : "Nenhuma oportunidade real",
            },
            { name: "summary", label: "Resumo", required: true },
            { name: "need", label: "Necessidade", required: true },
            { name: "urgency", label: "Urgência" },
            { name: "budget_signal", label: "Sinal de budget" },
            { name: "authority_signal", label: "Sinal de autoridade" },
            { name: "competition", label: "Competição" },
            { name: "next_action", label: "Próximo passo", required: true },
            { name: "owner_id", label: "Owner", required: true, defaultValue: "guilherme" },
            { name: "probability", label: "Probabilidade", type: "number" },
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
              opportunity_id: fieldValue(values, "opportunity_id"),
              summary: fieldValue(values, "summary"),
              need: fieldValue(values, "need"),
              ...(fieldValue(values, "urgency") ? { urgency: fieldValue(values, "urgency") } : {}),
              ...(fieldValue(values, "budget_signal")
                ? { budget_signal: fieldValue(values, "budget_signal") }
                : {}),
              ...(fieldValue(values, "authority_signal")
                ? { authority_signal: fieldValue(values, "authority_signal") }
                : {}),
              ...(fieldValue(values, "competition")
                ? { competition: fieldValue(values, "competition") }
                : {}),
              next_action: fieldValue(values, "next_action"),
              owner_id: fieldValue(values, "owner_id"),
              ...(fieldValue(values, "probability")
                ? {
                    probability: numberFieldValue(values, "probability"),
                    probability_source: "operator-estimate",
                  }
                : {}),
              evidence_ids: evidenceId ? [evidenceId] : [],
            };
          },
        }}
      />
      <DomainCommandPanel
        definition={{
          id: "sales-proposal-prepare",
          title: "Preparar proposta",
          description:
            "Gera pacote versionado com escopo, exclusões, preço, termos e critérios de aceite antes de qualquer envio.",
          command: "proposal.prepare",
          fields: [
            {
              name: "opportunity_id",
              label: "Oportunidade",
              required: true,
              type: "select",
              options: opportunityOptions,
              emptyOptionLabel:
                opportunityOptions.length > 0
                  ? "Selecione uma oportunidade"
                  : "Nenhuma oportunidade real",
            },
            { name: "title", label: "Título da proposta" },
            { name: "offer_ref", label: "Oferta", required: true },
            { name: "scope", label: "Escopo", required: true, type: "textarea" },
            { name: "exclusions", label: "Exclusões", type: "textarea" },
            { name: "schedule", label: "Cronograma" },
            { name: "assumptions", label: "Premissas", type: "textarea" },
            { name: "price_logic", label: "Lógica de preço" },
            { name: "payment_terms", label: "Termos de pagamento", required: true },
            {
              name: "acceptance_criteria",
              label: "Critérios de aceite",
              required: true,
              type: "textarea",
            },
            { name: "value_minor", label: "Valor minor", type: "number" },
            { name: "currency", label: "Moeda", defaultValue: "USD" },
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
              opportunity_id: fieldValue(values, "opportunity_id"),
              ...(fieldValue(values, "title") ? { title: fieldValue(values, "title") } : {}),
              offer_ref: fieldValue(values, "offer_ref"),
              scope: linesFieldValue(values, "scope"),
              exclusions: linesFieldValue(values, "exclusions"),
              ...(fieldValue(values, "schedule")
                ? { schedule: fieldValue(values, "schedule") }
                : {}),
              assumptions: linesFieldValue(values, "assumptions"),
              ...(fieldValue(values, "price_logic")
                ? { price_logic: fieldValue(values, "price_logic") }
                : {}),
              payment_terms: fieldValue(values, "payment_terms"),
              acceptance_criteria: linesFieldValue(values, "acceptance_criteria"),
              ...(fieldValue(values, "value_minor")
                ? { value_minor: numberFieldValue(values, "value_minor") }
                : {}),
              ...(fieldValue(values, "currency")
                ? { currency: fieldValue(values, "currency") }
                : {}),
              evidence_ids: evidenceId ? [evidenceId] : [],
            };
          },
        }}
      />
      <DomainCommandPanel
        definition={{
          id: "sales-proposal-send",
          title: "Preparar envio da proposta",
          description:
            "Cria prepared action fake/local com artefato, checksum e mensagem exata. O envio externo permanece bloqueado.",
          command: "proposal.prepare-send",
          fields: [
            {
              name: "proposal_id",
              label: "Proposta",
              required: true,
              type: "select",
              options: proposalOptions,
              emptyOptionLabel:
                proposalOptions.length > 0 ? "Selecione uma proposta" : "Nenhuma proposta real",
            },
            { name: "recipient", label: "Destinatário", required: true },
            { name: "channel", label: "Canal", required: true, defaultValue: "email" },
            { name: "message", label: "Mensagem", required: true, type: "textarea" },
            { name: "artifact_ref", label: "Artefato", required: true },
            {
              name: "artifact_checksum",
              label: "Checksum SHA-256",
              required: true,
              defaultValue: ZERO_CHECKSUM,
            },
          ],
          buildPayload: (values) => ({
            proposal_id: fieldValue(values, "proposal_id"),
            recipient: fieldValue(values, "recipient"),
            channel: fieldValue(values, "channel") || "email",
            message: fieldValue(values, "message"),
            artifact_ref: fieldValue(values, "artifact_ref"),
            artifact_checksum: fieldValue(values, "artifact_checksum"),
          }),
        }}
      />
      <DomainCommandPanel
        definition={{
          id: "sales-proposal-review",
          title: "Revisar proposta",
          description:
            "Marca claims, termos e anexos como revisados antes de preparar qualquer envio da proposta.",
          command: "proposal.review",
          fields: [
            {
              name: "proposal_id",
              label: "Proposta",
              required: true,
              type: "select",
              options: proposalOptions,
              emptyOptionLabel:
                proposalOptions.length > 0 ? "Selecione uma proposta" : "Nenhuma proposta real",
            },
            { name: "review_notes", label: "Notas de revisão", type: "textarea" },
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
              proposal_id: fieldValue(values, "proposal_id"),
              ...(fieldValue(values, "review_notes")
                ? { review_notes: fieldValue(values, "review_notes") }
                : {}),
              evidence_ids: evidenceId ? [evidenceId] : [],
            };
          },
        }}
      />
      <DomainCommandPanel
        definition={{
          id: "sales-proposal-response",
          title: "Registrar resposta da proposta",
          description:
            "Registra aceite, rejeição, pedido de revisão ou ausência de resposta. Aceite exige evidência.",
          command: "proposal.record-response",
          fields: [
            {
              name: "proposal_id",
              label: "Proposta",
              required: true,
              type: "select",
              options: proposalOptions,
              emptyOptionLabel:
                proposalOptions.length > 0 ? "Selecione uma proposta" : "Nenhuma proposta real",
            },
            { name: "response", label: "Resposta", required: true, defaultValue: "accepted" },
            {
              name: "evidence_id",
              label: "Evidência de aceite",
              type: "select",
              options: evidenceOptions,
              emptyOptionLabel:
                evidenceOptions.length > 0 ? "Selecione evidência" : "Nenhuma evidência disponível",
            },
            { name: "notes", label: "Notas" },
          ],
          buildPayload: (values) => ({
            proposal_id: fieldValue(values, "proposal_id"),
            response: fieldValue(values, "response"),
            ...(fieldValue(values, "evidence_id")
              ? { evidence_id: fieldValue(values, "evidence_id") }
              : {}),
            ...(fieldValue(values, "notes") ? { notes: fieldValue(values, "notes") } : {}),
          }),
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
