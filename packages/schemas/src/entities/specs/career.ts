import { z } from "zod";
import { GenericSpecSchema } from "./base.js";

export const JobApplicationSpecSchema = GenericSpecSchema.extend({
  source_url: z.string().url().optional(),
  stage: z.string().optional(),
  follow_up_at: z.string().datetime().optional(),
  organization_id: z.string().optional(),
  interview_at: z.string().datetime().optional(),
  interview_notes: z.string().optional(),
});
