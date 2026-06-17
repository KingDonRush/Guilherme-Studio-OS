import type { WorkflowRunner } from "../types.js";
import { entityResult } from "./entity-result.js";

export const prospectToClientWorkflow: WorkflowRunner = async (run) => {
  const organization = entityResult(
    await run("entity.create", { kind: "organization", title: "Fixture Agency" }),
  );
  const prospect = entityResult(
    await run("entity.create", { kind: "prospect", title: "Fixture Agency lead" }),
  );
  await run("crm.review-duplicates", { title: "Fixture Agency" });
  const opportunity = entityResult(
    await run("entity.create", { kind: "opportunity", title: "Fixture WordPress build" }),
  );
  await run("proposal.prepare", { opportunity_id: opportunity });
  await run("communication.prepare", {
    subject_id: prospect,
    channel: "email",
    message: "Prepared local outreach fixture.",
  });
  await run("entity.create", {
    kind: "communication",
    title: "Fixture Agency outreach record",
  });
  await run("opportunity.convert", {
    opportunity_id: opportunity,
    client_title: "Fixture Agency",
    engagement_title: "Fixture Agency WordPress engagement",
  });
  await run("evidence.register", {
    title: "Fixture prospect acceptance",
    evidence_type: "manual",
    subject_id: organization,
    claims: ["Fixture prospect accepted scope"],
  });
};
