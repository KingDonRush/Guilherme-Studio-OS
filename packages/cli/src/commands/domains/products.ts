import type { Command } from "commander";
import { executeCliCommand, globalOptions } from "../../runtime.js";
import type { DomainCommandMap } from "./base.js";

export function registerProductDomainCommands(domainCommands: DomainCommandMap): void {
  domainCommands
    .get("product")
    ?.command("prepare-release")
    .argument("<product-id>")
    .requiredOption("--version <version>")
    .option("--changelog <text>")
    .option("--compatibility <text>")
    .option("--migration <text>")
    .option("--public-api-note <text>")
    .option("--test <command...>")
    .option("--asset <id...>")
    .option("--package <path>")
    .option("--roadmap-claim <claim...>")
    .option("--implemented <capability...>")
    .action(async function action(this: Command, productId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        version: string;
        changelog?: string;
        compatibility?: string;
        migration?: string;
        publicApiNote?: string;
        test?: string[];
        asset?: string[];
        package?: string;
        roadmapClaim?: string[];
        implemented?: string[];
      };
      await executeCliCommand(options, "release.prepare", {
        product_id: productId,
        version: local.version,
        ...(local.changelog ? { changelog: local.changelog } : {}),
        ...(local.compatibility ? { compatibility_notes: local.compatibility } : {}),
        ...(local.migration ? { migration_notes: local.migration } : {}),
        ...(local.publicApiNote ? { public_api_notes: local.publicApiNote } : {}),
        ...(local.package ? { package_path: local.package } : {}),
        test_commands: local.test ?? [],
        asset_ids: local.asset ?? [],
        roadmap_claims: local.roadmapClaim ?? [],
        implemented_capabilities: local.implemented ?? [],
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
}
