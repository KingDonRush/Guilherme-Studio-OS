import type { ResultEnvelope } from "@guilherme-studio/schemas";
import { asRecord, recordString, recordValue } from "../../record-utils.js";
import type { WorkflowRunner } from "../types.js";
import { entityResult } from "./entity-result.js";

function preparedActionResult(result: ResultEnvelope): { id: string; checksum: string } {
  const value =
    result.result && typeof result.result === "object"
      ? (result.result as Record<string, unknown>)
      : {};
  const id = recordString(value, "id");
  const checksum = recordString(value, "payload_checksum");
  if (id && checksum) {
    return { id, checksum };
  }
  const action = asRecord(recordValue(value, "action"));
  const nestedId = recordString(action, "id");
  const nestedChecksum = recordString(action, "payload_checksum");
  if (nestedId && nestedChecksum) {
    return { id: nestedId, checksum: nestedChecksum };
  }
  throw new Error(`Command did not return a prepared action: ${JSON.stringify(result.result)}`);
}

export const prospectToClientWorkflow: WorkflowRunner = async (run) => {
  const organization = entityResult(
    await run("entity.create", { kind: "organization", title: "Fixture Agency" }),
  );
  const prospect = entityResult(
    await run("entity.create", { kind: "prospect", title: "Fixture Agency lead" }),
  );
  const sourceEvidence = entityResult(
    await run("evidence.register", {
      title: "Fixture prospect source evidence",
      evidence_type: "manual",
      subject_id: organization,
      claims: ["Fixture prospect has a visible WordPress implementation need"],
    }),
  );
  await run("sales.record-icp", {
    business_types: ["agency"],
    needs: ["WordPress implementation"],
    budget_logic: "Fixed implementation package",
    technologies: ["WordPress", "Elementor"],
    delivery_fit: ["bounded scope"],
    offer_evidence_map: [
      {
        profile: "agency",
        offer: "WordPress implementation sprint",
        proof_claims: ["Fixture implementation evidence"],
        evidence_ids: [sourceEvidence],
      },
    ],
  });
  await run(
    "prospect.research",
    {
      prospect_id: prospect,
      source: "fixture research",
      observed_situation: "Agency has a visible implementation backlog.",
      likely_need: "Bounded Elementor implementation support.",
      fit_evidence: ["WordPress", "Elementor"],
      reason_for_contact: "Fixture source shows a concrete implementation need.",
      evidence_ids: [sourceEvidence],
    },
    prospect,
  );
  await run("crm.review-duplicates", { title: "Fixture Agency" });
  const outreachAction = preparedActionResult(
    await run("outreach.prepare", {
      subject_id: prospect,
      recipient: "fixture@example.com",
      channel: "email",
      message: "Prepared local outreach fixture with a concrete reason.",
      cta: "Would a fixed implementation sprint help?",
      evidence_ids: [sourceEvidence],
    }),
  );
  await run("action.confirm", {
    action_id: outreachAction.id,
    payload_checksum: outreachAction.checksum,
  });
  await run("outreach.record-result", {
    prepared_action_id: outreachAction.id,
    outcome: "sent-manually",
    response_summary: "Fixture records local outreach without adapter send.",
  });
  const opportunity = entityResult(
    await run("opportunity.create", {
      title: "Fixture WordPress build",
      prospect_id: prospect,
      owner_id: "per_20260614_guilherme-silva",
      next_action: "Record discovery",
      potential_value_minor: 150_000,
      currency: "USD",
    }),
  );
  await run(
    "opportunity.record-discovery",
    {
      opportunity_id: opportunity,
      summary: "Fixture agency needs a bounded WordPress build.",
      need: "WordPress implementation",
      urgency: "launch window",
      budget_signal: "fixed package fit",
      authority_signal: "agency owner",
      competition: "internal backlog",
      next_action: "Prepare proposal",
      owner_id: "per_20260614_guilherme-silva",
      probability: 60,
      probability_source: "operator-estimate",
      evidence_ids: [sourceEvidence],
    },
    opportunity,
  );
  const proposal = entityResult(
    await run("proposal.prepare", {
      opportunity_id: opportunity,
      title: "Fixture implementation proposal",
      offer_ref: "wordpress-implementation-sprint",
      scope: ["Elementor implementation", "QA pass"],
      exclusions: ["Unbounded redesign"],
      schedule: "Two week sprint",
      assumptions: ["Client provides access"],
      price_logic: "Fixed project fee",
      payment_terms: "50% upfront, 50% on acceptance",
      acceptance_criteria: ["Client accepts QA checklist"],
      value_minor: 150_000,
      currency: "USD",
      evidence_ids: [sourceEvidence],
    }),
  );
  await run(
    "proposal.review",
    {
      proposal_id: proposal,
      review_notes: "Fixture proposal reviewed.",
      evidence_ids: [sourceEvidence],
    },
    proposal,
  );
  const proposalSend = preparedActionResult(
    await run(
      "proposal.prepare-send",
      {
        proposal_id: proposal,
        recipient: "fixture@example.com",
        channel: "email",
        message: "Sending fixture proposal.",
        artifact_ref: "sales/proposals/fixture-v1.pdf",
        artifact_checksum: "d".repeat(64),
      },
      proposal,
    ),
  );
  await run("action.confirm", {
    action_id: proposalSend.id,
    payload_checksum: proposalSend.checksum,
  });
  await run(
    "proposal.mark-sent",
    {
      proposal_id: proposal,
      prepared_action_id: proposalSend.id,
    },
    proposal,
  );
  const acceptanceEvidence = entityResult(
    await run("evidence.register", {
      title: "Fixture prospect acceptance",
      evidence_type: "manual",
      subject_id: organization,
      claims: ["Fixture prospect accepted scope"],
    }),
  );
  await run(
    "proposal.record-response",
    {
      proposal_id: proposal,
      response: "accepted",
      evidence_id: acceptanceEvidence,
    },
    proposal,
  );
  await run("opportunity.convert", {
    opportunity_id: opportunity,
    client_title: "Fixture Agency",
    engagement_title: "Fixture Agency WordPress engagement",
  });
};
