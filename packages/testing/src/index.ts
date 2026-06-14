import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export async function createTempStudioRoot(): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), "studio-os-test-"));
}
