import { z } from "zod";

export const EvidenceReferenceSchema = z
  .object({
    id: z.string().min(3),
    claim: z.string().optional(),
    reliability: z.enum(["observed", "verified", "reported", "inferred"]).default("observed"),
    checksum: z
      .string()
      .regex(/^[a-f0-9]{64}$/)
      .optional(),
  })
  .strict();
export type EvidenceReference = z.infer<typeof EvidenceReferenceSchema>;
export const ResultStatusSchema = z.enum([
  "ok",
  "warning",
  "confirmation_required",
  "blocked",
  "conflict",
  "error",
]);
export type ResultStatus = z.infer<typeof ResultStatusSchema>;
export const StudioErrorSchema = z
  .object({
    code: z.string().min(1),
    message: z.string().min(1),
    details: z.record(z.string(), z.unknown()).default({}),
  })
  .strict();
export type StudioError = z.infer<typeof StudioErrorSchema>;
export const ResultEnvelopeSchema = z
  .object({
    api_version: z.literal("studio.guilherme.dev/v1").default("studio.guilherme.dev/v1"),
    request_id: z.string().min(3),
    status: ResultStatusSchema,
    result: z.unknown().nullable().default(null),
    warnings: z.array(z.string()).default([]),
    required_actions: z.array(z.string()).default([]),
    evidence: z.array(EvidenceReferenceSchema).default([]),
    projection_revision: z.number().int().min(0).default(0),
    error: StudioErrorSchema.optional(),
  })
  .strict();
export type ResultEnvelope = z.infer<typeof ResultEnvelopeSchema>;
