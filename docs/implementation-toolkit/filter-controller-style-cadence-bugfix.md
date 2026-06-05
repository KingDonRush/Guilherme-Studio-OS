# Filter Controller Style Cadence Bugfix

Date: 2026-06-05

Task: `TASK-FC-022`

Status: implementation complete, Guilherme Elementor QA required.

## Trigger

Guilherme reported that the widget rendered a range filter, but the Style tab
showed no Range section.

The screenshot showed:

- Content/preview has a visible range control;
- Style has Layout, Fields, Buttons, Active Chips & Count, Pagination, and
  Loading;
- Style is missing the Range section.

## Cause

`TASK-FC-021` removed the dependency on the visible Content repeater DOM, but
`assets/js/eit-editor.js` still assumed `container.settings.get('filters')`
would be a plain JavaScript array.

In Elementor, repeater settings can arrive as a Backbone-style collection,
model list, or object-like structure depending on editor state. When the value
was not a plain array and the Content tab was not visible, the old fallback read
zero panel rows and cleared the hidden `eit_filter_has_*` helper flags.

That made Elementor hide Range even though the frontend preview still rendered
the range filter.

## Fix

Plugin changes:

- `assets/js/eit-editor.js`
  - normalize filter rows from arrays, `toJSON()` collections, `models`, and
    object maps;
  - keep the panel DOM reader as a fallback;
  - abort sync when filters cannot be read, instead of clearing type flags.

No frontend filtering runtime changed.

## Verification

Passed:

- Agentic Ops `validate_task`;
- `node --check assets/js/eit-editor.js`;
- PHP lint for plugin PHP files;
- `composer validate --strict`;
- `git diff --check`;
- static check for the unreadable-filter guard.

Still requires Guilherme:

- open the widget;
- confirm Range appears in Style when the visible/default filters include range;
- remove the range filter in Content and confirm Range disappears;
- add range again and confirm Range returns.
