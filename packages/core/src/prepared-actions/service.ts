import { mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  assertNoSecrets,
  createRecordId,
  nowIso,
  type PreparedAction,
  PreparedActionSchema,
  stableChecksum,
} from "@guilherme-studio/schemas";
import type { StudioContext } from "../context.js";

export class PreparedActionService {
  readonly directory: string;

  constructor(readonly context: StudioContext) {
    this.directory = path.join(context.paths.runtime, "prepared-actions");
  }

  async prepare(input: {
    actionType: string;
    payload: Record<string, unknown>;
    actorId?: string;
    ttlSeconds?: number;
    provider?: string;
    target?: string;
    sourceRevisions?: Record<string, number>;
  }): Promise<PreparedAction> {
    assertNoSecrets(input.payload);
    const createdAt = nowIso();
    const action = PreparedActionSchema.parse({
      api_version: "studio.guilherme.dev/prepared-action-v1",
      id: createRecordId(
        "act",
        `${input.actionType}:${createdAt}:${JSON.stringify(input.payload)}`,
      ),
      action_type: input.actionType,
      provider: input.provider,
      target: input.target,
      created_at: createdAt,
      updated_at: createdAt,
      expires_at: new Date(Date.parse(createdAt) + (input.ttlSeconds ?? 900) * 1000).toISOString(),
      actor_id: input.actorId ?? this.context.config.operator_id,
      source_revisions: input.sourceRevisions ?? {},
      payload: input.payload,
      payload_checksum: stableChecksum(input.payload),
      status: "awaiting_confirmation",
    });
    await this.write(action);
    return action;
  }

  async get(id: string): Promise<PreparedAction> {
    const action = PreparedActionSchema.parse(
      JSON.parse(await readFile(path.join(this.directory, `${id}.json`), "utf8")),
    );
    if (
      ["draft", "validated", "awaiting_confirmation", "confirmed"].includes(action.status) &&
      Date.parse(action.expires_at) <= Date.now()
    ) {
      const expired = PreparedActionSchema.parse({
        ...action,
        status: "expired",
        updated_at: nowIso(),
      });
      await this.write(expired);
      return expired;
    }
    return action;
  }

  async list(): Promise<PreparedAction[]> {
    await mkdir(this.directory, { recursive: true });
    const files = (await readdir(this.directory))
      .filter((entry) => entry.endsWith(".json"))
      .sort((a, b) => a.localeCompare(b));
    return Promise.all(files.map((file) => this.get(file.slice(0, -5))));
  }

  async confirm(id: string, payloadChecksum: string): Promise<PreparedAction> {
    const action = await this.get(id);
    if (action.status !== "awaiting_confirmation") {
      throw new Error(`Prepared action cannot be confirmed from status ${action.status}`);
    }
    if (action.payload_checksum !== payloadChecksum) {
      throw new Error(`Prepared action payload checksum mismatch: ${id}`);
    }
    const confirmed = PreparedActionSchema.parse({
      ...action,
      status: "confirmed",
      updated_at: nowIso(),
      confirmation_id: createRecordId("cnf", `${id}:${payloadChecksum}:${nowIso()}`),
      confirmed_at: nowIso(),
    });
    await this.write(confirmed);
    return confirmed;
  }

  async execute(
    id: string,
    executor: (action: PreparedAction) => Promise<Record<string, unknown>>,
  ): Promise<PreparedAction> {
    const action = await this.get(id);
    if (action.status !== "confirmed") {
      throw new Error(`Prepared action must be confirmed before execution: ${id}`);
    }
    const executing = PreparedActionSchema.parse({
      ...action,
      status: "executing",
      updated_at: nowIso(),
      execution_started_at: nowIso(),
    });
    await this.write(executing);
    try {
      const execution = await executor(executing);
      const executed = PreparedActionSchema.parse({
        ...executing,
        status: "executed",
        updated_at: nowIso(),
        executed_at: nowIso(),
        reconciliation: execution,
      });
      await this.write(executed);
      return executed;
    } catch (error) {
      const failed = PreparedActionSchema.parse({
        ...executing,
        status: "failed",
        updated_at: nowIso(),
        failure: error instanceof Error ? error.message : String(error),
      });
      await this.write(failed);
      throw error;
    }
  }

  async reconcile(id: string, result: Record<string, unknown>): Promise<PreparedAction> {
    const action = await this.get(id);
    if (action.status !== "executed") {
      throw new Error(`Prepared action must be executed before reconciliation: ${id}`);
    }
    const reconciled = PreparedActionSchema.parse({
      ...action,
      status: "reconciled",
      updated_at: nowIso(),
      reconciled_at: nowIso(),
      reconciliation: {
        ...(action.reconciliation ?? {}),
        ...result,
      },
    });
    await this.write(reconciled);
    return reconciled;
  }

  async revise(id: string, payload: Record<string, unknown>): Promise<PreparedAction> {
    assertNoSecrets(payload);
    const action = await this.get(id);
    if (!["awaiting_confirmation", "confirmed"].includes(action.status)) {
      throw new Error(`Prepared action cannot be revised from status ${action.status}`);
    }
    const revised = PreparedActionSchema.parse({
      ...action,
      payload,
      payload_checksum: stableChecksum(payload),
      status: "awaiting_confirmation",
      confirmation_id: undefined,
      confirmed_at: undefined,
      updated_at: nowIso(),
    });
    await this.write(revised);
    return revised;
  }

  private async write(action: PreparedAction): Promise<void> {
    await mkdir(this.directory, { recursive: true });
    const target = path.join(this.directory, `${action.id}.json`);
    const temporary = path.join(this.directory, `.action-${process.pid}-${Date.now()}.tmp`);
    await writeFile(temporary, `${JSON.stringify(action, null, 2)}\n`, { mode: 0o600 });
    await rename(temporary, target);
  }
}
