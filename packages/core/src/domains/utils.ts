import type { StudioEntity } from "@guilherme-studio/schemas";

export function normalizeComparable(input: string): string {
  return input.trim().toLowerCase();
}

export function normalizeUrl(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}

export function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter((value) => typeof value === "string" && value.length > 0))];
}

export function mergeRelations(
  current: StudioEntity["relations"],
  additions: StudioEntity["relations"],
): StudioEntity["relations"] {
  const seen = new Set(current.map((relation) => `${relation.type}:${relation.target_id}`));
  const next = [...current];
  for (const relation of additions) {
    const key = `${relation.type}:${relation.target_id}`;
    if (!seen.has(key)) {
      next.push(relation);
      seen.add(key);
    }
  }
  return next;
}
