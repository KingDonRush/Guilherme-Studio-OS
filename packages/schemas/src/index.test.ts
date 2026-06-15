import { describe, expect, it } from "vitest";
import {
  assertNoSecrets,
  createActor,
  createCommandEnvelope,
  createEntity,
  createResultEnvelope,
  entityId,
  entityRevision,
  entitySlug,
  findSecretLikePaths,
  slugify,
  stableChecksum,
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

  it("creates versioned command and result envelopes", () => {
    const actor = createActor({
      id: "per_20260614_guilherme-silva",
      type: "human",
      capabilities: ["entity.write"],
    });
    const command = createCommandEnvelope({
      command: "entity.create",
      actor,
      payload: { kind: "task", title: "Contract test" },
      idempotencyKey: "contract-test-001",
    });
    const result = createResultEnvelope({
      requestId: command.request_id,
      result: { entity_id: "tsk_20260614_contract-test" },
    });

    expect(result.request_id).toBe(command.request_id);
    expect(result.status).toBe("ok");
  });

  it("checksums objects independently of key insertion order", () => {
    expect(stableChecksum({ b: 2, a: 1 })).toBe(stableChecksum({ a: 1, b: 2 }));
  });
});
