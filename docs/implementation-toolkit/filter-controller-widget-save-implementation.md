# Filter Controller Widget Save Implementation

Date: 2026-06-04

Task: `TASK-FC-003`

Status: complete.

This implementation adds the first protected widget-side save path for Filter
Controller presets.

## Changed Files

Plugin source:

- `includes/Rest/FilterPresetEndpoint.php`
  - new protected REST endpoint for preset create/update;
  - rejects unknown request, preset, and filter fields;
  - requires `AdminPages::CAPABILITY`;
  - returns editor update data for link-after-save.
- `includes/Core/Plugin.php`
  - registers `FilterPresetEndpoint`.
- `includes/Support/Assets.php`
  - exposes editor REST URL, preset save URL, REST nonce, capability flag, and
    save i18n through `eitEditorConfig`.
- `includes/Elementor/FilterController/ContentControls.php`
  - adds local widget controls for new preset name, after-save behavior, and
    save action button.
- `assets/js/eit-editor.js`
  - maps current widget settings to allowed preset payload;
  - posts to the protected REST endpoint with `X-WP-Nonce`;
  - updates `configuration_source` and `filter_preset` after link saves;
  - leaves Style controls local.
- `assets/css/eit-editor.css`
  - adds small status styling for the editor save action.

Planning/docs:

- `docs/implementation-toolkit/filter-controller-preset-contract-inventory.md`
- `docs/implementation-toolkit/filter-controller-widget-save-security-contract.md`
- `docs/implementation-toolkit/filter-controller-four-point-agentic-subplan.md`

## Behavior

When the widget is in `Configuration Source = Widget controls`, the Elementor
panel now exposes:

- `New Preset Name`;
- `After Save`;
- `Save current filters as preset`.

The save action:

1. collects current widget-owned filter configuration;
2. strips Style tab settings and editor helper flags;
3. sends only preset-owned fields to `POST /wp-json/eit/v1/filter-presets`;
4. requires REST nonce and `manage_options`;
5. saves a normalized preset through `FilterPresets::save()`;
6. if `After Save = Save and link this widget`, updates the widget to:
   - `configuration_source = preset`;
   - `filter_preset = <new preset id>`.

## Security Contract Implemented

- Global preset create/update requires `AdminPages::CAPABILITY`.
- REST cookie nonce path uses `X-WP-Nonce` with `wp_rest`.
- Unknown request, preset, or filter keys fail with HTTP `400`.
- Update without explicit overwrite confirmation fails with HTTP `409`.
- Invalid range numeric fields fail with HTTP `400`.
- Existing preset storage is not touched when validation fails.

## Smoke Evidence

Environment:

- direct host PHP could not load WordPress because the harness PHP lacks
  `mysqli`;
- Docker WordPress container was running and had `mysqli`;
- Docker container did not have `wp`, so smoke used PHP plus WordPress REST
  dispatcher.

Results:

- route registration:
  - `/eit/v1/filter-presets`: registered;
  - `/eit/v1/filter-presets/(?P<id>[a-z0-9_-]+)`: registered.
- forbidden save smoke:
  - unauthenticated/no-capability request returned `403`;
  - code: `eit_filter_preset_forbidden`.
- malformed payload smoke:
  - unknown filter field returned `400`;
  - code: `eit_filter_preset_invalid_payload`.
- valid create smoke:
  - returned `201`;
  - created id: `codex-smoke-preset`;
  - response included editor update for linked mode;
  - stored filter count was `1`;
  - temporary preset cleanup succeeded.
- update guard smoke:
  - update without `confirm_overwrite` returned `409`;
  - code: `eit_filter_preset_overwrite_required`;
  - temporary preset cleanup succeeded.

## Remaining UX Gap

This is mechanically implemented and smoke-tested, but the Elementor panel
interaction still needs Guilherme QA.

Specific things for visual/editor QA later:

- whether the save button placement feels native enough inside Elementor;
- whether status text is noticeable without becoming noisy;
- whether the panel refresh after link-save is understandable;
- whether `After Save` copy should be simpler;
- whether `New Preset Name` belongs in Target Listing or should move near the
  Filters section.

This does not block the backend/security contract.
