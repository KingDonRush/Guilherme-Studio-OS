import {
  createEntity,
  entityId,
  entityRevision,
  entityStatus,
  entityTitle,
  nowIso,
  type PreparedAction,
  type StudioEntity,
  TypedEntitySchema,
} from "@guilherme-studio/schemas";
import { asRecord, recordString, recordStringArray } from "../record-utils.js";
import { DomainServiceBase } from "./base.js";
import { mergeRelations, uniqueStrings } from "./utils.js";

type ResearchFreshness = "fresh" | "stale" | "expired" | "unknown";
type ResearchConfidence = "low" | "medium" | "high";
type ProbabilitySource = "explicit" | "inferred" | "operator-estimate";
type ProposalResponse = "accepted" | "rejected" | "revision_requested" | "no_response";
type NegotiationDecision = "pending" | "accepted" | "rejected" | "deferred";

interface OfferEvidenceMapInput {
  profile: string;
  offer: string;
  proof_claims?: string[];
  evidence_ids?: string[];
  gap?: string;
}

interface ProspectResearchInput {
  source: string;
  sourceUrl?: string;
  observedSituation: string;
  likelyNeed: string;
  fitEvidence?: string[];
  decisionMaker?: string;
  risks?: string[];
  reasonForContact: string;
  confidence?: ResearchConfidence;
  freshness?: ResearchFreshness;
  evidenceIds?: string[];
}

interface OpportunityDiscoveryInput {
  sourceRef?: string;
  summary: string;
  need: string;
  urgency?: string;
  budgetSignal?: string;
  authoritySignal?: string;
  competition?: string;
  nextAction: string;
  ownerId: string;
  probability?: number;
  probabilitySource?: ProbabilitySource;
  evidenceIds?: string[];
}

interface ProposalPackageInput {
  opportunityId: string;
  title?: string;
  version?: string;
  offerRef: string;
  scope: string[];
  exclusions?: string[];
  schedule?: string;
  assumptions?: string[];
  priceLogic?: string;
  paymentTerms: string;
  acceptanceCriteria: string[];
  valueMinor?: number;
  currency?: string;
  evidenceIds?: string[];
}

interface ProposalSendInput {
  proposalId: string;
  recipient: string;
  channel: string;
  message: string;
  artifactRef: string;
  artifactChecksum: string;
  ttlSeconds?: number;
}

const ACTIVE_PREPARED_STATUSES = new Set(["awaiting_confirmation", "confirmed", "executing"]);
const OUTREACH_COOLDOWN_MS = 72 * 60 * 60 * 1000;

function recordNumber(
  record: Record<string, unknown> | undefined,
  key: string,
): number | undefined {
  const value = record ? Reflect.get(record, key) : undefined;
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function relation(targetId: string, type = "supported_by"): { type: string; target_id: string } {
  return { type, target_id: targetId };
}

function proposalIsSent(entity: StudioEntity): boolean {
  const stage = recordString(entity.spec, "stage");
  return ["sent", "accepted", "rejected", "revision_requested"].includes(stage ?? "");
}

function staleResearchWarning(prospect: StudioEntity | undefined): string | undefined {
  if (!prospect) {
    return undefined;
  }
  const research = asRecord(Reflect.get(prospect.spec, "research"));
  const freshness =
    recordString(prospect.spec, "source_freshness") ?? recordString(research, "freshness");
  if (freshness === "stale" || freshness === "expired") {
    return `Prospect research is ${freshness}; refresh source before relying on this opportunity.`;
  }
  return undefined;
}

function proposalPayloadSnapshot(proposal: StudioEntity): Record<string, unknown> {
  return {
    proposal_id: entityId(proposal),
    title: entityTitle(proposal),
    version: recordString(proposal.spec, "version") ?? "v1",
    offer_ref: recordString(proposal.spec, "offer_ref"),
    scope: recordStringArray(proposal.spec, "scope"),
    exclusions: recordStringArray(proposal.spec, "exclusions"),
    assumptions: recordStringArray(proposal.spec, "assumptions"),
    price_logic: recordString(proposal.spec, "price_logic"),
    payment_terms: recordString(proposal.spec, "payment_terms"),
    acceptance_criteria: recordStringArray(proposal.spec, "acceptance_criteria"),
    value_minor: recordNumber(proposal.spec, "value_minor"),
    currency: recordString(proposal.spec, "currency"),
  };
}

export class SalesDomainService extends DomainServiceBase {
  async recordIdealClientProfile(input: {
    title?: string;
    businessTypes: string[];
    needs: string[];
    budgetLogic?: string;
    geographies?: string[];
    technologies?: string[];
    deliveryFit?: string[];
    rejectedCriteria?: string[];
    offerEvidenceMap?: OfferEvidenceMapInput[];
  }): Promise<StudioEntity> {
    const evidenceIds = uniqueStrings(
      (input.offerEvidenceMap ?? []).flatMap((entry) => entry.evidence_ids ?? []),
    );
    await this.requireEvidenceIds(evidenceIds);
    return this.entities.create({
      kind: "decision",
      title: input.title ?? "Sales ideal client and offer-fit strategy",
      status: "done",
      relations: evidenceIds.map((id) => relation(id)),
      data: {
        decision_type: "sales_icp_strategy",
        decision: "Use the recorded fit profile to qualify prospecting and offer selection.",
        business_types: uniqueStrings(input.businessTypes),
        needs: uniqueStrings(input.needs),
        ...(input.budgetLogic ? { budget_logic: input.budgetLogic } : {}),
        geographies: uniqueStrings(input.geographies ?? []),
        technologies: uniqueStrings(input.technologies ?? []),
        delivery_fit: uniqueStrings(input.deliveryFit ?? []),
        rejected_criteria: uniqueStrings(input.rejectedCriteria ?? []),
        offer_evidence_map: (input.offerEvidenceMap ?? []).map((entry) => ({
          profile: entry.profile,
          offer: entry.offer,
          proof_claims: uniqueStrings(entry.proof_claims ?? []),
          evidence_ids: uniqueStrings(entry.evidence_ids ?? []),
          ...(entry.gap ? { gap: entry.gap } : {}),
        })),
        decided_at: nowIso(),
      },
    });
  }

  async researchProspect(prospectId: string, input: ProspectResearchInput): Promise<StudioEntity> {
    await this.requireEvidenceIds(input.evidenceIds ?? []);
    return this.entities.update(prospectId, (entity) => {
      if (entity.kind !== "prospect") {
        throw new Error(`Expected prospect entity, got ${entity.kind}`);
      }
      const freshness = input.freshness ?? "fresh";
      const confidence = input.confidence ?? "medium";
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: "active",
          stage: "researched",
          source: input.source,
          ...(input.sourceUrl ? { source_url: input.sourceUrl } : {}),
          reason_for_contact: input.reasonForContact,
          source_freshness: freshness,
          research_confidence: confidence,
          ...(freshness === "stale" || freshness === "expired"
            ? { research_warning: `Research is ${freshness}; refresh before outreach.` }
            : {}),
          research: {
            source: input.source,
            ...(input.sourceUrl ? { source_url: input.sourceUrl } : {}),
            observed_situation: input.observedSituation,
            likely_need: input.likelyNeed,
            fit_evidence: uniqueStrings(input.fitEvidence ?? []),
            ...(input.decisionMaker ? { decision_maker: input.decisionMaker } : {}),
            risks: uniqueStrings(input.risks ?? []),
            reason_for_contact: input.reasonForContact,
            confidence,
            freshness,
            researched_at: nowIso(),
            evidence_ids: uniqueStrings(input.evidenceIds ?? []),
          },
        },
        relations: mergeRelations(
          entity.relations,
          uniqueStrings(input.evidenceIds ?? []).map((id) => relation(id)),
        ),
      };
    });
  }

  async reviewOutreach(input: { subjectId: string; channel?: string }): Promise<{
    subject_id: string;
    channel?: string;
    active_prepared_actions: Array<{
      action_id: string;
      status: PreparedAction["status"];
      channel?: string;
      payload_checksum: string;
    }>;
    recent_outbound: Array<{
      communication_id: string;
      title: string;
      channel?: string;
      occurred_at?: string;
      outcome?: string;
    }>;
  }> {
    const subject = await this.requireEntity(input.subjectId);
    const channel = input.channel;
    const prepared = (await this.actions.list())
      .filter((action) => action.action_type === "communication.send")
      .filter((action) => ACTIVE_PREPARED_STATUSES.has(action.status))
      .filter((action) => recordString(action.payload, "subject_id") === entityId(subject))
      .filter((action) => !channel || recordString(action.payload, "channel") === channel)
      .map((action) => {
        const actionChannel = recordString(action.payload, "channel");
        return {
          action_id: action.id,
          status: action.status,
          ...(actionChannel ? { channel: actionChannel } : {}),
          payload_checksum: action.payload_checksum,
        };
      });
    const recent = (await this.context.entities.scan())
      .map((file) => file.entity)
      .filter((entity) => entity.kind === "communication")
      .filter((entity) => recordString(entity.spec, "subject_id") === entityId(subject))
      .filter((entity) => recordString(entity.spec, "direction") === "outbound")
      .filter((entity) => !channel || recordString(entity.spec, "channel") === channel)
      .map((entity) => {
        const communicationChannel = recordString(entity.spec, "channel");
        const occurredAt = recordString(entity.spec, "occurred_at");
        const outcome = recordString(entity.spec, "outcome");
        return {
          communication_id: entityId(entity),
          title: entityTitle(entity),
          ...(communicationChannel ? { channel: communicationChannel } : {}),
          ...(occurredAt ? { occurred_at: occurredAt } : {}),
          ...(outcome ? { outcome } : {}),
        };
      })
      .sort((left, right) => (right.occurred_at ?? "").localeCompare(left.occurred_at ?? ""));
    return {
      subject_id: entityId(subject),
      ...(channel ? { channel } : {}),
      active_prepared_actions: prepared,
      recent_outbound: recent,
    };
  }

  async prepareSalesOutreach(input: {
    subjectId: string;
    recipient: string;
    channel: string;
    message: string;
    cta: string;
    evidenceIds: string[];
    reasonForContact?: string;
    ttlSeconds?: number;
  }): Promise<PreparedAction> {
    const subject = await this.requireEntity(input.subjectId);
    await this.requireEvidenceIds(input.evidenceIds);
    const reasonForContact =
      input.reasonForContact ?? recordString(subject.spec, "reason_for_contact");
    if (!reasonForContact) {
      throw new Error("Sales outreach requires a reason_for_contact.");
    }
    const review = await this.reviewOutreach({
      subjectId: input.subjectId,
      channel: input.channel,
    });
    if (review.active_prepared_actions.length > 0) {
      throw new Error(
        `Active outreach already prepared for ${input.subjectId} on ${input.channel}.`,
      );
    }
    const latest = review.recent_outbound[0];
    if (latest?.occurred_at && Date.now() - Date.parse(latest.occurred_at) < OUTREACH_COOLDOWN_MS) {
      throw new Error("Recent outbound communication blocks excessive follow-up.");
    }
    return this.actions.prepare({
      actionType: "communication.send",
      provider: "fake-local",
      target: input.recipient,
      ...(input.ttlSeconds !== undefined ? { ttlSeconds: input.ttlSeconds } : {}),
      sourceRevisions: { [entityId(subject)]: entityRevision(subject) },
      payload: {
        subject_id: entityId(subject),
        subject_kind: subject.kind,
        recipient: input.recipient,
        channel: input.channel,
        message: input.message,
        cta: input.cta,
        reason_for_contact: reasonForContact,
        evidence_ids: uniqueStrings(input.evidenceIds),
        external_send: false,
        send_blocked: true,
      },
    });
  }

  async recordOutreachResult(input: {
    preparedActionId: string;
    outcome: string;
    occurredAt?: string;
    responseSummary?: string;
    followUpAt?: string;
  }): Promise<StudioEntity> {
    const action = await this.actions.get(input.preparedActionId);
    if (action.action_type !== "communication.send") {
      throw new Error(`Expected communication.send action, got ${action.action_type}`);
    }
    if (!["confirmed", "executed", "reconciled"].includes(action.status)) {
      throw new Error(`Outreach result requires a confirmed prepared action: ${action.id}`);
    }
    const subjectId = recordString(action.payload, "subject_id");
    if (!subjectId) {
      throw new Error(`Prepared action is missing subject_id: ${action.id}`);
    }
    const subject = await this.requireEntity(subjectId);
    const occurredAt = input.occurredAt ?? nowIso();
    const communication = await this.entities.create({
      kind: "communication",
      title: `Outbound ${recordString(action.payload, "channel") ?? "communication"} for ${entityTitle(subject)}`,
      status: "done",
      relations: [
        relation(subjectId, "about"),
        ...recordStringArray(action.payload, "evidence_ids").map((id) => relation(id)),
      ],
      data: {
        subject_id: subjectId,
        channel: recordString(action.payload, "channel"),
        direction: "outbound",
        stage: "recorded",
        occurred_at: occurredAt,
        prepared_action_id: action.id,
        message: recordString(action.payload, "message"),
        recipient: recordString(action.payload, "recipient"),
        cta: recordString(action.payload, "cta"),
        reason_for_contact: recordString(action.payload, "reason_for_contact"),
        evidence_ids: recordStringArray(action.payload, "evidence_ids"),
        provider: action.provider ?? "fake-local",
        target: action.target,
        payload_checksum: action.payload_checksum,
        external_send: false,
        outcome: input.outcome,
        ...(input.responseSummary ? { response_summary: input.responseSummary } : {}),
        ...(input.followUpAt ? { follow_up_at: input.followUpAt } : {}),
      },
    });
    if (subject.kind === "prospect") {
      await this.entities.update(subjectId, (entity) => ({
        ...entity,
        spec: {
          ...entity.spec,
          last_outreach_at: occurredAt,
          ...(input.followUpAt ? { follow_up_at: input.followUpAt } : {}),
        },
      }));
    }
    return communication;
  }

  async createOpportunity(input: {
    title: string;
    prospectId?: string;
    ownerId: string;
    nextAction: string;
    sourceUrl?: string;
    sourceRef?: string;
    sourceFreshness?: ResearchFreshness;
    potentialValueMinor?: number;
    currency?: string;
  }): Promise<StudioEntity> {
    const prospect = input.prospectId
      ? await this.requireKind(input.prospectId, "prospect")
      : undefined;
    return this.entities.create({
      kind: "opportunity",
      title: input.title,
      status: "active",
      relations: input.prospectId ? [relation(input.prospectId, "originates_from")] : [],
      data: {
        stage: "discovery",
        owner_id: input.ownerId,
        next_action: input.nextAction,
        ...(input.prospectId ? { prospect_id: input.prospectId } : {}),
        ...(input.sourceUrl ? { source_url: input.sourceUrl } : {}),
        ...(input.sourceRef ? { source_ref: input.sourceRef } : {}),
        ...(input.sourceFreshness ? { source_freshness: input.sourceFreshness } : {}),
        ...(input.potentialValueMinor !== undefined
          ? { potential_value_minor: input.potentialValueMinor }
          : {}),
        ...(input.currency ? { currency: input.currency } : {}),
        ...(staleResearchWarning(prospect)
          ? { stale_research_warning: staleResearchWarning(prospect) }
          : {}),
      },
    });
  }

  async recordOpportunityDiscovery(
    opportunityId: string,
    input: OpportunityDiscoveryInput,
  ): Promise<StudioEntity> {
    await this.requireEvidenceIds(input.evidenceIds ?? []);
    return this.entities.update(opportunityId, (entity) => {
      if (entity.kind !== "opportunity") {
        throw new Error(`Expected opportunity entity, got ${entity.kind}`);
      }
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: "active",
          stage: "discovery_recorded",
          owner_id: input.ownerId,
          need: input.need,
          urgency: input.urgency,
          budget_signal: input.budgetSignal,
          authority_signal: input.authoritySignal,
          competition: input.competition,
          next_action: input.nextAction,
          probability: input.probability,
          probability_source: input.probabilitySource,
          evidence_ids: uniqueStrings([
            ...recordStringArray(entity.spec, "evidence_ids"),
            ...(input.evidenceIds ?? []),
          ]),
          discovery: {
            recorded_at: nowIso(),
            ...(input.sourceRef ? { source_ref: input.sourceRef } : {}),
            summary: input.summary,
            need: input.need,
            ...(input.urgency ? { urgency: input.urgency } : {}),
            ...(input.budgetSignal ? { budget_signal: input.budgetSignal } : {}),
            ...(input.authoritySignal ? { authority_signal: input.authoritySignal } : {}),
            ...(input.competition ? { competition: input.competition } : {}),
            next_action: input.nextAction,
            owner_id: input.ownerId,
            ...(input.probability !== undefined ? { probability: input.probability } : {}),
            ...(input.probabilitySource ? { probability_source: input.probabilitySource } : {}),
            evidence_ids: uniqueStrings(input.evidenceIds ?? []),
          },
        },
        relations: mergeRelations(
          entity.relations,
          uniqueStrings(input.evidenceIds ?? []).map((id) => relation(id)),
        ),
      };
    });
  }

  async prepareProposal(input: ProposalPackageInput): Promise<StudioEntity> {
    const opportunity = await this.requireKind(input.opportunityId, "opportunity");
    if (entityStatus(opportunity) === "lost") {
      throw new Error("Cannot prepare a proposal for a lost opportunity.");
    }
    if (!recordString(opportunity.spec, "need") || !recordString(opportunity.spec, "next_action")) {
      throw new Error(
        "Opportunity discovery with need and next_action is required before proposal.",
      );
    }
    if (input.scope.length === 0) {
      throw new Error("Proposal scope is required.");
    }
    if (input.acceptanceCriteria.length === 0) {
      throw new Error("Proposal acceptance criteria are required.");
    }
    if (!input.priceLogic && input.valueMinor === undefined) {
      throw new Error("Proposal requires price logic or value_minor.");
    }
    await this.requireEvidenceIds(input.evidenceIds ?? []);
    const preparedAt = nowIso();
    const version = input.version ?? "v1";
    const proposal = await this.entities.create({
      kind: "proposal",
      title: input.title ?? `Proposal for ${entityTitle(opportunity)}`,
      status: "draft",
      relations: [
        relation(input.opportunityId, "proposes_for"),
        ...uniqueStrings(input.evidenceIds ?? []).map((id) => relation(id)),
      ],
      data: {
        opportunity_id: input.opportunityId,
        version,
        stage: "draft",
        offer_ref: input.offerRef,
        scope: uniqueStrings(input.scope),
        exclusions: uniqueStrings(input.exclusions ?? []),
        ...(input.schedule ? { schedule: input.schedule } : {}),
        assumptions: uniqueStrings(input.assumptions ?? []),
        ...(input.priceLogic ? { price_logic: input.priceLogic } : {}),
        payment_terms: input.paymentTerms,
        acceptance_criteria: uniqueStrings(input.acceptanceCriteria),
        review_required: ["claims", "terms", "attachments"],
        review_status: "needs_review",
        ...(input.valueMinor !== undefined ? { value_minor: input.valueMinor } : {}),
        ...(input.currency ? { currency: input.currency } : {}),
        prepared_at: preparedAt,
        evidence_ids: uniqueStrings(input.evidenceIds ?? []),
        versions: [{ version, created_at: preparedAt, notes: "Initial prepared draft." }],
      },
    });
    await this.entities.update(input.opportunityId, (entity) => ({
      ...entity,
      spec: {
        ...entity.spec,
        stage: "proposal_prepared",
        proposal_id: entityId(proposal),
      },
      relations: mergeRelations(entity.relations, [relation(entityId(proposal), "has_proposal")]),
    }));
    return proposal;
  }

  async markProposalReviewed(input: {
    proposalId: string;
    reviewNotes?: string;
    evidenceIds?: string[];
  }): Promise<StudioEntity> {
    await this.requireEvidenceIds(input.evidenceIds ?? []);
    return this.entities.update(input.proposalId, (entity) => {
      if (entity.kind !== "proposal") {
        throw new Error(`Expected proposal entity, got ${entity.kind}`);
      }
      if (proposalIsSent(entity)) {
        throw new Error("Sent proposal content is immutable.");
      }
      return {
        ...entity,
        spec: {
          ...entity.spec,
          review_status: "reviewed",
          review_notes: input.reviewNotes,
          evidence_ids: uniqueStrings([
            ...recordStringArray(entity.spec, "evidence_ids"),
            ...(input.evidenceIds ?? []),
          ]),
        },
        relations: mergeRelations(
          entity.relations,
          uniqueStrings(input.evidenceIds ?? []).map((id) => relation(id)),
        ),
      };
    });
  }

  async prepareProposalSend(input: ProposalSendInput): Promise<PreparedAction> {
    const proposal = await this.requireKind(input.proposalId, "proposal");
    if (recordString(proposal.spec, "review_status") !== "reviewed") {
      throw new Error("Proposal must be reviewed before preparing send.");
    }
    if (proposalIsSent(proposal)) {
      throw new Error("Sent proposal content is immutable.");
    }
    const opportunityId = recordString(proposal.spec, "opportunity_id");
    const opportunity = opportunityId
      ? await this.requireKind(opportunityId, "opportunity")
      : undefined;
    return this.actions.prepare({
      actionType: "proposal.send",
      provider: "fake-local",
      target: input.recipient,
      ...(input.ttlSeconds !== undefined ? { ttlSeconds: input.ttlSeconds } : {}),
      sourceRevisions: {
        [entityId(proposal)]: entityRevision(proposal),
        ...(opportunity ? { [entityId(opportunity)]: entityRevision(opportunity) } : {}),
      },
      payload: {
        ...proposalPayloadSnapshot(proposal),
        recipient: input.recipient,
        channel: input.channel,
        message: input.message,
        artifact_ref: input.artifactRef,
        artifact_checksum: input.artifactChecksum,
        external_send: false,
        send_blocked: true,
      },
    });
  }

  async markProposalSent(input: {
    proposalId: string;
    preparedActionId: string;
    sentAt?: string;
  }): Promise<StudioEntity> {
    const action = await this.actions.get(input.preparedActionId);
    if (action.action_type !== "proposal.send") {
      throw new Error(`Expected proposal.send action, got ${action.action_type}`);
    }
    if (action.status !== "confirmed") {
      throw new Error("Proposal send requires a confirmed prepared action.");
    }
    if (recordString(action.payload, "proposal_id") !== input.proposalId) {
      throw new Error("Prepared action proposal_id does not match.");
    }
    return this.entities.update(input.proposalId, (entity) => {
      if (entity.kind !== "proposal") {
        throw new Error(`Expected proposal entity, got ${entity.kind}`);
      }
      if (proposalIsSent(entity)) {
        return entity;
      }
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: "waiting",
          stage: "sent",
          sent_at: input.sentAt ?? nowIso(),
          sent_artifact_ref: recordString(action.payload, "artifact_ref"),
          sent_artifact_checksum: recordString(action.payload, "artifact_checksum"),
          sent_prepared_action_id: action.id,
          immutable_from_revision: entityRevision(entity),
          versions: [
            ...(Array.isArray(Reflect.get(entity.spec, "versions"))
              ? (Reflect.get(entity.spec, "versions") as unknown[])
              : []),
            {
              version: recordString(entity.spec, "version") ?? "v1",
              created_at: input.sentAt ?? nowIso(),
              artifact_ref: recordString(action.payload, "artifact_ref"),
              artifact_checksum: recordString(action.payload, "artifact_checksum"),
              notes: "Exact sent version locked by prepared-action checksum.",
            },
          ],
        },
      };
    });
  }

  async recordProposalResponse(input: {
    proposalId: string;
    response: ProposalResponse;
    evidenceId?: string;
    notes?: string;
  }): Promise<StudioEntity> {
    if (input.response === "accepted" && !input.evidenceId) {
      throw new Error("Accepted proposals require acceptance evidence.");
    }
    if (input.evidenceId) {
      await this.requireKind(input.evidenceId, "evidence");
    }
    const proposal = await this.entities.update(input.proposalId, (entity) => {
      if (entity.kind !== "proposal") {
        throw new Error(`Expected proposal entity, got ${entity.kind}`);
      }
      if (recordString(entity.spec, "stage") !== "sent") {
        throw new Error("Proposal response requires a sent proposal.");
      }
      const accepted = input.response === "accepted";
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: accepted ? "won" : input.response === "rejected" ? "lost" : "waiting",
          stage: input.response,
          response: {
            response: input.response,
            recorded_at: nowIso(),
            ...(input.evidenceId ? { evidence_id: input.evidenceId } : {}),
            ...(input.notes ? { notes: input.notes } : {}),
          },
          ...(accepted ? { accepted_at: nowIso(), acceptance_evidence_id: input.evidenceId } : {}),
        },
        relations: mergeRelations(
          entity.relations,
          input.evidenceId ? [relation(input.evidenceId)] : [],
        ),
      };
    });
    const opportunityId = recordString(proposal.spec, "opportunity_id");
    if (opportunityId) {
      await this.entities.update(opportunityId, (entity) => ({
        ...entity,
        spec: {
          ...entity.spec,
          stage: input.response === "accepted" ? "proposal_accepted" : `proposal_${input.response}`,
          ...(input.response === "accepted" ? { status: "waiting" } : {}),
          ...(input.response === "accepted" ? { accepted_proposal_id: input.proposalId } : {}),
          ...(input.evidenceId ? { acceptance_evidence_id: input.evidenceId } : {}),
        },
        relations: mergeRelations(entity.relations, [
          relation(input.proposalId, "accepted_proposal"),
          ...(input.evidenceId ? [relation(input.evidenceId)] : []),
        ]),
      }));
    }
    return proposal;
  }

  async recordNegotiation(input: {
    opportunityId: string;
    requestedChange: string;
    scopeImpact?: string;
    priceImpact?: string;
    riskImpact?: string;
    timingImpact?: string;
    decision?: NegotiationDecision;
    evidenceIds?: string[];
  }): Promise<StudioEntity> {
    await this.requireEvidenceIds(input.evidenceIds ?? []);
    return this.entities.update(input.opportunityId, (entity) => {
      if (entity.kind !== "opportunity") {
        throw new Error(`Expected opportunity entity, got ${entity.kind}`);
      }
      if (["won", "lost"].includes(entityStatus(entity))) {
        throw new Error("Closed opportunities cannot receive negotiation changes.");
      }
      const history = Array.isArray(Reflect.get(entity.spec, "negotiation_history"))
        ? (Reflect.get(entity.spec, "negotiation_history") as unknown[])
        : [];
      return {
        ...entity,
        spec: {
          ...entity.spec,
          stage: "negotiation",
          negotiation_history: [
            ...history,
            {
              requested_at: nowIso(),
              requested_change: input.requestedChange,
              ...(input.scopeImpact ? { scope_impact: input.scopeImpact } : {}),
              ...(input.priceImpact ? { price_impact: input.priceImpact } : {}),
              ...(input.riskImpact ? { risk_impact: input.riskImpact } : {}),
              ...(input.timingImpact ? { timing_impact: input.timingImpact } : {}),
              decision: input.decision ?? "pending",
              evidence_ids: uniqueStrings(input.evidenceIds ?? []),
            },
          ],
        },
        relations: mergeRelations(
          entity.relations,
          uniqueStrings(input.evidenceIds ?? []).map((id) => relation(id)),
        ),
      };
    });
  }

  async closeOpportunityLost(input: {
    opportunityId: string;
    reason: string;
    lesson?: string;
  }): Promise<StudioEntity> {
    return this.entities.update(input.opportunityId, (entity) => {
      if (entity.kind !== "opportunity") {
        throw new Error(`Expected opportunity entity, got ${entity.kind}`);
      }
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: "lost",
          stage: "closed_lost",
          lost_reason: input.reason,
          ...(input.lesson ? { lost_lesson: input.lesson } : {}),
          closed_at: nowIso(),
        },
      };
    });
  }

  async convertOpportunity(input: {
    opportunityId: string;
    clientTitle?: string;
    engagementTitle?: string;
    acceptedProposalId?: string;
    acceptanceEvidenceId?: string;
  }): Promise<{ opportunity: StudioEntity; client: StudioEntity; engagement: StudioEntity }> {
    const opportunity = await this.requireKind(input.opportunityId, "opportunity");
    const spec = opportunity.spec as Record<string, unknown>;
    const acceptedProposalId =
      input.acceptedProposalId ?? recordString(spec, "accepted_proposal_id");
    const acceptanceEvidenceId =
      input.acceptanceEvidenceId ?? recordString(spec, "acceptance_evidence_id");
    if (!acceptedProposalId || !acceptanceEvidenceId) {
      throw new Error("Opportunity conversion requires accepted proposal and acceptance evidence.");
    }
    const proposal = await this.requireKind(acceptedProposalId, "proposal");
    if (recordString(proposal.spec, "stage") !== "accepted") {
      throw new Error("Opportunity conversion requires proposal stage accepted.");
    }
    await this.requireKind(acceptanceEvidenceId, "evidence");
    const existingClientId = recordString(spec, "client_id");
    const existingEngagementId = recordString(spec, "engagement_id");
    if (existingClientId && existingEngagementId) {
      const client = await this.requireKind(existingClientId, "client");
      const engagement = await this.requireKind(existingEngagementId, "engagement");
      return { opportunity, client, engagement };
    }

    const client = createEntity({
      kind: "client",
      title: input.clientTitle ?? entityTitle(opportunity),
      status: "active",
      relations: [
        { type: "converted_from", target_id: input.opportunityId },
        { type: "accepted_proposal", target_id: acceptedProposalId },
      ],
      data: {
        relationship_stage: "active",
        source_opportunity_id: input.opportunityId,
      },
    });
    const engagement = createEntity({
      kind: "engagement",
      title: input.engagementTitle ?? `Engagement for ${entityTitle(opportunity)}`,
      status: "draft",
      relations: [
        { type: "originates_from", target_id: input.opportunityId },
        { type: "for_client", target_id: entityId(client) },
        { type: "based_on_proposal", target_id: acceptedProposalId },
        { type: "supported_by", target_id: acceptanceEvidenceId },
      ],
      data: {
        opportunity_id: input.opportunityId,
        client_id: entityId(client),
        proposal_id: acceptedProposalId,
      },
    });
    const updatedOpportunity = TypedEntitySchema.parse({
      ...opportunity,
      metadata: {
        ...opportunity.metadata,
        revision: entityRevision(opportunity) + 1,
        updated_at: nowIso(),
      },
      spec: {
        ...opportunity.spec,
        status: "won",
        stage: "converted",
        accepted_proposal_id: acceptedProposalId,
        acceptance_evidence_id: acceptanceEvidenceId,
        client_id: entityId(client),
        engagement_id: entityId(engagement),
        converted_at: nowIso(),
      },
      relations: [
        ...opportunity.relations.filter(
          (entry) => !["converted_to", "creates_engagement"].includes(entry.type),
        ),
        { type: "converted_to", target_id: entityId(client) },
        { type: "creates_engagement", target_id: entityId(engagement) },
        { type: "accepted_proposal", target_id: acceptedProposalId },
        { type: "supported_by", target_id: acceptanceEvidenceId },
      ],
    });
    await this.context.entities.putMany([
      { entity: client },
      { entity: engagement },
      { entity: updatedOpportunity, expectedRevision: entityRevision(opportunity) },
    ]);
    await this.entities.recordEvent("opportunity.converted", input.opportunityId, {
      client_id: entityId(client),
      engagement_id: entityId(engagement),
      proposal_id: acceptedProposalId,
      acceptance_evidence_id: acceptanceEvidenceId,
    });
    return { opportunity: updatedOpportunity, client, engagement };
  }

  async createEngagementFromOpportunity(
    opportunityId: string,
    title?: string,
  ): Promise<StudioEntity> {
    const opportunity = await this.requireKind(opportunityId, "opportunity");
    if (entityStatus(opportunity) !== "won") {
      throw new Error("Engagements can only be created from won opportunities.");
    }
    return this.entities.create({
      kind: "engagement",
      title: title ?? `Engagement for ${entityTitle(opportunity)}`,
      status: "draft",
      relations: [{ type: "originates_from", target_id: opportunityId }],
      data: { created_from_opportunity_at: nowIso() },
    });
  }
}
