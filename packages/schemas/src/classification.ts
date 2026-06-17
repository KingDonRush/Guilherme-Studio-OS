import { z } from "zod";

export const ClassificationSchema = z.enum(["public", "internal", "confidential", "secret"]);
export type Classification = z.infer<typeof ClassificationSchema>;
export const CapabilitySchema = z.enum([
  "entity.read",
  "entity.write",
  "entity.transition",
  "evidence.register",
  "repository.inspect",
  "repository.mutate",
  "environment.inspect",
  "environment.mutate",
  "action.prepare",
  "action.confirm",
  "action.execute",
  "action.reconcile",
  "external.execute",
  "destructive.execute",
  "public.publish",
  "finance.reconcile",
]);
export type Capability = z.infer<typeof CapabilitySchema>;
export const ActorSchema = z
  .object({
    id: z.string().min(3),
    type: z.enum(["human", "agent", "cli", "panel", "automation", "adapter"]),
    capabilities: z.array(CapabilitySchema).default([]),
    classification_ceiling: ClassificationSchema.default("internal"),
    delegated_by: z.string().optional(),
    delegated_at: z.string().datetime().optional(),
    expires_at: z.string().datetime().optional(),
  })
  .strict();
export type Actor = z.infer<typeof ActorSchema>;
