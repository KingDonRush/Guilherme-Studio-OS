import type { DomainCommandService } from "@guilherme-studio/core";
import type { Command } from "commander";
import { executeCliCommand, globalOptions } from "../../runtime.js";
import type { DomainCommandMap } from "./base.js";

export function registerCrmDomainCommands(
  program: Command,
  domainCommands: DomainCommandMap,
): void {
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
}
