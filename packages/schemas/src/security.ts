const secretKeyPattern =
  /(api[_-]?key|token|secret|password|passwd|oauth|credential|private[_-]?key)/i;
export function findSecretLikePaths(value: unknown, path: string[] = []): string[] {
  const hits: string[] = [];
  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      hits.push(...findSecretLikePaths(entry, [...path, String(index)]));
    });
    return hits;
  }
  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      const nextPath = [...path, key];
      if (secretKeyPattern.test(key)) {
        hits.push(nextPath.join("."));
      }
      hits.push(...findSecretLikePaths(nested, nextPath));
    }
  }
  return [...new Set(hits)];
}
export function assertNoSecrets(value: unknown): void {
  const hits = findSecretLikePaths(value);
  if (hits.length > 0) {
    throw new Error(
      `Secret-like fields are not allowed in canonical Studio files: ${hits.join(", ")}`,
    );
  }
}
