import type { Command } from "commander";
import { executeCliCommand, globalOptions } from "../../runtime.js";
import type { DomainCommandMap } from "./base.js";

function parseJsonArray(value: string | undefined, label: string): Record<string, unknown>[] {
  if (!value) {
    return [];
  }
  const parsed = JSON.parse(value) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error(`${label} must be a JSON array`);
  }
  return parsed.map((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error(`${label} entries must be JSON objects`);
    }
    return entry as Record<string, unknown>;
  });
}

export function registerSalesDomainCommands(
  program: Command,
  domainCommands: DomainCommandMap,
): void {
  const sales = program.command("sales").description("Operate prospecting and sales strategy");
  const outreach = program.command("outreach").description("Prepare and record sales outreach");

  sales
    .command("record-icp")
    .option("--title <title>")
    .option("--business-type <text...>")
    .option("--need <text...>")
    .option("--budget-logic <text>")
    .option("--geography <text...>")
    .option("--technology <text...>")
    .option("--delivery-fit <text...>")
    .option("--rejected <text...>")
    .option("--offer-map-json <json-array>")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as {
        title?: string;
        businessType?: string[];
        need?: string[];
        budgetLogic?: string;
        geography?: string[];
        technology?: string[];
        deliveryFit?: string[];
        rejected?: string[];
        offerMapJson?: string;
      };
      await executeCliCommand(options, "sales.record-icp", {
        ...(local.title ? { title: local.title } : {}),
        business_types: local.businessType ?? [],
        needs: local.need ?? [],
        ...(local.budgetLogic ? { budget_logic: local.budgetLogic } : {}),
        geographies: local.geography ?? [],
        technologies: local.technology ?? [],
        delivery_fit: local.deliveryFit ?? [],
        rejected_criteria: local.rejected ?? [],
        offer_evidence_map: parseJsonArray(local.offerMapJson, "offer_evidence_map"),
      });
    });

  domainCommands
    .get("prospect")
    ?.command("research")
    .argument("<prospect-id>")
    .requiredOption("--source <text>")
    .option("--source-url <url>")
    .requiredOption("--observed <text>")
    .requiredOption("--need <text>")
    .option("--fit-evidence <text...>")
    .option("--decision-maker <text>")
    .option("--risk <text...>")
    .requiredOption("--reason <text>")
    .option("--confidence <confidence>")
    .option("--freshness <freshness>")
    .option("--evidence <id...>")
    .action(async function action(this: Command, prospectId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        source: string;
        sourceUrl?: string;
        observed: string;
        need: string;
        fitEvidence?: string[];
        decisionMaker?: string;
        risk?: string[];
        reason: string;
        confidence?: string;
        freshness?: string;
        evidence?: string[];
      };
      await executeCliCommand(
        options,
        "prospect.research",
        {
          prospect_id: prospectId,
          source: local.source,
          ...(local.sourceUrl ? { source_url: local.sourceUrl } : {}),
          observed_situation: local.observed,
          likely_need: local.need,
          fit_evidence: local.fitEvidence ?? [],
          ...(local.decisionMaker ? { decision_maker: local.decisionMaker } : {}),
          risks: local.risk ?? [],
          reason_for_contact: local.reason,
          ...(local.confidence ? { confidence: local.confidence } : {}),
          ...(local.freshness ? { freshness: local.freshness } : {}),
          evidence_ids: local.evidence ?? [],
        },
        prospectId,
      );
    });

  outreach
    .command("review")
    .requiredOption("--subject <id>")
    .option("--channel <channel>")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as { subject: string; channel?: string };
      await executeCliCommand(options, "outreach.review", {
        subject_id: local.subject,
        ...(local.channel ? { channel: local.channel } : {}),
      });
    });

  outreach
    .command("prepare")
    .requiredOption("--subject <id>")
    .requiredOption("--recipient <target>")
    .requiredOption("--channel <channel>")
    .requiredOption("--message <text>")
    .requiredOption("--cta <text>")
    .option("--reason <text>")
    .option("--evidence <id...>")
    .option("--ttl <seconds>")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as {
        subject: string;
        recipient: string;
        channel: string;
        message: string;
        cta: string;
        reason?: string;
        evidence?: string[];
        ttl?: string;
      };
      await executeCliCommand(options, "outreach.prepare", {
        subject_id: local.subject,
        recipient: local.recipient,
        channel: local.channel,
        message: local.message,
        cta: local.cta,
        ...(local.reason ? { reason_for_contact: local.reason } : {}),
        evidence_ids: local.evidence ?? [],
        ...(local.ttl ? { ttl_seconds: Number.parseInt(local.ttl, 10) } : {}),
      });
    });

  outreach
    .command("record-result")
    .requiredOption("--prepared-action <id>")
    .requiredOption("--outcome <text>")
    .option("--occurred-at <iso-date>")
    .option("--response <text>")
    .option("--follow-up-at <iso-date>")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as {
        preparedAction: string;
        outcome: string;
        occurredAt?: string;
        response?: string;
        followUpAt?: string;
      };
      await executeCliCommand(options, "outreach.record-result", {
        prepared_action_id: local.preparedAction,
        outcome: local.outcome,
        ...(local.occurredAt ? { occurred_at: local.occurredAt } : {}),
        ...(local.response ? { response_summary: local.response } : {}),
        ...(local.followUpAt ? { follow_up_at: local.followUpAt } : {}),
      });
    });

  domainCommands
    .get("opportunity")
    ?.command("register")
    .requiredOption("--title <title>")
    .option("--prospect <id>")
    .requiredOption("--owner <id>")
    .requiredOption("--next-action <text>")
    .option("--source-url <url>")
    .option("--source-ref <text>")
    .option("--source-freshness <freshness>")
    .option("--value-minor <amount>")
    .option("--currency <code>")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as {
        title: string;
        prospect?: string;
        owner: string;
        nextAction: string;
        sourceUrl?: string;
        sourceRef?: string;
        sourceFreshness?: string;
        valueMinor?: string;
        currency?: string;
      };
      await executeCliCommand(options, "opportunity.create", {
        title: local.title,
        ...(local.prospect ? { prospect_id: local.prospect } : {}),
        owner_id: local.owner,
        next_action: local.nextAction,
        ...(local.sourceUrl ? { source_url: local.sourceUrl } : {}),
        ...(local.sourceRef ? { source_ref: local.sourceRef } : {}),
        ...(local.sourceFreshness ? { source_freshness: local.sourceFreshness } : {}),
        ...(local.valueMinor
          ? { potential_value_minor: Number.parseInt(local.valueMinor, 10) }
          : {}),
        ...(local.currency ? { currency: local.currency } : {}),
      });
    });

  domainCommands
    .get("opportunity")
    ?.command("record-discovery")
    .argument("<opportunity-id>")
    .requiredOption("--summary <text>")
    .requiredOption("--need <text>")
    .option("--urgency <text>")
    .option("--budget-signal <text>")
    .option("--authority-signal <text>")
    .option("--competition <text>")
    .requiredOption("--next-action <text>")
    .requiredOption("--owner <id>")
    .option("--probability <number>")
    .option("--probability-source <source>")
    .option("--source-ref <text>")
    .option("--evidence <id...>")
    .action(async function action(this: Command, opportunityId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        summary: string;
        need: string;
        urgency?: string;
        budgetSignal?: string;
        authoritySignal?: string;
        competition?: string;
        nextAction: string;
        owner: string;
        probability?: string;
        probabilitySource?: string;
        sourceRef?: string;
        evidence?: string[];
      };
      await executeCliCommand(
        options,
        "opportunity.record-discovery",
        {
          opportunity_id: opportunityId,
          ...(local.sourceRef ? { source_ref: local.sourceRef } : {}),
          summary: local.summary,
          need: local.need,
          ...(local.urgency ? { urgency: local.urgency } : {}),
          ...(local.budgetSignal ? { budget_signal: local.budgetSignal } : {}),
          ...(local.authoritySignal ? { authority_signal: local.authoritySignal } : {}),
          ...(local.competition ? { competition: local.competition } : {}),
          next_action: local.nextAction,
          owner_id: local.owner,
          ...(local.probability ? { probability: Number.parseInt(local.probability, 10) } : {}),
          ...(local.probabilitySource ? { probability_source: local.probabilitySource } : {}),
          evidence_ids: local.evidence ?? [],
        },
        opportunityId,
      );
    });

  domainCommands
    .get("opportunity")
    ?.command("record-negotiation")
    .argument("<opportunity-id>")
    .requiredOption("--change <text>")
    .option("--scope-impact <text>")
    .option("--price-impact <text>")
    .option("--risk-impact <text>")
    .option("--timing-impact <text>")
    .option("--decision <decision>")
    .option("--evidence <id...>")
    .action(async function action(this: Command, opportunityId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        change: string;
        scopeImpact?: string;
        priceImpact?: string;
        riskImpact?: string;
        timingImpact?: string;
        decision?: string;
        evidence?: string[];
      };
      await executeCliCommand(
        options,
        "opportunity.record-negotiation",
        {
          opportunity_id: opportunityId,
          requested_change: local.change,
          ...(local.scopeImpact ? { scope_impact: local.scopeImpact } : {}),
          ...(local.priceImpact ? { price_impact: local.priceImpact } : {}),
          ...(local.riskImpact ? { risk_impact: local.riskImpact } : {}),
          ...(local.timingImpact ? { timing_impact: local.timingImpact } : {}),
          ...(local.decision ? { decision: local.decision } : {}),
          evidence_ids: local.evidence ?? [],
        },
        opportunityId,
      );
    });

  domainCommands
    .get("opportunity")
    ?.command("close-lost")
    .argument("<opportunity-id>")
    .requiredOption("--reason <text>")
    .option("--lesson <text>")
    .action(async function action(this: Command, opportunityId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { reason: string; lesson?: string };
      await executeCliCommand(
        options,
        "opportunity.close-lost",
        {
          opportunity_id: opportunityId,
          reason: local.reason,
          ...(local.lesson ? { lesson: local.lesson } : {}),
        },
        opportunityId,
      );
    });

  domainCommands
    .get("engagement")
    ?.command("create-from-opportunity")
    .argument("<opportunity-id>")
    .option("--title <title>")
    .action(async function action(this: Command, opportunityId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { title?: string };
      await executeCliCommand(options, "engagement.create-from-opportunity", {
        opportunity_id: opportunityId,
        ...(local.title ? { title: local.title } : {}),
      });
    });

  domainCommands
    .get("opportunity")
    ?.command("convert")
    .argument("<opportunity-id>")
    .option("--client-title <title>")
    .option("--engagement-title <title>")
    .option("--accepted-proposal <id>")
    .option("--acceptance-evidence <id>")
    .action(async function action(this: Command, opportunityId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        clientTitle?: string;
        engagementTitle?: string;
        acceptedProposal?: string;
        acceptanceEvidence?: string;
      };
      await executeCliCommand(options, "opportunity.convert", {
        opportunity_id: opportunityId,
        ...(local.clientTitle ? { client_title: local.clientTitle } : {}),
        ...(local.engagementTitle ? { engagement_title: local.engagementTitle } : {}),
        ...(local.acceptedProposal ? { accepted_proposal_id: local.acceptedProposal } : {}),
        ...(local.acceptanceEvidence ? { acceptance_evidence_id: local.acceptanceEvidence } : {}),
      });
    });

  domainCommands
    .get("proposal")
    ?.command("prepare")
    .argument("<opportunity-id>")
    .option("--title <title>")
    .option("--version <version>")
    .option("--offer <ref>")
    .option("--scope <text...>")
    .option("--exclusion <text...>")
    .option("--schedule <text>")
    .option("--assumption <text...>")
    .option("--price-logic <text>")
    .option("--payment-terms <text>")
    .option("--acceptance <text...>")
    .option("--value-minor <amount>")
    .option("--currency <code>")
    .option("--evidence <id...>")
    .action(async function action(this: Command, opportunityId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        title?: string;
        version?: string;
        offer?: string;
        scope?: string[];
        exclusion?: string[];
        schedule?: string;
        assumption?: string[];
        priceLogic?: string;
        paymentTerms?: string;
        acceptance?: string[];
        valueMinor?: string;
        currency?: string;
        evidence?: string[];
      };
      await executeCliCommand(options, "proposal.prepare", {
        opportunity_id: opportunityId,
        ...(local.title ? { title: local.title } : {}),
        ...(local.version ? { version: local.version } : {}),
        ...(local.offer ? { offer_ref: local.offer } : {}),
        scope: local.scope ?? [],
        exclusions: local.exclusion ?? [],
        ...(local.schedule ? { schedule: local.schedule } : {}),
        assumptions: local.assumption ?? [],
        ...(local.priceLogic ? { price_logic: local.priceLogic } : {}),
        ...(local.paymentTerms ? { payment_terms: local.paymentTerms } : {}),
        acceptance_criteria: local.acceptance ?? [],
        ...(local.valueMinor ? { value_minor: Number.parseInt(local.valueMinor, 10) } : {}),
        ...(local.currency ? { currency: local.currency } : {}),
        evidence_ids: local.evidence ?? [],
      });
    });

  domainCommands
    .get("proposal")
    ?.command("review")
    .argument("<proposal-id>")
    .option("--notes <text>")
    .option("--evidence <id...>")
    .action(async function action(this: Command, proposalId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { notes?: string; evidence?: string[] };
      await executeCliCommand(
        options,
        "proposal.review",
        {
          proposal_id: proposalId,
          ...(local.notes ? { review_notes: local.notes } : {}),
          evidence_ids: local.evidence ?? [],
        },
        proposalId,
      );
    });

  domainCommands
    .get("proposal")
    ?.command("prepare-send")
    .argument("<proposal-id>")
    .requiredOption("--recipient <target>")
    .requiredOption("--channel <channel>")
    .requiredOption("--message <text>")
    .requiredOption("--artifact <ref>")
    .requiredOption("--checksum <sha256>")
    .option("--ttl <seconds>")
    .action(async function action(this: Command, proposalId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        recipient: string;
        channel: string;
        message: string;
        artifact: string;
        checksum: string;
        ttl?: string;
      };
      await executeCliCommand(
        options,
        "proposal.prepare-send",
        {
          proposal_id: proposalId,
          recipient: local.recipient,
          channel: local.channel,
          message: local.message,
          artifact_ref: local.artifact,
          artifact_checksum: local.checksum,
          ...(local.ttl ? { ttl_seconds: Number.parseInt(local.ttl, 10) } : {}),
        },
        proposalId,
      );
    });

  domainCommands
    .get("proposal")
    ?.command("mark-sent")
    .argument("<proposal-id>")
    .requiredOption("--prepared-action <id>")
    .option("--sent-at <iso-date>")
    .action(async function action(this: Command, proposalId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { preparedAction: string; sentAt?: string };
      await executeCliCommand(
        options,
        "proposal.mark-sent",
        {
          proposal_id: proposalId,
          prepared_action_id: local.preparedAction,
          ...(local.sentAt ? { sent_at: local.sentAt } : {}),
        },
        proposalId,
      );
    });

  domainCommands
    .get("proposal")
    ?.command("record-response")
    .argument("<proposal-id>")
    .requiredOption("--response <response>")
    .option("--evidence <id>")
    .option("--notes <text>")
    .action(async function action(this: Command, proposalId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { response: string; evidence?: string; notes?: string };
      await executeCliCommand(
        options,
        "proposal.record-response",
        {
          proposal_id: proposalId,
          response: local.response,
          ...(local.evidence ? { evidence_id: local.evidence } : {}),
          ...(local.notes ? { notes: local.notes } : {}),
        },
        proposalId,
      );
    });
}
