# Filter Controller Widget Save Security Contract

Date: 2026-06-04

Task: `TASK-FC-002`

Status: complete.

This document defines the save-from-widget security and transport contract before
implementation starts. It does not change plugin source code.

## Evidence Base

Local source inspected:

- `docs/implementation-toolkit/filter-controller-preset-contract-inventory.md`
  - preset/widget ownership map from `TASK-FC-001`.
- `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Support/Assets.php`
  - current frontend REST nonce localization and editor config localization.
- `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Rest/FilterControllerEndpoint.php`
  - current public filtering endpoint.
- `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Support/FilterPresets.php`
  - current persistence, sanitization, limits, allowed values.
- `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Admin/FilterPresetAdmin.php`
  - current admin save/delete capability and nonce pattern.
- `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Core/Plugin.php`
  - current service registration.
- `wordpress/wp-includes/rest-api.php`
  - REST cookie nonce checks read `X-WP-Nonce` and verify `wp_rest`.
- `wordpress/wp-content/plugins/elementor/data/base/controller.php`
  - Elementor REST controllers use `permission_callback` and default to
    `current_user_can( 'manage_options' )` for write methods.
- `wordpress/wp-content/plugins/elementor/includes/user.php`
  - Elementor has post edit capability helpers, but preset persistence is global
    plugin state, not per-post content.

## Transport Decision

Use REST, not `admin-post` and not `admin-ajax`.

Chosen route family:

- `POST /wp-json/eit/v1/filter-presets`
- optional future update route: `PUT /wp-json/eit/v1/filter-presets/{id}`
- optional future read route for editor recovery:
  `GET /wp-json/eit/v1/filter-presets/{id}`

Implementation shape:

- create a dedicated class, likely `EIT\Rest\FilterPresetEndpoint`;
- register it from `EIT\Core\Plugin::run()`;
- keep `FilterControllerEndpoint` focused on frontend filtering;
- keep public filtering payloads separate from protected preset persistence.

Reason:

- widget save is async editor behavior, so `admin-post` redirect flow does not
  fit;
- REST has a standard WordPress nonce path through `X-WP-Nonce`;
- REST responses are easier to smoke-test mechanically than Elementor panel UI;
- Elementor local source already follows REST controller and permission callback
  patterns for app/data operations.

## Capability Decision

Require `AdminPages::CAPABILITY`, currently `manage_options`, for global preset
create/update.

Do not rely only on Elementor's `edit_post` permission.

Reason:

- filter presets are global plugin objects stored in `eit_filter_presets`;
- editing one Elementor page/template can affect many pages if a preset is
  linked;
- current wp-admin preset management already uses `manage_options`;
- lowering widget save to page editors would create a new privilege path for
  global plugin configuration.

Optional future relaxation:

- introduce a custom capability such as `manage_eit_filter_presets`;
- map it to administrators by default;
- document it as a product permission decision.

That relaxation is out of scope for `TASK-FC-003`.

## Nonce Decision

Use the standard REST nonce:

- PHP source: `wp_create_nonce( 'wp_rest' )`;
- JS transport header: `X-WP-Nonce`;
- validation: WordPress `rest_cookie_check_errors()`.

Required implementation change:

- extend `eitEditorConfig` with:
  - `restUrl`: `rest_url( 'eit/v1/' )` or exact preset route;
  - `restNonce`: `wp_create_nonce( 'wp_rest' )`;
  - optionally `canManagePresets`: `current_user_can( AdminPages::CAPABILITY )`.

Do not reuse `eitConfig.nonce` incidentally from frontend runtime.

Reason:

- `eitConfig` belongs to frontend filtering;
- `eitEditorConfig` belongs to Elementor editor behavior;
- save-from-widget should be testable and obvious from editor code.

## Payload Schema

Endpoint request body for create:

```json
{
  "operation": "create",
  "after_save": "link",
  "preset": {
    "name": "Shop filters",
    "slug": "shop-filters",
    "description": "",
    "target_selector": "",
    "item_selector": "",
    "apply_mode": "auto",
    "sync_url": true,
    "per_page": 9,
    "show_result_count": true,
    "result_count_text": "{count} results",
    "show_active_chips": true,
    "show_sort": true,
    "sort_label": "Sort by",
    "sort_options": "default|Default",
    "apply_text": "Apply filters",
    "reset_text": "Reset",
    "empty_text": "No matching items found.",
    "pagination_type": "numbers",
    "previous_text": "Previous",
    "next_text": "Next",
    "filters": []
  },
  "source_widget": {
    "element_id": "",
    "document_id": 0
  }
}
```

Endpoint request body for explicit update:

```json
{
  "operation": "update",
  "preset_id": "shop-filters",
  "confirm_overwrite": true,
  "after_save": "link",
  "preset": {}
}
```

Allowed `after_save` values:

- `link`: server response tells the editor to set
  `configuration_source=preset` and `filter_preset=<saved id>`;
- `detach`: server saves the preset but leaves the current widget in widget mode;
- `none`: server only saves and returns metadata.

Allowed preset keys:

- identity: `name`, `slug`, `description`;
- target defaults: `target_selector`, `item_selector`;
- behavior/display: `apply_mode`, `sync_url`, `per_page`,
  `show_result_count`, `result_count_text`, `show_active_chips`, `show_sort`,
  `sort_label`, `sort_options`, `apply_text`, `reset_text`, `empty_text`,
  `pagination_type`, `previous_text`, `next_text`;
- structure: `filters`.

Rejected preset keys:

- all Style tab controls;
- `configuration_source`;
- `filter_preset`;
- editor-only hidden controls such as `eit_filter_has_*`;
- frontend state, active chips, URL state, pagination result state;
- arbitrary unknown keys.

## Filter Row Schema

Allowed filter row keys:

- `enabled`;
- `label`;
- `type`;
- `key`;
- `source`;
- `query_var`;
- `compare`;
- `data_type`;
- `placeholder`;
- `options`;
- `range_min`;
- `range_max`;
- `range_step`;
- `default_value`;
- `empty_behavior`;
- `show_count`;
- `show_label`.

Allowed filter types:

- `search`;
- `checkbox`;
- `radio`;
- `select`;
- `chips`;
- `toggle`;
- `range`;
- `date`;
- `swatch`;
- `rating`.

Malformed row handling:

- non-array rows reject the request with HTTP `400`;
- unknown row keys reject the request with HTTP `400`;
- unknown filter type rejects the request with HTTP `400`;
- range rows require numeric `range_min`, `range_max`, and `range_step` when
  present;
- option-based rows may have empty options only if saved as a draft; otherwise
  return a warning in the response;
- if all rows are invalid or skipped, do not call `FilterPresets::save()`.

The implementation may reuse `FilterPresets::sanitize_preset()` internally, but
widget save should validate shape before persistence so errors are intentional
instead of silently normalized into surprising presets.

## Normalization Checklist

Before calling `FilterPresets::save()`:

- require authenticated REST request;
- require `current_user_can( AdminPages::CAPABILITY )`;
- validate `operation`;
- validate `after_save`;
- validate `preset_id` on update;
- reject update unless `confirm_overwrite=true`;
- reject unknown top-level request keys;
- reject unknown preset keys;
- reject malformed filter rows;
- cap filter rows at `FilterPresets::MAX_FILTERS`;
- cap sort options at `FilterPresets::MAX_SORT_OPTIONS`;
- cap option lines at current parser limits;
- convert widget `auto_apply`/`show_apply` to preset `apply_mode`;
- convert Elementor switcher values `yes`/empty to booleans;
- strip local Style controls;
- strip editor helper flags;
- preserve existing saved presets when request validation fails.

## Response Contract

Success response:

```json
{
  "ok": true,
  "preset": {
    "id": "shop-filters",
    "name": "Shop filters",
    "slug": "shop-filters",
    "updated_at": "2026-06-04 10:00:00",
    "filter_count": 3,
    "edit_url": "https://example.test/wp-admin/admin.php?page=eit-filter-presets&preset=shop-filters"
  },
  "editor_update": {
    "configuration_source": "preset",
    "filter_preset": "shop-filters"
  },
  "warnings": []
}
```

When `after_save=detach`, `editor_update` should be empty or explicitly
communicate that no widget settings should change.

Error response:

```json
{
  "ok": false,
  "code": "eit_filter_preset_invalid_payload",
  "message": "Preset payload is invalid.",
  "fields": {
    "preset.filters.0.type": "Unknown filter type."
  }
}
```

Required error codes:

- `eit_filter_preset_forbidden`: current user lacks capability, HTTP `403`;
- `eit_filter_preset_invalid_nonce`: REST nonce failure, normally handled by
  WordPress, HTTP `403`;
- `eit_filter_preset_invalid_payload`: shape or unknown field problem,
  HTTP `400`;
- `eit_filter_preset_not_found`: update target missing, HTTP `404`;
- `eit_filter_preset_overwrite_required`: update requested without explicit
  confirmation, HTTP `409`;
- `eit_filter_preset_save_failed`: persistence failed, HTTP `500`.

## Editor State Contract

After successful save with `after_save=link`, editor JS should:

- update `configuration_source` to `preset`;
- update `filter_preset` to returned preset id;
- refresh/select the preset option in the Elementor panel if possible;
- leave Style controls unchanged;
- leave `target_selector` and `item_selector` unchanged if the widget already
  has local values;
- show a small editor notice or inline success state.

After successful save with `after_save=detach`, editor JS should:

- leave `configuration_source` as `widget`;
- leave local `filters` unchanged;
- show saved preset id/name for confirmation only.

No editor flow should mutate an existing linked preset without explicit
confirmation.

## Mechanical Smoke-Test Plan

After implementation in `TASK-FC-003`, run:

1. PHP lint for new/changed PHP files.
2. JS syntax check for `assets/js/eit-editor.js`.
3. `composer validate --strict`.
4. Route registration smoke through WP-CLI:
   - confirm `eit/v1/filter-presets` exists.
5. Unauthorized REST smoke:
   - no nonce or no capability returns `403`;
   - stored `eit_filter_presets` option remains unchanged.
6. Malformed payload smoke:
   - unknown preset key returns `400`;
   - malformed filter row returns `400`;
   - stored option remains unchanged.
7. Valid create smoke:
   - POST minimal widget-derived preset;
   - response includes id, name, slug, updated_at, filter_count;
   - `get_option( 'eit_filter_presets' )` contains normalized fields only.
8. Explicit update smoke:
   - update without `confirm_overwrite` returns `409`;
   - update with confirmation changes only the target preset.

## Implementation Boundary

`TASK-FC-002` stops here. It defines the security and payload contract only.

`TASK-FC-003` should implement:

- editor config REST nonce localization;
- protected REST endpoint;
- request validator;
- widget settings to preset mapper;
- editor-side save action;
- mechanical smoke tests.
