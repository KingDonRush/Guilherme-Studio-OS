import { z } from "zod";
import { GenericSpecSchema } from "./base.js";

export const RepositorySpecSchema = GenericSpecSchema.extend({
  path: z.string().optional(),
  branch: z.string().optional(),
  remote_policy: z.enum(["allowed", "forbidden", "no-remote-in-v1"]).optional(),
  expected_remote: z.string().optional(),
});
export const ProductSpecSchema = GenericSpecSchema.extend({
  repository_path: z.string().optional(),
  signal: z.string().optional(),
  current_version: z.string().optional(),
});
export const ReleaseSpecSchema = GenericSpecSchema.extend({
  product_id: z.string().optional(),
  version: z.string().optional(),
  stage: z.string().optional(),
  prepared_at: z.string().datetime().optional(),
  published_at: z.string().datetime().optional(),
  demo_url: z.string().url().optional(),
  evidence_ids: z.array(z.string()).default([]),
});
