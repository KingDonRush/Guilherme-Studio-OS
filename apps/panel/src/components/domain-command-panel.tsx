import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, ClipboardCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { postJson } from "../api/client.js";
import { queryClient } from "../api/query-client.js";
import type { ResultEnvelope } from "../api/types.js";

export interface CommandField {
  name: string;
  label: string;
  type?: "text" | "url" | "textarea" | "number" | "select";
  defaultValue?: string;
  options?: Array<{ value: string; label: string }>;
  emptyOptionLabel?: string;
  placeholder?: string;
  required?: boolean;
}

export interface DomainCommandDefinition {
  id: string;
  title: string;
  description: string;
  command: string;
  fields: CommandField[];
  buildPayload: (values: Record<string, string>) => Record<string, unknown>;
}

interface ReviewedCommand {
  body: {
    command: string;
    idempotency_key: string;
    payload: Record<string, unknown>;
  };
  result: ResultEnvelope<unknown>;
}

export function DomainCommandPanel({ definition }: { definition: DomainCommandDefinition }) {
  const initialValues = useMemo(
    () =>
      Object.fromEntries(definition.fields.map((field) => [field.name, field.defaultValue ?? ""])),
    [definition.fields],
  );
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [reviewed, setReviewed] = useState<ReviewedCommand | null>(null);
  const [executed, setExecuted] = useState<ResultEnvelope<unknown> | null>(null);

  const review = useMutation({
    mutationFn: async (body: ReviewedCommand["body"]) =>
      postJson<ResultEnvelope<unknown>>("/api/v1/commands/dry-run", body),
    onSuccess: (result, body) => {
      setReviewed({ body, result });
      setExecuted(null);
    },
  });
  const execute = useMutation({
    mutationFn: async (body: ReviewedCommand["body"]) =>
      postJson<ResultEnvelope<unknown>>("/api/v1/commands/execute", body),
    onSuccess: (result) => {
      setExecuted(result);
      void queryClient.invalidateQueries();
    },
  });

  function updateValue(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setReviewed(null);
    setExecuted(null);
  }

  function buildBody(): ReviewedCommand["body"] {
    return {
      command: definition.command,
      idempotency_key: `panel-${definition.id}-${Date.now()}`,
      payload: definition.buildPayload(values),
    };
  }

  return (
    <section className="panel command-panel">
      <div className="command-panel-head">
        <div>
          <p className="eyebrow">Mutação governada</p>
          <h3>{definition.title}</h3>
          <p>{definition.description}</p>
        </div>
      </div>
      <form
        className="command-form"
        onSubmit={(event) => {
          event.preventDefault();
          review.mutate(buildBody());
        }}
      >
        {definition.fields.map((field) => {
          const fieldId = `${definition.id}-${field.name}`;
          return (
            <label className="field" htmlFor={fieldId} key={field.name}>
              <span>{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  id={fieldId}
                  onChange={(event) => updateValue(field.name, event.currentTarget.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={3}
                  value={values[field.name] ?? ""}
                />
              ) : field.type === "select" ? (
                <select
                  id={fieldId}
                  onChange={(event) => updateValue(field.name, event.currentTarget.value)}
                  required={field.required}
                  value={values[field.name] ?? ""}
                >
                  <option disabled value="">
                    {field.emptyOptionLabel ?? "Selecione uma opção"}
                  </option>
                  {(field.options ?? []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={fieldId}
                  onChange={(event) => updateValue(field.name, event.currentTarget.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  type={field.type ?? "text"}
                  value={values[field.name] ?? ""}
                />
              )}
            </label>
          );
        })}
        <button disabled={review.isPending} type="submit">
          <ClipboardCheck size={16} /> {review.isPending ? "Revisando" : "Revisar comando"}
        </button>
      </form>
      {reviewed ? (
        <div className="command-review-block">
          <div className="command-review-grid">
            <div>
              <span>Comando</span>
              <strong>{reviewed.body.command}</strong>
            </div>
            <div>
              <span>Status dry-run</span>
              <strong>{reviewed.result.status}</strong>
            </div>
            <div>
              <span>Idempotency key</span>
              <code>{reviewed.body.idempotency_key}</code>
            </div>
          </div>
          <div className="review-columns">
            <div>
              <span>Payload exato</span>
              <pre>{JSON.stringify(reviewed.body.payload, null, 2)}</pre>
            </div>
            <div>
              <span>Envelope dry-run</span>
              <pre>{JSON.stringify(reviewed.result, null, 2)}</pre>
            </div>
          </div>
          <button
            disabled={execute.isPending || reviewed.result.status === "error"}
            onClick={() => execute.mutate(reviewed.body)}
            type="button"
          >
            <CheckCircle2 size={16} />{" "}
            {execute.isPending ? "Executando" : "Executar payload revisado"}
          </button>
        </div>
      ) : null}
      {executed ? (
        <p className="success">
          <CheckCircle2 size={16} /> Executado via command runtime: {executed.status}
        </p>
      ) : null}
      {review.isError || execute.isError ? (
        <p className="error">Falha ao chamar a API local. Atualize a sessão do painel.</p>
      ) : null}
    </section>
  );
}

export function fieldValue(values: Record<string, string>, key: string): string {
  return values[key] ?? "";
}

export function numberFieldValue(values: Record<string, string>, key: string): number {
  return Number.parseInt(fieldValue(values, key), 10);
}

export function linesFieldValue(values: Record<string, string>, key: string): string[] {
  return fieldValue(values, key)
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
