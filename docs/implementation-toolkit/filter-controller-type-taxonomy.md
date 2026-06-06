# Filter Controller Type Taxonomy

Date: 2026-06-06

Task: `TASK-FC-063`

Status: taxonomy complete, implementation gated.

## Purpose

This document classifies Filter Controller filter ideas before implementation.
It exists because new visual ideas can look like "just one more type" while the
code may actually need only a variant, a subdomain module, or a shared setting.

The gate is DEC-EIT-014:

- no deep visual controls go into monolithic files;
- current types are not treated as final;
- proposed types must be classified before implementation.

## Source Basis

- Current registry: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/FilterTypeRegistry.php`
- Robustness synthesis: `docs/implementation-toolkit/filter-controller-robustness-synthesis.md`
- Cross-cutting audit: `docs/implementation-toolkit/filter-controller-robustness-cross-cutting.md`
- Per-type audits: `TASK-FC-034` through `TASK-FC-043`
- Modularization decision: `.agentic-ops/decisions/DEC-EIT-014.json`

## Classification Model

Every proposed filter idea must answer these questions in order:

1. Does it need a different value shape?
2. Does it need a different resolver contract?
3. Does it need different interaction state?
4. Does it need a different renderer anatomy?
5. Does it need a different Style tab family?
6. Can it be expressed as configuration on an existing type?
7. Can it be expressed as a shared module used by multiple types?

If the answer is only visual, it is not a new type by default. If the answer
changes value shape, source binding, resolver behavior, and interaction state,
it may be a real type.

## Current Supported Types

These are the only current registry-backed types.

| Type | Value shape | Style families | Source requirement | Product reading |
| --- | --- | --- | --- | --- |
| `search` | `text` | `field`, `search` | no | Free text search over visible/inferred text unless a future scoped-search contract is added. |
| `checkbox` | `multi` | `option`, `checkbox` | yes | Multi-select OR group for option values. |
| `radio` | `single` | `option`, `radio` | yes | Single-choice option filter with optional all/clear state. |
| `select` | `single` | `field`, `select` | yes | Native single select with placeholder/all option. |
| `chips` | `multi` | `option`, `chips` | yes | Visual multi-select option group with compact token anatomy. |
| `toggle` | `boolean` | `option`, `toggle` | yes | One-value boolean switch. Off means no filter is sent. |
| `range` | `range` | `field`, `range` | yes | Numeric min/max filtering. It is not price-specific. |
| `date` | `date_range` | `field`, `date` | yes | Native browser date range using `YYYY-MM-DD` values. |
| `swatch` | `multi` | `option`, `swatch` | yes | Visual option group for color/image/token-like values. |
| `rating` | `threshold` | `option`, `rating` | yes | Rating threshold filter, visually icon/text driven. |

## Current Type Variants

Variants stay inside the existing registry key. They can add settings, CSS
classes, renderer submodules, or style controls, but they do not create a new
`FilterTypeRegistry` entry.

| Parent type | Variant | Classification | Reason |
| --- | --- | --- | --- |
| `range` | Horizontal, vertical, compact, numeric-input-visible, numeric-input-hidden, ticks, value labels, handle icon/shape | Variant | Same `range` value shape and same min/max resolver behavior. |
| `range` | Single-bar dual-handle rail | Variant | Different anatomy, same min/max data contract. It may need a dedicated renderer/CSS subdomain, not a new type. |
| `range` | Numeric-only min/max fields | Variant | Same range value shape. The slider is optional presentation. |
| `range` | Histogram/availability distribution behind rail | Deferred variant or shared data module | It adds data visualization, not a new filter value shape. It needs availability/facet data before styling. |
| `date` | Single date, before, after, between | Variant | Same date field source, different compare mode and UI exposure. |
| `date` | Date presets such as today, this week, last month | Date configuration variant | Presets produce date bounds; they do not need a new type unless they introduce a custom calendar engine. |
| `select` | Enhanced/custom select | Deferred variant | Same single value shape, but custom popup state raises complexity. Native select remains default. |
| `select` | Multi-select dropdown | Future candidate, not current variant | It changes value shape from `single` to `multi` and needs custom interaction. Classify again before implementation. |
| `checkbox` | Inline, list, grid, count labels, custom indicator | Variant | Same multi-select option group. |
| `radio` | Segmented control, list, inline, all option | Variant | Same single-choice option group. |
| `chips` | Scroll row, grid, removable-looking chips, icon chips | Variant | Same multi-select option group. |
| `toggle` | Label left/right, state text, track/thumb shapes, icons | Variant | Same boolean value contract. |
| `swatch` | Color, image, fallback token, shape, label hidden/visible | Variant | Same option value contract. |
| `swatch` | Media swatch | Swatch variant first, future candidate only if media source/picker changes data contract | If media URL/id is just option visual metadata, keep it under Swatch. |
| `rating` | Text, icon-only, icon + text, threshold chips, custom icons | Variant | Same threshold resolver contract. |
| `search` | Icon, clear button, debounce, placeholder, scoped text | Configuration variant | Same text query shape unless scoped search changes resolver source behavior. |

## Future Type Candidate Backlog

These ideas are not approved for implementation. They are classified so future
tasks know what proof is required.

| Candidate | Classification now | Required proof before implementation |
| --- | --- | --- |
| `number` exact input | Deferred candidate | Prove it cannot be expressed as Range numeric-only or Search/scoped compare. Needs `number_exact` value shape and explicit compare behavior. |
| `text` exact or contains field | Deferred candidate | Prove it is distinct from Search plus field binding. Needs source-bound text compare semantics. |
| Multi-select dropdown | Future real type candidate | Needs custom interaction, multi value shape, keyboard contract, URL state, and resolver array semantics. |
| Taxonomy tree | Future real type candidate | Needs hierarchical option source, parent/child selection, indeterminate state, term counts, async behavior decision, and taxonomy resolver tests. |
| Autocomplete | Future real type candidate | Needs async or large-option source contract, keyboard selection, loading/empty states, and remote/local search boundary. |
| Date preset | Date variant | It emits date bounds. Keep inside Date unless it becomes a custom calendar UI. |
| Availability/status | Configuration pattern | Usually Radio, Checkbox, Toggle, or Select depending on value shape. Not a type until a distinct status state model is proven. |
| Geo/distance | Future real type candidate | Needs lat/lng source schema, distance calculation, units, radius UI, sorting interaction, and backend/runtime proof. |
| Boolean group | Shared configuration or future candidate | Multiple boolean keys can be Checkbox/Toggle group first. It becomes a real type only if it filters across several keys with AND/OR semantics. |
| Media swatch | Swatch variant first | Becomes future type only if media selection, library lookup, responsive preview, or value storage changes beyond visual metadata. |

## Shared Modules, Not Types

These are product surfaces that must not become filter types:

- layout width, row packing, row break, internal compact mode;
- dynamic tags, field binding, resolved key snapshots, source selection;
- compare mode and data type;
- option parser, option counts, empty option state;
- sort, sort source/key selection, sort style;
- pagination;
- active chips;
- reset/actions;
- result count;
- loading, empty, and motion states;
- editor compatibility fallback warning;
- preset save/load/import behavior;
- accessibility helpers shared by option groups.

If one of these needs code, create a shared-module task, not a filter-type task.

## Configuration-Only Ideas

These should be settings on existing types unless source evidence proves
otherwise:

- label text, placeholder text, helper text;
- icon choice, icon size, icon position;
- field source, key, dynamic tag binding, manual fallback key;
- compare mode, data type, case sensitivity;
- min/max/date bounds;
- option strings, option counts, option visuals;
- layout width percentage;
- alignment, gap, padding, border, radius, shadow, typography;
- active/hover/focus/disabled style values.

## Deferred Or Out Of Scope

These are not blocked forever, but they are outside the current execution phase:

- full custom select/dropdown engine;
- custom date calendar engine replacing native date inputs;
- taxonomy term CRUD or term manager inside the widget;
- geospatial/map filtering;
- server-side faceted counts for every option;
- analytics-driven availability histograms;
- conditional query-builder UI with nested AND/OR groups;
- WooCommerce-only filter concepts that would make the plugin less domain-neutral.

## Rule For Future Implementation Tasks

No future filter-type implementation task may start unless it includes:

1. A classification entry in this taxonomy.
2. A source-backed reason why the idea is a real type, variant, subdomain,
   shared module, configuration, or deferred/out-of-scope item.
3. A `FilterTypeRegistry` impact statement:
   - no registry change for variants/config/shared modules;
   - new registry key only for real types.
4. A value-shape contract.
5. A resolver/source/compare contract.
6. A renderer and CSS module plan under DEC-EIT-014 line budgets.
7. A Style tab cadence plan.
8. Preset save/load impact.
9. URL state impact.
10. Mechanical tests plus Guilherme-owned visual QA boundary.

If any of these are unknown, open an audit or design task first. Do not patch the
widget directly.
