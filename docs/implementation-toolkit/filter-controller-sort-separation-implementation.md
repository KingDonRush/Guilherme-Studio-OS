# Filter Controller Sort Separation Implementation

Date: 2026-06-05

Task: `TASK-FC-024`

Status: implementation complete, Guilherme Elementor QA required.

Plugin commit: `3a31190` pushed to
`https://github.com/KingDonRush/elementor-implementation-toolkit` on `main`.

## Trigger

Guilherme pointed out two structural gaps:

- Filters needed to support removing every row instead of forcing a permanent
  filter.
- Sort needed to stop living inside `State, Sort & Pagination` and become a
  deeper, standalone widget section like Filters.

## Fix

Plugin changes:

- `includes/Elementor/FilterController/ContentControls.php`
  - allows the Filters repeater to become empty with `prevent_empty => false`;
  - adds a standalone `Sort` Content section;
  - adds structured Sort rows for label, source, data key, data type, and
    direction;
  - keeps legacy sort lines behind an advanced switcher for compatibility.
- `includes/Support/SortOptions.php`
  - centralizes default sort lines, structured row defaults, value compilation,
    and legacy-line mapping.
- `includes/Elementor/Widgets/FilterController.php`
  - resolves structured sort rows into the existing `value|Label` option
    contract before rendering.
- `includes/Support/FilterResolver.php`
  - preserves existing sort values;
  - adds custom data-key sort values such as `data_price_number_asc`;
  - preserves original item order as the tie-breaker.
- `includes/Admin/FilterPresetAdmin.php`
  - stops recreating a default Search row when a preset has zero filters.
- `assets/js/eit-editor.js`
  - compiles structured Sort rows when saving presets from Elementor;
  - treats an empty visible Filters repeater as a real empty filter state.
- `elementor-implementation-toolkit.php`
  - bumps plugin assets to `0.2.6`.

## Boundary

This slice makes Sort structurally viable in the Elementor widget and makes
empty filter sets legitimate in both the widget and the admin preset form. It
does not yet redesign the admin preset form into a full structured Sort builder.
The admin screen still preserves the legacy sort textarea and can become its own
admin UI slice later.

## Verification

Passed:

- `node --check assets/js/eit-editor.js`;
- `node --check assets/js/eit-frontend.js`;
- `node --check assets/js/eit-admin.js`;
- PHP lint for plugin PHP files;
- `composer validate --strict`;
- isolated `SortOptions` PHP smoke test with WordPress function stubs;
- `git diff --check`.

Not available:

- WP-CLI runtime smoke. `wp` is not installed in this local environment.

Still requires Guilherme:

- confirm Filters can be fully emptied in Elementor;
- confirm Style sections disappear when filters are empty;
- confirm the new Sort section feels properly separated in Content;
- test at least one custom data-key sort on a real listing.
