import { z } from "zod";
import { ClassificationSchema } from "../classification.js";
import { LEGACY_STUDIO_SCHEMA_VERSION } from "../versions.js";
import { EntityKindSchema } from "./kinds.js";
import { LifecycleStateSchema } from "./lifecycle.js";
import { LegacyRelationSchema } from "./relations.js";

export const LegacyEntitySchema = z
  .object({
    apiVersion: z.literal(LEGACY_STUDIO_SCHEMA_VERSION),
    kind: EntityKindSchema,
    id: z.string().min(3),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    status: LifecycleStateSchema.default("active"),
    classification: ClassificationSchema.default("internal"),
    revision: z.number().int().min(1).default(1),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    archivedAt: z.string().datetime().optional(),
    ownerId: z.string().optional(),
    summary: z.string().optional(),
    labels: z.array(z.string()).default([]),
    relations: z.array(LegacyRelationSchema).default([]),
    data: z.record(z.string(), z.unknown()).default({}),
  })
  .strict();
export type LegacyEntity = z.infer<typeof LegacyEntitySchema>;
