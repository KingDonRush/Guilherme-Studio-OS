import { z } from "zod";
import { GenericSpecSchema } from "./base.js";

const MoneyInstallmentSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().min(1),
    amount_minor: z.number().int().min(0),
    due_at: z.string().datetime().optional(),
    condition: z.string().optional(),
  })
  .strict();

const CommercialTermsSchema = z
  .object({
    proposal_id: z.string().optional(),
    proposal_version_ref: z.string().optional(),
    contract_version_ref: z.string().optional(),
    signed_artifact_ref: z.string().optional(),
    price_basis: z.string().optional(),
    total_minor: z.number().int().min(0).optional(),
    currency: z.string().length(3).optional(),
    deposit_minor: z.number().int().min(0).optional(),
    deposit_due_at: z.string().datetime().optional(),
    installments: z.array(MoneyInstallmentSchema).default([]),
    warranty_days: z.number().int().min(0).optional(),
    warranty_starts_at: z.string().datetime().optional(),
    warranty_ends_at: z.string().datetime().optional(),
    maintenance_terms: z.string().optional(),
    expenses_policy: z.string().optional(),
    acceptance_conditions: z.array(z.string()).default([]),
  })
  .strict();

const ContractPartySchema = z
  .object({
    role: z.string().min(1),
    name: z.string().min(1),
    entity_id: z.string().optional(),
  })
  .strict();

const ObligationSchema = z
  .object({
    id: z.string().min(1),
    text: z.string().min(1),
    source_ref: z.string().min(1),
    owner: z.string().optional(),
    due_at: z.string().datetime().optional(),
    status: z.enum(["open", "satisfied", "waived", "blocked"]).default("open"),
    authority: z
      .enum(["operational-reminder", "contract-text", "external-professional"])
      .default("contract-text"),
    evidence_ids: z.array(z.string()).default([]),
  })
  .strict();

export const ContractSpecSchema = GenericSpecSchema.extend({
  engagement_id: z.string().optional(),
  proposal_id: z.string().optional(),
  proposal_version_ref: z.string().optional(),
  contract_version_ref: z.string().optional(),
  signed_artifact_ref: z.string().optional(),
  value_minor: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  parties: z.array(ContractPartySchema).default([]),
  commercial_terms: CommercialTermsSchema.optional(),
  obligations: z.array(ObligationSchema).default([]),
  signed_at: z.string().datetime().optional(),
  effective_at: z.string().datetime().optional(),
  ends_at: z.string().datetime().optional(),
  termination_terms: z.string().optional(),
  confidentiality_terms: z.string().optional(),
  ip_terms: z.string().optional(),
  governing_reference: z.string().optional(),
  legal_tax_note: z
    .literal("operational-record-only-not-legal-tax-accounting-advice")
    .default("operational-record-only-not-legal-tax-accounting-advice"),
});
export const InvoiceSpecSchema = GenericSpecSchema.extend({
  contract_id: z.string().optional(),
  engagement_id: z.string().optional(),
  deliverable_ids: z.array(z.string()).default([]),
  amount_minor: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  stage: z
    .enum(["draft", "issued", "viewed", "partially_paid", "overdue", "disputed", "settled", "void"])
    .default("draft"),
  issued_at: z.string().datetime().optional(),
  due_at: z.string().datetime().optional(),
  paid_amount_minor: z.number().int().min(0).optional(),
  settled_at: z.string().datetime().optional(),
  disputed_reason: z.string().optional(),
  void_reason: z.string().optional(),
  reference: z.string().optional(),
  source_term_id: z.string().optional(),
  reminder_prepared_action_ids: z.array(z.string()).default([]),
  evidence_ids: z.array(z.string()).default([]),
});
export const PaymentSpecSchema = GenericSpecSchema.extend({
  invoice_id: z.string().optional(),
  contract_id: z.string().optional(),
  amount_minor: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  stage: z
    .enum([
      "expected",
      "pending",
      "confirmed",
      "reconciled",
      "failed",
      "refunded",
      "reversed",
      "disputed",
    ])
    .default("expected"),
  expected_at: z.string().datetime().optional(),
  confirmed_at: z.string().datetime().optional(),
  provider: z.string().optional(),
  provider_reference: z.string().optional(),
  provider_evidence_id: z.string().optional(),
  reconciled_at: z.string().datetime().optional(),
  reconciliation_reference: z.string().optional(),
  correction_of_payment_id: z.string().optional(),
  evidence_ids: z.array(z.string()).default([]),
});
