import { z } from "zod";
import { GenericSpecSchema } from "./base.js";

export const ContractSpecSchema = GenericSpecSchema.extend({
  engagement_id: z.string().optional(),
  value_minor: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  signed_at: z.string().datetime().optional(),
  effective_at: z.string().datetime().optional(),
  ends_at: z.string().datetime().optional(),
});
export const InvoiceSpecSchema = GenericSpecSchema.extend({
  contract_id: z.string().optional(),
  amount_minor: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  due_at: z.string().datetime().optional(),
  reference: z.string().optional(),
});
export const PaymentSpecSchema = GenericSpecSchema.extend({
  invoice_id: z.string().optional(),
  amount_minor: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  expected_at: z.string().datetime().optional(),
  reconciled_at: z.string().datetime().optional(),
  reconciliation_reference: z.string().optional(),
});
