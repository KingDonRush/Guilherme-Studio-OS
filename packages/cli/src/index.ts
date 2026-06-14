import {
  backupWordPressDatabase,
  backupWordPressUploads,
  createStudioBackup,
  fixWordPressRootOwnership,
  inspectStudioRepositories,
  restoreCheckWordPressDatabase,
  restoreCheckWordPressUploads,
  wordpressPluginList,
  wordpressStatus,
} from "@guilherme-studio/adapters";
import { optimizeAssets } from "@guilherme-studio/assets";
import {
  createStudioContext,
  DomainCommandService,
  EntityService,
  entityMutationResult,
  kindFromAlias,
  PreparedActionService,
  rebuildProjection,
  validateStudio,
} from "@guilherme-studio/core";
import { serveLocalApi } from "@guilherme-studio/local-api";
import {
  type Classification,
  createEntity,
  entityId,
  entityStatus,
  entityTitle,
  type LifecycleState,
  PreparedActionSchema,
  RelationSchema,
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
}

function print(value: unknown, json = false): void {
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

function globalOptions(command: Command): GlobalOptions {
  return command.optsWithGlobals<GlobalOptions>();
}

export function createProgram(): Command {
  const program = new Command();
  program
    .name("studio")
    .description("Guilherme Studio OS local-first operations CLI")
    .option("--root <path>", "Studio root", process.cwd())
    .option("--json", "Print JSON output")
    .option("--dry-run", "Validate without writing");

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
          prepared_action: z.toJSONSchema(PreparedActionSchema),
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
      const dirty = repositories.filter((repo) => repo.isDirty);
      const unexpectedRemotes = repositories.filter((repo) => repo.remotePolicyViolation);
      const pendingTransactions = await context.entities.pendingTransactions();
      const projection = context.projection.inspect();
      const expectedChecksum = projectionChecksum(files);
      const projectionStale = !projection.exists || projection.checksum !== expectedChecksum;
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
      const draft = createEntity(input);
      if (options.dryRun) {
        print({ dryRun: true, entity: draft }, options.json);
        return;
      }
      const context = await createStudioContext(options.root);
      const service = new EntityService(context);
      const created = await service.create(input);
      print(entityMutationResult("entity.create", created), options.json);
    });

  entity
    .command("transition")
    .argument("<id>", "Canonical entity id")
    .argument("<status>", "Target lifecycle status")
    .action(async function action(this: Command, id: string, status: string) {
      const options = globalOptions(this);
      const context = await createStudioContext(options.root);
      if (options.dryRun) {
        const current = await context.entities.get(id);
        print(
          { dryRun: true, current: current?.entity ?? null, targetStatus: status },
          options.json,
        );
        return;
      }
      const transitioned = await new EntityService(context).transition(
        id,
        status as LifecycleState,
      );
      print(entityMutationResult("entity.transition", transitioned), options.json);
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
      if (options.dryRun) {
        print({ dryRun: true, type, payload }, options.json);
        return;
      }
      const context = await createStudioContext(options.root);
      print(
        await new PreparedActionService(context).prepare({
          actionType: type,
          payload,
          ttlSeconds: Number.parseInt(local.ttl, 10),
        }),
        options.json,
      );
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
      if (options.dryRun) {
        print({ dryRun: true, id, checksum: local.checksum }, options.json);
        return;
      }
      const context = await createStudioContext(options.root);
      print(await new PreparedActionService(context).confirm(id, local.checksum), options.json);
    });

  const domainCommands = new Map<string, Command>();
  for (const alias of [
    "person",
    "organization",
    "prospect",
    "client",
    "opportunity",
    "engagement",
    "project",
    "repository",
    "product",
    "case",
    "evidence",
    "campaign",
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
      const context = await createStudioContext(options.root);
      const result = await new DomainCommandService(context).qualifyProspect(id, {
        rationale: local.rationale,
        score: Number.parseInt(local.score, 10),
        qualified: !local.disqualify,
      });
      print(entityMutationResult("prospect.qualify", result), options.json);
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
      const context = await createStudioContext(options.root);
      print(
        await new DomainCommandService(context).prepareCommunication({
          subjectId: local.subject,
          channel: local.channel,
          message: local.message,
        }),
        options.json,
      );
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
      };
      const context = await createStudioContext(options.root);
      const result = await new DomainCommandService(context).registerEvidence({
        title: local.title,
        evidenceType: local.type,
        ...(local.subject ? { subjectId: local.subject } : {}),
        ...(local.path ? { path: local.path } : {}),
        ...(local.url ? { url: local.url } : {}),
        ...(local.command ? { command: local.command } : {}),
        ...(local.checksum ? { checksum: local.checksum } : {}),
      });
      print(entityMutationResult("evidence.register", result), options.json);
    });

  domainCommands
    .get("engagement")
    ?.command("create-from-opportunity")
    .argument("<opportunity-id>")
    .option("--title <title>")
    .action(async function action(this: Command, opportunityId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { title?: string };
      const context = await createStudioContext(options.root);
      const result = await new DomainCommandService(context).createEngagementFromOpportunity(
        opportunityId,
        local.title,
      );
      print(entityMutationResult("engagement.create-from-opportunity", result), options.json);
    });

  domainCommands
    .get("proposal")
    ?.command("prepare")
    .argument("<opportunity-id>")
    .option("--title <title>")
    .action(async function action(this: Command, opportunityId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { title?: string };
      const context = await createStudioContext(options.root);
      const result = await new DomainCommandService(context).prepareProposal(
        opportunityId,
        local.title,
      );
      print(entityMutationResult("proposal.prepare", result), options.json);
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
      const context = await createStudioContext(options.root);
      const result = await new DomainCommandService(context).prepareApplication({
        title: local.title,
        sourceUrl: local.source,
        ...(local.organization ? { organizationId: local.organization } : {}),
      });
      print(entityMutationResult("application.prepare", result), options.json);
    });

  domainCommands
    .get("product")
    ?.command("prepare-release")
    .argument("<product-id>")
    .requiredOption("--version <version>")
    .action(async function action(this: Command, productId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { version: string };
      const context = await createStudioContext(options.root);
      const result = await new DomainCommandService(context).prepareRelease(
        productId,
        local.version,
      );
      print(entityMutationResult("release.prepare", result), options.json);
    });

  domainCommands
    .get("payment")
    ?.command("reconcile")
    .argument("<payment-id>")
    .requiredOption("--reference <reference>")
    .action(async function action(this: Command, paymentId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { reference: string };
      const context = await createStudioContext(options.root);
      const result = await new DomainCommandService(context).reconcilePayment(paymentId, {
        reference: local.reference,
      });
      print(entityMutationResult("payment.reconcile", result), options.json);
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

  return program;
}

function pathJoin(root: string, relativeOrAbsolute: string): string {
  if (relativeOrAbsolute.startsWith("/")) {
    return relativeOrAbsolute;
  }
  return `${root.replace(/\/$/, "")}/${relativeOrAbsolute}`;
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
      if (options.dryRun) {
        print({ dryRun: true, entity: createEntity(input) }, options.json);
        return;
      }
      const context = await createStudioContext(options.root);
      const service = new EntityService(context);
      const created = await service.create(input);
      print(entityMutationResult("entity.create", created), options.json);
    });
  return domain;
}
