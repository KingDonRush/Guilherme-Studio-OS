import { z } from "zod";
import { GenericSpecSchema } from "./base.js";

export const AgentRunStateSchema = z.enum([
  "draft",
  "oriented",
  "authorized",
  "in_progress",
  "verifying",
  "blocked",
  "handoff_ready",
  "closed",
]);
export type AgentRunState = z.infer<typeof AgentRunStateSchema>;

export const AgentRunPhaseSchema = z.enum([
  "discovery",
  "planning",
  "implementation",
  "stabilization",
  "release",
  "migration",
  "recovery",
]);
export type AgentRunPhase = z.infer<typeof AgentRunPhaseSchema>;

export const AgentRunRiskSchema = z.enum(["low", "normal", "high", "critical"]);
export type AgentRunRisk = z.infer<typeof AgentRunRiskSchema>;

export const AgentAuthoritySchema = z
  .object({
    allowed: z.array(z.string()).default([]),
    confirmation_required: z.array(z.string()).default([]),
    prohibited: z.array(z.string()).default([]),
  })
  .strict();

export const ContextPackSourceRevisionSchema = z
  .object({
    entity_id: z.string().min(1),
    kind: z.string().min(1),
    title: z.string().min(1),
    revision: z.number().int().min(1),
  })
  .strict();

export const ContextPackSectionSchema = z
  .object({
    title: z.string().min(1),
    summary: z.string().min(1),
    entity_ids: z.array(z.string()).default([]),
  })
  .strict();

export const MethodLensWorkTypeSchema = z.enum(["development"]);
export type MethodLensWorkType = z.infer<typeof MethodLensWorkTypeSchema>;

export const MethodLensAreaSchema = z.enum([
  "lifecycle",
  "business_value",
  "requirements_solution",
  "systems",
  "software",
  "governance",
  "quality_risk_security",
  "delivery_operations",
  "knowledge_documentation",
  "methods_models_practices",
]);
export type MethodLensArea = z.infer<typeof MethodLensAreaSchema>;

export const MethodLensItemSchema = z
  .object({
    prompt: z.string().min(1),
    answer: z.string().min(1).optional(),
    status: z.enum(["answered", "missing", "not_material"]).default("missing"),
    required: z.boolean().default(true),
  })
  .strict();

export const MethodLensSchema = z
  .object({
    work_type: MethodLensWorkTypeSchema,
    generated_at: z.string().datetime(),
    source: z.literal("studio-operating-north-star"),
    areas: z
      .object({
        lifecycle: MethodLensItemSchema,
        business_value: MethodLensItemSchema,
        requirements_solution: MethodLensItemSchema,
        systems: MethodLensItemSchema,
        software: MethodLensItemSchema,
        governance: MethodLensItemSchema,
        quality_risk_security: MethodLensItemSchema,
        delivery_operations: MethodLensItemSchema,
        knowledge_documentation: MethodLensItemSchema,
        methods_models_practices: MethodLensItemSchema,
      })
      .strict(),
    missing_required: z.array(MethodLensAreaSchema).default([]),
  })
  .strict();
export type MethodLens = z.infer<typeof MethodLensSchema>;

export const ContextPackSchema = z
  .object({
    id: z.string().min(3),
    generated_at: z.string().datetime(),
    objective: z.string().min(1),
    source_revisions: z.array(ContextPackSourceRevisionSchema).default([]),
    included_entity_ids: z.array(z.string()).default([]),
    target_repository_ids: z.array(z.string()).default([]),
    target_environment_ids: z.array(z.string()).default([]),
    sections: z.array(ContextPackSectionSchema).default([]),
    redactions: z.array(z.string()).default([]),
    gaps: z.array(z.string()).default([]),
    forbidden_reopenings: z.array(z.string()).default([]),
    next_valid_action: z.string().optional(),
    method_lens: MethodLensSchema.optional(),
    checksum: z.string().length(64),
  })
  .strict();
export type ContextPack = z.infer<typeof ContextPackSchema>;

export const AgentObservationSchema = z
  .object({
    observed_at: z.string().datetime(),
    source: z.enum(["git", "runtime", "user", "handoff", "docs", "code", "other"]),
    summary: z.string().min(1),
    repository_id: z.string().optional(),
    contradictions: z.array(z.string()).default([]),
  })
  .strict();

export const AgentActionSchema = z
  .object({
    recorded_at: z.string().datetime(),
    action: z.string().min(1),
    status: z.enum(["planned", "executed", "blocked", "failed"]).default("executed"),
    command: z.string().optional(),
    target_id: z.string().optional(),
    result_summary: z.string().optional(),
    evidence_ids: z.array(z.string()).default([]),
  })
  .strict();

export const AgentVerificationSchema = z
  .object({
    status: z.enum(["passed", "failed", "not_run"]),
    verified_at: z.string().datetime(),
    command: z.string().optional(),
    result_summary: z.string().optional(),
    artifact_path: z.string().optional(),
    not_run_reason: z.string().optional(),
  })
  .strict();

export const KnowledgeRouteDestinationSchema = z.enum([
  "constitution",
  "prd",
  "decision",
  "entity",
  "workflow",
  "evidence",
  "lesson",
  "temporary_note",
]);
export type KnowledgeRouteDestination = z.infer<typeof KnowledgeRouteDestinationSchema>;

export const LearningPromotionDestinationSchema = z.enum([
  "workflow",
  "schema",
  "test",
  "decision",
  "constitution",
  "repository_instruction",
]);
export type LearningPromotionDestination = z.infer<typeof LearningPromotionDestinationSchema>;

const SalesOfferEvidenceMapSchema = z
  .object({
    profile: z.string().min(1),
    offer: z.string().min(1),
    proof_claims: z.array(z.string()).default([]),
    evidence_ids: z.array(z.string()).default([]),
    gap: z.string().optional(),
  })
  .strict();

export const DecisionAuthoritySchema = z
  .object({
    source: z.enum(["guilherme", "agent", "policy", "evidence"]).default("guilherme"),
    owner_id: z.string().optional(),
    confirmation_required: z.boolean().default(false),
  })
  .strict();

export const EvidenceSpecSchema = GenericSpecSchema.extend({
  evidence_type: z.enum(["file", "url", "command", "screenshot", "backup", "decision", "manual"]),
  path: z.string().optional(),
  url: z.string().url().optional(),
  command: z.string().optional(),
  checksum: z.string().optional(),
  observed_at: z.string().datetime().optional(),
  subject_id: z.string().optional(),
  claims: z.array(z.string()).default([]),
  source_mutability: z
    .enum(["immutable", "mutable", "operator-observed"])
    .default("operator-observed"),
  validated_at: z.string().datetime().optional(),
});
export const TaskSpecSchema = GenericSpecSchema.extend({
  priority: z.enum(["now", "high", "normal", "low"]).default("normal"),
  economic_reason: z.string().optional(),
  acceptance: z.array(z.string()).default([]),
  blocked_by: z.array(z.string()).default([]),
});
export const AgentRunSpecSchema = GenericSpecSchema.extend({
  objective: z.string().min(1),
  started_at: z.string().datetime(),
  finished_at: z.string().datetime().optional(),
  state: AgentRunStateSchema.default("draft"),
  requested_by: z.string().optional(),
  actor_id: z.string().optional(),
  phase: AgentRunPhaseSchema.default("implementation"),
  risk: AgentRunRiskSchema.default("normal"),
  material: z.boolean().default(true),
  result: z.enum(["running", "complete", "blocked", "failed"]).default("running"),
  owning_entities: z.array(z.string()).default([]),
  target_repositories: z.array(z.string()).default([]),
  target_environments: z.array(z.string()).default([]),
  authority: AgentAuthoritySchema.default({
    allowed: [],
    confirmation_required: [],
    prohibited: [],
  }),
  context_pack: ContextPackSchema.optional(),
  observations: z.array(AgentObservationSchema).default([]),
  actions: z.array(AgentActionSchema).default([]),
  verification: AgentVerificationSchema.optional(),
  open_questions: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
  next_valid_action: z.string().optional(),
  evidence_ids: z.array(z.string()).default([]),
  model: z.string().optional(),
});
export const DecisionSpecSchema = GenericSpecSchema.extend({
  decision_type: z
    .enum([
      "decision",
      "knowledge_route",
      "learning_proposal",
      "career_role_strategy",
      "sales_icp_strategy",
    ])
    .default("decision"),
  decision: z.string().optional(),
  rationale: z.string().optional(),
  decided_at: z.string().datetime().optional(),
  alternatives: z.array(z.string()).default([]),
  impact: z.string().optional(),
  reversibility: z.enum(["reversible", "hard_to_reverse", "irreversible"]).optional(),
  authority: DecisionAuthoritySchema.optional(),
  amends_decision_id: z.string().optional(),
  contradiction_ids: z.array(z.string()).default([]),
  route_destination: KnowledgeRouteDestinationSchema.optional(),
  route_target_id: z.string().optional(),
  routed_content: z.string().optional(),
  learning_failure_class: z.string().optional(),
  learning_proposal: z.string().optional(),
  learning_destination: LearningPromotionDestinationSchema.optional(),
  business_types: z.array(z.string()).default([]),
  needs: z.array(z.string()).default([]),
  budget_logic: z.string().optional(),
  geographies: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  delivery_fit: z.array(z.string()).default([]),
  rejected_criteria: z.array(z.string()).default([]),
  offer_evidence_map: z.array(SalesOfferEvidenceMapSchema).default([]),
  evidence_ids: z.array(z.string()).default([]),
});
export const HandoffSpecSchema = z
  .object({
    summary: z.string().min(1),
    created_at: z.string().datetime(),
    context_pack_id: z.string().optional(),
    repository_ids: z.array(z.string()).default([]),
    omitted_sensitive_sections: z.array(z.string()).default([]),
    gaps: z.array(z.string()).default([]),
    next_valid_action: z.string().optional(),
    forbidden_reopenings: z.array(z.string()).default([]),
    confirmation_required: z.array(z.string()).default([]),
    evidence_ids: z.array(z.string()).default([]),
    status: z.enum(["ready", "blocked"]).default("ready"),
  })
  .strict();
export const AgentRunExtendedSpecSchema = AgentRunSpecSchema.extend({
  handoff: HandoffSpecSchema.optional(),
});
