import { kindFromAlias, PreparedActionService } from "@guilherme-studio/core";
import { createEntity, createResultEnvelope } from "@guilherme-studio/schemas";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createMcpContext, executeMcpCommand } from "../command.js";
import { jsonContent } from "../responses.js";
import { registerAgentHarnessMutationTools } from "./mutations/agent-harness-mutations.js";
import { registerFinanceMutationTools } from "./mutations/finance-mutations.js";
import { registerSalesMutationTools } from "./mutations/sales-mutations.js";

const sharedCommandOptions = {
  dry_run: z.boolean().default(false),
  idempotency_key: z.string().optional(),
};

const careerRequirementInput = z.object({
  text: z.string(),
  type: z.enum(["explicit", "inferred", "optional"]).optional(),
  source_ref: z.string().optional(),
});

const careerAnswerInput = z.object({
  prompt: z.string(),
  answer: z.string(),
  evidence_ids: z.array(z.string()).default([]),
});

const careerEvidenceMapInput = z.object({
  role_family: z.string(),
  required_signal: z.string(),
  evidence_ids: z.array(z.string()).default([]),
  gap: z.string().optional(),
});

export function registerStudioMcpMutationTools(server: McpServer, root: string): void {
  registerAgentHarnessMutationTools(server, root);
  registerFinanceMutationTools(server, root);
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
    "studio_record_career_strategy",
    {
      title: z.string().optional(),
      role_families: z.array(z.string()),
      employment_types: z.array(z.string()).default([]),
      geographies: z.array(z.string()).default([]),
      timezone: z.string().optional(),
      language: z.string().optional(),
      salary_expectation: z.string().optional(),
      unacceptable_constraints: z.array(z.string()).default([]),
      evidence_map: z.array(careerEvidenceMapInput).default([]),
      ...sharedCommandOptions,
    },
    async ({
      title,
      role_families,
      employment_types,
      geographies,
      timezone,
      language,
      salary_expectation,
      unacceptable_constraints,
      evidence_map,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "career.record-strategy",
          payload: {
            ...(title ? { title } : {}),
            role_families,
            employment_types,
            geographies,
            ...(timezone ? { timezone } : {}),
            ...(language ? { language } : {}),
            ...(salary_expectation ? { salary_expectation } : {}),
            unacceptable_constraints,
            evidence_map,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_register_job_opportunity",
    {
      title: z.string(),
      source_url: z.string(),
      organization_id: z.string().optional(),
      role_title: z.string().optional(),
      role_family: z.string().optional(),
      employment_type: z.string().optional(),
      geography: z.string().optional(),
      timezone: z.string().optional(),
      language: z.string().optional(),
      compensation: z.string().optional(),
      requirements: z.array(careerRequirementInput).default([]),
      deadline_at: z.string().optional(),
      contact_name: z.string().optional(),
      contact_url: z.string().optional(),
      source_freshness: z.enum(["fresh", "stale", "expired", "unknown"]).optional(),
      ...sharedCommandOptions,
    },
    async ({
      title,
      source_url,
      organization_id,
      role_title,
      role_family,
      employment_type,
      geography,
      timezone,
      language,
      compensation,
      requirements,
      deadline_at,
      contact_name,
      contact_url,
      source_freshness,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "application.register-opportunity",
          payload: {
            title,
            source_url,
            ...(organization_id ? { organization_id } : {}),
            ...(role_title ? { role_title } : {}),
            ...(role_family ? { role_family } : {}),
            ...(employment_type ? { employment_type } : {}),
            ...(geography ? { geography } : {}),
            ...(timezone ? { timezone } : {}),
            ...(language ? { language } : {}),
            ...(compensation ? { compensation } : {}),
            requirements,
            ...(deadline_at ? { deadline_at } : {}),
            ...(contact_name ? { contact_name } : {}),
            ...(contact_url ? { contact_url } : {}),
            ...(source_freshness ? { source_freshness } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_review_application_duplicates",
    {
      source_url: z.string().optional(),
      title: z.string().optional(),
      organization_id: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({ source_url, title, organization_id, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "application.review-duplicates",
          payload: {
            ...(source_url ? { source_url } : {}),
            ...(title ? { title } : {}),
            ...(organization_id ? { organization_id } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_analyze_role_fit",
    {
      application_id: z.string(),
      verified_signals: z.array(z.string()).default([]),
      evidence_ids: z.array(z.string()).default([]),
      rationale: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({
      application_id,
      verified_signals,
      evidence_ids,
      rationale,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "application.analyze-fit",
          targetId: application_id,
          payload: {
            application_id,
            verified_signals,
            evidence_ids,
            ...(rationale ? { rationale } : {}),
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
      role_family: z.string().optional(),
      resume_ref: z.string().optional(),
      cover_message: z.string().optional(),
      portfolio_links: z.array(z.string()).default([]),
      repository_ids: z.array(z.string()).default([]),
      evidence_ids: z.array(z.string()).default([]),
      answers: z.array(careerAnswerInput).default([]),
      ...sharedCommandOptions,
    },
    async ({
      title,
      source_url,
      organization_id,
      role_family,
      resume_ref,
      cover_message,
      portfolio_links,
      repository_ids,
      evidence_ids,
      answers,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "application.prepare",
          payload: {
            title,
            source_url,
            ...(organization_id ? { organization_id } : {}),
            ...(role_family ? { role_family } : {}),
            ...(resume_ref ? { resume_ref } : {}),
            ...(cover_message ? { cover_message } : {}),
            portfolio_links,
            repository_ids,
            evidence_ids,
            answers,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_validate_application",
    {
      application_id: z.string(),
      ...sharedCommandOptions,
    },
    async ({ application_id, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "application.validate",
          targetId: application_id,
          payload: { application_id },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_prepare_application_submission",
    {
      application_id: z.string(),
      channel: z.string().optional(),
      message: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({ application_id, channel, message, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "application.prepare-submission",
          targetId: application_id,
          payload: {
            application_id,
            ...(channel ? { channel } : {}),
            ...(message ? { message } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_record_application_submission",
    {
      application_id: z.string(),
      prepared_action_id: z.string(),
      submitted_at: z.string().optional(),
      reference: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({
      application_id,
      prepared_action_id,
      submitted_at,
      reference,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "application.record-submission",
          targetId: application_id,
          payload: {
            application_id,
            prepared_action_id,
            ...(submitted_at ? { submitted_at } : {}),
            ...(reference ? { reference } : {}),
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
      policy: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({ application_id, follow_up_at, channel, message, policy, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "application.follow-up",
          targetId: application_id,
          payload: {
            application_id,
            follow_up_at,
            ...(channel ? { channel } : {}),
            ...(message ? { message } : {}),
            ...(policy ? { policy } : {}),
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
    "studio_build_application_interview_context",
    {
      application_id: z.string(),
      next_action: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({ application_id, next_action, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "application.interview-context",
          targetId: application_id,
          payload: {
            application_id,
            ...(next_action ? { next_action } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_record_application_outcome",
    {
      application_id: z.string(),
      outcome: z.enum(["rejected", "no-response", "withdrawn", "offered", "accepted"]),
      reason: z.string().optional(),
      learning_notes: z.string().optional(),
      sample_size: z.number().int().min(0).optional(),
      evidence_ids: z.array(z.string()).default([]),
      ...sharedCommandOptions,
    },
    async ({
      application_id,
      outcome,
      reason,
      learning_notes,
      sample_size,
      evidence_ids,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "application.record-outcome",
          targetId: application_id,
          payload: {
            application_id,
            outcome,
            ...(reason ? { reason } : {}),
            ...(learning_notes ? { learning_notes } : {}),
            ...(sample_size !== undefined ? { sample_size } : {}),
            evidence_ids,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_resolve_career_next_actions",
    {
      ...sharedCommandOptions,
    },
    async ({ dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "career.next-actions",
          payload: {},
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
