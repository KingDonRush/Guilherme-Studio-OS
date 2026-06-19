import { createHash } from "node:crypto";
import { statSync } from "node:fs";
import { mkdir, rename, rm } from "node:fs/promises";
import path from "node:path";
import {
  entityClassification,
  entityId,
  entityRevision,
  entitySlug,
  entityStatus,
  entityTitle,
  entityUpdatedAt,
  type StudioEvent,
} from "@guilherme-studio/schemas";
import Database from "better-sqlite3";
import type { StudioFile } from "./files.js";

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
