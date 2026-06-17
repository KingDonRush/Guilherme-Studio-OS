import {
  EntityStore,
  EventStore,
  loadStudioConfig,
  SQLiteProjection,
  type StudioConfig,
  type StudioPaths,
} from "@guilherme-studio/storage";

export interface StudioContext {
  config: StudioConfig;
  paths: StudioPaths;
  entities: EntityStore;
  events: EventStore;
  projection: SQLiteProjection;
}

export async function createStudioContext(root = process.cwd()): Promise<StudioContext> {
  const { config, paths } = await loadStudioConfig(root);
  return {
    config,
    paths,
    entities: new EntityStore(paths.root, paths.runtime),
    events: new EventStore(paths.eventsPath),
    projection: new SQLiteProjection(paths.sqlitePath),
  };
}
