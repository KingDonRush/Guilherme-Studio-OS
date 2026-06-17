import { z } from "zod";

export const MoneySchema = z
  .object({
    amount_minor: z.number().int().min(0),
    currency: z
      .string()
      .length(3)
      .transform((value) => value.toUpperCase()),
  })
  .strict();
