import type { StudioData } from "../api/use-studio-data.js";
import { DomainCommandPanel, fieldValue } from "../components/domain-command-panel.js";
import { optionsForKind } from "../components/entity-options.js";
import { EntityTable, entityRows } from "../components/entity-table.js";

export function Delivery({ data }: { data: StudioData }) {
  const projectOptions = optionsForKind(data.entities.data, "project");

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
      <DomainCommandPanel
        definition={{
          id: "delivery-project-repo-register",
          title: "Registrar repo do projeto",
          description:
            "Conecta um projeto existente a um repositório local, com política de remote explícita antes do doctor/repo health.",
          command: "project.register-repo",
          fields: [
            {
              name: "project_id",
              label: "Projeto",
              required: true,
              type: "select",
              options: projectOptions,
              emptyOptionLabel:
                projectOptions.length > 0 ? "Selecione um projeto" : "Nenhum projeto disponível",
            },
            {
              name: "title",
              label: "Nome do repositório",
              placeholder: "Repo do projeto",
              required: true,
            },
            {
              name: "repository_path",
              label: "Caminho do repositório",
              placeholder: "clients/acme/site/repository",
              required: true,
            },
            {
              name: "branch",
              label: "Branch esperada",
              defaultValue: "main",
            },
            {
              name: "remote_policy",
              label: "Política de remote",
              defaultValue: "no-remote-in-v1",
              required: true,
              type: "select",
              options: [
                { value: "no-remote-in-v1", label: "Sem remote na V1" },
                { value: "allowed", label: "Remote permitido" },
                { value: "forbidden", label: "Remote proibido" },
              ],
            },
          ],
          buildPayload: (values) => ({
            project_id: fieldValue(values, "project_id"),
            title: fieldValue(values, "title"),
            repository_path: fieldValue(values, "repository_path"),
            ...(fieldValue(values, "branch") ? { branch: fieldValue(values, "branch") } : {}),
            remote_policy: fieldValue(values, "remote_policy"),
          }),
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
