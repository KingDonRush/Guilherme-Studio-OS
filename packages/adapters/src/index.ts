import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { StudioContext } from "@guilherme-studio/core";

const execFileAsync = promisify(execFile);

export interface GitRepositoryHealth {
  cwd: string;
  branch: string;
  shortStatus: string;
  hasRemote: boolean;
  isDirty: boolean;
}

export async function inspectGitRepository(cwd: string): Promise<GitRepositoryHealth> {
  const [{ stdout: branch }, { stdout: status }, { stdout: remotes }] = await Promise.all([
    execFileAsync("git", ["branch", "--show-current"], { cwd }),
    execFileAsync("git", ["status", "--short"], { cwd }),
    execFileAsync("git", ["remote"], { cwd }),
  ]);
  return {
    cwd,
    branch: branch.trim(),
    shortStatus: status.trim(),
    hasRemote: remotes.trim().length > 0,
    isDirty: status.trim().length > 0,
  };
}

export async function inspectStudioRepositories(
  context: StudioContext,
): Promise<GitRepositoryHealth[]> {
  const root = await inspectGitRepository(context.paths.root);
  return [root];
}

export function describeAdapterPolicy(): string {
  return "External adapters use prepare -> confirm -> execute -> reconcile. V1 does not execute external sends autonomously.";
}
