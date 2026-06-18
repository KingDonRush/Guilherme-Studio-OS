import { createResultEnvelope } from "@guilherme-studio/schemas";
import { DomainCommandService } from "../../domains/commands.js";
import { entityMutationResult } from "../../entity-service.js";
import {
  numberValue,
  optionalNumber,
  optionalString,
  payloadValue,
  stringArray,
  stringValue,
} from "../payload.js";
import type { StudioCommandDefinition } from "../types.js";

function recordArray(payload: Record<string, unknown>, key: string): Record<string, unknown>[] {
  const value = payloadValue(payload, key);
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new Error(`${key} must be an array`);
  }
  return value.map((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error(`${key} entries must be objects`);
    }
    return entry as Record<string, unknown>;
  });
}

function requirementArray(payload: Record<string, unknown>): Array<{
  text: string;
  type?: "explicit" | "inferred" | "optional";
  source_ref?: string;
}> {
  return recordArray(payload, "requirements").map((entry) => ({
    text: stringValue(entry, "text"),
    ...(optionalString(entry, "type")
      ? { type: stringValue(entry, "type") as "explicit" | "inferred" | "optional" }
      : {}),
    ...(optionalString(entry, "source_ref")
      ? { source_ref: stringValue(entry, "source_ref") }
      : {}),
  }));
}

function answerArray(payload: Record<string, unknown>): Array<{
  prompt: string;
  answer: string;
  evidence_ids?: string[];
}> {
  return recordArray(payload, "answers").map((entry) => ({
    prompt: stringValue(entry, "prompt"),
    answer: stringValue(entry, "answer"),
    evidence_ids: stringArray(entry, "evidence_ids"),
  }));
}

function evidenceMapArray(payload: Record<string, unknown>): Array<{
  role_family: string;
  required_signal: string;
  evidence_ids?: string[];
  gap?: string;
}> {
  return recordArray(payload, "evidence_map").map((entry) => ({
    role_family: stringValue(entry, "role_family"),
    required_signal: stringValue(entry, "required_signal"),
    evidence_ids: stringArray(entry, "evidence_ids"),
    ...(optionalString(entry, "gap") ? { gap: stringValue(entry, "gap") } : {}),
  }));
}

export const careerCommandDefinitions: Record<string, StudioCommandDefinition> = {
  "career.record-strategy": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).recordRoleStrategy({
        ...(optionalString(payload, "title") ? { title: stringValue(payload, "title") } : {}),
        roleFamilies: stringArray(payload, "role_families"),
        employmentTypes: stringArray(payload, "employment_types"),
        geographies: stringArray(payload, "geographies"),
        ...(optionalString(payload, "timezone")
          ? { timezone: stringValue(payload, "timezone") }
          : {}),
        ...(optionalString(payload, "language")
          ? { language: stringValue(payload, "language") }
          : {}),
        ...(optionalString(payload, "salary_expectation")
          ? { salaryExpectation: stringValue(payload, "salary_expectation") }
          : {}),
        unacceptableConstraints: stringArray(payload, "unacceptable_constraints"),
        evidenceMap: evidenceMapArray(payload),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "application.register-opportunity": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const organizationId = optionalString(payload, "organization_id");
      const entity = await new DomainCommandService(context).registerJobOpportunity({
        title: stringValue(payload, "title"),
        sourceUrl: stringValue(payload, "source_url"),
        ...(organizationId ? { organizationId } : {}),
        ...(optionalString(payload, "role_title")
          ? { roleTitle: stringValue(payload, "role_title") }
          : {}),
        ...(optionalString(payload, "role_family")
          ? { roleFamily: stringValue(payload, "role_family") }
          : {}),
        ...(optionalString(payload, "employment_type")
          ? { employmentType: stringValue(payload, "employment_type") }
          : {}),
        ...(optionalString(payload, "geography")
          ? { geography: stringValue(payload, "geography") }
          : {}),
        ...(optionalString(payload, "timezone")
          ? { timezone: stringValue(payload, "timezone") }
          : {}),
        ...(optionalString(payload, "language")
          ? { language: stringValue(payload, "language") }
          : {}),
        ...(optionalString(payload, "compensation")
          ? { compensation: stringValue(payload, "compensation") }
          : {}),
        requirements: requirementArray(payload),
        ...(optionalString(payload, "deadline_at")
          ? { deadlineAt: stringValue(payload, "deadline_at") }
          : {}),
        ...(optionalString(payload, "contact_name")
          ? { contactName: stringValue(payload, "contact_name") }
          : {}),
        ...(optionalString(payload, "contact_url")
          ? { contactUrl: stringValue(payload, "contact_url") }
          : {}),
        ...(optionalString(payload, "source_freshness")
          ? {
              sourceFreshness: stringValue(payload, "source_freshness") as
                | "fresh"
                | "stale"
                | "expired"
                | "unknown",
            }
          : {}),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "application.review-duplicates": {
    requirement: { capability: "entity.read" },
    handler: async ({ context, command, payload }) => {
      const result = await new DomainCommandService(context).reviewRoleDuplicates({
        ...(optionalString(payload, "source_url")
          ? { sourceUrl: stringValue(payload, "source_url") }
          : {}),
        ...(optionalString(payload, "title") ? { title: stringValue(payload, "title") } : {}),
        ...(optionalString(payload, "organization_id")
          ? { organizationId: stringValue(payload, "organization_id") }
          : {}),
      });
      return createResultEnvelope({ requestId: command.request_id, result });
    },
  },
  "application.analyze-fit": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).analyzeRoleFit(
        command.target_id ?? stringValue(payload, "application_id"),
        {
          verifiedSignals: stringArray(payload, "verified_signals"),
          evidenceIds: stringArray(payload, "evidence_ids"),
          ...(optionalString(payload, "rationale")
            ? { rationale: stringValue(payload, "rationale") }
            : {}),
        },
      );
      return entityMutationResult(command.command, entity);
    },
  },
  "application.prepare": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const organizationId = optionalString(payload, "organization_id");
      const entity = await new DomainCommandService(context).prepareApplication({
        title: stringValue(payload, "title"),
        sourceUrl: stringValue(payload, "source_url"),
        ...(organizationId ? { organizationId } : {}),
        ...(optionalString(payload, "role_family")
          ? { roleFamily: stringValue(payload, "role_family") }
          : {}),
        ...(optionalString(payload, "resume_ref")
          ? { resumeRef: stringValue(payload, "resume_ref") }
          : {}),
        ...(optionalString(payload, "cover_message")
          ? { coverMessage: stringValue(payload, "cover_message") }
          : {}),
        portfolioLinks: stringArray(payload, "portfolio_links"),
        repositoryIds: stringArray(payload, "repository_ids"),
        evidenceIds: stringArray(payload, "evidence_ids"),
        answers: answerArray(payload),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "application.validate": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).validateApplication(
        command.target_id ?? stringValue(payload, "application_id"),
      );
      return entityMutationResult(command.command, entity);
    },
  },
  "application.prepare-submission": {
    requirement: { capability: "action.prepare", classification: "confidential" },
    handler: async ({ context, command, payload }) => {
      const action = await new DomainCommandService(context).prepareApplicationSubmission({
        applicationId: command.target_id ?? stringValue(payload, "application_id"),
        ...(optionalString(payload, "channel") ? { channel: stringValue(payload, "channel") } : {}),
        ...(optionalString(payload, "message") ? { message: stringValue(payload, "message") } : {}),
      });
      return createResultEnvelope({ requestId: command.request_id, result: action });
    },
  },
  "application.record-submission": {
    requirement: { capability: "entity.write", classification: "confidential" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).recordApplicationSubmission({
        applicationId: command.target_id ?? stringValue(payload, "application_id"),
        preparedActionId: stringValue(payload, "prepared_action_id"),
        ...(optionalString(payload, "submitted_at")
          ? { submittedAt: stringValue(payload, "submitted_at") }
          : {}),
        ...(optionalString(payload, "reference")
          ? { reference: stringValue(payload, "reference") }
          : {}),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "application.follow-up": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const result = await new DomainCommandService(context).scheduleApplicationFollowUp({
        applicationId: command.target_id ?? stringValue(payload, "application_id"),
        followUpAt: stringValue(payload, "follow_up_at"),
        ...(optionalString(payload, "message") ? { message: stringValue(payload, "message") } : {}),
        ...(optionalString(payload, "channel") ? { channel: stringValue(payload, "channel") } : {}),
        ...(optionalString(payload, "policy") ? { policy: stringValue(payload, "policy") } : {}),
      });
      return createResultEnvelope({ requestId: command.request_id, result });
    },
  },
  "application.record-interview": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).recordApplicationInterview({
        applicationId: command.target_id ?? stringValue(payload, "application_id"),
        interviewAt: stringValue(payload, "interview_at"),
        ...(optionalString(payload, "notes") ? { notes: stringValue(payload, "notes") } : {}),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "application.interview-context": {
    requirement: { capability: "entity.write", classification: "confidential" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).buildInterviewContext({
        applicationId: command.target_id ?? stringValue(payload, "application_id"),
        ...(optionalString(payload, "next_action")
          ? { nextAction: stringValue(payload, "next_action") }
          : {}),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "application.record-outcome": {
    requirement: { capability: "entity.write", classification: "confidential" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).recordApplicationOutcome({
        applicationId: command.target_id ?? stringValue(payload, "application_id"),
        outcome: stringValue(payload, "outcome") as
          | "rejected"
          | "no-response"
          | "withdrawn"
          | "offered"
          | "accepted",
        ...(optionalString(payload, "reason") ? { reason: stringValue(payload, "reason") } : {}),
        ...(optionalString(payload, "learning_notes")
          ? { learningNotes: stringValue(payload, "learning_notes") }
          : {}),
        ...(optionalNumber(payload, "sample_size") !== undefined
          ? { sampleSize: numberValue(payload, "sample_size") }
          : {}),
        evidenceIds: stringArray(payload, "evidence_ids"),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "career.next-actions": {
    requirement: { capability: "entity.read", classification: "confidential" },
    handler: async ({ context, command }) => {
      const result = await new DomainCommandService(context).resolveCareerNextActions();
      return createResultEnvelope({ requestId: command.request_id, result });
    },
  },
};
