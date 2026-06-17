import type { WorkflowRunner } from "../types.js";
import { entityResult } from "./entity-result.js";

export const pluginReleaseCaseWorkflow: WorkflowRunner = async (run) => {
  const product = entityResult(
    await run("entity.create", { kind: "product", title: "Fixture Plugin" }),
  );
  const release = entityResult(
    await run("release.prepare", { product_id: product, version: "1.0.0-fixture" }),
  );
  const evidence = entityResult(
    await run("evidence.register", {
      title: "Fixture release tests",
      evidence_type: "manual",
      claims: ["Fixture release tests passed"],
    }),
  );
  await run("release.publish", { release_id: release, evidence_ids: [evidence] }, release);
  await run("entity.create", { kind: "repository", title: "Fixture plugin repository" });
  await run("entity.create", { kind: "environment", title: "Fixture WordPress environment" });
  await run("case.create-from-evidence", {
    evidence_id: evidence,
    title: "Fixture release case",
  });
  await run("entity.create", { kind: "campaign", title: "Fixture release campaign" });
  await run("entity.create", { kind: "prospect", title: "Fixture plugin prospect" });
};
