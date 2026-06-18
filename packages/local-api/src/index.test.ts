import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import YAML from "yaml";
import { createLocalApi } from "./index.js";

describe("local API", () => {
  it("enforces local host, origin and session authentication", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "studio-api-security-test-"));
    await writeFile(
      path.join(root, "studio.config.yaml"),
      YAML.stringify({
        api_version: "studio.guilherme.dev/config-v1",
        root_name: "Security Test Studio",
        operator_id: "per_20260614_guilherme-silva",
        canonical_roots: ["data", "operations"],
        runtime_path: "runtime",
        panel: { host: "127.0.0.1", port: 47832 },
        adapters: {},
      }),
    );
    const { app, token } = await createLocalApi({ root });
    const headers = {
      host: "127.0.0.1:47832",
      "content-type": "application/json",
    };

    const missingToken = await app.inject({
      method: "GET",
      url: "/api/v1/summary",
      headers,
    });
    expect(missingToken.statusCode).toBe(401);
    expect(missingToken.json()).toMatchObject({ error: "Unauthorized" });

    const invalidBearer = await app.inject({
      method: "GET",
      url: "/api/v1/summary",
      headers: { ...headers, authorization: "Bearer wrong-token" },
    });
    expect(invalidBearer.statusCode).toBe(401);
    expect(invalidBearer.json()).toMatchObject({ error: "Unauthorized" });

    const validOrigin = await app.inject({
      method: "GET",
      url: "/api/v1/summary",
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
        origin: "http://127.0.0.1:47832",
      },
    });
    expect(validOrigin.statusCode).toBe(200);

    const panelBootstrap = await app.inject({
      method: "GET",
      url: "/",
      headers,
    });
    const setCookie = panelBootstrap.headers["set-cookie"];
    expect(String(setCookie)).toContain("studio_session=");
    expect(String(setCookie)).toContain("HttpOnly");
    expect(String(setCookie)).toContain("SameSite=Strict");

    const cookieAuth = await app.inject({
      method: "GET",
      url: "/api/v1/summary",
      headers: { ...headers, cookie: `studio_session=${token}` },
    });
    expect(cookieAuth.statusCode).toBe(200);
    await app.close();
  });

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

    const invalidHost = await app.inject({
      method: "GET",
      url: "/api/v1/summary",
      headers: { ...headers, host: "evil.test" },
    });
    expect(invalidHost.statusCode).toBe(403);
    expect(invalidHost.json()).toMatchObject({ error: "Invalid host" });

    const invalidOrigin = await app.inject({
      method: "GET",
      url: "/api/v1/summary",
      headers: { ...headers, origin: "http://evil.test" },
    });
    expect(invalidOrigin.statusCode).toBe(403);
    expect(invalidOrigin.json()).toMatchObject({ error: "Invalid origin" });

    const created = await app.inject({
      method: "POST",
      url: "/api/v1/entities",
      headers,
      payload: { kind: "task", title: "API task" },
    });
    expect(created.statusCode).toBe(200);
    expect(created.json()).toMatchObject({
      api_version: "studio.guilherme.dev/v1",
      status: "ok",
      result: {
        action: "entity.create",
        entity: { kind: "task" },
      },
      warnings: [],
      required_actions: [],
    });
    const prospect = await app.inject({
      method: "POST",
      url: "/api/v1/entities",
      headers,
      payload: { kind: "prospect", title: "Qualified agency" },
    });
    const prospectId = prospect.json().result.entity_id as string;
    const qualification = await app.inject({
      method: "POST",
      url: `/api/v1/prospects/${prospectId}/qualify`,
      headers,
      payload: { rationale: "Needs Elementor implementation capacity", score: 88 },
    });
    expect(qualification.json()).toMatchObject({
      status: "ok",
      result: {
        action: "prospect.qualify",
        entity_id: prospectId,
      },
    });

    const coverage = await app.inject({
      method: "GET",
      url: "/api/v1/coverage",
      headers,
    });
    expect(coverage.json()).toMatchObject({
      status: "ok",
      result: {
        summary: {
          missing_capability: 0,
        },
      },
    });
    expect(coverage.json().result.summary.needs_intake).toBeGreaterThan(0);

    const workflows = await app.inject({
      method: "GET",
      url: "/api/v1/workflows",
      headers,
    });
    expect(workflows.json()).toMatchObject({
      status: "ok",
      result: {
        ok: true,
        mode: "executed-fixtures",
      },
    });

    const agentStart = await app.inject({
      method: "POST",
      url: "/api/v1/commands/execute",
      headers,
      payload: {
        command: "agent.start",
        idempotency_key: "api-agent-start",
        payload: {
          objective: "Expose AgentRun surfaces through the local API.",
          allowed: ["read_context"],
          prohibited: ["external_send"],
        },
      },
    });
    const runId = agentStart.json().result.entity_id as string;
    await app.inject({
      method: "POST",
      url: "/api/v1/commands/execute",
      headers,
      payload: {
        command: "agent.context",
        target_id: runId,
        idempotency_key: "api-agent-context",
        payload: { next_valid_action: "Inspect the API harness report." },
      },
    });
    await app.inject({
      method: "POST",
      url: "/api/v1/commands/execute",
      headers,
      payload: {
        command: "agent.handoff",
        target_id: runId,
        idempotency_key: "api-agent-handoff",
        payload: {
          summary: "Local API exposes AgentRun handoff state.",
          next_valid_action: "Use /api/v1/agent-runs before resuming.",
        },
      },
    });
    const agentHarness = await app.inject({
      method: "GET",
      url: "/api/v1/agent-runs",
      headers,
    });
    expect(agentHarness.json()).toMatchObject({
      status: "ok",
      result: {
        summary: {
          total_runs: 1,
          context_pack_count: 1,
          handoff_count: 1,
        },
        runs: [
          {
            id: runId,
            state: "handoff_ready",
            context_pack: {
              next_valid_action: "Inspect the API harness report.",
            },
            handoff: {
              next_valid_action: "Use /api/v1/agent-runs before resuming.",
            },
          },
        ],
      },
    });
    const contextPack = await app.inject({
      method: "GET",
      url: `/api/v1/agent-runs/${runId}/context-pack`,
      headers,
    });
    expect(contextPack.json().result).toMatchObject({
      run_id: runId,
      next_valid_action: "Inspect the API harness report.",
    });
    const handoff = await app.inject({
      method: "GET",
      url: `/api/v1/agent-runs/${runId}/handoff`,
      headers,
    });
    expect(handoff.json().result).toMatchObject({
      run_id: runId,
      status: "ready",
      next_valid_action: "Use /api/v1/agent-runs before resuming.",
    });

    const acceptance = await app.inject({
      method: "GET",
      url: "/api/v1/acceptance",
      headers,
    });
    expect(acceptance.json()).toMatchObject({
      status: "blocked",
      result: {
        portfolio_release: { allowed: false },
      },
      required_actions: ["resolve_acceptance_blockers_before_portfolio"],
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
    expect(action.result.status).toBe("awaiting_confirmation");

    const confirmed = await app.inject({
      method: "POST",
      url: `/api/v1/prepared-actions/${action.result.id}/confirm`,
      headers,
      payload: { payload_checksum: action.result.payload_checksum },
    });
    expect(confirmed.json().result.status).toBe("confirmed");
    await app.close();
  });
});
