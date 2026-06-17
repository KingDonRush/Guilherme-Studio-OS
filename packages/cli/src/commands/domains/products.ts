import type { Command } from "commander";
import { executeCliCommand, globalOptions } from "../../runtime.js";
import type { DomainCommandMap } from "./base.js";

export function registerProductDomainCommands(domainCommands: DomainCommandMap): void {
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
}
