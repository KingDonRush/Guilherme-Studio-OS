# Filter Controller Admin Library Implementation

Date: 2026-06-04

## Scope

TASK-FC-004 reframes the Filter Presets admin screen as a WordPress-native
library, preview, and diagnostics surface.

The admin is not the primary builder. Elementor remains the visual/composition
surface. wp-admin now answers:

- which presets exist;
- whether they came from Elementor or wp-admin;
- how many filters they contain;
- which selectors and provider assumptions they carry;
- when they were last updated;
- whether obvious health issues exist before reuse.

## Implementation Recipe

Chosen WordPress admin recipe: list/detail manager.

The existing `FilterPresetAdmin` list/detail flow was preserved. The change adds
library metadata, preview, and diagnostics around the same normalized preset data
used by the widget.

No standalone app shell was introduced.

## Data Contract

Widget-created presets now persist small origin metadata:

- `created_from.source = elementor_widget`;
- `created_from.saved_via = elementor_editor`;
- optional `created_from.document_id`;
- optional `created_from.element_id`;
- `created_at`;
- existing `updated_at`.

Admin-created presets default to:

- `created_from.source = admin`;
- `created_from.saved_via = admin_form`.

Updates preserve existing origin metadata unless new metadata is explicitly
provided.

## Admin Library Changes

The list view now shows:

- preset name, slug, and key;
- source label and source detail;
- filter count plus filter labels;
- target and item selector summary;
- updated date/time;
- health status;
- preview modal;
- existing edit, duplicate, delete, and Elementor-open actions.

The detail view now includes a "Library preview and diagnostics" panel before
the editable filter rows.

## Diagnostics

Diagnostics currently detect:

- missing target selector;
- empty filter list;
- unsupported preset fields;
- unsupported filter fields;
- unknown filter types;
- unknown data sources;
- unknown compare operators;
- unknown data types;
- empty options on choice-based filters;
- missing data key on non-search filters;
- invalid range bounds;
- invalid range step;
- disabled filters;
- unverified selectors.

Selector diagnostics are intentionally honest: the admin can show stored
selectors, but final selector validity still requires Elementor/frontend visual
confirmation.

## Role Boundary

Codex validation covers:

- PHP syntax;
- REST/runtime smoke;
- metadata persistence;
- preview rendering;
- health calculation;
- destructive action nonce/capability preservation by inspection.

Guilherme remains final QA for nuanced visual judgment in wp-admin and Elementor
editor interactions.
