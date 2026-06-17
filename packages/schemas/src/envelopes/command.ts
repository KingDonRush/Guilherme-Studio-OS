import { z } from "zod";
import { ActorSchema } from "../classification.js";

export const CommandEnvelopeSchema = z
  .object({
    api_version: z
      .literal("studio.guilherme.dev/command-v1")
      .default("studio.guilherme.dev/command-v1"),
    id: z.string().min(3),
    request_id: z.string().min(3),
    command: z.string().min(1),
    actor: ActorSchema,
    target_id: z.string().optional(),
    expected_revision: z.number().int().min(1).optional(),
    idempotency_key: z.string().min(8).max(200).optional(),
    dry_run: z.boolean().default(false),
    payload: z.record(z.string(), z.unknown()).default({}),
    created_at: z.string().datetime(),
  })
  .strict();
export type CommandEnvelope = z.infer<typeof CommandEnvelopeSchema>;
