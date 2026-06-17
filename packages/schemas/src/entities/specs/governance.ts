import { z } from "zod";
import { GenericSpecSchema } from "./base.js";

export const EvidenceSpecSchema = GenericSpecSchema.extend({
  evidence_type: z.enum(["file", "url", "command", "screenshot", "backup", "decision", "manual"]),
  path: z.string().optional(),
  url: z.string().url().optional(),
  command: z.string().optional(),
  checksum: z.string().optional(),
  observed_at: z.string().datetime().optional(),
  subject_id: z.string().optional(),
  claims: z.array(z.string()).default([]),
  source_mutability: z
    .enum(["immutable", "mutable", "operator-observed"])
    .default("operator-observed"),
  validated_at: z.string().datetime().optional(),
});
export const TaskSpecSchema = GenericSpecSchema.extend({
  priority: z.enum(["now", "high", "normal", "low"]).default("normal"),
  economic_reason: z.string().optional(),
  acceptance: z.array(z.string()).default([]),
  blocked_by: z.array(z.string()).default([]),
});
export const AgentRunSpecSchema = GenericSpecSchema.extend({
  objective: z.string().min(1),
  started_at: z.string().datetime(),
  finished_at: z.string().datetime().optional(),
  result: z.enum(["running", "complete", "blocked", "failed"]).default("running"),
  evidence_ids: z.array(z.string()).default([]),
  model: z.string().optional(),
});
export const DecisionSpecSchema = GenericSpecSchema.extend({
  decision: z.string().optional(),
  rationale: z.string().optional(),
  decided_at: z.string().datetime().optional(),
  evidence_ids: z.array(z.string()).default([]),
});
export const HandoffSpecSchema = z
  .object({
    summary: z.string().min(1),
    created_at: z.string().datetime(),
    context_pack_id: z.string().optional(),
    repository_ids: z.array(z.string()).default([]),
    omitted_sensitive_sections: z.array(z.string()).default([]),
  })
  .strict();
export const AgentRunExtendedSpecSchema = AgentRunSpecSchema.extend({
  handoff: HandoffSpecSchema.optional(),
});
