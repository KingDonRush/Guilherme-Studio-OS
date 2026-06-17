import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  createEntity,
  type EntityKind,
  nowIso,
  type ResultEnvelope,
  type StudioEntity,
} from "@guilherme-studio/schemas";
import { createStudioCommand, operatorActor } from "../authority.js";
import { executeStudioCommand } from "../command-runtime.js";
import { createStudioContext } from "../context.js";
import { PreparedActionService } from "../prepared-actions/service.js";
import { asRecord, recordString, recordValue } from "../record-utils.js";

export interface WorkflowVerification {
  id: string;
  name: string;
  ok: boolean;
  missingKinds: EntityKind[];
  requiredGates: string[];
  requiredEvidence: string[];
}

export const WORKFLOW_REQUIREMENTS: Array<{
  id: string;
  name: string;
  requiredKinds: EntityKind[];
  requiredGates: string[];
  requiredEvidence: string[];
}> = [
  {
    id: "prospect-to-client",
    name: "Prospect to Client",
    requiredKinds: [
      "organization",
      "prospect",
      "opportunity",
      "proposal",
      "client",
      "engagement",
      "communication",
      "evidence",
    ],
    requiredGates: ["duplicate-check", "public-claim", "external-confirmation"],
    requiredEvidence: ["research", "qualification", "acceptance"],
  },
  {
    id: "multi-site-engagement",
    name: "Client Engagement with Multiple Sites",
    requiredKinds: [
      "client",
      "engagement",
      "contract",
      "invoice",
      "payment",
      "deliverable",
      "project",
      "repository",
      "evidence",
    ],
    requiredGates: ["payment-delivery", "missing-evidence"],
    requiredEvidence: ["scope", "approval", "handoff"],
  },
  {
    id: "work-to-opportunity",
    name: "Completed Work to New Opportunity",
    requiredKinds: [
      "deliverable",
      "portfolioCase",
      "campaign",
      "contentItem",
      "prospect",
      "evidence",
    ],
    requiredGates: ["confidential-data", "public-claim", "external-confirmation"],
    requiredEvidence: ["claim-map", "publication-preview"],
  },
  {
    id: "plugin-release-case",
    name: "Plugin to Release, Demo, Case, and Prospecting",
    requiredKinds: [
      "product",
      "release",
      "repository",
      "environment",
      "portfolioCase",
      "campaign",
      "prospect",
      "evidence",
    ],
    requiredGates: ["missing-evidence", "public-claim", "external-confirmation"],
    requiredEvidence: ["tests", "artifact", "demo"],
  },
  {
    id: "international-application",
    name: "International Job Application",
    requiredKinds: ["organization", "jobApplication", "communication", "evidence", "task"],
    requiredGates: ["duplicate-check", "public-claim", "external-confirmation"],
    requiredEvidence: ["job-source", "evidence-matrix", "submission-receipt"],
  },
  {
    id: "visual-feedback",
    name: "Visual Feedback to Validated Implementation",
    requiredKinds: ["project", "task", "decision", "evidence", "agentRun"],
    requiredGates: ["missing-evidence"],
    requiredEvidence: ["environment-calibration", "before-after", "human-approval"],
  },
  {
    id: "security-incident",
    name: "Security or Sensitive-Data Incident",
    requiredKinds: ["decision", "task", "evidence", "repository", "agentRun"],
    requiredGates: ["confidential-data", "destructive"],
    requiredEvidence: ["redacted-forensics", "recovery", "prevention"],
  },
  {
    id: "agent-handoff",
    name: "New Agent Handoff",
    requiredKinds: ["task", "decision", "evidence", "agentRun", "repository"],
    requiredGates: ["stale-revision", "missing-evidence"],
    requiredEvidence: ["context-pack", "repository-health", "acceptance"],
  },
];

export function verifyWorkflowCoverage(entities: StudioEntity[]): WorkflowVerification[] {
  const kinds = new Set(entities.map((entity) => entity.kind));
  return WORKFLOW_REQUIREMENTS.map((workflow) => {
    const missingKinds = workflow.requiredKinds.filter((kind) => !kinds.has(kind));
    return {
      id: workflow.id,
      name: workflow.name,
      ok: missingKinds.length === 0,
      missingKinds,
      requiredGates: workflow.requiredGates,
      requiredEvidence: workflow.requiredEvidence,
    };
  });
}

export function createWorkflowFixtureEntities(): StudioEntity[] {
  const kinds = [...new Set(WORKFLOW_REQUIREMENTS.flatMap((workflow) => workflow.requiredKinds))];
  return kinds.map((kind) => {
    const common = { kind, title: `Workflow fixture ${kind}` };
    if (kind === "evidence") {
      return createEntity({
        ...common,
        data: { evidence_type: "manual", observed_at: nowIso() },
      });
    }
    if (kind === "task") {
      return createEntity({
        ...common,
        data: { priority: "normal", acceptance: [], blocked_by: [] },
      });
    }
    if (kind === "agentRun") {
      return createEntity({
        ...common,
        data: {
          objective: "Verify workflow fixture coverage",
          started_at: nowIso(),
          result: "complete",
          evidence_ids: [],
        },
      });
    }
    return createEntity(common);
  });
}

export interface WorkflowExecutionStep {
  command: string;
  status: ResultEnvelope["status"];
  entity_id?: string;
  prepared_action_id?: string;
}

export interface WorkflowExecutionReport {
  id: string;
  name: string;
  ok: boolean;
  root: string;
  steps: WorkflowExecutionStep[];
  entity_count: number;
  event_count: number;
  prepared_action_count: number;
  coverage: WorkflowVerification;
}

export async function executeWorkflowFixtures(input: { workflowId?: string } = {}): Promise<{
  ok: boolean;
  mode: "executed-fixtures";
  workflows: WorkflowExecutionReport[];
}> {
  const selected = input.workflowId
    ? WORKFLOW_REQUIREMENTS.filter((workflow) => workflow.id === input.workflowId)
    : WORKFLOW_REQUIREMENTS;
  if (selected.length === 0) {
    throw new Error(`Unknown workflow fixture: ${input.workflowId}`);
  }
  const workflows: WorkflowExecutionReport[] = [];
  for (const workflow of selected) {
    workflows.push(await executeSingleWorkflowFixture(workflow.id));
  }
  return {
    ok: workflows.every((workflow) => workflow.ok),
    mode: "executed-fixtures",
    workflows,
  };
}

async function executeSingleWorkflowFixture(workflowId: string): Promise<WorkflowExecutionReport> {
  const root = await createWorkflowFixtureRoot(workflowId);
  const context = await createStudioContext(root);
  const steps: WorkflowExecutionStep[] = [];
  const run = async (
    command: string,
    payload: Record<string, unknown>,
    targetId?: string,
  ): Promise<ResultEnvelope> => {
    const result = await executeStudioCommand(
      context,
      createStudioCommand(context, {
        command,
        actor: operatorActor(context.config.operator_id),
        payload,
        ...(targetId ? { targetId } : {}),
        idempotencyKey: `${workflowId}:${steps.length + 1}:${command}`,
      }),
    );
    const resultObject =
      result.result && typeof result.result === "object"
        ? (result.result as Record<string, unknown>)
        : {};
    const entityId = recordString(resultObject, "entity_id");
    const preparedActionId = recordString(resultObject, "id");
    steps.push({
      command,
      status: result.status,
      ...(entityId ? { entity_id: entityId } : {}),
      ...(preparedActionId ? { prepared_action_id: preparedActionId } : {}),
    });
    if (!["ok", "warning", "confirmation_required"].includes(result.status)) {
      throw new Error(
        `Workflow fixture ${workflowId} command ${command} failed: ${result.error?.message}`,
      );
    }
    return result;
  };
  const executor = WORKFLOW_EXECUTORS[workflowId];
  if (!executor) {
    throw new Error(`Workflow fixture executor is missing: ${workflowId}`);
  }
  await executor(run);
  const entities = (await context.entities.scan()).map((file) => file.entity);
  const coverage = verifyWorkflowCoverage(entities).find((entry) => entry.id === workflowId);
  if (!coverage) {
    throw new Error(`Workflow coverage not found after execution: ${workflowId}`);
  }
  const preparedActions = await new PreparedActionService(context).list();
  return {
    id: coverage.id,
    name: coverage.name,
    ok: coverage.ok && steps.every((step) => ["ok", "warning"].includes(step.status)),
    root,
    steps,
    entity_count: entities.length,
    event_count: (await context.events.list()).length,
    prepared_action_count: preparedActions.length,
    coverage,
  };
}

type WorkflowRunner = (
  run: (
    command: string,
    payload: Record<string, unknown>,
    targetId?: string,
  ) => Promise<ResultEnvelope>,
) => Promise<void>;

const WORKFLOW_EXECUTORS: Record<string, WorkflowRunner> = {
  "prospect-to-client": async (run) => {
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
  },
  "multi-site-engagement": async (run) => {
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
  },
  "work-to-opportunity": async (run) => {
    const deliverable = entityResult(
      await run("entity.create", { kind: "deliverable", title: "Fixture completed work" }),
    );
    const evidence = entityResult(
      await run("evidence.register", {
        title: "Fixture completed work proof",
        evidence_type: "manual",
        claims: ["Fixture completed work proof"],
      }),
    );
    await run("deliverable.complete", { deliverable_id: deliverable, evidence_ids: [evidence] });
    await run("case.create-from-evidence", {
      evidence_id: evidence,
      title: "Fixture completed work case",
    });
    const campaign = entityResult(
      await run("entity.create", { kind: "campaign", title: "Fixture case campaign" }),
    );
    await run("content.prepare", {
      campaign_id: campaign,
      title: "Fixture case post",
      channel: "linkedin",
      public_claims: ["Fixture completed work proof"],
      evidence_ids: [evidence],
    });
    await run("entity.create", { kind: "prospect", title: "Fixture follow-on prospect" });
  },
  "plugin-release-case": async (run) => {
    const product = entityResult(
      await run("entity.create", { kind: "product", title: "Fixture Plugin" }),
    );
    const release = entityResult(
      await run("release.prepare", { product_id: product, version: "1.0.0-fixture" }),
    );
    const evidence = entityResult(
      await run("evidence.register", {
        title: "Fixture release tests",
        evidence_type: "manual",
        claims: ["Fixture release tests passed"],
      }),
    );
    await run("release.publish", { release_id: release, evidence_ids: [evidence] }, release);
    await run("entity.create", { kind: "repository", title: "Fixture plugin repository" });
    await run("entity.create", { kind: "environment", title: "Fixture WordPress environment" });
    await run("case.create-from-evidence", {
      evidence_id: evidence,
      title: "Fixture release case",
    });
    await run("entity.create", { kind: "campaign", title: "Fixture release campaign" });
    await run("entity.create", { kind: "prospect", title: "Fixture plugin prospect" });
  },
  "international-application": async (run) => {
    const organization = entityResult(
      await run("entity.create", { kind: "organization", title: "Fixture International Co" }),
    );
    const application = entityResult(
      await run("application.prepare", {
        title: "Fixture international application",
        source_url: "https://example.com/jobs/fixture",
        organization_id: organization,
      }),
    );
    await run("evidence.register", {
      title: "Fixture application evidence matrix",
      evidence_type: "manual",
      subject_id: application,
      claims: ["Fixture application materials match role"],
    });
    await run("communication.prepare", {
      subject_id: application,
      channel: "email",
      message: "Prepared local application follow-up.",
    });
    await run("entity.create", { kind: "communication", title: "Fixture application receipt" });
    await run("entity.create", { kind: "task", title: "Fixture application follow-up task" });
  },
  "visual-feedback": async (run) => {
    await run("entity.create", { kind: "project", title: "Fixture visual project" });
    const task = entityResult(
      await run("entity.create", { kind: "task", title: "Fixture visual implementation task" }),
    );
    const evidence = entityResult(
      await run("evidence.register", {
        title: "Fixture visual before-after approval",
        evidence_type: "manual",
        claims: ["Fixture visual implementation approved"],
      }),
    );
    await run("decision.record", {
      title: "Fixture visual approval decision",
      decision: "Visual implementation accepted for fixture.",
      evidence_ids: [evidence],
    });
    await run("handoff.create", {
      task_id: task,
      title: "Fixture visual handoff",
      objective: "Continue from approved visual fixture.",
      summary: "Use the visual evidence before changing implementation.",
    });
  },
  "security-incident": async (run) => {
    const repository = entityResult(
      await run("entity.create", { kind: "repository", title: "Fixture incident repository" }),
    );
    const task = entityResult(
      await run("entity.create", { kind: "task", title: "Fixture security incident task" }),
    );
    const evidence = entityResult(
      await run("evidence.register", {
        title: "Fixture redacted forensics",
        evidence_type: "manual",
        claims: ["Fixture redacted forensics captured"],
      }),
    );
    await run("decision.record", {
      title: "Fixture incident containment decision",
      decision: "Incident remains contained in fixture.",
      evidence_ids: [evidence],
    });
    await run("handoff.create", {
      task_id: task,
      title: "Fixture incident handoff",
      objective: "Continue recovery from redacted evidence.",
      summary: "Review forensics and prevention evidence first.",
      repository_ids: [repository],
    });
  },
  "agent-handoff": async (run) => {
    const repository = entityResult(
      await run("entity.create", { kind: "repository", title: "Fixture handoff repository" }),
    );
    const task = entityResult(
      await run("entity.create", { kind: "task", title: "Fixture handoff task" }),
    );
    const evidence = entityResult(
      await run("evidence.register", {
        title: "Fixture context pack evidence",
        evidence_type: "manual",
        claims: ["Fixture context pack accepted"],
      }),
    );
    await run("decision.record", {
      title: "Fixture handoff decision",
      decision: "New agent starts from context pack fixture.",
      evidence_ids: [evidence],
    });
    await run("handoff.create", {
      task_id: task,
      title: "Fixture agent handoff",
      objective: "Resume from context pack.",
      summary: "Use repository health and evidence before changes.",
      repository_ids: [repository],
    });
  },
};

async function createWorkflowFixtureRoot(workflowId: string): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), `studio-workflow-${workflowId}-`));
  await writeFile(
    path.join(root, "studio.config.yaml"),
    [
      "api_version: studio.guilherme.dev/config-v1",
      `root_name: Workflow fixture ${workflowId}`,
      "operator_id: per_20260614_guilherme-silva",
      "canonical_roots:",
      "  - data",
      "  - clients",
      "  - products",
      "  - portfolio",
      "  - marketing",
      "  - sales",
      "  - career",
      "  - operations",
      "  - docs/studio-os",
      "runtime_path: runtime",
      "panel:",
      "  host: 127.0.0.1",
      "  port: 47839",
      "adapters: {}",
      "",
    ].join("\n"),
  );
  return root;
}

function entityResult(result: ResultEnvelope): string {
  const value =
    result.result && typeof result.result === "object"
      ? (result.result as Record<string, unknown>)
      : {};
  const entityId = recordString(value, "entity_id");
  if (entityId) {
    return entityId;
  }
  const entity = asRecord(recordValue(value, "entity"));
  if (entity) {
    const metadata = asRecord(recordValue(entity, "metadata"));
    const id = recordString(metadata, "id");
    if (id) {
      return id;
    }
  }
  throw new Error(`Command did not return an entity id: ${JSON.stringify(result.result)}`);
}
