import { Archive } from "lucide-react";
import type { StudioData } from "../api/use-studio-data.js";

export function CountCard({
  data,
  kind,
  label,
}: {
  data: StudioData;
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
