import { QueryClient, QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query";
import {
  Activity,
  Archive,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  CircleAlert,
  CircleDollarSign,
  ClipboardList,
  Megaphone,
  PackageCheck,
  ShieldCheck,
  UserRoundSearch,
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
    capability_complete: number;
    canonical_data_ready: number;
    intake_required: number;
    missing_evidence: number;
    covered: number;
    needs_intake: number;
    missing_capability: number;
  };
  prds: Array<{
    id: string;
    title: string;
    status: "capability-complete" | "intake-required" | "missing-capability";
    missing_canonical_kinds: string[];
  }>;
}

interface AcceptanceReport {
  ok: boolean;
  blockers: string[];
  checks: Array<{
    name: string;
    status: "pass" | "warn" | "block" | "not_checked";
    summary: string;
  }>;
  portfolio_release: {
    allowed: boolean;
    reasons: string[];
  };
}

interface WorkflowReport {
  ok: boolean;
  mode: string;
  workflows: Array<{
    id: string;
    name: string;
    ok: boolean;
    entity_count: number;
    event_count: number;
    prepared_action_count: number;
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
  source_revisions?: Record<string, number>;
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
  const acceptance = useQuery({
    queryKey: ["acceptance"],
    queryFn: () => getJson<ResultEnvelope<AcceptanceReport>>("/api/v1/acceptance"),
    retry: false,
  });
  const workflows = useQuery({
    queryKey: ["workflows"],
    queryFn: () => getJson<ResultEnvelope<WorkflowReport>>("/api/v1/workflows"),
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
  return {
    summary,
    entities,
    repositories,
    preparedActions,
    coverage,
    acceptance,
    workflows,
    diagnostics,
  };
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
            <NavLink to="/crm">
              <UserRoundSearch size={18} /> CRM
            </NavLink>
            <NavLink to="/delivery">
              <BriefcaseBusiness size={18} /> Delivery
            </NavLink>
            <NavLink to="/products">
              <PackageCheck size={18} /> Produtos
            </NavLink>
            <NavLink to="/portfolio">
              <Megaphone size={18} /> Portfolio
            </NavLink>
            <NavLink to="/career">
              <Building2 size={18} /> Career
            </NavLink>
            <NavLink to="/finance">
              <CircleDollarSign size={18} /> Finance
            </NavLink>
            <NavLink to="/agents">
              <ClipboardList size={18} /> Agentes
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
            <Route path="/crm" element={<Crm data={data} />} />
            <Route path="/delivery" element={<Delivery data={data} />} />
            <Route path="/products" element={<Products data={data} />} />
            <Route path="/portfolio" element={<PortfolioMarketing data={data} />} />
            <Route path="/career" element={<Career data={data} />} />
            <Route path="/finance" element={<Finance data={data} />} />
            <Route path="/agents" element={<Agents data={data} />} />
            <Route path="/control" element={<Control data={data} />} />
          </Routes>
        </section>
      </main>
    </HashRouter>
  );
}

function Topbar({ data }: { data: ReturnType<typeof useStudioData> }) {
  const acceptance = data.acceptance.data?.result;
  return (
    <header className="topbar">
      <Metric title="Status" value={data.summary.data?.ok ? "Operável" : "Pendente"} />
      <Metric title="Entidades" value={String(data.summary.data?.entityCount ?? "-")} />
      <Metric title="Acceptance" value={acceptance?.ok ? "Verde" : "Bloqueado"} />
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

function Crm({ data }: { data: ReturnType<typeof useStudioData> }) {
  return (
    <EntityTable
      title="CRM e sales"
      rows={entityRows(data, ["prospect", "opportunity", "proposal", "client", "communication"])}
    />
  );
}

function Delivery({ data }: { data: ReturnType<typeof useStudioData> }) {
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

function Products({ data }: { data: ReturnType<typeof useStudioData> }) {
  return (
    <EntityTable
      title="Produtos, releases e ambientes"
      rows={entityRows(data, ["product", "release", "repository", "environment"])}
    />
  );
}

function PortfolioMarketing({ data }: { data: ReturnType<typeof useStudioData> }) {
  return (
    <EntityTable
      title="Portfolio, campanhas e conteúdo"
      rows={entityRows(data, ["portfolioCase", "campaign", "contentItem", "asset", "evidence"])}
    />
  );
}

function Career({ data }: { data: ReturnType<typeof useStudioData> }) {
  return (
    <EntityTable
      title="Career pipeline"
      rows={entityRows(data, ["organization", "jobApplication", "communication", "portfolioCase"])}
    />
  );
}

function Finance({ data }: { data: ReturnType<typeof useStudioData> }) {
  return (
    <EntityTable
      title="Finance"
      rows={entityRows(data, ["contract", "invoice", "payment", "engagement"])}
    />
  );
}

function Agents({ data }: { data: ReturnType<typeof useStudioData> }) {
  return (
    <>
      <EntityTable
        title="Agent runs, decisões e handoffs"
        rows={entityRows(data, ["agentRun", "task", "decision", "evidence"])}
      />
      <EntityTable
        title="Workflow fixtures"
        rows={(data.workflows.data?.result.workflows ?? []).map((workflow) => ({
          left: workflow.ok ? "ok" : "block",
          title: workflow.name,
          right: `${workflow.entity_count} records / ${workflow.event_count} events`,
        }))}
      />
    </>
  );
}

function Control({ data }: { data: ReturnType<typeof useStudioData> }) {
  const diagnostics = data.diagnostics.data?.result;
  const coverage = data.coverage.data?.result;
  const acceptance = data.acceptance.data?.result;
  return (
    <>
      <section className="grid three">
        <article className="panel compact">
          <ShieldCheck size={24} />
          <h3>Capacidade PRD</h3>
          <strong className="big">{coverage?.summary.capability_complete ?? "-"}</strong>
        </article>
        <article className="panel compact">
          <Archive size={24} />
          <h3>Intake pendente</h3>
          <strong className="big">{coverage?.summary.needs_intake ?? "-"}</strong>
        </article>
        <article className="panel compact">
          <CircleAlert size={24} />
          <h3>Acceptance blockers</h3>
          <strong className="big">{acceptance?.blockers.length ?? "-"}</strong>
        </article>
      </section>
      <EntityTable
        title="Acceptance"
        rows={(acceptance?.checks ?? []).map((check) => ({
          left: check.status,
          title: check.name,
          right: check.summary,
        }))}
        empty="Acceptance ainda não carregado."
      />
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
              <em>
                {action.provider ??
                  action.target ??
                  new Date(action.expires_at).toLocaleString("pt-BR")}
              </em>
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

function entityRows(data: ReturnType<typeof useStudioData>, kinds: string[]) {
  return (data.entities.data ?? [])
    .filter((entity) => kinds.includes(entity.kind))
    .map(rowFromEntity);
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
