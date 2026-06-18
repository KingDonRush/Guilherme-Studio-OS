import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { ResultEnvelope } from "@guilherme-studio/schemas";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createProgram } from "../../cli/src/index.js";
import {
  createStudioCommand,
  createStudioContext,
  executeStudioCommand,
} from "../../core/src/index.js";
import { createLocalApi } from "../../local-api/src/index.js";
import { createStudioMcpServer } from "../../mcp/src/server.js";

describe("Studio interface equivalence", () => {
  afterEach(() => {
    process.exitCode = undefined;
    vi.restoreAllMocks();
  });

  it("keeps shared dry-run mutation envelopes equivalent across core, CLI, API and MCP", async () => {
    const root = await createConfiguredRoot();
    const context = await createStudioContext(root);
    const { app, token } = await createLocalApi({ root });
    const { client, close } = await connectMcp(root);

    try {
      for (const [index, entry] of INTERFACE_EQUIVALENCE_CASES.entries()) {
        const core = await executeStudioCommand(
          context,
          createStudioCommand(context, {
            command: entry.command,
            payload: entry.payload,
            ...(entry.targetId ? { targetId: entry.targetId } : {}),
            dryRun: true,
            idempotencyKey: `equivalence-core-${index}`,
          }),
        );
        const cli = await runCliJson([
          "--root",
          root,
          "--json",
          "--dry-run",
          "--idempotency-key",
          `equivalence-cli-${index}`,
          ...entry.cliArgs,
        ]);
        const apiResponse = await app.inject({
          method: "POST",
          url: "/api/v1/commands/dry-run",
          headers: {
            host: "127.0.0.1:47845",
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          payload: {
            command: entry.command,
            ...(entry.targetId ? { target_id: entry.targetId } : {}),
            idempotency_key: `equivalence-api-${index}`,
            payload: entry.payload,
          },
        });
        const api = apiResponse.json() as ResultEnvelope;
        const mcp = await callMcpJson(client, entry.mcpTool, {
          ...entry.mcpArgs,
          dry_run: true,
          idempotency_key: `equivalence-mcp-${index}`,
        });

        expect(normalizeDryRun(cli as ResultEnvelope), entry.command).toEqual(
          normalizeDryRun(core),
        );
        expect(normalizeDryRun(api), entry.command).toEqual(normalizeDryRun(core));
        expect(normalizeDryRun(mcp), entry.command).toEqual(normalizeDryRun(core));
      }
    } finally {
      await close();
      await app.close();
    }
  });
});

interface InterfaceEquivalenceCase {
  command: string;
  payload: Record<string, unknown>;
  targetId?: string;
  cliArgs: string[];
  mcpTool: string;
  mcpArgs: Record<string, unknown>;
}

const INTERFACE_EQUIVALENCE_CASES: InterfaceEquivalenceCase[] = [
  {
    command: "agent.start",
    payload: {
      objective: "Prove PRD 11 interface equivalence for AgentRun start.",
      owning_entity_ids: [],
      target_repository_ids: [],
      target_environment_ids: [],
      allowed: ["read_context", "run_tests"],
      confirmation_required: ["external_send"],
      prohibited: ["destructive_execute"],
      material: true,
    },
    cliArgs: [
      "agent",
      "start",
      "--objective",
      "Prove PRD 11 interface equivalence for AgentRun start.",
      "--allowed",
      "read_context",
      "run_tests",
      "--confirmation-required",
      "external_send",
      "--prohibited",
      "destructive_execute",
    ],
    mcpTool: "studio_start_agent_run",
    mcpArgs: {
      objective: "Prove PRD 11 interface equivalence for AgentRun start.",
      owning_entity_ids: [],
      target_repository_ids: [],
      target_environment_ids: [],
      allowed: ["read_context", "run_tests"],
      confirmation_required: ["external_send"],
      prohibited: ["destructive_execute"],
      material: true,
    },
  },
  {
    command: "entity.create",
    payload: {
      kind: "task",
      title: "Equivalent task",
      classification: "internal",
      summary: "Created through all PRD 11 surfaces.",
    },
    cliArgs: [
      "entity",
      "create",
      "task",
      "--title",
      "Equivalent task",
      "--summary",
      "Created through all PRD 11 surfaces.",
      "--classification",
      "internal",
    ],
    mcpTool: "studio_create_entity",
    mcpArgs: {
      kind: "task",
      title: "Equivalent task",
      classification: "internal",
      summary: "Created through all PRD 11 surfaces.",
    },
  },
  {
    command: "evidence.register",
    payload: {
      title: "Equivalent verification evidence",
      evidence_type: "command",
      command: "npm run verify",
      claims: ["Verification passed"],
      source_mutability: "operator-observed",
    },
    cliArgs: [
      "evidence",
      "register",
      "--title",
      "Equivalent verification evidence",
      "--type",
      "command",
      "--command",
      "npm run verify",
      "--claim",
      "Verification passed",
      "--source-mutability",
      "operator-observed",
    ],
    mcpTool: "studio_register_evidence",
    mcpArgs: {
      title: "Equivalent verification evidence",
      evidence_type: "command",
      command: "npm run verify",
      claims: ["Verification passed"],
      source_mutability: "operator-observed",
    },
  },
  {
    command: "action.prepare",
    payload: {
      action_type: "github.issue.create",
      payload: { title: "Equivalent prepared action" },
      ttl_seconds: 900,
    },
    cliArgs: [
      "action",
      "prepare",
      "github.issue.create",
      "--payload",
      '{"title":"Equivalent prepared action"}',
      "--ttl",
      "900",
    ],
    mcpTool: "studio_prepare_external_action",
    mcpArgs: {
      action_type: "github.issue.create",
      payload: { title: "Equivalent prepared action" },
      ttl_seconds: 900,
    },
  },
  {
    command: "action.confirm",
    payload: {
      action_id: "act_equivalent",
      payload_checksum: "0".repeat(64),
    },
    cliArgs: ["action", "confirm", "act_equivalent", "--checksum", "0".repeat(64)],
    mcpTool: "studio_confirm_prepared_action",
    mcpArgs: {
      action_id: "act_equivalent",
      payload_checksum: "0".repeat(64),
    },
  },
  {
    command: "action.reconcile",
    payload: {
      action_id: "act_equivalent",
      result: { ok: true },
    },
    cliArgs: ["action", "reconcile", "act_equivalent", "--result", '{"ok":true}'],
    mcpTool: "studio_reconcile_prepared_action",
    mcpArgs: {
      action_id: "act_equivalent",
      result: { ok: true },
    },
  },
  {
    command: "crm.review-duplicates",
    payload: {
      kind: "prospect",
      title: "Equivalent prospect",
      email: "lead@example.com",
      website: "https://example.com",
    },
    cliArgs: [
      "crm",
      "review-duplicates",
      "--kind",
      "prospect",
      "--title",
      "Equivalent prospect",
      "--email",
      "lead@example.com",
      "--website",
      "https://example.com",
    ],
    mcpTool: "studio_review_duplicates",
    mcpArgs: {
      kind: "prospect",
      title: "Equivalent prospect",
      email: "lead@example.com",
      website: "https://example.com",
    },
  },
  {
    command: "prospect.qualify",
    targetId: "prospect_equivalent",
    payload: {
      rationale: "Equivalent qualification rationale.",
      score: 75,
      qualified: true,
    },
    cliArgs: [
      "prospect",
      "qualify",
      "prospect_equivalent",
      "--rationale",
      "Equivalent qualification rationale.",
      "--score",
      "75",
    ],
    mcpTool: "studio_qualify_prospect",
    mcpArgs: {
      prospect_id: "prospect_equivalent",
      rationale: "Equivalent qualification rationale.",
      score: 75,
      qualified: true,
    },
  },
  {
    command: "proposal.prepare",
    payload: {
      opportunity_id: "opp_equivalent",
      title: "Equivalent proposal",
    },
    cliArgs: ["proposal", "prepare", "opp_equivalent", "--title", "Equivalent proposal"],
    mcpTool: "studio_prepare_proposal",
    mcpArgs: {
      opportunity_id: "opp_equivalent",
      title: "Equivalent proposal",
    },
  },
  {
    command: "opportunity.convert",
    payload: {
      opportunity_id: "opp_equivalent",
      client_title: "Equivalent client",
      engagement_title: "Equivalent engagement",
    },
    cliArgs: [
      "opportunity",
      "convert",
      "opp_equivalent",
      "--client-title",
      "Equivalent client",
      "--engagement-title",
      "Equivalent engagement",
    ],
    mcpTool: "studio_convert_opportunity",
    mcpArgs: {
      opportunity_id: "opp_equivalent",
      client_title: "Equivalent client",
      engagement_title: "Equivalent engagement",
    },
  },
  {
    command: "engagement.create-from-opportunity",
    payload: {
      opportunity_id: "opp_equivalent",
      title: "Equivalent engagement",
    },
    cliArgs: [
      "engagement",
      "create-from-opportunity",
      "opp_equivalent",
      "--title",
      "Equivalent engagement",
    ],
    mcpTool: "studio_create_engagement_from_opportunity",
    mcpArgs: {
      opportunity_id: "opp_equivalent",
      title: "Equivalent engagement",
    },
  },
  {
    command: "deliverable.complete",
    targetId: "del_equivalent",
    payload: {
      deliverable_id: "del_equivalent",
      evidence_ids: ["evd_equivalent"],
    },
    cliArgs: ["deliverable", "complete", "del_equivalent", "--evidence", "evd_equivalent"],
    mcpTool: "studio_complete_deliverable",
    mcpArgs: {
      deliverable_id: "del_equivalent",
      evidence_ids: ["evd_equivalent"],
    },
  },
  {
    command: "contract.create-from-engagement",
    payload: {
      engagement_id: "eng_equivalent",
      title: "Equivalent contract",
      value_minor: 10000,
      currency: "USD",
    },
    cliArgs: [
      "contract",
      "create-from-engagement",
      "eng_equivalent",
      "--title",
      "Equivalent contract",
      "--value-minor",
      "10000",
      "--currency",
      "USD",
    ],
    mcpTool: "studio_create_contract_from_engagement",
    mcpArgs: {
      engagement_id: "eng_equivalent",
      title: "Equivalent contract",
      value_minor: 10000,
      currency: "USD",
    },
  },
  {
    command: "invoice.create-for-contract",
    payload: {
      contract_id: "con_equivalent",
      amount_minor: 10000,
      currency: "USD",
      title: "Equivalent invoice",
      due_at: "2026-07-01T12:00:00.000Z",
      reference: "equivalent-reference",
    },
    cliArgs: [
      "invoice",
      "create-for-contract",
      "con_equivalent",
      "--amount-minor",
      "10000",
      "--currency",
      "USD",
      "--title",
      "Equivalent invoice",
      "--due-at",
      "2026-07-01T12:00:00.000Z",
      "--reference",
      "equivalent-reference",
    ],
    mcpTool: "studio_create_invoice_for_contract",
    mcpArgs: {
      contract_id: "con_equivalent",
      amount_minor: 10000,
      currency: "USD",
      title: "Equivalent invoice",
      due_at: "2026-07-01T12:00:00.000Z",
      reference: "equivalent-reference",
    },
  },
  {
    command: "payment.record-for-invoice",
    payload: {
      invoice_id: "inv_equivalent",
      amount_minor: 10000,
      currency: "USD",
      title: "Equivalent payment",
      expected_at: "2026-07-02T12:00:00.000Z",
    },
    cliArgs: [
      "payment",
      "record-for-invoice",
      "inv_equivalent",
      "--amount-minor",
      "10000",
      "--currency",
      "USD",
      "--title",
      "Equivalent payment",
      "--expected-at",
      "2026-07-02T12:00:00.000Z",
    ],
    mcpTool: "studio_record_payment_for_invoice",
    mcpArgs: {
      invoice_id: "inv_equivalent",
      amount_minor: 10000,
      currency: "USD",
      title: "Equivalent payment",
      expected_at: "2026-07-02T12:00:00.000Z",
    },
  },
  {
    command: "content.prepare",
    payload: {
      campaign_id: "cmp_equivalent",
      title: "Equivalent content",
      channel: "linkedin",
      publish_at: "2026-07-03T12:00:00.000Z",
      public_claims: [],
      evidence_ids: [],
    },
    cliArgs: [
      "campaign",
      "prepare-content",
      "cmp_equivalent",
      "--title",
      "Equivalent content",
      "--channel",
      "linkedin",
      "--publish-at",
      "2026-07-03T12:00:00.000Z",
    ],
    mcpTool: "studio_prepare_content",
    mcpArgs: {
      campaign_id: "cmp_equivalent",
      title: "Equivalent content",
      channel: "linkedin",
      publish_at: "2026-07-03T12:00:00.000Z",
      public_claims: [],
      evidence_ids: [],
    },
  },
  {
    command: "case.create-from-evidence",
    payload: {
      evidence_id: "evd_equivalent",
      title: "Equivalent case",
      summary: "Equivalent case summary.",
      case_url: "https://example.com/case",
    },
    cliArgs: [
      "case",
      "create-from-evidence",
      "--evidence",
      "evd_equivalent",
      "--title",
      "Equivalent case",
      "--summary",
      "Equivalent case summary.",
      "--url",
      "https://example.com/case",
    ],
    mcpTool: "studio_create_case_from_evidence",
    mcpArgs: {
      evidence_id: "evd_equivalent",
      title: "Equivalent case",
      summary: "Equivalent case summary.",
      case_url: "https://example.com/case",
    },
  },
  {
    command: "handoff.create",
    payload: {
      task_id: "tsk_equivalent",
      title: "Equivalent handoff",
      objective: "Continue PRD 11 interface verification.",
      summary: "Equivalent handoff summary.",
      repository_ids: [],
    },
    cliArgs: [
      "agentRun",
      "handoff",
      "--task",
      "tsk_equivalent",
      "--title",
      "Equivalent handoff",
      "--objective",
      "Continue PRD 11 interface verification.",
      "--summary",
      "Equivalent handoff summary.",
    ],
    mcpTool: "studio_create_handoff",
    mcpArgs: {
      task_id: "tsk_equivalent",
      title: "Equivalent handoff",
      objective: "Continue PRD 11 interface verification.",
      summary: "Equivalent handoff summary.",
      repository_ids: [],
    },
  },
  {
    command: "decision.record",
    payload: {
      title: "Equivalent interface decision",
      decision: "Shared mutations stay behind Studio Core.",
      rationale: "PRD 11 requires matching interface outcomes.",
      alternatives: [],
      contradiction_ids: [],
      evidence_ids: [],
    },
    cliArgs: [
      "decision",
      "record",
      "--title",
      "Equivalent interface decision",
      "--decision",
      "Shared mutations stay behind Studio Core.",
      "--rationale",
      "PRD 11 requires matching interface outcomes.",
    ],
    mcpTool: "studio_record_decision",
    mcpArgs: {
      title: "Equivalent interface decision",
      decision: "Shared mutations stay behind Studio Core.",
      rationale: "PRD 11 requires matching interface outcomes.",
      alternatives: [],
      contradiction_ids: [],
      evidence_ids: [],
    },
  },
];

async function createConfiguredRoot(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "studio-interface-equivalence-"));
  await writeFile(
    path.join(root, "studio.config.yaml"),
    [
      "api_version: studio.guilherme.dev/config-v1",
      "root_name: Interface equivalence test",
      "operator_id: per_20260614_guilherme-silva",
      "canonical_roots:",
      "  - operations",
      "  - data",
      "runtime_path: runtime",
      "panel:",
      "  host: 127.0.0.1",
      "  port: 47845",
      "adapters: {}",
      "",
    ].join("\n"),
  );
  return root;
}

async function runCliJson(args: string[]): Promise<Record<string, unknown>> {
  const logs: string[] = [];
  const log = vi.spyOn(console, "log").mockImplementation((value: unknown) => {
    logs.push(typeof value === "string" ? value : JSON.stringify(value));
  });
  try {
    const program = createProgram();
    program.exitOverride();
    await program.parseAsync(["node", "studio", ...args], { from: "node" });
    const last = logs.at(-1);
    if (!last) {
      throw new Error("CLI produced no JSON output.");
    }
    return JSON.parse(last) as Record<string, unknown>;
  } finally {
    log.mockRestore();
  }
}

function normalizeDryRun(envelope: ResultEnvelope): unknown {
  return {
    status: envelope.status,
    result: envelope.result,
    warnings: envelope.warnings,
    required_actions: envelope.required_actions,
  };
}

async function connectMcp(root: string): Promise<{ client: Client; close: () => Promise<void> }> {
  const server = await createStudioMcpServer(root);
  const client = new Client({ name: "studio-equivalence-test", version: "1.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return {
    client,
    close: async () => {
      await client.close();
      await server.close();
    },
  };
}

async function callMcpJson(
  client: Client,
  name: string,
  args: Record<string, unknown>,
): Promise<ResultEnvelope> {
  const result = await client.callTool({ name, arguments: args });
  const content = Array.isArray(result.content) ? result.content[0] : undefined;
  if (!content || typeof content !== "object" || !("text" in content)) {
    throw new Error(`MCP tool ${name} did not return text content`);
  }
  const text = Reflect.get(content, "text");
  if (typeof text !== "string") {
    throw new Error(`MCP tool ${name} text content is invalid`);
  }
  return JSON.parse(text) as ResultEnvelope;
}
