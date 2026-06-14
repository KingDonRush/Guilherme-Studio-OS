# Asset Registry Protocol

Use this protocol whenever visual assets are created, selected, promoted,
imported into WordPress, or prepared for GitHub/social distribution.

The goal is to make Codex reason from page need and channel purpose while the
page is being built, not to generate speculative asset packs up front.

Use this as a runtime loop:

1. Build the page or mockup structure.
2. When a visual block becomes weak, fake, generic, or impossible to express
   well with code/Elementor, pause.
3. Classify the missing asset.
4. Generate, capture, extract, or prepare only that asset.
5. Treat and register it if it becomes practical work.
6. Continue building.
7. Repeat until the page or asset pack is finished.

A small pre-scan is allowed only to anticipate obvious needs and avoid chaos. It
must not become a speculative batch-generation step.

## 1. Surface Classification

Classify the work first:

- portfolio page;
- portfolio case study;
- fictional demo site;
- plugin admin/product UI;
- GitHub README/presentation;
- social/Open Graph/release asset;
- source/reference/evidence capture.

Do not mix portfolio identity, fictional demo identity, and plugin proof unless
the artifact explicitly needs that blend.

## 2. Channel Package

List the active channels before creating assets:

- `portfolio-site`
- `wordpress-runtime`
- `wordpress-media`
- `elementor-reference`
- `github-readme`
- `github-social-preview`
- `release-notes`
- `social-post`
- `case-study`
- `demo-site`
- `archive-source`

If GitHub is a channel, the asset must support public evidence: what the plugin
does, how it is used, or why the implementation is credible.

## 3. Runtime Asset Budget

Maintain the smallest useful asset budget while working:

- known required identity assets;
- known required product/context assets;
- known required proof captures;
- known required texture/depth assets;
- known required iconography;
- known required distribution crops;
- newly discovered visual blockers.

Do not stop the whole page to complete every possible asset in advance. Build
until a concrete gap appears, solve that asset, then continue.

Avoid speculative filler. Generate only when there is a visible gap that code,
Elementor, screenshots, or existing assets cannot solve well.

## 4. Micro-Component Split At The Block

When a visual block is being built and starts to fail, decide:

- code/Elementor: layout, cards, spacing, text, buttons, responsive structure;
- JS/SVG/canvas: connectors, anchor-following lines, stateful geometry, motion;
- imagegen/capture: people, products, places, texture, lighting, proof media,
  custom iconography, atmosphere, rich background plates;
- deterministic extraction: assets that already exist in an approved mockup.

Icons are excluded from the JS/SVG/canvas bucket. New icons must not be created
with code. Use existing WordPress/Elementor/theme/approved icon assets, or
generate the missing icon with imagegen and register it as an asset.

If the component is abstract and does not map to an actual page need, do not
generate it.

Do not generate because the concept is interesting. Generate because the current
block needs a specific visual asset to become credible.

## 5. Evidence And Fidelity

Before an asset claims behavior:

- inspect plugin/code/docs when the claim is technical;
- prefer real screenshots for Elementor/editor fidelity;
- reject imagegen UI labels that invent controls, prices, platforms, or states;
- run `approved-asset-fidelity` for assets extracted from an approved visual.

## 6. Promotion Path

Use lifecycle states:

`idea -> candidate -> approved -> production -> imported`

Other states:

- `source`
- `superseded`
- `rejected`

Approval by Guilherme triggers production export and, when public WordPress use
is intended, WordPress Media Library import.

## 7. Registry Update

Update `docs/assets/asset-manifest.json` when the asset is:

- approved;
- active in code or Elementor;
- imported into WordPress;
- used by GitHub/social/Open Graph/release distribution;
- reused across multiple pages/projects;
- part of public case-study proof.

Use `docs/assets/asset-taxonomy.md` for valid function, channel, status,
source-type, and implementation-role tags.

## 8. Final Check

Before reporting completion:

- run the root asset check and move every accidental root file into
  `docs/assets/` or the appropriate runtime folder:

```bash
find . -maxdepth 1 -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' -o -iname '*.svg' -o -iname '*.gif' -o -iname '*.zip' \) -print
```

- validate manifest JSON;
- verify referenced file paths exist;
- confirm whether assets are source, candidate, production, or imported;
- mention any unapproved assets still awaiting Guilherme's visual approval.
