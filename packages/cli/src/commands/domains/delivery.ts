import type { Command } from "commander";
import { executeCliCommand, globalOptions } from "../../runtime.js";
import type { DomainCommandMap } from "./base.js";

export function registerDeliveryDomainCommands(domainCommands: DomainCommandMap): void {
  domainCommands
    .get("deliverable")
    ?.command("complete")
    .argument("<deliverable-id>")
    .requiredOption("--evidence <id...>")
    .action(async function action(this: Command, deliverableId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { evidence: string[] };
      await executeCliCommand(
        options,
        "deliverable.complete",
        {
          deliverable_id: deliverableId,
          evidence_ids: local.evidence,
        },
        deliverableId,
      );
    });

  domainCommands
    .get("project")
    ?.command("register-repo")
    .argument("<project-id>")
    .requiredOption("--title <title>")
    .requiredOption("--path <path>")
    .option("--branch <branch>")
    .option("--remote-policy <policy>", "allowed, forbidden or no-remote-in-v1", "allowed")
    .action(async function action(this: Command, projectId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        title: string;
        path: string;
        branch?: string;
        remotePolicy: string;
      };
      await executeCliCommand(options, "project.register-repo", {
        project_id: projectId,
        title: local.title,
        repository_path: local.path,
        ...(local.branch ? { branch: local.branch } : {}),
        remote_policy: local.remotePolicy,
      });
    });
}
