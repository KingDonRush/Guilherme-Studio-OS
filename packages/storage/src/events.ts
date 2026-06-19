import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { assertNoSecrets, EventSchema, type StudioEvent } from "@guilherme-studio/schemas";
import { fileExists } from "./files.js";

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
      .map((line) => normalizeEventRecord(JSON.parse(line)));
  }
}

function normalizeEventRecord(value: unknown): StudioEvent {
  const parsed = value as Record<string, unknown>;
  if ("apiVersion" in parsed || "createdAt" in parsed) {
    const legacy = parsed as {
      id?: unknown;
      type?: unknown;
      entityId?: unknown;
      actorId?: unknown;
      createdAt?: unknown;
      data?: unknown;
    };
    return EventSchema.parse({
      api_version: "studio.guilherme.dev/event-v1",
      id: legacy.id,
      type: legacy.type,
      entity_id: legacy.entityId,
      actor_id: legacy.actorId,
      created_at: legacy.createdAt,
      data:
        legacy.data && typeof legacy.data === "object" && !Array.isArray(legacy.data)
          ? legacy.data
          : {},
    });
  }
  return EventSchema.parse(value);
}
