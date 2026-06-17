import type { WorkflowRunner } from "../types.js";
import { entityResult } from "./entity-result.js";

export const visualFeedbackWorkflow: WorkflowRunner = async (run) => {
  await run("entity.create", { kind: "project", title: "Fixture visual project" });
  const task = entityResult(
    await run("entity.create", { kind: "task", title: "Fixture visual implementation task" }),
  );
  const evidence = entityResult(
    await run("evidence.register", {
      title: "Fixture visual before-after approval",
      evidence_type: "manual",
      claims: ["Fixture visual implementation approved"],
    }),
  );
  await run("decision.record", {
    title: "Fixture visual approval decision",
    decision: "Visual implementation accepted for fixture.",
    evidence_ids: [evidence],
  });
  await run("handoff.create", {
    task_id: task,
    title: "Fixture visual handoff",
    objective: "Continue from approved visual fixture.",
    summary: "Use the visual evidence before changing implementation.",
  });
};
