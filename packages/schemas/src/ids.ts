import { createHash, randomUUID } from "node:crypto";
import { ENTITY_PREFIX, type EntityKind } from "./entities/kinds.js";

export function nowIso(): string {
  return new Date().toISOString();
}
export function dateStamp(input = new Date()): string {
  return input.toISOString().slice(0, 10).replaceAll("-", "");
}
export function createEntityId(kind: EntityKind, seed?: string, createdAt?: string): string {
  const prefix = ENTITY_PREFIX[kind];
  const stamp = createdAt ? createdAt.slice(0, 10).replaceAll("-", "") : dateStamp();
  if (!seed) {
    return `${prefix}_${stamp}_${randomUUID().replaceAll("-", "").slice(0, 12)}`;
  }
  return `${prefix}_${stamp}_${slugify(seed)}`;
}
export function createRecordId(
  prefix: "act" | "cmd" | "evt" | "req" | "cnf",
  seed?: string,
): string {
  const stamp = dateStamp();
  if (!seed) {
    return `${prefix}_${stamp}_${randomUUID().replaceAll("-", "").slice(0, 12)}`;
  }
  const digest = createHash("sha256").update(`${prefix}:${seed}`).digest("hex").slice(0, 12);
  return `${prefix}_${stamp}_${digest}`;
}
export function slugify(input: string): string {
  const normalized = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
  return normalized || "item";
}
export function stableChecksum(value: unknown): string {
  return createHash("sha256").update(stableStringify(value)).digest("hex");
}
export function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`);
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(value);
}
