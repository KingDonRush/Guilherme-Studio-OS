import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { createStudioContext, PreparedActionService } from "@guilherme-studio/core";
import { describe, expect, it } from "vitest";
import {
  createExternalAdapterProvider,
  createStudioBackup,
  executeDisabledExternalAdapter,
  inspectGitRepository,
  prepareExternalAdapterAction,
  provisionWordPressSiteFromTemplate,
  reconcileFakeExternalAdapterAction,
} from "./index.js";

const execFileAsync = promisify(execFile);

describe("adapter contracts", () => {
  it("keeps disabled external adapters blocked by default", async () => {
    const result = await executeDisabledExternalAdapter({
      adapter: "communication",
      operation: "send",
      payload: { channel: "email" },
    });

    expect(result).toMatchObject({
      adapter: "communication",
      operation: "send",
      status: "blocked",
      error: { code: "adapter_disabled" },
    });
  });

  it("keeps fake external providers blocked unless explicitly enabled", async () => {
    const blocked = createExternalAdapterProvider({
      adapter: "github",
      provider: "fake",
    });
    await expect(blocked.prepare("issue.comment", { body: "draft" })).resolves.toMatchObject({
      status: "blocked",
      error: { code: "adapter_disabled" },
    });

    const enabled = createExternalAdapterProvider({
      adapter: "github",
      provider: "fake",
      enabled: true,
    });
    await expect(enabled.prepare("issue.comment", { body: "draft" })).resolves.toMatchObject({
      status: "warning",
      data: {
        provider: "fake",
        external_send: false,
      },
      error: { code: "fake_provider_no_send" },
    });
  });

  it("reports git branch, package scripts and nested repositories", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "studio-git-adapter-"));
    await execFileAsync("git", ["init", "-b", "main"], { cwd: root });
    await writeFile(
      path.join(root, "package.json"),
      JSON.stringify({ packageManager: "npm@11.13.0", scripts: { verify: "npm test" } }),
    );
    const nested = path.join(root, "products", "sample", "repository");
    await mkdir(nested, { recursive: true });
    await execFileAsync("git", ["init", "-b", "main"], { cwd: nested });

    const health = await inspectGitRepository({
      id: "repo_test",
      title: "Test repo",
      cwd: root,
      remotePolicy: "forbidden",
      expectedBranch: "main",
    });

    expect(health).toMatchObject({
      branch: "main",
      expectedBranchViolation: false,
      packageManager: "npm@11.13.0",
      packageScripts: { verify: "npm test" },
      nestedRepositories: ["products/sample/repository"],
    });
  });

  it("prepares and reconciles fake external adapter actions without external sends", async () => {
    const root = await createStudioRoot("studio-adapter-actions-");
    const context = await createStudioContext(root);
    const result = await prepareExternalAdapterAction(context, {
      adapter: "github",
      provider: "fake",
      enabled: true,
      operation: "issue.comment",
      payload: { body: "draft" },
    });

    expect(result).toMatchObject({
      status: "warning",
      data: {
        provider: "fake",
        external_send: false,
        prepared_action_id: expect.any(String),
        payload_checksum: expect.any(String),
      },
    });
    const actionId = (result.data as { prepared_action_id: string }).prepared_action_id;
    const actions = new PreparedActionService(context);
    const action = await actions.get(actionId);
    expect(action?.payload).toMatchObject({
      adapter: "github",
      provider: "fake",
      operation: "issue.comment",
      external_send: false,
      body: "draft",
    });

    await expect(reconcileFakeExternalAdapterAction(context, actionId)).rejects.toThrow(
      /must be confirmed/,
    );
    await actions.confirm(actionId, action?.payload_checksum ?? "");
    await expect(reconcileFakeExternalAdapterAction(context, actionId)).resolves.toMatchObject({
      action_id: actionId,
      status: "reconciled",
      reconciliation: {
        external_send: false,
        fake_execution: true,
        reconciled_locally: true,
      },
    });
  });

  it("guards WordPress provision paths and supports dry-run registration", async () => {
    const root = await createStudioRoot("studio-wordpress-provision-");
    const context = await createStudioContext(root);

    await expect(
      provisionWordPressSiteFromTemplate(context, {
        sitePath: "../escape",
        dryRun: true,
      }),
    ).rejects.toThrow(/inside the Studio root/);

    await expect(
      provisionWordPressSiteFromTemplate(context, {
        sitePath: "runtime/wp-fixture",
        templatePath: "wordpress",
        dryRun: true,
      }),
    ).resolves.toMatchObject({
      dryRun: true,
      sitePath: path.join(root, "runtime/wp-fixture"),
      templatePath: path.join(root, "wordpress"),
    });
  });

  it("writes a coordinated backup manifest with repository and component inventory", async () => {
    const root = await createStudioRoot("studio-backup-components-");
    await execFileAsync("git", ["init", "-b", "main"], { cwd: root });
    await writeFile(path.join(root, "README.md"), "backup fixture\n");
    const context = await createStudioContext(root);

    const backup = await createStudioBackup(context);
    const manifest = JSON.parse(await readFile(backup.manifestPath, "utf8")) as {
      components?: {
        root?: string;
        canonical_records?: number;
        repositories_without_remote?: unknown[];
        wordpress?: { backup_manifests?: unknown[] };
      };
    };

    expect(manifest.components).toMatchObject({
      root,
      canonical_records: expect.any(Number),
      wordpress: { backup_manifests: expect.any(Array) },
    });
    expect(manifest.components?.repositories_without_remote).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "root",
          dirty: true,
        }),
      ]),
    );
  });
});

async function createStudioRoot(prefix: string): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), prefix));
  await mkdir(path.join(root, "operations"), { recursive: true });
  await writeFile(
    path.join(root, "studio.config.yaml"),
    [
      "api_version: studio.guilherme.dev/config-v1",
      "root_name: Adapter test",
      "operator_id: per_20260614_guilherme-silva",
      "canonical_roots:",
      "  - operations",
      "runtime_path: runtime",
      "panel:",
      "  host: 127.0.0.1",
      "  port: 47841",
      "adapters: {}",
      "",
    ].join("\n"),
  );
  await mkdir(path.join(root, "wordpress"), { recursive: true });
  return root;
}
