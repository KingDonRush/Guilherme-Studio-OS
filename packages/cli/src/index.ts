import { createStudioBackup, inspectStudioRepositories } from "@guilherme-studio/adapters";
import { optimizeAssets } from "@guilherme-studio/assets";
import {
  createStudioContext,
  EntityService,
  kindFromAlias,
  rebuildProjection,
  validateStudio,
} from "@guilherme-studio/core";
import { serveLocalApi } from "@guilherme-studio/local-api";
import { createEntity, type StudioEntity } from "@guilherme-studio/schemas";
import { validateCanonicalFiles } from "@guilherme-studio/storage";
import { Command } from "commander";

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
    .action(async function action(this: Command & { opts(): { rebuild?: boolean } }) {
      const options = globalOptions(this);
      const local = this.opts() as { rebuild?: boolean };
      if (!local.rebuild) {
        throw new Error("Nothing to sync. Use --rebuild.");
      }
      if (options.dryRun) {
        const validation = await validateStudio(options.root);
        print({ dryRun: true, validation }, options.json);
        return;
      }
      const result = await rebuildProjection(options.root);
      print(result, options.json);
    });

  program
    .command("doctor")
    .description("Run a conservative health check")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const context = await createStudioContext(options.root);
      const validation = await validateStudio(options.root);
      const repositories = await inspectStudioRepositories(context);
      const dirty = repositories.filter((repo) => repo.isDirty);
      print(
        {
          ok: validation.ok,
          validation,
          dirtyRepositories: dirty,
          warnings:
            dirty.length > 0
              ? ["There are dirty repositories; inspect before destructive work."]
              : [],
        },
        options.json,
      );
      process.exitCode = validation.ok ? 0 : 2;
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
          id: file.entity.id,
          kind: file.entity.kind,
          title: file.entity.title,
          status: file.entity.status,
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
        classification: local.classification as StudioEntity["classification"],
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
      print(created, options.json);
    });

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
    "application",
    "task",
    "decision",
    "communication",
    "agentRun",
  ]) {
    addDomainCommand(program, alias);
  }

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

function addDomainCommand(program: Command, alias: string): void {
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
          id: file.entity.id,
          title: file.entity.title,
          status: file.entity.status,
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
        classification: local.classification as StudioEntity["classification"],
        ...(local.summary ? { summary: local.summary } : {}),
      };
      if (options.dryRun) {
        print({ dryRun: true, entity: createEntity(input) }, options.json);
        return;
      }
      const context = await createStudioContext(options.root);
      const service = new EntityService(context);
      print(await service.create(input), options.json);
    });
}
