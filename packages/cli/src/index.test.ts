import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  createStudioCommand,
  createStudioContext,
  executeStudioCommand,
} from "@guilherme-studio/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import YAML from "yaml";
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
});

async function runCliJson(args: string[]): Promise<Record<string, unknown>> {
  const logs: string[] = [];
  vi.spyOn(console, "log").mockImplementation((value: unknown) => {
    logs.push(typeof value === "string" ? value : JSON.stringify(value));
  });
  const program = createProgram();
  program.exitOverride();
  await program.parseAsync(["node", "studio", ...args], { from: "node" });
  const last = logs.at(-1);
  if (!last) {
    throw new Error("CLI produced no JSON output.");
  }
  return JSON.parse(last) as Record<string, unknown>;
}

async function createCliFixtureRoot(prefix: string): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), prefix));
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
