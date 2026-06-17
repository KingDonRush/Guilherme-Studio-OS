import { z } from "zod";
import { LifecycleStateSchema } from "../lifecycle.js";

export const GenericSpecSchema = z
  .object({
    title: z.string().min(1),
    status: LifecycleStateSchema.default("active"),
    summary: z.string().optional(),
  })
  .catchall(z.unknown());
