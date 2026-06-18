import { z } from "zod";
import { GenericSpecSchema } from "./base.js";

export const EngagementSpecSchema = GenericSpecSchema.extend({
  stage: z.string().optional(),
  value_minor: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  started_at: z.string().datetime().optional(),
  opportunity_id: z.string().optional(),
  client_id: z.string().optional(),
  contract_id: z.string().optional(),
});
export const DeliverableSpecSchema = GenericSpecSchema.extend({
  engagement_id: z.string().optional(),
  project_id: z.string().optional(),
  due_at: z.string().datetime().optional(),
  acceptance: z.array(z.string()).default([]),
  evidence_missing: z.boolean().default(false),
  evidence_ids: z.array(z.string()).default([]),
  completed_at: z.string().datetime().optional(),
});
export const ProjectSpecSchema = GenericSpecSchema.extend({
  project_type: z.string().optional(),
  repository_id: z.string().optional(),
  environment_id: z.string().optional(),
});
export const EnvironmentSpecSchema = GenericSpecSchema.extend({
  type: z.string().optional(),
  local_path: z.string().optional(),
  url: z.string().url().optional(),
  secret_reference: z
    .string()
    .regex(/^secrets:\/\/[a-z0-9][a-z0-9/_:.-]*$/i)
    .optional(),
  backup_policy: z.string().optional(),
  compose_files: z.array(z.string()).default([]),
  wordpress_git_repository: z
    .object({
      path: z.string(),
      branch: z.string().optional(),
      initial_commit: z.string().optional(),
    })
    .strict()
    .optional(),
});
