import { createHash } from "node:crypto";
import { constants as fsConstants, statSync } from "node:fs";
import {
  access,
  mkdir,
  readdir,
  readFile,
  realpath,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import {
  assertNoSecrets,
  EventSchema,
  KIND_DIRECTORY,
  type StudioEntity,
  type StudioEvent,
  TypedEntitySchema,
} from "@guilherme-studio/schemas";
import Database from "better-sqlite3";
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
}

export interface StudioFile {
  absolutePath: string;
  relativePath: string;
  entity: StudioEntity;
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
  return {
    config,
    paths: {
      root: resolvedRoot,
      configPath,
      runtime,
      sqlitePath,
      eventsPath,
    },
  };
}

export async function ensureStudioRuntime(paths: StudioPaths): Promise<void> {
  await mkdir(paths.runtime, { recursive: true });
  await mkdir(path.join(paths.runtime, "locks"), { recursive: true });
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

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export function entityRelativePath(entity: Pick<StudioEntity, "kind" | "slug" | "id">): string {
  const dir = KIND_DIRECTORY[entity.kind];
  return path.posix.join(dir, `${entity.slug}.${entity.id}.yaml`);
}

export class EntityStore {
  readonly root: string;

  constructor(root: string) {
    this.root = root;
  }

  async put(entity: StudioEntity, expectedRevision?: number): Promise<string> {
    assertNoSecrets(entity);
    const parsed = TypedEntitySchema.parse(entity);
    const relativePath = entityRelativePath(parsed);
    const absolutePath = await resolveInsideRoot(this.root, relativePath);
    if (await fileExists(absolutePath)) {
      const current = await this.readByPath(absolutePath);
      if (expectedRevision !== undefined && current.revision !== expectedRevision) {
        throw new Error(
          `Revision conflict for ${parsed.id}: expected ${expectedRevision}, got ${current.revision}`,
        );
      }
    }
    const body = YAML.stringify(parsed, { sortMapEntries: true, lineWidth: 120 });
    const tmpPath = `${absolutePath}.${process.pid}.${Date.now()}.tmp`;
    await writeFile(tmpPath, body, { mode: 0o600 });
    await rename(tmpPath, absolutePath);
    return relativePath;
  }

  async readByPath(absolutePath: string): Promise<StudioEntity> {
    const parsed = YAML.parse(await readFile(absolutePath, "utf8"));
    assertNoSecrets(parsed);
    return TypedEntitySchema.parse(parsed);
  }

  async get(id: string): Promise<StudioFile | undefined> {
    const all = await this.scan();
    return all.find((entry) => entry.entity.id === id);
  }

  async scan(): Promise<StudioFile[]> {
    const roots = Object.values(KIND_DIRECTORY);
    const uniqueRoots = [...new Set(roots)];
    const files: StudioFile[] = [];
    for (const dir of uniqueRoots) {
      const absoluteDir = path.join(this.root, dir);
      if (!(await fileExists(absoluteDir))) {
        continue;
      }
      await this.walkYaml(absoluteDir, files);
    }
    return files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  }

  private async walkYaml(dir: string, out: StudioFile[]): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await this.walkYaml(absolutePath, out);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".yaml")) {
        continue;
      }
      const entity = await this.readByPath(absolutePath);
      out.push({
        absolutePath,
        relativePath: path.relative(this.root, absolutePath),
        entity,
      });
    }
  }
}

export class EventStore {
  readonly eventsPath: string;

  constructor(eventsPath: string) {
    this.eventsPath = eventsPath;
  }

  async append(event: StudioEvent): Promise<void> {
    const parsed = EventSchema.parse(event);
    assertNoSecrets(parsed);
    await mkdir(path.dirname(this.eventsPath), { recursive: true });
    await writeFile(this.eventsPath, `${JSON.stringify(parsed)}\n`, { flag: "a", mode: 0o600 });
  }
}

export interface ProjectionStats {
  entityCount: number;
  relationCount: number;
  checksum: string;
}

export class SQLiteProjection {
  readonly sqlitePath: string;

  constructor(sqlitePath: string) {
    this.sqlitePath = sqlitePath;
  }

  async rebuild(files: StudioFile[]): Promise<ProjectionStats> {
    await mkdir(path.dirname(this.sqlitePath), { recursive: true });
    const tmpPath = `${this.sqlitePath}.${process.pid}.${Date.now()}.tmp`;
    await rm(tmpPath, { force: true });
    const db = new Database(tmpPath);
    try {
      db.exec(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE entities (
          id TEXT PRIMARY KEY,
          kind TEXT NOT NULL,
          slug TEXT NOT NULL,
          title TEXT NOT NULL,
          status TEXT NOT NULL,
          classification TEXT NOT NULL,
          revision INTEGER NOT NULL,
          canonical_path TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          data_json TEXT NOT NULL
        );
        CREATE TABLE relations (
          source_id TEXT NOT NULL,
          type TEXT NOT NULL,
          target_id TEXT NOT NULL,
          note TEXT,
          PRIMARY KEY (source_id, type, target_id)
        );
        CREATE INDEX entities_kind_idx ON entities(kind);
        CREATE INDEX entities_status_idx ON entities(status);
        CREATE INDEX relations_target_idx ON relations(target_id);
      `);

      const insertEntity = db.prepare(`
        INSERT INTO entities (
          id, kind, slug, title, status, classification, revision, canonical_path, updated_at, data_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const insertRelation = db.prepare(`
        INSERT INTO relations (source_id, type, target_id, note) VALUES (?, ?, ?, ?)
      `);
      const tx = db.transaction((entries: StudioFile[]) => {
        for (const file of entries) {
          const entity = file.entity;
          insertEntity.run(
            entity.id,
            entity.kind,
            entity.slug,
            entity.title,
            entity.status,
            entity.classification,
            entity.revision,
            file.relativePath,
            entity.updatedAt,
            JSON.stringify(entity.data),
          );
          for (const relation of entity.relations) {
            insertRelation.run(entity.id, relation.type, relation.targetId, relation.note ?? null);
          }
        }
      });
      tx(files);
    } finally {
      db.close();
    }
    await rename(tmpPath, this.sqlitePath);
    const payload = files
      .map((file) => `${file.entity.id}:${file.entity.revision}:${file.relativePath}`)
      .join("\n");
    return {
      entityCount: files.length,
      relationCount: files.reduce((count, file) => count + file.entity.relations.length, 0),
      checksum: createHash("sha256").update(payload).digest("hex"),
    };
  }

  inspect(): { exists: boolean; sizeBytes: number } {
    try {
      const info = statSync(this.sqlitePath);
      return { exists: true, sizeBytes: info.size };
    } catch {
      return { exists: false, sizeBytes: 0 };
    }
  }
}

export async function validateCanonicalFiles(
  root: string,
): Promise<{ files: StudioFile[]; errors: string[] }> {
  const store = new EntityStore(root);
  const errors: string[] = [];
  const files: StudioFile[] = [];
  const seen = new Set<string>();
  for (const file of await store.scan()) {
    if (seen.has(file.entity.id)) {
      errors.push(`Duplicate entity id: ${file.entity.id}`);
    }
    seen.add(file.entity.id);
    files.push(file);
  }
  return { files, errors };
}
