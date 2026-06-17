import { z } from "zod";
import { ActorSchema } from "../classification.js";
import { EvidenceReferenceSchema, StudioErrorSchema } from "./result.js";

export const AdapterRequestSchema = z
  .object({
    api_version: z
      .literal("studio.guilherme.dev/adapter-request-v1")
      .default("studio.guilherme.dev/adapter-request-v1"),
    request_id: z.string().min(3),
    adapter: z.string().min(1),
    operation: z.string().min(1),
    actor: ActorSchema,
    dry_run: z.boolean().default(false),
    payload: z.record(z.string(), z.unknown()).default({}),
  })
  .strict();
export type AdapterRequest = z.infer<typeof AdapterRequestSchema>;
export const AdapterResultSchema = z
  .object({
    api_version: z
      .literal("studio.guilherme.dev/adapter-result-v1")
      .default("studio.guilherme.dev/adapter-result-v1"),
    request_id: z.string().min(3),
    adapter: z.string().min(1),
    operation: z.string().min(1),
    status: z.enum(["ok", "warning", "blocked", "error"]),
    data: z.unknown().nullable().default(null),
    evidence: z.array(EvidenceReferenceSchema).default([]),
    error: StudioErrorSchema.optional(),
  })
  .strict();
export type AdapterResult = z.infer<typeof AdapterResultSchema>;
