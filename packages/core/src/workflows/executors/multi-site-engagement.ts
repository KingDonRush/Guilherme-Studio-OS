import type { WorkflowRunner } from "../types.js";
import { entityResult } from "./entity-result.js";

export const multiSiteEngagementWorkflow: WorkflowRunner = async (run) => {
  await run("entity.create", { kind: "client", title: "Fixture Client" });
  const engagement = entityResult(
    await run("entity.create", { kind: "engagement", title: "Fixture multi-site engagement" }),
  );
  const contract = entityResult(
    await run("contract.create-from-engagement", {
      engagement_id: engagement,
      value_minor: 240_000,
      currency: "USD",
    }),
  );
  const invoice = entityResult(
    await run("invoice.create-for-contract", {
      contract_id: contract,
      amount_minor: 120_000,
      currency: "USD",
      reference: "FIX-INV-001",
    }),
  );
  await run("payment.record-for-invoice", {
    invoice_id: invoice,
    amount_minor: 120_000,
    currency: "USD",
  });
  const project = entityResult(
    await run("entity.create", { kind: "project", title: "Fixture delivery project" }),
  );
  await run("project.register-repo", {
    project_id: project,
    title: "Fixture delivery repository",
    repository_path: ".",
    remote_policy: "allowed",
  });
  const evidence = entityResult(
    await run("evidence.register", {
      title: "Fixture delivery acceptance",
      evidence_type: "manual",
      claims: ["Fixture delivery accepted"],
    }),
  );
  const deliverable = entityResult(
    await run("entity.create", { kind: "deliverable", title: "Fixture accepted deliverable" }),
  );
  await run(
    "deliverable.complete",
    {
      deliverable_id: deliverable,
      evidence_ids: [evidence],
    },
    deliverable,
  );
};
