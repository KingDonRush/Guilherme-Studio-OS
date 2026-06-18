import { z } from "zod";
import { GenericSpecSchema } from "./base.js";

const CareerRequirementSchema = z
  .object({
    text: z.string().min(1),
    type: z.enum(["explicit", "inferred", "optional"]).default("explicit"),
    source_ref: z.string().optional(),
  })
  .strict();

const CareerEvidenceMapEntrySchema = z
  .object({
    role_family: z.string().min(1),
    required_signal: z.string().min(1),
    evidence_ids: z.array(z.string()).default([]),
    gap: z.string().optional(),
  })
  .strict();

const CareerMaterialAnswerSchema = z
  .object({
    prompt: z.string().min(1),
    answer: z.string().min(1),
    evidence_ids: z.array(z.string()).default([]),
  })
  .strict();

const CareerFitAnalysisSchema = z
  .object({
    analyzed_at: z.string().datetime(),
    recommendation: z.enum(["apply", "research", "defer", "reject"]),
    rationale: z.string().min(1),
    verified_signals: z.array(z.string()).default([]),
    matched_requirements: z.array(z.string()).default([]),
    gaps: z.array(z.string()).default([]),
    evidence_ids: z.array(z.string()).default([]),
  })
  .strict();

const CareerValidationSchema = z
  .object({
    checked_at: z.string().datetime(),
    status: z.enum(["valid", "blocked"]),
    missing: z.array(z.string()).default([]),
    warnings: z.array(z.string()).default([]),
    checked_urls: z.array(z.string()).default([]),
  })
  .strict();

export const JobApplicationSpecSchema = GenericSpecSchema.extend({
  source_url: z.string().url().optional(),
  source_platform: z
    .enum(["linkedin", "company-site", "job-board", "referral", "other"])
    .optional(),
  source_freshness: z.enum(["fresh", "stale", "expired", "unknown"]).default("unknown"),
  stage: z
    .enum([
      "discovered",
      "analyzed",
      "prepared",
      "validated",
      "submission_prepared",
      "submitted",
      "follow-up",
      "interview",
      "offered",
      "accepted",
      "rejected",
      "withdrawn",
      "no-response",
      "archived",
    ])
    .optional(),
  role_title: z.string().optional(),
  role_family: z.string().optional(),
  employment_type: z.string().optional(),
  geography: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  compensation: z.string().optional(),
  deadline_at: z.string().datetime().optional(),
  contact_name: z.string().optional(),
  contact_url: z.string().url().optional(),
  requirements: z.array(CareerRequirementSchema).default([]),
  duplicate_key: z.string().optional(),
  duplicate_of_application_id: z.string().optional(),
  fit_analysis: CareerFitAnalysisSchema.optional(),
  resume_ref: z.string().optional(),
  cover_message: z.string().optional(),
  portfolio_links: z.array(z.string().url()).default([]),
  repository_ids: z.array(z.string()).default([]),
  material_evidence_ids: z.array(z.string()).default([]),
  answers: z.array(CareerMaterialAnswerSchema).default([]),
  validation: CareerValidationSchema.optional(),
  submission_channel: z.string().optional(),
  submission_prepared_action_id: z.string().optional(),
  submission_payload_checksum: z.string().optional(),
  submitted_at: z.string().datetime().optional(),
  submission_reference: z.string().optional(),
  follow_up_at: z.string().datetime().optional(),
  follow_up_channel: z.string().optional(),
  follow_up_policy: z.string().optional(),
  organization_id: z.string().optional(),
  interview_at: z.string().datetime().optional(),
  interview_notes: z.string().optional(),
  interview_context_run_id: z.string().optional(),
  interview_context_pack_id: z.string().optional(),
  outcome: z.enum(["rejected", "no-response", "withdrawn", "offered", "accepted"]).optional(),
  outcome_reason: z.string().optional(),
  learning_notes: z.string().optional(),
  sample_size: z.number().int().min(0).optional(),
  sample_size_warning: z.string().optional(),
  evidence_map: z.array(CareerEvidenceMapEntrySchema).default([]),
});
