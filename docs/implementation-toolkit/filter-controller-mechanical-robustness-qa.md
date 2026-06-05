# Filter Controller Mechanical Robustness QA

Date: 2026-06-05

Task: `TASK-FC-047`
Subplan: `SUBPLAN-FC-MECHANICAL-ROBUSTNESS-QA`

## Scope

This pass covers the parts Codex can validate mechanically:

- Elementor control visibility through local widget stack checks;
- CSS containment guard checks;
- Toolkit CPT dynamic tag catalog and resolver compatibility;
- preset dynamic binding round-trip at storage/import mapping level;
- registered public meta, private meta exclusion, taxonomy, post field, and compare/dataType resolver behavior;
- Sort option compilation and ordering;
- explicit separation of human QA checks.

It does not claim to complete browser/editor visual QA.

## Objective Failures Found

The first harness run reported:

- Sort had no independent Style section.
- Registered meta date filters failed because date matching used an aggregate string containing both the meta value and visible text.
- `compare`, `source`, and `dataType` were not wired into the frontend payload and resolver semantics.

## Fixes Applied

- Added a Sort Style section gated by `show_sort`.
- Added hidden `compare` and `data_type` fields to filter repeater rows for preset import/runtime compatibility.
- Added `data-eit-compare` and `data-eit-data-type` render attributes.
- Updated frontend state collection to include `source`, `compare`, and `dataType` when present.
- Updated `FilterResolver` to support explicit `contains`, `equals`, `in`, `between`, `gte`, `lte`, and `exists` comparisons.
- Updated range/date/rating matching to prefer the primary `data[key]` value when it exists.
- Added `scripts/verify-filter-controller-robustness.php`.

## Harness Result

Command:

```bash
docker compose run --rm wpcli eval-file wp-content/plugins/elementor-implementation-toolkit/scripts/verify-filter-controller-robustness.php
```

Result:

- Passed: 49
- Failed: 0
- Skipped human QA: 6

Skipped human QA remains assigned to Guilherme for:

- multi-click Elementor Style cadence flow;
- desktop/mobile visual containment screenshots;
- range variant visual judgment;
- option-filter visual matrix;
- rating icon visual QA;
- Elementor fallback warning screenshots and console notes.

## Boundary

This is a mechanical QA checkpoint, not the final visual sign-off. The plugin is stronger after this pass, but the product still needs Guilherme's visual/editor QA before the Filter Controller can be called visually finished.
