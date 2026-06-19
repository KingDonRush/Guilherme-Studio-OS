import { kindFromAlias, PreparedActionService } from "@guilherme-studio/core";
import { createEntity, createResultEnvelope } from "@guilherme-studio/schemas";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createMcpContext, executeMcpCommand } from "../command.js";
import { jsonContent } from "../responses.js";
import { registerAgentHarnessMutationTools } from "./mutations/agent-harness-mutations.js";
import { registerCareerMutationTools } from "./mutations/career-mutations.js";
import { registerFinanceMutationTools } from "./mutations/finance-mutations.js";
import { registerGovernanceMutationTools } from "./mutations/governance-mutations.js";
import { registerSalesMutationTools } from "./mutations/sales-mutations.js";

const sharedCommandOptions = {
  dry_run: z.boolean().default(false),
  idempotency_key: z.string().optional(),
};

export function registerStudioMcpMutationTools(server: McpServer, root: string): void {
  registerAgentHarnessMutationTools(server, root);
  registerCareerMutationTools(server, root);
  registerFinanceMutationTools(server, root);
  registerGovernanceMutationTools(server, root);
  registerSalesMutationTools(server, root);

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
