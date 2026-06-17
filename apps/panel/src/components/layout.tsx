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
        <h1>Operação local-first para renda WordPress internacional.</h1>
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
