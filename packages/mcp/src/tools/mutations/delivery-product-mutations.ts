import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { executeMcpCommand } from "../../command.js";
import { jsonContent } from "../../responses.js";

const sharedCommandOptions = {
  dry_run: z.boolean().default(false),
  idempotency_key: z.string().optional(),
};

export function registerDeliveryProductMutationTools(server: McpServer, root: string): void {
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
}
