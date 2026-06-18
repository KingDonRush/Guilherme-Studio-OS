import type { StudioData } from "../api/use-studio-data.js";
import {
  DomainCommandPanel,
  fieldValue,
  linesFieldValue,
  numberFieldValue,
} from "../components/domain-command-panel.js";
import { optionsForKind } from "../components/entity-options.js";
import { EntityTable, entityRows } from "../components/entity-table.js";

export function Career({ data }: { data: StudioData }) {
  const applicationOptions = optionsForKind(data.entities.data, "jobApplication");
  const organizationOptions = optionsForKind(data.entities.data, "organization");
  const evidenceOptions = optionsForKind(data.entities.data, "evidence");

  return (
    <>
      <DomainCommandPanel
        definition={{
          id: "career-role-opportunity",
          title: "Registrar vaga LinkedIn",
          description:
            "Registra uma vaga real como oportunidade descoberta, com requisitos e deadline antes de virar candidatura.",
          command: "application.register-opportunity",
          fields: [
            { name: "title", label: "Título da vaga", required: true },
            {
              name: "source_url",
              label: "URL LinkedIn",
              placeholder: "https://www.linkedin.com/jobs/view/...",
              required: true,
              type: "url",
            },
            {
              name: "organization_id",
              label: "Organização",
              type: "select",
              options: organizationOptions,
              emptyOptionLabel:
                organizationOptions.length > 0
                  ? "Organização opcional"
                  : "Nenhuma organização disponível",
            },
            { name: "role_family", label: "Família de vaga", placeholder: "WordPress, Elementor" },
            { name: "geography", label: "Geografia", placeholder: "Remote US/EU" },
            { name: "deadline_at", label: "Deadline ISO", placeholder: "2026-07-01T12:00:00.000Z" },
            {
              name: "requirements",
              label: "Requisitos",
              placeholder: "Um requisito por linha",
              type: "textarea",
            },
          ],
          buildPayload: (values) => {
            const organizationId = fieldValue(values, "organization_id");
            return {
              title: fieldValue(values, "title"),
              source_url: fieldValue(values, "source_url"),
              ...(organizationId ? { organization_id: organizationId } : {}),
              ...(fieldValue(values, "role_family")
                ? { role_family: fieldValue(values, "role_family") }
                : {}),
              ...(fieldValue(values, "geography")
                ? { geography: fieldValue(values, "geography") }
                : {}),
              ...(fieldValue(values, "deadline_at")
                ? { deadline_at: fieldValue(values, "deadline_at") }
                : {}),
              requirements: linesFieldValue(values, "requirements").map((text) => ({
                text,
                type: "explicit",
              })),
            };
          },
        }}
      />
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
              label: "Organização",
              type: "select",
              options: organizationOptions,
              emptyOptionLabel:
                organizationOptions.length > 0
                  ? "Organização opcional"
                  : "Nenhuma organização disponível",
            },
            { name: "role_family", label: "Família de vaga", placeholder: "WordPress, Elementor" },
            { name: "resume_ref", label: "Resume ref", placeholder: "career/materials/resume.pdf" },
            {
              name: "cover_message",
              label: "Cover message",
              placeholder: "Texto exato da candidatura",
              type: "textarea",
            },
            {
              name: "portfolio_links",
              label: "Links de portfólio",
              placeholder: "Um URL por linha",
              type: "textarea",
            },
            {
              name: "evidence_id",
              label: "Evidência principal",
              type: "select",
              options: evidenceOptions,
              emptyOptionLabel:
                evidenceOptions.length > 0 ? "Evidência opcional" : "Nenhuma evidência disponível",
            },
          ],
          buildPayload: (values) => {
            const organizationId = fieldValue(values, "organization_id");
            const evidenceId = fieldValue(values, "evidence_id");
            return {
              title: fieldValue(values, "title"),
              source_url: fieldValue(values, "source_url"),
              ...(organizationId ? { organization_id: organizationId } : {}),
              ...(fieldValue(values, "role_family")
                ? { role_family: fieldValue(values, "role_family") }
                : {}),
              ...(fieldValue(values, "resume_ref")
                ? { resume_ref: fieldValue(values, "resume_ref") }
                : {}),
              ...(fieldValue(values, "cover_message")
                ? { cover_message: fieldValue(values, "cover_message") }
                : {}),
              portfolio_links: linesFieldValue(values, "portfolio_links"),
              evidence_ids: evidenceId ? [evidenceId] : [],
              repository_ids: [],
              answers: [],
            };
          },
        }}
      />
      <DomainCommandPanel
        definition={{
          id: "career-application-validate",
          title: "Validar candidatura",
          description:
            "Valida fonte, materiais, links e evidência antes de preparar qualquer submissão.",
          command: "application.validate",
          fields: [
            {
              name: "application_id",
              label: "Candidatura",
              required: true,
              type: "select",
              options: applicationOptions,
              emptyOptionLabel:
                applicationOptions.length > 0
                  ? "Selecione uma candidatura"
                  : "Nenhuma candidatura disponível",
            },
          ],
          buildPayload: (values) => ({
            application_id: fieldValue(values, "application_id"),
          }),
        }}
      />
      <DomainCommandPanel
        definition={{
          id: "career-application-submit",
          title: "Preparar submissão",
          description:
            "Cria prepared action fake/local com payload exato da candidatura. Nada é enviado pelo Studio nesta fase.",
          command: "application.prepare-submission",
          fields: [
            {
              name: "application_id",
              label: "Candidatura",
              required: true,
              type: "select",
              options: applicationOptions,
              emptyOptionLabel:
                applicationOptions.length > 0
                  ? "Selecione uma candidatura"
                  : "Nenhuma candidatura disponível",
            },
            { name: "channel", label: "Canal", defaultValue: "linkedin" },
            {
              name: "message",
              label: "Mensagem override",
              placeholder: "Opcional; por padrão usa cover_message",
              type: "textarea",
            },
          ],
          buildPayload: (values) => ({
            application_id: fieldValue(values, "application_id"),
            channel: fieldValue(values, "channel") || "linkedin",
            ...(fieldValue(values, "message") ? { message: fieldValue(values, "message") } : {}),
          }),
        }}
      />
      <DomainCommandPanel
        definition={{
          id: "career-application-follow-up",
          title: "Agendar follow-up",
          description:
            "Registra janela e política de follow-up. Mensagem, se houver, vira prepared communication.",
          command: "application.follow-up",
          fields: [
            {
              name: "application_id",
              label: "Candidatura",
              required: true,
              type: "select",
              options: applicationOptions,
              emptyOptionLabel:
                applicationOptions.length > 0
                  ? "Selecione uma candidatura"
                  : "Nenhuma candidatura disponível",
            },
            { name: "follow_up_at", label: "Follow-up ISO", required: true },
            { name: "channel", label: "Canal", defaultValue: "linkedin" },
            { name: "policy", label: "Política", placeholder: "Somente se houver submissão real" },
            { name: "message", label: "Mensagem", type: "textarea" },
          ],
          buildPayload: (values) => ({
            application_id: fieldValue(values, "application_id"),
            follow_up_at: fieldValue(values, "follow_up_at"),
            channel: fieldValue(values, "channel") || "linkedin",
            ...(fieldValue(values, "policy") ? { policy: fieldValue(values, "policy") } : {}),
            ...(fieldValue(values, "message") ? { message: fieldValue(values, "message") } : {}),
          }),
        }}
      />
      <DomainCommandPanel
        definition={{
          id: "career-application-outcome",
          title: "Registrar outcome",
          description:
            "Registra rejeição, no-response, withdrawal ou oferta sem tirar conclusão de mercado com amostra pequena.",
          command: "application.record-outcome",
          fields: [
            {
              name: "application_id",
              label: "Candidatura",
              required: true,
              type: "select",
              options: applicationOptions,
              emptyOptionLabel:
                applicationOptions.length > 0
                  ? "Selecione uma candidatura"
                  : "Nenhuma candidatura disponível",
            },
            {
              name: "outcome",
              label: "Outcome",
              required: true,
              type: "select",
              options: [
                { value: "rejected", label: "Rejected" },
                { value: "no-response", label: "No response" },
                { value: "withdrawn", label: "Withdrawn" },
                { value: "offered", label: "Offered" },
                { value: "accepted", label: "Accepted" },
              ],
            },
            { name: "sample_size", label: "Amostra", defaultValue: "1", type: "number" },
            { name: "reason", label: "Motivo" },
            { name: "learning_notes", label: "Notas de aprendizado", type: "textarea" },
          ],
          buildPayload: (values) => ({
            application_id: fieldValue(values, "application_id"),
            outcome: fieldValue(values, "outcome"),
            sample_size: numberFieldValue(values, "sample_size"),
            ...(fieldValue(values, "reason") ? { reason: fieldValue(values, "reason") } : {}),
            ...(fieldValue(values, "learning_notes")
              ? { learning_notes: fieldValue(values, "learning_notes") }
              : {}),
            evidence_ids: [],
          }),
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
