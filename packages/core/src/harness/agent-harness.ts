import {
  type AgentRunPhase,
  AgentRunPhaseSchema,
  type AgentRunRisk,
  AgentRunRiskSchema,
  type AgentRunState,
  AgentRunStateSchema,
  type ContextPack,
  entityId,
  entityRevision,
  entityStatus,
  entityTitle,
  nowIso,
  type StudioEntity,
  stableChecksum,
} from "@guilherme-studio/schemas";
import type { StudioContext } from "../context.js";
import { EntityService } from "../entity-service.js";

const STATE_TRANSITIONS: Record<AgentRunState, AgentRunState[]> = {
  draft: ["oriented", "blocked"],
  oriented: ["authorized", "blocked", "handoff_ready"],
  authorized: ["in_progress", "verifying", "blocked", "handoff_ready"],
  in_progress: ["verifying", "blocked", "handoff_ready"],
  verifying: ["in_progress", "blocked", "handoff_ready"],
  blocked: ["in_progress", "handoff_ready", "closed"],
  handoff_ready: ["in_progress", "blocked", "closed"],
  closed: [],
};

const SECRET_VALUE_PATTERNS = [
  /\b(api[_-]?key|token|secret|password|passwd|oauth|credential)\s*[:=]\s*['"]?[A-Za-z0-9_\-.]{12,}/i,
  /\bsk-[A-Za-z0-9]{20,}\b/,
  /\bghp_[A-Za-z0-9_]{20,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
];

export interface StartAgentRunInput {
  title?: string | undefined;
  objective: string;
  requestedBy?: string | undefined;
  actorId?: string | undefined;
  phase?: AgentRunPhase | undefined;
  risk?: AgentRunRisk | undefined;
  model?: string | undefined;
  taskId?: string | undefined;
  owningEntityIds?: string[] | undefined;
  targetRepositoryIds?: string[] | undefined;
  targetEnvironmentIds?: string[] | undefined;
  allowed?: string[] | undefined;
  confirmationRequired?: string[] | undefined;
  prohibited?: string[] | undefined;
  material?: boolean | undefined;
}

export interface BuildContextPackInput {
  runId: string;
  nextValidAction?: string | undefined;
  forbiddenReopenings?: string[] | undefined;
}

export interface AuthorizeAgentRunInput {
  runId: string;
  allowed?: string[] | undefined;
  confirmationRequired?: string[] | undefined;
  prohibited?: string[] | undefined;
}

export interface RecordObservationInput {
  runId: string;
  source: "git" | "runtime" | "user" | "handoff" | "docs" | "code" | "other";
  summary: string;
  repositoryId?: string | undefined;
  contradictions?: string[] | undefined;
}

export interface RecordAgentActionInput {
  runId: string;
  action: string;
  status?: "planned" | "executed" | "blocked" | "failed" | undefined;
  command?: string | undefined;
  targetId?: string | undefined;
  resultSummary?: string | undefined;
  evidenceIds?: string[] | undefined;
}

export interface RecordAgentEvidenceInput {
  runId: string;
  evidenceIds: string[];
}

export interface CompleteVerificationInput {
  runId: string;
  status: "passed" | "failed" | "not_run";
  command?: string | undefined;
  resultSummary?: string | undefined;
  artifactPath?: string | undefined;
  notRunReason?: string | undefined;
}

export interface CreateRunHandoffInput {
  runId: string;
  summary: string;
  nextValidAction: string;
  gaps?: string[] | undefined;
  forbiddenReopenings?: string[] | undefined;
  confirmationRequired?: string[] | undefined;
  evidenceIds?: string[] | undefined;
}

export interface CloseAgentRunInput {
  runId: string;
  outcome?: string | undefined;
}

export class AgentHarnessService {
  readonly entities: EntityService;

  constructor(readonly context: StudioContext) {
    this.entities = new EntityService(context);
  }

  async startAgentRun(input: StartAgentRunInput): Promise<StudioEntity> {
    const phase = AgentRunPhaseSchema.parse(input.phase ?? "implementation");
    const risk = AgentRunRiskSchema.parse(input.risk ?? "normal");
    const owningEntityIds = unique(input.owningEntityIds ?? []);
    const targetRepositoryIds = unique(input.targetRepositoryIds ?? []);
    const targetEnvironmentIds = unique(input.targetEnvironmentIds ?? []);
    const relations = [];

    if (input.taskId) {
      await this.requireKind(input.taskId, "task");
      relations.push({ type: "executes_task", target_id: input.taskId });
    }
    for (const id of owningEntityIds) {
      await this.requireEntity(id);
      relations.push({ type: "owns_entity", target_id: id });
    }
    for (const id of targetRepositoryIds) {
      await this.requireKind(id, "repository");
      relations.push({ type: "uses_repository", target_id: id });
    }
    for (const id of targetEnvironmentIds) {
      await this.requireKind(id, "environment");
      relations.push({ type: "uses_environment", target_id: id });
    }

    const run = await this.entities.create({
      kind: "agentRun",
      title: input.title ?? input.objective,
      status: "active",
      relations,
      data: {
        objective: input.objective,
        started_at: nowIso(),
        state: "draft",
        requested_by: input.requestedBy,
        actor_id: input.actorId,
        phase,
        risk,
        material: input.material ?? true,
        result: "running",
        owning_entities: owningEntityIds,
        target_repositories: targetRepositoryIds,
        target_environments: targetEnvironmentIds,
        authority: {
          allowed: input.allowed ?? [],
          confirmation_required: input.confirmationRequired ?? [],
          prohibited: input.prohibited ?? [],
        },
        evidence_ids: [],
        ...(input.model ? { model: input.model } : {}),
      },
    });
    await this.entities.recordEvent("agent.started", entityId(run), {
      objective: input.objective,
      phase,
      risk,
      target_repository_ids: targetRepositoryIds,
    });
    return run;
  }

  async buildContextPack(input: BuildContextPackInput): Promise<StudioEntity> {
    const run = await this.requireAgentRun(input.runId);
    this.assertNotClosed(run);
    const spec = run.spec;
    const referencedIds = unique([
      entityId(run),
      ...spec.owning_entities,
      ...spec.target_repositories,
      ...spec.target_environments,
      ...spec.evidence_ids,
      ...run.relations.map((relation) => relation.target_id),
    ]);
    const entities = await this.getEntities(referencedIds);
    const sourceRevisions = entities.map((entity) => ({
      entity_id: entityId(entity),
      kind: entity.kind,
      title: entityTitle(entity),
      revision: entityRevision(entity),
    }));
    const missingIds = referencedIds.filter(
      (id) => !entities.some((entity) => entityId(entity) === id),
    );
    const packWithoutChecksum = {
      id: `ctx_${entityId(run).replace(/^run_/, "")}_${Date.now()}`,
      generated_at: nowIso(),
      objective: spec.objective,
      source_revisions: sourceRevisions,
      included_entity_ids: entities.map((entity) => entityId(entity)),
      target_repository_ids: spec.target_repositories,
      target_environment_ids: spec.target_environments,
      sections: [
        {
          title: "Objective",
          summary: spec.objective,
          entity_ids: [entityId(run)],
        },
        {
          title: "Authority",
          summary: summarizeAuthority(spec.authority),
          entity_ids: [entityId(run)],
        },
        {
          title: "Entity references",
          summary:
            entities
              .filter((entity) => entityId(entity) !== entityId(run))
              .map(
                (entity) =>
                  `${entity.kind} ${entityId(entity)} "${entityTitle(entity)}" is ${entityStatus(entity)} at revision ${entityRevision(entity)}`,
              )
              .join("; ") || "No explicit owning entities were linked.",
          entity_ids: entities.map((entity) => entityId(entity)),
        },
      ],
      redactions: ["Canonical entity bodies are summarized; full specs are not embedded."],
      gaps: missingIds.map((id) => `Referenced entity not found: ${id}`),
      forbidden_reopenings: input.forbiddenReopenings ?? [],
      ...(input.nextValidAction ? { next_valid_action: input.nextValidAction } : {}),
    };
    assertNoSecretLikeText(packWithoutChecksum);
    const contextPack = {
      ...packWithoutChecksum,
      checksum: stableChecksum(packWithoutChecksum),
    } satisfies ContextPack;
    assertNoSecretLikeText(contextPack);

    const next = await this.updateRun(input.runId, (entity) => ({
      ...entity,
      spec: {
        ...entity.spec,
        state: advanceState(entity.spec.state, "oriented"),
        context_pack: contextPack,
        next_valid_action: input.nextValidAction ?? entity.spec.next_valid_action,
      },
    }));
    await this.entities.recordEvent("agent.context_built", input.runId, {
      context_pack_id: contextPack.id,
      checksum: contextPack.checksum,
      included_entity_ids: contextPack.included_entity_ids,
    });
    return next;
  }

  async authorizeAgentRun(input: AuthorizeAgentRunInput): Promise<StudioEntity> {
    const run = await this.requireAgentRun(input.runId);
    this.assertState(run, ["oriented", "authorized", "in_progress"], "authorize");
    if (!run.spec.context_pack) {
      throw new Error(`Agent run ${input.runId} requires a context pack before authorization`);
    }
    const next = await this.updateRun(input.runId, (entity) => ({
      ...entity,
      spec: {
        ...entity.spec,
        state: advanceState(entity.spec.state, "authorized"),
        authority: {
          allowed: input.allowed ?? entity.spec.authority.allowed,
          confirmation_required:
            input.confirmationRequired ?? entity.spec.authority.confirmation_required,
          prohibited: input.prohibited ?? entity.spec.authority.prohibited,
        },
      },
    }));
    await this.entities.recordEvent("agent.authorized", input.runId, {
      authority: next.spec.authority,
    });
    return next;
  }

  async recordObservation(input: RecordObservationInput): Promise<StudioEntity> {
    if (input.repositoryId) {
      await this.requireKind(input.repositoryId, "repository");
    }
    const run = await this.requireAgentRun(input.runId);
    this.assertState(
      run,
      ["oriented", "authorized", "in_progress", "verifying", "blocked"],
      "record observation",
    );
    if (!run.spec.context_pack) {
      throw new Error(`Agent run ${input.runId} requires a context pack before observations`);
    }
    assertNoSecretLikeText(input);
    const observation = {
      observed_at: nowIso(),
      source: input.source,
      summary: input.summary,
      ...(input.repositoryId ? { repository_id: input.repositoryId } : {}),
      contradictions: input.contradictions ?? [],
    };
    const next = await this.updateRun(input.runId, (entity) => ({
      ...entity,
      spec: {
        ...entity.spec,
        state:
          entity.spec.state === "authorized" || entity.spec.state === "blocked"
            ? "in_progress"
            : entity.spec.state,
        observations: [...entity.spec.observations, observation],
      },
    }));
    await this.entities.recordEvent("agent.observed", input.runId, observation);
    return next;
  }

  async recordAgentAction(input: RecordAgentActionInput): Promise<StudioEntity> {
    await this.requireEvidenceIds(input.evidenceIds ?? []);
    if (input.targetId) {
      await this.requireEntity(input.targetId);
    }
    const run = await this.requireAgentRun(input.runId);
    this.assertState(run, ["authorized", "in_progress", "verifying"], "record action");
    assertNoSecretLikeText(input);
    const action = {
      recorded_at: nowIso(),
      action: input.action,
      status: input.status ?? "executed",
      ...(input.command ? { command: input.command } : {}),
      ...(input.targetId ? { target_id: input.targetId } : {}),
      ...(input.resultSummary ? { result_summary: input.resultSummary } : {}),
      evidence_ids: input.evidenceIds ?? [],
    };
    const next = await this.updateRun(input.runId, (entity) => ({
      ...entity,
      spec: {
        ...entity.spec,
        state: "in_progress",
        actions: [...entity.spec.actions, action],
        evidence_ids: unique([...entity.spec.evidence_ids, ...(input.evidenceIds ?? [])]),
      },
      relations: appendRelations(
        entity.relations,
        (input.evidenceIds ?? []).map((id) => ({ type: "verified_by", target_id: id })),
      ),
    }));
    await this.entities.recordEvent("agent.action_recorded", input.runId, action);
    return next;
  }

  async recordAgentEvidence(input: RecordAgentEvidenceInput): Promise<StudioEntity> {
    if (input.evidenceIds.length === 0) {
      throw new Error("evidence_ids is required");
    }
    await this.requireEvidenceIds(input.evidenceIds);
    const run = await this.requireAgentRun(input.runId);
    this.assertNotClosed(run);
    const next = await this.updateRun(input.runId, (entity) => ({
      ...entity,
      spec: {
        ...entity.spec,
        evidence_ids: unique([...entity.spec.evidence_ids, ...input.evidenceIds]),
      },
      relations: appendRelations(
        entity.relations,
        input.evidenceIds.map((id) => ({ type: "verified_by", target_id: id })),
      ),
    }));
    await this.entities.recordEvent("agent.evidence_recorded", input.runId, {
      evidence_ids: input.evidenceIds,
    });
    return next;
  }

  async completeVerification(input: CompleteVerificationInput): Promise<StudioEntity> {
    const run = await this.requireAgentRun(input.runId);
    this.assertState(run, ["in_progress", "verifying", "blocked"], "complete verification");
    if (input.status === "not_run" && !input.notRunReason) {
      throw new Error("not_run_reason is required when verification status is not_run");
    }
    if (input.status !== "not_run" && !input.command && !input.resultSummary) {
      throw new Error("command or result_summary is required when verification ran");
    }
    assertNoSecretLikeText(input);
    const verification = {
      status: input.status,
      verified_at: nowIso(),
      ...(input.command ? { command: input.command } : {}),
      ...(input.resultSummary ? { result_summary: input.resultSummary } : {}),
      ...(input.artifactPath ? { artifact_path: input.artifactPath } : {}),
      ...(input.notRunReason ? { not_run_reason: input.notRunReason } : {}),
    };
    const next = await this.updateRun(input.runId, (entity) => ({
      ...entity,
      spec: {
        ...entity.spec,
        state: "verifying",
        verification,
      },
    }));
    await this.entities.recordEvent("agent.verification_completed", input.runId, verification);
    return next;
  }

  async createRunHandoff(input: CreateRunHandoffInput): Promise<StudioEntity> {
    await this.requireEvidenceIds(input.evidenceIds ?? []);
    const run = await this.requireAgentRun(input.runId);
    this.assertState(
      run,
      ["oriented", "authorized", "in_progress", "verifying", "blocked", "handoff_ready"],
      "create handoff",
    );
    assertNoSecretLikeText(input);
    const evidenceIds = unique([...(input.evidenceIds ?? []), ...run.spec.evidence_ids]);
    const handoffStatus: "blocked" | "ready" = (input.gaps?.length ?? 0) > 0 ? "blocked" : "ready";
    const handoff = {
      summary: input.summary,
      created_at: nowIso(),
      ...(run.spec.context_pack ? { context_pack_id: run.spec.context_pack.id } : {}),
      repository_ids: run.spec.target_repositories,
      omitted_sensitive_sections: run.spec.context_pack?.redactions ?? [],
      gaps: input.gaps ?? [],
      next_valid_action: input.nextValidAction,
      forbidden_reopenings: input.forbiddenReopenings ?? [],
      confirmation_required: input.confirmationRequired ?? [],
      evidence_ids: evidenceIds,
      status: handoffStatus,
    };
    const next = await this.updateRun(input.runId, (entity) => ({
      ...entity,
      spec: {
        ...entity.spec,
        state: "handoff_ready",
        handoff,
        evidence_ids: evidenceIds,
        next_valid_action: input.nextValidAction,
      },
    }));
    await this.entities.recordEvent("agent.handoff_created", input.runId, {
      next_valid_action: input.nextValidAction,
      gaps: input.gaps ?? [],
    });
    return next;
  }

  async closeAgentRun(input: CloseAgentRunInput): Promise<StudioEntity> {
    const run = await this.requireAgentRun(input.runId);
    this.assertState(run, ["handoff_ready"], "close");
    const missing = closePreconditionGaps(run);
    if (missing.length > 0) {
      throw new Error(`Agent run close requires: ${missing.join(", ")}`);
    }
    const result = closeResult(run);
    const next = await this.updateRun(input.runId, (entity) => ({
      ...entity,
      spec: {
        ...entity.spec,
        status: result === "complete" ? "done" : "blocked",
        state: "closed",
        result,
        finished_at: nowIso(),
        ...(input.outcome ? { summary: input.outcome } : {}),
      },
    }));
    await this.entities.recordEvent("agent.closed", input.runId, {
      result,
      outcome: input.outcome,
    });
    return next;
  }

  async createLegacyHandoff(input: {
    taskId: string;
    title: string;
    objective: string;
    summary: string;
    repositoryIds?: string[];
  }): Promise<StudioEntity> {
    const run = await this.startAgentRun({
      taskId: input.taskId,
      title: input.title,
      objective: input.objective,
      targetRepositoryIds: input.repositoryIds ?? [],
      allowed: ["read_context", "inspect_repositories"],
      confirmationRequired: [],
      prohibited: ["external_send", "destructive_execute"],
      material: false,
    });
    await this.buildContextPack({
      runId: entityId(run),
      nextValidAction: "Resume from this handoff and inspect current reality before mutation.",
      forbiddenReopenings: [
        "Do not reopen completed context unless runtime reality contradicts it.",
      ],
    });
    return this.createRunHandoff({
      runId: entityId(run),
      summary: input.summary,
      nextValidAction: "Resume from this handoff and inspect current reality before mutation.",
      forbiddenReopenings: [
        "Do not reopen completed context unless runtime reality contradicts it.",
      ],
    });
  }

  private async requireAgentRun(id: string): Promise<Extract<StudioEntity, { kind: "agentRun" }>> {
    const entity = await this.requireEntity(id);
    if (entity.kind !== "agentRun") {
      throw new Error(`Expected agentRun entity, got ${entity.kind}`);
    }
    return entity;
  }

  private async requireEntity(id: string): Promise<StudioEntity> {
    const file = await this.context.entities.get(id);
    if (!file) {
      throw new Error(`Entity not found: ${id}`);
    }
    return file.entity;
  }

  private async requireKind(id: string, kind: StudioEntity["kind"]): Promise<StudioEntity> {
    const entity = await this.requireEntity(id);
    if (entity.kind !== kind) {
      throw new Error(`Expected ${kind} entity, got ${entity.kind}`);
    }
    return entity;
  }

  private async requireEvidenceIds(ids: string[]): Promise<void> {
    for (const id of ids) {
      await this.requireKind(id, "evidence");
    }
  }

  private async getEntities(ids: string[]): Promise<StudioEntity[]> {
    const entities: StudioEntity[] = [];
    for (const id of ids) {
      const file = await this.context.entities.get(id);
      if (file) {
        entities.push(file.entity);
      }
    }
    return entities;
  }

  private async updateRun(
    id: string,
    mutate: (entity: Extract<StudioEntity, { kind: "agentRun" }>) => StudioEntity,
  ): Promise<Extract<StudioEntity, { kind: "agentRun" }>> {
    const updated = await this.entities.update(id, (entity) => {
      if (entity.kind !== "agentRun") {
        throw new Error(`Expected agentRun entity, got ${entity.kind}`);
      }
      const next = mutate(entity);
      if (next.kind !== "agentRun") {
        throw new Error(`Expected agentRun entity, got ${next.kind}`);
      }
      assertValidStateTransition(entity.spec.state, next.spec.state);
      return next;
    });
    if (updated.kind !== "agentRun") {
      throw new Error(`Expected agentRun entity, got ${updated.kind}`);
    }
    return updated;
  }

  private assertState(
    entity: Extract<StudioEntity, { kind: "agentRun" }>,
    states: AgentRunState[],
    action: string,
  ): void {
    const state = AgentRunStateSchema.parse(entity.spec.state);
    if (!states.includes(state)) {
      throw new Error(`Agent run ${entityId(entity)} cannot ${action} while ${state}`);
    }
  }

  private assertNotClosed(entity: Extract<StudioEntity, { kind: "agentRun" }>): void {
    if (entity.spec.state === "closed") {
      throw new Error(`Agent run ${entityId(entity)} is closed`);
    }
  }
}

function assertValidStateTransition(current: AgentRunState, next: AgentRunState): void {
  if (current === next) {
    return;
  }
  const allowed = STATE_TRANSITIONS[current] ?? [];
  if (!allowed.includes(next)) {
    throw new Error(`Invalid agentRun state transition: ${current} -> ${next}`);
  }
}

function advanceState(current: AgentRunState, desired: AgentRunState): AgentRunState {
  assertValidStateTransition(current, desired);
  return desired;
}

function closePreconditionGaps(entity: Extract<StudioEntity, { kind: "agentRun" }>): string[] {
  const spec = entity.spec;
  const handoff = spec.handoff;
  const verification = spec.verification;
  const hasBlocker = (handoff?.gaps.length ?? 0) > 0 || spec.result === "blocked";
  const hasEvidence = spec.evidence_ids.length > 0 || (handoff?.evidence_ids.length ?? 0) > 0;
  const missing: string[] = [];
  if (!spec.context_pack) {
    missing.push("context_pack");
  }
  if (spec.material && spec.observations.length === 0) {
    missing.push("at least one observation");
  }
  if (spec.material && spec.actions.length === 0 && !hasBlocker) {
    missing.push("recorded action or blocker gap");
  }
  if (!verification) {
    missing.push("verification record");
  }
  if (verification?.status === "not_run" && !verification.not_run_reason) {
    missing.push("not_run_reason");
  }
  if (!handoff) {
    missing.push("handoff");
  }
  if (handoff && !handoff.next_valid_action) {
    missing.push("handoff.next_valid_action");
  }
  if (!hasEvidence && !hasBlocker) {
    missing.push("evidence_ids or blocker gap");
  }
  return missing;
}

function closeResult(
  entity: Extract<StudioEntity, { kind: "agentRun" }>,
): "complete" | "blocked" | "failed" {
  const verification = entity.spec.verification;
  if (verification?.status === "failed") {
    return "failed";
  }
  if (verification?.status === "not_run" || (entity.spec.handoff?.gaps.length ?? 0) > 0) {
    return "blocked";
  }
  return "complete";
}

function summarizeAuthority(authority: {
  allowed: string[];
  confirmation_required: string[];
  prohibited: string[];
}): string {
  return [
    `Allowed: ${authority.allowed.length > 0 ? authority.allowed.join(", ") : "none listed"}`,
    `Confirmation required: ${
      authority.confirmation_required.length > 0
        ? authority.confirmation_required.join(", ")
        : "none listed"
    }`,
    `Prohibited: ${
      authority.prohibited.length > 0 ? authority.prohibited.join(", ") : "none listed"
    }`,
  ].join(". ");
}

function assertNoSecretLikeText(value: unknown): void {
  const text = stableChecksum(value) + JSON.stringify(value);
  for (const pattern of SECRET_VALUE_PATTERNS) {
    if (pattern.test(text)) {
      throw new Error("Secret-like value is not allowed in agent context or handoff data");
    }
  }
}

function appendRelations(
  current: StudioEntity["relations"],
  additions: StudioEntity["relations"],
): StudioEntity["relations"] {
  const keys = new Set(current.map((relation) => `${relation.type}:${relation.target_id}`));
  const next = [...current];
  for (const relation of additions) {
    const key = `${relation.type}:${relation.target_id}`;
    if (!keys.has(key)) {
      next.push(relation);
      keys.add(key);
    }
  }
  return next;
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter((value) => value.length > 0))];
}
