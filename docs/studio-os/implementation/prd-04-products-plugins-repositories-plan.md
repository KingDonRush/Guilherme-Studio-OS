# PRD 04 Implementation Plan: Products, Plugins, and Repositories

Status: ready for implementation planning
Current harness estimate: 45%
Primary owner: `packages/core/src/domains/products`

## Objective

Manage owned WordPress products as long-lived technical/commercial assets,
with repository health, releases, demos, evidence, and publication gates.

## Current Reality

Exists:

- product, repository, release and environment schemas;
- product records for the three plugin signals;
- repository health inspection;
- release prepare/publish slice;
- fake GitHub provider boundary.

Gaps:

- no full product thesis/roadmap/offer model;
- repository registry is useful but not complete release readiness;
- no changelog/migration/compatibility release package;
- no demo scenario registry;
- no public API/compatibility note enforcement for plugin changes.

## Required Capabilities

- create/update product thesis;
- register repository with visibility, release model, health commands and
  runtime relation;
- plan and verify release;
- prepare publication payload;
- record published release;
- register demo scenario;
- seed portfolio case from release/demo evidence.

## Preferred Write Set

- `packages/core/src/domains/products/`
- `packages/adapters/src/git*`
- `packages/cli/src/commands/product.ts`
- `packages/cli/src/commands/repo.ts`
- `packages/mcp/src/tools/repository.ts`
- `apps/panel/src/views/products/`

## Cross-PRD Dependencies

- PRD 03 consumes repository health for WordPress projects.
- PRD 05 consumes product/release evidence for cases.
- PRD 06 consumes releases and demos for content.
- PRD 12 owns backup/security for private repos.

## Tests

- every owned plugin has product and repository record;
- root staging of registered child repo is detected;
- release publish fails from dirty or unverified state;
- release claims map to tests/source evidence;
- demo cannot redefine product capability.

## Acceptance

- repository health identifies correct Git root;
- existing histories/remotes remain intact;
- publication is prepared and confirmed, never implicit.

