# PRD 08 Implementation Plan: International Career Pipeline

Status: ready for implementation planning
Current harness estimate: 30%
Primary owner: `packages/core/src/domains/career`

## Objective

Systematically identify, qualify, pursue and learn from international WordPress
job opportunities, including LinkedIn, using evidence-backed applications.

## Current Reality

Exists:

- jobApplication schema;
- application prepare, follow-up and interview commands;
- LinkedIn channel decision;
- portfolio scope decisions;
- communication prepared action infrastructure.

Gaps:

- no role strategy model;
- no job opportunity separate from application;
- no role snapshot preservation;
- no fit analysis;
- no application material/version validation;
- no submission confirmation lifecycle;
- no interview context pack.

## Required Capabilities

- register role source URL, organization, compensation, deadline and contact;
- deduplicate reposted roles;
- analyze role fit against verified evidence;
- prepare application with materials and portfolio links;
- validate claims, URLs, metadata and file versions;
- confirm submission as prepared action;
- record submission receipt;
- schedule follow-up;
- record interview and outcome;
- resolve career next actions.

## Preferred Write Set

- `packages/core/src/domains/career/`
- `packages/cli/src/commands/career.ts`
- `packages/mcp/src/prompts/application.ts`
- `apps/panel/src/views/career/`

## Cross-PRD Dependencies

- PRD 02 owns organization/person identity.
- PRD 05 owns portfolio evidence and public claims.
- PRD 06 may create LinkedIn content, but not application truth.
- PRD 10 builds interview context packs.
- PRD 12 guards confidential application materials.

## Tests

- submitted application preserves exact role snapshot and materials;
- claims resolve to evidence;
- submission fails without confirmation;
- follow-up respects channel and timing policy;
- discovered roles and submitted applications are distinct;
- lessons do not update strategy from tiny samples without decision.

## Acceptance

- LinkedIn is a first-class channel but never auto-sends;
- applications are evidence-backed and reproducible;
- interview prep excludes unrelated confidential data.

