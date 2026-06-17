import { entityTitle, nowIso, type StudioEntity } from "@guilherme-studio/schemas";
import type { PrdCoverageReport } from "./coverage.js";
import { recordValue } from "./record-utils.js";
import { WORKFLOW_REQUIREMENTS } from "./workflows/fixtures.js";

export type AcceptanceCheckStatus = "pass" | "warn" | "block" | "not_checked";

export interface AcceptanceCheck {
  name: string;
  status: AcceptanceCheckStatus;
  summary: string;
  remediation?: string;
  detail?: unknown;
}

export interface StudioAcceptanceReport {
  ok: boolean;
  generated_at: string;
  checks: AcceptanceCheck[];
  blockers: string[];
  coverage_summary: PrdCoverageReport["summary"];
  workflow_summary: {
    ok: boolean;
    total: number;
    failed: string[];
  };
  portfolio_release: {
    allowed: boolean;
    reasons: string[];
  };
}

export function evaluateStudioAcceptance(input: {
  coverage: PrdCoverageReport;
  workflowOk: boolean;
  workflowFailures?: string[];
  validationOk: boolean;
  repositoryOk: boolean;
  backupOk: boolean;
  panelSmokeOk?: boolean;
  mcpSmokeOk?: boolean;
  portfolioReleaseDecisionOk?: boolean;
  explicitDeferralsOk?: boolean;
  detail?: Record<string, unknown>;
}): StudioAcceptanceReport {
  const checks: AcceptanceCheck[] = [
    {
      name: "coverage",
      status: input.coverage.summary.missing_capability === 0 ? "pass" : "block",
      summary: `${input.coverage.summary.capability_complete} PRDs have implemented capability; ${input.coverage.summary.intake_required} still need real intake.`,
      remediation: "Implement missing capability or register explicit decision deferrals.",
      detail: input.coverage.summary,
    },
    {
      name: "workflows",
      status: input.workflowOk ? "pass" : "block",
      summary: input.workflowOk
        ? "Executable workflow fixtures pass."
        : "Workflow fixtures failed.",
      remediation: "Run studio workflow --fixtures --execute --json and fix failed journeys.",
      detail: input.workflowFailures ?? [],
    },
    {
      name: "canonical_data",
      status: input.validationOk ? "pass" : "block",
      summary: input.validationOk ? "Canonical records validate." : "Canonical validation failed.",
      remediation: "Run studio validate and fix invalid records.",
    },
    {
      name: "repositories",
      status: input.repositoryOk ? "pass" : "block",
      summary: input.repositoryOk
        ? "Registered repositories are clean."
        : "Repository health blocks acceptance.",
      remediation:
        "Resolve dirty state, root mismatch, branch mismatch or remote-policy violation.",
      detail: recordValue(input.detail, "repositories"),
    },
    {
      name: "backup_restore",
      status: input.backupOk ? "pass" : "block",
      summary: input.backupOk
        ? "Backup evidence is present."
        : "Backup or restore evidence is missing.",
      remediation: "Run studio backup and WordPress restore-check before portfolio release.",
      detail: recordValue(input.detail, "backup"),
    },
    {
      name: "panel_smoke",
      status:
        input.panelSmokeOk === undefined ? "not_checked" : input.panelSmokeOk ? "pass" : "block",
      summary:
        input.panelSmokeOk === undefined
          ? "Panel smoke was not provided to acceptance."
          : input.panelSmokeOk
            ? "Panel smoke passed."
            : "Panel smoke failed.",
      remediation: "Run the Playwright panel smoke on the final path.",
    },
    {
      name: "mcp_smoke",
      status: input.mcpSmokeOk === undefined ? "not_checked" : input.mcpSmokeOk ? "pass" : "block",
      summary:
        input.mcpSmokeOk === undefined
          ? "MCP smoke was not provided to acceptance."
          : input.mcpSmokeOk
            ? "MCP smoke passed."
            : "MCP smoke failed.",
      remediation: "Run MCP smoke against the final Studio root.",
    },
    {
      name: "portfolio_release_decision",
      status: input.portfolioReleaseDecisionOk ? "pass" : "block",
      summary: input.portfolioReleaseDecisionOk
        ? "Canonical portfolio release decision is present."
        : "Portfolio remains frozen without a canonical release decision.",
      remediation: "Record an explicit canonical decision before unfreezing portfolio work.",
    },
    {
      name: "deferrals",
      status: input.explicitDeferralsOk ? "pass" : "warn",
      summary: input.explicitDeferralsOk
        ? "Intake gaps are accepted by explicit decision."
        : "Real-data intake gaps remain visible and are not fabricated.",
      remediation:
        "Record decision deferrals or collect real intake before declaring full data readiness.",
    },
  ];
  const blockers = checks
    .filter((check) => check.status === "block" || check.status === "not_checked")
    .map((check) => check.name);
  const portfolioReasons = blockers.length > 0 ? blockers : ["All acceptance checks passed."];
  return {
    ok: blockers.length === 0,
    generated_at: nowIso(),
    checks,
    blockers,
    coverage_summary: input.coverage.summary,
    workflow_summary: {
      ok: input.workflowOk,
      total: WORKFLOW_REQUIREMENTS.length,
      failed: input.workflowFailures ?? [],
    },
    portfolio_release: {
      allowed: blockers.length === 0,
      reasons: portfolioReasons,
    },
  };
}

export function hasPortfolioReleaseDecision(entities: StudioEntity[]): boolean {
  return entities.some((entity) => {
    if (entity.kind !== "decision") {
      return false;
    }
    const decision = Reflect.get(entity.spec, "decision");
    const title = entityTitle(entity);
    const text = `${typeof title === "string" ? title : ""} ${
      typeof decision === "string" ? decision : ""
    }`;
    const normalized = text
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
    if (!normalized.includes("portfolio")) {
      return false;
    }
    if (/(defer|diferid|freeze|frozen|congel|block|bloque)/i.test(normalized)) {
      return false;
    }
    return /release approved|approved release|liberar portfolio|portfolio liberado|liberacao aprovada|descongelar portfolio|unfreeze portfolio/i.test(
      normalized,
    );
  });
}
