import { rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import {
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
  LegacyEntityStore,
  type StudioFile,
  scanCanonicalFilesLenient,
} from "./files.js";

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

export interface CanonicalEntityStore {
  scan(): Promise<StudioFile[]>;
  put(entity: StudioEntity, expectedRevision?: number): Promise<string>;
}

export async function validateCanonicalFilesWithStore(
  root: string,
  createStore: (root: string) => CanonicalEntityStore,
): Promise<{ files: StudioFile[]; errors: string[] }> {
  const store = createStore(root);
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

export async function migrateCanonicalV1WithStore(
  root: string,
  options: { dryRun?: boolean } = {},
  createStore: (root: string) => CanonicalEntityStore,
): Promise<CanonicalMigrationResult> {
  const legacyStore = new LegacyEntityStore(root);
  const legacyFiles = await legacyStore.scan();
  const canonicalStore = createStore(root);
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
