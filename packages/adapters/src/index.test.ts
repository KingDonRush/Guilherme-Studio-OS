import { execFile } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import {
  createExternalAdapterProvider,
  executeDisabledExternalAdapter,
  inspectGitRepository,
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
});
