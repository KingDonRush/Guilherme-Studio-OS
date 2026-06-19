import { readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  assertNoSecrets,
  entityId,
  entityRevision,
  legacyToCanonical,
  normalizeSpecData,
  type StudioEntity,
  TypedEntitySchema,
} from "@guilherme-studio/schemas";
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

export { type ProjectionStats, projectionChecksum, SQLiteProjection } from "./projection.js";

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
