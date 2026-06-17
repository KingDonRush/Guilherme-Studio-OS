import type { Command } from "commander";
import { executeCliCommand, globalOptions } from "../../runtime.js";
import type { DomainCommandMap } from "./base.js";

export function registerSalesDomainCommands(domainCommands: DomainCommandMap): void {
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
}
