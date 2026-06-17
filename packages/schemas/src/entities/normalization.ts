function camelToSnake(input: string): string {
  return input.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}
function normalizeSpecValue(value: unknown, idMap: Record<string, string> = {}): unknown {
  if (typeof value === "string") {
    return idMap[value] ?? value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalizeSpecValue(item, idMap));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        camelToSnake(key),
        normalizeSpecValue(item, idMap),
      ]),
    );
  }
  return value;
}
export function normalizeSpecData(
  value: Record<string, unknown>,
  idMap: Record<string, string> = {},
): Record<string, unknown> {
  return normalizeSpecValue(value, idMap) as Record<string, unknown>;
}
