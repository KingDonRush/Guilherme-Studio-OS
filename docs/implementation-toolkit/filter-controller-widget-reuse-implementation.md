# Filter Controller Widget Reuse Implementation

Date: 2026-06-04

## Scope

TASK-FC-005 implements explicit reuse states for saved Filter Controller presets
inside Elementor widgets.

## Behavior

The widget now distinguishes:

- `widget`: local widget controls are the source of truth;
- `unselected`: shared preset mode is selected, but no preset was chosen;
- `linked`: the widget loads behavior from a saved preset;
- `missing`: the selected preset no longer exists.

Linked mode reads the normalized preset at render time. Style controls remain
local to the Elementor widget.

Detached import is explicit: the editor has an "Import preset as local copy"
action. Importing calls the protected preset GET endpoint, receives
`widget_settings`, switches the widget back to local controls, and clears the
shared preset link.

If local filters already exist, the editor asks for confirmation before import.

## Recoverability

Missing presets no longer fail silently. The runtime marks the state as
`missing`; users with `manage_options` see a recoverable notice telling them to
select another preset or import a local copy.

The frontend data contract also exposes:

- `data-eit-preset-state`;
- `presetState`;
- `presetId`;
- `presetName`.

## REST Contract

The protected endpoint now supports:

- `GET /wp-json/eit/v1/filter-presets/{id}`;
- `POST /wp-json/eit/v1/filter-presets`;
- `PUT/PATCH /wp-json/eit/v1/filter-presets/{id}`.

The GET response includes:

- preset identity metadata;
- warnings;
- `widget_settings` for detached import.

The route remains capability-protected through `AdminPages::CAPABILITY`.

## QA Boundary

Codex verified the mechanical contract:

- GET returns detached import settings;
- linked widgets resolve saved preset filters;
- missing presets produce recoverable state;
- runtime config/filter data contain expected values.

Guilherme remains final QA for Elementor editor interaction nuance, copy
clarity, and multi-click visual behavior.
