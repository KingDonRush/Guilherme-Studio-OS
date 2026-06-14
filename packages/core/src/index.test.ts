import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LifecycleEngine, PreparedActionService, type StudioContext } from "./index.js";

describe("core governance", () => {
  it("rejects invalid terminal lifecycle transitions", () => {
    const lifecycle = new LifecycleEngine();

    expect(lifecycle.canTransition("opportunity", "active", "won")).toBe(true);
    expect(() => lifecycle.assertTransition("opportunity", "won", "active")).toThrow(
      /Invalid opportunity lifecycle transition/,
    );
  });

  it("confirms and executes only the exact prepared payload", async () => {
    const runtime = await mkdtemp(path.join(os.tmpdir(), "studio-core-test-"));
    const context = {
      config: { operator_id: "per_20260614_guilherme-silva" },
      paths: { runtime },
    } as StudioContext;
    const service = new PreparedActionService(context);
    const prepared = await service.prepare({
      actionType: "communication.send",
      payload: { channel: "whatsapp", message: "Hello" },
    });

    await expect(service.confirm(prepared.id, "0".repeat(64))).rejects.toThrow(
      /payload checksum mismatch/,
    );
    const confirmed = await service.confirm(prepared.id, prepared.payload_checksum);
    expect(confirmed.status).toBe("confirmed");

    const executed = await service.execute(prepared.id, async () => ({ message_id: "local-test" }));
    expect(executed.status).toBe("executed");
    expect(executed.reconciliation).toEqual({ message_id: "local-test" });
  });
});
