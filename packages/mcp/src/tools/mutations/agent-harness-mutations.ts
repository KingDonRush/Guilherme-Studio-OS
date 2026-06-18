import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { executeMcpCommand } from "../../command.js";
import { jsonContent } from "../../responses.js";

export function registerAgentHarnessMutationTools(server: McpServer, root: string): void {
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
      classification: z.enum(["public", "internal", "confidential", "secret"]).optional(),
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
      classification,
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
            ...(classification ? { classification } : {}),
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
