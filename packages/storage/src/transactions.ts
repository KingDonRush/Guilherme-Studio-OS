import { randomUUID } from "node:crypto";
import { constants as fsConstants } from "node:fs";
import { access, mkdir, open, readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  entityId,
  entityRevision,
  type StudioEntity,
  TypedEntitySchema,
} from "@guilherme-studio/schemas";
import YAML from "yaml";

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

export interface EntityTransactionWriteEntry extends MultiEntityTransactionEntry {
  entity: StudioEntity;
}

export interface EntityLockInspection {
  id: string;
  path: string;
  pid?: number;
  createdAt?: string;
  stale: boolean;
}

type ReadEntityByPath = (absolutePath: string) => Promise<StudioEntity>;

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export class EntityLockManager {
  constructor(readonly locksPath: string) {}

  async withEntityLock<T>(id: string, action: () => Promise<T>): Promise<T> {
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

  async withEntityLocks<T>(ids: string[], action: () => Promise<T>): Promise<T> {
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

  async inspectLocks(): Promise<EntityLockInspection[]> {
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
}

export class EntityTransactionManager {
  constructor(
    readonly root: string,
    readonly transactionsPath: string,
    private readonly readByPath: ReadEntityByPath,
  ) {}

  async commitMany(entries: EntityTransactionWriteEntry[]): Promise<string[]> {
    await mkdir(this.transactionsPath, { recursive: true });
    const manifest: MultiEntityTransactionManifest = {
      api_version: "studio.guilherme.dev/transaction-v2",
      id: randomUUID(),
      entries: entries.map((entry) => ({
        entity_id: entry.entity_id,
        target_path: entry.target_path,
        temporary_path: entry.temporary_path,
        ...(entry.expected_revision === undefined
          ? {}
          : { expected_revision: entry.expected_revision }),
        next_revision: entry.next_revision,
      })),
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
  }

  async recoverTransactions(): Promise<{ recovered: number; discarded: number }> {
    await mkdir(this.transactionsPath, { recursive: true });
    const entries = await readdir(this.transactionsPath, { withFileTypes: true });
    let recovered = 0;
    let discarded = 0;
    for (const fileEntry of entries) {
      if (!fileEntry.isFile() || !fileEntry.name.endsWith(".json")) {
        continue;
      }
      const manifestPath = path.join(this.transactionsPath, fileEntry.name);
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

  async commitEntityWrite(
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
}
