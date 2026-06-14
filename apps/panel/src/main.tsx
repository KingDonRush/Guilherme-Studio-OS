import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import {
  Activity,
  Archive,
  BriefcaseBusiness,
  CircleAlert,
  GitBranch,
  ShieldCheck,
} from "lucide-react";
import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const queryClient = new QueryClient();

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("studio_token") ?? ""}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

function App(): React.JSX.Element {
  const summary = useQuery({
    queryKey: ["summary"],
    queryFn: () =>
      getJson<{
        ok: boolean;
        entityCount: number;
        operatorId: string;
        root: string;
        byKind: Record<string, number>;
      }>("/api/v1/summary"),
    retry: false,
  });
  const repositories = useQuery({
    queryKey: ["repositories"],
    queryFn: () =>
      getJson<
        Array<{
          id: string;
          title: string;
          branch: string;
          isDirty: boolean;
          remotePolicyViolation: boolean;
        }>
      >("/api/v1/repositories"),
    retry: false,
  });
  const preparedActions = useQuery({
    queryKey: ["prepared-actions"],
    queryFn: () =>
      getJson<Array<{ id: string; action_type: string; status: string; expires_at: string }>>(
        "/api/v1/prepared-actions",
      ),
    retry: false,
  });
  const kindCount = (kind: string): number => {
    const value = Reflect.get(summary.data?.byKind ?? {}, kind);
    return typeof value === "number" ? value : 0;
  };
  const entities = useQuery({
    queryKey: ["entities"],
    queryFn: () =>
      getJson<Array<{ id: string; kind: string; title: string; status: string }>>(
        "/api/v1/entities",
      ),
    retry: false,
  });

  return (
    <main className="shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Guilherme Studio OS</p>
          <h1>Operação local-first para ganhar dinheiro com WordPress.</h1>
        </div>
        <nav>
          <a href="#economia">
            <Activity size={18} /> Economia
          </a>
          <a href="#trampos">
            <BriefcaseBusiness size={18} /> Trabalhos
          </a>
          <a href="#repos">
            <GitBranch size={18} /> Repositórios
          </a>
          <a href="#gates">
            <ShieldCheck size={18} /> Gates
          </a>
        </nav>
      </aside>
      <section className="content">
        <header className="topbar">
          <div>
            <strong>Status</strong>
            <span>{summary.data?.ok ? "Operável" : "Pendente de validação"}</span>
          </div>
          <div>
            <strong>Entidades</strong>
            <span>{summary.data?.entityCount ?? "-"}</span>
          </div>
          <div>
            <strong>Operador</strong>
            <span>{summary.data?.operatorId ?? "-"}</span>
          </div>
        </header>

        <section id="economia" className="panel hero">
          <p className="eyebrow">Prioridade econômica</p>
          <h2>Portfólio, prospecção, produtos e entregas precisam compartilhar o mesmo estado.</h2>
          <p>
            A V1 transforma documentos canônicos em uma operação consultável por CLI, MCP e painel
            local. Ações externas continuam bloqueadas por confirmação.
          </p>
        </section>

        <section id="trampos" className="grid">
          <article className="panel">
            <Archive size={24} />
            <h3>Próximos passos</h3>
            <p>
              Completar domínios, adapters e migração física sem retomar o portfólio antes da
              aceitação.
            </p>
          </article>
          <article className="panel">
            <ShieldCheck size={24} />
            <h3>Gates</h3>
            <p>
              Publicação, envio, destruição e ações externas usam prepare, confirm, execute e
              reconcile.
            </p>
          </article>
          <article className="panel">
            <Activity size={24} />
            <h3>Pipeline registrado</h3>
            <p>
              {kindCount("opportunity")} oportunidades, {kindCount("engagement")} engagements e{" "}
              {kindCount("jobApplication")} candidaturas.
            </p>
          </article>
        </section>

        <section className="panel" id="repos">
          <h3>Saúde dos repositórios</h3>
          <div className="table">
            {(repositories.data ?? []).map((repository) => (
              <div className="row" key={repository.id}>
                <span>{repository.branch || "sem branch"}</span>
                <strong>{repository.title}</strong>
                <em>
                  {repository.isDirty || repository.remotePolicyViolation ? "Atenção" : "Limpo"}
                </em>
              </div>
            ))}
          </div>
        </section>

        <section className="panel" id="gates">
          <h3>Ações preparadas</h3>
          <div className="table">
            {(preparedActions.data ?? []).map((action) => (
              <div className="row" key={action.id}>
                <span>{action.status}</span>
                <strong>{action.action_type}</strong>
                <em>{new Date(action.expires_at).toLocaleString("pt-BR")}</em>
              </div>
            ))}
            {(preparedActions.data ?? []).length === 0 ? (
              <p>Nenhuma ação externa aguardando confirmação.</p>
            ) : null}
          </div>
        </section>

        <section className="panel">
          <h3>Entidades canônicas</h3>
          <div className="table">
            {(entities.data ?? []).map((entity) => (
              <div className="row" key={entity.id}>
                <span>{entity.kind}</span>
                <strong>{entity.title}</strong>
                <em>{entity.status}</em>
              </div>
            ))}
            {entities.isError ? (
              <p>
                <CircleAlert size={16} /> A sessão local não pôde carregar as entidades.
              </p>
            ) : null}
          </div>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
