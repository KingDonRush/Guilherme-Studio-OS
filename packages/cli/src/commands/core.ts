import { inspectStudioRepositories } from "@guilherme-studio/adapters";
import {
  createStudioContext,
  createWorkflowFixtureEntities,
  evaluatePrdCoverage,
  evaluateStudioAcceptance,
  executeWorkflowFixtures,
  hasPortfolioReleaseDecision,
  rebuildProjection,
  validateStudio,
  verifyWorkflowCoverage,
} from "@guilherme-studio/core";
import {
  ActorSchema,
  AdapterRequestSchema,
  AdapterResultSchema,
  CommandEnvelopeSchema,
  createResultEnvelope,
  EventSchema,
  EvidenceReferenceSchema,
  GateDecisionSchema,
  PreparedActionSchema,
  RelationSchema,
  ResultEnvelopeSchema,
  TypedEntitySchema,
} from "@guilherme-studio/schemas";
import {
  migrateCanonicalV1,
  projectionChecksum,
  validateCanonicalFiles,
} from "@guilherme-studio/storage";
import type { Command } from "commander";
import { z } from "zod";
import { exitCodeForEnvelope, globalOptions, pathJoin, print } from "../runtime.js";

export function registerCoreCommands(program: Command): void {
  program
    .command("init")
    .description("Inspect whether the current directory is an initialized Studio root")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      try {
        const context = await createStudioContext(options.root);
        print(
          createResultEnvelope({
            status: "warning",
            result: {
              initialized: true,
              root: context.paths.root,
              message: "Studio root already initialized.",
            },
          }),
          options.json,
          options.quiet,
        );
      } catch (error) {
        print(
          createResultEnvelope({
            status: "blocked",
            requiredActions: ["create_studio_config_from_approved_template"],
            error: {
              code: "workspace_not_initialized",
              message: error instanceof Error ? error.message : String(error),
              details: {},
            },
          }),
          options.json,
          options.quiet,
        );
        process.exitCode = 4;
      }
    });

  program
    .command("validate")
    .description("Validate canonical Studio files")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const result = await validateStudio(options.root);
      print(result, options.json);
      process.exitCode = result.ok ? 0 : 2;
    });

  program
    .command("inspect")
    .description("Inspect Studio configuration and canonical entities")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const context = await createStudioContext(options.root);
      const { files, errors } = await validateCanonicalFiles(context.paths.root);
      print(
        {
          root: context.paths.root,
          runtime: context.paths.runtime,
          operatorId: context.config.operator_id,
          entityCount: files.length,
          errors,
        },
        options.json,
      );
      process.exitCode = errors.length === 0 ? 0 : 2;
    });

  program
    .command("status")
    .description("Show operational status")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const context = await createStudioContext(options.root);
      const { files, errors } = await validateCanonicalFiles(context.paths.root);
      const repositories = await inspectStudioRepositories(context);
      print(
        {
          ok: errors.length === 0,
          entities: files.length,
          repositories,
          projection: context.projection.inspect(),
          errors,
        },
        options.json,
      );
      process.exitCode = errors.length === 0 ? 0 : 2;
    });

  program
    .command("sync")
    .description("Synchronize derived indexes")
    .option("--rebuild", "Rebuild SQLite from canonical files")
    .option("--verify", "Validate canonical files after rebuilding")
    .action(async function action(
      this: Command & { opts(): { rebuild?: boolean; verify?: boolean } },
    ) {
      const options = globalOptions(this);
      const local = this.opts() as { rebuild?: boolean; verify?: boolean };
      if (!local.rebuild) {
        throw new Error("Nothing to sync. Use --rebuild.");
      }
      if (options.dryRun) {
        const validation = await validateStudio(options.root);
        print({ dryRun: true, validation }, options.json);
        return;
      }
      const result = await rebuildProjection(options.root);
      const verification = local.verify ? await validateStudio(options.root) : undefined;
      print({ ...result, ...(verification ? { verification } : {}) }, options.json);
    });

  const migrate = program.command("migrate").description("Run canonical data migrations");
  migrate
    .command("canonical-v1")
    .description("Migrate legacy flat YAML entities to the normative envelope")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const result = await migrateCanonicalV1(options.root ?? process.cwd(), {
        dryRun: options.dryRun ?? false,
      });
      print(result, options.json);
    });

  const schemas = program.command("schemas").description("Inspect and export Studio schemas");
  schemas
    .command("export")
    .description("Export the versioned JSON Schema catalog")
    .option(
      "--output <path>",
      "Output catalog path",
      "docs/studio-os/schemas/generated/catalog.json",
    )
    .action(async function action(this: Command & { opts(): { output: string } }) {
      const options = globalOptions(this);
      const local = this.opts() as { output: string };
      const catalog = {
        api_version: "studio.guilherme.dev/schema-catalog-v1",
        schemas: {
          entity: z.toJSONSchema(TypedEntitySchema),
          relation: z.toJSONSchema(RelationSchema),
          actor: z.toJSONSchema(ActorSchema),
          command: z.toJSONSchema(CommandEnvelopeSchema),
          event: z.toJSONSchema(EventSchema),
          gate: z.toJSONSchema(GateDecisionSchema),
          evidence_reference: z.toJSONSchema(EvidenceReferenceSchema),
          prepared_action: z.toJSONSchema(PreparedActionSchema),
          result: z.toJSONSchema(ResultEnvelopeSchema),
          adapter_request: z.toJSONSchema(AdapterRequestSchema),
          adapter_result: z.toJSONSchema(AdapterResultSchema),
        },
      };
      if (options.dryRun) {
        print({ dryRun: true, output: local.output, catalog }, options.json);
        return;
      }
      const { mkdir, writeFile } = await import("node:fs/promises");
      const { dirname } = await import("node:path");
      const output = pathJoin(options.root ?? process.cwd(), local.output);
      await mkdir(dirname(output), { recursive: true });
      await writeFile(output, `${JSON.stringify(catalog, null, 2)}\n`, { mode: 0o600 });
      print(
        { output: local.output, schemaCount: Object.keys(catalog.schemas).length },
        options.json,
      );
    });

  program
    .command("doctor")
    .description("Diagnose canonical data, projection, transactions, repositories and backups")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const context = await createStudioContext(options.root);
      const validation = await validateStudio(options.root);
      const { files } = await validateCanonicalFiles(context.paths.root);
      const repositories = await inspectStudioRepositories(context);
      const dirty = repositories.filter(
        (repo) => repo.isDirty || repo.rootMismatch || repo.expectedBranchViolation,
      );
      const unexpectedRemotes = repositories.filter((repo) => repo.remotePolicyViolation);
      const pendingTransactions = await context.entities.pendingTransactions();
      const projection = context.projection.inspect();
      const expectedChecksum = projectionChecksum(files);
      const projectionStale = !projection.exists || projection.checksum !== expectedChecksum;
      const pathDrift = await inspectPathDrift(context.paths.root);
      const { readdir } = await import("node:fs/promises");
      const backupDir = pathJoin(context.paths.runtime, "backups");
      let backups: string[] = [];
      try {
        backups = (await readdir(backupDir))
          .filter((entry) => entry.endsWith(".manifest.json"))
          .sort((a, b) => b.localeCompare(a));
      } catch {
        backups = [];
      }
      const checks = [
        {
          name: "canonical_data",
          ok: validation.ok,
          detail: validation.errors,
          remediation: "Run studio validate and repair the reported canonical files.",
        },
        {
          name: "projection",
          ok: !projectionStale,
          detail: { expectedChecksum, actualChecksum: projection.checksum ?? null },
          remediation: "Run studio sync --rebuild --verify.",
        },
        {
          name: "transactions",
          ok: pendingTransactions.length === 0,
          detail: pendingTransactions,
          remediation: "Run studio recovery transactions after inspecting pending manifests.",
        },
        {
          name: "repositories",
          ok: dirty.length === 0 && unexpectedRemotes.length === 0,
          detail: { dirty, unexpectedRemotes },
          remediation: "Commit intentional changes and remove unexpected V1 remotes.",
        },
        {
          name: "path_drift",
          ok: pathDrift.length === 0,
          detail: pathDrift,
          remediation: "Update stale absolute or pre-migration paths to the renamed Studio root.",
        },
        {
          name: "backup",
          ok: backups.length > 0,
          detail: { latest: backups[0] ?? null },
          remediation: "Run studio backup.",
        },
      ];
      const ok = checks.every((check) => check.ok);
      print(
        {
          ok,
          checks,
        },
        options.json,
      );
      process.exitCode = ok ? 0 : 2;
    });

  program
    .command("security")
    .description("Report secret, boundary, projection, backup and recovery checks")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const context = await createStudioContext(options.root);
      const validation = await validateStudio(options.root);
      const { files } = await validateCanonicalFiles(context.paths.root);
      const pendingTransactions = await context.entities.pendingTransactions();
      const locks = await context.entities.inspectLocks();
      const staleLocks = locks.filter((lock) => lock.stale);
      const projection = context.projection.inspect();
      const expectedChecksum = projectionChecksum(files);
      const projectionStale = !projection.exists || projection.checksum !== expectedChecksum;
      const backupManifests = await listBackupManifests(context.paths.runtime);
      const backupEvidence = files.filter(
        (file) => file.entity.kind === "evidence" && file.entity.spec.evidence_type === "backup",
      );
      const restoreEvidence = backupEvidence.filter((file) =>
        [file.entity.metadata.slug, file.entity.spec.title].some((value) => /restore/i.test(value)),
      );
      const panelLoopback =
        context.config.panel.host === "127.0.0.1" || context.config.panel.host === "localhost";
      const checks = [
        {
          name: "canonical_secret_boundary",
          ok: validation.ok,
          detail: validation.errors,
          remediation:
            "Remove inline secret-shaped fields or replace them with secrets:// local references.",
        },
        {
          name: "projection_rebuildable",
          ok: !projectionStale,
          detail: { expectedChecksum, actualChecksum: projection.checksum ?? null },
          remediation: "Run studio sync --rebuild --verify.",
        },
        {
          name: "pending_transactions",
          ok: pendingTransactions.length === 0,
          detail: pendingTransactions,
          remediation: "Run studio recovery transactions after inspecting pending manifests.",
        },
        {
          name: "stale_locks",
          ok: staleLocks.length === 0,
          detail: staleLocks,
          remediation: "Inspect stale locks before removing them.",
        },
        {
          name: "panel_loopback",
          ok: panelLoopback,
          detail: { host: context.config.panel.host, port: context.config.panel.port },
          remediation: "Bind the local panel/API to 127.0.0.1 or localhost.",
        },
        {
          name: "backup_manifest",
          ok: backupManifests.length > 0,
          detail: { latest: backupManifests[0] ?? null, count: backupManifests.length },
          remediation: "Run studio backup and preserve the generated manifest.",
        },
        {
          name: "restore_evidence",
          ok: restoreEvidence.length > 0,
          detail: restoreEvidence.map((file) => ({
            id: file.entity.metadata.id,
            title: file.entity.spec.title,
            path: file.relativePath,
          })),
          remediation: "Run a restore rehearsal/check and register evidence.",
        },
      ];
      const ok = checks.every((check) => check.ok);
      print(
        {
          ok,
          checks,
          summary: {
            entities: files.length,
            backup_manifest_count: backupManifests.length,
            restore_evidence_count: restoreEvidence.length,
            panel_host: context.config.panel.host,
          },
        },
        options.json,
      );
      process.exitCode = ok ? 0 : 2;
    });

  const recovery = program
    .command("recovery")
    .description("Inspect and recover local transactions");
  recovery.command("transactions").action(async function action(this: Command) {
    const options = globalOptions(this);
    const context = await createStudioContext(options.root);
    if (options.dryRun) {
      print({ dryRun: true, pending: await context.entities.pendingTransactions() }, options.json);
      return;
    }
    print(await context.entities.recoverTransactions(), options.json);
  });

  program
    .command("workflow")
    .description("Verify cross-domain journey coverage")
    .option("--fixtures", "Verify the normative journeys against canonical fixtures")
    .option("--execute", "Execute deterministic fixture workflows in temporary Studio roots")
    .option("--workflow <id>", "Execute or verify one workflow id")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as { fixtures?: boolean; execute?: boolean; workflow?: string };
      if (local.execute) {
        if (!local.fixtures) {
          print(
            createResultEnvelope({
              status: "error",
              error: {
                code: "invalid_input",
                message: "Use --fixtures with --execute.",
                details: {},
              },
            }),
            options.json,
            options.quiet,
          );
          process.exitCode = 2;
          return;
        }
        const result = await executeWorkflowFixtures({
          ...(local.workflow ? { workflowId: local.workflow } : {}),
        });
        print(result, options.json, options.quiet);
        process.exitCode = result.ok ? 0 : 2;
        return;
      }
      const context = await createStudioContext(options.root);
      const entities = local.fixtures
        ? createWorkflowFixtureEntities()
        : (await context.entities.scan()).map((file) => file.entity);
      const workflows = verifyWorkflowCoverage(entities).filter(
        (workflow) => !local.workflow || workflow.id === local.workflow,
      );
      const ok = workflows.every((workflow) => workflow.ok);
      print({ ok, mode: local.fixtures ? "fixtures" : "canonical", workflows }, options.json);
      process.exitCode = ok ? 0 : 2;
    });

  program
    .command("coverage")
    .description("Report PRD coverage against canonical records")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const context = await createStudioContext(options.root);
      const { files, errors } = await validateCanonicalFiles(context.paths.root);
      if (errors.length > 0) {
        print({ ok: false, errors }, options.json, options.quiet);
        process.exitCode = 2;
        return;
      }
      const report = evaluatePrdCoverage(files.map((file) => file.entity));
      print(report, options.json, options.quiet);
      process.exitCode = report.summary.missing_capability > 0 ? 2 : 0;
    });

  program
    .command("acceptance")
    .description("Aggregate PRD completion, workflow, repository and release gates")
    .option("--panel-smoke-ok", "Mark the final-path panel smoke as passed")
    .option("--panel-smoke-failed", "Mark the final-path panel smoke as failed")
    .option("--mcp-smoke-ok", "Mark the final-path MCP smoke as passed")
    .option("--mcp-smoke-failed", "Mark the final-path MCP smoke as failed")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as {
        panelSmokeOk?: boolean;
        panelSmokeFailed?: boolean;
        mcpSmokeOk?: boolean;
        mcpSmokeFailed?: boolean;
      };
      const context = await createStudioContext(options.root);
      const validation = await validateStudio(options.root);
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
      const { readdir } = await import("node:fs/promises");
      let backups: string[] = [];
      try {
        backups = (await readdir(pathJoin(context.paths.runtime, "backups"))).filter((entry) =>
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
      const report = evaluateStudioAcceptance({
        coverage,
        workflowOk: workflows.ok,
        workflowFailures: workflows.workflows
          .filter((workflow) => !workflow.ok)
          .map((workflow) => workflow.id),
        validationOk: validation.ok,
        repositoryOk: repositoryBlocks.length === 0,
        backupOk: backups.length > 0,
        ...(local.panelSmokeOk || local.panelSmokeFailed
          ? { panelSmokeOk: Boolean(local.panelSmokeOk && !local.panelSmokeFailed) }
          : {}),
        ...(local.mcpSmokeOk || local.mcpSmokeFailed
          ? { mcpSmokeOk: Boolean(local.mcpSmokeOk && !local.mcpSmokeFailed) }
          : {}),
        explicitDeferralsOk,
        portfolioReleaseDecisionOk: hasPortfolioReleaseDecision(entities),
        detail: {
          repositories: repositoryBlocks,
          backup: { manifest_count: backups.length, latest: backups.sort().at(-1) ?? null },
        },
      });
      const envelope = createResultEnvelope({
        status: report.ok ? "ok" : "blocked",
        result: report,
        requiredActions: report.portfolio_release.allowed
          ? []
          : ["resolve_acceptance_blockers_before_portfolio"],
      });
      print(envelope, options.json, options.quiet);
      process.exitCode = exitCodeForEnvelope(envelope);
    });
}

async function inspectPathDrift(root: string): Promise<Array<{ path: string; pattern: string }>> {
  const { readdir, readFile, stat } = await import("node:fs/promises");
  const roots = [
    "docs",
    "operations",
    "data",
    "portfolio",
    "AGENTS.md",
    "README.md",
    "studio.config.yaml",
  ];
  const patterns = ["Dev/Wordpress", ".ai/tools/mcp"];
  const allowedExtensions = new Set([".json", ".md", ".yaml", ".yml", ".toml", ".txt", ".sh"]);
  const results: Array<{ path: string; pattern: string }> = [];

  async function visit(relativePath: string): Promise<void> {
    const absolutePath = pathJoin(root, relativePath);
    let isDirectory = false;
    try {
      isDirectory = (await stat(absolutePath)).isDirectory();
    } catch {
      return;
    }
    if (isDirectory) {
      for (const entry of await readdir(absolutePath)) {
        await visit(`${relativePath}/${entry}`);
      }
      return;
    }
    const extension = relativePath.includes(".") ? `.${relativePath.split(".").pop() ?? ""}` : "";
    if (!allowedExtensions.has(extension)) {
      return;
    }
    const text = await readFile(absolutePath, "utf8");
    for (const pattern of patterns) {
      if (text.includes(pattern)) {
        results.push({ path: relativePath, pattern });
      }
    }
  }

  for (const rootPath of roots) {
    await visit(rootPath);
  }
  return results.sort((left, right) => left.path.localeCompare(right.path));
}

async function listBackupManifests(runtime: string): Promise<string[]> {
  const { readdir } = await import("node:fs/promises");
  const backupDir = pathJoin(runtime, "backups");
  try {
    return (await readdir(backupDir))
      .filter((entry) => entry.endsWith(".manifest.json"))
      .sort((a, b) => b.localeCompare(a));
  } catch {
    return [];
  }
}
