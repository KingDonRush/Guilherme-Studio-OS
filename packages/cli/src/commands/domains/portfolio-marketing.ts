import type { Command } from "commander";
import { executeCliCommand, globalOptions } from "../../runtime.js";
import type { DomainCommandMap } from "./base.js";

export function registerPortfolioMarketingDomainCommands(domainCommands: DomainCommandMap): void {
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
}
