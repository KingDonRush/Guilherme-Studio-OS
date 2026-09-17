# Technical review guide

[Project overview](../../README.md)

## A short review path

1. Inspect `apps/panel/src` for the human interface and `packages/local-api/src` for its local API.
2. Trace `packages/core/src/prepared-actions/service.ts`: payload checksum, expiry,
   state transitions and reconciliation are explicit.
3. Inspect `packages/mcp/src/server.ts` for the agent interface over shared contracts.
4. Read the normative system map in [00-index.md](00-index.md).

## Validation snapshot — 2026-09-17

On source revision `d858d3fefd0676bd51aee8f2072a559885b5baf7`, `npm run verify`
passed: 65 tests in 16 files, TypeScript checking, Biome checking and workspace
builds, including the React panel. Verification used Node 22.21.1 in the review
environment after rebuilding `better-sqlite3`; the repository's declared supported
toolchain remains Node 24.16.0 / npm 11.13.0. This is a dated observation, not a CI badge.

## Boundaries

- Local prototype and independent operational software; no customer scale or income claim.
- External communication/GitHub adapters are fake or disabled. Prepared records do
  not prove that an email, application or external change was sent.
- Public portfolio scenarios are demonstration/design material, not client attribution.
- Native dependency installation, local state and the WordPress runtime require setup.
- Passing automated checks does not establish production security or platform compliance.
- Dependency audit findings need review before exposing a deployment. No public service
  is deployed as part of this portfolio review.

Licensing and ownership remain as recorded in the respective source repositories.
