import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  assertNoSecrets,
  type CommandEnvelope,
  type ResultEnvelope,
  ResultEnvelopeSchema,
  stableChecksum,
} from "@guilherme-studio/schemas";

interface IdempotencyRecord {
  api_version: "studio.guilherme.dev/idempotency-v1";
  key: string;
  command_checksum: string;
  created_at: string;
  result: ResultEnvelope;
}

function safeKey(key: string): string {
  return stableChecksum(key);
}

export class IdempotencyStore {
  readonly directory: string;

  constructor(runtimePath: string) {
    this.directory = path.join(runtimePath, "idempotency");
  }

  async execute(
    command: CommandEnvelope,
    operation: () => Promise<ResultEnvelope>,
  ): Promise<{ result: ResultEnvelope; replayed: boolean }> {
    if (!command.idempotency_key) {
      return { result: await operation(), replayed: false };
    }
    const checksum = stableChecksum({
      command: command.command,
      target_id: command.target_id,
      expected_revision: command.expected_revision,
      payload: command.payload,
    });
    const existing = await this.get(command.idempotency_key);
    if (existing) {
      if (existing.command_checksum !== checksum) {
        throw new Error(
          `Idempotency key ${command.idempotency_key} was already used for a different command.`,
        );
      }
      return { result: existing.result, replayed: true };
    }

    const result = await operation();
    await this.put({
      api_version: "studio.guilherme.dev/idempotency-v1",
      key: command.idempotency_key,
      command_checksum: checksum,
      created_at: new Date().toISOString(),
      result,
    });
    return { result, replayed: false };
  }

  private async get(key: string): Promise<IdempotencyRecord | undefined> {
    try {
      const parsed = JSON.parse(
        await readFile(path.join(this.directory, `${safeKey(key)}.json`), "utf8"),
      ) as IdempotencyRecord;
      return {
        ...parsed,
        result: ResultEnvelopeSchema.parse(parsed.result),
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return undefined;
      }
      throw error;
    }
  }

  private async put(record: IdempotencyRecord): Promise<void> {
    assertNoSecrets(record);
    await mkdir(this.directory, { recursive: true });
    const target = path.join(this.directory, `${safeKey(record.key)}.json`);
    const temporary = path.join(this.directory, `.idempotency-${process.pid}-${Date.now()}.tmp`);
    await writeFile(temporary, `${JSON.stringify(record, null, 2)}\n`, { mode: 0o600 });
    await rename(temporary, target);
  }
}
