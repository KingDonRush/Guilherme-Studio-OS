import { createStudioContext, kindFromAlias } from "@guilherme-studio/core";
import {
  type Classification,
  entityId,
  entityStatus,
  entityTitle,
} from "@guilherme-studio/schemas";
import { validateCanonicalFiles } from "@guilherme-studio/storage";
import type { Command } from "commander";
import { executeCliCommand, globalOptions, print } from "../../runtime.js";

const DOMAIN_ALIASES = [
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
];

export type DomainCommandMap = Map<string, Command>;

export function registerBaseDomainCommands(program: Command): DomainCommandMap {
  const domainCommands = new Map<string, Command>();
  for (const alias of DOMAIN_ALIASES) {
    domainCommands.set(alias, addDomainCommand(program, alias));
  }
  return domainCommands;
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
