import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { executeMcpCommand } from "../../command.js";
import { jsonContent } from "../../responses.js";

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

export function registerCareerMutationTools(server: McpServer, root: string): void {
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
}
