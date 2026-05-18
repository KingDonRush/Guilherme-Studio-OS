# Admin V0.2 Source Contract

This file locks the source hierarchy for the Elementor Implementation Toolkit
Admin V0.2 implementation before plugin code work starts.

It supports `TASK-004` in the Agentic Ops overlay.

## Source Hierarchy

Use sources in this order:

1. `docs/implementation-toolkit/admin-v0.2-source-of-truth.md`
2. `docs/assets/implementation-toolkit/admin-v0.2/frames/`
3. `docs/assets/implementation-toolkit/admin-v0.2/icons/canonical-icon-manifest.json`
4. `docs/implementation-toolkit/admin-v0.2-frame-implementation-plan.md`
5. existing QA reports under `docs/assets/implementation-toolkit/admin-v0.2/qa/`

The source-of-truth document wins when generated frames disagree. The frame
implementation plan is reasoning support, not the execution structure.

## Primary Frames

These frames define the first build target and must be covered by visual QA:

| Frame | State | Implementation Gate |
| --- | --- | --- |
| `frame-20` | Filter Preset Root Overview | root object, five layer bands, root inspector |
| `frame-19` | Provider Contract Selected | DOM provider, detected targets, manual selector, provider inspector |
| `frame-18` | Price Range Module Selected | expanded modules, selected Price Range, inherited/override badges |
| `frame-17` | Controller Output Behavior Selected | output contract, runtime flow, URL state inspector |
| `frame-16` | Filter Controller Preview Modal | controller-only modal, no listing/grid |
| `frame-24` | Filter Preset Object Map | ownership/inheritance/override graph |
| `frame-23` | Provider Contract Builder | step-based contract builder, identity resolver selected |
| `frame-22` | Filter Module Schema Price Range | parent context, inherited versus override sections |
| `frame-21` | Output Behavior Runtime Surface | runtime flow and state machine as admin contract |
| `frame-26` | Filter Architecture With Contextual Preview | architecture bands plus controller-only preview |
| `frame-27` | Visual Filter Architecture Builder | Source, Query Contract, Filter Layer, Target Listing, Runtime columns |

No primary frame is a standalone product. They are states of the same Filter
Preset admin architecture.

## Secondary Frames

These frames are future backlog after the Filter Preset slice passes QA:

- `frame-11` through `frame-15`: CPT Manager states.
- `frame-01` through `frame-10`: Integrations / Superpowers states.

They must not be mixed into `TASK-005`, `TASK-006`, or `TASK-007`.

## Non-Screen Frames

- `frame-25`: reference-only coverage board. Do not implement as a screen.
- `frame-28`: interaction reference for preset-library and module-drawer
  behavior. Do not adopt its standalone shell as the default admin shell.

## Icon Contract

The first implementation slice uses only canonical WebP icons from:

`wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/images/icons/`

The canonical manifest currently declares:

- `58` canonical icons;
- all `58` entries marked as existing;
- all manifest paths present in this workspace.

Do not generate new icons during the first implementation slice. Resolve new
frame concepts through this fallback order:

1. canonical icon alias;
2. CSS badge;
3. CSS glyph;
4. connector line;
5. text label;
6. no asset.

## Visual QA Contract

Every implemented primary frame state must produce evidence under:

`docs/assets/implementation-toolkit/admin-v0.2/qa/<task-id>/`

Minimum evidence per closed visual task:

- source frame reference;
- desktop screenshot;
- mobile or tablet screenshot when responsive behavior is in scope;
- modal screenshot when modal behavior is in scope;
- browser console result;
- frame-drift notes.

Lint or PHP syntax checks alone do not close visual tasks.

## Runtime Boundary

Admin V0.2 can render contracts, previews, diagrams, and saved configuration.
It must not implement or claim these in the first slice:

- frontend filtering runtime;
- listing/grid renderer;
- Elementor editor detection;
- deep WooCommerce adapter;
- Simple Budget runtime bridge;
- CPT registration runtime changes;
- frontend design token export;
- full Style/Advanced editor.

## Implementation Start Gate

`TASK-005` can start only after:

- this contract exists;
- Agentic Ops decisions for shell, icons, runtime, preview, frame
  classification, and QA are valid;
- Agentic Ops visual tests for all primary frames are valid;
- `TASK-004` is marked done with verification evidence.
