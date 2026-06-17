export function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  return value as Record<string, unknown>;
}

export function recordValue(record: Record<string, unknown> | undefined, key: string): unknown {
  return record ? Reflect.get(record, key) : undefined;
}

export function recordString(
  record: Record<string, unknown> | undefined,
  key: string,
): string | undefined {
  const value = recordValue(record, key);
  return typeof value === "string" ? value : undefined;
}

export function recordStringArray(
  record: Record<string, unknown> | undefined,
  key: string,
): string[] {
  const value = recordValue(record, key);
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : [];
}
