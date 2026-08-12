# Image-First Mockup Production

Status: normative workflow
Scope: route-level mockup direction, imagegen iteration, visual approval,
version state, freeze, assetization and Elementor handoff

## Purpose

Produce strong full-page mockups without turning visual feedback into an
unbounded sequence of image generations.

This workflow owns design-image production. Browser/runtime mismatch and
implemented-page calibration remain owned by
[`02-visual-reality-loop.md`](./02-visual-reality-loop.md).

## Core model

A mockup run is not a linear list of `v1`, `v2`, `v3`. It is a state machine
with explicit authorities.

```text
DISCOVERY
  -> CONTRACT
  -> STRUCTURE
  -> ART_DIRECTION
  -> CANDIDATE
  -> CORRECTION
  -> APPROVED
  -> ASSETIZATION
  -> HANDOFF
```

`DIAGNOSIS_RESET` is a legal transition from `CANDIDATE` or `CORRECTION` back
to `CONTRACT`, `STRUCTURE` or `ART_DIRECTION`.

The following transitions are forbidden:

- `DISCOVERY -> imagegen` without a contract;
- `CORRECTION -> full redesign` without declaring a reset;
- `CANDIDATE -> ASSETIZATION` without approval;
- `APPROVED -> regeneration` without explicit scope from Guilherme;
- `APPROVED -> implementation` when the asset boundary or Elementor map is
  unknown.

## Authorities

Every run must distinguish these roles when they differ:

```yaml
content_authority:
geometry_authority:
visual_language_authority:
photography_authority:
implementation_authority:
```

One image must not silently become authority for every layer.

Example:

```yaml
content_authority: services-v18
geometry_authority: services-v18
visual_language_authority: services-v22
photography_authority: home-v2-cta-crop
implementation_authority: services-elementor-map
```

## State 1: Discovery

Read the smallest useful evidence set:

- route job and audience;
- sibling approved mocks;
- brand/art-direction guide;
- shared Theme Builder surfaces;
- current copy/navigation contract;
- relevant real assets;
- implementation constraints;
- prior rejected directions for the route.

Record the conflict that makes the route distinct from its siblings. For an
internal page, explicitly state what must not repeat from the Home.

Do not generate yet.

## State 2: Direction contract

Create a route contract before imagegen:

```yaml
route:
page_job:
audience_moment:
memorable_truth:
primary_action:
first_three_eye_stops:
sibling_relationship:
anti_pattern:
section_map:
content_budget:
primary_evidence:
elementor_map:
border_contract:
shadow_budget:
texture_budget:
image_density:
cta_emphasis:
locked_text:
prohibited_content:
```

The contract is a decision artifact. Do not bury it inside a prompt.

### Feedback translation

For every meaningful user correction, record internally:

```text
LITERAL REQUEST:
OBSERVED SYMPTOM:
DESIRED RELATIONSHIP:
PROTECTED INVARIANTS:
LIKELY CAUSE:
OWNING LAYER:
RECOMMENDED CORRECTION:
DO NOT INTERPRET AS:
```

`OWNING LAYER` must be one of:

- strategy;
- information hierarchy;
- geometry;
- visual system;
- photography/materiality;
- copy;
- Elementor implementation;
- browser/runtime.

If the owner is browser/runtime, leave this workflow and use the Visual Reality
Loop.

## State 3: Geometry contract

Create a geometry contract for any fragile first viewport or repeated region.

```yaml
canvas_width:
canvas_height:
target_viewport_width:
target_viewport_height:
header_box:
intro_or_hero_box:
first_content_box:
next_section_start_y:
fixed_height_regions:
image_max_boxes:
content_that_must_not_grow_parent:
responsive_recomposition:
```

Geometry is an authority, not a suggestion. When the model does not respect it:

1. reject the bitmap internally;
2. retry once with the geometry authority visible;
3. if it fails again, use a section study or deterministic composition check;
4. do not show repeated geometry failures as new creative versions.

## State 4: Structure

Decide page architecture before material styling.

The structure pass owns:

- hero archetype or absence of hero;
- section sequence;
- dominant and supporting regions;
- repeated-item orientation;
- main grid and rails;
- first-fold distribution;
- dense/quiet rhythm.

It does not own:

- final shadows;
- photo color treatment;
- decorative marks;
- microcopy polish;
- asset extraction.

Reject a structure that only works because imagegen granted it excessive
height, invented copy or fragile overlaps.

## State 5: Art direction

Once structure passes, define the visual system:

- typography hierarchy;
- border ownership;
- shadow ownership;
- palette roles;
- material and texture ownership;
- photo treatment;
- repetition and variation rules;
- one deliberate visual risk.

### Treatment budgets

Every flood-prone treatment must have an owner and maximum presence.

Example:

```yaml
border_contract:
  mandatory: outer rails, section separators
  optional: evidence groups
  forbidden: decorative frames around every text group
shadow_budget:
  lifted_groups_max: 1
  flat_groups: header, intro, rails, process, footer
image_density:
  strong_images_per_viewport_max: 2
```

Do not answer “too much shadow” with a softer shadow everywhere.

## State 6: Candidate generation

Full-page remains the default approval unit.

Before each imagegen call, declare:

```text
STATE:
PARENT:
CHANGE:
PRESERVE:
AUTHORITIES:
GEOMETRY:
TEXT CONTRACT:
ELEMENTOR INTENT:
CONSTRAINTS:
SUCCESS TEST:
```

### Variable isolation

One external candidate should change one dominant layer:

- structure; or
- visual system; or
- photography/materiality; or
- geometry correction.

Do not ask one generation to redesign structure, fix copy, tune shadows and
replace imagery simultaneously.

### Reference escalation

When feedback contains relational language such as:

- “igual àquela seção”;
- “o mesmo efeito”;
- “mais parecido com a referência”;
- “a composição daquela parte”;

the agent must locate and load the exact image/crop before generating. A verbal
summary is insufficient after the first mismatch.

## Section-study rule

Section study is allowed when:

- the same region fails twice;
- a specific visual relationship cannot be resolved in the full-page image;
- proportion or material treatment is the only unresolved layer;
- the study will be synthesized back into the full-page candidate.

Section study is not approval for a disconnected set of sections. It must have:

- a named parent full-page candidate;
- a single hypothesis;
- a synthesis plan;
- an expiration state after integration or rejection.

## Version budget and stop conditions

### External budget

- maximum 1 user-facing candidate per state;
- maximum 2 user-facing corrections to the same region;
- maximum 3 user-facing candidates without a diagnosis reset.

Internal rejected outputs do not consume Guilherme's attention, but they must
stay inside the run folder and retain status.

### Mandatory diagnosis reset

Stop image production when any occurs:

- the same region receives a second correction;
- feedback oscillates between two treatments;
- the requested change keeps reopening unrelated sections;
- the model fails the same geometry twice;
- the agent cannot identify the owning layer;
- a reference is described but not visible;
- the agent is about to produce `vN+1` without a new hypothesis.

Reset means:

1. state the symptom;
2. identify the abstraction failure;
3. list protected invariants;
4. choose the new authority;
5. decide whether to return to structure, art direction or geometry;
6. only then generate.

## Internal review gate

Inspect the saved bitmap, not the prompt.

Reject when:

- route job is unclear;
- the page copies a sibling's composition without purpose;
- hierarchy has multiple equal focal points;
- geometry violates the contract;
- a fixed-height region grew because of an image;
- text or navigation drifted;
- a correction changed unrelated approved regions;
- Elementor mapping requires brittle overlap;
- treatment budgets are exceeded;
- the output is merely plausible rather than project-specific.

Record pass/fail for:

```yaml
intent:
hierarchy:
geometry:
text:
visual_system:
reference_fidelity:
elementor_feasibility:
scope_fidelity:
```

## Approval and freeze

When Guilherme approves:

1. stop generation immediately;
2. copy the exact selected file to the route `approved/` folder;
3. create or update the canonical route filename;
4. record SHA-256, dimensions and approval date;
5. mark the visual contract `locked`;
6. update the project asset map;
7. record the Elementor handoff constraints;
8. preserve compatibility aliases only when existing docs or links need them.

Approval freezes pixels, hierarchy, composition and treatment. File movement or
format promotion must remain byte-identical unless an explicit conversion is
required and verified.

## Assetization

Assetization is a new state, not another mockup correction.

Inventory:

- native Elementor/WordPress surfaces;
- editable copy and navigation;
- CSS/container treatments;
- existing reusable assets;
- new raster assets;
- true screenshots or factual UI.

Generate one raster output per asset. The approved full-page mockup is the
visual contract, not the default crop source.

## Handoff

The route handoff must contain:

- approved mockup path and checksum;
- section order;
- geometry/fixed-height rules;
- Elementor container/grid map;
- widget ownership;
- editable text ownership;
- asset list and crop behavior;
- responsive recomposition;
- forbidden shortcuts;
- remaining unknowns.

## Storage contract

Each route owns its workspace:

```text
assets/mockups/routes/<route>/
├── manifest.yaml
├── 00-contract/
│   ├── direction-contract.md
│   └── geometry.yaml
├── 01-runs/
│   └── <date>__<hypothesis>/
│       ├── run.yaml
│       ├── prompt.md
│       ├── references/
│       └── outputs/
├── 02-approved/
│   ├── <route>__desktop__approved.png
│   └── freeze.yaml
└── 03-handoff/
    └── elementor.md
```

Do not store numbered experiments loose in `assets/mockups/`.

### Naming

Use hypothesis and state, not only sequence:

```text
<route>__<hypothesis>__candidate-01.png
<route>__<hypothesis>__rejected-02.png
<route>__desktop__approved.png
```

The manifest may retain a legacy `vN` alias for historical traceability.

## Minimal run manifest

```yaml
id:
route:
state:
hypothesis:
parent:
authorities:
change:
preserve:
success_test:
outputs:
review:
decision:
created_at:
```

## Acceptance criteria

- Contract exists before generation.
- Owning layer is named for each correction.
- Authorities are explicit.
- Geometry is measured where fragile.
- Version budget is respected.
- Repeated feedback triggers diagnosis reset.
- User sees selected candidates, not process debris.
- Approved bitmap is frozen and checksummed.
- Mockups live inside the route workspace.
- Assetization and implementation begin only after approval.
