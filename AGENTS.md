# Agent Operating Guide

## Mission

Operate the Guilherme Studio OS: a local-first production system for turning
WordPress development into international income through portfolio evidence,
client delivery, products, marketing, sales, job applications, documentation and
agent-assisted execution.

The portfolio still matters, but it is now one domain inside the Studio OS.
Do not resume portfolio implementation until the current Studio OS V1 acceptance
work is complete.

## Repository Map

- `AGENTS.md`: root operating guide.
- `docs/studio-os/`: human-readable constitution, PRDs, architecture,
  workflows, schemas, decisions, migration notes and legacy brain material.
- `packages/`: Studio OS TypeScript workspaces for schemas, storage, core, CLI,
  MCP, API, adapters, assets and testing.
- `apps/panel/`: local human dashboard served by the Studio local API.
- `data/`: canonical cross-domain records such as people, repositories and
  environments.
- `operations/`: tasks, evidence, agent runs, operational records, tools and
  local execution material that is not a product build.
- `products/`: own products and plugins. Product repository working trees live
  under `products/<slug>/repository/` and keep their own Git history.
- `portfolio/`: portfolio projects, cases and portfolio-owned assets.
- `clients/`, `sales/`, `marketing/`, `career/`: domain roots created as records
  appear.
- `wordpress/`: current local WordPress runtime for inspection and tests during
  migration. It is ignored by the root repo and must become its own independent
  repository when the migration reaches that step.
- `runtime/`: ignored local state, SQLite projection, backups, locks, logs and
  source raster assets.

Nothing source-like should live accidentally in the repository root. Add a root
file only when it is a workspace config, operating guide, lockfile or required
entrypoint.

## Non-Negotiables

1. Use Git before, during and after work.
2. Start with `git status --short --branch` before editing.
3. Preserve user changes. Do not revert unrelated work.
4. Never edit WordPress core directly.
5. Keep canonical human data in Markdown/YAML. SQLite is derived and
   rebuildable.
6. Keep secrets out of Git. Never ask Guilherme to paste secrets into chat; use
   local secret collection when needed.
7. Keep source raster assets out of Git. Approved production visuals should be
   optimized WebP or legitimate SVG with manifest evidence.
8. Use `studio validate`, `studio sync --rebuild`, tests, lint, typecheck and
   Gitleaks when the change touches Studio OS behavior or data.
9. External/public/destructive actions follow `prepare -> confirm -> execute ->
   reconcile`.
10. Commits must be scoped, evidence-backed and understandable in English with
    PT-BR context when useful.

## Default Agent Loop

1. Read this file.
2. Check Git status.
3. Load the smallest relevant docs from `docs/studio-os/`.
4. Identify the ownership layer:
   - Studio OS source: `packages/` or `apps/panel/`
   - canonical data: `data/`, `operations/`, `products/`, `portfolio/`,
     `clients/`, `sales/`, `marketing/`, `career/`
   - human documentation: `docs/studio-os/`
   - local runtime: `runtime/` or `wordpress/`
5. Make a focused change.
6. Run the smallest useful verification.
7. Update records, evidence or decisions when the decision matters later.
8. End with Git status and explicit next steps.

## WordPress Containment

- Treat `wordpress/` as runtime during Studio OS migration.
- Do not chase unrelated WordPress files.
- Plugin repositories keep their own Git history.
- Root Git must not absorb nested WordPress/plugin repositories.
- Product repos should be registered under `products/<slug>/repository/` and
  attached to WordPress by documented mounts or links, not copied ad hoc.

## Current Product Signals

1. `simple-budget-plugin`
   - Signal: Elementor-friendly quote flow with native widgets and editable cart
     template.

2. `3d-viewer-to-elementor`
   - Signal: complex frontend/3D integration inside WordPress and Elementor.

3. `elementor-implementation-toolkit`
   - Signal: implementation tooling, filters and future custom content
     structures for Elementor delivery.

## Operating Bias

The goal is not to create bureaucracy. The goal is to reduce rebriefing, protect
state, create evidence and make the next profitable action obvious.
