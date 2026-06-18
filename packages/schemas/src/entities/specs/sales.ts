import { z } from "zod";
import { GenericSpecSchema } from "./base.js";

const OpportunityDiscoverySchema = z
  .object({
    recorded_at: z.string().datetime(),
    source_ref: z.string().optional(),
    summary: z.string().min(1),
    need: z.string().min(1),
    urgency: z.string().optional(),
    budget_signal: z.string().optional(),
    authority_signal: z.string().optional(),
    competition: z.string().optional(),
    next_action: z.string().min(1),
    owner_id: z.string().min(1),
    probability: z.number().int().min(0).max(100).optional(),
    probability_source: z.enum(["explicit", "inferred", "operator-estimate"]).optional(),
    evidence_ids: z.array(z.string()).default([]),
  })
  .strict();

const NegotiationChangeSchema = z
  .object({
    requested_at: z.string().datetime(),
    requested_change: z.string().min(1),
    scope_impact: z.string().optional(),
    price_impact: z.string().optional(),
    risk_impact: z.string().optional(),
    timing_impact: z.string().optional(),
    decision: z.enum(["pending", "accepted", "rejected", "deferred"]).default("pending"),
    evidence_ids: z.array(z.string()).default([]),
  })
  .strict();

export const OpportunitySpecSchema = GenericSpecSchema.extend({
  stage: z.string().optional(),
  prospect_id: z.string().optional(),
  owner_id: z.string().optional(),
  potential_value_minor: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  follow_up_at: z.string().datetime().optional(),
  international_relevance: z.boolean().default(false),
  source_url: z.string().url().optional(),
  source_ref: z.string().optional(),
  source_freshness: z.enum(["fresh", "stale", "expired", "unknown"]).optional(),
  discovery: OpportunityDiscoverySchema.optional(),
  need: z.string().optional(),
  urgency: z.string().optional(),
  budget_signal: z.string().optional(),
  authority_signal: z.string().optional(),
  competition: z.string().optional(),
  next_action: z.string().optional(),
  probability: z.number().int().min(0).max(100).optional(),
  probability_source: z.enum(["explicit", "inferred", "operator-estimate"]).optional(),
  evidence_ids: z.array(z.string()).default([]),
  stale_research_warning: z.string().optional(),
  proposal_id: z.string().optional(),
  accepted_proposal_id: z.string().optional(),
  acceptance_evidence_id: z.string().optional(),
  negotiation_history: z.array(NegotiationChangeSchema).default([]),
  lost_reason: z.string().optional(),
  lost_lesson: z.string().optional(),
  closed_at: z.string().datetime().optional(),
  client_id: z.string().optional(),
  engagement_id: z.string().optional(),
  converted_at: z.string().datetime().optional(),
});

const ProposalVersionSchema = z
  .object({
    version: z.string().min(1),
    created_at: z.string().datetime(),
    artifact_ref: z.string().optional(),
    artifact_checksum: z
      .string()
      .regex(/^[a-f0-9]{64}$/)
      .optional(),
    notes: z.string().optional(),
  })
  .strict();

const ProposalResponseSchema = z
  .object({
    response: z.enum(["accepted", "rejected", "revision_requested", "no_response"]),
    recorded_at: z.string().datetime(),
    evidence_id: z.string().optional(),
    notes: z.string().optional(),
  })
  .strict();

export const ProposalSpecSchema = GenericSpecSchema.extend({
  opportunity_id: z.string().optional(),
  version: z.string().optional(),
  stage: z.string().optional(),
  offer_ref: z.string().optional(),
  scope: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  schedule: z.string().optional(),
  assumptions: z.array(z.string()).default([]),
  price_logic: z.string().optional(),
  payment_terms: z.string().optional(),
  acceptance_criteria: z.array(z.string()).default([]),
  review_required: z.array(z.string()).default([]),
  review_status: z.enum(["draft", "needs_review", "reviewed"]).default("draft"),
  value_minor: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  prepared_at: z.string().datetime().optional(),
  sent_at: z.string().datetime().optional(),
  sent_artifact_ref: z.string().optional(),
  sent_artifact_checksum: z
    .string()
    .regex(/^[a-f0-9]{64}$/)
    .optional(),
  sent_prepared_action_id: z.string().optional(),
  immutable_from_revision: z.number().int().min(1).optional(),
  response: ProposalResponseSchema.optional(),
  accepted_at: z.string().datetime().optional(),
  acceptance_evidence_id: z.string().optional(),
  versions: z.array(ProposalVersionSchema).default([]),
  evidence_ids: z.array(z.string()).default([]),
});
