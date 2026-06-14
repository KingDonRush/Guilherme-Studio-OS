import { describe, expect, it } from "vitest";
import { assertNoSecrets, createEntity, findSecretLikePaths, slugify } from "./index.js";

describe("schemas", () => {
  it("creates deterministic entities from business input", () => {
    const entity = createEntity({
      kind: "product",
      title: "Simple Budget Plugin",
      classification: "public",
    });

    expect(entity.id).toBe("prd_db6f7a9dd954fe4ba1ac");
    expect(entity.slug).toBe("simple-budget-plugin");
    expect(entity.revision).toBe(1);
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
