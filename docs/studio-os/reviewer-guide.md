# Architecture and verification guide

[Project overview](../../README.md)

Start with `apps/panel/src` and `packages/local-api/src` to trace a human operation.
Then inspect `packages/core/src/prepared-actions/service.ts` for checksum validation,
expiry, transitions and reconciliation. The MCP server in `packages/mcp/src/server.ts`
exposes the same domain rather than maintaining a separate workflow implementation.
The [system map](00-index.md) links the detailed contracts.

Canonical YAML/Markdown records are the durable state. SQLite supports local
queries and can be rebuilt. Product repositories under the documented WordPress
topology retain independent histories, dependencies and verification gates.

`npm run verify` passes TypeScript checking, 65 tests in 16 files, Biome and
workspace builds. The 2026-09-18 verification used Node 22.21.1; the declared
project toolchain remains Node 24.16.0/npm 11.13.0. That difference is not evidence
of a tested Node compatibility matrix.

External adapters are fake or disabled. Prepared records prove a local state
transition, not a completed external communication. Local workspace trust and
native SQLite installation are current deployment assumptions; this repository
does not implement multi-tenant authorization.
