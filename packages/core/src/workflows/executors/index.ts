import type { WorkflowRunner } from "../types.js";
import { agentHandoffWorkflow } from "./agent-handoff.js";
import { internationalApplicationWorkflow } from "./international-application.js";
import { multiSiteEngagementWorkflow } from "./multi-site-engagement.js";
import { pluginReleaseCaseWorkflow } from "./plugin-release-case.js";
import { prospectToClientWorkflow } from "./prospect-to-client.js";
import { securityIncidentWorkflow } from "./security-incident.js";
import { visualFeedbackWorkflow } from "./visual-feedback.js";
import { workToOpportunityWorkflow } from "./work-to-opportunity.js";

export const WORKFLOW_EXECUTORS: Record<string, WorkflowRunner> = {
  "prospect-to-client": prospectToClientWorkflow,
  "multi-site-engagement": multiSiteEngagementWorkflow,
  "work-to-opportunity": workToOpportunityWorkflow,
  "plugin-release-case": pluginReleaseCaseWorkflow,
  "international-application": internationalApplicationWorkflow,
  "visual-feedback": visualFeedbackWorkflow,
  "security-incident": securityIncidentWorkflow,
  "agent-handoff": agentHandoffWorkflow,
};
