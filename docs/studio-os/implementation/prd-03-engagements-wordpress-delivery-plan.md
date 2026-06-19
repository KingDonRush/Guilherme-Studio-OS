# PRD 03 Implementation Plan: Engagements and WordPress Delivery

Status: historical implementation plan; current state is tracked in the matching capability matrix and `studio coverage --json`
Initial harness estimate (historical baseline): 35%
Current capability state as of 2026-06-19: capability_ready=true; real delivery data remains intake_required
Primary owner: `packages/core/src/domains/delivery`

## Objective

Turn accepted demand into controlled WordPress delivery with reproducible
projects, approvals, delivery evidence, backup awareness, and finance
separation.

## Current Reality

Exists:

- engagement, deliverable, project and environment schemas;
- engagement creation from opportunity;
- deliverable completion with evidence;
- project repository registration;
- WordPress adapter helpers for health, backup and restore check.

Gaps:

- no direct engagement initiation from approved demand;
- no deliverable planning workflow;
- no requirement/change-control workflow;
- WordPress bootstrap is adapter-level, not fully tied to project lifecycle;
- delivery package, warranty and acceptance model are not complete.

## Required Capabilities

- create engagement from won opportunity or approved demand;
- add deliverable with owner, acceptance model and project link;
- initialize/register WordPress project;
- record requirement, decision and change request;
- evaluate scope change before acceptance;
- prepare delivery package;
- record acceptance and warranty start;
- block closure when backup, documentation, approval, or finance obligations
  are missing.

## Preferred Write Set

- `packages/core/src/domains/delivery/`
- `packages/adapters/src/wordpress*` or future `packages/adapters/src/wordpress/`
- `packages/cli/src/commands/delivery.ts`
- `packages/cli/src/commands/wordpress.ts`
- `apps/panel/src/views/delivery/`
- delivery and WordPress adapter tests.

## Cross-PRD Dependencies

- PRD 02 provides client context.
- PRD 07 provides accepted opportunity/proposal.
- PRD 09 provides finance closure constraints.
- PRD 04 provides repository health.
- PRD 12 provides backup/restore and security gates.
- PRD 10 requires AgentRun evidence around delivery work.

## Tests

- one engagement supports multiple deliverables/sites;
- project bootstrap records environment assumptions;
- scope change cannot silently mutate accepted scope;
- deliverable completion fails without required evidence;
- engagement closure reports unresolved finance obligations;
- repository health is checked before and after agent work.

## Acceptance

- technical complete, client accepted, and paid remain separate;
- WordPress projects are reproducible from tracked config plus private backup;
- delivery cannot close without handoff, docs, backup and acceptance evidence.
