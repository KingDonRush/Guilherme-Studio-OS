import {
  Activity,
  BriefcaseBusiness,
  Building2,
  CircleDollarSign,
  ClipboardList,
  type LucideIcon,
  Megaphone,
  PackageCheck,
  ShieldCheck,
  UserRoundSearch,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { queryClient } from "../api/query-client.js";
import type { StudioData } from "../api/use-studio-data.js";

const navigationItems: Array<{ to: string; label: string; icon: LucideIcon }> = [
  { to: "/", label: "Economia", icon: Activity },
  { to: "/crm", label: "CRM", icon: UserRoundSearch },
  { to: "/delivery", label: "Delivery", icon: BriefcaseBusiness },
  { to: "/products", label: "Produtos", icon: PackageCheck },
  { to: "/portfolio", label: "Portfolio", icon: Megaphone },
  { to: "/career", label: "Career", icon: Building2 },
  { to: "/finance", label: "Finance", icon: CircleDollarSign },
  { to: "/agents", label: "Agentes", icon: ClipboardList },
  { to: "/control", label: "Controle", icon: ShieldCheck },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <p className="eyebrow">Guilherme Studio OS</p>
        <h1>Operação local-first para renda WordPress internacional</h1>
      </div>
      <nav>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to}>
              <Icon size={18} /> {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export function Topbar({ data }: { data: StudioData }) {
  const acceptance = data.acceptance.data?.result;
  const projection = getProjectionState(data);
  return (
    <header className="topbar">
      <Metric title="Status" value={data.summary.data?.ok ? "Operável" : "Pendente"} />
      <Metric title="Entidades" value={String(data.summary.data?.entityCount ?? "-")} />
      <Metric title="Acceptance" value={acceptance?.ok ? "Verde" : "Bloqueado"} />
      <ProjectionNotice
        currentRevision={projection.currentRevision}
        isFetching={projection.isFetching}
        staleLabels={projection.staleLabels}
      />
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

function ProjectionNotice({
  currentRevision,
  isFetching,
  staleLabels,
}: {
  currentRevision: number | undefined;
  isFetching: boolean;
  staleLabels: string[];
}) {
  const isStale = staleLabels.length > 0;
  const label = isStale
    ? `Projeção atrasada: ${staleLabels.join(", ")}. Rev ${currentRevision}.`
    : `Projeção rev ${currentRevision ?? "-"}`;

  return (
    <div className={`projection-notice${isStale ? " stale" : ""}`}>
      <span>{label}</span>
      <button
        disabled={isFetching}
        onClick={() => {
          void queryClient.invalidateQueries();
        }}
        type="button"
      >
        {isFetching ? "Atualizando" : "Atualizar"}
      </button>
    </div>
  );
}

function getProjectionState(data: StudioData): {
  currentRevision: number | undefined;
  isFetching: boolean;
  staleLabels: string[];
} {
  const sources = [
    { label: "Resumo", revision: data.summary.data?.projectionRevision },
    { label: "Coverage", revision: data.coverage.data?.projection_revision },
    { label: "Acceptance", revision: data.acceptance.data?.projection_revision },
    { label: "Workflows", revision: data.workflows.data?.projection_revision },
    { label: "Diagnósticos", revision: data.diagnostics.data?.projection_revision },
    { label: "Agentes", revision: data.agentHarness.data?.projection_revision },
  ].filter((source): source is { label: string; revision: number } =>
    Number.isFinite(source.revision),
  );

  const currentRevision =
    sources.length > 0 ? Math.max(...sources.map((source) => source.revision)) : undefined;
  const staleLabels =
    currentRevision === undefined
      ? []
      : sources.filter((source) => source.revision < currentRevision).map((source) => source.label);

  return {
    currentRevision,
    isFetching:
      data.summary.isFetching ||
      data.coverage.isFetching ||
      data.acceptance.isFetching ||
      data.workflows.isFetching ||
      data.diagnostics.isFetching ||
      data.agentHarness.isFetching ||
      data.entities.isFetching ||
      data.repositories.isFetching ||
      data.preparedActions.isFetching,
    staleLabels,
  };
}
