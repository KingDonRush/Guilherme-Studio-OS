# Codex Operating Preconizations For Elementor Implementation Toolkit

Date: 2026-07-02

Status: operational memory for future Codex implementation sessions.

This document is not a backlog, not a PRD by itself, and not approval to
implement every idea below.

It is a project-specific operating preconization for Codex inside Guilherme
Studio OS. Its purpose is to let Guilherme return later with a broad request
such as:

> olha os arquivos do implementation toolkit e comeca a implementar as
> alteracoes

and have Codex continue from the real product direction instead of restarting
from loose chat memory.

## Current Product Reading

The Elementor Implementation Toolkit is an infrastructure product for
implementation work, not a generic widget pack.

The current product shape is:

- Filter Controller is widget-first.
- WordPress admin is a library, preview, diagnostics and recovery surface.
- Elementor remains the main visual composition surface.
- The plugin has CCT table-backed content structures, CPT manager, Dynamic Tags,
  REST endpoints, provider diagnostics and Elementor integration.
- The product should improve implementation confidence, repeatability and
  portfolio evidence without becoming a second builder.

Useful current sources:

- `products/elementor-implementation-toolkit/repository/readme.md`
- `docs/implementation-toolkit/filter-controller-widget-first-direction.md`
- `docs/implementation-toolkit/filter-controller-kanban.md`
- `docs/implementation-toolkit/filter-controller-type-taxonomy.md`
- `docs/implementation-toolkit/filter-controller-robustness-synthesis.md`
- `docs/implementation-toolkit/filter-controller-preset-contract-inventory.md`
- `docs/implementation-toolkit/productization-gap-audit-2026-07-02.md`
- `docs/studio-os/legacy-ai-brain/memory/decisions.md`

## Codex Entry Rule

When Guilherme asks Codex to continue, expand, implement, organize, mature or
reopen the Elementor Implementation Toolkit direction, Codex should first:

1. Check Git status in the Studio OS root.
2. Check Git status in
   `products/elementor-implementation-toolkit/repository`.
3. Read this file.
4. Read the smallest relevant current source files listed above.
5. Classify whether the request is:
   - product direction;
   - planning/documentation;
   - one implementation slice;
   - stabilization/refactor;
   - visual/editor QA;
   - release/public evidence.
6. Convert the request into one focused next slice.

Codex must not treat the latent ideas below as a single implementation batch.

## Non-Negotiable Product Boundaries

Preserve these unless Guilherme explicitly creates a new decision:

- Do not turn wp-admin into a standalone SaaS shell or second builder.
- Do not make Elementor Pro or Pro Elements a public product dependency.
- Do not replace the parasitic DOM-provider direction with a full query-provider
  engine unless the task explicitly changes the product strategy.
- Do not claim JetSmartFilters, JetEngine, WooCommerce or Simple Budget deep
  adapter support before runtime evidence exists.
- Do not add feature work into large files without respecting the line-budget
  policy and existing modularization direction.
- Do not silently mutate shared presets from a widget.
- Do not weaken capability, nonce, sanitization or escaping controls.
- Do not let generated admin screens override WordPress-native admin fit.
- Do not call mechanical implementation visually finished before Guilherme QA
  when the behavior depends on editor feel, interaction or visual judgment.

## Current Implementation Bias

Favor implementation slices that improve confidence, diagnosis and finish quality
before adding large new visual surfaces.

The safest strategic sequence is:

1. Toolkit-owned professionalization baseline.
2. Field Contract Wizard.
3. Explain Why This Item Passed Or Failed.
4. Implementer Flight Recorder.
5. Preset Impact Map.
6. Visual Recipes.

This order matters because the product risk is not lack of concept. The product
risk is losing trust when a filter looks correct but cannot explain what field,
selector, item data, preset state or runtime path it is using.

## Obvious Professionalization Debt Before Expansion

This section corrects an important bias: Codex must not treat every deeper
Elementor or JetEngine-shaped concern as an oversized integration project.

Some gaps are not "future ambition". They are finish-quality debt in surfaces
the Toolkit already owns.

Before building large adapters, Codex should audit and improve these obvious
professionalization areas:

### 1. CPT Media Fields Must Feel Native

Current risk:

- CPT meta field types can expose image and gallery fields as URL entry.
- CCT item editing already has a better pattern: image/gallery values use a
  media selector and attachment IDs.

Operating preconization:

- Treat URL-only image/gallery fields in Toolkit-managed CPTs as a product
  quality gap, not as an acceptable final state.
- Prefer WordPress media selector controls for CPT image/gallery fields.
- Store media as attachment IDs when the field semantics are image/gallery.
- Keep URL as a separate field type for external URLs.
- Preserve compatibility for existing URL-backed CPT media fields with an
  explicit migration or fallback plan.

Acceptance shape:

- Select media, clear media and preview selected media from the CPT item editor.
- Dynamic tags and REST output can resolve the attachment into the shape the
  consuming Elementor control expects.
- No existing saved URL value is destroyed silently.

### 2. CPT Editing Should Have A Structured Item Mode

Current risk:

- Toolkit-managed CPTs can default to Gutenberg/block-editor editing through
  `show_in_rest` plus editor support.
- For structured Elementor-driven content, this can make the item editing
  experience feel unprofessional: the client sees a page editor when the product
  is really asking for structured data.

Operating preconization:

- Add or document a structured CPT editing mode before treating CPT manager as
  mature.
- The mode can be meta-box-centered, data-only, or "legacy-feeling" without
  literally depending on the Classic Editor plugin.
- Gutenberg/editor support should be an intentional choice, not accidental
  friction.
- Default presets should distinguish between content CPTs and structured data
  CPTs.

Acceptance shape:

- A data-model CPT can expose title, featured image, excerpt and managed fields
  without forcing longform block content.
- The admin copy explains the editing mode in WordPress terms.
- Existing CPT definitions keep their current supports unless a migration is
  explicitly chosen.

### 3. CPT Dynamic Tags Are First-Class, Not Only CCT Tags

Current risk:

- Toolkit has Elementor dynamic tags for CCT field values and a field-key helper.
- A Toolkit-managed CPT with meta fields still lacks the same obvious Elementor
  dynamic tag bridge for text, URL, image and gallery output.

Operating preconization:

- Add CPT dynamic tags for Toolkit-managed post meta before claiming the CPT
  manager is Elementor-friendly.
- Field dropdowns should show compatible fields only: text-like fields for text
  tags, URL-like fields for URL tags, attachment-backed fields for image/gallery
  tags.
- Use current post context first, then provide preview/fallback controls where
  Elementor editor context is weak.

Acceptance shape:

- In Elementor, a user can bind a widget field to a Toolkit-managed CPT meta
  field without manually typing a meta key.
- Image tags return an Elementor-compatible image value, not just a raw string.
- Gallery tags return a stable list of resolved attachments where Elementor
  supports that category.

### 4. Elementor Bridge Means Workflow Help, Not A Full Theme Builder Clone

Current risk:

- The CPT manager says templates can use the data model, but the current bridge
  mostly opens the content list or creates a filter preset.
- That is useful, but incomplete as an Elementor implementation workflow.

Operating preconization:

- Do not build a full Theme Builder clone.
- Do build Elementor readiness diagnostics and handoff actions:
  - detect whether Elementor editing is enabled for the CPT;
  - offer an intentional enable/repair path when safe;
  - create or open sample content for preview;
  - create/open relevant filter presets;
  - generate single/archive template handoff notes;
  - detect Elementor Pro, JetThemeCore or other theme-builder surfaces when
    present, without making them public dependencies.

JetEngine benchmark:

- Official Crocoblock docs show JetEngine dynamic tags for CPT meta and CCT
  fields.
- Official Crocoblock docs show listing templates for post types built in
  Elementor Free.
- Official Crocoblock docs show reusable single-post/CPT templates as a theme
  builder workflow through JetThemeCore conditions.
- Official Crocoblock docs also show that Elementor can be enabled for individual
  CPT post editing from Elementor settings.

So the target is not "copy JetEngine completely". The target is to close the
obvious bridge gap: Toolkit CPT definitions, item editing, dynamic tags and
template handoff should feel like one coherent implementation workflow.

## Latent Product Directions

These are saved as legitimate future directions. Each one needs a fresh task,
source inspection and acceptance criteria before code changes.

### 1. Implementer Flight Recorder

Idea:

Record selector detection, indexed items, active filters, REST payload, REST
response, URL state, relevant screenshots or DOM snapshots, console errors and
environment facts.

Why it matters:

Turns client/editor debugging from "it did not filter here" into reproducible
evidence.

Likely surface:

- wp-admin diagnostics;
- editor-only action;
- downloadable local JSON report;
- optional evidence record inside Studio OS when used for portfolio or QA.

Do not start until:

- public/private data boundary is defined;
- no secrets or private content are captured by default;
- target selector and item index data have a stable serializer.

### 2. Explain Why This Item Passed Or Failed

Idea:

For a selected listing item, explain which filters matched, which failed and
which data source was used.

Example:

- passed: `category` contains `site`;
- failed: `rating` missing or below threshold;
- ignored: filter disabled or empty value;
- fallback: visible text was used because no resolved key was available.

Why it matters:

This is the strongest debugging bridge between polished UI and real runtime
truth.

Do not start until:

- resolver semantics are inspectable without changing public output;
- DOM-provider and CCT-provider results can share a diagnostic shape.

### 3. Field Contract Wizard

Idea:

Replace scattered user choices such as `key`, `source`, `compare` and
`data_type` with a guided field contract flow:

- "filter this text";
- "filter this data attribute";
- "filter this taxonomy";
- "filter this CCT field";
- "filter this custom field";
- "fallback to visible text".

Why it matters:

The main product risk is fragile binding. A guided contract gives the widget a
clear answer to what field the filter controls.

Do not start until:

- current `FieldBindingResolver`, `FilterTypeRegistry`, preset schema and CCT
  field catalog are inspected;
- backward compatibility for existing presets is explicit.

### 4. Preset Impact Map

Idea:

Before updating a shared preset, show which widgets, pages and templates are
likely affected. Add snapshot or hash warnings before overwrite.

Why it matters:

Shared presets become safe only when the implementer can understand blast
radius.

Do not start until:

- current widget/preset link metadata is inventoried;
- storage location for snapshot metadata is chosen;
- rollback or recovery expectation is documented.

### 5. Visual Recipes

Idea:

Offer curated starting configurations such as:

- compact range;
- directory chips;
- editorial search plus select;
- segmented radio;
- product swatches;
- mobile filter bar.

Why it matters:

The current product can accumulate many controls. Recipes make it feel fast and
intentional without removing advanced control.

Do not start until:

- current filter-type QA state is reviewed;
- recipes are implemented as presets/configuration, not hardcoded forks;
- each recipe can be explained through existing style/control contracts.

### 6. Faceted Counts And Availability

Idea:

Show counts per option, disable impossible options and expose availability state.

Why it matters:

Moves the product from "styled filter form" toward "intelligent listing
controller".

Do not start until:

- DOM-provider count limits are defined;
- CCT-provider count strategy is defined separately;
- performance and stale-count behavior are explicit.

### 7. CCT Importer With Inference

Idea:

Allow CSV/JSON/table input and infer CCT fields, field types, filterable flags,
labels and initial rows.

Why it matters:

CCT becomes a real implementation accelerator, not only a manually configured
data structure.

Do not start until:

- import security and file-size limits are defined;
- destructive overwrite behavior is impossible without confirmation;
- field inference can be previewed before save.

### 8. Template Ghost Preview For Elementor Free

Idea:

Provide safe editor-only preview data for CCT and preset/template flows without
requiring Elementor Pro as a public dependency.

Why it matters:

Preserves the Elementor Free-compatible promise while making templates easier to
author.

Do not start until:

- preview data is clearly inert;
- frontend runtime ignores preview-only artifacts;
- template rendering security boundary is reviewed.

### 9. Small Adapter SDK

Idea:

Create a small provider/field/status adapter interface instead of implementing
deep WooCommerce, JetEngine or Simple Budget adapters all at once.

Why it matters:

Keeps integrations optional, degraded and honest while allowing real adapters
later.

Do not start until:

- current provider mode and diagnostics contracts are inventoried;
- adapter output shape is smaller than the current product surface;
- no public compatibility claim is added without runtime proof.

### 10. Mobile Filter Shell

Idea:

Let the same Filter Controller render as drawer, bottom sheet, accordion or
sticky mobile bar with focus/accessibility behavior.

Why it matters:

Filtering is often decided on mobile. A desktop-only filter layout can look
complete while failing the real implementation use case.

Do not start until:

- current responsive controls and frontend data attributes are reviewed;
- accessibility and focus return behavior are part of acceptance;
- the shell does not become a grid/listing renderer.

### 11. Automatic Handoff Notes

Idea:

Generate a concise implementation handoff from a preset:

- selectors;
- expected fields;
- data provider;
- filters;
- QA checklist;
- Elementor setup notes;
- known warnings.

Why it matters:

Matches Studio OS's purpose: reduce rebriefing and preserve execution state.

Do not start until:

- diagnostics produce stable facts;
- output format is plain text/Markdown and safe to copy;
- generated notes do not claim support that diagnostics did not prove.

### 12. Admin QA Scenario Runner

Idea:

Save and rerun scenarios such as:

- search term `x`;
- select option `y`;
- expect 3 results;
- expect URL state;
- expect no console errors.

Why it matters:

Turns repeated visual/runtime checks into product evidence and portfolio proof.

Do not start until:

- Flight Recorder or equivalent observation data exists;
- pass/fail assertions are scoped and realistic;
- browser/editor checks are separated from PHP/REST mechanical checks.

## How To Convert A Direction Into Work

Before implementing any direction above, Codex should write or update a focused
task document that answers:

- Which one idea is being implemented?
- What user pain does it solve?
- Which current files and contracts were read?
- What is explicitly out of scope?
- What old presets/widgets/data must keep working?
- What security boundary is touched?
- What is the smallest viable slice?
- What mechanical verification will be run?
- What remains Guilherme-owned visual/editor QA?

If the answer touches shared runtime behavior, Codex should also check:

- `scripts/verify-line-budget.php`
- `scripts/verify-filter-controller-robustness.php`
- `scripts/verify-cct.php` when CCT is involved

## Preferred First Slice

If Guilherme gives a broad instruction without choosing a specific item, Codex
should not choose the flashiest feature.

Default first slice:

```text
Truthful Surface Pass for Productization Gap Audit 2026-07-02.
```

Expected output of that first slice:

- README/admin labels distinguish real, partial and future capabilities;
- dashboard/settings no longer say "Ready" without runtime evidence;
- preset provider modes no longer expose unsupported adapter behavior;
- CCT Loop/Grid support is condition-gated around actual Elementor runtime;
- filter template bridge copy says what it really creates;
- no broad adapter work started.

Default first engineering target after truthful copy/status cleanup:

```text
CPT media selector parity with CCT, preserving existing URL-backed CPT values.
```

Field Contract Wizard remains the next default direction after the
professionalization baseline is no longer the obvious blocker.

## Completion Definition For Future Sessions

A future implementation session following this preconization is successful when:

- it reads current repository reality before editing;
- it chooses one slice instead of many;
- it preserves the widget-first/admin-diagnostics boundary;
- it keeps public dependency promises;
- it records evidence or a clear handoff;
- it leaves the next valid action recoverable without Guilherme explaining the
  whole project again.
