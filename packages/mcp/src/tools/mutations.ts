import { kindFromAlias } from "@guilherme-studio/core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { executeMcpCommand } from "../command.js";
import { jsonContent } from "../responses.js";
import { registerAgentHarnessMutationTools } from "./mutations/agent-harness-mutations.js";
import { registerCareerMutationTools } from "./mutations/career-mutations.js";
import { registerDeliveryProductMutationTools } from "./mutations/delivery-product-mutations.js";
import { registerEntityActionMutationTools } from "./mutations/entity-action-mutations.js";
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
  registerDeliveryProductMutationTools(server, root);
  registerEntityActionMutationTools(server, root);
  registerFinanceMutationTools(server, root);
  registerGovernanceMutationTools(server, root);
  registerSalesMutationTools(server, root);

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
}
