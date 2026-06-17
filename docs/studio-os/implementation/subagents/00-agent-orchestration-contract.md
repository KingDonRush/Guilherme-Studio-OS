# Agent Orchestration Contract

Status: authoritative packet for subagent execution
Purpose: make each PRD agent useful without letting agents compete for the same
files or redefine shared contracts.

## Global Objective

Move each PRD to `capability_complete` by implementing capability, interface,
verification and evidence behavior. Real data can remain absent as
`intake_required`.

This contract is stricter than "make tests green". An agent must preserve the
Studio OS operating model:

- canonical records remain human-readable and versioned;
- SQLite remains derived and rebuildable;
- external, public and destructive actions use prepare, confirm, execute and
  reconcile;
- no real external provider sends anything in this phase;
- missing real data is surfaced, never invented;
- portfolio release remains blocked until the final acceptance decision.

## Required Input Per Agent

Every PRD agent receives these files:

- `AGENTS.md`
- `docs/studio-os/00-index.md`
- owning PRD under `docs/studio-os/prds/`
- owning plan under `docs/studio-os/implementation/`
- owning matrix under `docs/studio-os/implementation/capability-matrices/`
- `docs/studio-os/implementation/00-parallel-execution-strategy.md`
- `docs/studio-os/implementation/01-cross-prd-integration-map.md`
- this contract

## Branch And Worktree Rule

Use one worktree per implementation lane.

Naming:

```bash
git worktree add ../GSO-prd-10-agent-harness -b codex/prd-10-agent-harness HEAD
```

Rules:

- branch prefix: `codex/prd-XX-*`;
- one branch owns one PRD packet or one Phase 0 extraction packet;
- no agent starts from a dirty worktree unless the dirtiness is its assigned
  input and is explicitly listed;
- every branch ends with a handoff and a small commit-ready diff;
- shared file changes must be listed in the handoff with justification.

## Write Set Tiers

### Green: Owned Files

Files under the agent's assigned domain module after Phase 0 extraction.
Examples:

- `packages/core/src/domains/crm/**`
- `packages/core/src/harness/**`
- `packages/cli/src/commands/career/**`
- `packages/mcp/src/resources/repository-health.ts`
- `apps/panel/src/views/finance/**`

### Yellow: Shared Registries

Shared registries may be edited only to register an owned module. Changes must
be append-only or mechanically ordered.

Examples:

- package `index.ts` exports;
- command registry;
- CLI route registry;
- API route registry;
- MCP resource/tool registry;
- panel navigation registry;
- cross-PRD integration map.

### Red: Global Hot Files

No PRD agent may perform feature implementation directly inside these files
after Phase 0, except for registry wiring:

- `packages/schemas/src/index.ts`
- `packages/core/src/index.ts`
- `packages/mcp/src/index.ts`
- `packages/local-api/src/index.ts`
- `apps/panel/src/main.tsx`

If an agent needs to change behavior there, it must first create a smaller
owned module and wire it through the registry.

Command behavior belongs in `packages/core/src/commands/handlers/**` plus
`packages/core/src/commands/registry.ts`; workflow behavior belongs in
`packages/core/src/workflows/executors/**` plus the executor map.

CLI behavior belongs in `packages/cli/src/commands/**`, with shared command
execution and output behavior in `packages/cli/src/runtime.ts`.

## Standard Agent Prompt

Use this shape when starting a PRD agent:

```text
You are the PRD XX implementation agent for Guilherme Studio OS.

Goal: move PRD XX to capability_complete, not real_data_complete.

Read:
- AGENTS.md
- docs/studio-os/00-index.md
- docs/studio-os/prds/XX-...
- docs/studio-os/implementation/prd-XX-...
- docs/studio-os/implementation/capability-matrices/prd-XX-...
- docs/studio-os/implementation/00-parallel-execution-strategy.md
- docs/studio-os/implementation/01-cross-prd-integration-map.md
- docs/studio-os/implementation/subagents/00-agent-orchestration-contract.md
- docs/studio-os/implementation/subagents/prd-XX-...-agent.md

Do not invent real clients, jobs, applications, campaigns or finance records.
Represent absent real data as intake_required.

Do not send external messages or publish public changes. Use prepared actions
with fake/local providers when needed.

Keep mutations behind executeStudioCommand. Preserve canonical Markdown/YAML as
source of truth and SQLite as derived.

Work only inside the allowed write set unless the handoff packet names a shared
registry. If you need a cross-PRD contract, register a gap instead of creating a
parallel local version.

End with: changed files, verification commands, capability rows closed,
remaining intake_required rows, cross-PRD gaps raised, and merge risks.
```

## Required Handoff

Every agent ends with:

```markdown
# PRD XX Handoff

## Summary

## Changed Files

## Capability Rows Closed

## Intake Required Rows

## Verification

## Evidence Records

## Cross-PRD Gaps

## Shared Registry Changes

## Merge Risks

## Next Step
```

## Merge Gate

Do not merge a PRD branch until:

- branch has a clean `git status` except intentional files;
- relevant tests pass;
- `npm run studio -- validate --json` passes;
- owned capability matrix is updated;
- evidence or proof debt is recorded;
- cross-PRD gaps are added to the integration map;
- shared registry changes are reviewed by the integration owner.
