# PRD 10 Implementation Plan: Knowledge, Memory, and Agents

Status: highest priority harness plan
Current harness estimate: 30%
Primary owner: `packages/core/src/harness`

## Objective

Make the Studio OS operate as an AI harness: an agent starts from durable
context, acts inside authority, records observations/actions/evidence, verifies
work, creates a handoff, and cannot claim closure while required process
remains unresolved.

This PRD is the primary owner of the
[Self-Build Harness Bootstrap](./03-self-build-harness-bootstrap.md). Before
broad PRD implementation resumes, Studio OS must be able to run a material
Studio OS work task through its own agent harness loop.

## Current Reality

Exists:

- task, decision, evidence and agentRun schemas;
- handoff creation as an AgentRun record;
- basic agent run display in panel;
- workflow fixture for new-agent handoff.

Gaps:

- no `startAgentRun`;
- no `buildContextPack`;
- no `authorizeAgentRun`;
- no `recordAgentAction`;
- no `completeVerification`;
- no close gate;
- no run-aware command correlation;
- no canonical context-pack files.

## Required Harness Loop

```text
start -> context -> authorize -> observe -> act -> verify -> evidence -> handoff -> close
```

The context step must include the Praxis-derived method lens from the bootstrap:
lifecycle, business value, requirements, systems boundary, software
architecture/design/construction/testing, governance, quality/risk/security,
delivery/operations, knowledge/documentation and method selection/tailoring.

## Required Commands

- `studio agent start`
- `studio agent context`
- `studio agent authorize`
- `studio agent observe`
- `studio agent record-action`
- `studio agent record-evidence`
- `studio agent verify`
- `studio agent handoff`
- `studio agent close`
- `studio agent status`

## AgentRun State

Recommended states:

- `draft`
- `oriented`
- `authorized`
- `in_progress`
- `verifying`
- `blocked`
- `handoff_ready`
- `closed`

Close requires:

- objective outcome or precise blocker;
- pre/post Git status for target repositories;
- verification record or explicit not-run reason;
- evidence reference or intake/blocker reference;
- handoff with next valid action and what not to rethink.

## Preferred Write Set

- `packages/core/src/harness/`
- `packages/core/src/commands/agent.ts`
- `packages/schemas/src/entities/agent-run.ts`
- `packages/cli/src/commands/agent.ts`
- `packages/mcp/src/resources/runs.ts`
- `packages/mcp/src/tools/agent.ts`
- `apps/panel/src/views/agents/`
- `operations/records/agent-runs/`

## Cross-PRD Dependencies

- All PRDs consume the harness.
- PRD 01 provides command/gate/evidence infrastructure.
- PRD 11 exposes harness through CLI/API/MCP/panel.
- PRD 12 provides classification/redaction and recovery.

## Tests

- material run cannot close without handoff;
- run cannot close with dirty target repo unless explicitly blocked;
- action log records command, actor, target, status and result;
- context pack excludes secrets and unrelated confidential data;
- stale handoff is detected by revision or Git mismatch;
- another agent can continue using only run ID and repository.

## Acceptance

- Studio OS forces agent process instead of relying on agent discipline;
- every material implementation can be reconstructed from run, evidence and
  events;
- repeated failure can be promoted to policy/test/decision.
- one scoped Studio OS work task has been executed using this harness
  as the controlling process, proving the self-build loop works before the next
  PRD wave.
