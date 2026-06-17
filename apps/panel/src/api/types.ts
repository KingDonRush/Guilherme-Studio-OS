export interface ResultEnvelope<T> {
  status: "ok" | "warning" | "confirmation_required" | "blocked" | "conflict" | "error";
  result: T;
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
