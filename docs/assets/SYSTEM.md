# Asset Folder System

This is the operating rule for visual assets.

## Primary Rule

Project-specific assets live inside the project capsule. `docs/assets` is now
for shared assets, distribution exports and legacy redirects.

Bad search path:

```text
docs/assets/sources/imagegen/...
docs/assets/portfolio/mockups/...
wordpress/.../assets/images/...
```

Good search path:

```text
portfolio/sites/multipaginados/mina-forma/docs/README.md
clients/<client>/projects/<project>/docs/README.md
products/<product>/docs/README.md
```

The capsule README tells the human where the current mockups, sources,
production exports and WordPress copies live.

## Capsule Shape

New or migrated project capsules should use:

```text
<domain>/<project-or-record>/
  docs/
    README.md
    ASSET_MAP.md
    MOCKUP_PROMPTS.md
  assets/
    mockups/
    sources/
    wordpress/
    manifests/
    deprecated/
```

Meaning:

- `README.md`: purpose, rules, quick links and current status.
- `ASSET_MAP.md`: inventory by page/batch/use.
- `MOCKUP_PROMPTS.md`: prompts and art-direction instructions when relevant.
- `assets/mockups/`: full-page references, contact sheets and approved visual direction.
- `assets/sources/`: raw imagegen/chroma/screenshots used to produce assets.
- `assets/wordpress/`: optimized WordPress-ready WebP/SVG assets or runtime
  copy manifests.
- `assets/manifests/`: checksums, generation batches and import records.
- `assets/deprecated/`: retained old assets that should not be used.

## Legacy Rule

Do not move old assets just to make the folder look clean.

Move legacy assets only when:

- the capsule has a README and ASSET_MAP;
- current references are known;
- manifests or implementation paths can be updated in the same slice;
- the move can be reviewed as a small Git change;
- production/runtime copies are not accidentally mixed with source files.

Until then, create a redirect hub that points to the legacy locations.

## Where New Files Go

| Asset kind | Destination |
| --- | --- |
| Project mockup | `<capsule>/assets/mockups/` |
| Prompt or art direction | `<capsule>/docs/` |
| Raw imagegen/chroma/source | `<capsule>/assets/sources/` |
| Optimized implementation asset | `<capsule>/assets/wordpress/` or another implementation-specific asset folder |
| WordPress-ready copy | `<capsule>/assets/wordpress/` or runtime path plus manifest |
| Shared icon/texture | `docs/assets/shared/` only if reused by multiple capsules or packs |
| GitHub/social/Open Graph crop | `docs/assets/distribution/<channel>/` |

## WordPress Rule

Anything copied into WordPress should have:

- a capsule owner;
- a source or generation reference;
- optimized WebP or legitimate SVG format;
- human-readable filename;
- SEO-oriented alt/title intent recorded in the capsule map or manifest;
- no source raster dumped into the runtime path.

## Current Migration Status

| Entry | Status |
| --- | --- |
| Mina Forma | Migrated to `portfolio/sites/multipaginados/mina-forma/`; `docs/assets/packs/mina-forma/` is redirect-only. WordPress runtime mirror remains under the theme. |
| Portfolio Home | Legacy pack; needs future migration hub. |
| Simple Budget Plugin | Legacy pack; manifest exists. |
| Implementation Toolkit | Legacy pack; admin asset structure exists. |
