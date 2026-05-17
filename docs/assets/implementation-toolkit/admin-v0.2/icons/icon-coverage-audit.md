# EIT Admin V0.2 Icon Coverage Audit

## Status

This file records the pre-canonicalization audit.

It has been superseded by:

- `canonical-icon-manifest.json`
- `icon-concept-resolution.json`
- `icon-canonicalization-report.md`

The newer canonicalization pass resolves all planned concepts without requiring
new generated icons.

## Result

Not all planned icon concepts are covered yet.

The current icon set is valid for frames 17-28, but frames 01-16 still need a
canonical alias pass before we can say the asset system is complete.

## Current Counts

- Production WebP icons in plugin: 111
- Alias records: 233
- Alias records with missing target: 0
- Extracted generated packs with missing production WebP: 0
- Planned icon concepts found in the frame plan: 702
- Covered by direct WebP or valid alias: 239
- Unresolved planned concepts: 463

## Coverage By Section

- `00-shared-01-04`: 160 planned, 10 covered, 150 unresolved
- `05-08`: 129 planned, 0 covered, 129 unresolved
- `09-12`: 112 planned, 2 covered, 110 unresolved
- `13-16`: 80 planned, 2 covered, 78 unresolved
- `17-20`: 97 planned, 97 covered, 0 unresolved
- `21-24`: 72 planned, 72 covered, 0 unresolved
- `25-28`: 69 planned, 69 covered, 0 unresolved

## Important Interpretation

The unresolved count does not mean 463 new icons should be generated.

Most unresolved names from frames 01-16 are over-specific concepts that should
be mapped to existing canonical icons. The right next step is to create alias
manifests for:

- shared shell/state/architecture icons and frames 01-04;
- frames 05-08;
- frames 09-12;
- frames 13-16.

Only after those alias manifests exist should missing concepts be considered
for generation.

## Exact Duplicate Files

The plugin currently has exact duplicate WebP content under different names.
Do not delete these blindly because some names are referenced by current admin
PHP and alias manifests.

Exact duplicate groups:

- `active-chip.webp`, `meta-tag.webp`
- `active.webp`, `state-active.webp`, `state-valid.webp`, `valid.webp`
- `base-query-layers.webp`, `logo-layers.webp`
- `checkbox-control.webp`, `checkbox.webp`
- `degraded.webp`, `state-degraded.webp`
- `detector.webp`, `listing-detector.webp`
- `draft.webp`, `state-draft.webp`
- `inherited.webp`, `provider.webp`, `state-inherited.webp`
- `locked.webp`, `state-locked.webp`
- `override.webp`, `state-override.webp`
- `preview.webp`, `state-preview.webp`
- `provider-database.webp`, `source-database.webp`
- `rating-star.webp`, `rating.webp`
- `state-warning.webp`, `warning.webp`

## Recommendation

1. Freeze new icon generation temporarily.
2. Build alias manifests for unresolved frames 01-16.
3. Choose canonical names for exact duplicate groups.
4. Search code references before removing duplicate filenames.
5. Generate only the remaining true gaps after alias/canonical cleanup.

Machine-readable audit:

`docs/assets/implementation-toolkit/admin-v0.2/icons/icon-coverage-audit-full.json`
