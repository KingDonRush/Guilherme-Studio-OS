# PRD 02 Agent Packet: Clients, CRM And Profiles

Wave: 2
Branch: `codex/prd-02-crm`

## Objective

Move PRD 02 to `capability_complete` for person, organization, prospect,
client, duplicate review and communication record behavior.

## Read First

- `docs/studio-os/prds/02-clients-crm-profiles.md`
- `docs/studio-os/implementation/prd-02-clients-crm-profiles-plan.md`
- `docs/studio-os/implementation/capability-matrices/prd-02-clients-crm-profiles-matrix.md`

## Allowed Write Set

- `packages/schemas/src/entities/specs/crm.ts`
- `packages/core/src/domains/crm.ts`
- `packages/core/src/commands/handlers/crm.ts`
- `packages/core/src/commands/registry.ts` registration entries only
- `packages/cli/src/commands/domains/crm.ts`
- `apps/panel/src/views/crm.tsx`
- `docs/studio-os/implementation/capability-matrices/prd-02-*.md`

## Shared Contracts Consumed

- PRD 01 gate catalog;
- PRD 10 intake gap model;
- PRD 11 interface registration;
- PRD 12 classification and secret rejection.

## Shared Contracts Owned

- identity reuse and duplicate review;
- communication record base shape consumed by sales, career, marketing and
  finance.

## Must Not Do

- Do not send emails, LinkedIn messages or any external communication.
- Do not invent contacts or clients.

## Verification

- duplicate detection unit tests;
- prospect-to-client workflow fixture segment;
- CLI/API/MCP equivalent mutation for duplicate review or communication record;
- intake report shows absent clients as `intake_required`.
