# PRD 10 Agent Packet: Knowledge, Memory And Agents

Wave: 1
Branch: `codex/prd-10-agent-harness`

## Objective

Move PRD 10 to `capability_complete` for the Agent Harness Loop: start run,
build context pack, authorize run, record observations/actions, verify work,
handoff and close.

## Read First

- `docs/studio-os/prds/10-knowledge-memory-agents.md`
- `docs/studio-os/workflows/03-agent-execution-handoff.md`
- `docs/studio-os/implementation/prd-10-knowledge-memory-agents-plan.md`
- `docs/studio-os/implementation/capability-matrices/prd-10-knowledge-memory-agents-matrix.md`

## Allowed Write Set

- `packages/schemas/src/entities/specs/governance.ts` agentRun and handoff fields
- `packages/schemas/src/entities/specs/shared.ts` context/evidence references only
- `packages/core/src/harness/**`
- `packages/core/src/domains/agents.ts`
- `packages/core/src/commands/handlers/governance.ts` handoff command slice until agent handlers are split
- `packages/core/src/commands/registry.ts` registration entries only
- `packages/cli/src/commands/domains/governance.ts` handoff/run command slice until agent CLI is split
- `apps/panel/src/views/agents.tsx`
- `operations/agent-runs/**` fixtures and canonical examples

## Shared Contracts Owned

- AgentRun state machine;
- ContextPack schema and redaction budget;
- run authorization and action recording;
- mandatory handoff close gate;
- intake gap reporting model consumed by all PRDs.

## Must Not Do

- Do not make agents autonomous external actors.
- Do not require MCP as the only way to use the harness.
- Do not store secrets in context packs.

## Verification

- agent harness lifecycle tests;
- context pack redaction tests;
- CLI flow can start, observe, verify, hand off and close a run;
- MCP/panel can read the same run state after PRD 11 integration.
