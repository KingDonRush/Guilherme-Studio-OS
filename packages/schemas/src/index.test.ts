import { describe, expect, it } from "vitest";
import {
  assertNoSecrets,
  createEntity,
  entityId,
  entityRevision,
  entitySlug,
  findSecretLikePaths,
  slugify,
} from "./index.js";

describe("schemas", () => {
  it("creates deterministic entities from business input", () => {
    const entity = createEntity({
      kind: "product",
      title: "Simple Budget Plugin",
      classification: "public",
    });

    expect(entityId(entity)).toMatch(/^prod_\d{8}_simple-budget-plugin$/);
    expect(entitySlug(entity)).toBe("simple-budget-plugin");
    expect(entityRevision(entity)).toBe(1);
  });

  it("normalizes slugs without preserving accents", () => {
    expect(slugify("Portfólio WordPress / São Paulo")).toBe("portfolio-wordpress-sao-paulo");
  });

  it("rejects secret-like canonical fields", () => {
    const payload = { data: { apiKey: "should-not-be-here" } };

    expect(findSecretLikePaths(payload)).toEqual(["data.apiKey"]);
    expect(() => assertNoSecrets(payload)).toThrow(/Secret-like fields/);
  });
});
