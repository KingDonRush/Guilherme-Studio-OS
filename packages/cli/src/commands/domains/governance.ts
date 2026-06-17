import { createStudioContext } from "@guilherme-studio/core";
import { entityId, entityRevision, entityTitle } from "@guilherme-studio/schemas";
import type { Command } from "commander";
import { executeCliCommand, globalOptions, print } from "../../runtime.js";
import type { DomainCommandMap } from "./base.js";

export function registerGovernanceDomainCommands(
  program: Command,
  domainCommands: DomainCommandMap,
): void {
  registerAgentHarnessCommands(program);

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

function registerAgentHarnessCommands(program: Command): void {
  const agent = program.command("agent").description("Operate Studio OS agent harness runs");

  agent
    .command("start")
    .requiredOption("--objective <text>")
    .option("--title <title>")
    .option("--task <id>")
    .option("--owning-entity <id...>")
    .option("--repository <id...>")
    .option("--environment <id...>")
    .option(
      "--phase <phase>",
      "discovery, planning, implementation, stabilization, release, migration, recovery",
    )
    .option("--risk <risk>", "low, normal, high or critical")
    .option("--allowed <item...>")
    .option("--confirmation-required <item...>")
    .option("--prohibited <item...>")
    .option("--model <model>")
    .option("--non-material", "Mark the run as non-material")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as {
        objective: string;
        title?: string;
        task?: string;
        owningEntity?: string[];
        repository?: string[];
        environment?: string[];
        phase?: string;
        risk?: string;
        allowed?: string[];
        confirmationRequired?: string[];
        prohibited?: string[];
        model?: string;
        nonMaterial?: boolean;
      };
      await executeCliCommand(options, "agent.start", {
        objective: local.objective,
        ...(local.title ? { title: local.title } : {}),
        ...(local.task ? { task_id: local.task } : {}),
        owning_entity_ids: local.owningEntity ?? [],
        target_repository_ids: local.repository ?? [],
        target_environment_ids: local.environment ?? [],
        ...(local.phase ? { phase: local.phase } : {}),
        ...(local.risk ? { risk: local.risk } : {}),
        allowed: local.allowed ?? [],
        confirmation_required: local.confirmationRequired ?? [],
        prohibited: local.prohibited ?? [],
        ...(local.model ? { model: local.model } : {}),
        material: !local.nonMaterial,
      });
    });

  agent
    .command("context")
    .argument("<run-id>")
    .option("--next-action <text>")
    .option("--forbidden-reopening <text...>")
    .action(async function action(this: Command, runId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { nextAction?: string; forbiddenReopening?: string[] };
      await executeCliCommand(
        options,
        "agent.context",
        {
          run_id: runId,
          ...(local.nextAction ? { next_valid_action: local.nextAction } : {}),
          forbidden_reopenings: local.forbiddenReopening ?? [],
        },
        runId,
      );
    });

  agent
    .command("authorize")
    .argument("<run-id>")
    .option("--allowed <item...>")
    .option("--confirmation-required <item...>")
    .option("--prohibited <item...>")
    .action(async function action(this: Command, runId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        allowed?: string[];
        confirmationRequired?: string[];
        prohibited?: string[];
      };
      await executeCliCommand(
        options,
        "agent.authorize",
        {
          run_id: runId,
          ...(local.allowed ? { allowed: local.allowed } : {}),
          ...(local.confirmationRequired
            ? { confirmation_required: local.confirmationRequired }
            : {}),
          ...(local.prohibited ? { prohibited: local.prohibited } : {}),
        },
        runId,
      );
    });

  agent
    .command("observe")
    .argument("<run-id>")
    .requiredOption("--source <source>", "git, runtime, user, handoff, docs, code or other")
    .requiredOption("--summary <text>")
    .option("--repository <id>")
    .option("--contradiction <text...>")
    .action(async function action(this: Command, runId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        source: string;
        summary: string;
        repository?: string;
        contradiction?: string[];
      };
      await executeCliCommand(
        options,
        "agent.observe",
        {
          run_id: runId,
          source: local.source,
          summary: local.summary,
          ...(local.repository ? { repository_id: local.repository } : {}),
          contradictions: local.contradiction ?? [],
        },
        runId,
      );
    });

  agent
    .command("record-action")
    .argument("<run-id>")
    .requiredOption("--action <text>")
    .option("--status <status>", "planned, executed, blocked or failed")
    .option("--command <command>")
    .option("--target <id>")
    .option("--result <text>")
    .option("--evidence <id...>")
    .action(async function action(this: Command, runId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        action: string;
        status?: string;
        command?: string;
        target?: string;
        result?: string;
        evidence?: string[];
      };
      await executeCliCommand(
        options,
        "agent.record-action",
        {
          run_id: runId,
          action: local.action,
          ...(local.status ? { status: local.status } : {}),
          ...(local.command ? { command: local.command } : {}),
          ...(local.target ? { target_id: local.target } : {}),
          ...(local.result ? { result_summary: local.result } : {}),
          evidence_ids: local.evidence ?? [],
        },
        runId,
      );
    });

  agent
    .command("record-evidence")
    .argument("<run-id>")
    .requiredOption("--evidence <id...>")
    .action(async function action(this: Command, runId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { evidence: string[] };
      await executeCliCommand(
        options,
        "agent.record-evidence",
        { run_id: runId, evidence_ids: local.evidence },
        runId,
      );
    });

  agent
    .command("verify")
    .argument("<run-id>")
    .requiredOption("--status <status>", "passed, failed or not_run")
    .option("--command <command>")
    .option("--result <text>")
    .option("--artifact <path>")
    .option("--not-run-reason <text>")
    .action(async function action(this: Command, runId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        status: string;
        command?: string;
        result?: string;
        artifact?: string;
        notRunReason?: string;
      };
      await executeCliCommand(
        options,
        "agent.verify",
        {
          run_id: runId,
          status: local.status,
          ...(local.command ? { command: local.command } : {}),
          ...(local.result ? { result_summary: local.result } : {}),
          ...(local.artifact ? { artifact_path: local.artifact } : {}),
          ...(local.notRunReason ? { not_run_reason: local.notRunReason } : {}),
        },
        runId,
      );
    });

  agent
    .command("handoff")
    .argument("<run-id>")
    .requiredOption("--summary <text>")
    .requiredOption("--next-action <text>")
    .option("--gap <text...>")
    .option("--forbidden-reopening <text...>")
    .option("--confirmation-required <text...>")
    .option("--evidence <id...>")
    .action(async function action(this: Command, runId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        summary: string;
        nextAction: string;
        gap?: string[];
        forbiddenReopening?: string[];
        confirmationRequired?: string[];
        evidence?: string[];
      };
      await executeCliCommand(
        options,
        "agent.handoff",
        {
          run_id: runId,
          summary: local.summary,
          next_valid_action: local.nextAction,
          gaps: local.gap ?? [],
          forbidden_reopenings: local.forbiddenReopening ?? [],
          confirmation_required: local.confirmationRequired ?? [],
          evidence_ids: local.evidence ?? [],
        },
        runId,
      );
    });

  agent
    .command("close")
    .argument("<run-id>")
    .option("--outcome <text>")
    .action(async function action(this: Command, runId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { outcome?: string };
      await executeCliCommand(
        options,
        "agent.close",
        {
          run_id: runId,
          ...(local.outcome ? { outcome: local.outcome } : {}),
        },
        runId,
      );
    });

  agent
    .command("status")
    .argument("<run-id>")
    .action(async function action(this: Command, runId: string) {
      const options = globalOptions(this);
      const context = await createStudioContext(options.root);
      const file = await context.entities.get(runId);
      if (file?.entity.kind !== "agentRun") {
        print(
          {
            ok: false,
            error: {
              code: "not_found",
              message: `Agent run not found: ${runId}`,
            },
          },
          options.json,
          options.quiet,
        );
        process.exitCode = 2;
        return;
      }
      print(
        {
          id: entityId(file.entity),
          title: entityTitle(file.entity),
          revision: entityRevision(file.entity),
          state: file.entity.spec.state,
          result: file.entity.spec.result,
          objective: file.entity.spec.objective,
          context_pack: file.entity.spec.context_pack
            ? {
                id: file.entity.spec.context_pack.id,
                checksum: file.entity.spec.context_pack.checksum,
                gaps: file.entity.spec.context_pack.gaps,
              }
            : null,
          observations: file.entity.spec.observations.length,
          actions: file.entity.spec.actions.length,
          evidence_ids: file.entity.spec.evidence_ids,
          verification: file.entity.spec.verification ?? null,
          handoff: file.entity.spec.handoff ?? null,
        },
        options.json,
        options.quiet,
      );
    });
}
