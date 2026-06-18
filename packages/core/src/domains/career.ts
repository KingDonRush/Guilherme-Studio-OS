import {
  entityId,
  entityRevision,
  entityTitle,
  nowIso,
  type PreparedAction,
  type StudioEntity,
} from "@guilherme-studio/schemas";
import { asRecord, recordString, recordStringArray } from "../record-utils.js";
import { AgentsDomainService } from "./agents.js";
import { DomainServiceBase } from "./base.js";
import { CrmDomainService } from "./crm.js";
import { mergeRelations, normalizeComparable, normalizeUrl, uniqueStrings } from "./utils.js";

type SourcePlatform = "linkedin" | "company-site" | "job-board" | "referral" | "other";
type FitRecommendation = "apply" | "research" | "defer" | "reject";
type CareerOutcome = "rejected" | "no-response" | "withdrawn" | "offered" | "accepted";

interface CareerRequirementInput {
  text: string;
  type?: "explicit" | "inferred" | "optional";
  source_ref?: string;
}

interface ApplicationAnswerInput {
  prompt: string;
  answer: string;
  evidence_ids?: string[];
}

interface EvidenceMapInput {
  role_family: string;
  required_signal: string;
  evidence_ids?: string[];
  gap?: string;
}

function sourcePlatformFromUrl(sourceUrl: string): SourcePlatform {
  const normalized = normalizeUrl(sourceUrl);
  if (normalized.includes("linkedin.com/jobs")) {
    return "linkedin";
  }
  if (
    normalized.includes("jobs") ||
    normalized.includes("greenhouse") ||
    normalized.includes("lever.co")
  ) {
    return "job-board";
  }
  return "company-site";
}

function duplicateKey(input: {
  sourceUrl: string;
  title: string;
  organizationId?: string;
}): string {
  return normalizeComparable(
    `${normalizeUrl(input.sourceUrl)}:${input.organizationId ?? "unknown-org"}:${input.title}`,
  );
}

function requirementTexts(entity: StudioEntity): string[] {
  const requirements = Reflect.get(entity.spec, "requirements");
  if (!Array.isArray(requirements)) {
    return [];
  }
  return requirements
    .map((entry) => recordString(asRecord(entry), "text"))
    .filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
}

function hasAnySignal(requirement: string, signals: string[]): boolean {
  const normalizedRequirement = normalizeComparable(requirement);
  return signals.some((signal) => {
    const normalizedSignal = normalizeComparable(signal);
    return (
      normalizedRequirement.includes(normalizedSignal) ||
      normalizedSignal.includes(normalizedRequirement)
    );
  });
}

function nonEmpty(value: string | undefined): value is string {
  return typeof value === "string" && value.length > 0;
}

export class CareerDomainService extends DomainServiceBase {
  async recordRoleStrategy(input: {
    title?: string;
    roleFamilies: string[];
    employmentTypes?: string[];
    geographies?: string[];
    timezone?: string;
    language?: string;
    salaryExpectation?: string;
    unacceptableConstraints?: string[];
    evidenceMap?: EvidenceMapInput[];
  }): Promise<StudioEntity> {
    const evidenceIds = (input.evidenceMap ?? []).flatMap((entry) => entry.evidence_ids ?? []);
    await this.requireEvidenceIds(evidenceIds);
    return this.entities.create({
      kind: "decision",
      title: input.title ?? "International career role strategy",
      status: "done",
      relations: evidenceIds.map((targetId) => ({ type: "supported_by", target_id: targetId })),
      data: {
        decision_type: "career_role_strategy",
        decision: "Target international roles using the recorded strategy constraints.",
        role_families: uniqueStrings(input.roleFamilies),
        employment_types: uniqueStrings(input.employmentTypes ?? []),
        geographies: uniqueStrings(input.geographies ?? []),
        ...(input.timezone ? { timezone: input.timezone } : {}),
        ...(input.language ? { language: input.language } : {}),
        ...(input.salaryExpectation ? { salary_expectation: input.salaryExpectation } : {}),
        unacceptable_constraints: uniqueStrings(input.unacceptableConstraints ?? []),
        evidence_map: input.evidenceMap ?? [],
        decided_at: nowIso(),
      },
    });
  }

  async registerJobOpportunity(input: {
    title: string;
    sourceUrl: string;
    organizationId?: string;
    roleTitle?: string;
    roleFamily?: string;
    employmentType?: string;
    geography?: string;
    timezone?: string;
    language?: string;
    compensation?: string;
    requirements?: CareerRequirementInput[];
    deadlineAt?: string;
    contactName?: string;
    contactUrl?: string;
    sourceFreshness?: "fresh" | "stale" | "expired" | "unknown";
  }): Promise<StudioEntity> {
    if (input.organizationId) {
      await this.requireKind(input.organizationId, "organization");
    }
    const key = duplicateKey(input);
    return this.entities.create({
      kind: "jobApplication",
      title: input.title,
      status: input.sourceFreshness === "expired" ? "archived" : "active",
      relations: input.organizationId
        ? [{ type: "role_at_organization", target_id: input.organizationId }]
        : [],
      data: {
        source_url: input.sourceUrl,
        source_platform: sourcePlatformFromUrl(input.sourceUrl),
        source_freshness: input.sourceFreshness ?? "fresh",
        stage: input.sourceFreshness === "expired" ? "archived" : "discovered",
        duplicate_key: key,
        ...(input.organizationId ? { organization_id: input.organizationId } : {}),
        role_title: input.roleTitle ?? input.title,
        ...(input.roleFamily ? { role_family: input.roleFamily } : {}),
        ...(input.employmentType ? { employment_type: input.employmentType } : {}),
        ...(input.geography ? { geography: input.geography } : {}),
        ...(input.timezone ? { timezone: input.timezone } : {}),
        ...(input.language ? { language: input.language } : {}),
        ...(input.compensation ? { compensation: input.compensation } : {}),
        requirements: input.requirements ?? [],
        ...(input.deadlineAt ? { deadline_at: input.deadlineAt } : {}),
        ...(input.contactName ? { contact_name: input.contactName } : {}),
        ...(input.contactUrl ? { contact_url: input.contactUrl } : {}),
      },
    });
  }

  async reviewRoleDuplicates(input: {
    sourceUrl?: string;
    title?: string;
    organizationId?: string;
  }): Promise<{
    query: Record<string, string>;
    candidates: Array<{ entity_id: string; title: string; stage?: string; reasons: string[] }>;
  }> {
    const queryUrl = input.sourceUrl ? normalizeUrl(input.sourceUrl) : "";
    const queryTitle = input.title ? normalizeComparable(input.title) : "";
    const queryOrg = input.organizationId ?? "";
    const candidates = (await this.context.entities.scan())
      .map((file) => file.entity)
      .filter((entity) => entity.kind === "jobApplication")
      .map((entity) => {
        const sourceUrl = recordString(entity.spec, "source_url");
        const title = normalizeComparable(entityTitle(entity));
        const organizationId = recordString(entity.spec, "organization_id");
        const reasons: string[] = [];
        if (queryUrl && sourceUrl && normalizeUrl(sourceUrl) === queryUrl) {
          reasons.push("source_url");
        }
        if (queryTitle && (title === queryTitle || title.includes(queryTitle))) {
          reasons.push("title");
        }
        if (queryOrg && organizationId === queryOrg) {
          reasons.push("organization");
        }
        const stage = recordString(entity.spec, "stage");
        return {
          entity_id: entityId(entity),
          title: entityTitle(entity),
          ...(stage ? { stage } : {}),
          reasons,
        };
      })
      .filter((candidate) => candidate.reasons.length > 0)
      .sort((left, right) => right.reasons.length - left.reasons.length);
    return {
      query: {
        ...(input.sourceUrl ? { source_url: input.sourceUrl } : {}),
        ...(input.title ? { title: input.title } : {}),
        ...(input.organizationId ? { organization_id: input.organizationId } : {}),
      },
      candidates,
    };
  }

  async analyzeRoleFit(
    applicationId: string,
    input: { verifiedSignals?: string[]; evidenceIds?: string[]; rationale?: string },
  ): Promise<StudioEntity> {
    await this.requireEvidenceIds(input.evidenceIds ?? []);
    return this.entities.update(applicationId, (entity) => {
      if (entity.kind !== "jobApplication") {
        throw new Error(`Expected jobApplication entity, got ${entity.kind}`);
      }
      const requirements = requirementTexts(entity);
      const signals = uniqueStrings(input.verifiedSignals ?? []);
      const matched = requirements.filter((requirement) => hasAnySignal(requirement, signals));
      const gaps = requirements.filter((requirement) => !matched.includes(requirement));
      const recommendation: FitRecommendation =
        requirements.length === 0
          ? "research"
          : gaps.length === 0
            ? "apply"
            : signals.length === 0
              ? "research"
              : "defer";
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: "active",
          stage: "analyzed",
          fit_analysis: {
            analyzed_at: nowIso(),
            recommendation,
            rationale:
              input.rationale ??
              (gaps.length === 0
                ? "All recorded requirements have a matching verified signal."
                : "Some recorded requirements still need evidence or research."),
            verified_signals: signals,
            matched_requirements: matched,
            gaps,
            evidence_ids: input.evidenceIds ?? [],
          },
        },
        relations: mergeRelations(
          entity.relations,
          (input.evidenceIds ?? []).map((targetId) => ({
            type: "supported_by",
            target_id: targetId,
          })),
        ),
      };
    });
  }

  async prepareApplication(input: {
    title: string;
    organizationId?: string;
    sourceUrl: string;
    roleFamily?: string;
    resumeRef?: string;
    coverMessage?: string;
    portfolioLinks?: string[];
    repositoryIds?: string[];
    evidenceIds?: string[];
    answers?: ApplicationAnswerInput[];
  }): Promise<StudioEntity> {
    if (input.organizationId) {
      await this.requireKind(input.organizationId, "organization");
    }
    for (const repositoryId of input.repositoryIds ?? []) {
      await this.requireKind(repositoryId, "repository");
    }
    await this.requireEvidenceIds(input.evidenceIds ?? []);
    return this.entities.create({
      kind: "jobApplication",
      title: input.title,
      status: "draft",
      relations: [
        ...(input.organizationId ? [{ type: "applies_to", target_id: input.organizationId }] : []),
        ...(input.repositoryIds ?? []).map((targetId) => ({
          type: "uses_repository",
          target_id: targetId,
        })),
        ...(input.evidenceIds ?? []).map((targetId) => ({
          type: "supported_by",
          target_id: targetId,
        })),
      ],
      data: {
        source_url: input.sourceUrl,
        source_platform: sourcePlatformFromUrl(input.sourceUrl),
        source_freshness: "fresh",
        stage: "prepared",
        prepared_at: nowIso(),
        duplicate_key: duplicateKey(input),
        ...(input.organizationId ? { organization_id: input.organizationId } : {}),
        ...(input.roleFamily ? { role_family: input.roleFamily } : {}),
        ...(input.resumeRef ? { resume_ref: input.resumeRef } : {}),
        ...(input.coverMessage ? { cover_message: input.coverMessage } : {}),
        portfolio_links: input.portfolioLinks ?? [],
        repository_ids: input.repositoryIds ?? [],
        material_evidence_ids: input.evidenceIds ?? [],
        answers: input.answers ?? [],
      },
    });
  }

  async validateApplication(applicationId: string): Promise<StudioEntity> {
    return this.entities.update(applicationId, (entity) => {
      if (entity.kind !== "jobApplication") {
        throw new Error(`Expected jobApplication entity, got ${entity.kind}`);
      }
      const missing = [
        !recordString(entity.spec, "source_url") ? "source_url" : undefined,
        !recordString(entity.spec, "resume_ref") ? "resume_ref" : undefined,
        !recordString(entity.spec, "cover_message") ? "cover_message" : undefined,
        recordStringArray(entity.spec, "portfolio_links").length === 0
          ? "portfolio_links"
          : undefined,
        recordStringArray(entity.spec, "material_evidence_ids").length === 0
          ? "material_evidence_ids"
          : undefined,
      ].filter(nonEmpty);
      const warnings = [
        recordString(entity.spec, "source_platform") !== "linkedin"
          ? "source is not LinkedIn; verify job source manually"
          : undefined,
        !Reflect.get(entity.spec, "fit_analysis") ? "fit analysis not recorded" : undefined,
      ].filter(nonEmpty);
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: missing.length > 0 ? "blocked" : "active",
          stage: "validated",
          validation: {
            checked_at: nowIso(),
            status: missing.length > 0 ? "blocked" : "valid",
            missing,
            warnings,
            checked_urls: [
              recordString(entity.spec, "source_url"),
              ...recordStringArray(entity.spec, "portfolio_links"),
            ].filter(nonEmpty),
          },
        },
      };
    });
  }

  async prepareSubmission(input: {
    applicationId: string;
    channel?: string;
    message?: string;
  }): Promise<PreparedAction> {
    const application = await this.requireKind(input.applicationId, "jobApplication");
    const validation = asRecord(Reflect.get(application.spec, "validation"));
    if (recordString(validation, "status") !== "valid") {
      throw new Error("Application submission requires valid application validation.");
    }
    return this.actions.prepare({
      actionType: "career.application-submit.prepare",
      provider: "fake/local",
      target: input.applicationId,
      sourceRevisions: { [input.applicationId]: entityRevision(application) },
      payload: {
        application_id: input.applicationId,
        channel: input.channel ?? "linkedin",
        source_url: recordString(application.spec, "source_url") ?? null,
        title: entityTitle(application),
        message: input.message ?? recordString(application.spec, "cover_message") ?? "",
        resume_ref: recordString(application.spec, "resume_ref") ?? null,
        portfolio_links: recordStringArray(application.spec, "portfolio_links"),
        material_evidence_ids: recordStringArray(application.spec, "material_evidence_ids"),
      },
    });
  }

  async recordSubmission(input: {
    applicationId: string;
    preparedActionId: string;
    submittedAt?: string;
    reference?: string;
  }): Promise<StudioEntity> {
    const action = await this.actions.get(input.preparedActionId);
    if (!["confirmed", "executed", "reconciled"].includes(action.status)) {
      throw new Error("Application submission requires confirmed prepared action.");
    }
    return this.entities.update(input.applicationId, (entity) => {
      if (entity.kind !== "jobApplication") {
        throw new Error(`Expected jobApplication entity, got ${entity.kind}`);
      }
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: "waiting",
          stage: "submitted",
          submitted_at: input.submittedAt ?? nowIso(),
          submission_channel: recordString(action.payload, "channel") ?? "linkedin",
          submission_prepared_action_id: input.preparedActionId,
          submission_payload_checksum: action.payload_checksum,
          ...(input.reference ? { submission_reference: input.reference } : {}),
        },
      };
    });
  }

  async scheduleApplicationFollowUp(input: {
    applicationId: string;
    followUpAt: string;
    message?: string;
    channel?: string;
    policy?: string;
  }): Promise<{ application: StudioEntity; action?: PreparedAction }> {
    const application = await this.entities.update(input.applicationId, (entity) => {
      if (entity.kind !== "jobApplication") {
        throw new Error(`Expected jobApplication entity, got ${entity.kind}`);
      }
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: "waiting",
          stage: "follow-up",
          follow_up_at: input.followUpAt,
          follow_up_channel: input.channel ?? "linkedin",
          ...(input.policy ? { follow_up_policy: input.policy } : {}),
        },
      };
    });
    const action = input.message
      ? await new CrmDomainService(this.context).prepareCommunication({
          subjectId: input.applicationId,
          channel: input.channel ?? "linkedin",
          message: input.message,
        })
      : undefined;
    return { application, ...(action ? { action } : {}) };
  }

  async recordApplicationInterview(input: {
    applicationId: string;
    interviewAt: string;
    notes?: string;
  }): Promise<StudioEntity> {
    return this.entities.update(input.applicationId, (entity) => {
      if (entity.kind !== "jobApplication") {
        throw new Error(`Expected jobApplication entity, got ${entity.kind}`);
      }
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: "active",
          stage: "interview",
          interview_at: input.interviewAt,
          ...(input.notes ? { interview_notes: input.notes } : {}),
        },
      };
    });
  }

  async buildInterviewContext(input: {
    applicationId: string;
    nextAction?: string;
  }): Promise<StudioEntity> {
    const application = await this.requireKind(input.applicationId, "jobApplication");
    const agents = new AgentsDomainService(this.context);
    const run = await agents.startAgentRun({
      title: `Interview context for ${entityTitle(application)}`,
      objective: `Prepare interview context for ${entityTitle(application)} without unrelated confidential data.`,
      phase: "planning",
      risk: "normal",
      classification: application.metadata.classification,
      owningEntityIds: [input.applicationId],
      allowed: ["read_context", "prepare_interview"],
      confirmationRequired: ["external_send"],
      prohibited: ["invent_claims", "include_unrelated_confidential_data"],
      material: false,
    });
    const oriented = await agents.buildContextPack({
      runId: entityId(run),
      nextValidAction: input.nextAction ?? "Prepare interview answers from verified evidence.",
      forbiddenReopenings: ["Do not invent experience, clients or claims."],
    });
    const contextPack = Reflect.get(oriented.spec, "context_pack");
    const contextPackId = asRecord(contextPack)
      ? recordString(asRecord(contextPack), "id")
      : undefined;
    await this.entities.update(input.applicationId, (entity) => ({
      ...entity,
      spec: {
        ...entity.spec,
        interview_context_run_id: entityId(oriented),
        ...(contextPackId ? { interview_context_pack_id: contextPackId } : {}),
      },
      relations: mergeRelations(entity.relations, [
        { type: "has_context_run", target_id: entityId(oriented) },
      ]),
    }));
    return oriented;
  }

  async recordOutcome(input: {
    applicationId: string;
    outcome: CareerOutcome;
    reason?: string;
    learningNotes?: string;
    sampleSize?: number;
    evidenceIds?: string[];
  }): Promise<StudioEntity> {
    await this.requireEvidenceIds(input.evidenceIds ?? []);
    return this.entities.update(input.applicationId, (entity) => {
      if (entity.kind !== "jobApplication") {
        throw new Error(`Expected jobApplication entity, got ${entity.kind}`);
      }
      const sampleSize = input.sampleSize ?? 1;
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: ["offered", "accepted"].includes(input.outcome)
            ? "won"
            : input.outcome === "no-response"
              ? "waiting"
              : "lost",
          stage: input.outcome,
          outcome: input.outcome,
          ...(input.reason ? { outcome_reason: input.reason } : {}),
          ...(input.learningNotes ? { learning_notes: input.learningNotes } : {}),
          sample_size: sampleSize,
          ...(sampleSize < 3
            ? {
                sample_size_warning:
                  "Tiny sample: do not update career strategy without explicit decision or more evidence.",
              }
            : {}),
          material_evidence_ids: uniqueStrings([
            ...recordStringArray(entity.spec, "material_evidence_ids"),
            ...(input.evidenceIds ?? []),
          ]),
        },
        relations: mergeRelations(
          entity.relations,
          (input.evidenceIds ?? []).map((targetId) => ({
            type: "supported_by",
            target_id: targetId,
          })),
        ),
      };
    });
  }

  async resolveCareerNextActions(): Promise<{
    generated_at: string;
    actions: Array<{ application_id: string; title: string; reasons: string[]; due_at?: string }>;
  }> {
    const applications = (await this.context.entities.scan())
      .map((file) => file.entity)
      .filter((entity) => entity.kind === "jobApplication");
    return {
      generated_at: nowIso(),
      actions: applications
        .map((application) => {
          const validation = asRecord(Reflect.get(application.spec, "validation"));
          const followUpAt = recordString(application.spec, "follow_up_at");
          const reasons = [
            !Reflect.get(application.spec, "fit_analysis") ? "fit-analysis-missing" : undefined,
            recordString(validation, "status") === "blocked" ? "validation-blocked" : undefined,
            recordString(application.spec, "stage") === "submitted" && !followUpAt
              ? "follow-up-missing"
              : undefined,
          ].filter(nonEmpty);
          return {
            application_id: entityId(application),
            title: entityTitle(application),
            reasons,
            ...(followUpAt ? { due_at: followUpAt } : {}),
          };
        })
        .filter((entry) => entry.reasons.length > 0),
    };
  }
}
