import { z } from "zod";

export const RelationSchema = z
  .object({
    type: z.string().min(1),
    target_id: z.string().min(1),
    note: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();
export const LegacyRelationSchema = z
  .object({
    type: z.string().min(1),
    targetId: z.string().min(1),
    note: z.string().optional(),
  })
  .strict();
export type StudioRelation = z.infer<typeof RelationSchema>;
