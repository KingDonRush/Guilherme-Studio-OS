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

## Collaborative Agent Posture

- Treat Guilherme's feedback as raw intent, not as a literal command queue.
  Extract the symptom, desired feeling, invariant to preserve, and likely
  underlying cause before editing, generating, or implementing.
- Guilherme has final approval, but the agent owns professional diagnosis. Do
  not make Guilherme the only design director by blindly executing each
  sentence. When the literal request would harm hierarchy, UX, brand coherence,
  Elementor feasibility, or an approved direction, say so and propose the
  smallest better correction.
- Approved images and decisions are invariants, not a reason to stop thinking.
  Preserve what was approved while still naming tensions, tradeoffs, and
  stronger implementation paths.
- If feedback repeats across iterations or the work starts to feel reactive,
  stop producing variants and switch to diagnosis mode. State: observed
  symptom, deeper hypothesis, protected invariants, rejected literal
  interpretations, and recommended next move.
- For image-first route mockups, follow
  `docs/studio-os/workflows/04-image-first-mockup-production.md`. Give each run
  an explicit state, hypothesis, parent and authority set. A second correction
  to the same region triggers diagnosis reset; do not answer with an automatic
  `vN+1`.
- Store mockup process inside `assets/mockups/routes/<route>/` with contract,
  runs, approved and handoff states. Do not leave numbered experiments loose in
  a flat mockup folder.
- In visual work, define budgets and ownership for treatments instead of
  applying a style everywhere. Examples: shadow budget, border contract,
  texture budget, image density, CTA emphasis, menu/footer editability.
- Prefer intimate collaboration over obedience: reflect the design logic back
  to Guilherme, challenge weak assumptions respectfully, and keep the shared
  goal ahead of moment-by-moment order following.

## WordPress Containment

- Treat `wordpress/` as runtime during Studio OS migration.
- Do not chase unrelated WordPress files.
- Plugin repositories keep their own Git history.
- Root Git must not absorb nested WordPress/plugin repositories.
- Product repos should be registered under `products/<slug>/repository/` and
  attached to WordPress by documented mounts or links, not copied ad hoc.

## Elementor / Asset Boundary

- Guilherme owns manual Elementor page implementation unless he explicitly
  delegates implementation.
- Every visual, layout and content decision for WordPress/Elementor pages must
  be judged through Guilherme's implementation side before generation or
  approval. Identify whether each visible element maps to a native Elementor
  widget, WordPress menu, media asset, CSS/container treatment, custom code, or
  generated raster asset. If the mapping would force fragile manual work,
  simplify the visual direction before prompting, editing or approving.
- Approved images and approved visual directions are locked contracts. Do not
  change, replace, reinterpret, regenerate, restyle or pivot any approved image,
  section, asset, menu, footer, page structure or visual direction unless
  Guilherme explicitly asks for that exact thing to be changed.
- Do not rewrite Elementor page data, headers, menus or visual page structure
  when the request is about image generation, asset direction or WordPress media
  administration.
- When Guilherme asks for visual assets, generated images or generated icon
  packs, treat that as raster asset work first. Use image generation workflows
  and only produce code/SVG when he explicitly asks for code/SVG or when the
  requested asset already belongs to an existing vector/icon system.
- In Guilherme's image-first Elementor workflow, `assetizar` means all visual
  assets that Elementor/WordPress do not already provide as finished content:
  generated images, generated icons, generated shapes/forms, decorative marks,
  textures, material fields and similar raster visuals.
- Never satisfy assetization by cropping a single full-page mockup or by
  generating one composite sheet containing many unrelated assets, unless
  Guilherme explicitly asks for extraction or a contact sheet. Generate one
  image per asset with imagegen, then use code only for post-processing,
  optimization, alpha cleanup, validation and registration.
- Transparent generated assets, including generated icon packs, must follow the
  imagegen chroma-key path: generate on a flat chroma background, remove chroma
  locally, validate alpha, and save PNG/WebP review assets before any promotion.
- Generated icons, generated shapes and decorative visual forms must not be
  replaced by hand-coded SVG/CSS during an active visual asset request.
- If a local inventory says to prefer Elementor, Font Awesome, Lucide, SVG or
  CSS, interpret that as an implementation heuristic. It does not override an
  active request to generate visual assets.
- For delicate text/layout areas such as headers, menus, footers, cards,
  service lists, CTAs and metadata rows, define the exact text and intended
  Elementor construction before image generation. Use WordPress `Nav Menu` only
  for real navigation; use Heading/Text Editor for static labels and copy; use
  Icon List without icons only for repeated static lines where that is the most
  practical Elementor control; use Buttons for actions; use containers/grid for
  layout. Do not let image generation invent menu items, legal links, contact
  rows or footer columns.
- When presenting a mockup decision or correction, include the implementation
  implication when it affects Guilherme's build: which widget/control should be
  used, what remains editable in Elementor, what becomes a raster asset, and
  what must be avoided because it would create fragile manual work.
- For generated home/landing-page mockups, use a viewport-and-proportion
  contract before image generation. The contract must name the target viewport,
  header height, hero height ceiling, required first-viewport information,
  hero-image aspect ratio/maximum height, and where the next section begins.
  When proportion or fold behavior is fragile, include a pixel box map for the
  conceptual canvas, header, hero, text column, image slot, CTA/icon row, and
  next-section start.
  Generate the complete page by default, but reject internally if the hero
  becomes a tall poster, requires excessive padding, overflows the intended
  viewport, or hides important information below the fold.

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
