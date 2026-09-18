# Implementation and verification guide

[Product overview](../../README.md) · [Design documentation](00-index.md)

## Follow a studio operation

1. Read `packages/schemas/src/entities/specs` for commercial, delivery, finance,
   product and governance data contracts.
2. Follow `packages/core/src/commands/registry.ts` into domain handlers/services.
   `opportunity.record-discovery`, proposal review/response and
   `opportunity.convert` connect commercial records to client engagements.
3. Inspect `apps/panel/src/views` for the actual CRM, delivery, product, finance,
   agent and control surfaces. CLI/MCP expose additional domain operations;
   not every command has a dedicated panel form.
4. Inspect `packages/core/src/harness/agent-harness.ts` for runs, context packs,
   observations, verification and handoffs. Prepared actions have a separate
   checksum/expiry/confirmation lifecycle.

Canonical YAML/Markdown records are durable state. SQLite is a rebuildable query
projection. Repository and environment records connect delivery to local Git and
WordPress runtimes; they do not merge independent plugin repositories into this one.

## Runtime integrations

`packages/adapters/src/index.ts` implements Git inspection and Docker/WordPress
operations, including WP-CLI, backup and restore checks. The site-kit module applies
a concrete portfolio capsule. The provisioning command currently creates a directory
and manifest, without installing or registering a complete site.

GitHub and communication providers remain fake or disabled. That boundary does not
apply to the implemented local Docker/WordPress operations. Inspect a command before
running it against an existing environment; backup and restore checks execute real
processes and should be exercised in a suitable development runtime.

## Verification scope

`npm run verify` runs TypeScript, 65 tests, Biome and workspace builds. Local
verification uses Node 22.21.1; the declared toolchain is Node 24.16.0/npm 11.13.0.
This is not a tested Node compatibility matrix. Unit/contract checks do not prove
all PRD journeys or a complete live WordPress deployment.

The system assumes a trusted local workspace and loopback access. Existing package,
MCP and API/schema identities remain compatible across the repository rename.
