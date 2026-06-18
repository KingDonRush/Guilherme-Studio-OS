import { useQuery } from "@tanstack/react-query";
import { getJson } from "./client.js";
import type {
  AcceptanceReport,
  AgentHarnessReport,
  DiagnosticsReport,
  EntitySummary,
  PrdCoverageReport,
  PreparedAction,
  RepositorySummary,
  ResultEnvelope,
  StudioSummary,
  WorkflowReport,
} from "./types.js";

export function useStudioData() {
  const summary = useQuery({
    queryKey: ["summary"],
    queryFn: () => getJson<StudioSummary>("/api/v1/summary"),
    retry: false,
  });
  const entities = useQuery({
    queryKey: ["entities"],
    queryFn: () => getJson<EntitySummary[]>("/api/v1/entities"),
    retry: false,
  });
  const repositories = useQuery({
    queryKey: ["repositories"],
    queryFn: () => getJson<RepositorySummary[]>("/api/v1/repositories"),
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
    queryFn: () => getJson<ResultEnvelope<DiagnosticsReport>>("/api/v1/diagnostics"),
    retry: false,
  });
  const agentHarness = useQuery({
    queryKey: ["agent-harness"],
    queryFn: () => getJson<ResultEnvelope<AgentHarnessReport>>("/api/v1/agent-runs"),
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
    agentHarness,
  };
}

export type StudioData = ReturnType<typeof useStudioData>;
