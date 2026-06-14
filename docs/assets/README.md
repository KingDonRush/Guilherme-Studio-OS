# Portfolio Asset Registry

This folder is the source of truth for visual assets used to build, present, and
distribute Guilherme's portfolio work.

It stores design references, generated sources, approved production assets,
WordPress-ready exports, GitHub presentation media, social/Open Graph assets,
and reusable shared pieces.

## Structure

- `asset-taxonomy.md`
  - Defines the asset taxonomy, channel tags, lifecycle states, and generation
    decision rules.
- `asset-manifest.json`
  - Central registry for approved, active, or implementation-bound assets.
  - It is not required to list every exploratory draft.
- `shared/`
  - Cross-project identity, icons, textures, backgrounds, and reusable visual
    language.
- `portfolio/`
  - Assets for Guilherme's portfolio pages and case-study surfaces.
- `simple-budget-demo/`, `implementation-toolkit/`, etc.
  - Project-specific working packs.
- `distribution/`
  - Channel-specific presentation assets, especially GitHub README media,
    Open Graph images, social crops, banners, and release visuals.
- `sources/`
  - Raw generated images, chroma-key sources, screenshots, captures, and other
    editable or archival input material.

## Operating Rule

Do not treat generated images as disposable once they guide implementation.

When an asset becomes practical work, save the source, define its role, tag it
with taxonomy and channel metadata, then promote a production export only after
approval.

Codex should use `.ai/operational/asset-registry-protocol.md` before creating,
promoting, importing, or distributing assets.

## Root Hygiene

No images, screenshots, generated exports, ZIPs, or visual references should live
in the repository root.

Use:

- `sources/imagegen/` for raw imagegen outputs copied into the project;
- `sources/screenshots/` for browser captures, QA screenshots, and visual
  comparisons;
- project folders such as `portfolio/` or `simple-budget-demo/` for scoped
  candidates and approved assets;
- `distribution/` for handoff packages and public channel crops.

If a file is discovered in the root, move it first, then decide whether it is a
source, candidate, production asset, imported asset, superseded artifact, or
disposable temporary file.

## Icon Rule

Do not create new icons as code.

Approved icon sources are:

- icons already available in WordPress, Elementor, the active theme, or an
  approved local package;
- icons generated through imagegen and then processed as project assets.

Forbidden icon sources are handwritten SVG, CSS icons, canvas-drawn symbols,
HTML/emoji artwork, improvised geometric code, and locally generated path data.

When a needed icon is missing from the approved local sources, create it through
the imagegen asset pipeline and store it under the relevant `docs/assets/`
project folder before implementation.

## Manifest Scope

The central manifest should include assets that are:

- approved or currently active;
- reused across pages or channels;
- imported into WordPress;
- used in GitHub/README distribution;
- implementation-bound even if still pending approval.

Exploratory image generations may remain documented in a project pack or contact
sheet until Guilherme approves or rejects them.
