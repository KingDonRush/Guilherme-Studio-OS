import type { FastifyInstance } from "fastify";
import { type LocalCommandRunner, normalizeEntityKind } from "../command-runner.js";

export function registerMutationRoutes(app: FastifyInstance, runCommand: LocalCommandRunner): void {
  app.post<{ Body: Record<string, unknown> }>("/api/v1/commands/dry-run", async (request) =>
    runCommand({ ...request.body, dry_run: true }),
  );

  app.post<{ Body: Record<string, unknown> }>("/api/v1/commands/execute", async (request) =>
    runCommand({ ...request.body, dry_run: false }),
  );

  app.post<{
    Body: {
      kind: string;
      title: string;
      summary?: string;
      classification?: "public" | "internal" | "confidential";
    };
  }>("/api/v1/entities", async (request, reply) => {
    const body = request.body;
    if (!body || typeof body.kind !== "string" || typeof body.title !== "string") {
      return reply.code(400).send({ ok: false, errors: ["kind and title are required"] });
    }
    return runCommand({
      command: "entity.create",
      payload: {
        kind: normalizeEntityKind(body.kind),
        title: body.title,
        classification: body.classification ?? "internal",
        ...(body.summary ? { summary: body.summary } : {}),
      },
    });
  });

  app.post<{
    Body: { action_type: string; payload: Record<string, unknown>; ttl_seconds?: number };
  }>("/api/v1/prepared-actions", async (request, reply) => {
    const body = request.body;
    if (
      !body ||
      typeof body.action_type !== "string" ||
      !body.payload ||
      typeof body.payload !== "object"
    ) {
      return reply.code(400).send({ ok: false, errors: ["action_type and payload are required"] });
    }
    return runCommand({
      command: "action.prepare",
      payload: {
        action_type: body.action_type,
        payload: body.payload,
        ...(body.ttl_seconds ? { ttl_seconds: body.ttl_seconds } : {}),
      },
    });
  });

  app.post<{
    Params: { id: string };
    Body: { payload_checksum: string };
  }>("/api/v1/prepared-actions/:id/confirm", async (request, reply) => {
    if (!request.body || typeof request.body.payload_checksum !== "string") {
      return reply.code(400).send({ ok: false, errors: ["payload_checksum is required"] });
    }
    return runCommand({
      command: "action.confirm",
      payload: {
        action_id: request.params.id,
        payload_checksum: request.body.payload_checksum,
      },
    });
  });

  app.post<{
    Params: { id: string };
    Body: { rationale: string; score: number; qualified?: boolean };
  }>("/api/v1/prospects/:id/qualify", async (request, reply) => {
    if (
      !request.body ||
      typeof request.body.rationale !== "string" ||
      typeof request.body.score !== "number"
    ) {
      return reply.code(400).send({ ok: false, errors: ["rationale and score are required"] });
    }
    return runCommand({
      command: "prospect.qualify",
      target_id: request.params.id,
      payload: {
        rationale: request.body.rationale,
        score: request.body.score,
        qualified: request.body.qualified ?? true,
      },
    });
  });

  app.post<{
    Body: {
      title: string;
      evidence_type: "file" | "url" | "command" | "screenshot" | "backup" | "decision" | "manual";
      subject_id?: string;
      path?: string;
      url?: string;
      command?: string;
      checksum?: string;
    };
  }>("/api/v1/evidence", async (request, reply) => {
    if (!request.body || typeof request.body.title !== "string") {
      return reply.code(400).send({ ok: false, errors: ["title is required"] });
    }
    const body = request.body;
    return runCommand({
      command: "evidence.register",
      payload: {
        title: body.title,
        evidence_type: body.evidence_type,
        ...(body.subject_id ? { subject_id: body.subject_id } : {}),
        ...(body.path ? { path: body.path } : {}),
        ...(body.url ? { url: body.url } : {}),
        ...(body.command ? { command: body.command } : {}),
        ...(body.checksum ? { checksum: body.checksum } : {}),
      },
    });
  });
}
