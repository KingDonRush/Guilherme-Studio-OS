import { createStudioContext, kindFromAlias, PreparedActionService } from "@guilherme-studio/core";
import {
  type Classification,
  entityId,
  entityStatus,
  entityTitle,
} from "@guilherme-studio/schemas";
import { validateCanonicalFiles } from "@guilherme-studio/storage";
import type { Command } from "commander";
import { executeCliCommand, globalOptions, print } from "../runtime.js";
import { registerDomainCommands } from "./domains/index.js";

export function registerEntityCommands(program: Command): void {
  const entity = program.command("entity").description("Manage canonical entities");
  entity
    .command("list")
    .argument("[kind]", "Entity kind or alias")
    .action(async function action(this: Command, kindAlias?: string) {
      const options = globalOptions(this);
      const context = await createStudioContext(options.root);
      const { files } = await validateCanonicalFiles(context.paths.root);
      const kind = kindAlias ? kindFromAlias(kindAlias) : undefined;
      const entities = files
        .filter((file) => !kind || file.entity.kind === kind)
        .map((file) => ({
          id: entityId(file.entity),
          kind: file.entity.kind,
          title: entityTitle(file.entity),
          status: entityStatus(file.entity),
          path: file.relativePath,
        }));
      print(entities, options.json);
    });

  entity
    .command("create")
    .argument("<kind>", "Entity kind or alias")
    .requiredOption("--title <title>", "Entity title")
    .option("--summary <summary>", "Entity summary")
    .option(
      "--classification <classification>",
      "public, internal, confidential or secret",
      "internal",
    )
    .action(async function action(
      this: Command & { opts(): { title: string; summary?: string; classification: string } },
      kindAlias: string,
    ) {
      const options = globalOptions(this);
      const local = this.opts() as { title: string; summary?: string; classification: string };
      const kind = kindFromAlias(kindAlias);
      const input = {
        kind,
        title: local.title,
        classification: local.classification as Classification,
        ...(local.summary ? { summary: local.summary } : {}),
      };
      await executeCliCommand(options, "entity.create", input);
    });

  entity
    .command("transition")
    .argument("<id>", "Canonical entity id")
    .argument("<status>", "Target lifecycle status")
    .action(async function action(this: Command, id: string, status: string) {
      const options = globalOptions(this);
      await executeCliCommand(options, "entity.transition", { status }, id);
    });

  entity
    .command("archive")
    .argument("<id>", "Canonical entity id")
    .action(async function action(this: Command, id: string) {
      const options = globalOptions(this);
      await executeCliCommand(options, "entity.archive", {}, id);
    });

  entity
    .command("relate")
    .argument("<id>", "Source canonical entity id")
    .requiredOption("--type <type>", "Relation type")
    .requiredOption("--target <id>", "Target canonical entity id")
    .option("--note <note>", "Relation note")
    .action(async function action(
      this: Command & { opts(): { type: string; target: string; note?: string } },
      id: string,
    ) {
      const options = globalOptions(this);
      const local = this.opts() as { type: string; target: string; note?: string };
      await executeCliCommand(
        options,
        "entity.relate",
        {
          relation_type: local.type,
          target_id: local.target,
          ...(local.note ? { note: local.note } : {}),
        },
        id,
      );
    });

  registerActionCommands(program);
  registerDomainCommands(program);
}

function registerActionCommands(program: Command): void {
  const action = program.command("action").description("Manage governed prepared actions");
  action
    .command("prepare")
    .argument("<type>", "Action type")
    .requiredOption("--payload <json>", "Exact JSON payload")
    .option("--ttl <seconds>", "Expiration in seconds", "900")
    .action(async function actionCommand(
      this: Command & { opts(): { payload: string; ttl: string } },
      type: string,
    ) {
      const options = globalOptions(this);
      const local = this.opts() as { payload: string; ttl: string };
      const payload = JSON.parse(local.payload) as Record<string, unknown>;
      await executeCliCommand(options, "action.prepare", {
        action_type: type,
        payload,
        ttl_seconds: Number.parseInt(local.ttl, 10),
      });
    });
  action.command("list").action(async function actionCommand(this: Command) {
    const options = globalOptions(this);
    const context = await createStudioContext(options.root);
    print(await new PreparedActionService(context).list(), options.json);
  });
  action
    .command("confirm")
    .argument("<id>", "Prepared action id")
    .requiredOption("--checksum <sha256>", "Exact payload checksum returned by prepare")
    .action(async function actionCommand(
      this: Command & { opts(): { checksum: string } },
      id: string,
    ) {
      const options = globalOptions(this);
      const local = this.opts() as { checksum: string };
      await executeCliCommand(options, "action.confirm", {
        action_id: id,
        payload_checksum: local.checksum,
      });
    });
  action
    .command("reconcile")
    .argument("<id>", "Executed action id")
    .requiredOption("--result <json>", "Observed reconciliation result")
    .action(async function actionCommand(
      this: Command & { opts(): { result: string } },
      id: string,
    ) {
      const options = globalOptions(this);
      const local = this.opts() as { result: string };
      await executeCliCommand(options, "action.reconcile", {
        action_id: id,
        result: JSON.parse(local.result) as Record<string, unknown>,
      });
    });
}
