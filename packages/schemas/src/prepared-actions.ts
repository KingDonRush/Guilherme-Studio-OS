import { z } from "zod";

export const PreparedActionSchema = z
  .object({
    api_version: z
      .literal("studio.guilherme.dev/prepared-action-v1")
      .default("studio.guilherme.dev/prepared-action-v1"),
    id: z.string().min(3),
    action_type: z.string().min(1),
    provider: z.string().optional(),
    target: z.string().optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    expires_at: z.string().datetime(),
    actor_id: z.string().optional(),
    source_revisions: z.record(z.string(), z.number().int().min(1)).default({}),
    payload: z.record(z.string(), z.unknown()).default({}),
    payload_checksum: z.string().regex(/^[a-f0-9]{64}$/),
    status: z
      .enum([
        "draft",
        "validated",
        "awaiting_confirmation",
        "confirmed",
        "executing",
        "executed",
        "reconciled",
        "failed",
        "expired",
        "cancelled",
        "superseded",
      ])
      .default("awaiting_confirmation"),
    confirmation_id: z.string().optional(),
    confirmed_at: z.string().datetime().optional(),
    execution_started_at: z.string().datetime().optional(),
    executed_at: z.string().datetime().optional(),
    reconciled_at: z.string().datetime().optional(),
    failure: z.string().optional(),
    reconciliation: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();
export type PreparedAction = z.infer<typeof PreparedActionSchema>;
