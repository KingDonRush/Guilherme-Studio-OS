# EIT Admin V0.2 Icon Canonicalization Report

## Result

Icon generation is frozen. The admin V0.2 frames now resolve to a reduced canonical vocabulary plus CSS/UI primitives. This keeps the visual language coherent and prevents one-off generated icon sprawl.

## Counts

- Existing production WebPs: 111
- Canonical icon families: 11
- Canonical WebP glyphs selected: 58
- Planned concept records resolved: 719
- `badge_css`: 61
- `css_glyph`: 9
- `icon`: 572
- `no_asset`: 8
- `text_label`: 69
- Unresolved icon targets: 0

## Canonical Families

- `01_shell_navigation`: `logo-layers`, `filter-funnel`, `post-type`, `connector-registry`, `admin-screen`
- `02_actions`: `save-disk`, `preview-eye`, `publish-rocket`, `reset-refresh`
- `03_architecture_core`: `object`, `scope`, `contract`, `binding`, `schema`, `module`, `output`, `runtime`
- `04_architecture_graph`: `filter-object-map`, `architecture-step-rail`, `ownership-spine-connectors`
- `05_data_content`: `source-database`, `taxonomy`, `meta-field`, `registration`, `rest`
- `06_provider_target`: `provider`, `target-bullseye`, `existing-cards`, `listing-detector`
- `07_filter_controls`: `search`, `checkbox`, `chips`, `range-sliders`, `swatches`, `rating-star`, `sort-arrows`, `pagination`, `result-count`
- `08_runtime_flow`: `url-router`, `ajax-bolt`, `dom-code`, `controller-state-machine`, `state-feedback-loop`, `apply-strategy`
- `09_rules_schema`: `conditional-rules`, `constraints-sliders`, `context-crosshair`, `data-availability`, `item-boundary`, `identity-resolver-priority`
- `10_inspector_preview`: `inspector`, `inspector-sliders`
- `11_integrations`: `simple-budget-bridge`, `woo-adapter`, `mobile-panel`, `token-mapper`, `handoff-notes`, `qa-runner`

## Section Resolution

- `00-shared-01-04`: total=160; badge_css=26, css_glyph=6, icon=117, text_label=11
- `05-08`: total=129; badge_css=7, css_glyph=1, icon=81, no_asset=8, text_label=32
- `09-12`: total=112; badge_css=1, css_glyph=2, icon=95, text_label=14
- `13-16`: total=80; badge_css=7, icon=63, text_label=10
- `17-20`: total=97; badge_css=6, icon=91
- `21-24`: total=72; badge_css=10, icon=62
- `25-28`: total=69; badge_css=4, icon=63, text_label=2

## Decision

Do not generate more icons until a concept appears in `icon-concept-resolution.json` as a real unresolved icon target. Current unresolved target count is zero. Existing duplicate files stay temporarily because current PHP/admin code and previous manifests may refer to those filenames.

## Files

- `canonical-icon-manifest.json`
- `icon-concept-resolution.json`
- `icon-duplicate-candidates.json`
