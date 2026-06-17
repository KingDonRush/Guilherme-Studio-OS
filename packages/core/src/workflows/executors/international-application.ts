import type { WorkflowRunner } from "../types.js";
import { entityResult } from "./entity-result.js";

export const internationalApplicationWorkflow: WorkflowRunner = async (run) => {
  const organization = entityResult(
    await run("entity.create", { kind: "organization", title: "Fixture International Co" }),
  );
  const application = entityResult(
    await run("application.prepare", {
      title: "Fixture international application",
      source_url: "https://example.com/jobs/fixture",
      organization_id: organization,
    }),
  );
  await run("evidence.register", {
    title: "Fixture application evidence matrix",
    evidence_type: "manual",
    subject_id: application,
    claims: ["Fixture application materials match role"],
  });
  await run("communication.prepare", {
    subject_id: application,
    channel: "email",
    message: "Prepared local application follow-up.",
  });
  await run("entity.create", { kind: "communication", title: "Fixture application receipt" });
  await run("entity.create", { kind: "task", title: "Fixture application follow-up task" });
};
