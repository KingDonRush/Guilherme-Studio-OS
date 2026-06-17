import { z } from "zod";
import { GenericSpecSchema } from "./base.js";

const QualificationSchema = z
  .object({
    score: z.number().int().min(0).max(100),
    rationale: z.string().min(1),
    assessed_at: z.string().datetime(),
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
  occurred_at: z.string().datetime().optional(),
  prepared_action_id: z.string().optional(),
  message: z.string().optional(),
  provider: z.string().optional(),
  target: z.string().optional(),
  external_send: z.boolean().default(false),
});
