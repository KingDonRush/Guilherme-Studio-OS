# PRD 07 Implementation Plan: Prospecting, Sales, and Proposals

Status: historical implementation plan; current state is tracked in the matching capability matrix and `studio coverage --json`
Initial harness estimate (historical baseline): 35%
Current capability state as of 2026-06-19: capability_ready=true; real sales data remains intake_required
Primary owner: `packages/core/src/domains/sales`

## Objective

Create qualified commercial conversations and convert suitable WordPress needs
into clear, traceable, profitable engagements.

## Current Reality

Exists:

- prospect, opportunity and proposal schemas;
- duplicate review;
- prospect qualification;
- proposal preparation;
- communication prepared actions;
- opportunity conversion into client/engagement.

Gaps:

- no ideal-client/offer-fit model;
- no prospect research freshness/confidence;
- no duplicate outreach prevention beyond general duplicate review;
- no immutable sent proposal version;
- no negotiation/change impact workflow;
- no lost-opportunity learning.

## Required Capabilities

- define ideal client and offer fit;
- research prospect with evidence and reason to contact;
- prepare outreach with exact copy, CTA and evidence;
- record outreach result;
- create opportunity and discovery facts;
- prepare versioned proposal;
- record proposal response;
- negotiate scope/price/risk changes;
- convert opportunity transactionally;
- close lost/won with reason.

## Preferred Write Set

- `packages/core/src/domains/sales/`
- `packages/cli/src/commands/sales.ts`
- `packages/mcp/src/prompts/opportunity.ts`
- `apps/panel/src/views/sales/`

## Cross-PRD Dependencies

- PRD 02 owns identity and client profile.
- PRD 03 owns engagement creation after conversion.
- PRD 09 owns payment terms and finance.
- PRD 05 owns public evidence for claims.
- PRD 11 exposes exact payload confirmation.

## Tests

- outbound action fails without reason to contact;
- duplicated active outreach is blocked;
- opportunity always has owner and next action;
- sent proposal is immutable;
- conversion creates linked client/engagement without identity duplication;
- lost reason remains out of active views.

## Acceptance

- sales flow is evidence-backed and non-spammy;
- proposal versions are preserved exactly;
- conversion is transactional and auditable.
