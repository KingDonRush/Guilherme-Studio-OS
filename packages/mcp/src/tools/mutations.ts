import { kindFromAlias, PreparedActionService } from "@guilherme-studio/core";
import { createEntity, createResultEnvelope } from "@guilherme-studio/schemas";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createMcpContext, executeMcpCommand } from "../command.js";
import { jsonContent } from "../responses.js";
import { registerAgentHarnessMutationTools } from "./mutations/agent-harness-mutations.js";

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

export function registerStudioMcpMutationTools(server: McpServer, root: string): void {
  registerAgentHarnessMutationTools(server, root);

  server.tool(
    "studio_prepare_entity_create",
    {
      kind: z.string(),
      title: z.string(),
      summary: z.string().optional(),
      classification: z.enum(["public", "internal", "confidential"]).default("internal"),
    },
    async ({ kind, title, summary, classification }) => {
      const draft = createEntity({
        kind: kindFromAlias(kind),
        title,
        classification,
        ...(summary ? { summary } : {}),
      });
      return jsonContent({
        prepared: true,
        action: "entity.create",
        draft,
        note: "Prepared local mutation only. Use studio_create_entity to execute.",
      });
    },
  );

  server.tool(
    "studio_create_entity",
    {
      kind: z.string(),
      title: z.string(),
      summary: z.string().optional(),
      classification: z.enum(["public", "internal", "confidential"]).default("internal"),
      ...sharedCommandOptions,
    },
    async ({ kind, title, summary, classification, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "entity.create",
          payload: {
            kind: kindFromAlias(kind),
            title,
            classification,
            ...(summary ? { summary } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_transition_entity",
    {
      entity_id: z.string(),
      status: z.string(),
      ...sharedCommandOptions,
    },
    async ({ entity_id, status, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "entity.transition",
          targetId: entity_id,
          payload: { status },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_archive_entity",
    {
      entity_id: z.string(),
      ...sharedCommandOptions,
    },
    async ({ entity_id, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "entity.archive",
          targetId: entity_id,
          payload: {},
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_relate_entity",
    {
      entity_id: z.string(),
      relation_type: z.string(),
      target_id: z.string(),
      note: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({ entity_id, relation_type, target_id, note, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "entity.relate",
          targetId: entity_id,
          payload: {
            relation_type,
            target_id,
            ...(note ? { note } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_prepare_external_action",
    {
      action_type: z.string(),
      payload: z.record(z.string(), z.unknown()),
      ttl_seconds: z.number().int().positive().max(86400).default(900),
      ...sharedCommandOptions,
    },
    async ({ action_type, payload, ttl_seconds, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "action.prepare",
          payload: {
            action_type,
            payload,
            ttl_seconds,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool("studio_check_confirmation", { action_id: z.string() }, async ({ action_id }) => {
    const context = await createMcpContext(root);
    return jsonContent(await new PreparedActionService(context).get(action_id));
  });

  server.tool("studio_get_prepared_action", { action_id: z.string() }, async ({ action_id }) => {
    const context = await createMcpContext(root);
    return jsonContent(await new PreparedActionService(context).get(action_id));
  });

  server.tool(
    "studio_confirm_prepared_action",
    { action_id: z.string(), payload_checksum: z.string().length(64), ...sharedCommandOptions },
    async ({ action_id, payload_checksum, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "action.confirm",
          payload: { action_id, payload_checksum },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_qualify_prospect",
    {
      prospect_id: z.string(),
      rationale: z.string().min(1),
      score: z.number().int().min(0).max(100),
      qualified: z.boolean().default(true),
      ...sharedCommandOptions,
    },
    async ({ prospect_id, rationale, score, qualified, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "prospect.qualify",
          targetId: prospect_id,
          payload: { rationale, score, qualified },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_prepare_communication",
    {
      subject_id: z.string(),
      channel: z.string(),
      message: z.string(),
      ...sharedCommandOptions,
    },
    async ({ subject_id, channel, message, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "communication.prepare",
          payload: { subject_id, channel, message },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_register_evidence",
    {
      title: z.string(),
      evidence_type: z.enum([
        "file",
        "url",
        "command",
        "screenshot",
        "backup",
        "decision",
        "manual",
      ]),
      subject_id: z.string().optional(),
      path: z.string().optional(),
      url: z.string().optional(),
      command: z.string().optional(),
      checksum: z.string().optional(),
      claims: z.array(z.string()).default([]),
      source_mutability: z
        .enum(["immutable", "mutable", "operator-observed"])
        .default("operator-observed"),
      ...sharedCommandOptions,
    },
    async ({
      title,
      evidence_type,
      subject_id,
      path,
      url,
      command,
      checksum,
      claims,
      source_mutability,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "evidence.register",
          payload: {
            title,
            evidence_type,
            ...(subject_id ? { subject_id } : {}),
            ...(path ? { path } : {}),
            ...(url ? { url } : {}),
            ...(command ? { command } : {}),
            ...(checksum ? { checksum } : {}),
            claims,
            source_mutability,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_prepare_proposal",
    { opportunity_id: z.string(), title: z.string().optional(), ...sharedCommandOptions },
    async ({ opportunity_id, title, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "proposal.prepare",
          payload: {
            opportunity_id,
            ...(title ? { title } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_create_engagement_from_opportunity",
    { opportunity_id: z.string(), title: z.string().optional(), ...sharedCommandOptions },
    async ({ opportunity_id, title, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "engagement.create-from-opportunity",
          payload: {
            opportunity_id,
            ...(title ? { title } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_review_duplicates",
    {
      kind: z.string().optional(),
      title: z.string().optional(),
      email: z.string().optional(),
      website: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({ kind, title, email, website, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "crm.review-duplicates",
          payload: {
            ...(kind ? { kind: kindFromAlias(kind) } : {}),
            ...(title ? { title } : {}),
            ...(email ? { email } : {}),
            ...(website ? { website } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_convert_opportunity",
    {
      opportunity_id: z.string(),
      client_title: z.string().optional(),
      engagement_title: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({ opportunity_id, client_title, engagement_title, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "opportunity.convert",
          payload: {
            opportunity_id,
            ...(client_title ? { client_title } : {}),
            ...(engagement_title ? { engagement_title } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_complete_deliverable",
    {
      deliverable_id: z.string(),
      evidence_ids: z.array(z.string()).min(1),
      ...sharedCommandOptions,
    },
    async ({ deliverable_id, evidence_ids, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "deliverable.complete",
          targetId: deliverable_id,
          payload: { deliverable_id, evidence_ids },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_register_project_repo",
    {
      project_id: z.string(),
      title: z.string(),
      repository_path: z.string(),
      branch: z.string().optional(),
      remote_policy: z.enum(["allowed", "forbidden", "no-remote-in-v1"]).default("allowed"),
      ...sharedCommandOptions,
    },
    async ({
      project_id,
      title,
      repository_path,
      branch,
      remote_policy,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "project.register-repo",
          payload: {
            project_id,
            title,
            repository_path,
            ...(branch ? { branch } : {}),
            remote_policy,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

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

  server.tool(
    "studio_prepare_release",
    {
      product_id: z.string(),
      version: z.string(),
      changelog: z.string().optional(),
      compatibility_notes: z.string().optional(),
      migration_notes: z.string().optional(),
      public_api_notes: z.string().optional(),
      test_commands: z.array(z.string()).default([]),
      asset_ids: z.array(z.string()).default([]),
      package_path: z.string().optional(),
      roadmap_claims: z.array(z.string()).default([]),
      implemented_capabilities: z.array(z.string()).default([]),
      ...sharedCommandOptions,
    },
    async ({
      product_id,
      version,
      changelog,
      compatibility_notes,
      migration_notes,
      public_api_notes,
      test_commands,
      asset_ids,
      package_path,
      roadmap_claims,
      implemented_capabilities,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "release.prepare",
          payload: {
            product_id,
            version,
            ...(changelog ? { changelog } : {}),
            ...(compatibility_notes ? { compatibility_notes } : {}),
            ...(migration_notes ? { migration_notes } : {}),
            ...(public_api_notes ? { public_api_notes } : {}),
            ...(package_path ? { package_path } : {}),
            test_commands,
            asset_ids,
            roadmap_claims,
            implemented_capabilities,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_publish_release",
    {
      release_id: z.string(),
      evidence_ids: z.array(z.string()).min(1),
      demo_url: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({ release_id, evidence_ids, demo_url, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "release.publish",
          targetId: release_id,
          payload: {
            release_id,
            evidence_ids,
            ...(demo_url ? { demo_url } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_prepare_content",
    {
      title: z.string(),
      campaign_id: z.string().optional(),
      channel: z.string().optional(),
      publish_at: z.string().optional(),
      public_claims: z.array(z.string()).default([]),
      evidence_ids: z.array(z.string()).default([]),
      ...sharedCommandOptions,
    },
    async ({
      title,
      campaign_id,
      channel,
      publish_at,
      public_claims,
      evidence_ids,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "content.prepare",
          payload: {
            title,
            ...(campaign_id ? { campaign_id } : {}),
            ...(channel ? { channel } : {}),
            ...(publish_at ? { publish_at } : {}),
            public_claims,
            evidence_ids,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_prepare_application",
    {
      title: z.string(),
      source_url: z.string(),
      organization_id: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({ title, source_url, organization_id, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "application.prepare",
          payload: {
            title,
            source_url,
            ...(organization_id ? { organization_id } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_schedule_application_follow_up",
    {
      application_id: z.string(),
      follow_up_at: z.string(),
      channel: z.string().optional(),
      message: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({ application_id, follow_up_at, channel, message, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "application.follow-up",
          targetId: application_id,
          payload: {
            application_id,
            follow_up_at,
            ...(channel ? { channel } : {}),
            ...(message ? { message } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_record_application_interview",
    {
      application_id: z.string(),
      interview_at: z.string(),
      notes: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({ application_id, interview_at, notes, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "application.record-interview",
          targetId: application_id,
          payload: {
            application_id,
            interview_at,
            ...(notes ? { notes } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_route_knowledge",
    {
      title: z.string(),
      content: z.string(),
      destination: z.enum([
        "constitution",
        "prd",
        "decision",
        "entity",
        "workflow",
        "evidence",
        "lesson",
        "temporary_note",
      ]),
      target_id: z.string().optional(),
      rationale: z.string().optional(),
      evidence_ids: z.array(z.string()).default([]),
      ...sharedCommandOptions,
    },
    async ({
      title,
      content,
      destination,
      target_id,
      rationale,
      evidence_ids,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "knowledge.route",
          payload: {
            title,
            content,
            destination,
            ...(target_id ? { target_id } : {}),
            ...(rationale ? { rationale } : {}),
            evidence_ids,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_record_decision",
    {
      title: z.string(),
      decision: z.string(),
      rationale: z.string().optional(),
      alternatives: z.array(z.string()).default([]),
      impact: z.string().optional(),
      reversibility: z.string().optional(),
      authority_source: z.string().optional(),
      authority_owner_id: z.string().optional(),
      confirmation_required: z.boolean().optional(),
      contradiction_ids: z.array(z.string()).default([]),
      evidence_ids: z.array(z.string()).default([]),
      ...sharedCommandOptions,
    },
    async ({
      title,
      decision,
      rationale,
      alternatives,
      impact,
      reversibility,
      authority_source,
      authority_owner_id,
      confirmation_required,
      contradiction_ids,
      evidence_ids,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "decision.record",
          payload: {
            title,
            decision,
            ...(rationale ? { rationale } : {}),
            alternatives,
            ...(impact ? { impact } : {}),
            ...(reversibility ? { reversibility } : {}),
            ...(authority_source ? { authority_source } : {}),
            ...(authority_owner_id ? { authority_owner_id } : {}),
            ...(confirmation_required !== undefined ? { confirmation_required } : {}),
            contradiction_ids,
            evidence_ids,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_amend_decision",
    {
      decision_id: z.string(),
      decision: z.string(),
      title: z.string().optional(),
      rationale: z.string().optional(),
      alternatives: z.array(z.string()).default([]),
      impact: z.string().optional(),
      reversibility: z.enum(["reversible", "hard_to_reverse", "irreversible"]).optional(),
      evidence_ids: z.array(z.string()).default([]),
      ...sharedCommandOptions,
    },
    async ({
      decision_id,
      decision,
      title,
      rationale,
      alternatives,
      impact,
      reversibility,
      evidence_ids,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "decision.amend",
          targetId: decision_id,
          payload: {
            decision_id,
            decision,
            ...(title ? { title } : {}),
            ...(rationale ? { rationale } : {}),
            alternatives,
            ...(impact ? { impact } : {}),
            ...(reversibility ? { reversibility } : {}),
            evidence_ids,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_propose_learning",
    {
      title: z.string(),
      failure_class: z.string(),
      proposal: z.string(),
      destination: z.enum([
        "workflow",
        "schema",
        "test",
        "decision",
        "constitution",
        "repository_instruction",
      ]),
      rationale: z.string().optional(),
      run_id: z.string().optional(),
      evidence_ids: z.array(z.string()).default([]),
      ...sharedCommandOptions,
    },
    async ({
      title,
      failure_class,
      proposal,
      destination,
      rationale,
      run_id,
      evidence_ids,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "learning.propose",
          payload: {
            title,
            failure_class,
            proposal,
            destination,
            ...(rationale ? { rationale } : {}),
            ...(run_id ? { run_id } : {}),
            evidence_ids,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_create_case_from_evidence",
    {
      evidence_id: z.string(),
      title: z.string(),
      summary: z.string().optional(),
      case_url: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({ evidence_id, title, summary, case_url, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "case.create-from-evidence",
          payload: {
            evidence_id,
            title,
            ...(summary ? { summary } : {}),
            ...(case_url ? { case_url } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_create_handoff",
    {
      task_id: z.string(),
      title: z.string(),
      objective: z.string(),
      summary: z.string(),
      repository_ids: z.array(z.string()).default([]),
      ...sharedCommandOptions,
    },
    async ({ task_id, title, objective, summary, repository_ids, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "handoff.create",
          payload: { task_id, title, objective, summary, repository_ids },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_reconcile_prepared_action",
    { action_id: z.string(), result: z.record(z.string(), z.unknown()), ...sharedCommandOptions },
    async ({ action_id, result, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "action.reconcile",
          payload: { action_id, result },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_execute_confirmed_action",
    { action_id: z.string() },
    async ({ action_id }) => {
      const context = await createMcpContext(root);
      return jsonContent(
        createResultEnvelope({
          status: "blocked",
          requiredActions: ["enable_specific_adapter_provider"],
          error: {
            code: "adapter_disabled",
            message: `Action execution is not available without an enabled adapter: ${action_id}`,
            details: { action_id },
          },
          projectionRevision: context.projection.inspect().projectionRevision ?? 0,
        }),
      );
    },
  );
}
