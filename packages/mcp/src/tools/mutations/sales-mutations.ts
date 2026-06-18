import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { executeMcpCommand } from "../../command.js";
import { jsonContent } from "../../responses.js";

const sharedCommandOptions = {
  dry_run: z.boolean().default(false),
  idempotency_key: z.string().optional(),
};

const salesOfferEvidenceMapInput = z.object({
  profile: z.string(),
  offer: z.string(),
  proof_claims: z.array(z.string()).default([]),
  evidence_ids: z.array(z.string()).default([]),
  gap: z.string().optional(),
});

export function registerSalesMutationTools(server: McpServer, root: string): void {
  server.tool(
    "studio_record_sales_icp",
    {
      title: z.string().optional(),
      business_types: z.array(z.string()).default([]),
      needs: z.array(z.string()).default([]),
      budget_logic: z.string().optional(),
      geographies: z.array(z.string()).default([]),
      technologies: z.array(z.string()).default([]),
      delivery_fit: z.array(z.string()).default([]),
      rejected_criteria: z.array(z.string()).default([]),
      offer_evidence_map: z.array(salesOfferEvidenceMapInput).default([]),
      ...sharedCommandOptions,
    },
    async ({
      title,
      business_types,
      needs,
      budget_logic,
      geographies,
      technologies,
      delivery_fit,
      rejected_criteria,
      offer_evidence_map,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "sales.record-icp",
          payload: {
            ...(title ? { title } : {}),
            business_types,
            needs,
            ...(budget_logic ? { budget_logic } : {}),
            geographies,
            technologies,
            delivery_fit,
            rejected_criteria,
            offer_evidence_map,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_research_prospect",
    {
      prospect_id: z.string(),
      source: z.string(),
      source_url: z.string().url().optional(),
      observed_situation: z.string(),
      likely_need: z.string(),
      fit_evidence: z.array(z.string()).default([]),
      decision_maker: z.string().optional(),
      risks: z.array(z.string()).default([]),
      reason_for_contact: z.string(),
      confidence: z.enum(["low", "medium", "high"]).default("medium"),
      freshness: z.enum(["fresh", "stale", "expired", "unknown"]).default("fresh"),
      evidence_ids: z.array(z.string()).default([]),
      ...sharedCommandOptions,
    },
    async ({
      prospect_id,
      source,
      source_url,
      observed_situation,
      likely_need,
      fit_evidence,
      decision_maker,
      risks,
      reason_for_contact,
      confidence,
      freshness,
      evidence_ids,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "prospect.research",
          targetId: prospect_id,
          payload: {
            prospect_id,
            source,
            ...(source_url ? { source_url } : {}),
            observed_situation,
            likely_need,
            fit_evidence,
            ...(decision_maker ? { decision_maker } : {}),
            risks,
            reason_for_contact,
            confidence,
            freshness,
            evidence_ids,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_review_outreach",
    {
      subject_id: z.string(),
      channel: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({ subject_id, channel, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "outreach.review",
          payload: {
            subject_id,
            ...(channel ? { channel } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_prepare_sales_outreach",
    {
      subject_id: z.string(),
      recipient: z.string(),
      channel: z.string(),
      message: z.string(),
      cta: z.string(),
      reason_for_contact: z.string().optional(),
      evidence_ids: z.array(z.string()).default([]),
      ttl_seconds: z.number().int().positive().max(86400).default(900),
      ...sharedCommandOptions,
    },
    async ({
      subject_id,
      recipient,
      channel,
      message,
      cta,
      reason_for_contact,
      evidence_ids,
      ttl_seconds,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "outreach.prepare",
          payload: {
            subject_id,
            recipient,
            channel,
            message,
            cta,
            ...(reason_for_contact ? { reason_for_contact } : {}),
            evidence_ids,
            ttl_seconds,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_record_outreach_result",
    {
      prepared_action_id: z.string(),
      outcome: z.string(),
      occurred_at: z.string().optional(),
      response_summary: z.string().optional(),
      follow_up_at: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({
      prepared_action_id,
      outcome,
      occurred_at,
      response_summary,
      follow_up_at,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "outreach.record-result",
          payload: {
            prepared_action_id,
            outcome,
            ...(occurred_at ? { occurred_at } : {}),
            ...(response_summary ? { response_summary } : {}),
            ...(follow_up_at ? { follow_up_at } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_create_opportunity",
    {
      title: z.string(),
      prospect_id: z.string().optional(),
      owner_id: z.string(),
      next_action: z.string(),
      source_url: z.string().url().optional(),
      source_ref: z.string().optional(),
      source_freshness: z.enum(["fresh", "stale", "expired", "unknown"]).optional(),
      potential_value_minor: z.number().int().min(0).optional(),
      currency: z.string().length(3).optional(),
      ...sharedCommandOptions,
    },
    async ({
      title,
      prospect_id,
      owner_id,
      next_action,
      source_url,
      source_ref,
      source_freshness,
      potential_value_minor,
      currency,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "opportunity.create",
          payload: {
            title,
            ...(prospect_id ? { prospect_id } : {}),
            owner_id,
            next_action,
            ...(source_url ? { source_url } : {}),
            ...(source_ref ? { source_ref } : {}),
            ...(source_freshness ? { source_freshness } : {}),
            ...(potential_value_minor !== undefined ? { potential_value_minor } : {}),
            ...(currency ? { currency } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_record_opportunity_discovery",
    {
      opportunity_id: z.string(),
      source_ref: z.string().optional(),
      summary: z.string(),
      need: z.string(),
      urgency: z.string().optional(),
      budget_signal: z.string().optional(),
      authority_signal: z.string().optional(),
      competition: z.string().optional(),
      next_action: z.string(),
      owner_id: z.string(),
      probability: z.number().int().min(0).max(100).optional(),
      probability_source: z.enum(["explicit", "inferred", "operator-estimate"]).optional(),
      evidence_ids: z.array(z.string()).default([]),
      ...sharedCommandOptions,
    },
    async ({
      opportunity_id,
      source_ref,
      summary,
      need,
      urgency,
      budget_signal,
      authority_signal,
      competition,
      next_action,
      owner_id,
      probability,
      probability_source,
      evidence_ids,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "opportunity.record-discovery",
          targetId: opportunity_id,
          payload: {
            opportunity_id,
            ...(source_ref ? { source_ref } : {}),
            summary,
            need,
            ...(urgency ? { urgency } : {}),
            ...(budget_signal ? { budget_signal } : {}),
            ...(authority_signal ? { authority_signal } : {}),
            ...(competition ? { competition } : {}),
            next_action,
            owner_id,
            ...(probability !== undefined ? { probability } : {}),
            ...(probability_source ? { probability_source } : {}),
            evidence_ids,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_prepare_proposal",
    {
      opportunity_id: z.string(),
      title: z.string().optional(),
      version: z.string().optional(),
      offer_ref: z.string(),
      scope: z.array(z.string()).default([]),
      exclusions: z.array(z.string()).default([]),
      schedule: z.string().optional(),
      assumptions: z.array(z.string()).default([]),
      price_logic: z.string().optional(),
      payment_terms: z.string(),
      acceptance_criteria: z.array(z.string()).default([]),
      value_minor: z.number().int().min(0).optional(),
      currency: z.string().length(3).optional(),
      evidence_ids: z.array(z.string()).default([]),
      ...sharedCommandOptions,
    },
    async ({
      opportunity_id,
      title,
      version,
      offer_ref,
      scope,
      exclusions,
      schedule,
      assumptions,
      price_logic,
      payment_terms,
      acceptance_criteria,
      value_minor,
      currency,
      evidence_ids,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "proposal.prepare",
          payload: {
            opportunity_id,
            ...(title ? { title } : {}),
            ...(version ? { version } : {}),
            offer_ref,
            scope,
            exclusions,
            ...(schedule ? { schedule } : {}),
            assumptions,
            ...(price_logic ? { price_logic } : {}),
            payment_terms,
            acceptance_criteria,
            ...(value_minor !== undefined ? { value_minor } : {}),
            ...(currency ? { currency } : {}),
            evidence_ids,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_review_proposal",
    {
      proposal_id: z.string(),
      review_notes: z.string().optional(),
      evidence_ids: z.array(z.string()).default([]),
      ...sharedCommandOptions,
    },
    async ({ proposal_id, review_notes, evidence_ids, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "proposal.review",
          targetId: proposal_id,
          payload: {
            proposal_id,
            ...(review_notes ? { review_notes } : {}),
            evidence_ids,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_prepare_proposal_send",
    {
      proposal_id: z.string(),
      recipient: z.string(),
      channel: z.string(),
      message: z.string(),
      artifact_ref: z.string(),
      artifact_checksum: z.string().length(64),
      ttl_seconds: z.number().int().positive().max(86400).default(900),
      ...sharedCommandOptions,
    },
    async ({
      proposal_id,
      recipient,
      channel,
      message,
      artifact_ref,
      artifact_checksum,
      ttl_seconds,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "proposal.prepare-send",
          targetId: proposal_id,
          payload: {
            proposal_id,
            recipient,
            channel,
            message,
            artifact_ref,
            artifact_checksum,
            ttl_seconds,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_mark_proposal_sent",
    {
      proposal_id: z.string(),
      prepared_action_id: z.string(),
      sent_at: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({ proposal_id, prepared_action_id, sent_at, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "proposal.mark-sent",
          targetId: proposal_id,
          payload: {
            proposal_id,
            prepared_action_id,
            ...(sent_at ? { sent_at } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_record_proposal_response",
    {
      proposal_id: z.string(),
      response: z.enum(["accepted", "rejected", "revision_requested", "no_response"]),
      evidence_id: z.string().optional(),
      notes: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({ proposal_id, response, evidence_id, notes, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "proposal.record-response",
          targetId: proposal_id,
          payload: {
            proposal_id,
            response,
            ...(evidence_id ? { evidence_id } : {}),
            ...(notes ? { notes } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_create_engagement_from_opportunity",
    { opportunity_id: z.string(), title: z.string().optional(), ...sharedCommandOptions },
    async ({ opportunity_id, title, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "engagement.create-from-opportunity",
          payload: {
            opportunity_id,
            ...(title ? { title } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_convert_opportunity",
    {
      opportunity_id: z.string(),
      client_title: z.string().optional(),
      engagement_title: z.string().optional(),
      accepted_proposal_id: z.string().optional(),
      acceptance_evidence_id: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({
      opportunity_id,
      client_title,
      engagement_title,
      accepted_proposal_id,
      acceptance_evidence_id,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "opportunity.convert",
          payload: {
            opportunity_id,
            ...(client_title ? { client_title } : {}),
            ...(engagement_title ? { engagement_title } : {}),
            ...(accepted_proposal_id ? { accepted_proposal_id } : {}),
            ...(acceptance_evidence_id ? { acceptance_evidence_id } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_record_opportunity_negotiation",
    {
      opportunity_id: z.string(),
      requested_change: z.string(),
      scope_impact: z.string().optional(),
      price_impact: z.string().optional(),
      risk_impact: z.string().optional(),
      timing_impact: z.string().optional(),
      decision: z.enum(["pending", "accepted", "rejected", "deferred"]).optional(),
      evidence_ids: z.array(z.string()).default([]),
      ...sharedCommandOptions,
    },
    async ({
      opportunity_id,
      requested_change,
      scope_impact,
      price_impact,
      risk_impact,
      timing_impact,
      decision,
      evidence_ids,
      dry_run,
      idempotency_key,
    }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "opportunity.record-negotiation",
          targetId: opportunity_id,
          payload: {
            opportunity_id,
            requested_change,
            ...(scope_impact ? { scope_impact } : {}),
            ...(price_impact ? { price_impact } : {}),
            ...(risk_impact ? { risk_impact } : {}),
            ...(timing_impact ? { timing_impact } : {}),
            ...(decision ? { decision } : {}),
            evidence_ids,
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );

  server.tool(
    "studio_close_opportunity_lost",
    {
      opportunity_id: z.string(),
      reason: z.string(),
      lesson: z.string().optional(),
      ...sharedCommandOptions,
    },
    async ({ opportunity_id, reason, lesson, dry_run, idempotency_key }) =>
      jsonContent(
        await executeMcpCommand(root, {
          command: "opportunity.close-lost",
          targetId: opportunity_id,
          payload: {
            opportunity_id,
            reason,
            ...(lesson ? { lesson } : {}),
          },
          dryRun: dry_run,
          ...(idempotency_key ? { idempotencyKey: idempotency_key } : {}),
        }),
      ),
  );
}
