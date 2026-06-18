import { kindFromAlias, PreparedActionService } from "@guilherme-studio/core";
import { createEntity, createResultEnvelope } from "@guilherme-studio/schemas";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createMcpContext, executeMcpCommand } from "../command.js";
import { jsonContent } from "../responses.js";

const sharedCommandOptions = {
  dry_run: z.boolean().default(false),
  idempotency_key: z.string().optional(),
};

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
    "studio_prepare_external_action",
    {
      action_type: z.string(),
      payload: z.record(z.string(), z.unknown()),
      ttl_seconds: z.number().int().positive().max(86400).default(900),
    },
    async ({ action_type, payload, ttl_seconds }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "action.prepare",
          payload: {
            action_type,
            payload,
            ttl_seconds,
          },
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
    { action_id: z.string(), payload_checksum: z.string().length(64) },
    async ({ action_id, payload_checksum }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "action.confirm",
          payload: { action_id, payload_checksum },
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
    },
    async ({ prospect_id, rationale, score, qualified }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "prospect.qualify",
          targetId: prospect_id,
          payload: { rationale, score, qualified },
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
    { opportunity_id: z.string(), title: z.string().optional() },
    async ({ opportunity_id, title }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "proposal.prepare",
          payload: {
            opportunity_id,
            ...(title ? { title } : {}),
          },
        }),
      ),
  );

  server.tool(
    "studio_create_engagement_from_opportunity",
    { opportunity_id: z.string(), title: z.string().optional() },
    async ({ opportunity_id, title }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "engagement.create-from-opportunity",
          payload: {
            opportunity_id,
            ...(title ? { title } : {}),
          },
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
    },
    async ({ kind, title, email, website }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "crm.review-duplicates",
          payload: {
            ...(kind ? { kind: kindFromAlias(kind) } : {}),
            ...(title ? { title } : {}),
            ...(email ? { email } : {}),
            ...(website ? { website } : {}),
          },
        }),
      ),
  );

  server.tool(
    "studio_convert_opportunity",
    {
      opportunity_id: z.string(),
      client_title: z.string().optional(),
      engagement_title: z.string().optional(),
    },
    async ({ opportunity_id, client_title, engagement_title }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "opportunity.convert",
          payload: {
            opportunity_id,
            ...(client_title ? { client_title } : {}),
            ...(engagement_title ? { engagement_title } : {}),
          },
        }),
      ),
  );

  server.tool(
    "studio_complete_deliverable",
    { deliverable_id: z.string(), evidence_ids: z.array(z.string()).min(1) },
    async ({ deliverable_id, evidence_ids }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "deliverable.complete",
          targetId: deliverable_id,
          payload: { deliverable_id, evidence_ids },
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
    },
    async ({ engagement_id, title, value_minor, currency }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "contract.create-from-engagement",
          payload: {
            engagement_id,
            ...(title ? { title } : {}),
            ...(value_minor !== undefined ? { value_minor } : {}),
            ...(currency ? { currency } : {}),
          },
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
    },
    async ({ contract_id, amount_minor, currency, title, due_at, reference }) =>
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
          },
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
    },
    async ({ invoice_id, amount_minor, currency, title, expected_at }) =>
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
    },
    async ({ title, campaign_id, channel, publish_at, public_claims, evidence_ids }) =>
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
    "studio_create_case_from_evidence",
    {
      evidence_id: z.string(),
      title: z.string(),
      summary: z.string().optional(),
      case_url: z.string().optional(),
    },
    async ({ evidence_id, title, summary, case_url }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "case.create-from-evidence",
          payload: {
            evidence_id,
            title,
            ...(summary ? { summary } : {}),
            ...(case_url ? { case_url } : {}),
          },
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
    },
    async ({ task_id, title, objective, summary, repository_ids }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "handoff.create",
          payload: { task_id, title, objective, summary, repository_ids },
        }),
      ),
  );

  server.tool(
    "studio_reconcile_prepared_action",
    { action_id: z.string(), result: z.record(z.string(), z.unknown()) },
    async ({ action_id, result }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "action.reconcile",
          payload: { action_id, result },
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

function registerAgentHarnessMutationTools(server: McpServer, root: string): void {
  const commandOptions = {
    dry_run: z.boolean().default(false),
    idempotency_key: z.string().optional(),
  };
  const targetedCommandOptions = {
    ...commandOptions,
    expected_revision: z.number().int().positive().optional(),
  };

  server.tool(
    "studio_start_agent_run",
    {
      objective: z.string().min(1),
      title: z.string().optional(),
      task_id: z.string().optional(),
      owning_entity_ids: z.array(z.string()).default([]),
      target_repository_ids: z.array(z.string()).default([]),
      target_environment_ids: z.array(z.string()).default([]),
      phase: z
        .enum([
          "discovery",
          "planning",
          "implementation",
          "stabilization",
          "release",
          "migration",
          "recovery",
        ])
        .optional(),
      risk: z.enum(["low", "normal", "high", "critical"]).optional(),
      allowed: z.array(z.string()).default([]),
      confirmation_required: z.array(z.string()).default([]),
      prohibited: z.array(z.string()).default([]),
      model: z.string().optional(),
      material: z.boolean().default(true),
      ...commandOptions,
    },
    async ({
      objective,
      title,
      task_id,
      owning_entity_ids,
      target_repository_ids,
      target_environment_ids,
      phase,
      risk,
      allowed,
      confirmation_required,
      prohibited,
      model,
      material,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "agent.start",
          payload: {
            objective,
            ...(title ? { title } : {}),
            ...(task_id ? { task_id } : {}),
            owning_entity_ids,
            target_repository_ids,
            target_environment_ids,
            ...(phase ? { phase } : {}),
            ...(risk ? { risk } : {}),
            allowed,
            confirmation_required,
            prohibited,
            ...(model ? { model } : {}),
            material,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_build_context_pack",
    {
      run_id: z.string(),
      next_valid_action: z.string().optional(),
      forbidden_reopenings: z.array(z.string()).default([]),
      ...targetedCommandOptions,
    },
    async ({
      run_id,
      next_valid_action,
      forbidden_reopenings,
      dry_run,
      idempotency_key,
      expected_revision,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "agent.context",
          targetId: run_id,
          payload: {
            run_id,
            ...(next_valid_action ? { next_valid_action } : {}),
            forbidden_reopenings,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
          ...(expected_revision !== undefined ? { expectedRevision: expected_revision } : {}),
        }),
      ),
  );

  server.tool(
    "studio_authorize_agent_run",
    {
      run_id: z.string(),
      allowed: z.array(z.string()).optional(),
      confirmation_required: z.array(z.string()).optional(),
      prohibited: z.array(z.string()).optional(),
      ...targetedCommandOptions,
    },
    async ({
      run_id,
      allowed,
      confirmation_required,
      prohibited,
      dry_run,
      idempotency_key,
      expected_revision,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "agent.authorize",
          targetId: run_id,
          payload: {
            run_id,
            ...(allowed ? { allowed } : {}),
            ...(confirmation_required ? { confirmation_required } : {}),
            ...(prohibited ? { prohibited } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
          ...(expected_revision !== undefined ? { expectedRevision: expected_revision } : {}),
        }),
      ),
  );

  server.tool(
    "studio_record_agent_observation",
    {
      run_id: z.string(),
      source: z.enum(["git", "runtime", "user", "handoff", "docs", "code", "other"]),
      summary: z.string().min(1),
      repository_id: z.string().optional(),
      contradictions: z.array(z.string()).default([]),
      ...targetedCommandOptions,
    },
    async ({
      run_id,
      source,
      summary,
      repository_id,
      contradictions,
      dry_run,
      idempotency_key,
      expected_revision,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "agent.observe",
          targetId: run_id,
          payload: {
            run_id,
            source,
            summary,
            ...(repository_id ? { repository_id } : {}),
            contradictions,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
          ...(expected_revision !== undefined ? { expectedRevision: expected_revision } : {}),
        }),
      ),
  );

  server.tool(
    "studio_record_agent_action",
    {
      run_id: z.string(),
      action: z.string().min(1),
      status: z.enum(["planned", "executed", "blocked", "failed"]).optional(),
      command_text: z.string().optional(),
      target_id: z.string().optional(),
      result_summary: z.string().optional(),
      evidence_ids: z.array(z.string()).default([]),
      ...targetedCommandOptions,
    },
    async ({
      run_id,
      action,
      status,
      command_text,
      target_id,
      result_summary,
      evidence_ids,
      dry_run,
      idempotency_key,
      expected_revision,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "agent.record-action",
          targetId: run_id,
          payload: {
            run_id,
            action,
            ...(status ? { status } : {}),
            ...(command_text ? { command: command_text } : {}),
            ...(target_id ? { target_id } : {}),
            ...(result_summary ? { result_summary } : {}),
            evidence_ids,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
          ...(expected_revision !== undefined ? { expectedRevision: expected_revision } : {}),
        }),
      ),
  );

  server.tool(
    "studio_record_agent_evidence",
    {
      run_id: z.string(),
      evidence_ids: z.array(z.string()).min(1),
      ...targetedCommandOptions,
    },
    async ({ run_id, evidence_ids, dry_run, idempotency_key, expected_revision }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "agent.record-evidence",
          targetId: run_id,
          payload: { run_id, evidence_ids },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
          ...(expected_revision !== undefined ? { expectedRevision: expected_revision } : {}),
        }),
      ),
  );

  server.tool(
    "studio_complete_agent_verification",
    {
      run_id: z.string(),
      status: z.enum(["passed", "failed", "not_run"]),
      command_text: z.string().optional(),
      result_summary: z.string().optional(),
      artifact_path: z.string().optional(),
      not_run_reason: z.string().optional(),
      ...targetedCommandOptions,
    },
    async ({
      run_id,
      status,
      command_text,
      result_summary,
      artifact_path,
      not_run_reason,
      dry_run,
      idempotency_key,
      expected_revision,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "agent.verify",
          targetId: run_id,
          payload: {
            run_id,
            status,
            ...(command_text ? { command: command_text } : {}),
            ...(result_summary ? { result_summary } : {}),
            ...(artifact_path ? { artifact_path } : {}),
            ...(not_run_reason ? { not_run_reason } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
          ...(expected_revision !== undefined ? { expectedRevision: expected_revision } : {}),
        }),
      ),
  );

  server.tool(
    "studio_create_agent_handoff",
    {
      run_id: z.string(),
      summary: z.string().min(1),
      next_valid_action: z.string().min(1),
      gaps: z.array(z.string()).default([]),
      forbidden_reopenings: z.array(z.string()).default([]),
      confirmation_required: z.array(z.string()).default([]),
      evidence_ids: z.array(z.string()).default([]),
      ...targetedCommandOptions,
    },
    async ({
      run_id,
      summary,
      next_valid_action,
      gaps,
      forbidden_reopenings,
      confirmation_required,
      evidence_ids,
      dry_run,
      idempotency_key,
      expected_revision,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "agent.handoff",
          targetId: run_id,
          payload: {
            run_id,
            summary,
            next_valid_action,
            gaps,
            forbidden_reopenings,
            confirmation_required,
            evidence_ids,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
          ...(expected_revision !== undefined ? { expectedRevision: expected_revision } : {}),
        }),
      ),
  );

  server.tool(
    "studio_close_agent_run",
    {
      run_id: z.string(),
      outcome: z.string().optional(),
      ...targetedCommandOptions,
    },
    async ({ run_id, outcome, dry_run, idempotency_key, expected_revision }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "agent.close",
          targetId: run_id,
          payload: {
            run_id,
            ...(outcome ? { outcome } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
          ...(expected_revision !== undefined ? { expectedRevision: expected_revision } : {}),
        }),
      ),
  );
}
