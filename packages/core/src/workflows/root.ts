import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export async function createWorkflowFixtureRoot(workflowId: string): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), `studio-workflow-${workflowId}-`));
  await writeFile(
    path.join(root, "studio.config.yaml"),
    [
      "api_version: studio.guilherme.dev/config-v1",
      `root_name: Workflow fixture ${workflowId}`,
      "operator_id: per_20260614_guilherme-silva",
      "canonical_roots:",
      "  - data",
      "  - clients",
      "  - products",
      "  - portfolio",
      "  - marketing",
      "  - sales",
      "  - career",
      "  - operations",
      "  - docs/studio-os",
      "runtime_path: runtime",
      "panel:",
      "  host: 127.0.0.1",
      "  port: 47839",
      "adapters: {}",
      "",
    ].join("\n"),
  );
  return root;
}
