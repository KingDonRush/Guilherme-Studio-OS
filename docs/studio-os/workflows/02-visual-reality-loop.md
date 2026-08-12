# Visual Reality Loop

Status: normative workflow
Scope: design feedback, browser calibration, implementation diagnosis, and
human visual approval

This workflow owns implemented/runtime visual reality. Route-level imagegen
mockup production, version state, diagnosis resets and visual freeze are owned
by [`04-image-first-mockup-production.md`](./04-image-first-mockup-production.md).
Use this document for a mockup only when the issue is viewport/environment
calibration or when the approved image is being compared with implementation.

## Problem

Visual iteration fails when the human and the agent observe different rendered
realities but treat them as one.

Common causes include:

- different viewport dimensions;
- browser zoom;
- desktop UI reducing usable viewport height;
- WordPress admin bar;
- logged-in versus logged-out state;
- Firefox versus Chromium typography and layout differences;
- device pixel ratio;
- scrollbar presence;
- cached CSS or stale build output;
- forced WordPress/plugin admin notices above the target surface;
- screenshot scaling;
- full-screen mode;
- different fonts or font loading;
- responsive breakpoint changes;
- animation or delayed asset state.

The failure is not merely “the CSS is wrong.” The process is wrong if it edits
before establishing which reality is being measured.

## Sovereign Reality

For user-facing visual acceptance:

1. Guilherme's actual target browser and usage state are sovereign.
2. A controlled Playwright browser is a diagnostic instrument.
3. A design image is intent evidence, not runtime evidence.
4. Computed styles and geometry explain behavior but do not overrule human
   perception.
5. Final visual approval belongs to Guilherme.

The agent may challenge an observation when evidence indicates a different
cause, but it must reproduce the environment rather than dismiss the report.

## Collaborative Diagnosis

Visual feedback is not a command queue. Treat Guilherme's comments as raw
design intent that must be translated before action.

For each meaningful correction, separate:

- literal request;
- observed symptom;
- desired relationship or feeling;
- invariant that must remain protected;
- likely deeper cause;
- recommended correction;
- literal interpretation to avoid.

Example:

```text
Literal request: change the shadows.
Symptom: the page feels flooded by shadows.
Intent: preserve the bordered Mina Forma structure without making every section
feel like a floating object.
Invariant: left/right rails and section borders remain mandatory.
Cause: shadow is being applied as a global style instead of a hierarchy budget.
Correction: reserve shadow for one or two object groups; keep structural
sections flat.
Avoid: generating another version where every container receives a softer
shadow.
```

Guilherme has final approval, but the agent must still diagnose, recommend and
challenge. Do not turn approved invariants into blind obedience. When a literal
instruction would damage hierarchy, UX, Elementor feasibility, or an approved
visual language, explain the conflict and propose the smallest coherent
alternative before generating or editing.

When iteration starts to feel automatic, stop the visual-production loop and
name the abstraction failure. The next output should be a diagnosis or revised
direction contract, not another image.

## Design Mockup Viewport Contract

When the work is image-first design rather than implemented CSS, define the
intended viewport before generating or approving a page mockup. This is required
for home pages, landing pages, and any route whose first section acts as a hero.

Record:

```yaml
target_viewport_width:
target_viewport_height:
header_height_range:
usable_first_viewport_height:
hero_height_ceiling:
required_first_viewport_information:
hero_image_aspect_ratio:
hero_image_max_height:
next_section_start_y:
allowed_scroll_for_primary_information:
pixel_coordinate_space:
pixel_box_map:
```

The complete page mockup remains the normal deliverable. Do not fragment the
generation merely because a hero is hard to proportion. Instead, constrain the
full-page prompt with this contract and reject any output where the hero becomes
a poster, relies on excessive padding, overflows the first viewport, or pushes
essential information below the fold.

When scale or fold behavior is the reported failure, include a pixel box map in
the prompt. The map should define the conceptual canvas and the expected boxes
for the header, hero, text column, primary image slot, CTA/icon row, and
next-section start. Generated bitmap dimensions may differ; review by scaling
the boxes proportionally to the actual output.

## Image Assetization Contract

After Guilherme approves an image-first Elementor mockup, assetization is a
separate production phase. The approved mockup is the visual contract, not a
default source sheet to crop.

Before generating assets, inventory every visible thing Elementor/WordPress does
not already provide as finished content:

- photography and scene images;
- generated icons and pictograms;
- generated shapes, decorative marks and visual forms;
- textures, material fields, blueprint fragments and custom line-art;
- other raster visuals needed for the approved direction.

Generate each listed asset as its own imagegen target. Do not make one packed
image containing several assets and crop it afterward. Do not crop the approved
full-page mockup into production assets unless Guilherme explicitly asks for
extraction or the artifact is an approved pixel fragment whose exact edges and
shadows must be preserved.

Generated transparent icons, shapes and decorative forms use chroma-key
generation first, then local alpha extraction, trim validation and WebP/PNG
promotion. Code is allowed for post-processing and validation, not as a
substitute for the requested visual generation.

## Observation Record

Before editing, capture:

```yaml
route:
observed_at:
observer:
browser:
browser_version:
operating_system:
window_outer_width:
window_outer_height:
viewport_inner_width:
viewport_inner_height:
device_pixel_ratio:
page_zoom:
full_screen:
logged_in:
wordpress_admin_bar:
wordpress_admin_notices:
scrollbar:
responsive_breakpoint:
font_status:
cache_state:
screenshot_path:
reported_problem:
```

When a value cannot be measured, mark it unknown. Do not silently assume the
Playwright default.

## Workflow

### Step 1: Normalize the feedback

Convert oral or informal feedback into:

- affected route and region;
- observed symptom;
- intended relationship;
- acceptance statement;
- uncertainty.
- protected invariants from previous approvals;
- the agent's recommended correction, especially when it differs from the
  literal wording.

Example:

```text
Symptom: the right-side cards sit lower in Guilherme's browser.
Intent: their top edge should align with the main screenshot region.
Unknown: whether the difference comes from viewport height, admin bar, or CSS.
```

Do not convert “looks cramped” directly into an arbitrary margin change.
Do not convert “change shadows” directly into a global shadow restyle.

### Step 2: Preserve the observation

Store or reference:

- user screenshot;
- design reference if applicable;
- current implementation screenshot;
- current route and environment.

No implementation change occurs yet.

### Step 3: Calibrate environments

Reproduce the user's:

- viewport, not merely monitor resolution;
- zoom level;
- login state;
- admin bar;
- browser family when material;
- font loading;
- route and content;
- full-screen state.

Record both outer window and inner viewport. `1920x1080` monitor resolution is
not equivalent to a `1920x1080` CSS viewport.

### Step 4: Measure causal facts

Inspect only facts relevant to the symptom:

- bounding rectangles;
- computed grid/flex tracks;
- container widths and heights;
- overflow;
- line count and text width;
- font family, size, line height, and loaded face;
- viewport units;
- media query match;
- transforms;
- fixed/admin offsets;
- screenshot bitmap dimensions.

Create a small comparison table:

| Fact | User-like environment | Agent baseline | Difference |
|---|---:|---:|---:|
| viewport height | 948 | 1080 | -132 |
| admin bar | 32 | 0 | +32 offset |
| heading lines | 2 | 1 | layout impact |

### Step 5: Form competing hypotheses

List at least the plausible causes, ordered by evidence:

```text
H1: usable viewport is shorter because of browser chrome and admin bar.
H2: heading width differs because the font failed to load.
H3: a fixed `vh` section ignores an internal content minimum.
```

Do not present confidence theater. State observations, inferences, and unknowns.

### Step 6: Run the smallest discriminating check

Examples:

- set Playwright viewport to the observed inner dimensions;
- toggle admin bar visibility;
- wait for `document.fonts.ready`;
- compare computed font;
- disable one suspect rule temporarily in DevTools;
- inspect the exact breakpoint match.

The check should distinguish hypotheses without creating a permanent edit.

### Step 7: Choose the correction layer

Apply the fix at the layer that owns the cause:

- browser-state mismatch: calibration, not CSS;
- component layout issue: component CSS;
- repeated token issue: design token;
- content density issue: information architecture or copy;
- asset proportion issue: asset treatment;
- WordPress admin-only issue: authenticated-state rule;
- environment cache issue: build/deployment process.

Do not compensate for a wrong screenshot environment by degrading production
layout.

### Step 8: Implement narrowly

Before edit, state:

- cause being addressed;
- files and selectors involved;
- behavior that must remain;
- expected effect at calibrated viewport;
- responsive risks.

Prefer one causal correction over a series of offsets.

### Step 9: Verify in a viewport matrix

Minimum matrix for portfolio and case pages:

- Guilherme's observed inner viewport;
- 1920x1080 monitor-equivalent browser viewport as actually available;
- a common laptop viewport;
- mobile;
- logged-in WordPress state when relevant;
- logged-out public state.

For each:

- no overlap;
- no inaccessible content;
- correct hierarchy;
- stable target alignment;
- intentional scroll behavior;
- fonts and assets loaded.

### Step 10: Compare like with like

Screenshots used for comparison must share:

- viewport;
- zoom;
- login/admin state;
- browser family when possible;
- route/content;
- capture method;
- animation state.

Label captures with those properties. Do not compare a full-screen screenshot
to a normal browser window and call the difference a CSS regression.

### Step 11: Human approval

Present:

- the corrected capture in the target state;
- the causal explanation;
- any known cross-browser residual difference.

Design completion requires Guilherme's approval. Automated screenshot similarity
alone cannot close the task.

### Step 12: Learn at the right abstraction

A problem becomes a reusable rule only when it reveals a general failure mode.

Good learning:

> Always record inner viewport, zoom, login state, admin bar, and browser family
> before diagnosing a visual mismatch.

Bad learning:

> Set the right column top margin to 17px.

The system may add:

- a calibration checklist;
- a Playwright browser profile;
- a visual fixture;
- a quality gate;
- an environment-capture helper;
- a decision record.

## 100vh Policy

`100vh` is not accepted as a visual requirement without defining:

- which viewport unit (`vh`, `svh`, `dvh`, `lvh`);
- browser chrome behavior;
- WordPress admin bar state;
- minimum content height;
- overflow strategy;
- desktop and mobile intent.

For a true single-screen desktop composition:

- use the calibrated available viewport;
- reserve explicit header/admin offsets;
- account for forced WordPress/plugin admin notices before implementation;
- prevent essential content from being clipped;
- allow responsive recomposition rather than proportional shrinking;
- test at the actual target inner height.

For WordPress admin surfaces that are intended to behave like a single-screen
tool:

- the surface owns the available `wpbody-content` height and should target the
  calibrated equivalent of `100vh` after admin chrome offsets;
- global WordPress/plugin notices must not push the main composition downward;
- screen-specific notice containment is allowed, but global notice suppression
  outside the current screen is not;
- if notices matter for the current task, expose them as a compact collapsed
  notice area, status chip, or diagnostics link instead of an always-open block;
- validation must include a logged-in admin capture where plugin/core notices
  would normally appear.

## Screenshot Evidence Naming

Suggested:

```text
<route>__<browser>__<width>x<height>__zoom-<n>__<auth-state>__<timestamp>.png
```

Example:

```text
simple-budget-case__firefox__1920x948__zoom-100__wp-auth__20260614T1530.png
```

## Stop Conditions

Stop implementation and diagnose when:

- user and agent screenshots disagree materially;
- the target viewport is unknown;
- a CSS edit fixes one capture but worsens the calibrated environment;
- the same region receives repeated arbitrary spacing changes;
- browser state or font load is unverified;
- a requested composition cannot fit without clipping at the target dimensions.

Stopping means changing from edit mode to evidence mode, not abandoning the
task.

## Acceptance Criteria

- The user-observed environment is recorded.
- The cause is stated separately from the symptom.
- The correction is verified at the sovereign viewport and a responsive matrix.
- Before and after evidence is comparable.
- No arbitrary “looks right here” offset is promoted without causal support.
- Human visual approval is recorded.
- Reusable learning is abstract enough to prevent recurrence without freezing
  one design.
