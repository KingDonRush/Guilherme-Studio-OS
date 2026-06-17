# PRD 02 Implementation Plan: Clients, CRM, and Profiles

Status: ready for implementation planning
Current harness estimate: 25%
Primary owner: `packages/core/src/domains/crm`

## Objective

Make relationship intelligence durable without mixing client profiles with
engagement or implementation state.

## Current Reality

Exists:

- person, organization, prospect, client and communication schemas;
- duplicate review command;
- prospect qualification command;
- generic entity create/list;
- partial communication prepared action.

Gaps:

- no full client profile structure;
- no reversible identity merge workflow;
- no relationship timeline;
- no client health calculation;
- no context pack that excludes unrelated engagement or secret data.

## Required Capabilities

- create and qualify prospect;
- convert prospect/opportunity into client without identity duplication;
- record communication summary;
- merge identity candidates with confirmation and rollback point;
- update client profile sections;
- resolve client health and next actions;
- build client context pack.

## Preferred Write Set

- `packages/core/src/domains/crm/`
- `packages/schemas/src/entities/crm.ts`
- `packages/cli/src/commands/crm.ts`
- `packages/mcp/src/tools/crm.ts`
- `apps/panel/src/views/crm/`
- CRM-specific tests.

## Cross-PRD Dependencies

- PRD 07 uses prospects, opportunities and communication.
- PRD 08 reuses organization/person identity for recruiters and companies.
- PRD 09 uses client identity for contracts and invoices.
- PRD 10 builds CRM context packs.

## Tests

- same person can be recruiter and client stakeholder;
- duplicate candidate is reported before merge;
- disqualified prospect leaves active pipeline;
- client with multiple engagements does not duplicate preferences;
- client context pack excludes secrets and unrelated engagement details.

## Acceptance

- relationship profile is distinct from delivery state;
- health indicators are traceable to explicit facts;
- communication retention policy is visible;
- no outbound duplicate is allowed without explicit override.

