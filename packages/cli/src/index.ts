import {
  backupWordPressDatabase,
  backupWordPressUploads,
  createExternalAdapterProvider,
  createStudioBackup,
  executeDisabledExternalAdapter,
  fixWordPressRootOwnership,
  inspectStudioRepositories,
  restoreCheckWordPressDatabase,
  restoreCheckWordPressUploads,
  wordpressHealth,
  wordpressPluginList,
  wordpressStart,
  wordpressStatus,
  wordpressStop,
  wordpressWpCli,
} from "@guilherme-studio/adapters";
import { optimizeAssets } from "@guilherme-studio/assets";
import {
  createStudioCommand,
  createStudioContext,
  createWorkflowFixtureEntities,
  type DomainCommandService,
  evaluatePrdCoverage,
  executeStudioCommand,
  executeWorkflowFixtures,
  kindFromAlias,
  operatorActor,
  PreparedActionService,
  rebuildProjection,
  validateStudio,
  verifyWorkflowCoverage,
} from "@guilherme-studio/core";
import { serveLocalApi } from "@guilherme-studio/local-api";
import {
  ActorSchema,
  AdapterRequestSchema,
  AdapterResultSchema,
  type Classification,
  CommandEnvelopeSchema,
  createActor,
  createResultEnvelope,
  EventSchema,
  EvidenceReferenceSchema,
  entityId,
  entityStatus,
  entityTitle,
  GateDecisionSchema,
  PreparedActionSchema,
  RelationSchema,
  type ResultEnvelope,
  ResultEnvelopeSchema,
  TypedEntitySchema,
} from "@guilherme-studio/schemas";
import {
  migrateCanonicalV1,
  projectionChecksum,
  validateCanonicalFiles,
} from "@guilherme-studio/storage";
import { Command } from "commander";
import { z } from "zod";

interface GlobalOptions {
  root?: string;
  json?: boolean;
  dryRun?: boolean;
  quiet?: boolean;
  verbose?: boolean;
  actor?: string;
  idempotencyKey?: string;
  expectedRevision?: string;
  yes?: boolean;
}

function print(value: unknown, json = false, quiet = false): void {
  if (quiet) {
    return;
  }
  if (json) {
    console.log(JSON.stringify(value, null, 2));
    return;
  }
  if (typeof value === "string") {
    console.log(value);
    return;
  }
  console.log(JSON.stringify(value, null, 2));
}

export function exitCodeForEnvelope(result: ResultEnvelope): number {
  switch (result.status) {
    case "ok":
    case "warning":
      return 0;
    case "confirmation_required":
      return 5;
    case "blocked":
      return 4;
    case "conflict":
      return 6;
    case "error":
      return result.error?.code === "invalid_input" ? 2 : 10;
  }
}

function globalOptions(command: Command): GlobalOptions {
  return command.optsWithGlobals<GlobalOptions>();
}

async function executeCliCommand(
  options: GlobalOptions,
  command: string,
  payload: Record<string, unknown>,
  targetId?: string,
): Promise<ResultEnvelope> {
  const context = await createStudioContext(options.root);
  const actor =
    !options.actor || options.actor === context.config.operator_id
      ? operatorActor(context.config.operator_id)
      : createActor({
          id: options.actor,
          type: "agent",
          capabilities: ["entity.read", "repository.inspect", "environment.inspect"],
          classification_ceiling: "internal",
        });
  const envelope = createStudioCommand(context, {
    command,
    actor,
    payload,
    ...(targetId ? { targetId } : {}),
    ...(options.expectedRevision
      ? { expectedRevision: Number.parseInt(options.expectedRevision, 10) }
      : {}),
    ...(options.idempotencyKey ? { idempotencyKey: options.idempotencyKey } : {}),
    dryRun: options.dryRun ?? false,
  });
  const result = await executeStudioCommand(context, envelope);
  process.exitCode = exitCodeForEnvelope(result);
  print(result, options.json, options.quiet);
  return result;
}

export function createProgram(): Command {
  const program = new Command();
  program
    .name("studio")
    .description("Guilherme Studio OS local-first operations CLI")
    .option("--root <path>", "Studio root", process.cwd())
    .option("--json", "Print JSON output")
    .option("--quiet", "Suppress human output")
    .option("--verbose", "Include diagnostic detail")
    .option("--dry-run", "Validate without writing")
    .option("--actor <id>", "Actor identity")
    .option("--idempotency-key <value>", "Retry-safe mutation key")
    .option("--expected-revision <number>", "Required entity revision")
    .option("--yes", "Acknowledge ordinary local prompts");

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

  const entity = program.command("entity").description("Manage canonical entities");
  entity
    .command("list")
    .argument("[kind]", "Entity kind or alias")
    .action(async function action(this: Command, kindAlias?: string) {
      const options = globalOptions(this);
      const context = await createStudioContext(options.root);
      const { files } = await validateCanonicalFiles(context.paths.root);
      const kind = kindAlias ? kindFromAlias(kindAlias) : undefined;
      const entities = files
        .filter((file) => !kind || file.entity.kind === kind)
        .map((file) => ({
          id: entityId(file.entity),
          kind: file.entity.kind,
          title: entityTitle(file.entity),
          status: entityStatus(file.entity),
          path: file.relativePath,
        }));
      print(entities, options.json);
    });

  entity
    .command("create")
    .argument("<kind>", "Entity kind or alias")
    .requiredOption("--title <title>", "Entity title")
    .option("--summary <summary>", "Entity summary")
    .option(
      "--classification <classification>",
      "public, internal, confidential or secret",
      "internal",
    )
    .action(async function action(
      this: Command & { opts(): { title: string; summary?: string; classification: string } },
      kindAlias: string,
    ) {
      const options = globalOptions(this);
      const local = this.opts() as { title: string; summary?: string; classification: string };
      const kind = kindFromAlias(kindAlias);
      const input = {
        kind,
        title: local.title,
        classification: local.classification as Classification,
        ...(local.summary ? { summary: local.summary } : {}),
      };
      await executeCliCommand(options, "entity.create", input);
    });

  entity
    .command("transition")
    .argument("<id>", "Canonical entity id")
    .argument("<status>", "Target lifecycle status")
    .action(async function action(this: Command, id: string, status: string) {
      const options = globalOptions(this);
      await executeCliCommand(options, "entity.transition", { status }, id);
    });

  const action = program.command("action").description("Manage governed prepared actions");
  action
    .command("prepare")
    .argument("<type>", "Action type")
    .requiredOption("--payload <json>", "Exact JSON payload")
    .option("--ttl <seconds>", "Expiration in seconds", "900")
    .action(async function actionCommand(
      this: Command & { opts(): { payload: string; ttl: string } },
      type: string,
    ) {
      const options = globalOptions(this);
      const local = this.opts() as { payload: string; ttl: string };
      const payload = JSON.parse(local.payload) as Record<string, unknown>;
      await executeCliCommand(options, "action.prepare", {
        action_type: type,
        payload,
        ttl_seconds: Number.parseInt(local.ttl, 10),
      });
    });
  action.command("list").action(async function actionCommand(this: Command) {
    const options = globalOptions(this);
    const context = await createStudioContext(options.root);
    print(await new PreparedActionService(context).list(), options.json);
  });
  action
    .command("confirm")
    .argument("<id>", "Prepared action id")
    .requiredOption("--checksum <sha256>", "Exact payload checksum returned by prepare")
    .action(async function actionCommand(
      this: Command & { opts(): { checksum: string } },
      id: string,
    ) {
      const options = globalOptions(this);
      const local = this.opts() as { checksum: string };
      await executeCliCommand(options, "action.confirm", {
        action_id: id,
        payload_checksum: local.checksum,
      });
    });
  action
    .command("reconcile")
    .argument("<id>", "Executed action id")
    .requiredOption("--result <json>", "Observed reconciliation result")
    .action(async function actionCommand(
      this: Command & { opts(): { result: string } },
      id: string,
    ) {
      const options = globalOptions(this);
      const local = this.opts() as { result: string };
      await executeCliCommand(options, "action.reconcile", {
        action_id: id,
        result: JSON.parse(local.result) as Record<string, unknown>,
      });
    });

  const domainCommands = new Map<string, Command>();
  for (const alias of [
    "person",
    "organization",
    "prospect",
    "client",
    "opportunity",
    "engagement",
    "deliverable",
    "project",
    "repository",
    "product",
    "case",
    "evidence",
    "campaign",
    "content",
    "proposal",
    "release",
    "payment",
    "invoice",
    "contract",
    "application",
    "task",
    "decision",
    "communication",
    "agentRun",
  ]) {
    domainCommands.set(alias, addDomainCommand(program, alias));
  }

  const crm = program.command("crm").description("CRM and relationship operations");
  crm
    .command("review-duplicates")
    .option("--kind <kind>", "Restrict duplicate review to one entity kind")
    .option("--title <title>", "Title or name to compare")
    .option("--email <email>", "Email to compare")
    .option("--website <url>", "Website to compare")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as {
        kind?: string;
        title?: string;
        email?: string;
        website?: string;
      };
      await executeCliCommand(options, "crm.review-duplicates", {
        ...(local.kind ? { kind: local.kind } : {}),
        ...(local.title ? { title: local.title } : {}),
        ...(local.email ? { email: local.email } : {}),
        ...(local.website ? { website: local.website } : {}),
      });
    });

  domainCommands
    .get("prospect")
    ?.command("qualify")
    .argument("<id>")
    .requiredOption("--rationale <text>")
    .requiredOption("--score <number>")
    .option("--disqualify", "Mark as disqualified")
    .action(async function action(this: Command, id: string) {
      const options = globalOptions(this);
      const local = this.opts() as { rationale: string; score: string; disqualify?: boolean };
      await executeCliCommand(
        options,
        "prospect.qualify",
        {
          rationale: local.rationale,
          score: Number.parseInt(local.score, 10),
          qualified: !local.disqualify,
        },
        id,
      );
    });

  domainCommands
    .get("communication")
    ?.command("prepare")
    .requiredOption("--subject <id>")
    .requiredOption("--channel <channel>")
    .requiredOption("--message <text>")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as { subject: string; channel: string; message: string };
      await executeCliCommand(options, "communication.prepare", {
        subject_id: local.subject,
        channel: local.channel,
        message: local.message,
      });
    });

  domainCommands
    .get("evidence")
    ?.command("register")
    .requiredOption("--title <title>")
    .requiredOption("--type <type>")
    .option("--subject <id>")
    .option("--path <path>")
    .option("--url <url>")
    .option("--command <command>")
    .option("--checksum <sha256>")
    .option("--claim <claim...>", "Claim supported by this evidence")
    .option(
      "--source-mutability <mode>",
      "immutable, mutable or operator-observed",
      "operator-observed",
    )
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as {
        title: string;
        type: Parameters<DomainCommandService["registerEvidence"]>[0]["evidenceType"];
        subject?: string;
        path?: string;
        url?: string;
        command?: string;
        checksum?: string;
        claim?: string[];
        sourceMutability?: "immutable" | "mutable" | "operator-observed";
      };
      await executeCliCommand(options, "evidence.register", {
        title: local.title,
        evidence_type: local.type,
        ...(local.subject ? { subject_id: local.subject } : {}),
        ...(local.path ? { path: local.path } : {}),
        ...(local.url ? { url: local.url } : {}),
        ...(local.command ? { command: local.command } : {}),
        ...(local.checksum ? { checksum: local.checksum } : {}),
        claims: local.claim ?? [],
        ...(local.sourceMutability ? { source_mutability: local.sourceMutability } : {}),
      });
    });

  domainCommands
    .get("engagement")
    ?.command("create-from-opportunity")
    .argument("<opportunity-id>")
    .option("--title <title>")
    .action(async function action(this: Command, opportunityId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { title?: string };
      await executeCliCommand(options, "engagement.create-from-opportunity", {
        opportunity_id: opportunityId,
        ...(local.title ? { title: local.title } : {}),
      });
    });

  domainCommands
    .get("opportunity")
    ?.command("convert")
    .argument("<opportunity-id>")
    .option("--client-title <title>")
    .option("--engagement-title <title>")
    .action(async function action(this: Command, opportunityId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { clientTitle?: string; engagementTitle?: string };
      await executeCliCommand(options, "opportunity.convert", {
        opportunity_id: opportunityId,
        ...(local.clientTitle ? { client_title: local.clientTitle } : {}),
        ...(local.engagementTitle ? { engagement_title: local.engagementTitle } : {}),
      });
    });

  domainCommands
    .get("deliverable")
    ?.command("complete")
    .argument("<deliverable-id>")
    .requiredOption("--evidence <id...>")
    .action(async function action(this: Command, deliverableId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { evidence: string[] };
      await executeCliCommand(
        options,
        "deliverable.complete",
        {
          deliverable_id: deliverableId,
          evidence_ids: local.evidence,
        },
        deliverableId,
      );
    });

  domainCommands
    .get("proposal")
    ?.command("prepare")
    .argument("<opportunity-id>")
    .option("--title <title>")
    .action(async function action(this: Command, opportunityId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { title?: string };
      await executeCliCommand(options, "proposal.prepare", {
        opportunity_id: opportunityId,
        ...(local.title ? { title: local.title } : {}),
      });
    });

  domainCommands
    .get("application")
    ?.command("prepare")
    .requiredOption("--title <title>")
    .requiredOption("--source <url>")
    .option("--organization <id>")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as { title: string; source: string; organization?: string };
      await executeCliCommand(options, "application.prepare", {
        title: local.title,
        source_url: local.source,
        ...(local.organization ? { organization_id: local.organization } : {}),
      });
    });

  domainCommands
    .get("application")
    ?.command("follow-up")
    .argument("<application-id>")
    .requiredOption("--at <iso-date>")
    .option("--channel <channel>")
    .option("--message <text>")
    .action(async function action(this: Command, applicationId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { at: string; channel?: string; message?: string };
      await executeCliCommand(
        options,
        "application.follow-up",
        {
          application_id: applicationId,
          follow_up_at: local.at,
          ...(local.channel ? { channel: local.channel } : {}),
          ...(local.message ? { message: local.message } : {}),
        },
        applicationId,
      );
    });

  domainCommands
    .get("application")
    ?.command("record-interview")
    .argument("<application-id>")
    .requiredOption("--at <iso-date>")
    .option("--notes <text>")
    .action(async function action(this: Command, applicationId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { at: string; notes?: string };
      await executeCliCommand(
        options,
        "application.record-interview",
        {
          application_id: applicationId,
          interview_at: local.at,
          ...(local.notes ? { notes: local.notes } : {}),
        },
        applicationId,
      );
    });

  domainCommands
    .get("product")
    ?.command("prepare-release")
    .argument("<product-id>")
    .requiredOption("--version <version>")
    .action(async function action(this: Command, productId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { version: string };
      await executeCliCommand(options, "release.prepare", {
        product_id: productId,
        version: local.version,
      });
    });

  domainCommands
    .get("release")
    ?.command("publish")
    .argument("<release-id>")
    .requiredOption("--evidence <id...>")
    .option("--demo-url <url>")
    .action(async function action(this: Command, releaseId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { evidence: string[]; demoUrl?: string };
      await executeCliCommand(
        options,
        "release.publish",
        {
          release_id: releaseId,
          evidence_ids: local.evidence,
          ...(local.demoUrl ? { demo_url: local.demoUrl } : {}),
        },
        releaseId,
      );
    });

  domainCommands
    .get("campaign")
    ?.command("prepare-content")
    .argument("<campaign-id>")
    .requiredOption("--title <title>")
    .option("--channel <channel>")
    .option("--publish-at <iso-date>")
    .option("--claim <text...>")
    .option("--evidence <id...>")
    .action(async function action(this: Command, campaignId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        title: string;
        channel?: string;
        publishAt?: string;
        claim?: string[];
        evidence?: string[];
      };
      await executeCliCommand(options, "content.prepare", {
        campaign_id: campaignId,
        title: local.title,
        ...(local.channel ? { channel: local.channel } : {}),
        ...(local.publishAt ? { publish_at: local.publishAt } : {}),
        public_claims: local.claim ?? [],
        evidence_ids: local.evidence ?? [],
      });
    });

  domainCommands
    .get("contract")
    ?.command("create-from-engagement")
    .argument("<engagement-id>")
    .option("--title <title>")
    .option("--value-minor <amount>")
    .option("--currency <currency>")
    .action(async function action(this: Command, engagementId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { title?: string; valueMinor?: string; currency?: string };
      await executeCliCommand(options, "contract.create-from-engagement", {
        engagement_id: engagementId,
        ...(local.title ? { title: local.title } : {}),
        ...(local.valueMinor ? { value_minor: Number.parseInt(local.valueMinor, 10) } : {}),
        ...(local.currency ? { currency: local.currency } : {}),
      });
    });

  domainCommands
    .get("invoice")
    ?.command("create-for-contract")
    .argument("<contract-id>")
    .requiredOption("--amount-minor <amount>")
    .requiredOption("--currency <currency>")
    .option("--title <title>")
    .option("--due-at <iso-date>")
    .option("--reference <reference>")
    .action(async function action(this: Command, contractId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        amountMinor: string;
        currency: string;
        title?: string;
        dueAt?: string;
        reference?: string;
      };
      await executeCliCommand(options, "invoice.create-for-contract", {
        contract_id: contractId,
        amount_minor: Number.parseInt(local.amountMinor, 10),
        currency: local.currency,
        ...(local.title ? { title: local.title } : {}),
        ...(local.dueAt ? { due_at: local.dueAt } : {}),
        ...(local.reference ? { reference: local.reference } : {}),
      });
    });

  domainCommands
    .get("payment")
    ?.command("record-for-invoice")
    .argument("<invoice-id>")
    .requiredOption("--amount-minor <amount>")
    .requiredOption("--currency <currency>")
    .option("--title <title>")
    .option("--expected-at <iso-date>")
    .action(async function action(this: Command, invoiceId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        amountMinor: string;
        currency: string;
        title?: string;
        expectedAt?: string;
      };
      await executeCliCommand(options, "payment.record-for-invoice", {
        invoice_id: invoiceId,
        amount_minor: Number.parseInt(local.amountMinor, 10),
        currency: local.currency,
        ...(local.title ? { title: local.title } : {}),
        ...(local.expectedAt ? { expected_at: local.expectedAt } : {}),
      });
    });

  domainCommands
    .get("payment")
    ?.command("reconcile")
    .argument("<payment-id>")
    .requiredOption("--reference <reference>")
    .action(async function action(this: Command, paymentId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { reference: string };
      await executeCliCommand(
        options,
        "payment.reconcile",
        {
          payment_id: paymentId,
          reference: local.reference,
        },
        paymentId,
      );
    });

  domainCommands
    .get("decision")
    ?.command("record")
    .requiredOption("--title <title>")
    .requiredOption("--decision <text>")
    .option("--rationale <text>")
    .option("--evidence <id...>")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as {
        title: string;
        decision: string;
        rationale?: string;
        evidence?: string[];
      };
      await executeCliCommand(options, "decision.record", {
        title: local.title,
        decision: local.decision,
        ...(local.rationale ? { rationale: local.rationale } : {}),
        evidence_ids: local.evidence ?? [],
      });
    });

  domainCommands
    .get("case")
    ?.command("create-from-evidence")
    .requiredOption("--evidence <id>")
    .requiredOption("--title <title>")
    .option("--summary <summary>")
    .option("--url <url>")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as {
        evidence: string;
        title: string;
        summary?: string;
        url?: string;
      };
      await executeCliCommand(options, "case.create-from-evidence", {
        evidence_id: local.evidence,
        title: local.title,
        ...(local.summary ? { summary: local.summary } : {}),
        ...(local.url ? { case_url: local.url } : {}),
      });
    });

  domainCommands
    .get("project")
    ?.command("register-repo")
    .argument("<project-id>")
    .requiredOption("--title <title>")
    .requiredOption("--path <path>")
    .option("--branch <branch>")
    .option("--remote-policy <policy>", "allowed, forbidden or no-remote-in-v1", "allowed")
    .action(async function action(this: Command, projectId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        title: string;
        path: string;
        branch?: string;
        remotePolicy: string;
      };
      await executeCliCommand(options, "project.register-repo", {
        project_id: projectId,
        title: local.title,
        repository_path: local.path,
        ...(local.branch ? { branch: local.branch } : {}),
        remote_policy: local.remotePolicy,
      });
    });

  domainCommands
    .get("agentRun")
    ?.command("handoff")
    .requiredOption("--task <id>")
    .requiredOption("--title <title>")
    .requiredOption("--objective <text>")
    .requiredOption("--summary <text>")
    .option("--repository <id...>")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as {
        task: string;
        title: string;
        objective: string;
        summary: string;
        repository?: string[];
      };
      await executeCliCommand(options, "handoff.create", {
        task_id: local.task,
        title: local.title,
        objective: local.objective,
        summary: local.summary,
        repository_ids: local.repository ?? [],
      });
    });

  const repo = program
    .command("repo")
    .description("Inspect registered repositories and Git health");
  repo.command("inspect").action(async function action(this: Command) {
    const options = globalOptions(this);
    const context = await createStudioContext(options.root);
    print(await inspectStudioRepositories(context), options.json);
  });

  program
    .command("bootstrap-vertical")
    .description("Create the initial Task + AgentRun + Evidence vertical")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      if (options.dryRun) {
        print(
          { dryRun: true, message: "Would create Task + AgentRun + Evidence entities." },
          options.json,
        );
        return;
      }
      const { createTaskEvidenceRun } = await import("@guilherme-studio/core");
      const result = await createTaskEvidenceRun(options.root);
      print(result, options.json);
    });

  program
    .command("dashboard")
    .description("Print dashboard launch hint")
    .option("--serve", "Serve the local dashboard API and built panel")
    .option("--panel-dist <path>", "Built panel directory", "apps/panel/dist")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const context = await createStudioContext(options.root);
      const local = this.opts() as { serve?: boolean; panelDist: string };
      if (local.serve) {
        const served = await serveLocalApi({
          root: context.paths.root,
          panelDist: pathJoin(context.paths.root, local.panelDist),
        });
        print(
          {
            url: served.url,
            token: served.token,
            note: "The session token is also set as a SameSite cookie when the panel loads.",
          },
          options.json,
        );
        await new Promise(() => undefined);
        return;
      }
      print(
        {
          host: context.config.panel.host,
          port: context.config.panel.port,
          command: "npm run dev:panel",
        },
        options.json,
      );
    });

  program
    .command("backup")
    .description("Create a local Studio OS backup archive")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      if (options.dryRun) {
        print(
          {
            dryRun: true,
            includes: [
              "studio.config.yaml",
              "data",
              "clients",
              "products",
              "portfolio",
              "marketing",
              "sales",
              "career",
              "operations",
              "docs/studio-os",
            ],
          },
          options.json,
        );
        return;
      }
      const context = await createStudioContext(options.root);
      print(await createStudioBackup(context), options.json);
    });

  const wordpress = program.command("wordpress").description("WordPress runtime helpers");
  wordpress.command("start").action(async function action(this: Command) {
    const options = globalOptions(this);
    const context = await createStudioContext(options.root);
    print(await wordpressStart(context), options.json, options.quiet);
  });
  wordpress.command("stop").action(async function action(this: Command) {
    const options = globalOptions(this);
    const context = await createStudioContext(options.root);
    print(await wordpressStop(context), options.json, options.quiet);
  });
  wordpress.command("health").action(async function action(this: Command) {
    const options = globalOptions(this);
    const context = await createStudioContext(options.root);
    const result = await wordpressHealth(context);
    print(result, options.json, options.quiet);
    process.exitCode = result.ok ? 0 : 7;
  });
  wordpress
    .command("fix-ownership")
    .argument("<site-path>", "WordPress site root path, relative to Studio root or absolute")
    .description("Make the WordPress site root writable by the host user without recursive chown")
    .action(async function action(this: Command, sitePath: string) {
      const options = globalOptions(this);
      const context = await createStudioContext(options.root);
      print(
        await fixWordPressRootOwnership(context, sitePath, { dryRun: options.dryRun ?? false }),
        options.json,
      );
    });
  wordpress.command("status").action(async function action(this: Command) {
    const options = globalOptions(this);
    const context = await createStudioContext(options.root);
    print(await wordpressStatus(context), options.json);
  });
  wordpress.command("plugin-list").action(async function action(this: Command) {
    const options = globalOptions(this);
    const context = await createStudioContext(options.root);
    print(await wordpressPluginList(context), options.json);
  });
  wordpress
    .command("wp")
    .allowUnknownOption(true)
    .argument("[args...]", "Arguments passed to WP-CLI")
    .action(async function action(this: Command, args: string[] = []) {
      const options = globalOptions(this);
      const context = await createStudioContext(options.root);
      print(await wordpressWpCli(context, args), options.json, options.quiet);
    });
  wordpress.command("backup-db").action(async function action(this: Command) {
    const options = globalOptions(this);
    if (options.dryRun) {
      print({ dryRun: true, action: "wordpress.backup-db" }, options.json);
      return;
    }
    const context = await createStudioContext(options.root);
    print(await backupWordPressDatabase(context), options.json);
  });
  wordpress.command("backup-uploads").action(async function action(this: Command) {
    const options = globalOptions(this);
    if (options.dryRun) {
      print({ dryRun: true, action: "wordpress.backup-uploads" }, options.json);
      return;
    }
    const context = await createStudioContext(options.root);
    print(await backupWordPressUploads(context), options.json);
  });
  wordpress
    .command("restore-check")
    .argument("<sql-path>", "SQL backup path inside the Studio root")
    .action(async function action(this: Command, sqlPath: string) {
      const options = globalOptions(this);
      if (options.dryRun) {
        print({ dryRun: true, action: "wordpress.restore-check", sqlPath }, options.json);
        return;
      }
      const context = await createStudioContext(options.root);
      print(await restoreCheckWordPressDatabase(context, sqlPath), options.json);
    });
  wordpress
    .command("restore-check-uploads")
    .argument("<archive-path>", "Uploads archive path inside the Studio root")
    .action(async function action(this: Command, archivePath: string) {
      const options = globalOptions(this);
      if (options.dryRun) {
        print(
          { dryRun: true, action: "wordpress.restore-check-uploads", archivePath },
          options.json,
        );
        return;
      }
      const context = await createStudioContext(options.root);
      print(await restoreCheckWordPressUploads(context, archivePath), options.json);
    });

  const asset = program.command("asset").description("Manage optimized visual assets");
  asset
    .command("optimize")
    .description("Convert ignored raster sources to optimized WebP assets")
    .option("--source <path>", "Source raster directory", "runtime/assets/sources")
    .option("--output <path>", "Output WebP directory", "docs/assets/generated")
    .option("--manifest <path>", "Manifest JSON path", "docs/assets/generated/asset-manifest.json")
    .option("--quality <number>", "WebP quality", "82")
    .option("--max-width <number>", "Maximum output width", "2400")
    .action(async function action(
      this: Command & {
        opts(): {
          source: string;
          output: string;
          manifest: string;
          quality: string;
          maxWidth: string;
        };
      },
    ) {
      const options = globalOptions(this);
      const local = this.opts() as {
        source: string;
        output: string;
        manifest: string;
        quality: string;
        maxWidth: string;
      };
      const root = options.root ?? process.cwd();
      const manifest = await optimizeAssets({
        sourceDir: pathJoin(root, local.source),
        outputDir: pathJoin(root, local.output),
        manifestPath: pathJoin(root, local.manifest),
        quality: Number.parseInt(local.quality, 10),
        maxWidth: Number.parseInt(local.maxWidth, 10),
        ...(options.dryRun ? { dryRun: true } : {}),
      });
      print(manifest, options.json);
    });

  const github = program.command("github").description("Governed GitHub adapter placeholder");
  github
    .command("prepare")
    .requiredOption("--operation <operation>")
    .option("--payload <json>", "JSON payload", "{}")
    .option("--provider <provider>", "disabled or fake", "disabled")
    .option("--enable-fake", "Enable the local fake provider without external sends")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as {
        operation: string;
        payload: string;
        provider: "disabled" | "fake";
        enableFake?: boolean;
      };
      const payload = JSON.parse(local.payload) as Record<string, unknown>;
      if (local.provider === "fake") {
        const provider = createExternalAdapterProvider({
          adapter: "github",
          provider: "fake",
          enabled: local.enableFake ?? false,
        });
        print(await provider.prepare(local.operation, payload), options.json, options.quiet);
        process.exitCode = provider.enabled ? 0 : 7;
        return;
      }
      print(
        await executeDisabledExternalAdapter({
          adapter: "github",
          operation: local.operation,
          payload,
        }),
        options.json,
        options.quiet,
      );
      process.exitCode = 7;
    });

  const communication = program
    .command("communication-adapter")
    .description("Governed communication adapter placeholder");
  communication
    .command("prepare")
    .requiredOption("--operation <operation>")
    .option("--payload <json>", "JSON payload", "{}")
    .option("--provider <provider>", "disabled or fake", "disabled")
    .option("--enable-fake", "Enable the local fake provider without external sends")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as {
        operation: string;
        payload: string;
        provider: "disabled" | "fake";
        enableFake?: boolean;
      };
      const payload = JSON.parse(local.payload) as Record<string, unknown>;
      if (local.provider === "fake") {
        const provider = createExternalAdapterProvider({
          adapter: "communication",
          provider: "fake",
          enabled: local.enableFake ?? false,
        });
        print(await provider.prepare(local.operation, payload), options.json, options.quiet);
        process.exitCode = provider.enabled ? 0 : 7;
        return;
      }
      print(
        await executeDisabledExternalAdapter({
          adapter: "communication",
          operation: local.operation,
          payload,
        }),
        options.json,
        options.quiet,
      );
      process.exitCode = 7;
    });

  return program;
}

function pathJoin(root: string, relativeOrAbsolute: string): string {
  if (relativeOrAbsolute.startsWith("/")) {
    return relativeOrAbsolute;
  }
  return `${root.replace(/\/$/, "")}/${relativeOrAbsolute}`;
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

function addDomainCommand(program: Command, alias: string): Command {
  const domain = program.command(alias).description(`Shortcut commands for ${alias} entities`);
  domain.command("list").action(async function action(this: Command) {
    const options = globalOptions(this);
    const context = await createStudioContext(options.root);
    const kind = kindFromAlias(alias);
    const { files } = await validateCanonicalFiles(context.paths.root);
    print(
      files
        .filter((file) => file.entity.kind === kind)
        .map((file) => ({
          id: entityId(file.entity),
          title: entityTitle(file.entity),
          status: entityStatus(file.entity),
          path: file.relativePath,
        })),
      options.json,
    );
  });
  domain
    .command("create")
    .requiredOption("--title <title>", "Entity title")
    .option("--summary <summary>", "Entity summary")
    .option("--classification <classification>", "public, internal or confidential", "internal")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as { title: string; summary?: string; classification: string };
      const input = {
        kind: kindFromAlias(alias),
        title: local.title,
        classification: local.classification as Classification,
        ...(local.summary ? { summary: local.summary } : {}),
      };
      await executeCliCommand(options, "entity.create", input);
    });
  return domain;
}
