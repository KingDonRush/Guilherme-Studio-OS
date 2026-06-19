import { mkdir, readFile, realpath } from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

export interface StudioConfig {
  api_version: string;
  root_name: string;
  operator_id: string;
  canonical_roots: string[];
  runtime_path: string;
  panel: {
    host: string;
    port: number;
  };
  adapters: Record<string, boolean>;
}

export interface StudioPaths {
  root: string;
  configPath: string;
  runtime: string;
  sqlitePath: string;
  eventsPath: string;
  transactionsPath: string;
  locksPath: string;
}

export async function loadStudioConfig(
  root = process.cwd(),
): Promise<{ config: StudioConfig; paths: StudioPaths }> {
  const resolvedRoot = await realpath(root);
  const configPath = path.join(resolvedRoot, "studio.config.yaml");
  const config = YAML.parse(await readFile(configPath, "utf8")) as StudioConfig;
  const runtime = path.join(resolvedRoot, config.runtime_path);
  const sqlitePath = path.join(runtime, "studio.sqlite");
  const eventsPath = path.join(runtime, "events.jsonl");
  const transactionsPath = path.join(runtime, "transactions");
  const locksPath = path.join(runtime, "locks");
  return {
    config,
    paths: {
      root: resolvedRoot,
      configPath,
      runtime,
      sqlitePath,
      eventsPath,
      transactionsPath,
      locksPath,
    },
  };
}

export async function ensureStudioRuntime(paths: StudioPaths): Promise<void> {
  await mkdir(paths.runtime, { recursive: true });
  await mkdir(paths.locksPath, { recursive: true });
  await mkdir(paths.transactionsPath, { recursive: true });
  await mkdir(path.dirname(paths.eventsPath), { recursive: true });
}

export async function resolveInsideRoot(root: string, relativePath: string): Promise<string> {
  if (path.isAbsolute(relativePath)) {
    throw new Error(`Expected relative path, got absolute path: ${relativePath}`);
  }
  const normalized = path.normalize(relativePath);
  if (normalized === ".." || normalized.startsWith(`..${path.sep}`)) {
    throw new Error(`Path traversal is not allowed: ${relativePath}`);
  }
  const target = path.join(root, normalized);
  await mkdir(path.dirname(target), { recursive: true });
  const parentReal = await realpath(path.dirname(target));
  const rootReal = await realpath(root);
  if (parentReal !== rootReal && !parentReal.startsWith(`${rootReal}${path.sep}`)) {
    throw new Error(`Resolved path escapes Studio root: ${relativePath}`);
  }
  return target;
}
