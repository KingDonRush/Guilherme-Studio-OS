import { z } from "zod";
import { GenericSpecSchema } from "./base.js";

export const PortfolioCaseSpecSchema = GenericSpecSchema.extend({
  case_url: z.string().url().optional(),
  source_evidence_ids: z.array(z.string()).default([]),
  public_claims: z.array(z.string()).default([]),
  asset_ids: z.array(z.string()).default([]),
  publish_channel: z.string().optional(),
});
export const AssetSpecSchema = GenericSpecSchema.extend({
  path: z.string().optional(),
  media_type: z.string().optional(),
  checksum: z.string().optional(),
  manifest_path: z.string().optional(),
});
