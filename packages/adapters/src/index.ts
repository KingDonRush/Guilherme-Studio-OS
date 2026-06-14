import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { access, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
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

export interface StudioBackupResult {
  archivePath: string;
  manifestPath: string;
  checksum: string;
}

export interface WordPressOwnershipResult {
  path: string;
  uid: number;
  gid: number;
  command: string[];
  dryRun: boolean;
}

async function walkFiles(dir: string, root: string, out: string[] = []): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkFiles(absolute, root, out);
      continue;
    }
    if (entry.isFile()) {
      out.push(path.relative(root, absolute));
    }
  }
  return out.sort((a, b) => a.localeCompare(b));
}

export async function createStudioBackup(context: StudioContext): Promise<StudioBackupResult> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.join(context.paths.runtime, "backups");
  await mkdir(backupDir, { recursive: true });
  const archivePath = path.join(backupDir, `studio-os-${timestamp}.tar.gz`);
  const manifestPath = path.join(backupDir, `studio-os-${timestamp}.manifest.json`);
  const includeRoots = [
    "studio.config.yaml",
    "data",
    "clients",
    "products",
    "portfolio",
    "marketing",
    "sales",
    "career",
    "operations",
    "docs/studio-os",
  ];
  const existingRoots: string[] = [];
  for (const root of includeRoots) {
    try {
      await access(path.join(context.paths.root, root));
      existingRoots.push(root);
    } catch {
      // Optional domain roots are created when the first records appear.
    }
  }
  await execFileAsync("tar", ["-czf", archivePath, ...existingRoots], { cwd: context.paths.root });
  const checksum = createHash("sha256")
    .update(await readFile(archivePath))
    .digest("hex");
  const files: string[] = [];
  for (const root of includeRoots.filter((entry) => !entry.endsWith(".yaml"))) {
    try {
      await walkFiles(path.join(context.paths.root, root), context.paths.root, files);
    } catch {
      // Domain roots are optional during early V1 bootstrapping.
    }
  }
  await writeFile(
    manifestPath,
    `${JSON.stringify(
      {
        apiVersion: "studio.guilherme.dev/backup-v1",
        createdAt: new Date().toISOString(),
        archivePath,
        checksum,
        files,
        requestedRoots: includeRoots,
        includedRoots: existingRoots,
      },
      null,
      2,
    )}\n`,
    { mode: 0o600 },
  );
  return { archivePath, manifestPath, checksum };
}

export async function fixWordPressRootOwnership(
  context: StudioContext,
  sitePath: string,
  options: { dryRun?: boolean } = {},
): Promise<WordPressOwnershipResult> {
  const absolutePath = path.isAbsolute(sitePath)
    ? path.resolve(sitePath)
    : path.resolve(context.paths.root, sitePath);
  const root = path.resolve(context.paths.root);
  if (absolutePath !== root && !absolutePath.startsWith(`${root}${path.sep}`)) {
    throw new Error(`Refusing to change ownership outside Studio root: ${sitePath}`);
  }
  const info = await stat(absolutePath);
  if (!info.isDirectory()) {
    throw new Error(`WordPress site path must be a directory: ${sitePath}`);
  }
  const uid = process.getuid?.() ?? 1000;
  const gid = process.getgid?.() ?? 1000;
  const command = [
    "run",
    "--rm",
    "-v",
    `${absolutePath}:/work`,
    "alpine:3.20",
    "chown",
    `${uid}:${gid}`,
    "/work",
  ];
  if (!options.dryRun) {
    await execFileAsync("docker", command);
  }
  return {
    path: absolutePath,
    uid,
    gid,
    command: ["docker", ...command],
    dryRun: options.dryRun ?? false,
  };
}
