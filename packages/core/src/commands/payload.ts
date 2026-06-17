export function stringValue(payload: Record<string, unknown>, key: string): string {
  const value = payloadValue(payload, key);
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${key} is required`);
  }
  return value;
}

export function optionalString(payload: Record<string, unknown>, key: string): string | undefined {
  const value = payloadValue(payload, key);
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function numberValue(payload: Record<string, unknown>, key: string): number {
  const value = payloadValue(payload, key);
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${key} is required`);
  }
  return value;
}

export function optionalNumber(payload: Record<string, unknown>, key: string): number | undefined {
  const value = payloadValue(payload, key);
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function stringArray(payload: Record<string, unknown>, key: string): string[] {
  const value = payloadValue(payload, key);
  if (value === undefined) {
    return [];
  }
  if (typeof value === "string" && value.length > 0) {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
  }
  throw new Error(`${key} must be a string or string array`);
}

export function payloadValue(payload: Record<string, unknown>, key: string): unknown {
  return Reflect.get(payload, key);
}
