import { execFile, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { access, mkdir, mkdtemp, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import type { StudioContext } from "@guilherme-studio/core";
import {
  type AdapterResult,
  AdapterResultSchema,
  createActor,
  createRecordId,
  entityId,
  entityTitle,
} from "@guilherme-studio/schemas";

const execFileAsync = promisify(execFile);

export interface GitRepositoryHealth {
  id: string;
  title: string;
  cwd: string;
  branch: string;
  shortStatus: string;
  hasRemote: boolean;
  isDirty: boolean;
  remotePolicy: "forbidden" | "allowed";
  remotePolicyViolation: boolean;
}

export async function inspectGitRepository(
  input: Pick<GitRepositoryHealth, "id" | "title" | "cwd" | "remotePolicy">,
): Promise<GitRepositoryHealth> {
  const { cwd } = input;
  const [{ stdout: branch }, { stdout: status }, { stdout: remotes }] = await Promise.all([
    execFileAsync("git", ["branch", "--show-current"], { cwd }),
    execFileAsync("git", ["status", "--short"], { cwd }),
    execFileAsync("git", ["remote"], { cwd }),
  ]);
  return {
    id: input.id,
    title: input.title,
    cwd,
    branch: branch.trim(),
    shortStatus: status.trim(),
    hasRemote: remotes.trim().length > 0,
    isDirty: status.trim().length > 0,
    remotePolicy: input.remotePolicy,
    remotePolicyViolation: input.remotePolicy === "forbidden" && remotes.trim().length > 0,
  };
}

export async function inspectStudioRepositories(
  context: StudioContext,
): Promise<GitRepositoryHealth[]> {
  const candidates = new Map<
    string,
    Pick<GitRepositoryHealth, "id" | "title" | "cwd" | "remotePolicy">
  >();
  candidates.set(context.paths.root, {
    id: "root",
    title: "Guilherme Studio OS coordinator",
    cwd: context.paths.root,
    remotePolicy: "forbidden",
  });
  for (const file of await context.entities.scan()) {
    const repositoryPath = Reflect.get(file.entity.spec, "path");
    if (file.entity.kind === "repository" && typeof repositoryPath === "string") {
      const remotePolicy = Reflect.get(file.entity.spec, "remote_policy");
      const cwd = path.resolve(context.paths.root, repositoryPath);
      candidates.set(cwd, {
        id: entityId(file.entity),
        title: entityTitle(file.entity),
        cwd,
        remotePolicy: remotePolicy === "no-remote-in-v1" ? "forbidden" : "allowed",
      });
    }
    const productRepositoryPath = Reflect.get(file.entity.spec, "repository_path");
    if (file.entity.kind === "product" && typeof productRepositoryPath === "string") {
      const cwd = path.resolve(context.paths.root, productRepositoryPath);
      candidates.set(cwd, {
        id: `${entityId(file.entity)}:repository`,
        title: `${entityTitle(file.entity)} repository`,
        cwd,
        remotePolicy: "allowed",
      });
    }
    if (file.entity.kind === "environment") {
      const repository = Reflect.get(file.entity.spec, "wordpress_git_repository");
      if (repository && typeof repository === "object") {
        const repositoryPath = Reflect.get(repository, "path");
        if (typeof repositoryPath === "string") {
          const cwd = path.resolve(context.paths.root, repositoryPath);
          candidates.set(cwd, {
            id: `${entityId(file.entity)}:wordpress`,
            title: `${entityTitle(file.entity)} WordPress`,
            cwd,
            remotePolicy: "allowed",
          });
        }
      }
    }
  }
  const health: GitRepositoryHealth[] = [];
  for (const candidate of candidates.values()) {
    try {
      health.push(await inspectGitRepository(candidate));
    } catch {
      health.push({
        ...candidate,
        branch: "",
        shortStatus: "Repository unavailable or invalid",
        hasRemote: false,
        isDirty: true,
        remotePolicyViolation: false,
      });
    }
  }
  return health;
}

export function describeAdapterPolicy(): string {
  return "External adapters use prepare -> confirm -> execute -> reconcile. V1 does not execute external sends autonomously.";
}

export interface StudioBackupResult {
  archivePath: string;
  manifestPath: string;
  checksum: string;
  repositories?: GitRepositoryHealth[];
  components?: Record<string, unknown>;
}

export interface WordPressOwnershipResult {
  path: string;
  uid: number;
  gid: number;
  command: string[];
  dryRun: boolean;
}

export interface WordPressRuntimeDefinition {
  composeFiles: string[];
  url?: string;
}

export interface WordPressDbBackupResult {
  sqlPath: string;
  manifestPath: string;
  checksum: string;
  sizeBytes: number;
}

export interface WordPressUploadsBackupResult {
  archivePath: string;
  manifestPath: string;
  checksum: string;
  sizeBytes: number;
}

async function wordpressRuntime(context: StudioContext): Promise<WordPressRuntimeDefinition> {
  for (const file of await context.entities.scan()) {
    if (file.entity.kind !== "environment") {
      continue;
    }
    const composeFiles = Reflect.get(file.entity.spec, "compose_files");
    if (!Array.isArray(composeFiles) || !composeFiles.every((item) => typeof item === "string")) {
      continue;
    }
    const url = Reflect.get(file.entity.spec, "url");
    return {
      composeFiles,
      ...(typeof url === "string" ? { url } : {}),
    };
  }
  throw new Error("No WordPress environment with compose_files is registered.");
}

async function composeInvocation(
  context: StudioContext,
  args: string[],
): Promise<{ stdout: string; stderr: string }> {
  const runtime = await wordpressRuntime(context);
  const composeArgs = runtime.composeFiles.flatMap((file) => ["-f", file]);
  return execFileAsync("docker", ["compose", ...composeArgs, ...args], {
    cwd: context.paths.root,
    maxBuffer: 64 * 1024 * 1024,
  });
}

export async function wordpressStatus(context: StudioContext): Promise<{
  url?: string;
  services: unknown[];
}> {
  const runtime = await wordpressRuntime(context);
  const { stdout } = await composeInvocation(context, ["ps", "--format", "json"]);
  const services = stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as unknown);
  return { ...(runtime.url ? { url: runtime.url } : {}), services };
}

export async function wordpressStart(
  context: StudioContext,
): Promise<{ ok: true; services: unknown[] }> {
  await composeInvocation(context, ["up", "-d"]);
  return { ok: true, services: (await wordpressStatus(context)).services };
}

export async function wordpressStop(context: StudioContext): Promise<{ ok: true }> {
  await composeInvocation(context, ["stop"]);
  return { ok: true };
}

export async function wordpressHealth(context: StudioContext): Promise<{
  ok: boolean;
  url?: string;
  httpStatus?: number;
  services: unknown[];
}> {
  const status = await wordpressStatus(context);
  let httpStatus: number | undefined;
  if (status.url) {
    try {
      const response = await fetch(status.url, { method: "HEAD" });
      httpStatus = response.status;
    } catch {
      httpStatus = undefined;
    }
  }
  return {
    ok: status.services.length > 0 && (!status.url || (httpStatus ?? 0) < 500),
    ...(status.url ? { url: status.url } : {}),
    ...(httpStatus ? { httpStatus } : {}),
    services: status.services,
  };
}

export async function wordpressWpCli(
  context: StudioContext,
  args: string[],
): Promise<{ stdout: string; stderr: string }> {
  if (args.length === 0) {
    throw new Error("WP-CLI arguments are required.");
  }
  if (args.some((arg) => arg.includes("\u0000"))) {
    throw new Error("Invalid WP-CLI argument.");
  }
  return composeInvocation(context, ["run", "--rm", "-T", "wpcli", ...args]);
}

export async function wordpressPluginList(context: StudioContext): Promise<unknown[]> {
  const { stdout } = await composeInvocation(context, [
    "run",
    "--rm",
    "-T",
    "wpcli",
    "plugin",
    "list",
    "--format=json",
  ]);
  return JSON.parse(stdout) as unknown[];
}

export async function backupWordPressDatabase(
  context: StudioContext,
): Promise<WordPressDbBackupResult> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const directory = path.join(context.paths.runtime, "backups", "wordpress", timestamp);
  await mkdir(directory, { recursive: true });
  const sqlPath = path.join(directory, "database.sql");
  const manifestPath = path.join(directory, "manifest.json");
  const { stdout } = await composeInvocation(context, [
    "exec",
    "-T",
    "db",
    "sh",
    "-c",
    'mysqldump -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"',
  ]);
  await writeFile(sqlPath, stdout, { mode: 0o600 });
  const checksum = createHash("sha256").update(stdout).digest("hex");
  const sizeBytes = Buffer.byteLength(stdout);
  await writeFile(
    manifestPath,
    `${JSON.stringify(
      {
        api_version: "studio.guilherme.dev/wordpress-backup-v1",
        created_at: new Date().toISOString(),
        sql_path: sqlPath,
        checksum,
        size_bytes: sizeBytes,
      },
      null,
      2,
    )}\n`,
    { mode: 0o600 },
  );
  return { sqlPath, manifestPath, checksum, sizeBytes };
}

async function spawnWithInput(
  command: string,
  args: string[],
  input: Buffer,
  cwd: string,
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: ["pipe", "pipe", "pipe"] });
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    child.stdout.on("data", (chunk: Buffer) => stdout.push(chunk));
    child.stderr.on("data", (chunk: Buffer) => stderr.push(chunk));
    child.on("error", reject);
    child.on("close", (code) => {
      const result = {
        stdout: Buffer.concat(stdout).toString("utf8"),
        stderr: Buffer.concat(stderr).toString("utf8"),
      };
      if (code === 0) {
        resolve(result);
      } else {
        reject(new Error(`Command exited with ${code}: ${result.stderr}`));
      }
    });
    child.stdin.end(input);
  });
}

export async function restoreCheckWordPressDatabase(
  context: StudioContext,
  sqlPath: string,
): Promise<{ ok: true; tableCount: number }> {
  const absoluteSqlPath = path.resolve(context.paths.root, sqlPath);
  const root = path.resolve(context.paths.root);
  if (absoluteSqlPath !== root && !absoluteSqlPath.startsWith(`${root}${path.sep}`)) {
    throw new Error("Restore check SQL must stay inside the Studio root.");
  }
  const sql = await readFile(absoluteSqlPath);
  const runtime = await wordpressRuntime(context);
  const composeArgs = runtime.composeFiles.flatMap((file) => ["-f", file]);
  const database = `studio_restore_${Date.now()}`;
  const mysqlArgs = [
    "compose",
    ...composeArgs,
    "exec",
    "-T",
    "db",
    "sh",
    "-c",
    'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$@"',
    "studio-mysql",
  ];
  await execFileAsync("docker", [...mysqlArgs, "-e", `CREATE DATABASE \`${database}\``], {
    cwd: context.paths.root,
  });
  try {
    await spawnWithInput("docker", [...mysqlArgs, database], sql, context.paths.root);
    const { stdout } = await execFileAsync(
      "docker",
      [
        ...mysqlArgs,
        "-N",
        "-e",
        `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='${database}'`,
      ],
      { cwd: context.paths.root },
    );
    const tableCount = Number.parseInt(stdout.trim(), 10);
    if (!Number.isFinite(tableCount) || tableCount < 1) {
      throw new Error("Restore check completed without WordPress tables.");
    }
    return { ok: true, tableCount };
  } finally {
    await execFileAsync("docker", [...mysqlArgs, "-e", `DROP DATABASE \`${database}\``], {
      cwd: context.paths.root,
    });
  }
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

export async function backupWordPressUploads(
  context: StudioContext,
): Promise<WordPressUploadsBackupResult> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const directory = path.join(context.paths.runtime, "backups", "wordpress", timestamp);
  await mkdir(directory, { recursive: true });
  const archivePath = path.join(directory, "uploads.tar.gz");
  const manifestPath = path.join(directory, "uploads.manifest.json");
  const uploadsPath = path.join(context.paths.root, "wordpress", "wp-content", "uploads");
  await access(uploadsPath);
  await execFileAsync("tar", ["-czf", archivePath, "-C", uploadsPath, "."], {
    cwd: context.paths.root,
  });
  const archive = await readFile(archivePath);
  const checksum = createHash("sha256").update(archive).digest("hex");
  const sizeBytes = archive.byteLength;
  await writeFile(
    manifestPath,
    `${JSON.stringify(
      {
        api_version: "studio.guilherme.dev/wordpress-uploads-backup-v1",
        created_at: new Date().toISOString(),
        archive_path: archivePath,
        checksum,
        size_bytes: sizeBytes,
      },
      null,
      2,
    )}\n`,
    { mode: 0o600 },
  );
  return { archivePath, manifestPath, checksum, sizeBytes };
}

export async function restoreCheckWordPressUploads(
  context: StudioContext,
  archivePath: string,
): Promise<{ ok: true; fileCount: number }> {
  const absoluteArchivePath = path.resolve(context.paths.root, archivePath);
  const root = path.resolve(context.paths.root);
  if (absoluteArchivePath !== root && !absoluteArchivePath.startsWith(`${root}${path.sep}`)) {
    throw new Error("Restore check archive must stay inside the Studio root.");
  }
  const temporary = await mkdtemp(path.join(context.paths.runtime, "uploads-restore-check-"));
  try {
    await execFileAsync("tar", ["-xzf", absoluteArchivePath, "-C", temporary]);
    const files = await walkFiles(temporary, temporary);
    if (files.length < 1) {
      throw new Error("Uploads restore check extracted no files.");
    }
    return { ok: true, fileCount: files.length };
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
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
  const repositories = await inspectStudioRepositories(context);
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
        repositories: repositories.map((repository) => ({
          id: repository.id,
          title: repository.title,
          cwd: repository.cwd,
          branch: repository.branch,
          dirty: repository.isDirty,
          has_remote: repository.hasRemote,
          remote_policy: repository.remotePolicy,
        })),
      },
      null,
      2,
    )}\n`,
    { mode: 0o600 },
  );
  return { archivePath, manifestPath, checksum, repositories };
}

export async function executeDisabledExternalAdapter(input: {
  adapter: "github" | "communication";
  operation: string;
  payload?: Record<string, unknown>;
  reason?: string;
}): Promise<AdapterResult> {
  return AdapterResultSchema.parse({
    request_id: createRecordId("req", `${input.adapter}:${input.operation}:${Date.now()}`),
    adapter: input.adapter,
    operation: input.operation,
    status: "blocked",
    data: {
      enabled: false,
      payload_keys: Object.keys(input.payload ?? {}),
    },
    error: {
      code: "adapter_disabled",
      message: input.reason ?? `${input.adapter} adapter is disabled by default in Studio OS V1.`,
      details: {
        actor: createActor({
          id: "adapter_disabled",
          type: "adapter",
          capabilities: [],
        }),
      },
    },
  });
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
