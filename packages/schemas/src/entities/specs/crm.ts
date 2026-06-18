import { z } from "zod";
import { GenericSpecSchema } from "./base.js";

const QualificationSchema = z
  .object({
    score: z.number().int().min(0).max(100),
    rationale: z.string().min(1),
    assessed_at: z.string().datetime(),
  })
  .strict();
const ProspectResearchSchema = z
  .object({
    source: z.string().min(1),
    source_url: z.string().url().optional(),
    observed_situation: z.string().min(1),
    likely_need: z.string().min(1),
    fit_evidence: z.array(z.string()).default([]),
    decision_maker: z.string().optional(),
    risks: z.array(z.string()).default([]),
    reason_for_contact: z.string().min(1),
    confidence: z.enum(["low", "medium", "high"]).default("medium"),
    freshness: z.enum(["fresh", "stale", "expired", "unknown"]).default("fresh"),
    researched_at: z.string().datetime(),
    evidence_ids: z.array(z.string()).default([]),
  })
  .strict();
export const PersonSpecSchema = GenericSpecSchema.extend({
  email: z.string().email().optional(),
  location: z.string().optional(),
  roles: z.array(z.string()).default([]),
});
export const OrganizationSpecSchema = GenericSpecSchema.extend({
  website: z.string().url().optional(),
  country: z.string().optional(),
  organization_type: z.string().optional(),
});
export const ProspectSpecSchema = GenericSpecSchema.extend({
  stage: z.string().optional(),
  qualification: QualificationSchema.optional(),
  source: z.string().optional(),
  source_url: z.string().url().optional(),
  organization_id: z.string().optional(),
  contact_person_id: z.string().optional(),
  reason_for_contact: z.string().optional(),
  follow_up_at: z.string().datetime().optional(),
  research: ProspectResearchSchema.optional(),
  source_freshness: z.enum(["fresh", "stale", "expired", "unknown"]).optional(),
  research_confidence: z.enum(["low", "medium", "high"]).optional(),
  research_warning: z.string().optional(),
  last_outreach_at: z.string().datetime().optional(),
  outreach_policy: z.string().optional(),
});
export const ClientSpecSchema = GenericSpecSchema.extend({
  relationship_stage: z.string().optional(),
  preferences: z.array(z.string()).default([]),
  source_opportunity_id: z.string().optional(),
});
export const CommunicationSpecSchema = GenericSpecSchema.extend({
  subject_id: z.string().optional(),
  channel: z.string().optional(),
  direction: z.enum(["inbound", "outbound"]).optional(),
  stage: z.string().optional(),
  occurred_at: z.string().datetime().optional(),
  prepared_action_id: z.string().optional(),
  message: z.string().optional(),
  recipient: z.string().optional(),
  cta: z.string().optional(),
  reason_for_contact: z.string().optional(),
  evidence_ids: z.array(z.string()).default([]),
  provider: z.string().optional(),
  target: z.string().optional(),
  payload_checksum: z
    .string()
    .regex(/^[a-f0-9]{64}$/)
    .optional(),
  external_send: z.boolean().default(false),
  outcome: z.string().optional(),
  response_summary: z.string().optional(),
  follow_up_at: z.string().datetime().optional(),
});
