# PRD 08 Agent Packet: International Career Pipeline

Wave: 2
Branch: `codex/prd-08-career-linkedin`

## Objective

Move PRD 08 to `capability_complete` for international roles, LinkedIn/job
sources, applications, follow-ups, interviews, offer signals and evidence-backed
career claims.

## Read First

- `docs/studio-os/prds/08-international-career.md`
- `docs/studio-os/implementation/prd-08-international-career-plan.md`
- `docs/studio-os/implementation/capability-matrices/prd-08-international-career-matrix.md`

## Allowed Write Set

- `packages/schemas/src/entities/career/**`
- `packages/core/src/domains/career/**`
- `packages/core/src/commands/handlers/career/**`
- `packages/cli/src/commands/career/**`
- `apps/panel/src/views/career/**`

## Shared Contracts Consumed

- PRD 02 organization identity;
- PRD 05 portfolio evidence and claim map;
- PRD 07 outreach discipline;
- PRD 01 economic next actions;
- PRD 12 public/confidential data classification.

## Must Not Do

- Do not apply to jobs or send LinkedIn messages.
- Do not fabricate applications, roles or company data.
- Do not store credentials or session cookies.

## Verification

- LinkedIn/job application fixture uses prepared actions only;
- follow-up appears in economic next actions;
- absent real applications appear as `intake_required`.

