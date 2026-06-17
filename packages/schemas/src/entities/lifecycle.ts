import { z } from "zod";

export const LifecycleStateSchema = z.enum([
  "draft",
  "active",
  "waiting",
  "blocked",
  "done",
  "archived",
  "lost",
  "won",
  "published",
  "paid",
  "cancelled",
]);
export type LifecycleState = z.infer<typeof LifecycleStateSchema>;
