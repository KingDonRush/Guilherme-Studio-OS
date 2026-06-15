import { createHash, randomUUID } from "node:crypto";
import { constants as fsConstants, statSync } from "node:fs";
import {
  access,
  mkdir,
  open,
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
  transactionsPath: string;
  locksPath: string;
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

interface EntityTransactionManifest {
  api_version: "studio.guilherme.dev/transaction-v1";
  id: string;
  entity_id: string;
  target_path: string;
  temporary_path: string;
  expected_revision?: number;
  started_at: string;
}

interface MultiEntityTransactionEntry {
  entity_id: string;
  target_path: string;
  temporary_path: string;
  expected_revision?: number;
  next_revision: number;
}

interface MultiEntityTransactionManifest {
  api_version: "studio.guilherme.dev/transaction-v2";
  id: string;
  entries: MultiEntityTransactionEntry[];
  started_at: string;
}

export class EntityStore {
  readonly root: string;
  readonly runtime: string;
  readonly locksPath: string;
  readonly transactionsPath: string;

  constructor(root: string, runtime = path.join(root, "runtime")) {
    this.root = root;
    this.runtime = runtime;
    this.locksPath = path.join(runtime, "locks");
    this.transactionsPath = path.join(runtime, "transactions");
  }

  async put(entity: StudioEntity, expectedRevision?: number): Promise<string> {
    assertNoSecrets(entity);
    const parsed = TypedEntitySchema.parse(entity);
    const relativePath = entityRelativePath(parsed);
    const absolutePath = await resolveInsideRoot(this.root, relativePath);
    await this.withEntityLock(entityId(parsed), async () => {
      if (await fileExists(absolutePath)) {
        const current = await this.readByPath(absolutePath);
        if (expectedRevision === undefined) {
          throw new Error(`Expected revision is required when updating ${entityId(parsed)}`);
        }
        if (entityRevision(current) !== expectedRevision) {
          throw new Error(
            `Revision conflict for ${entityId(parsed)}: expected ${expectedRevision}, got ${entityRevision(current)}`,
          );
        }
      }
      await this.commitEntityWrite(parsed, absolutePath, expectedRevision);
    });
    return relativePath;
  }

  async putMany(
    writes: Array<{ entity: StudioEntity; expectedRevision?: number }>,
  ): Promise<string[]> {
    if (writes.length === 0) {
      return [];
    }
    const parsedWrites = writes.map((write) => ({
      entity: TypedEntitySchema.parse(write.entity),
      expectedRevision: write.expectedRevision,
    }));
    for (const write of parsedWrites) {
      assertNoSecrets(write.entity);
    }
    const ids = parsedWrites.map((write) => entityId(write.entity));
    if (new Set(ids).size !== ids.length) {
      throw new Error("A multi-record transaction cannot write the same entity twice.");
    }

    return this.withEntityLocks(ids, async () => {
      const entries: Array<MultiEntityTransactionEntry & { entity: StudioEntity }> = [];
      for (const write of parsedWrites) {
        const targetPath = await resolveInsideRoot(this.root, entityRelativePath(write.entity));
        if (await fileExists(targetPath)) {
          const current = await this.readByPath(targetPath);
          if (write.expectedRevision === undefined) {
            throw new Error(
              `Expected revision is required when updating ${entityId(write.entity)}`,
            );
          }
          if (entityRevision(current) !== write.expectedRevision) {
            throw new Error(
              `Revision conflict for ${entityId(write.entity)}: expected ${write.expectedRevision}, got ${entityRevision(current)}`,
            );
          }
        }
        entries.push({
          entity: write.entity,
          entity_id: entityId(write.entity),
          target_path: path.relative(this.root, targetPath),
          temporary_path: path.relative(
            this.root,
            path.join(
              path.dirname(targetPath),
              `.studio-${process.pid}-${Date.now()}-${entries.length}.tmp`,
            ),
          ),
          ...(write.expectedRevision === undefined
            ? {}
            : { expected_revision: write.expectedRevision }),
          next_revision: entityRevision(write.entity),
        });
      }

      await mkdir(this.transactionsPath, { recursive: true });
      const manifest: MultiEntityTransactionManifest = {
        api_version: "studio.guilherme.dev/transaction-v2",
        id: randomUUID(),
        entries: entries.map(({ entity: _entity, ...entry }) => entry),
        started_at: new Date().toISOString(),
      };
      const manifestPath = path.join(this.transactionsPath, `${manifest.id}.json`);
      for (const entry of entries) {
        await writeFile(
          path.join(this.root, entry.temporary_path),
          YAML.stringify(entry.entity, { sortMapEntries: true, lineWidth: 120 }),
          { mode: 0o600 },
        );
      }
      await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, {
        mode: 0o600,
      });
      for (const entry of entries) {
        await rename(
          path.join(this.root, entry.temporary_path),
          path.join(this.root, entry.target_path),
        );
      }
      await rm(manifestPath, { force: true });
      return entries.map((entry) => entry.target_path);
    });
  }

  async recoverTransactions(): Promise<{ recovered: number; discarded: number }> {
    await mkdir(this.transactionsPath, { recursive: true });
    const entries = await readdir(this.transactionsPath, { withFileTypes: true });
    let recovered = 0;
    let discarded = 0;
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".json")) {
        continue;
      }
      const manifestPath = path.join(this.transactionsPath, entry.name);
      const raw = JSON.parse(await readFile(manifestPath, "utf8")) as
        | EntityTransactionManifest
        | MultiEntityTransactionManifest;
      if (raw.api_version === "studio.guilherme.dev/transaction-v2") {
        for (const entry of raw.entries) {
          const targetPath = path.join(this.root, entry.target_path);
          const temporaryPath = path.join(this.root, entry.temporary_path);
          if (!(await fileExists(temporaryPath))) {
            if (await fileExists(targetPath)) {
              const current = await this.readByPath(targetPath);
              if (entityRevision(current) === entry.next_revision) {
                discarded += 1;
                continue;
              }
            }
            throw new Error(`Missing staged transaction entry: ${entry.entity_id}`);
          }
          const staged = await this.readByPath(temporaryPath);
          if (
            entityId(staged) !== entry.entity_id ||
            entityRevision(staged) !== entry.next_revision
          ) {
            throw new Error(`Transaction entry mismatch: ${entry.entity_id}`);
          }
          if (await fileExists(targetPath)) {
            const current = await this.readByPath(targetPath);
            if (entityRevision(current) === entry.next_revision) {
              await rm(temporaryPath, { force: true });
              discarded += 1;
              continue;
            }
            if (
              entry.expected_revision === undefined ||
              entityRevision(current) !== entry.expected_revision
            ) {
              throw new Error(`Transaction revision conflict: ${raw.id}`);
            }
          }
          await rename(temporaryPath, targetPath);
          recovered += 1;
        }
        await rm(manifestPath, { force: true });
        continue;
      }
      const manifest = raw;
      const targetPath = path.join(this.root, manifest.target_path);
      const temporaryPath = path.join(this.root, manifest.temporary_path);
      if (await fileExists(temporaryPath)) {
        const parsed = TypedEntitySchema.parse(YAML.parse(await readFile(temporaryPath, "utf8")));
        if (entityId(parsed) !== manifest.entity_id) {
          throw new Error(`Transaction entity mismatch: ${manifest.id}`);
        }
        if (await fileExists(targetPath)) {
          const current = await this.readByPath(targetPath);
          if (entityRevision(current) === entityRevision(parsed)) {
            await rm(temporaryPath, { force: true });
            discarded += 1;
          } else if (
            manifest.expected_revision !== undefined &&
            entityRevision(current) === manifest.expected_revision
          ) {
            await rename(temporaryPath, targetPath);
            recovered += 1;
          } else {
            throw new Error(`Transaction revision conflict: ${manifest.id}`);
          }
        } else {
          await rename(temporaryPath, targetPath);
          recovered += 1;
        }
      } else {
        discarded += 1;
      }
      await rm(manifestPath, { force: true });
    }
    return { recovered, discarded };
  }

  async pendingTransactions(): Promise<string[]> {
    await mkdir(this.transactionsPath, { recursive: true });
    return (await readdir(this.transactionsPath))
      .filter((entry) => entry.endsWith(".json"))
      .sort((a, b) => a.localeCompare(b));
  }

  private async withEntityLock<T>(id: string, action: () => Promise<T>): Promise<T> {
    await mkdir(this.locksPath, { recursive: true });
    const lockPath = path.join(this.locksPath, `${id}.lock`);
    let lockHandle: Awaited<ReturnType<typeof open>>;
    try {
      lockHandle = await open(lockPath, "wx", 0o600);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "EEXIST") {
        throw new Error(`Entity is locked by another operation: ${id}`);
      }
      throw error;
    }
    try {
      await lockHandle.writeFile(`${process.pid}\n${new Date().toISOString()}\n`);
      return await action();
    } finally {
      await lockHandle.close();
      await rm(lockPath, { force: true });
    }
  }

  private async withEntityLocks<T>(ids: string[], action: () => Promise<T>): Promise<T> {
    const sortedIds = [...new Set(ids)].sort((left, right) => left.localeCompare(right));
    const run = async (index: number): Promise<T> => {
      const id = sortedIds[index];
      if (!id) {
        return action();
      }
      return this.withEntityLock(id, () => run(index + 1));
    };
    return run(0);
  }

  async inspectLocks(): Promise<
    Array<{ id: string; path: string; pid?: number; createdAt?: string; stale: boolean }>
  > {
    await mkdir(this.locksPath, { recursive: true });
    const results = [];
    for (const entry of (await readdir(this.locksPath)).filter((name) => name.endsWith(".lock"))) {
      const lockPath = path.join(this.locksPath, entry);
      const [pidValue, createdAt] = (await readFile(lockPath, "utf8")).trim().split("\n");
      const pid = Number.parseInt(pidValue ?? "", 10);
      const age = createdAt ? Date.now() - Date.parse(createdAt) : Number.POSITIVE_INFINITY;
      results.push({
        id: entry.slice(0, -5),
        path: lockPath,
        ...(Number.isFinite(pid) ? { pid } : {}),
        ...(createdAt ? { createdAt } : {}),
        stale: age > 15 * 60 * 1000,
      });
    }
    return results;
  }

  private async commitEntityWrite(
    entity: StudioEntity,
    absolutePath: string,
    expectedRevision?: number,
  ): Promise<void> {
    await mkdir(this.transactionsPath, { recursive: true });
    const transactionId = randomUUID();
    const tmpPath = path.join(
      path.dirname(absolutePath),
      `.studio-${process.pid}-${Date.now()}.tmp`,
    );
    const manifestPath = path.join(this.transactionsPath, `${transactionId}.json`);
    const manifest: EntityTransactionManifest = {
      api_version: "studio.guilherme.dev/transaction-v1",
      id: transactionId,
      entity_id: entityId(entity),
      target_path: path.relative(this.root, absolutePath),
      temporary_path: path.relative(this.root, tmpPath),
      ...(expectedRevision === undefined ? {} : { expected_revision: expectedRevision }),
      started_at: new Date().toISOString(),
    };
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o600 });
    try {
      const body = YAML.stringify(entity, { sortMapEntries: true, lineWidth: 120 });
      await writeFile(tmpPath, body, { mode: 0o600 });
      await rename(tmpPath, absolutePath);
      await rm(manifestPath, { force: true });
    } catch (error) {
      await rm(tmpPath, { force: true });
      throw error;
    }
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

  async list(): Promise<StudioEvent[]> {
    if (!(await fileExists(this.eventsPath))) {
      return [];
    }
    const body = await readFile(this.eventsPath, "utf8");
    return body
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => EventSchema.parse(JSON.parse(line)));
  }
}

export interface ProjectionStats {
  entityCount: number;
  relationCount: number;
  checksum: string;
  projectionRevision: number;
}

export class SQLiteProjection {
  readonly sqlitePath: string;

  constructor(sqlitePath: string) {
    this.sqlitePath = sqlitePath;
  }

  async rebuild(files: StudioFile[], events: StudioEvent[] = []): Promise<ProjectionStats> {
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
        CREATE TABLE events (
          id TEXT PRIMARY KEY,
          type TEXT NOT NULL,
          entity_id TEXT,
          actor_id TEXT,
          created_at TEXT NOT NULL,
          data_json TEXT NOT NULL
        );
        CREATE TABLE tasks (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          status TEXT NOT NULL,
          priority TEXT,
          economic_reason TEXT,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE money (
          id TEXT PRIMARY KEY,
          kind TEXT NOT NULL,
          status TEXT NOT NULL,
          amount REAL,
          currency TEXT,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE repositories (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          path TEXT,
          branch TEXT,
          remote_policy TEXT,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE next_actions (
          entity_id TEXT PRIMARY KEY,
          kind TEXT NOT NULL,
          title TEXT NOT NULL,
          priority TEXT,
          status TEXT NOT NULL
        );
        CREATE TABLE projection_meta (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
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
      const insertTask = db.prepare(`
        INSERT INTO tasks (id, title, status, priority, economic_reason, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const insertMoney = db.prepare(`
        INSERT INTO money (id, kind, status, amount, currency, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const insertRepository = db.prepare(`
        INSERT INTO repositories (id, title, path, branch, remote_policy, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const insertNextAction = db.prepare(`
        INSERT INTO next_actions (entity_id, kind, title, priority, status)
        VALUES (?, ?, ?, ?, ?)
      `);
      const insertEvent = db.prepare(`
        INSERT INTO events (id, type, entity_id, actor_id, created_at, data_json)
        VALUES (?, ?, ?, ?, ?, ?)
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
          if (entity.kind === "task") {
            insertTask.run(
              entityId(entity),
              entityTitle(entity),
              entityStatus(entity),
              typeof entity.spec.priority === "string" ? entity.spec.priority : null,
              typeof entity.spec.economic_reason === "string" ? entity.spec.economic_reason : null,
              entityUpdatedAt(entity),
            );
          }
          if (["invoice", "payment", "contract"].includes(entity.kind)) {
            const amount = Reflect.get(entity.spec, "amount");
            const currency = Reflect.get(entity.spec, "currency");
            insertMoney.run(
              entityId(entity),
              entity.kind,
              entityStatus(entity),
              typeof amount === "number" ? amount : null,
              typeof currency === "string" ? currency : null,
              entityUpdatedAt(entity),
            );
          }
          if (entity.kind === "repository") {
            const repositoryPath = Reflect.get(entity.spec, "path");
            const branch = Reflect.get(entity.spec, "branch");
            const remotePolicy = Reflect.get(entity.spec, "remote_policy");
            insertRepository.run(
              entityId(entity),
              entityTitle(entity),
              typeof repositoryPath === "string" ? repositoryPath : null,
              typeof branch === "string" ? branch : null,
              typeof remotePolicy === "string" ? remotePolicy : null,
              entityUpdatedAt(entity),
            );
          }
          if (
            entity.kind === "task" &&
            !["done", "archived", "cancelled"].includes(entityStatus(entity))
          ) {
            insertNextAction.run(
              entityId(entity),
              entity.kind,
              entityTitle(entity),
              typeof entity.spec.priority === "string" ? entity.spec.priority : null,
              entityStatus(entity),
            );
          }
        }
      });
      tx(files);
      const eventTx = db.transaction((entries: StudioEvent[]) => {
        for (const event of entries) {
          insertEvent.run(
            event.id,
            event.type,
            event.entity_id ?? null,
            event.actor_id ?? null,
            event.created_at,
            JSON.stringify(event.data),
          );
        }
      });
      eventTx(events);
      const checksum = projectionChecksum(files);
      const projectionRevision = files.reduce(
        (total, file) => total + entityRevision(file.entity),
        events.length,
      );
      db.prepare("INSERT INTO projection_meta (key, value) VALUES (?, ?)").run(
        "canonical_checksum",
        checksum,
      );
      db.prepare("INSERT INTO projection_meta (key, value) VALUES (?, ?)").run(
        "projection_revision",
        String(projectionRevision),
      );
    } finally {
      db.close();
    }
    await rename(tmpPath, this.sqlitePath);
    return {
      entityCount: files.length,
      relationCount: files.reduce((count, file) => count + file.entity.relations.length, 0),
      checksum: projectionChecksum(files),
      projectionRevision: files.reduce(
        (total, file) => total + entityRevision(file.entity),
        events.length,
      ),
    };
  }

  inspect(): {
    exists: boolean;
    sizeBytes: number;
    checksum?: string;
    projectionRevision?: number;
  } {
    try {
      const info = statSync(this.sqlitePath);
      const db = new Database(this.sqlitePath, { readonly: true });
      try {
        const row = db
          .prepare("SELECT value FROM projection_meta WHERE key = ?")
          .get("canonical_checksum") as { value?: string } | undefined;
        const revisionRow = db
          .prepare("SELECT value FROM projection_meta WHERE key = ?")
          .get("projection_revision") as { value?: string } | undefined;
        return {
          exists: true,
          sizeBytes: info.size,
          ...(row?.value ? { checksum: row.value } : {}),
          ...(revisionRow?.value
            ? { projectionRevision: Number.parseInt(revisionRow.value, 10) }
            : {}),
        };
      } finally {
        db.close();
      }
    } catch {
      return { exists: false, sizeBytes: 0 };
    }
  }

  queryNextActions(limit = 20): Array<{
    entity_id: string;
    kind: string;
    title: string;
    priority: string | null;
    status: string;
  }> {
    const db = new Database(this.sqlitePath, { readonly: true });
    try {
      return db
        .prepare(
          `SELECT entity_id, kind, title, priority, status
           FROM next_actions
           ORDER BY CASE priority
             WHEN 'now' THEN 0 WHEN 'high' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END,
             title
           LIMIT ?`,
        )
        .all(limit) as Array<{
        entity_id: string;
        kind: string;
        title: string;
        priority: string | null;
        status: string;
      }>;
    } finally {
      db.close();
    }
  }
}

export function projectionChecksum(files: StudioFile[]): string {
  const payload = [...files]
    .sort((a, b) => a.relativePath.localeCompare(b.relativePath))
    .map((file) => `${file.relativePath}:${JSON.stringify(file.entity)}`)
    .join("\n");
  return createHash("sha256").update(payload).digest("hex");
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
    const expectedPath = entityRelativePath(file.entity);
    if (file.relativePath !== expectedPath) {
      errors.push(`Canonical path mismatch for ${id}: expected ${expectedPath}`);
    }
    files.push(file);
  }
  for (const file of files) {
    const id = entityId(file.entity);
    if (file.entity.metadata.owner_id && !seen.has(file.entity.metadata.owner_id)) {
      errors.push(`Broken owner relation from ${id} to ${file.entity.metadata.owner_id}`);
    }
    for (const relation of file.entity.relations) {
      if (!seen.has(relation.target_id)) {
        errors.push(`Broken relation from ${id} to ${relation.target_id}`);
      }
    }
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
