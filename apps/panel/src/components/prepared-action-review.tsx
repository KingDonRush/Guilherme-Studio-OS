import { useMutation } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { postJson } from "../api/client.js";
import { queryClient } from "../api/query-client.js";
import type { PreparedAction, ResultEnvelope } from "../api/types.js";

export function PreparedActionReview({ actions }: { actions: PreparedAction[] }) {
  const confirm = useMutation({
    mutationFn: (action: PreparedAction) =>
      postJson<ResultEnvelope<PreparedAction>>(`/api/v1/prepared-actions/${action.id}/confirm`, {
        payload_checksum: action.payload_checksum,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries();
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
