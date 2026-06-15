import { describe, expect, it } from "vitest";
import { executeDisabledExternalAdapter } from "./index.js";

describe("adapter contracts", () => {
  it("keeps disabled external adapters blocked by default", async () => {
    const result = await executeDisabledExternalAdapter({
      adapter: "communication",
      operation: "send",
      payload: { channel: "email" },
    });

    expect(result).toMatchObject({
      adapter: "communication",
      operation: "send",
      status: "blocked",
      error: { code: "adapter_disabled" },
    });
  });
});
