import { z } from "zod";
import { ClassificationSchema } from "../classification.js";

export const EventSchema = z
  .object({
    api_version: z
      .literal("studio.guilherme.dev/event-v1")
      .default("studio.guilherme.dev/event-v1"),
    id: z.string().min(3),
    type: z.string().min(1),
    request_id: z.string().optional(),
    command_id: z.string().optional(),
    correlation_id: z.string().optional(),
    entity_id: z.string().optional(),
    actor_id: z.string().optional(),
    created_at: z.string().datetime(),
    classification: ClassificationSchema.default("internal"),
    data: z.record(z.string(), z.unknown()).default({}),
  })
  .strict();
export type StudioEvent = z.infer<typeof EventSchema>;
