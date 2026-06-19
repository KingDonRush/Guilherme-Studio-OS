import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { executeMcpCommand } from "../../command.js";
import { jsonContent } from "../../responses.js";

const sharedCommandOptions = {
  dry_run: z.boolean().default(false),
  idempotency_key: z.string().optional(),
};

export function registerGovernanceMutationTools(server: McpServer, root: string): void {
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
}
