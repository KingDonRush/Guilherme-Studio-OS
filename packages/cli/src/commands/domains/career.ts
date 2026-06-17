import type { Command } from "commander";
import { executeCliCommand, globalOptions } from "../../runtime.js";
import type { DomainCommandMap } from "./base.js";

export function registerCareerDomainCommands(domainCommands: DomainCommandMap): void {
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
}
