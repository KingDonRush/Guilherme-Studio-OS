# Asset Folder System

This is the operating rule for `docs/assets`.

## Primary Rule

Assets are organized by **pack first**, then by lifecycle.

Bad search path:

```text
docs/assets/sources/imagegen/...
docs/assets/portfolio/mockups/...
wordpress/.../assets/images/...
```

Good search path:

```text
docs/assets/packs/<pack>/README.md
```

The pack README tells the human where the current mockups, sources, production
exports and WordPress copies live.

## Pack Shape

New or migrated packs should use:

```text
docs/assets/packs/<slug>/
  README.md
  ASSET_MAP.md
  prompts/
  mockups/
  sources/
  production/
  wordpress/
  manifests/
  deprecated/
```

Meaning:

- `README.md`: purpose, rules, quick links and current status.
- `ASSET_MAP.md`: inventory by page/batch/use.
- `prompts/`: prompts and art-direction instructions.
- `mockups/`: full-page references, contact sheets and approved visual direction.
- `sources/`: raw imagegen/chroma/screenshots used to produce assets.
- `production/`: optimized WebP/SVG/transparent assets ready for implementation.
- `wordpress/`: WordPress-ready copies or a manifest pointing to the runtime path.
- `manifests/`: checksums, generation batches and import records.
- `deprecated/`: retained old assets that should not be used.

## Legacy Rule

Do not move old assets just to make the folder look clean.

Move assets only when:

- the pack has a README and ASSET_MAP;
- current references are known;
- manifests or implementation paths can be updated in the same slice;
- the move can be reviewed as a small Git change;
- production/runtime copies are not accidentally mixed with source files.

Until then, create a pack hub that points to the legacy locations.

## Where New Files Go

| Asset kind | Destination |
| --- | --- |
| Project mockup | `docs/assets/packs/<slug>/mockups/` |
| Prompt or art direction | `docs/assets/packs/<slug>/prompts/` |
| Raw imagegen/chroma/source | `docs/assets/packs/<slug>/sources/` |
| Optimized implementation asset | `docs/assets/packs/<slug>/production/` |
| WordPress-ready copy | `docs/assets/packs/<slug>/wordpress/` or runtime path plus manifest |
| Shared icon/texture | `docs/assets/shared/` only if reused by multiple packs |
| GitHub/social/Open Graph crop | `docs/assets/distribution/<channel>/` |

## WordPress Rule

Anything copied into WordPress should have:

- a pack owner;
- a source or generation reference;
- optimized WebP or legitimate SVG format;
- human-readable filename;
- SEO-oriented alt/title intent recorded in the pack map or manifest;
- no source raster dumped into the runtime path.

## Current Migration Status

| Pack | Status |
| --- | --- |
| Mina Forma | Migrated to `docs/assets/packs/mina-forma/`; WordPress runtime mirror remains under the theme. |
| Portfolio Home | Legacy pack; needs future migration hub. |
| Simple Budget Plugin | Legacy pack; manifest exists. |
| Implementation Toolkit | Legacy pack; admin asset structure exists. |
