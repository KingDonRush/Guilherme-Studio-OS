# PRD 05 Implementation Plan: Portfolio, Cases, and Evidence

Status: historical implementation plan; current state is tracked in the matching capability matrix and `studio coverage --json`
Initial harness estimate (historical baseline): 30%
Current capability state as of 2026-06-19: capability_ready=true; real portfolio case and asset data remains intake_required
Primary owner: `packages/core/src/domains/portfolio`

## Objective

Convert real technical and delivery evidence into public hiring/sales signals
without inventing clients, metrics, compatibility, or outcomes.

## Current Reality

Exists:

- portfolioCase, evidence and asset schemas;
- case creation from evidence;
- evidence claims field;
- portfolio-scoped decisions;
- generated Mina Forma mockups/assets outside canonical case records.

Gaps:

- no claim-to-evidence map engine;
- no case readiness evaluator;
- no public stale-claim detection;
- no portfolio site health command;
- no asset promotion policy in canonical Studio OS.

## Required Capabilities

- seed case from product, deliverable, repository, release or evidence;
- map each claim to evidence, reliability and allowed copy;
- evaluate readiness before narrative/publication;
- approve visual direction with evidence;
- register case implementation;
- prepare/publish case with exact payload confirmation;
- inspect public evidence health.

## Preferred Write Set

- `packages/core/src/domains/portfolio/`
- `packages/core/src/evidence/claims.ts`
- `packages/assets/src/`
- `packages/cli/src/commands/portfolio.ts`
- `apps/panel/src/views/portfolio/`
- `docs/studio-os/operations/02-quality-gates.md` only for policy updates.

## Cross-PRD Dependencies

- PRD 04 provides product/release/demo evidence.
- PRD 03 provides delivery evidence.
- PRD 06 publishes campaigns from cases.
- PRD 08 uses cases in job applications.
- PRD 12 guards confidential data leakage.

## Tests

- unsupported public claim blocks publication;
- roadmap/opinion/implemented/demo claims remain distinct;
- demo-site identity does not become product or case truth;
- stale case evidence is detected after product release changes;
- WordPress asset promotion records WebP, SEO metadata, manifest and checksum.

## Acceptance

- every public claim resolves to evidence;
- portfolio home curation does not mutate canonical project truth;
- publication payload includes URL, metadata, assets, claims and confirmation.
