import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import YAML from "yaml";
import { createLocalApi } from "./index.js";

describe("local API", () => {
  it("uses the normalized core result and governed prepared actions", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "studio-api-test-"));
    await writeFile(
      path.join(root, "studio.config.yaml"),
      YAML.stringify({
        api_version: "studio.guilherme.dev/config-v1",
        root_name: "Test Studio",
        operator_id: "per_20260614_guilherme-silva",
        canonical_roots: ["data", "operations"],
        runtime_path: "runtime",
        panel: { host: "127.0.0.1", port: 47831 },
        adapters: {},
      }),
    );
    const { app, token } = await createLocalApi({ root });
    const headers = {
      host: "127.0.0.1:47831",
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    };

    const created = await app.inject({
      method: "POST",
      url: "/api/v1/entities",
      headers,
      payload: { kind: "task", title: "API task" },
    });
    expect(created.statusCode).toBe(200);
    expect(created.json()).toMatchObject({
      ok: true,
      action: "entity.create",
      data: { kind: "task" },
      errors: [],
    });

    const prepared = await app.inject({
      method: "POST",
      url: "/api/v1/prepared-actions",
      headers,
      payload: {
        action_type: "communication.send",
        payload: { channel: "email", subject: "Hello" },
      },
    });
    const action = prepared.json();
    expect(action.status).toBe("prepared");

    const confirmed = await app.inject({
      method: "POST",
      url: `/api/v1/prepared-actions/${action.id}/confirm`,
      headers,
      payload: { payload_checksum: action.payload_checksum },
    });
    expect(confirmed.json().status).toBe("confirmed");
    await app.close();
  });
});
