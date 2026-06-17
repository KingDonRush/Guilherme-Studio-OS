import type { Command } from "commander";
import { executeCliCommand, globalOptions } from "../../runtime.js";
import type { DomainCommandMap } from "./base.js";

export function registerGovernanceDomainCommands(domainCommands: DomainCommandMap): void {
  domainCommands
    .get("decision")
    ?.command("record")
    .requiredOption("--title <title>")
    .requiredOption("--decision <text>")
    .option("--rationale <text>")
    .option("--evidence <id...>")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as {
        title: string;
        decision: string;
        rationale?: string;
        evidence?: string[];
      };
      await executeCliCommand(options, "decision.record", {
        title: local.title,
        decision: local.decision,
        ...(local.rationale ? { rationale: local.rationale } : {}),
        evidence_ids: local.evidence ?? [],
      });
    });

  domainCommands
    .get("agentRun")
    ?.command("handoff")
    .requiredOption("--task <id>")
    .requiredOption("--title <title>")
    .requiredOption("--objective <text>")
    .requiredOption("--summary <text>")
    .option("--repository <id...>")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as {
        task: string;
        title: string;
        objective: string;
        summary: string;
        repository?: string[];
      };
      await executeCliCommand(options, "handoff.create", {
        task_id: local.task,
        title: local.title,
        objective: local.objective,
        summary: local.summary,
        repository_ids: local.repository ?? [],
      });
    });
}
