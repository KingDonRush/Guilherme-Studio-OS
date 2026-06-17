import { z } from "zod";
import { ClassificationSchema } from "../classification.js";

export const EntityMetadataSchema = z
  .object({
    id: z.string().min(3),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    schema_version: z.number().int().min(1).default(1),
    revision: z.number().int().min(1).default(1),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    owner_id: z.string().optional(),
    classification: ClassificationSchema.default("internal"),
    labels: z.array(z.string()).default([]),
    archived_at: z.string().datetime().nullable().optional(),
  })
  .strict();
