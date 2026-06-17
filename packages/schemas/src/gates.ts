import { z } from "zod";
import { CapabilitySchema } from "./classification.js";

export const GateDecisionSchema = z
  .object({
    gate: z.string().default("general"),
    result: z.enum(["allow", "warn", "require_confirmation", "block"]),
    reason: z.string(),
    capability_required: CapabilitySchema.optional(),
    evidence_required: z.array(z.string()).default([]),
    confirmation_scope: z.string().optional(),
  })
  .strict();
export type GateDecision = z.infer<typeof GateDecisionSchema>;
