# Elementor Implementation Toolkit 1.0

Status: approved product contract, implementation in progress
Authority: Guilherme, 2026-07-15
Baseline: plugin tag `v0.3.2` at commit `9123ce2`

## Product thesis

The Toolkit is a visual compiler for WordPress and Elementor systems:

`Executable Blueprint -> field contracts -> storage -> content entry -> collections and filters -> Elementor presentation -> policies -> diagnostics`

Its primary user is the no-code implementer. The implementer must be able to build a complete system without PHP, SQL, raw meta keys, CSS selectors or manual binding maps. The client's primary content workflow belongs on the frontend; wp-admin remains the control, diagnosis and recovery plane.

Complexity belongs in compiled contracts and diagnostics, not in the number of decisions exposed at once.

## Product invariants

1. Blueprint is the canonical and executable authority for system behavior.
2. CPT, CCT, WooCommerce and external sources are storage/runtime choices behind one entity contract, not separate products.
3. The compiler recommends CPT for public, editorial, versioned or routed content; CCT for non-routed, high-volume or operational records; and adapters for WooCommerce or external ownership. An advanced override must disclose impact.
4. Gutenberg is never accidental. It appears only for an explicitly selected Editorial or Hybrid entity mode.
5. Collection is the only normal query contract. Raw selectors and substring matching remain legacy-only during the 1.x compatibility window.
6. Entry Surface owns semantics, permissions, conditions and actions. Elementor owns layout, styling and responsive composition.
7. Elementor widgets connect contracts and context. They do not recreate schema, query logic or workflow configuration.
8. WooCommerce remains the owner of transactional price, stock, cart, order, checkout and payment behavior.
9. Published storage keys are immutable. Destructive changes require a migration plan, validation and rollback path.
10. Published Blueprint versions are immutable and reactivatable.
11. No map edit mutates runtime immediately. Every change follows `draft -> validate -> prepare impact plan -> confirm -> apply -> reconcile`.
12. Domain examples are private sufficiency fixtures, not distributed recipes or domain-specific Blueprint code.

## Explicit exclusions

The 1.0 core is not:

- a page builder or Theme Builder replacement;
- a generic metabox builder;
- a SQL, PHP or selector execution surface;
- a JetEngine or JetFormBuilder clone;
- a WooCommerce transaction engine;
- a collection of hard-coded real-estate, clinic, delivery or ecommerce templates.

## Canonical Blueprint

The public schema identifier is `eit.dev/v1 Blueprint`. Every node and field has a stable UUID, a version and a checksum. Visual position has no runtime meaning.

| Lane | Executable nodes | Compiled result |
| --- | --- | --- |
| Data | Entity, Field Group, Relation | CPT, CCT, Woo/external contracts and storage |
| Experience | Entry Surface, Collection, Filter Surface | CRUD, workflow, query, filters and facets |
| Presentation | Presentation, Route | Frontend templates and interfaces |
| Governance | Policy, Adapter | Capabilities, ownership, exposure and integrations |

Connections are typed. Invalid connections, cycles and orphan references block publication and identify the affected node. Auto-layout improves reading only; users may reposition nodes without changing behavior.

## Field Contract

Every field declares:

- stable field ID and public name;
- semantic type and value shape;
- validation and exposure rules;
- storage and index strategy;
- entry components;
- compatible Elementor value categories;
- search, filter and sort capabilities.

Initial primitives cover short and long text, rich text, integer, decimal, money, percentage, calculated values, boolean, single and multiple choice, date, time, datetime, schedule, availability, image, gallery, file, email, phone, URL, address, geopoint, taxonomy, relation and repeatable group.

Technical details remain progressively disclosed. Primary UI language explains purpose, placement, editor, Elementor effect, query cost and migration impact.

## Persistence and migration

Dedicated tables own Blueprint versions, compiled artifacts, runtime bindings, change sets, locks, executions, reconciliation, rollback, normalized relations and multivalue children.

Published field IDs are independent from labels, slugs and storage keys. A destructive storage change writes to a new column or key, copies and transforms data, validates count and checksum, switches only after validation, and retains the previous data until reconciliation. Any schema, SQL, transform or validation failure prevents publication.

Legacy options remain read-only migration inputs. Plugin activation installs infrastructure only and never migrates content automatically.

## Public boundaries

Administrative REST provides Blueprint CRUD and versioning, validation, impact planning, apply, reconcile, rollback, diagnostics and execution history.

Public or authenticated REST exposes two semantic operations:

- `CollectionQuery`: allowed filter IDs, sort, facets and pagination;
- `EntrySubmission`: surface ID, optional item ID, values keyed by Field ID and an idempotency key.

Collection responses contain only the allowed projection, rendered HTML, pagination, facets, applied state and request ID.

The versioned PHP SDK exposes:

- `FieldPrimitiveInterface`;
- `StorageAdapterInterface`;
- `CollectionProviderInterface`;
- `FormActionInterface`;
- `PresentationAdapterInterface`.

Code-registered extensions declare version, capabilities and health checks and appear in their Blueprint context. They do not create a raw-input advanced area.

## UX contract

The wp-admin navigation is `Systems`, `Runs`, `Diagnostics`, `Settings`. CPTs and CCTs do not create top-level Toolkit menus.

The Systems screen may use a focused graph canvas inside WordPress chrome. Other screens remain WordPress-native. The inspector always presents:

1. what the node does;
2. where it enters the flow;
3. compiled effect;
4. who can access it;
5. essential decisions;
6. collapsed technical details.

Node cards contain name, role, proven health and compiled output only. The map has an equivalent keyboard and screen-reader outline view. Preview means a real compiler impact preview, never a conceptual mock.

No primary step exposes more than five simultaneous decisions. Required QA states are empty, loading, partial, invalid connection, blocked publish, impact plan, migration, error, rollback, mobile and keyboard-only.

## Elementor and WooCommerce boundary

Elementor Free receives five connector widgets: Toolkit Field, Collection Surface, Filter Surface, Entry Surface and Action.

The optional Pro adapter adds typed dynamic tags for text, number, URL, image, gallery and color through one `TypedValueResolver`. Selection is context-compatible and uses stable IDs, never typed meta keys. Loop and Theme integrations use public hooks and managers behind compatibility canaries. Reading never creates templates or mutates post meta.

The Woo adapter exposes products, taxonomies, price, stock, image and gallery as Field Contracts and uses WooCommerce APIs for allowed reads and writes.

## Delivery waves

- V0.3.2: preserve and verify the legacy migration baseline.
- V0.4: trust, security, request discipline, truthful controls, accessibility and asset consolidation.
- V0.5: Blueprint schema, registries, compiler, versions, change sets, stable bindings and normalized structures.
- V0.6: executable map, native admin navigation, contextual inspector, accessible outline and real impact preview.
- V0.7: entity modes, Field Contracts, Entry Surfaces, policies, workflows, idempotency and controlled guest intake.
- V0.8: Collection providers, derived filters, facets, URL state, cache, legacy migration and Explain Why.
- V0.9: Elementor Free bridge, Pro tags and Woo adapter.
- RC 1.0: per-Blueprint migration, impact map, flight recorder, scenario runner, handoff notes, dogfood and distributable package.

Every wave uses a `codex/eit-*` branch, at most three functional commits, a focused verification record and a prepared PR payload. Publishing the branch, tag, PR or release remains an explicit external-action confirmation.

## Acceptance gates

Automation covers Composer validation, WPCS/PHPCS, PHPStan, PHPUnit with WordPress integration, JavaScript tests, Playwright, axe-core, syntax, line budget and Gitleaks. Compatibility targets WordPress 6.7-6.9, PHP 8.1-8.4, Elementor Free 3.28-4.x and private Pro canaries for current and previous versions.

Required safety cases include draft leakage, CSRF, XSS, ownership, guest escalation, uploads, webhook SSRF, request cost, rate limits, interrupted migrations and rollback. Required form cases include the string `"0"`, error-state preservation, conditions, steps, repeaters, relations, idempotency and external action failure.

The CCT performance fixture contains 10,000 records, uses indexed query plans, targets local p95 below 250 ms and permits no query/render N+1.

Private sufficiency fixtures are:

- real estate: public property, related agent, money, address, gallery, collection and filters;
- clinic: professionals, specialties, schedule and frontend editing, without sensitive clinical data;
- delivery: items, addition groups, availability and Woo bridge;
- ecommerce: Woo catalog, facets and dynamic presentation while transactions remain in Woo.

All four must use the same primitives without PHP, raw keys, selectors or domain-specific Blueprint behavior.

Human acceptance remains mandatory for visual judgment. Guilherme approves the map grammar, inspector density, Elementor experience, frontend forms/workspace, responsive behavior and final interaction in a real browser. A wave that depends on that judgment cannot be marked complete before approval.
