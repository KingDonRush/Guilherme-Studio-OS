import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  createStudioCommand,
  createStudioContext,
  executeStudioCommand,
} from "@guilherme-studio/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import YAML from "yaml";
import { STUDIO_COMMAND_REGISTRY } from "../../core/src/commands/registry.js";
import { createProgram } from "./index.js";

describe("Studio CLI", () => {
  afterEach(() => {
    process.exitCode = undefined;
    vi.restoreAllMocks();
  });

  it("keeps CLI dry-run envelopes equivalent to the core command runtime", async () => {
    const root = await createCliFixtureRoot("studio-cli-equivalence-");
    const context = await createStudioContext(root);
    const core = await executeStudioCommand(
      context,
      createStudioCommand(context, {
        command: "entity.create",
        payload: { kind: "task", title: "CLI equivalent task" },
        dryRun: true,
        idempotencyKey: "cli-equivalence-core",
      }),
    );
    const cli = await runCliJson([
      "--root",
      root,
      "--json",
      "--dry-run",
      "--idempotency-key",
      "cli-equivalence-cli",
      "entity",
      "create",
      "task",
      "--title",
      "CLI equivalent task",
    ]);

    expect(cli).toMatchObject({
      status: core.status,
      result: {
        dry_run: true,
        command: "entity.create",
        payload: { kind: "task", title: "CLI equivalent task", classification: "internal" },
      },
    });
  });

  it("executes a selected workflow fixture through the CLI", async () => {
    const root = await createCliFixtureRoot("studio-cli-workflow-");
    const result = await runCliJson([
      "--root",
      root,
      "--json",
      "workflow",
      "--fixtures",
      "--execute",
      "--workflow",
      "agent-handoff",
    ]);

    expect(result).toMatchObject({
      ok: true,
      mode: "executed-fixtures",
      workflows: [expect.objectContaining({ id: "agent-handoff", ok: true })],
    });
  });

  it("exposes the agent harness start command as a CLI fallback", async () => {
    const root = await createCliFixtureRoot("studio-cli-agent-");
    const result = await runCliJson([
      "--root",
      root,
      "--json",
      "--dry-run",
      "agent",
      "start",
      "--objective",
      "Run the harness loop from CLI.",
      "--allowed",
      "read_context",
      "run_tests",
      "--prohibited",
      "external_send",
    ]);

    expect(result).toMatchObject({
      status: "ok",
      result: {
        dry_run: true,
        command: "agent.start",
        payload: {
          objective: "Run the harness loop from CLI.",
          allowed: ["read_context", "run_tests"],
          prohibited: ["external_send"],
        },
      },
    });
  });

  it("exposes knowledge routing as a CLI fallback", async () => {
    const root = await createCliFixtureRoot("studio-cli-knowledge-");
    const result = await runCliJson([
      "--root",
      root,
      "--json",
      "--dry-run",
      "knowledge",
      "route",
      "--title",
      "CLI route",
      "--content",
      "Route this note to a temporary holding lane.",
      "--destination",
      "temporary_note",
    ]);

    expect(result).toMatchObject({
      status: "ok",
      result: {
        dry_run: true,
        command: "knowledge.route",
        payload: {
          title: "CLI route",
          content: "Route this note to a temporary holding lane.",
          destination: "temporary_note",
        },
      },
    });
  });

  it("passes explicit panel and MCP smoke results into acceptance", async () => {
    const root = await createCliFixtureRoot("studio-cli-acceptance-");
    const result = await runCliJson([
      "--root",
      root,
      "--json",
      "acceptance",
      "--panel-smoke-ok",
      "--mcp-smoke-ok",
    ]);
    const envelope = result as {
      result: {
        checks: Array<{ name: string; status: string }>;
      };
    };

    expect(envelope.result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "panel_smoke", status: "pass" }),
        expect.objectContaining({ name: "mcp_smoke", status: "pass" }),
      ]),
    );
  });

  it("keeps every registered semantic command available as a dry-run JSON CLI fallback", async () => {
    const root = await createCliFixtureRoot("studio-cli-matrix-");
    const coveredCommands = new Set(MUTABLE_CLI_DRY_RUN_CASES.map((entry) => entry.command));

    expect([...coveredCommands].sort()).toEqual(Object.keys(STUDIO_COMMAND_REGISTRY).sort());

    for (const [index, entry] of MUTABLE_CLI_DRY_RUN_CASES.entries()) {
      const result = await runCliJsonWithExit([
        "--root",
        root,
        "--json",
        "--dry-run",
        "--idempotency-key",
        `cli-matrix-${index}-${entry.command}`,
        ...entry.args,
      ]);

      expect(result.exitCode, entry.command).toBe(0);
      expect(result.output, entry.command).toMatchObject({
        status: "ok",
        result: {
          dry_run: true,
          command: entry.command,
        },
      });
    }
  });

  it("replays CLI idempotency keys and rejects conflicting reuse with a stable exit code", async () => {
    const root = await createCliFixtureRoot("studio-cli-idempotency-");
    const args = [
      "--root",
      root,
      "--json",
      "--idempotency-key",
      "cli-idempotency-replay",
      "entity",
      "create",
      "task",
      "--title",
      "Replayable task",
    ];
    const first = await runCliJsonWithExit(args);
    const second = await runCliJsonWithExit(args);
    const conflict = await runCliJsonWithExit([
      "--root",
      root,
      "--json",
      "--idempotency-key",
      "cli-idempotency-replay",
      "entity",
      "create",
      "task",
      "--title",
      "Different task",
    ]);

    expect(first.exitCode).toBe(0);
    expect(second.exitCode).toBe(0);
    expect(entityResultId(second.output)).toBe(entityResultId(first.output));
    expect(conflict.exitCode).toBe(6);
    expect(conflict.output).toMatchObject({
      status: "conflict",
      error: { code: "idempotency_conflict" },
    });
  });

  it("enforces expected revision and invalid revision input with stable exit codes", async () => {
    const root = await createCliFixtureRoot("studio-cli-expected-revision-");
    const created = await runCliJsonWithExit([
      "--root",
      root,
      "--json",
      "entity",
      "create",
      "task",
      "--title",
      "Revision guarded task",
    ]);
    const entityId = entityResultId(created.output);
    const updated = await runCliJsonWithExit([
      "--root",
      root,
      "--json",
      "--expected-revision",
      "1",
      "entity",
      "transition",
      entityId,
      "waiting",
    ]);
    const conflict = await runCliJsonWithExit([
      "--root",
      root,
      "--json",
      "--expected-revision",
      "1",
      "entity",
      "transition",
      entityId,
      "active",
    ]);
    const invalid = await runCliJsonWithExit([
      "--root",
      root,
      "--json",
      "--expected-revision",
      "1.5",
      "entity",
      "transition",
      entityId,
      "active",
    ]);

    expect(created.exitCode).toBe(0);
    expect(updated).toMatchObject({
      exitCode: 0,
      output: { status: "ok", result: { revision: 2 } },
    });
    expect(conflict).toMatchObject({
      exitCode: 6,
      output: { status: "conflict", error: { code: "revision_conflict" } },
    });
    expect(invalid).toMatchObject({
      exitCode: 2,
      output: { status: "error", error: { code: "invalid_input" } },
    });
  });

  it("keeps bespoke operational dry-run commands safe and machine-readable", async () => {
    const root = await createCliFixtureRoot("studio-cli-operational-dry-run-");

    const cases: Array<{
      name: string;
      args: string[];
      expected: Record<string, unknown>;
    }> = [
      {
        name: "bootstrap-vertical",
        args: ["--dry-run", "bootstrap-vertical"],
        expected: { dryRun: true },
      },
      {
        name: "backup",
        args: ["--dry-run", "backup"],
        expected: { dryRun: true, includes: expect.any(Array) },
      },
      {
        name: "wordpress.fix-ownership",
        args: ["--dry-run", "wordpress", "fix-ownership", "wordpress"],
        expected: { dryRun: true },
      },
      {
        name: "wordpress.backup-db",
        args: ["--dry-run", "wordpress", "backup-db"],
        expected: { dryRun: true, action: "wordpress.backup-db" },
      },
      {
        name: "wordpress.backup-uploads",
        args: ["--dry-run", "wordpress", "backup-uploads"],
        expected: { dryRun: true, action: "wordpress.backup-uploads" },
      },
      {
        name: "wordpress.provision",
        args: [
          "--dry-run",
          "wordpress",
          "provision",
          "--site-path",
          "wordpress-smoke",
          "--template-path",
          "wordpress",
        ],
        expected: {
          dryRun: true,
          sitePath: path.join(root, "wordpress-smoke"),
          templatePath: path.join(root, "wordpress"),
        },
      },
      {
        name: "wordpress.restore-check",
        args: ["--dry-run", "wordpress", "restore-check", "backups/database.sql"],
        expected: {
          dryRun: true,
          action: "wordpress.restore-check",
          sqlPath: "backups/database.sql",
        },
      },
      {
        name: "wordpress.restore-check-uploads",
        args: ["--dry-run", "wordpress", "restore-check-uploads", "backups/uploads.tar.gz"],
        expected: {
          dryRun: true,
          action: "wordpress.restore-check-uploads",
          archivePath: "backups/uploads.tar.gz",
        },
      },
      {
        name: "asset.optimize",
        args: [
          "--dry-run",
          "asset",
          "optimize",
          "--source",
          "runtime/assets/sources",
          "--output",
          "docs/assets/generated",
          "--manifest",
          "docs/assets/generated/asset-manifest.json",
        ],
        expected: {
          apiVersion: "studio.guilherme.dev/assets-v1",
          quality: 82,
          maxWidth: 2400,
          assets: [],
        },
      },
    ];

    for (const entry of cases) {
      const result = await runCliJsonWithExit(["--root", root, "--json", ...entry.args]);

      expect(result.exitCode, entry.name).toBe(0);
      expect(result.output, entry.name).toMatchObject(entry.expected);
    }
  });

  it("keeps external adapter prepares blocked by default and fake-local without sends", async () => {
    const root = await createCliFixtureRoot("studio-cli-external-adapters-");
    const blockedGithub = await runCliJsonWithExit([
      "--root",
      root,
      "--json",
      "github",
      "prepare",
      "--operation",
      "issue.create",
      "--payload",
      '{"title":"Blocked issue"}',
    ]);
    const blockedCommunication = await runCliJsonWithExit([
      "--root",
      root,
      "--json",
      "communication-adapter",
      "prepare",
      "--operation",
      "message.send",
      "--payload",
      '{"body":"Blocked message"}',
    ]);
    const fakeGithub = await runCliJsonWithExit([
      "--root",
      root,
      "--json",
      "github",
      "prepare",
      "--provider",
      "fake",
      "--enable-fake",
      "--operation",
      "issue.create",
      "--payload",
      '{"title":"Local issue"}',
    ]);
    const fakeCommunication = await runCliJsonWithExit([
      "--root",
      root,
      "--json",
      "communication-adapter",
      "prepare",
      "--provider",
      "fake",
      "--enable-fake",
      "--operation",
      "message.send",
      "--payload",
      '{"body":"Local message"}',
    ]);

    expect(blockedGithub).toMatchObject({
      exitCode: 7,
      output: {
        adapter: "github",
        status: "blocked",
        error: { code: "adapter_disabled" },
        data: { enabled: false, payload_keys: ["title"] },
      },
    });
    expect(blockedCommunication).toMatchObject({
      exitCode: 7,
      output: {
        adapter: "communication",
        status: "blocked",
        error: { code: "adapter_disabled" },
        data: { enabled: false, payload_keys: ["body"] },
      },
    });
    expect(fakeGithub).toMatchObject({
      exitCode: 0,
      output: {
        adapter: "github",
        status: "warning",
        data: {
          provider: "fake",
          external_send: false,
          prepared_action_id: expect.any(String),
          prepared_action_status: "awaiting_confirmation",
          payload_checksum: expect.any(String),
        },
      },
    });
    expect(fakeCommunication).toMatchObject({
      exitCode: 0,
      output: {
        adapter: "communication",
        status: "warning",
        data: {
          provider: "fake",
          external_send: false,
          prepared_action_id: expect.any(String),
          prepared_action_status: "awaiting_confirmation",
          payload_checksum: expect.any(String),
        },
      },
    });
  });
});

async function runCliJson(args: string[]): Promise<Record<string, unknown>> {
  return (await runCliJsonWithExit(args)).output;
}

async function runCliJsonWithExit(args: string[]): Promise<{
  output: Record<string, unknown>;
  exitCode: number;
}> {
  process.exitCode = undefined;
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
    return {
      output: JSON.parse(last) as Record<string, unknown>,
      exitCode: typeof process.exitCode === "number" ? process.exitCode : 0,
    };
  } finally {
    log.mockRestore();
  }
}

function entityResultId(output: { result?: unknown }): string {
  const result = output.result as { entity_id?: unknown };
  if (typeof result.entity_id !== "string") {
    throw new Error(`CLI result did not include entity_id: ${JSON.stringify(output)}`);
  }
  return result.entity_id;
}

const FUTURE = "2026-06-18T00:00:00.000Z";

const MUTABLE_CLI_DRY_RUN_CASES: Array<{ command: string; args: string[] }> = [
  { command: "crm.review-duplicates", args: ["crm", "review-duplicates", "--title", "Acme"] },
  {
    command: "prospect.qualify",
    args: ["prospect", "qualify", "pro_fake", "--rationale", "Good fit", "--score", "80"],
  },
  {
    command: "communication.prepare",
    args: [
      "communication",
      "prepare",
      "--subject",
      "pro_fake",
      "--channel",
      "linkedin",
      "--message",
      "Hello",
    ],
  },
  { command: "entity.create", args: ["entity", "create", "task", "--title", "Matrix task"] },
  { command: "entity.transition", args: ["entity", "transition", "tsk_fake", "waiting"] },
  { command: "entity.archive", args: ["entity", "archive", "tsk_fake"] },
  {
    command: "entity.relate",
    args: [
      "entity",
      "relate",
      "tsk_fake",
      "--type",
      "supports",
      "--target",
      "evd_fake",
      "--note",
      "Matrix relation",
    ],
  },
  { command: "proposal.prepare", args: ["proposal", "prepare", "opp_fake"] },
  { command: "opportunity.convert", args: ["opportunity", "convert", "opp_fake"] },
  {
    command: "engagement.create-from-opportunity",
    args: ["engagement", "create-from-opportunity", "opp_fake"],
  },
  {
    command: "deliverable.complete",
    args: ["deliverable", "complete", "del_fake", "--evidence", "evd_fake"],
  },
  {
    command: "project.register-repo",
    args: [
      "project",
      "register-repo",
      "prj_fake",
      "--title",
      "Repository",
      "--path",
      "products/example",
      "--branch",
      "main",
      "--remote-policy",
      "no-remote-in-v1",
    ],
  },
  {
    command: "evidence.register",
    args: [
      "evidence",
      "register",
      "--title",
      "Command evidence",
      "--type",
      "command",
      "--command",
      "npm test",
      "--claim",
      "Tests passed",
    ],
  },
  {
    command: "action.prepare",
    args: ["action", "prepare", "external.test", "--payload", '{"ok":true}'],
  },
  {
    command: "action.confirm",
    args: ["action", "confirm", "act_fake", "--checksum", "a".repeat(64)],
  },
  {
    command: "action.reconcile",
    args: ["action", "reconcile", "act_fake", "--result", '{"ok":true}'],
  },
  {
    command: "release.prepare",
    args: [
      "product",
      "prepare-release",
      "prd_fake",
      "--version",
      "1.0.0",
      "--changelog",
      "Matrix changelog",
      "--compatibility",
      "Compatible",
      "--migration",
      "None",
      "--public-api-note",
      "No break",
      "--test",
      "npm run verify",
      "--asset",
      "ast_fake",
      "--package",
      "dist/plugin.zip",
      "--roadmap-claim",
      "Future claim",
      "--implemented",
      "Current capability",
    ],
  },
  {
    command: "release.publish",
    args: ["release", "publish", "rel_fake", "--evidence", "evd_fake"],
  },
  {
    command: "content.prepare",
    args: ["campaign", "prepare-content", "cmp_fake", "--title", "Post", "--publish-at", FUTURE],
  },
  {
    command: "application.prepare",
    args: [
      "application",
      "prepare",
      "--title",
      "LinkedIn role",
      "--source",
      "https://linkedin.com/jobs/view/1",
    ],
  },
  {
    command: "career.record-strategy",
    args: ["career", "record-strategy", "--role-family", "WordPress Developer"],
  },
  {
    command: "career.next-actions",
    args: ["career", "next-actions"],
  },
  {
    command: "application.register-opportunity",
    args: [
      "application",
      "register-opportunity",
      "--title",
      "LinkedIn role",
      "--source",
      "https://linkedin.com/jobs/view/1",
      "--requirement",
      "Elementor",
    ],
  },
  {
    command: "application.review-duplicates",
    args: ["application", "review-duplicates", "--source", "https://linkedin.com/jobs/view/1"],
  },
  {
    command: "application.analyze-fit",
    args: ["application", "analyze-fit", "app_fake", "--signal", "Elementor"],
  },
  {
    command: "application.validate",
    args: ["application", "validate", "app_fake"],
  },
  {
    command: "application.prepare-submission",
    args: ["application", "prepare-submission", "app_fake", "--channel", "linkedin"],
  },
  {
    command: "application.record-submission",
    args: ["application", "record-submission", "app_fake", "--prepared-action", "act_fake"],
  },
  {
    command: "application.follow-up",
    args: ["application", "follow-up", "app_fake", "--at", FUTURE],
  },
  {
    command: "application.record-interview",
    args: ["application", "record-interview", "app_fake", "--at", FUTURE],
  },
  {
    command: "application.interview-context",
    args: ["application", "interview-context", "app_fake"],
  },
  {
    command: "application.record-outcome",
    args: ["application", "record-outcome", "app_fake", "--outcome", "rejected"],
  },
  {
    command: "contract.create-from-engagement",
    args: [
      "contract",
      "create-from-engagement",
      "eng_fake",
      "--value-minor",
      "10000",
      "--currency",
      "USD",
    ],
  },
  {
    command: "contract.register-terms",
    args: [
      "contract",
      "register-terms",
      "con_fake",
      "--total-minor",
      "10000",
      "--currency",
      "USD",
      "--installments-json",
      '[{"title":"Milestone","amount_minor":10000}]',
    ],
  },
  {
    command: "contract.register-details",
    args: [
      "contract",
      "register-details",
      "con_fake",
      "--obligations-json",
      '[{"text":"Deliver package","source_ref":"contract.section.delivery"}]',
    ],
  },
  {
    command: "invoice.create-for-contract",
    args: [
      "invoice",
      "create-for-contract",
      "con_fake",
      "--amount-minor",
      "10000",
      "--currency",
      "USD",
    ],
  },
  {
    command: "invoice.issue",
    args: ["invoice", "issue", "inv_fake", "--evidence", "evd_fake"],
  },
  {
    command: "invoice.update-lifecycle",
    args: [
      "invoice",
      "update-lifecycle",
      "inv_fake",
      "--stage",
      "partially_paid",
      "--paid-amount-minor",
      "5000",
    ],
  },
  {
    command: "payment.record-for-invoice",
    args: [
      "payment",
      "record-for-invoice",
      "inv_fake",
      "--amount-minor",
      "10000",
      "--currency",
      "USD",
    ],
  },
  {
    command: "payment.confirm",
    args: ["payment", "confirm", "pay_fake", "--evidence", "evd_fake"],
  },
  {
    command: "payment.reconcile",
    args: ["payment", "reconcile", "pay_fake", "--reference", "bank-ref", "--evidence", "evd_fake"],
  },
  {
    command: "payment.prepare-reminder",
    args: ["payment", "prepare-reminder", "inv_fake", "--message", "Reminder"],
  },
  {
    command: "finance.resolve-obligations",
    args: ["finance", "resolve-obligations", "--contract", "con_fake"],
  },
  {
    command: "finance.reconciliation-report",
    args: ["finance", "reconciliation-report"],
  },
  {
    command: "finance.obligation-calendar",
    args: ["finance", "obligation-calendar"],
  },
  {
    command: "finance.economic-view",
    args: ["finance", "economic-view", "--include-note"],
  },
  { command: "agent.start", args: ["agent", "start", "--objective", "Run matrix fallback"] },
  { command: "agent.context", args: ["agent", "context", "run_fake", "--next-action", "Continue"] },
  {
    command: "agent.authorize",
    args: ["agent", "authorize", "run_fake", "--allowed", "read_context"],
  },
  {
    command: "agent.observe",
    args: ["agent", "observe", "run_fake", "--source", "code", "--summary", "Observed"],
  },
  {
    command: "agent.record-action",
    args: ["agent", "record-action", "run_fake", "--action", "Run tests"],
  },
  {
    command: "agent.record-evidence",
    args: ["agent", "record-evidence", "run_fake", "--evidence", "evd_fake"],
  },
  { command: "agent.verify", args: ["agent", "verify", "run_fake", "--status", "passed"] },
  {
    command: "agent.handoff",
    args: ["agent", "handoff", "run_fake", "--summary", "Ready", "--next-action", "Continue"],
  },
  { command: "agent.close", args: ["agent", "close", "run_fake"] },
  {
    command: "knowledge.route",
    args: [
      "knowledge",
      "route",
      "--title",
      "Note",
      "--content",
      "Keep this.",
      "--destination",
      "temporary_note",
    ],
  },
  {
    command: "case.create-from-evidence",
    args: ["case", "create-from-evidence", "--evidence", "evd_fake", "--title", "Case"],
  },
  {
    command: "decision.record",
    args: ["decision", "record", "--title", "Decision", "--decision", "Use the CLI fallback"],
  },
  {
    command: "decision.amend",
    args: ["decision", "amend", "dec_fake", "--decision", "Updated decision"],
  },
  {
    command: "learning.propose",
    args: [
      "agent",
      "propose-learning",
      "--title",
      "Learning",
      "--failure-class",
      "missed_context",
      "--proposal",
      "Add a checklist",
      "--destination",
      "workflow",
    ],
  },
  {
    command: "handoff.create",
    args: [
      "agentRun",
      "handoff",
      "--task",
      "tsk_fake",
      "--title",
      "Handoff",
      "--objective",
      "Continue safely",
      "--summary",
      "Ready",
    ],
  },
];

async function createCliFixtureRoot(prefix: string): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), prefix));
  await mkdir(path.join(root, "data"), { recursive: true });
  await mkdir(path.join(root, "operations"), { recursive: true });
  await mkdir(path.join(root, "wordpress"), { recursive: true });
  await mkdir(path.join(root, "runtime", "assets", "sources"), { recursive: true });
  await mkdir(path.join(root, "backups"), { recursive: true });
  await writeFile(
    path.join(root, "studio.config.yaml"),
    YAML.stringify({
      api_version: "studio.guilherme.dev/config-v1",
      root_name: "CLI fixture",
      operator_id: "per_20260614_guilherme-silva",
      canonical_roots: ["operations", "data"],
      runtime_path: "runtime",
      panel: { host: "127.0.0.1", port: 47840 },
      adapters: {},
    }),
  );
  return root;
}
