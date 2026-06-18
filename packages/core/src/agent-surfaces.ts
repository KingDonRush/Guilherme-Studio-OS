import {
  entityId,
  entityRevision,
  entityStatus,
  entityTitle,
  nowIso,
  type StudioEntity,
} from "@guilherme-studio/schemas";

type AgentRunEntity = Extract<StudioEntity, { kind: "agentRun" }>;

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

export interface AgentRunSurface {
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
  authority: {
    allowed: string[];
    confirmation_required: string[];
    prohibited: string[];
  };
  target_repository_ids: string[];
  target_environment_ids: string[];
  owning_entity_ids: string[];
  counts: {
    observations: number;
    actions: number;
    evidence: number;
    open_questions: number;
    risks: number;
  };
  latest_observation?: string;
  latest_action?: string;
  verification?: {
    status: "passed" | "failed" | "not_run";
    verified_at: string;
    command?: string;
    result_summary?: string;
    not_run_reason?: string;
  };
  context_pack?: AgentContextPackSummary;
  handoff?: AgentHandoffSummary;
  blockers: string[];
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
  runs: AgentRunSurface[];
  context_packs: AgentContextPackSummary[];
  handoffs: AgentHandoffSummary[];
  gaps: Array<{
    run_id: string;
    run_title: string;
    source: "context_pack" | "handoff" | "open_question" | "risk" | "verification";
    message: string;
  }>;
}

export function buildAgentHarnessReport(entities: StudioEntity[]): AgentHarnessReport {
  const runs = entities
    .filter((entity): entity is AgentRunEntity => entity.kind === "agentRun")
    .sort((left, right) => right.spec.started_at.localeCompare(left.spec.started_at))
    .map(agentRunSurface);
  const contextPacks = runs.flatMap((run) => (run.context_pack ? [run.context_pack] : []));
  const handoffs = runs.flatMap((run) => (run.handoff ? [run.handoff] : []));
  const gaps = runs.flatMap((run) => runGaps(run));
  const blockedRuns = runs.filter(
    (run) => run.state === "blocked" || run.result === "blocked" || run.blockers.length > 0,
  );
  return {
    ok: blockedRuns.length === 0 && gaps.length === 0,
    generated_at: nowIso(),
    summary: {
      total_runs: runs.length,
      open_runs: runs.filter((run) => run.state !== "closed").length,
      blocked_runs: blockedRuns.length,
      handoff_ready_runs: runs.filter((run) => run.state === "handoff_ready").length,
      closed_runs: runs.filter((run) => run.state === "closed").length,
      context_pack_count: contextPacks.length,
      handoff_count: handoffs.length,
      gap_count: gaps.length,
    },
    runs,
    context_packs: contextPacks,
    handoffs,
    gaps,
  };
}

function agentRunSurface(entity: AgentRunEntity): AgentRunSurface {
  const contextPack = entity.spec.context_pack
    ? contextPackSummary(entity, entity.spec.context_pack)
    : undefined;
  const handoff = entity.spec.handoff ? handoffSummary(entity, entity.spec.handoff) : undefined;
  const verification = entity.spec.verification;
  const latestObservation = entity.spec.observations.at(-1)?.summary;
  const latestAction = entity.spec.actions.at(-1)?.action;
  return {
    id: entityId(entity),
    title: entityTitle(entity),
    status: entityStatus(entity),
    revision: entityRevision(entity),
    state: entity.spec.state,
    result: entity.spec.result,
    phase: entity.spec.phase,
    risk: entity.spec.risk,
    objective: entity.spec.objective,
    started_at: entity.spec.started_at,
    ...(entity.spec.finished_at ? { finished_at: entity.spec.finished_at } : {}),
    ...(entity.spec.next_valid_action ? { next_valid_action: entity.spec.next_valid_action } : {}),
    authority: entity.spec.authority,
    target_repository_ids: entity.spec.target_repositories,
    target_environment_ids: entity.spec.target_environments,
    owning_entity_ids: entity.spec.owning_entities,
    counts: {
      observations: entity.spec.observations.length,
      actions: entity.spec.actions.length,
      evidence: entity.spec.evidence_ids.length,
      open_questions: entity.spec.open_questions.length,
      risks: entity.spec.risks.length,
    },
    ...(latestObservation ? { latest_observation: latestObservation } : {}),
    ...(latestAction ? { latest_action: latestAction } : {}),
    ...(verification
      ? {
          verification: {
            status: verification.status,
            verified_at: verification.verified_at,
            ...(verification.command ? { command: verification.command } : {}),
            ...(verification.result_summary ? { result_summary: verification.result_summary } : {}),
            ...(verification.not_run_reason ? { not_run_reason: verification.not_run_reason } : {}),
          },
        }
      : {}),
    ...(contextPack ? { context_pack: contextPack } : {}),
    ...(handoff ? { handoff } : {}),
    blockers: blockersForRun(entity),
  };
}

function contextPackSummary(
  entity: AgentRunEntity,
  contextPack: AgentRunEntity["spec"]["context_pack"],
): AgentContextPackSummary {
  if (!contextPack) {
    throw new Error("context_pack is required");
  }
  return {
    run_id: entityId(entity),
    run_title: entityTitle(entity),
    context_pack_id: contextPack.id,
    generated_at: contextPack.generated_at,
    checksum: contextPack.checksum,
    source_revision_count: contextPack.source_revisions.length,
    included_entity_count: contextPack.included_entity_ids.length,
    target_repository_ids: contextPack.target_repository_ids,
    target_environment_ids: contextPack.target_environment_ids,
    redactions: contextPack.redactions,
    gaps: contextPack.gaps,
    ...(contextPack.next_valid_action ? { next_valid_action: contextPack.next_valid_action } : {}),
  };
}

function handoffSummary(
  entity: AgentRunEntity,
  handoff: NonNullable<AgentRunEntity["spec"]["handoff"]>,
): AgentHandoffSummary {
  return {
    run_id: entityId(entity),
    run_title: entityTitle(entity),
    created_at: handoff.created_at,
    status: handoff.status,
    summary: handoff.summary,
    ...(handoff.context_pack_id ? { context_pack_id: handoff.context_pack_id } : {}),
    repository_ids: handoff.repository_ids,
    omitted_sensitive_sections: handoff.omitted_sensitive_sections,
    gaps: handoff.gaps,
    confirmation_required: handoff.confirmation_required,
    evidence_ids: handoff.evidence_ids,
    forbidden_reopenings: handoff.forbidden_reopenings,
    ...(handoff.next_valid_action ? { next_valid_action: handoff.next_valid_action } : {}),
  };
}

function blockersForRun(entity: AgentRunEntity): string[] {
  const blockers = [
    ...entity.spec.open_questions.map((question) => `Open question: ${question}`),
    ...entity.spec.risks.map((risk) => `Risk: ${risk}`),
    ...(entity.spec.context_pack?.gaps ?? []).map((gap) => `Context gap: ${gap}`),
    ...(entity.spec.handoff?.gaps ?? []).map((gap) => `Handoff gap: ${gap}`),
  ];
  if (entity.spec.state === "blocked") {
    blockers.push("Run state is blocked.");
  }
  if (entity.spec.result === "blocked") {
    blockers.push("Run result is blocked.");
  }
  if (entity.spec.verification?.status === "failed") {
    blockers.push("Verification failed.");
  }
  if (entity.spec.verification?.status === "not_run") {
    blockers.push("Verification was not run.");
  }
  return blockers;
}

function runGaps(run: AgentRunSurface): AgentHarnessReport["gaps"] {
  return [
    ...(run.context_pack?.gaps ?? []).map((message) => ({
      run_id: run.id,
      run_title: run.title,
      source: "context_pack" as const,
      message,
    })),
    ...(run.handoff?.gaps ?? []).map((message) => ({
      run_id: run.id,
      run_title: run.title,
      source: "handoff" as const,
      message,
    })),
    ...run.blockers
      .filter((blocker) => blocker.startsWith("Open question: "))
      .map((message) => ({
        run_id: run.id,
        run_title: run.title,
        source: "open_question" as const,
        message: message.replace(/^Open question: /, ""),
      })),
    ...run.blockers
      .filter((blocker) => blocker.startsWith("Risk: "))
      .map((message) => ({
        run_id: run.id,
        run_title: run.title,
        source: "risk" as const,
        message: message.replace(/^Risk: /, ""),
      })),
    ...run.blockers
      .filter(
        (blocker) => blocker === "Verification failed." || blocker === "Verification was not run.",
      )
      .map((message) => ({
        run_id: run.id,
        run_title: run.title,
        source: "verification" as const,
        message,
      })),
  ];
}
