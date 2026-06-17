import {
  backupWordPressDatabase,
  backupWordPressUploads,
  createStudioBackup,
  fixWordPressRootOwnership,
  inspectStudioRepositories,
  prepareExternalAdapterAction,
  provisionWordPressSiteFromTemplate,
  reconcileFakeExternalAdapterAction,
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
import { createStudioContext } from "@guilherme-studio/core";
import { serveLocalApi } from "@guilherme-studio/local-api";
import type { Command } from "commander";
import { globalOptions, pathJoin, print } from "../runtime.js";

export function registerOperationCommands(program: Command): void {
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

  registerWordPressCommands(program);
  registerAssetCommands(program);
  registerExternalAdapterCommands(program);
}

function registerWordPressCommands(program: Command): void {
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
    .command("provision")
    .requiredOption("--site-path <path>", "Site path, relative to Studio root or absolute")
    .option("--template-path <path>", "Template path, relative to Studio root", "wordpress")
    .description("Provision or register a WordPress site from a local template")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as { sitePath: string; templatePath: string };
      const context = await createStudioContext(options.root);
      print(
        await provisionWordPressSiteFromTemplate(context, {
          sitePath: local.sitePath,
          templatePath: local.templatePath,
          dryRun: options.dryRun ?? false,
        }),
        options.json,
      );
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
}

function registerAssetCommands(program: Command): void {
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
}

function registerExternalAdapterCommands(program: Command): void {
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
      const context = await createStudioContext(options.root);
      const result = await prepareExternalAdapterAction(context, {
        adapter: "github",
        operation: local.operation,
        payload,
        provider: local.provider,
        enabled: local.provider === "fake" ? (local.enableFake ?? false) : false,
      });
      print(result, options.json, options.quiet);
      process.exitCode = result.status === "blocked" ? 7 : 0;
    });
  github
    .command("fake-reconcile")
    .argument("<action-id>", "Confirmed prepared action id")
    .description("Execute and reconcile a fake/local GitHub prepared action without external sends")
    .action(async function action(this: Command, actionId: string) {
      const options = globalOptions(this);
      const context = await createStudioContext(options.root);
      print(await reconcileFakeExternalAdapterAction(context, actionId), options.json);
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
      const context = await createStudioContext(options.root);
      const result = await prepareExternalAdapterAction(context, {
        adapter: "communication",
        operation: local.operation,
        payload,
        provider: local.provider,
        enabled: local.provider === "fake" ? (local.enableFake ?? false) : false,
      });
      print(result, options.json, options.quiet);
      process.exitCode = result.status === "blocked" ? 7 : 0;
    });
  program
    .command("communication-adapter-reconcile")
    .argument("<action-id>", "Confirmed prepared action id")
    .description("Execute and reconcile a fake/local communication prepared action without sends")
    .action(async function action(this: Command, actionId: string) {
      const options = globalOptions(this);
      const context = await createStudioContext(options.root);
      print(await reconcileFakeExternalAdapterAction(context, actionId), options.json);
    });
}
