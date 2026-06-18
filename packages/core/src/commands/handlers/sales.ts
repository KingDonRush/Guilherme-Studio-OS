import { createResultEnvelope } from "@guilherme-studio/schemas";
import { DomainCommandService } from "../../domains/commands.js";
import { entityMutationResult } from "../../entity-service.js";
import {
  numberValue,
  optionalNumber,
  optionalString,
  payloadValue,
  stringArray,
  stringValue,
} from "../payload.js";
import type { StudioCommandDefinition } from "../types.js";

function recordArray(payload: Record<string, unknown>, key: string): Record<string, unknown>[] {
  const value = payloadValue(payload, key);
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new Error(`${key} must be an array`);
  }
  return value.map((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error(`${key} entries must be objects`);
    }
    return entry as Record<string, unknown>;
  });
}

function offerEvidenceMap(payload: Record<string, unknown>): Array<{
  profile: string;
  offer: string;
  proof_claims?: string[];
  evidence_ids?: string[];
  gap?: string;
}> {
  return recordArray(payload, "offer_evidence_map").map((entry) => ({
    profile: stringValue(entry, "profile"),
    offer: stringValue(entry, "offer"),
    proof_claims: stringArray(entry, "proof_claims"),
    evidence_ids: stringArray(entry, "evidence_ids"),
    ...(optionalString(entry, "gap") ? { gap: stringValue(entry, "gap") } : {}),
  }));
}

export const salesCommandDefinitions: Record<string, StudioCommandDefinition> = {
  "sales.record-icp": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).recordIdealClientProfile({
        ...(optionalString(payload, "title") ? { title: stringValue(payload, "title") } : {}),
        businessTypes: stringArray(payload, "business_types"),
        needs: stringArray(payload, "needs"),
        ...(optionalString(payload, "budget_logic")
          ? { budgetLogic: stringValue(payload, "budget_logic") }
          : {}),
        geographies: stringArray(payload, "geographies"),
        technologies: stringArray(payload, "technologies"),
        deliveryFit: stringArray(payload, "delivery_fit"),
        rejectedCriteria: stringArray(payload, "rejected_criteria"),
        offerEvidenceMap: offerEvidenceMap(payload),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "prospect.research": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).researchProspect(
        command.target_id ?? stringValue(payload, "prospect_id"),
        {
          source: stringValue(payload, "source"),
          ...(optionalString(payload, "source_url")
            ? { sourceUrl: stringValue(payload, "source_url") }
            : {}),
          observedSituation: stringValue(payload, "observed_situation"),
          likelyNeed: stringValue(payload, "likely_need"),
          fitEvidence: stringArray(payload, "fit_evidence"),
          ...(optionalString(payload, "decision_maker")
            ? { decisionMaker: stringValue(payload, "decision_maker") }
            : {}),
          risks: stringArray(payload, "risks"),
          reasonForContact: stringValue(payload, "reason_for_contact"),
          ...(optionalString(payload, "confidence")
            ? { confidence: stringValue(payload, "confidence") as "low" | "medium" | "high" }
            : {}),
          ...(optionalString(payload, "freshness")
            ? {
                freshness: stringValue(payload, "freshness") as
                  | "fresh"
                  | "stale"
                  | "expired"
                  | "unknown",
              }
            : {}),
          evidenceIds: stringArray(payload, "evidence_ids"),
        },
      );
      return entityMutationResult(command.command, entity);
    },
  },
  "outreach.review": {
    requirement: { capability: "entity.read" },
    handler: async ({ context, command, payload }) => {
      const result = await new DomainCommandService(context).reviewOutreach({
        subjectId: stringValue(payload, "subject_id"),
        ...(optionalString(payload, "channel") ? { channel: stringValue(payload, "channel") } : {}),
      });
      return createResultEnvelope({ requestId: command.request_id, result });
    },
  },
  "outreach.prepare": {
    requirement: { capability: "action.prepare" },
    handler: async ({ context, command, payload }) => {
      const action = await new DomainCommandService(context).prepareSalesOutreach({
        subjectId: stringValue(payload, "subject_id"),
        recipient: stringValue(payload, "recipient"),
        channel: stringValue(payload, "channel"),
        message: stringValue(payload, "message"),
        cta: stringValue(payload, "cta"),
        evidenceIds: stringArray(payload, "evidence_ids"),
        ...(optionalString(payload, "reason_for_contact")
          ? { reasonForContact: stringValue(payload, "reason_for_contact") }
          : {}),
        ...(optionalNumber(payload, "ttl_seconds")
          ? { ttlSeconds: numberValue(payload, "ttl_seconds") }
          : {}),
      });
      return createResultEnvelope({ requestId: command.request_id, result: action });
    },
  },
  "outreach.record-result": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).recordOutreachResult({
        preparedActionId: stringValue(payload, "prepared_action_id"),
        outcome: stringValue(payload, "outcome"),
        ...(optionalString(payload, "occurred_at")
          ? { occurredAt: stringValue(payload, "occurred_at") }
          : {}),
        ...(optionalString(payload, "response_summary")
          ? { responseSummary: stringValue(payload, "response_summary") }
          : {}),
        ...(optionalString(payload, "follow_up_at")
          ? { followUpAt: stringValue(payload, "follow_up_at") }
          : {}),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "opportunity.create": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).createOpportunity({
        title: stringValue(payload, "title"),
        ...(optionalString(payload, "prospect_id")
          ? { prospectId: stringValue(payload, "prospect_id") }
          : {}),
        ownerId: stringValue(payload, "owner_id"),
        nextAction: stringValue(payload, "next_action"),
        ...(optionalString(payload, "source_url")
          ? { sourceUrl: stringValue(payload, "source_url") }
          : {}),
        ...(optionalString(payload, "source_ref")
          ? { sourceRef: stringValue(payload, "source_ref") }
          : {}),
        ...(optionalString(payload, "source_freshness")
          ? {
              sourceFreshness: stringValue(payload, "source_freshness") as
                | "fresh"
                | "stale"
                | "expired"
                | "unknown",
            }
          : {}),
        ...(optionalNumber(payload, "potential_value_minor") !== undefined
          ? { potentialValueMinor: numberValue(payload, "potential_value_minor") }
          : {}),
        ...(optionalString(payload, "currency")
          ? { currency: stringValue(payload, "currency") }
          : {}),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "opportunity.record-discovery": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).recordOpportunityDiscovery(
        command.target_id ?? stringValue(payload, "opportunity_id"),
        {
          ...(optionalString(payload, "source_ref")
            ? { sourceRef: stringValue(payload, "source_ref") }
            : {}),
          summary: stringValue(payload, "summary"),
          need: stringValue(payload, "need"),
          ...(optionalString(payload, "urgency")
            ? { urgency: stringValue(payload, "urgency") }
            : {}),
          ...(optionalString(payload, "budget_signal")
            ? { budgetSignal: stringValue(payload, "budget_signal") }
            : {}),
          ...(optionalString(payload, "authority_signal")
            ? { authoritySignal: stringValue(payload, "authority_signal") }
            : {}),
          ...(optionalString(payload, "competition")
            ? { competition: stringValue(payload, "competition") }
            : {}),
          nextAction: stringValue(payload, "next_action"),
          ownerId: stringValue(payload, "owner_id"),
          ...(optionalNumber(payload, "probability") !== undefined
            ? { probability: numberValue(payload, "probability") }
            : {}),
          ...(optionalString(payload, "probability_source")
            ? {
                probabilitySource: stringValue(payload, "probability_source") as
                  | "explicit"
                  | "inferred"
                  | "operator-estimate",
              }
            : {}),
          evidenceIds: stringArray(payload, "evidence_ids"),
        },
      );
      return entityMutationResult(command.command, entity);
    },
  },
  "proposal.prepare": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).prepareProposal({
        opportunityId: stringValue(payload, "opportunity_id"),
        ...(optionalString(payload, "title") ? { title: stringValue(payload, "title") } : {}),
        ...(optionalString(payload, "version") ? { version: stringValue(payload, "version") } : {}),
        offerRef: stringValue(payload, "offer_ref"),
        scope: stringArray(payload, "scope"),
        exclusions: stringArray(payload, "exclusions"),
        ...(optionalString(payload, "schedule")
          ? { schedule: stringValue(payload, "schedule") }
          : {}),
        assumptions: stringArray(payload, "assumptions"),
        ...(optionalString(payload, "price_logic")
          ? { priceLogic: stringValue(payload, "price_logic") }
          : {}),
        paymentTerms: stringValue(payload, "payment_terms"),
        acceptanceCriteria: stringArray(payload, "acceptance_criteria"),
        ...(optionalNumber(payload, "value_minor") !== undefined
          ? { valueMinor: numberValue(payload, "value_minor") }
          : {}),
        ...(optionalString(payload, "currency")
          ? { currency: stringValue(payload, "currency") }
          : {}),
        evidenceIds: stringArray(payload, "evidence_ids"),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "proposal.review": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).markProposalReviewed({
        proposalId: command.target_id ?? stringValue(payload, "proposal_id"),
        ...(optionalString(payload, "review_notes")
          ? { reviewNotes: stringValue(payload, "review_notes") }
          : {}),
        evidenceIds: stringArray(payload, "evidence_ids"),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "proposal.prepare-send": {
    requirement: { capability: "action.prepare" },
    handler: async ({ context, command, payload }) => {
      const action = await new DomainCommandService(context).prepareProposalSend({
        proposalId: command.target_id ?? stringValue(payload, "proposal_id"),
        recipient: stringValue(payload, "recipient"),
        channel: stringValue(payload, "channel"),
        message: stringValue(payload, "message"),
        artifactRef: stringValue(payload, "artifact_ref"),
        artifactChecksum: stringValue(payload, "artifact_checksum"),
        ...(optionalNumber(payload, "ttl_seconds")
          ? { ttlSeconds: numberValue(payload, "ttl_seconds") }
          : {}),
      });
      return createResultEnvelope({ requestId: command.request_id, result: action });
    },
  },
  "proposal.mark-sent": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).markProposalSent({
        proposalId: command.target_id ?? stringValue(payload, "proposal_id"),
        preparedActionId: stringValue(payload, "prepared_action_id"),
        ...(optionalString(payload, "sent_at") ? { sentAt: stringValue(payload, "sent_at") } : {}),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "proposal.record-response": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).recordProposalResponse({
        proposalId: command.target_id ?? stringValue(payload, "proposal_id"),
        response: stringValue(payload, "response") as
          | "accepted"
          | "rejected"
          | "revision_requested"
          | "no_response",
        ...(optionalString(payload, "evidence_id")
          ? { evidenceId: stringValue(payload, "evidence_id") }
          : {}),
        ...(optionalString(payload, "notes") ? { notes: stringValue(payload, "notes") } : {}),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "opportunity.record-negotiation": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).recordNegotiation({
        opportunityId: command.target_id ?? stringValue(payload, "opportunity_id"),
        requestedChange: stringValue(payload, "requested_change"),
        ...(optionalString(payload, "scope_impact")
          ? { scopeImpact: stringValue(payload, "scope_impact") }
          : {}),
        ...(optionalString(payload, "price_impact")
          ? { priceImpact: stringValue(payload, "price_impact") }
          : {}),
        ...(optionalString(payload, "risk_impact")
          ? { riskImpact: stringValue(payload, "risk_impact") }
          : {}),
        ...(optionalString(payload, "timing_impact")
          ? { timingImpact: stringValue(payload, "timing_impact") }
          : {}),
        ...(optionalString(payload, "decision")
          ? {
              decision: stringValue(payload, "decision") as
                | "pending"
                | "accepted"
                | "rejected"
                | "deferred",
            }
          : {}),
        evidenceIds: stringArray(payload, "evidence_ids"),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "opportunity.close-lost": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).closeOpportunityLost({
        opportunityId: command.target_id ?? stringValue(payload, "opportunity_id"),
        reason: stringValue(payload, "reason"),
        ...(optionalString(payload, "lesson") ? { lesson: stringValue(payload, "lesson") } : {}),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "opportunity.convert": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const result = await new DomainCommandService(context).convertOpportunity({
        opportunityId: stringValue(payload, "opportunity_id"),
        ...(optionalString(payload, "client_title")
          ? { clientTitle: stringValue(payload, "client_title") }
          : {}),
        ...(optionalString(payload, "engagement_title")
          ? { engagementTitle: stringValue(payload, "engagement_title") }
          : {}),
        ...(optionalString(payload, "accepted_proposal_id")
          ? { acceptedProposalId: stringValue(payload, "accepted_proposal_id") }
          : {}),
        ...(optionalString(payload, "acceptance_evidence_id")
          ? { acceptanceEvidenceId: stringValue(payload, "acceptance_evidence_id") }
          : {}),
      });
      return createResultEnvelope({ requestId: command.request_id, result });
    },
  },
  "engagement.create-from-opportunity": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).createEngagementFromOpportunity(
        stringValue(payload, "opportunity_id"),
        optionalString(payload, "title"),
      );
      return entityMutationResult(command.command, entity);
    },
  },
};
