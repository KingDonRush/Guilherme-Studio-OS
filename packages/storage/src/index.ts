import {
  type CanonicalMigrationResult,
  migrateCanonicalV1WithStore,
  validateCanonicalFilesWithStore,
} from "./canonical.js";
import { EntityStore } from "./entity-store.js";
import type { StudioFile } from "./files.js";

export type { CanonicalMigrationPlanEntry, CanonicalMigrationResult } from "./canonical.js";
export { EntityStore } from "./entity-store.js";
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
export { type ProjectionStats, projectionChecksum, SQLiteProjection } from "./projection.js";

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
