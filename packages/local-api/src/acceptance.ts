import { readdir } from "node:fs/promises";
import path from "node:path";
import { inspectStudioRepositories } from "@guilherme-studio/adapters";
import {
  evaluatePrdCoverage,
  evaluateStudioAcceptance,
  executeWorkflowFixtures,
  hasPortfolioReleaseDecision,
  validateStudio,
} from "@guilherme-studio/core";
import { validateCanonicalFiles } from "@guilherme-studio/storage";
import type { LocalApiContext } from "./types.js";

export async function buildLocalAcceptanceReport(context: LocalApiContext) {
  const validation = await validateStudio(context.paths.root);
  const { files } = await validateCanonicalFiles(context.paths.root);
  const entities = files.map((file) => file.entity);
  const coverage = evaluatePrdCoverage(entities);
  const workflows = await executeWorkflowFixtures();
  const repositories = await inspectStudioRepositories(context);
  const repositoryBlocks = repositories.filter(
    (repository) =>
      repository.isDirty ||
      repository.rootMismatch ||
      repository.expectedBranchViolation ||
      repository.remotePolicyViolation,
  );
  let backups: string[] = [];
  try {
    backups = (await readdir(path.join(context.paths.runtime, "backups"))).filter((entry) =>
      entry.endsWith(".manifest.json"),
    );
  } catch {
    backups = [];
  }
  const explicitDeferralsOk = files.some((file) => {
    if (file.entity.kind !== "decision") {
      return false;
    }
    const decision = Reflect.get(file.entity.spec, "decision");
    return typeof decision === "string" && /defer|deferred|diferid/i.test(decision);
  });
  return evaluateStudioAcceptance({
    coverage,
    workflowOk: workflows.ok,
    workflowFailures: workflows.workflows
      .filter((workflow) => !workflow.ok)
      .map((workflow) => workflow.id),
    validationOk: validation.ok,
    repositoryOk: repositoryBlocks.length === 0,
    backupOk: backups.length > 0,
    portfolioReleaseDecisionOk: hasPortfolioReleaseDecision(entities),
    explicitDeferralsOk,
    detail: {
      repositories: repositoryBlocks,
      backup: { manifest_count: backups.length, latest: backups.sort().at(-1) ?? null },
    },
  });
}
