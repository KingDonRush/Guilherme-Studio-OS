# Filter Controller Robustness Synthesis

Date: 2026-06-05

Task: `TASK-FC-044`
Subplan: `SUBPLAN-FC-ROBUSTNESS-AUDIT`

Status: synthesis complete, implementation not started.

## Core Diagnosis

Guilherme's concern is correct: the main product risk is not missing concept. It
is the code contract behind the concept.

The Filter Controller already has promising architecture:

- saved presets;
- local widget control;
- per-filter layout width;
- dynamic binding capture;
- separated sort controls;
- frontend REST filtering;
- Elementor editor fallback warning;
- richer Range controls than before.

But the product is not yet robust because several contracts are incomplete:

- field binding is not deterministic enough;
- CPT fields are not first-class Elementor dynamic tag sources;
- style cadence is not granular enough by filter type;
- visual containment is not guaranteed for every filter anatomy;
- resolver semantics are weaker than the preset schema;
- several filters share generic option styling that hides their real component
  identity;
- sort is structurally separate in Content but not yet mature as its own module.

## Priority Order

### 1. Field Source Contract

Before polishing every filter, the widget needs a durable answer to "what field
does this filter control?"

Recommended implementation tasks:

- Create a field binding resolver layer.
- Save raw dynamic binding plus normalized resolved key.
- Register Toolkit CPT/meta/taxonomy fields as Elementor dynamic tag sources.
- Align preset schema, render data attributes, REST payload, and resolver source
  handling.

Reason: visual polish is wasted if the filter cannot reliably know which field
it filters.

### 2. Visual Containment Contract

Every filter type must be able to live inside its assigned layout width without
escaping the page or Elementor canvas.

Recommended implementation tasks:

- Add all-filter CSS containment pass.
- Add Range compact behavior for narrow spans.
- Add width/row packing tests.
- Include Sort and Actions in layout policy.

Reason: this is the source of the "beautiful but broken" fear.

### 3. Type-Specific Style Cadence

The Elementor Style tab should only show controls for filter types that exist in
Content. The current grouping is too broad.

Recommended implementation tasks:

- Replace broad style-cadence flags with per-type flags or a type registry.
- Keep compatibility fallback warning when Elementor does not refresh the panel.
- Separate Search, Select, Date, Checkbox, Radio, Chips, Toggle, Swatch, Range,
  Rating, Sort, Actions, and Active Chips as distinct style families.

Reason: this makes the widget feel intimate with Elementor instead of heavy.

### 4. Per-Filter Visual Depth

After the shared contracts are stable, each filter type gets a polish slice.

Recommended order:

1. Range containment and variants.
2. Rating stars/icons and threshold clarity.
3. Checkbox/radio indicators and clear behavior.
4. Chips and active-chip distinction.
5. Toggle boolean model.
6. Swatch visual controls.
7. Search icon/clear/debounce.
8. Select arrow/all/placeholder.
9. Date quick ranges and labels.
10. Sort module layout/style/key selection.

Reason: this order fixes the highest product risks while still covering every
filter type.

## Recommended First Implementation Slice

The next implementation slice should be:

> Build a Filter Controller type registry and field-source contract foundation.

Scope:

- define per-type anatomy metadata;
- define which style sections each type activates;
- define which source/key settings each type needs;
- expose normalized field key in saved presets;
- keep existing preset compatibility;
- do not redesign all visuals in the same slice.

This slice unlocks:

- precise Style tab cadence;
- safer dynamic tag persistence;
- better tests;
- per-filter visual work without duplicate condition logic.

## Test Backlog

Agentic Ops test artifacts created for this synthesis:

- `TEST-FC-ROBUSTNESS-001`: style cadence per type;
- `TEST-FC-ROBUSTNESS-002`: visual containment and width packing;
- `TEST-FC-ROBUSTNESS-003`: dynamic binding and preset round-trip;
- `TEST-FC-ROBUSTNESS-004`: Toolkit CPT fields as dynamic tag sources;
- `TEST-FC-ROBUSTNESS-005`: resolver field semantics;
- `TEST-FC-ROBUSTNESS-006`: Range variants;
- `TEST-FC-ROBUSTNESS-007`: option-filter visual matrix;
- `TEST-FC-ROBUSTNESS-008`: Rating icons and threshold semantics;
- `TEST-FC-ROBUSTNESS-009`: Sort module;
- `TEST-FC-ROBUSTNESS-010`: Elementor fallback warning and version-drift guard.

## QA Ownership

Codex should run:

- schema validation;
- PHP lint;
- JS syntax checks;
- resolver unit-like fixtures when available;
- static CSS overflow review;
- simple browser smoke checks.

Guilherme should validate:

- Elementor panel flow across many interactions;
- whether Style controls feel correctly cadenced;
- visual hierarchy and polish;
- motion and editor responsiveness;
- whether each filter feels like its own component, not a generic pill.

## Explicit Rejection

Do not implement another Range-only or Rating-only fix from this point unless the
task states why the shared contracts are unaffected. The product problem is now
defined as a full Filter Controller robustness problem.

## Completion Decision

`TASK-FC-044` is complete. The audit phase has enough evidence to create the
next implementation phase and execute the new pending tests after fixes land.
