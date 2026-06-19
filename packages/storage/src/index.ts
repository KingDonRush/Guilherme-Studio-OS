import { createHash } from "node:crypto";
import { statSync } from "node:fs";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  assertNoSecrets,
  entityClassification,
  entityId,
  entityRevision,
  entitySlug,
  entityStatus,
  entityTitle,
  entityUpdatedAt,
  legacyToCanonical,
  normalizeSpecData,
  type StudioEntity,
  type StudioEvent,
  TypedEntitySchema,
} from "@guilherme-studio/schemas";
import Database from "better-sqlite3";
import YAML from "yaml";
import {
  entityRelativePath,
  fileExists,
  LegacyEntityStore,
  type StudioFile,
  scanCanonicalFilesLenient,
  scanStudioFiles,
} from "./files.js";
import { resolveInsideRoot } from "./paths.js";
import {
  EntityLockManager,
  EntityTransactionManager,
  type EntityTransactionWriteEntry,
} from "./transactions.js";

export { EventStore } from "./events.js";
export {
  entityRelativePath,
  LegacyEntityStore,
  type LegacyStudioFile,
  type StudioFile,
} from "./files.js";
export {
  ensureStudioRuntime,
  loadStudioConfig,
  resolveInsideRoot,
  type StudioConfig,
  type StudioPaths,
} from "./paths.js";

export class EntityStore {
  readonly root: string;
  readonly runtime: string;
  readonly locksPath: string;
  readonly transactionsPath: string;
  private readonly lockManager: EntityLockManager;
  private readonly transactionManager: EntityTransactionManager;

  constructor(root: string, runtime = path.join(root, "runtime")) {
    this.root = root;
    this.runtime = runtime;
    this.locksPath = path.join(runtime, "locks");
    this.transactionsPath = path.join(runtime, "transactions");
    this.lockManager = new EntityLockManager(this.locksPath);
    this.transactionManager = new EntityTransactionManager(
      this.root,
      this.transactionsPath,
      (absolutePath) => this.readByPath(absolutePath),
    );
  }

  async put(entity: StudioEntity, expectedRevision?: number): Promise<string> {
    assertNoSecrets(entity);
    const parsed = TypedEntitySchema.parse(entity);
    const relativePath = entityRelativePath(parsed);
    const absolutePath = await resolveInsideRoot(this.root, relativePath);
    await this.lockManager.withEntityLock(entityId(parsed), async () => {
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
      await this.transactionManager.commitEntityWrite(parsed, absolutePath, expectedRevision);
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

    return this.lockManager.withEntityLocks(ids, async () => {
      const entries: EntityTransactionWriteEntry[] = [];
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

      return this.transactionManager.commitMany(entries);
    });
  }

  async recoverTransactions(): Promise<{ recovered: number; discarded: number }> {
    return this.transactionManager.recoverTransactions();
  }

  async pendingTransactions(): Promise<string[]> {
    return this.transactionManager.pendingTransactions();
  }

  async inspectLocks(): Promise<
    Array<{ id: string; path: string; pid?: number; createdAt?: string; stale: boolean }>
  > {
    return this.lockManager.inspectLocks();
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
    return scanStudioFiles(this.root, (absolutePath) => this.readByPath(absolutePath));
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
