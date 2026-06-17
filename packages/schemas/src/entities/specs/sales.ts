import { z } from "zod";
import { GenericSpecSchema } from "./base.js";

export const OpportunitySpecSchema = GenericSpecSchema.extend({
  stage: z.string().optional(),
  potential_value_minor: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  follow_up_at: z.string().datetime().optional(),
  international_relevance: z.boolean().default(false),
  source_url: z.string().url().optional(),
  proposal_id: z.string().optional(),
  client_id: z.string().optional(),
  engagement_id: z.string().optional(),
  converted_at: z.string().datetime().optional(),
});
export const ProposalSpecSchema = GenericSpecSchema.extend({
  opportunity_id: z.string().optional(),
  version: z.string().optional(),
  stage: z.string().optional(),
  value_minor: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  prepared_at: z.string().datetime().optional(),
  evidence_ids: z.array(z.string()).default([]),
});
