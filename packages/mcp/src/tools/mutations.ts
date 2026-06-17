import { kindFromAlias, PreparedActionService } from "@guilherme-studio/core";
import { createEntity, createResultEnvelope } from "@guilherme-studio/schemas";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createMcpContext, executeMcpCommand } from "../command.js";
import { jsonContent } from "../responses.js";

export function registerStudioMcpMutationTools(server: McpServer, root: string): void {
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
    },
    async ({ kind, title, summary, classification }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "entity.create",
          payload: {
            kind: kindFromAlias(kind),
            title,
            classification,
            ...(summary ? { summary } : {}),
          },
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
    },
    async ({ title, evidence_type, subject_id, path, url, command, checksum }) =>
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
          },
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
      evidence_ids: z.array(z.string()).default([]),
    },
    async ({ title, decision, rationale, evidence_ids }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "decision.record",
          payload: {
            title,
            decision,
            ...(rationale ? { rationale } : {}),
            evidence_ids,
          },
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
