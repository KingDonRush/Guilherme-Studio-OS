import type { WorkflowRunner } from "../types.js";
import { entityResult } from "./entity-result.js";

export const agentHandoffWorkflow: WorkflowRunner = async (run) => {
  const repository = entityResult(
    await run("entity.create", { kind: "repository", title: "Fixture handoff repository" }),
  );
  const task = entityResult(
    await run("entity.create", { kind: "task", title: "Fixture handoff task" }),
  );
  const evidence = entityResult(
    await run("evidence.register", {
      title: "Fixture context pack evidence",
      evidence_type: "manual",
      claims: ["Fixture context pack accepted"],
    }),
  );
  await run("decision.record", {
    title: "Fixture handoff decision",
    decision: "New agent starts from context pack fixture.",
    evidence_ids: [evidence],
  });
  await run("handoff.create", {
    task_id: task,
    title: "Fixture agent handoff",
    objective: "Resume from context pack.",
    summary: "Use repository health and evidence before changes.",
    repository_ids: [repository],
  });
};
