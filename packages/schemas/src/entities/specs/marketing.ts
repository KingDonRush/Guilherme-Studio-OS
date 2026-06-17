import { z } from "zod";
import { GenericSpecSchema } from "./base.js";

export const CampaignSpecSchema = GenericSpecSchema.extend({
  audience: z.string().optional(),
  cta: z.string().optional(),
  channels: z.array(z.string()).default([]),
  starts_at: z.string().datetime().optional(),
  ends_at: z.string().datetime().optional(),
  proof_evidence_ids: z.array(z.string()).default([]),
});
export const ContentItemSpecSchema = GenericSpecSchema.extend({
  campaign_id: z.string().optional(),
  channel: z.string().optional(),
  publish_at: z.string().datetime().optional(),
  public_claims: z.array(z.string()).default([]),
  proof_evidence_ids: z.array(z.string()).default([]),
  prepared_at: z.string().datetime().optional(),
});
