# PRD 05 Agent Packet: Portfolio, Cases And Evidence

Wave: 3
Branch: `codex/prd-05-portfolio-evidence`

## Objective

Move PRD 05 to `capability_complete` for case records, portfolio freeze,
public claims, claim-to-evidence validation, asset manifest policy and release
gate.

## Read First

- `docs/studio-os/prds/05-portfolio-cases-evidence.md`
- `docs/studio-os/implementation/prd-05-portfolio-cases-evidence-plan.md`
- `docs/studio-os/implementation/capability-matrices/prd-05-portfolio-cases-evidence-matrix.md`

## Allowed Write Set

- `packages/schemas/src/entities/portfolio/**`
- `packages/core/src/evidence/**`
- `packages/core/src/domains/portfolio/**`
- `packages/core/src/commands/handlers/portfolio/**`
- `packages/assets/src/**`
- `packages/cli/src/commands/portfolio/**`
- `apps/panel/src/views/portfolio/**`

## Shared Contracts Owned

- claim type enum;
- public claim evidence policy;
- asset promotion manifest for WebP, SEO metadata, dimensions, quality and
  checksum.

## Shared Contracts Consumed

- PRD 04 product/release evidence;
- PRD 06 publication prepared actions;
- PRD 08 career claim reuse;
- PRD 12 public data guard.

## Must Not Do

- Do not unfreeze the portfolio.
- Do not create fake case studies or fake clients.
- Do not promote source raster assets into Git.

## Verification

- claim-to-evidence tests;
- asset manifest tests;
- portfolio release gate remains blocked until final acceptance decision.

