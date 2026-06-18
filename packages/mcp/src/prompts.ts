import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerStudioMcpPrompts(server: McpServer): void {
  server.prompt(
    "opportunity_qualification",
    "Qualify a prospect or opportunity using Studio evidence and duplicate checks.",
    {
      prospect_id: z.string().optional(),
      opportunity_id: z.string().optional(),
      signal: z.string(),
    },
    ({ prospect_id, opportunity_id, signal }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              "Qualify this commercial signal before proposing work.",
              prospect_id ? `Prospect: ${prospect_id}` : "Prospect: not provided",
              opportunity_id ? `Opportunity: ${opportunity_id}` : "Opportunity: not provided",
              `Signal: ${signal}`,
              "Use studio_query_entities, studio_get_entity, studio_review_duplicates and studio_get_next_actions.",
              "Separate duplicate risk, economic reason, missing evidence and next authorized action.",
            ].join("\n"),
          },
        },
      ],
    }),
  );

  server.prompt(
    "engagement_setup",
    "Prepare an engagement setup from an accepted opportunity.",
    { opportunity_id: z.string(), constraints: z.string().optional() },
    ({ opportunity_id, constraints }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              "Prepare an engagement setup without bypassing Studio gates.",
              `Opportunity: ${opportunity_id}`,
              constraints ? `Constraints: ${constraints}` : "Constraints: not provided",
              "Use studio_get_entity, studio_create_engagement_from_opportunity and studio_register_evidence as needed.",
              "Return required confirmations, missing intake and first delivery next action.",
            ].join("\n"),
          },
        },
      ],
    }),
  );

  server.prompt(
    "implementation_diagnosis",
    "Diagnose implementation mismatch using governed Studio context.",
    { subject_id: z.string().optional(), feedback: z.string() },
    ({ subject_id, feedback }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              "Diagnose this implementation mismatch without mutating files first.",
              subject_id ? `Subject: ${subject_id}` : "Subject: not provided",
              `Feedback: ${feedback}`,
              "Use studio_get_entity, studio_inspect_repository and studio_register_evidence as needed.",
              "Separate observation, inference, decision and required evidence.",
            ].join("\n"),
          },
        },
      ],
    }),
  );

  server.prompt(
    "case_seeding",
    "Seed a portfolio case only from registered evidence and public-claim checks.",
    { evidence_id: z.string(), claim: z.string() },
    ({ evidence_id, claim }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              "Prepare a portfolio case seed from evidence; do not invent client data.",
              `Evidence: ${evidence_id}`,
              `Public claim: ${claim}`,
              "Use studio_get_entity and studio_create_case_from_evidence.",
              "Name any missing proof before recommending publication.",
            ].join("\n"),
          },
        },
      ],
    }),
  );

  server.prompt(
    "content_briefing",
    "Prepare campaign or content brief with evidence-backed claims.",
    { campaign_id: z.string().optional(), audience: z.string(), objective: z.string() },
    ({ campaign_id, audience, objective }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              "Prepare a content brief that can become a governed content item.",
              campaign_id ? `Campaign: ${campaign_id}` : "Campaign: not provided",
              `Audience: ${audience}`,
              `Objective: ${objective}`,
              "Use studio_get_prd_coverage, studio_query_entities and studio_prepare_content.",
              "List claims, missing evidence, CTA and confirmation boundary.",
            ].join("\n"),
          },
        },
      ],
    }),
  );

  server.prompt(
    "application_preparation",
    "Prepare international job application context with portfolio evidence.",
    { application_id: z.string().optional(), role_signal: z.string() },
    ({ application_id, role_signal }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              "Prepare a job application path without fabricating applications or claims.",
              application_id ? `Application: ${application_id}` : "Application: not provided",
              `Role signal: ${role_signal}`,
              "Use studio_query_entities, studio_get_entity and studio_get_prd_coverage.",
              "Return missing intake, relevant cases/evidence and safe follow-up next action.",
            ].join("\n"),
          },
        },
      ],
    }),
  );

  server.prompt(
    "handoff_creation",
    "Create a governed handoff from an AgentRun context pack and verification state.",
    { run_id: z.string(), continuation_goal: z.string() },
    ({ run_id, continuation_goal }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              "Prepare a handoff that another AI can resume without rebriefing.",
              `AgentRun: ${run_id}`,
              `Continuation goal: ${continuation_goal}`,
              "Use studio_get_agent_harness, studio_get_context_pack and studio_get_run_handoff before mutation.",
              "Preserve what not to rethink, evidence ids, gaps and next valid action.",
            ].join("\n"),
          },
        },
      ],
    }),
  );
}
