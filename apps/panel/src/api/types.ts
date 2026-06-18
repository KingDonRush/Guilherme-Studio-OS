export interface ResultEnvelope<T> {
  status: "ok" | "warning" | "confirmation_required" | "blocked" | "conflict" | "error";
  result: T;
  projection_revision?: number;
  error?: { code: string; message: string };
}

export interface EntitySummary {
  id: string;
  kind: string;
  title: string;
  status: string;
  path?: string;
}

export interface NextAction {
  entity_id: string;
  kind: string;
  title: string;
  score: number;
  reasons: string[];
  blocked: boolean;
}

export interface StudioSummary {
  ok: boolean;
  entityCount: number;
  operatorId: string;
  root: string;
  projectionRevision: number;
  byKind: Record<string, number>;
  nextActions: NextAction[];
}

export interface RepositorySummary {
  id: string;
  title: string;
  branch: string;
  isDirty: boolean;
  remotePolicyViolation: boolean;
}

export interface PrdCoverageReport {
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

export interface AcceptanceReport {
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

export interface WorkflowReport {
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

export interface PreparedAction {
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

export interface DiagnosticsReport {
  validation: { ok: boolean; errors: string[] };
  pending_transactions: string[];
  locks: unknown[];
}

export interface AgentContextPackSummary {
  run_id: string;
  run_title: string;
  context_pack_id: string;
  generated_at: string;
  checksum: string;
  source_revision_count: number;
  included_entity_count: number;
  target_repository_ids: string[];
  target_environment_ids: string[];
  redactions: string[];
  gaps: string[];
  next_valid_action?: string;
}

export interface AgentHandoffSummary {
  run_id: string;
  run_title: string;
  created_at: string;
  status: "ready" | "blocked";
  summary: string;
  context_pack_id?: string;
  repository_ids: string[];
  omitted_sensitive_sections: string[];
  gaps: string[];
  confirmation_required: string[];
  evidence_ids: string[];
  forbidden_reopenings: string[];
  next_valid_action?: string;
}

export interface AgentHarnessReport {
  ok: boolean;
  generated_at: string;
  summary: {
    total_runs: number;
    open_runs: number;
    blocked_runs: number;
    handoff_ready_runs: number;
    closed_runs: number;
    context_pack_count: number;
    handoff_count: number;
    gap_count: number;
  };
  runs: Array<{
    id: string;
    title: string;
    status: string;
    revision: number;
    state: string;
    result: string;
    phase: string;
    risk: string;
    objective: string;
    started_at: string;
    finished_at?: string;
    next_valid_action?: string;
    counts: {
      observations: number;
      actions: number;
      evidence: number;
      open_questions: number;
      risks: number;
    };
    latest_observation?: string;
    latest_action?: string;
    context_pack?: AgentContextPackSummary;
    handoff?: AgentHandoffSummary;
    blockers: string[];
  }>;
  context_packs: AgentContextPackSummary[];
  handoffs: AgentHandoffSummary[];
  gaps: Array<{
    run_id: string;
    run_title: string;
    source: "context_pack" | "handoff" | "open_question" | "risk" | "verification";
    message: string;
  }>;
}
