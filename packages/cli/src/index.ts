import { Command } from "commander";
import { registerCoreCommands } from "./commands/core.js";
import { registerEntityCommands } from "./commands/entities.js";
import { registerOperationCommands } from "./commands/operations.js";

export { exitCodeForEnvelope } from "./runtime.js";

export function createProgram(): Command {
  const program = new Command();
  program
    .name("studio")
    .description("Guilherme Studio OS local-first operations CLI")
    .option("--root <path>", "Studio root", process.cwd())
    .option("--json", "Print JSON output")
    .option("--quiet", "Suppress human output")
    .option("--verbose", "Include diagnostic detail")
    .option("--dry-run", "Validate without writing")
    .option("--actor <id>", "Actor identity")
    .option("--idempotency-key <value>", "Retry-safe mutation key")
    .option("--expected-revision <number>", "Required entity revision")
    .option("--yes", "Acknowledge ordinary local prompts");

  registerCoreCommands(program);
  registerEntityCommands(program);
  registerOperationCommands(program);

  return program;
}
