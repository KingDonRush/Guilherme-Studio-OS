import type { WorkflowRunner } from "../types.js";
import { entityResult } from "./entity-result.js";

export const securityIncidentWorkflow: WorkflowRunner = async (run) => {
  const repository = entityResult(
    await run("entity.create", { kind: "repository", title: "Fixture incident repository" }),
  );
  const task = entityResult(
    await run("entity.create", { kind: "task", title: "Fixture security incident task" }),
  );
  const evidence = entityResult(
    await run("evidence.register", {
      title: "Fixture redacted forensics",
      evidence_type: "manual",
      claims: ["Fixture redacted forensics captured"],
    }),
  );
  await run("decision.record", {
    title: "Fixture incident containment decision",
    decision: "Incident remains contained in fixture.",
    evidence_ids: [evidence],
  });
  await run("handoff.create", {
    task_id: task,
    title: "Fixture incident handoff",
    objective: "Continue recovery from redacted evidence.",
    summary: "Review forensics and prevention evidence first.",
    repository_ids: [repository],
  });
};
