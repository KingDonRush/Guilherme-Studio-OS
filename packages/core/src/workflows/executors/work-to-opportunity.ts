import type { WorkflowRunner } from "../types.js";
import { entityResult } from "./entity-result.js";

export const workToOpportunityWorkflow: WorkflowRunner = async (run) => {
  const deliverable = entityResult(
    await run("entity.create", { kind: "deliverable", title: "Fixture completed work" }),
  );
  const evidence = entityResult(
    await run("evidence.register", {
      title: "Fixture completed work proof",
      evidence_type: "manual",
      claims: ["Fixture completed work proof"],
    }),
  );
  await run("deliverable.complete", { deliverable_id: deliverable, evidence_ids: [evidence] });
  await run("case.create-from-evidence", {
    evidence_id: evidence,
    title: "Fixture completed work case",
  });
  const campaign = entityResult(
    await run("entity.create", { kind: "campaign", title: "Fixture case campaign" }),
  );
  await run("content.prepare", {
    campaign_id: campaign,
    title: "Fixture case post",
    channel: "linkedin",
    public_claims: ["Fixture completed work proof"],
    evidence_ids: [evidence],
  });
  await run("entity.create", { kind: "prospect", title: "Fixture follow-on prospect" });
};
