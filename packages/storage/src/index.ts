import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  assertNoSecrets,
  entityId,
  entityRevision,
  type StudioEntity,
  TypedEntitySchema,
} from "@guilherme-studio/schemas";
import YAML from "yaml";
import {
  type CanonicalMigrationResult,
  migrateCanonicalV1WithStore,
  validateCanonicalFilesWithStore,
} from "./canonical.js";
import { entityRelativePath, fileExists, type StudioFile, scanStudioFiles } from "./files.js";
import { resolveInsideRoot } from "./paths.js";

export type { CanonicalMigrationPlanEntry, CanonicalMigrationResult } from "./canonical.js";
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
  return validateCanonicalFilesWithStore(root, (storeRoot) => new EntityStore(storeRoot));
}

export async function migrateCanonicalV1(
  root: string,
  options: { dryRun?: boolean } = {},
): Promise<CanonicalMigrationResult> {
  return migrateCanonicalV1WithStore(root, options, (storeRoot) => new EntityStore(storeRoot));
}
