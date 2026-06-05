# Filter Controller Style Cadence Reactive Hotfix

Date: 2026-06-05

Task: `TASK-FC-023`

Status: implementation complete, Guilherme Elementor QA required.

Plugin commit: `496480b` pushed to
`https://github.com/KingDonRush/elementor-implementation-toolkit` on `main`.

## Trigger

After `TASK-FC-022`, Guilherme reported that Style sections started appearing
together and did not disappear until reload. That means the saved helper flags
were not enough; the panel itself needed an immediate visual cadence fallback.

## Fix

Plugin change:

- `assets/js/eit-editor.js`
  - prefer visible Content repeater rows as the freshest source while the user
    is editing filters;
  - keep normalized `container.settings.get('filters')` as fallback for Style
    tab and imported presets;
  - apply panel visibility directly to type-specific Style controls for
    Options, Range, and Rating;
  - schedule a short follow-up sync because Elementor repeater updates can land
    after the first click/change event;
  - trigger a fresh sync when the user switches between Content, Style, and
    Advanced tabs.

## Boundary

This is still an editor-panel behavior fix. It does not change frontend
filtering, rendered HTML, REST filtering, preset persistence, or range styling.

## Verification

Passed:

- Agentic Ops `validate_task`;
- `node --check assets/js/eit-editor.js`;
- PHP lint for plugin PHP files;
- `composer validate --strict`;
- `git diff --check`.

Still requires Guilherme:

- add/remove range and confirm Range Style appears/disappears without reload;
- add/remove checkbox/chips/radio/swatch/toggle and confirm Options follows;
- add/remove rating and confirm Rating follows;
- check whether the 80ms/320ms sync feels instant enough in real editor use.
