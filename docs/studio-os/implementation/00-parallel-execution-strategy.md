# Parallel PRD Execution Strategy

Status: planning authority for PRD completion work
Purpose: coordinate parallel agents without turning the Studio OS into a merge
conflict generator.

## Goal

Complete the twelve Studio OS PRDs by capability, evidence, and operational
harness behavior. Parallel work is allowed only after the write surface is
bounded enough that agents are not competing for the same files.

The target is not twelve simultaneous dashboards. The target is twelve PRD
implementation streams that converge through shared contracts, acceptance
fixtures, and a final integration lane.

## Execution Rule

Do not spawn implementation agents directly from the current monolithic source
shape.

First create enough modular seams so agents can work in mostly disjoint write
sets. These original hot files are already reduced by Phase 0:

- `packages/schemas/src/index.ts`: resolved into a thin barrel.
- `packages/core/src/index.ts`: resolved into a thin barrel.
- `packages/core/src/command-runtime.ts`: resolved into a thin runtime.
- `packages/core/src/workflows/fixtures.ts`: resolved into a thin barrel.
- `packages/cli/src/index.ts`: resolved into a thin CLI entrypoint.
- `packages/local-api/src/index.ts`: resolved into a thin local API barrel.
- `packages/mcp/src/index.ts`: resolved into a thin MCP barrel.

The remaining hot file is:

- `apps/panel/src/main.tsx`

Any plan that lets many agents edit those files at once is expected to fail by
merge conflict, behavior drift, or duplicated abstractions.

## Phase 0: Anti-Conflict Foundation

Before PRD agents implement domain behavior, split extension points by
ownership.

Recommended target shape:

```text
packages/schemas/src/entities/
packages/core/src/domains/
packages/core/src/commands/
packages/core/src/workflows/
packages/core/src/harness/
packages/cli/src/commands/
packages/mcp/src/resources/
packages/mcp/src/tools/
packages/local-api/src/routes/
apps/panel/src/views/
apps/panel/src/components/
```

Phase 0 acceptance:

- Existing behavior is preserved.
- `npm run verify` passes.
- `studio validate --json` passes.
- `studio workflow --fixtures --execute --json` passes.
- No PRD behavior is broadened during the extraction unless required to keep
  existing tests green.
- New module boundaries are documented in the affected package index files.

## Branch and Worktree Model

Use `git worktree`, not twelve branches in one checkout.

One worktree per active lane:

```bash
git config rerere.enabled true

git worktree add ../GSO-prd-10-agent-harness -b codex/prd-10-agent-harness HEAD
git worktree add ../GSO-prd-11-interfaces -b codex/prd-11-interfaces HEAD
git worktree add ../GSO-prd-12-recovery -b codex/prd-12-recovery HEAD
```

Rules:

- Use short-lived branches under `codex/prd-XX-*`.
- One branch owns one PRD plan or one Phase 0 extraction.
- No branch edits another PRD plan except to add an explicit cross-PRD gap.
- Each branch ends with a small commit, evidence, and a handoff.
- Integrate in waves, not all at once.
- Enable `rerere` to help repeat conflict resolutions, but always review the
  resolved diff before staging.

## Waves

### Wave 0: Modularization

Owners:

- schemas extraction: done;
- core domain extraction: implemented in `codex/phase-0-core-domains`;
- core command registry and workflow fixture extraction: implemented in
  `codex/phase-0-command-registry`;
- CLI command registration extraction: implemented in `codex/phase-0-cli-commands`;
- MCP resources/tools extraction: implemented in `codex/phase-0-api-mcp`;
- local API route extraction: implemented in `codex/phase-0-api-mcp`;
- panel view extraction.

No PRD agent starts until Wave 0 is green or explicitly waived by decision.

### Wave 1: Harness and System Invariants

PRDs:

- PRD 01 Core and Governance;
- PRD 10 Knowledge, Memory, and Agents;
- PRD 11 CLI, MCP, and Local Panel;
- PRD 12 Data, Security, Backup, and Recovery.

These establish the rules every other agent must obey.

### Wave 2: Economic Operating Domains

PRDs:

- PRD 02 Clients, CRM, and Profiles;
- PRD 07 Prospecting, Sales, and Proposals;
- PRD 08 International Career Pipeline;
- PRD 09 Finance, Contracts, and Obligations.

These depend on identity, communications, prepared actions, and economic next
actions.

### Wave 3: Production and Public Evidence

PRDs:

- PRD 03 Engagements and WordPress Delivery;
- PRD 04 Products, Plugins, and Repositories;
- PRD 05 Portfolio, Cases, and Evidence;
- PRD 06 Marketing, Content, and Campaigns.

These depend on repository health, evidence, assets, public claims, and
publication gates.

## Agent Contract

Every subagent receives:

- exact PRD plan file;
- exact PRD subagent packet under `implementation/subagents/`;
- write set allowed;
- write set prohibited;
- starting branch/worktree path;
- required commands;
- expected evidence record;
- cross-PRD gap reporting format;
- final handoff template.

Subagent must not:

- edit unrelated PRD plans;
- invent real clients, jobs, campaigns, or finance data;
- bypass `executeStudioCommand` for mutations;
- weaken gates to make tests pass;
- execute external sends;
- mark portfolio release allowed without the final decision gate.

## Integration Gate

Each PRD branch can be merged only after:

- branch is rebased or merged onto the latest integration branch;
- `npm run verify` passes, or a narrower command is justified for docs-only
  work;
- `npm run studio -- validate --json` passes;
- relevant PRD workflow fixture passes;
- `npm run studio -- doctor --json` is reviewed;
- changed package surfaces are listed in the handoff;
- cross-PRD gaps are either resolved or registered in
  `01-cross-prd-integration-map.md`.

## Final Acceptance Gate

The combined PRD completion run is not accepted until:

- PRD plans are all implemented or explicitly deferred by decision;
- `studio acceptance --json` has no blockers except accepted intake gaps;
- panel smoke passes on the final path;
- MCP smoke passes through a real stdio client;
- backup and restore rehearsal evidence are recent;
- root and registered nested repositories are clean;
- Agent Harness Loop can start, constrain, observe, record, verify, hand off,
  and close a material run.
