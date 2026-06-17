import type { ResultEnvelope } from "@guilherme-studio/schemas";
import { asRecord, recordString, recordValue } from "../../record-utils.js";

export function entityResult(result: ResultEnvelope): string {
  const value =
    result.result && typeof result.result === "object"
      ? (result.result as Record<string, unknown>)
      : {};
  const entityId = recordString(value, "entity_id");
  if (entityId) {
    return entityId;
  }
  const entity = asRecord(recordValue(value, "entity"));
  if (entity) {
    const metadata = asRecord(recordValue(entity, "metadata"));
    const id = recordString(metadata, "id");
    if (id) {
      return id;
    }
  }
  throw new Error(`Command did not return an entity id: ${JSON.stringify(result.result)}`);
}
