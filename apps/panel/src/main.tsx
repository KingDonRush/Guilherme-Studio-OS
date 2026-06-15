import { QueryClient, QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query";
import {
  Activity,
  Archive,
  BriefcaseBusiness,
  CheckCircle2,
  CircleAlert,
  Megaphone,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, NavLink, Route, Routes } from "react-router-dom";
import "./styles.css";

const queryClient = new QueryClient();

interface ResultEnvelope<T> {
  status: "ok" | "warning" | "confirmation_required" | "blocked" | "conflict" | "error";
  result: T;
  error?: { code: string; message: string };
}

interface EntitySummary {
  id: string;
  kind: string;
  title: string;
  status: string;
  path?: string;
}

interface NextAction {
  entity_id: string;
  kind: string;
  title: string;
  score: number;
  reasons: string[];
  blocked: boolean;
}

interface PrdCoverageReport {
  summary: {
    covered: number;
    needs_intake: number;
    missing_capability: number;
  };
  prds: Array<{
    id: string;
    title: string;
    status: "covered" | "needs-intake" | "missing-capability";
    missing_canonical_kinds: string[];
  }>;
}

interface PreparedAction {
  id: string;
  action_type: string;
  status: string;
  provider?: string;
  target?: string;
  expires_at: string;
  payload: Record<string, unknown>;
  payload_checksum: string;
}

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

async function postJson<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("studio_token") ?? ""}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

function useStudioData() {
  const summary = useQuery({
    queryKey: ["summary"],
    queryFn: () =>
      getJson<{
        ok: boolean;
        entityCount: number;
        operatorId: string;
        root: string;
        byKind: Record<string, number>;
        nextActions: NextAction[];
      }>("/api/v1/summary"),
    retry: false,
  });
  const entities = useQuery({
    queryKey: ["entities"],
    queryFn: () => getJson<EntitySummary[]>("/api/v1/entities"),
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
    queryFn: () => getJson<PreparedAction[]>("/api/v1/prepared-actions"),
    retry: false,
  });
  const coverage = useQuery({
    queryKey: ["coverage"],
    queryFn: () => getJson<ResultEnvelope<PrdCoverageReport>>("/api/v1/coverage"),
    retry: false,
  });
  const diagnostics = useQuery({
    queryKey: ["diagnostics"],
    queryFn: () =>
      getJson<
        ResultEnvelope<{
          validation: { ok: boolean; errors: string[] };
          pending_transactions: string[];
          locks: unknown[];
        }>
      >("/api/v1/diagnostics"),
    retry: false,
  });
  return { summary, entities, repositories, preparedActions, coverage, diagnostics };
}

function App(): React.JSX.Element {
  const data = useStudioData();

  return (
    <HashRouter>
      <main className="shell">
        <aside className="sidebar">
          <div>
            <p className="eyebrow">Guilherme Studio OS</p>
            <h1>Operação local-first para renda WordPress internacional.</h1>
          </div>
          <nav>
            <NavLink to="/">
              <Activity size={18} /> Economia
            </NavLink>
            <NavLink to="/pipeline">
              <WalletCards size={18} /> Pipelines
            </NavLink>
            <NavLink to="/work">
              <BriefcaseBusiness size={18} /> Trabalho
            </NavLink>
            <NavLink to="/distribution">
              <Megaphone size={18} /> Distribuição
            </NavLink>
            <NavLink to="/control">
              <ShieldCheck size={18} /> Controle
            </NavLink>
          </nav>
        </aside>
        <section className="content">
          <Topbar data={data} />
          <Routes>
            <Route path="/" element={<Economy data={data} />} />
            <Route path="/pipeline" element={<Pipeline data={data} />} />
            <Route path="/work" element={<Work data={data} />} />
            <Route path="/distribution" element={<Distribution data={data} />} />
            <Route path="/control" element={<Control data={data} />} />
          </Routes>
        </section>
      </main>
    </HashRouter>
  );
}

function Topbar({ data }: { data: ReturnType<typeof useStudioData> }) {
  return (
    <header className="topbar">
      <Metric title="Status" value={data.summary.data?.ok ? "Operável" : "Pendente"} />
      <Metric title="Entidades" value={String(data.summary.data?.entityCount ?? "-")} />
      <Metric title="Operador" value={data.summary.data?.operatorId ?? "-"} />
    </header>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <strong>{title}</strong>
      <span>{value}</span>
    </div>
  );
}

function Economy({ data }: { data: ReturnType<typeof useStudioData> }) {
  return (
    <>
      <section className="panel hero">
        <p className="eyebrow">Prioridade econômica</p>
        <h2>O próximo passo precisa proteger ou criar renda.</h2>
        <p>
          O Studio cruza tarefas, evidências, produtos, candidaturas, repositórios e pagamentos para
          deixar claro o que merece execução agora.
        </p>
      </section>
      <section className="grid three">
        <CountCard data={data} kind="opportunity" label="Oportunidades" />
        <CountCard data={data} kind="engagement" label="Engagements" />
        <CountCard data={data} kind="jobApplication" label="Candidaturas" />
      </section>
      <EntityTable
        title="Próximas ações"
        rows={(data.summary.data?.nextActions ?? []).map((action) => ({
          left: String(action.score),
          title: action.title,
          right: action.reasons.join(", "),
        }))}
      />
    </>
  );
}

function CountCard({
  data,
  kind,
  label,
}: {
  data: ReturnType<typeof useStudioData>;
  kind: string;
  label: string;
}) {
  const count = data.summary.data?.byKind[kind] ?? 0;
  return (
    <article className="panel compact">
      <Archive size={24} />
      <h3>{label}</h3>
      <strong className="big">{count}</strong>
    </article>
  );
}

function Pipeline({ data }: { data: ReturnType<typeof useStudioData> }) {
  const rows = (data.entities.data ?? [])
    .filter((entity) =>
      ["prospect", "opportunity", "proposal", "client", "jobApplication"].includes(entity.kind),
    )
    .map(rowFromEntity);
  return <EntityTable title="Pipeline comercial e carreira" rows={rows} />;
}

function Work({ data }: { data: ReturnType<typeof useStudioData> }) {
  const workRows = (data.entities.data ?? [])
    .filter((entity) =>
      ["engagement", "deliverable", "project", "product", "release", "repository"].includes(
        entity.kind,
      ),
    )
    .map(rowFromEntity);
  return (
    <>
      <EntityTable title="Trabalhos, produtos e repositórios" rows={workRows} />
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

function Distribution({ data }: { data: ReturnType<typeof useStudioData> }) {
  const rows = (data.entities.data ?? [])
    .filter((entity) =>
      ["portfolioCase", "campaign", "contentItem", "evidence"].includes(entity.kind),
    )
    .map(rowFromEntity);
  return <EntityTable title="Cases, campanhas, conteúdo e evidências" rows={rows} />;
}

function Control({ data }: { data: ReturnType<typeof useStudioData> }) {
  const diagnostics = data.diagnostics.data?.result;
  const coverage = data.coverage.data?.result;
  return (
    <>
      <section className="grid three">
        <article className="panel compact">
          <ShieldCheck size={24} />
          <h3>PRDs cobertos</h3>
          <strong className="big">{coverage?.summary.covered ?? "-"}</strong>
        </article>
        <article className="panel compact">
          <Archive size={24} />
          <h3>Intake pendente</h3>
          <strong className="big">{coverage?.summary.needs_intake ?? "-"}</strong>
        </article>
        <article className="panel compact">
          <CircleAlert size={24} />
          <h3>Capacidade ausente</h3>
          <strong className="big">{coverage?.summary.missing_capability ?? "-"}</strong>
        </article>
      </section>
      <EntityTable
        title="Cobertura dos PRDs"
        rows={(coverage?.prds ?? []).map((prd) => ({
          left: prd.status,
          title: prd.title,
          right:
            prd.missing_canonical_kinds.length > 0
              ? prd.missing_canonical_kinds.join(", ")
              : "Sem lacuna canônica",
        }))}
        empty="Cobertura ainda não carregada."
      />
      <PreparedActionReview actions={data.preparedActions.data ?? []} />
      <section className="panel">
        <h3>Diagnósticos</h3>
        <div className="table">
          <div className="row">
            <span>validate</span>
            <strong>{diagnostics?.validation.ok ? "Sem erros" : "Com pendências"}</strong>
            <em>{diagnostics?.validation.errors.length ?? "-"}</em>
          </div>
          <div className="row">
            <span>locks</span>
            <strong>Locks ativos</strong>
            <em>{diagnostics?.locks.length ?? "-"}</em>
          </div>
          <div className="row">
            <span>tx</span>
            <strong>Transações pendentes</strong>
            <em>{diagnostics?.pending_transactions.length ?? "-"}</em>
          </div>
        </div>
      </section>
      {data.entities.isError ? (
        <p className="error">
          <CircleAlert size={16} /> A sessão local não pôde carregar as entidades.
        </p>
      ) : null}
    </>
  );
}

function PreparedActionReview({ actions }: { actions: PreparedAction[] }) {
  const confirm = useMutation({
    mutationFn: (action: PreparedAction) =>
      postJson<ResultEnvelope<PreparedAction>>(`/api/v1/prepared-actions/${action.id}/confirm`, {
        payload_checksum: action.payload_checksum,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["prepared-actions"] });
    },
  });

  return (
    <section className="panel">
      <h3>Ações preparadas</h3>
      <div className="action-list">
        {actions.map((action) => (
          <article className="action-review" key={action.id}>
            <div className="action-head">
              <span>{action.status}</span>
              <strong>{action.action_type}</strong>
              <em>{new Date(action.expires_at).toLocaleString("pt-BR")}</em>
            </div>
            <pre>{JSON.stringify(action.payload, null, 2)}</pre>
            <div className="checksum">
              <code>{action.payload_checksum}</code>
              <button
                disabled={action.status !== "awaiting_confirmation" || confirm.isPending}
                onClick={() => confirm.mutate(action)}
                type="button"
              >
                <CheckCircle2 size={16} /> Confirmar checksum
              </button>
            </div>
          </article>
        ))}
        {actions.length === 0 ? (
          <p className="empty">Nenhuma ação aguardando confirmação.</p>
        ) : null}
      </div>
    </section>
  );
}

function EntityTable({
  title,
  rows,
  empty = "Nada registrado nessa visão.",
}: {
  title: string;
  rows: Array<{ left: string; title: string; right: string }>;
  empty?: string;
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      <div className="table">
        {rows.map((row) => (
          <div className="row" key={`${row.left}-${row.title}-${row.right}`}>
            <span>{row.left}</span>
            <strong>{row.title}</strong>
            <em>{row.right}</em>
          </div>
        ))}
        {rows.length === 0 ? <p className="empty">{empty}</p> : null}
      </div>
    </section>
  );
}

function rowFromEntity(entity: EntitySummary) {
  return {
    left: entity.kind,
    title: entity.title,
    right: entity.status,
  };
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
