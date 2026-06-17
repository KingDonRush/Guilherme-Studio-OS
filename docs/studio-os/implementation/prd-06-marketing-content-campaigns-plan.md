# PRD 06 Implementation Plan: Marketing, Content, and Campaigns

Status: ready for implementation planning
Current harness estimate: 20%
Primary owner: `packages/core/src/domains/marketing`

## Objective

Turn verified evidence and offers into consistent international distribution
without generic copy reuse, unsupported claims, or unconfirmed publication.

## Current Reality

Exists:

- campaign and contentItem schemas;
- content preparation command with public claims and evidence IDs;
- communication/prepared-action infrastructure.

Gaps:

- no audience/channel strategy records;
- no content brief generator;
- no claim verification command for content;
- no publication lifecycle;
- no performance signal model.

## Required Capabilities

- create campaign with audience, offer, CTA, evidence, schedule and stop date;
- create content brief from product/case/project evidence;
- draft content with channel adaptation;
- verify content claims;
- prepare publication payload;
- confirm and record publication;
- record campaign signal;
- close campaign with observed vs inferred learning.

## Preferred Write Set

- `packages/core/src/domains/marketing/`
- `packages/cli/src/commands/marketing.ts`
- `packages/mcp/src/prompts/content.ts`
- `apps/panel/src/views/marketing/`
- marketing workflow fixtures.

## Cross-PRD Dependencies

- PRD 05 owns claim-to-evidence.
- PRD 04 provides product/release evidence.
- PRD 07 shares outreach confirmation discipline.
- PRD 12 guards public/confidential boundary.

## Tests

- campaign missing audience, CTA, evidence or stop date is blocked;
- public claim requiring fresh verification is flagged;
- publication cannot occur without exact confirmation;
- repurposed content links same evidence instead of copying facts;
- performance report separates observed signal from inferred impact.

## Acceptance

- every campaign has economic objective and stop condition;
- every publication is a prepared action before external send;
- content lessons do not become universal policy without decision.

