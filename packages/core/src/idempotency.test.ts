import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  createActor,
  createCommandEnvelope,
  createResultEnvelope,
} from "@guilherme-studio/schemas";
import { describe, expect, it, vi } from "vitest";
import { IdempotencyStore } from "./idempotency.js";

describe("idempotency", () => {
  it("replays an identical command and rejects key reuse with another payload", async () => {
    const runtime = await mkdtemp(path.join(os.tmpdir(), "studio-idempotency-"));
    const actor = createActor({
      id: "per_20260614_guilherme-silva",
      type: "human",
      capabilities: ["entity.write"],
    });
    const command = createCommandEnvelope({
      command: "entity.create",
      actor,
      payload: { title: "One" },
      idempotencyKey: "idempotency-test-key",
    });
    const operation = vi.fn(async () =>
      createResultEnvelope({ requestId: command.request_id, result: { created: true } }),
    );
    const store = new IdempotencyStore(runtime);

    expect((await store.execute(command, operation)).replayed).toBe(false);
    expect((await store.execute(command, operation)).replayed).toBe(true);
    expect(operation).toHaveBeenCalledTimes(1);

    const conflicting = createCommandEnvelope({
      command: "entity.create",
      actor,
      payload: { title: "Two" },
      idempotencyKey: "idempotency-test-key",
    });
    await expect(
      store.execute(conflicting, async () => createResultEnvelope({ result: null })),
    ).rejects.toThrow(/different command/);
  });
});
