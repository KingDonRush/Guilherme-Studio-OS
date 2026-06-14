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
  entityClassification,
  entityId,
  entityRevision,
  entitySlug,
  entityStatus,
  entityTitle,
  entityUpdatedAt,
  KIND_DIRECTORY,
  LegacyEntitySchema,
  legacyToCanonical,
  normalizeSpecData,
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

export interface LegacyStudioFile {
  absolutePath: string;
  relativePath: string;
  entity: ReturnType<typeof LegacyEntitySchema.parse>;
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

export function entityRelativePath(entity: StudioEntity): string {
  const dir = KIND_DIRECTORY[entity.kind];
  return path.posix.join(dir, `${entitySlug(entity)}.${entityId(entity)}.yaml`);
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
      if (expectedRevision !== undefined && entityRevision(current) !== expectedRevision) {
        throw new Error(
          `Revision conflict for ${entityId(parsed)}: expected ${expectedRevision}, got ${entityRevision(current)}`,
        );
      }
    }
    const body = YAML.stringify(parsed, { sortMapEntries: true, lineWidth: 120 });
    const tmpPath = path.join(
      path.dirname(absolutePath),
      `.studio-${process.pid}-${Date.now()}.tmp`,
    );
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
    return all.find((entry) => entityId(entry.entity) === id);
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

export class LegacyEntityStore {
  readonly root: string;

  constructor(root: string) {
    this.root = root;
  }

  async scan(): Promise<LegacyStudioFile[]> {
    const roots = Object.values(KIND_DIRECTORY);
    const uniqueRoots = [...new Set(roots)];
    const files: LegacyStudioFile[] = [];
    for (const dir of uniqueRoots) {
      const absoluteDir = path.join(this.root, dir);
      if (!(await fileExists(absoluteDir))) {
        continue;
      }
      await this.walkYaml(absoluteDir, files);
    }
    return files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  }

  private async walkYaml(dir: string, out: LegacyStudioFile[]): Promise<void> {
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
      const parsed = YAML.parse(await readFile(absolutePath, "utf8"));
      const legacy = LegacyEntitySchema.safeParse(parsed);
      if (!legacy.success) {
        continue;
      }
      assertNoSecrets(legacy.data);
      out.push({
        absolutePath,
        relativePath: path.relative(this.root, absolutePath),
        entity: legacy.data,
      });
    }
  }
}

async function scanCanonicalFilesLenient(root: string): Promise<StudioFile[]> {
  const files: StudioFile[] = [];
  const walk = async (dir: string): Promise<void> => {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".yaml")) {
        continue;
      }
      const parsed = TypedEntitySchema.safeParse(YAML.parse(await readFile(absolutePath, "utf8")));
      if (parsed.success) {
        files.push({
          absolutePath,
          relativePath: path.relative(root, absolutePath),
          entity: parsed.data,
        });
      }
    }
  };

  for (const dir of [...new Set(Object.values(KIND_DIRECTORY))]) {
    const absoluteDir = path.join(root, dir);
    if (await fileExists(absoluteDir)) {
      await walk(absoluteDir);
    }
  }
  return files;
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
            entityId(entity),
            entity.kind,
            entitySlug(entity),
            entityTitle(entity),
            entityStatus(entity),
            entityClassification(entity),
            entityRevision(entity),
            file.relativePath,
            entityUpdatedAt(entity),
            JSON.stringify(entity.spec),
          );
          for (const relation of entity.relations) {
            insertRelation.run(
              entityId(entity),
              relation.type,
              relation.target_id,
              relation.note ?? null,
            );
          }
        }
      });
      tx(files);
    } finally {
      db.close();
    }
    await rename(tmpPath, this.sqlitePath);
    const payload = files
      .map((file) => `${file.relativePath}:${JSON.stringify(file.entity)}`)
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
    const id = entityId(file.entity);
    if (seen.has(id)) {
      errors.push(`Duplicate entity id: ${id}`);
    }
    seen.add(id);
    files.push(file);
  }
  return { files, errors };
}

export interface CanonicalMigrationPlanEntry {
  legacyPath: string;
  canonicalPath: string;
  legacyId: string;
  canonicalId: string;
  action: "create" | "replace";
}

export interface CanonicalMigrationResult {
  dryRun: boolean;
  migrated: number;
  reconciled: number;
  skipped: number;
  entries: CanonicalMigrationPlanEntry[];
}

export async function migrateCanonicalV1(
  root: string,
  options: { dryRun?: boolean } = {},
): Promise<CanonicalMigrationResult> {
  const legacyStore = new LegacyEntityStore(root);
  const legacyFiles = await legacyStore.scan();
  const canonicalStore = new EntityStore(root);
  const canonicalFiles = await scanCanonicalFilesLenient(root);
  const existingAliases = canonicalFiles.flatMap((file) => {
    const migration = Reflect.get(file.entity.extensions, "migration");
    if (!migration || typeof migration !== "object") {
      return [];
    }
    const previousIds = Reflect.get(migration, "previous_ids");
    if (!Array.isArray(previousIds)) {
      return [];
    }
    return previousIds
      .filter((previousId): previousId is string => typeof previousId === "string")
      .map((previousId) => [previousId, entityId(file.entity)] as const);
  });
  const idMap = Object.fromEntries([
    ...existingAliases,
    ...legacyFiles.map(
      (file) => [file.entity.id, legacyToCanonical(file.entity).metadata.id] as const,
    ),
  ]);
  const entries: CanonicalMigrationPlanEntry[] = [];
  for (const file of legacyFiles) {
    const canonical = legacyToCanonical(file.entity, idMap);
    const canonicalPath = entityRelativePath(canonical);
    entries.push({
      legacyPath: file.relativePath,
      canonicalPath,
      legacyId: file.entity.id,
      canonicalId: entityId(canonical),
      action: file.relativePath === canonicalPath ? "replace" : "create",
    });
  }

  if (options.dryRun) {
    return { dryRun: true, migrated: 0, reconciled: 0, skipped: 0, entries };
  }

  for (const file of legacyFiles) {
    const canonical = legacyToCanonical(file.entity, idMap);
    const canonicalAbsolutePath = path.join(root, entityRelativePath(canonical));
    if (path.resolve(file.absolutePath) === path.resolve(canonicalAbsolutePath)) {
      const body = YAML.stringify(canonical, { sortMapEntries: true, lineWidth: 120 });
      const tmpPath = path.join(
        path.dirname(canonicalAbsolutePath),
        `.studio-${process.pid}-${Date.now()}.tmp`,
      );
      await writeFile(tmpPath, body, { mode: 0o600 });
      await rename(tmpPath, canonicalAbsolutePath);
    } else {
      await canonicalStore.put(canonical);
      await rm(file.absolutePath, { force: true });
    }
  }

  let reconciled = 0;
  for (const file of await scanCanonicalFilesLenient(root)) {
    const normalized = TypedEntitySchema.parse({
      ...file.entity,
      metadata: {
        ...file.entity.metadata,
        owner_id: file.entity.metadata.owner_id
          ? (idMap[file.entity.metadata.owner_id] ?? file.entity.metadata.owner_id)
          : undefined,
      },
      spec: normalizeSpecData(file.entity.spec, idMap),
      relations: file.entity.relations.map((relation) => ({
        ...relation,
        target_id: idMap[relation.target_id] ?? relation.target_id,
      })),
    });
    if (
      YAML.stringify(normalized, { sortMapEntries: true, lineWidth: 120 }) !==
      YAML.stringify(file.entity, { sortMapEntries: true, lineWidth: 120 })
    ) {
      await canonicalStore.put(normalized, entityRevision(file.entity));
      reconciled += 1;
    }
  }

  return {
    dryRun: false,
    migrated: legacyFiles.length,
    reconciled,
    skipped: 0,
    entries,
  };
}
