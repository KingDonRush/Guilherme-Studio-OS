import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { executeMcpCommand } from "../../command.js";
import { jsonContent } from "../../responses.js";

const sharedCommandOptions = {
  dry_run: z.boolean().default(false),
  idempotency_key: z.string().optional(),
};

const financeInstallmentInput = z.object({
  id: z.string().optional(),
  title: z.string(),
  amount_minor: z.number().int().min(0),
  due_at: z.string().optional(),
  condition: z.string().optional(),
});

const financeObligationInput = z.object({
  id: z.string().optional(),
  text: z.string(),
  source_ref: z.string(),
  owner: z.string().optional(),
  due_at: z.string().optional(),
  status: z.enum(["open", "satisfied", "waived", "blocked"]).optional(),
  authority: z.enum(["operational-reminder", "contract-text", "external-professional"]).optional(),
  evidence_ids: z.array(z.string()).optional(),
});

export function registerFinanceMutationTools(server: McpServer, root: string): void {
  server.tool(
    "studio_create_contract_from_engagement",
    {
      engagement_id: z.string(),
      title: z.string().optional(),
      value_minor: z.number().int().min(0).optional(),
      currency: z.string().length(3).optional(),
      proposal_id: z.string().optional(),
      proposal_version_ref: z.string().optional(),
      contract_version_ref: z.string().optional(),
      signed_artifact_ref: z.string().optional(),
      effective_at: z.string().optional(),
      ends_at: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({
      engagement_id,
      title,
      value_minor,
      currency,
      proposal_id,
      proposal_version_ref,
      contract_version_ref,
      signed_artifact_ref,
      effective_at,
      ends_at,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "contract.create-from-engagement",
          payload: {
            engagement_id,
            ...(title ? { title } : {}),
            ...(value_minor !== undefined ? { value_minor } : {}),
            ...(currency ? { currency } : {}),
            ...(proposal_id ? { proposal_id } : {}),
            ...(proposal_version_ref ? { proposal_version_ref } : {}),
            ...(contract_version_ref ? { contract_version_ref } : {}),
            ...(signed_artifact_ref ? { signed_artifact_ref } : {}),
            ...(effective_at ? { effective_at } : {}),
            ...(ends_at ? { ends_at } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_register_commercial_terms",
    {
      contract_id: z.string(),
      proposal_id: z.string().optional(),
      proposal_version_ref: z.string().optional(),
      contract_version_ref: z.string().optional(),
      signed_artifact_ref: z.string().optional(),
      price_basis: z.string().optional(),
      total_minor: z.number().int().min(0).optional(),
      currency: z.string().length(3).optional(),
      deposit_minor: z.number().int().min(0).optional(),
      deposit_due_at: z.string().optional(),
      installments: z.array(financeInstallmentInput).default([]),
      warranty_days: z.number().int().min(0).optional(),
      warranty_starts_at: z.string().optional(),
      warranty_ends_at: z.string().optional(),
      maintenance_terms: z.string().optional(),
      expenses_policy: z.string().optional(),
      acceptance_conditions: z.array(z.string()).default([]),
      ...sharedCommandOptions,
    },
    async ({
      contract_id,
      proposal_id,
      proposal_version_ref,
      contract_version_ref,
      signed_artifact_ref,
      price_basis,
      total_minor,
      currency,
      deposit_minor,
      deposit_due_at,
      installments,
      warranty_days,
      warranty_starts_at,
      warranty_ends_at,
      maintenance_terms,
      expenses_policy,
      acceptance_conditions,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "contract.register-terms",
          targetId: contract_id,
          payload: {
            contract_id,
            ...(proposal_id ? { proposal_id } : {}),
            ...(proposal_version_ref ? { proposal_version_ref } : {}),
            ...(contract_version_ref ? { contract_version_ref } : {}),
            ...(signed_artifact_ref ? { signed_artifact_ref } : {}),
            ...(price_basis ? { price_basis } : {}),
            ...(total_minor !== undefined ? { total_minor } : {}),
            ...(currency ? { currency } : {}),
            ...(deposit_minor !== undefined ? { deposit_minor } : {}),
            ...(deposit_due_at ? { deposit_due_at } : {}),
            installments,
            ...(warranty_days !== undefined ? { warranty_days } : {}),
            ...(warranty_starts_at ? { warranty_starts_at } : {}),
            ...(warranty_ends_at ? { warranty_ends_at } : {}),
            ...(maintenance_terms ? { maintenance_terms } : {}),
            ...(expenses_policy ? { expenses_policy } : {}),
            acceptance_conditions,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_register_contract_details",
    {
      contract_id: z.string(),
      obligations: z.array(financeObligationInput).default([]),
      termination_terms: z.string().optional(),
      confidentiality_terms: z.string().optional(),
      ip_terms: z.string().optional(),
      governing_reference: z.string().optional(),
      signed_artifact_ref: z.string().optional(),
      signed_at: z.string().optional(),
      effective_at: z.string().optional(),
      ends_at: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({
      contract_id,
      obligations,
      termination_terms,
      confidentiality_terms,
      ip_terms,
      governing_reference,
      signed_artifact_ref,
      signed_at,
      effective_at,
      ends_at,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "contract.register-details",
          targetId: contract_id,
          payload: {
            contract_id,
            obligations,
            ...(termination_terms ? { termination_terms } : {}),
            ...(confidentiality_terms ? { confidentiality_terms } : {}),
            ...(ip_terms ? { ip_terms } : {}),
            ...(governing_reference ? { governing_reference } : {}),
            ...(signed_artifact_ref ? { signed_artifact_ref } : {}),
            ...(signed_at ? { signed_at } : {}),
            ...(effective_at ? { effective_at } : {}),
            ...(ends_at ? { ends_at } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_create_invoice_for_contract",
    {
      contract_id: z.string(),
      amount_minor: z.number().int().min(0),
      currency: z.string().length(3),
      title: z.string().optional(),
      due_at: z.string().optional(),
      reference: z.string().optional(),
      deliverable_ids: z.array(z.string()).default([]),
      source_term_id: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({
      contract_id,
      amount_minor,
      currency,
      title,
      due_at,
      reference,
      deliverable_ids,
      source_term_id,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "invoice.create-for-contract",
          payload: {
            contract_id,
            amount_minor,
            currency,
            ...(title ? { title } : {}),
            ...(due_at ? { due_at } : {}),
            ...(reference ? { reference } : {}),
            deliverable_ids,
            ...(source_term_id ? { source_term_id } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_issue_invoice",
    {
      invoice_id: z.string(),
      issued_at: z.string().optional(),
      evidence_ids: z.array(z.string()).default([]),
      ...sharedCommandOptions,
    },
    async ({ invoice_id, issued_at, evidence_ids, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "invoice.issue",
          targetId: invoice_id,
          payload: {
            invoice_id,
            ...(issued_at ? { issued_at } : {}),
            evidence_ids,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_update_invoice_lifecycle",
    {
      invoice_id: z.string(),
      stage: z.enum([
        "draft",
        "issued",
        "viewed",
        "partially_paid",
        "overdue",
        "disputed",
        "settled",
        "void",
      ]),
      paid_amount_minor: z.number().int().min(0).optional(),
      reason: z.string().optional(),
      evidence_ids: z.array(z.string()).default([]),
      ...sharedCommandOptions,
    },
    async ({
      invoice_id,
      stage,
      paid_amount_minor,
      reason,
      evidence_ids,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "invoice.update-lifecycle",
          targetId: invoice_id,
          payload: {
            invoice_id,
            stage,
            ...(paid_amount_minor !== undefined ? { paid_amount_minor } : {}),
            ...(reason ? { reason } : {}),
            evidence_ids,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_record_payment_for_invoice",
    {
      invoice_id: z.string(),
      amount_minor: z.number().int().min(0),
      currency: z.string().length(3),
      title: z.string().optional(),
      expected_at: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({ invoice_id, amount_minor, currency, title, expected_at, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "payment.record-for-invoice",
          payload: {
            invoice_id,
            amount_minor,
            currency,
            ...(title ? { title } : {}),
            ...(expected_at ? { expected_at } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_confirm_payment",
    {
      payment_id: z.string(),
      provider_evidence_id: z.string(),
      provider: z.string().optional(),
      provider_reference: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({
      payment_id,
      provider_evidence_id,
      provider,
      provider_reference,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "payment.confirm",
          targetId: payment_id,
          payload: {
            payment_id,
            provider_evidence_id,
            ...(provider ? { provider } : {}),
            ...(provider_reference ? { provider_reference } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_reconcile_payment",
    {
      payment_id: z.string(),
      reference: z.string(),
      evidence_id: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({ payment_id, reference, evidence_id, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "payment.reconcile",
          targetId: payment_id,
          payload: { payment_id, reference, ...(evidence_id ? { evidence_id } : {}) },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_prepare_payment_reminder",
    {
      invoice_id: z.string(),
      message: z.string(),
      channel: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({ invoice_id, message, channel, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "payment.prepare-reminder",
          targetId: invoice_id,
          payload: {
            invoice_id,
            message,
            ...(channel ? { channel } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_resolve_finance_obligations",
    {
      contract_id: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({ contract_id, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "finance.resolve-obligations",
          payload: {
            ...(contract_id ? { contract_id } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_finance_reconciliation_report",
    {
      ...sharedCommandOptions,
    },
    async ({ dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "finance.reconciliation-report",
          payload: {},
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_finance_obligation_calendar",
    {
      ...sharedCommandOptions,
    },
    async ({ dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "finance.obligation-calendar",
          payload: {},
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_finance_economic_view",
    {
      include_legal_tax_note: z.boolean().default(false),
      ...sharedCommandOptions,
    },
    async ({ include_legal_tax_note, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "finance.economic-view",
          payload: { include_legal_tax_note },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );
}
