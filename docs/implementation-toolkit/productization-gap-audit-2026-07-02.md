# Elementor Implementation Toolkit - Productization Gap Audit

Date: 2026-07-02

Status: operational audit for future Codex implementation sessions.

This document maps surfaces that already exist in the Toolkit but still feel
like product promises instead of finished product behavior.

It is not a request to build everything at once. It is a prioritization map for
future slices.

## Audit Lens

A gap belongs here when the Toolkit already has one of these:

- a README claim;
- an admin card;
- a button;
- a saved setting;
- an Elementor control;
- a Dynamic Tag;
- a provider mode;
- a diagnostic/status label;
- a field type;
- a template bridge;
- a REST path;
- a script verification claim;

but the real experience still requires manual guessing, hidden assumptions,
silent fallback, external plugin knowledge, or implementation work that is not
visible to the user.

Severity:

- P0: public/product contract is misleading or can break trust quickly.
- P1: product-owned workflow exists but is incomplete.
- P2: useful polish that should follow after the core contract is honest.

## Executive Reading

The Toolkit is not empty. It has real infrastructure:

- Filter Controller widget;
- admin preset library;
- Elementor template creation for filter controls;
- CPT manager;
- table-backed CCT definitions and CRUD;
- CCT media picker;
- CCT Dynamic Tags;
- CCT Loop skin under Elementor Pro/Loop Builder;
- DOM-provider AJAX filtering;
- REST filtering;
- editor target detection;
- verification scripts.

The maturity problem is different: some names and screens imply a finished
implementation workflow while the code is still closer to a toolkit substrate.

The most dangerous words today are:

- "bridge";
- "provider";
- "diagnostics";
- "ready";
- "Loop Grid";
- "adapter";
- "field binding";
- "counts";
- "Elementor-ready".

Those words must either become true through implementation or become more
precise in UI/docs.

## P0 Findings

### 1. CCT Loop Grid/Carousel Is Advertised More Broadly Than Runtime Reality

Surface that exists:

- README says CCT can feed Elementor Loop Grid, Loop Carousel, Dynamic Tags and
  Filter Controller.
- Widget has a `Toolkit CCT` data provider.
- CCT provider can render server-side HTML from a Loop Item template.

Gap:

- The Loop Grid/Carousel skin is explicitly gated by Elementor Pro Loop Builder
  classes.
- Server-side CCT rendering returns empty HTML when `ElementorPro\Plugin` is not
  available.
- The public product direction elsewhere says Elementor Pro should not become a
  public dependency.

Evidence:

- `readme.md`
- `includes/Elementor/Loop/CctLoopIntegration.php`
- `includes/Elementor/Loop/SkinLoopCct.php`
- `includes/Rest/CctFilterProvider.php`

Why this matters:

The user can believe "CCT feeds Elementor Loop Grid" is an Elementor Free-compatible
feature. In practice, the rich Loop Grid path is Pro/Loop Builder-shaped.

Correction shape:

- Split the product contract into:
  - CCT data model: WordPress/admin owned.
  - CCT Dynamic Tags: Elementor dynamic tag surface.
  - CCT Loop skin: available only when Loop Builder classes exist.
  - CCT server-rendered filter provider: requires renderable Loop Item template
    runtime.
- Add explicit diagnostics for:
  - Elementor active;
  - Elementor Pro/Loop Builder available;
  - published Loop Item template selected;
  - CCT type public;
  - target container exists on page.
- Do not show "ready" for CCT Loop rendering unless these checks pass.

### 2. Preset Provider Modes Exist But Do Not Drive Runtime

Surface that exists:

- Filter Preset admin has "Data provider" under Provider defaults.
- Saved provider modes include DOM, WordPress enrichment and Custom adapter.
- Dashboard/settings talk about provider status.

Gap:

- Widget runtime only reads `data_provider` from the Elementor widget settings
  and maps it to `dom` or `cct`.
- Preset `provider_mode` is stored and displayed, but it does not set the widget
  provider at runtime.
- "Custom adapter" is selectable but no adapter runtime exists.

Evidence:

- `includes/Support/FilterPresets.php`
- `includes/Admin/FilterPresetAdmin.php`
- `includes/Elementor/FilterController/RuntimeConfig.php`
- `includes/Elementor/FilterController/FilterSettings.php`

Why this matters:

This is a classic promise gap: the admin lets the implementer choose a provider,
but the frontend execution does not obey that choice.

Correction shape:

- Either remove/hide unsupported provider modes until they are real, or wire
  preset provider mode into widget runtime.
- Keep "WordPress enrichment" as a diagnostic fact, not a separate provider,
  because enrichment is currently automatic when `postId` or permalink can be
  resolved.
- Do not expose "Custom adapter" until there is a minimal adapter contract.

### 3. Diagnostics Say Ready Without Runtime Evidence

Surface that exists:

- Dashboard says the Elementor bridge is ready.
- Settings page shows "Ready", "Active", "Automatic" and "CPT definitions Ready".
- Preset diagnostics exist.

Gap:

- Diagnostics are mostly static status labels and saved-shape validation.
- They do not prove actual page selector validity, target item count, Elementor
  editing support for CPTs, Loop Builder availability, CCT template renderability,
  REST success or frontend console state.

Evidence:

- `includes/Admin/AdminPages.php`
- `includes/Admin/FilterPresetAdmin.php`

Why this matters:

"Diagnostics" is a trust word. If it only reports configuration optimism, users
will treat false readiness as product failure.

Correction shape:

- Rename static checks to "Configuration summary" where needed.
- Add a real diagnostics model:
  - fact;
  - evidence;
  - impact;
  - next action.
- Promote a status to "Ready" only when runtime-relevant checks pass.

## P1 Findings

### 4. CPT Media Fields Are Less Professional Than CCT Media Fields

Surface that exists:

- CPT manager supports `image` and `gallery` meta field types.
- CCT item editor supports image/gallery through the WordPress media selector.

Gap:

- CPT image is stored as URL.
- CPT gallery is stored as gallery URLs in a textarea.
- CPT managed post editor does not enqueue/reuse the media picker path.

Evidence:

- `includes/CPT/CptManager.php`
- `includes/Admin/CctItemAdmin.php`
- `includes/Support/Assets.php`

Why this matters:

The same product has two media models. CCT feels native; CPT feels unfinished.

Correction shape:

- Add CPT media controls using WordPress media selector.
- Store attachment IDs for image/gallery semantics.
- Keep URL as a distinct external URL type.
- Preserve existing URL-backed CPT values with explicit fallback or migration.

### 5. CPT Dynamic Tags Are Missing

Surface that exists:

- CPT manager creates typed meta fields.
- Dynamic Tags integration exists.
- CCT text, URL, image and gallery tags exist.

Gap:

- There are no equivalent Dynamic Tags for Toolkit-managed CPT meta fields.
- A user can create a CPT field in Toolkit but cannot bind it naturally in
  Elementor as a Toolkit CPT field.

Evidence:

- `includes/CPT/CptManager.php`
- `includes/Elementor/DynamicTags/DynamicTagsIntegration.php`
- `includes/Elementor/DynamicTags/CctTextTag.php`
- `includes/Elementor/DynamicTags/CctImageTag.php`
- `includes/Elementor/DynamicTags/CctGalleryTag.php`

Why this matters:

This is the exact line between "CPT manager exists" and "CPT manager is
Elementor-friendly".

Correction shape:

- Add CPT Text, URL, Image and Gallery dynamic tags.
- Filter field dropdowns by field type and current post type where possible.
- Resolve image/gallery into Elementor-compatible values, not raw strings.

### 6. CPT Editing Defaults Can Fight Elementor-Structured Content

Surface that exists:

- CPT manager exposes supports and REST visibility.
- Defaults can include editor/Gutenberg-style editing.
- Admin copy says CPTs are Elementor-ready structures.

Gap:

- For structured content used by Elementor templates, Gutenberg can become
  noise or a bad editing experience.
- There is no clear "structured item mode" or "content editor mode".

Evidence:

- `includes/CPT/CptManager.php`
- `includes/Admin/CptManagerAdmin.php`

Why this matters:

For directory/catalog/portfolio objects, users expect a controlled data editor,
not a blank page canvas competing with Elementor templates.

Correction shape:

- Add an explicit editing mode:
  - structured data mode;
  - content/editor mode.
- Make supports intentional by preset.
- Keep existing CPT definitions backward-compatible.

### 7. Elementor Bridge For CPTs Is Mostly Copy And Navigation

Surface that exists:

- CPT manager has an "Elementor bridge" card.
- Dashboard says post types can be opened in Elementor when visual work begins.

Gap:

- CPT bridge currently opens content list and filter preset creation.
- It does not detect whether Elementor editing is enabled for the CPT.
- It does not create/open a single/archive template workflow.
- It does not create sample content for preview.

Evidence:

- `includes/Admin/CptManagerAdmin.php`
- `includes/Admin/AdminPages.php`

Why this matters:

The product says "bridge", but the actual workflow is "go elsewhere and know
what to do".

Correction shape:

- Add Elementor readiness diagnostics per CPT.
- Detect Elementor CPT support option.
- Offer safe enable/repair action when appropriate.
- Generate handoff notes for single/archive template setup.
- Detect Elementor Pro, JetThemeCore or other theme builder surfaces only as
  optional runtime facts.

### 8. Filter Template Bridge Creates Filter-Control Templates, Not Archive Templates

Surface that exists:

- Filter preset manager can create an Elementor template.
- Dashboard/list copy refers to archive/template handoff.

Gap:

- Created template is a page-style Elementor library document containing a
  heading and Filter Controller widget.
- It is not a Theme Builder archive template, not a single template, and not
  attached to a CPT/archive condition.

Evidence:

- `includes/Elementor/FilterTemplateManager.php`
- `includes/Admin/FilterPresetAdmin.php`
- `includes/Admin/AdminPages.php`

Why this matters:

The bridge is useful, but the word "archive" can make the implementer expect a
full template routing workflow.

Correction shape:

- Rename this surface to "Filter controls template" or "Filter area template".
- Add separate theme-builder handoff detection later.
- If Elementor Pro or JetThemeCore is present, expose it as optional next action,
  not as current capability.

### 9. Field Binding Is Still A Raw-Key Contract

Surface that exists:

- Repeater has "Field Binding" with Dynamic Tag support.
- Toolkit Field Key Dynamic Tag exists.
- FieldBindingResolver extracts a key from text or Dynamic Tag settings.

Gap:

- The selected Toolkit field ultimately becomes a key string.
- Source, compare and data type are mostly hidden/manual.
- Field catalog entries have source/type/post type metadata, but the binding
  does not carry a full field contract into runtime.
- Duplicate keys across CPTs/CCTs can collapse into one option.

Evidence:

- `includes/Elementor/FilterController/ContentControls.php`
- `includes/Elementor/FilterController/FieldBindingResolver.php`
- `includes/Elementor/DynamicTags/ToolkitFieldKeyTag.php`
- `includes/Support/ToolkitFieldCatalog.php`

Why this matters:

The user thinks they bound a field. The runtime mostly receives a string and has
to infer the rest.

Correction shape:

- Promote field binding from key string to field contract:
  - key;
  - source;
  - data type;
  - provider;
  - owner;
  - compatibility with filter type.
- Keep raw manual key as fallback.

### 10. Advanced Filter Fields Include Ghost Controls

Surface that exists:

- Admin filter row exposes URL parameter, default value, empty behavior, show
  counts and show label.
- FilterPresets stores several of these.

Gap:

- `query_var` is not used by frontend URL sync, which generates its own
  `eit_{instance}_{type}_{key}` parameters.
- `default_value` is saved but not applied as initial frontend state.
- `empty_behavior` is saved but not materially used in frontend/server filtering.
- `show_count` is a saved flag, but counts are only static values parsed from
  option lines.

Evidence:

- `includes/Admin/FilterPresetAdmin.php`
- `includes/Support/FilterPresets.php`
- `assets/js/eit-frontend.js`
- `includes/Elementor/FilterController/FilterOptions.php`
- `includes/Elementor/FilterController/Renderers/Types/ChoiceOptionsRenderer.php`

Why this matters:

These controls look like product features. If they do nothing or only partially
work, they create hidden user distrust.

Correction shape:

- Either implement each control or hide/rename it:
  - `query_var`: drive URL state names.
  - `default_value`: initialize controls before first apply.
  - `empty_behavior`: define server/client behavior.
  - `show_count`: static counts vs dynamic faceted counts must be explicit.

### 11. CCT Field Catalog Is Global, Not Contextual Enough

Surface that exists:

- CCT Dynamic Tags let the user choose Preview Content Type and Field.
- CCT order options include system fields and custom fields.

Gap:

- Field dropdown is built from all CCT definitions, keyed only by field key.
- If two CCTs use the same field key, labels/options can collide.
- Selecting a field from another CCT can silently resolve null in current context.

Evidence:

- `includes/Support/CctFieldCatalog.php`
- `includes/Elementor/DynamicTags/CctTextTag.php`
- `includes/Elementor/DynamicTags/CctImageTag.php`
- `includes/Elementor/DynamicTags/CctGalleryTag.php`

Why this matters:

The UI gives a two-step mental model, but the field list is not scoped by the
chosen content type.

Correction shape:

- Use a scoped field identifier such as `type:key`, or dynamically scope fields
  by selected content type.
- Preserve backward compatibility for existing plain keys.

### 12. CCT Provider Needs A Target Container But The Workflow Does Not Make That Obvious

Surface that exists:

- Widget can use data provider `Toolkit CCT`.
- REST provider can return rendered HTML.

Gap:

- Frontend still requires a target element to replace.
- If no target is found, the controller renders zero results and stops.
- The UI does not clearly create or validate the required target container for
  CCT rendering.

Evidence:

- `includes/Elementor/FilterController/ContentControls.php`
- `assets/js/eit-frontend.js`
- `includes/Rest/CctFilterProvider.php`

Why this matters:

CCT sounds less parasitic than DOM provider, but the frontend still depends on a
DOM target shell.

Correction shape:

- Add a CCT provider setup checklist:
  - choose CCT type;
  - choose Loop Item template;
  - choose or create target container;
  - verify target exists;
  - test REST render.
- Add visible editor warning when CCT provider is selected without a target.

### 13. DOM Provider Is A Useful Heuristic, Not A Deep Woo/Jet/WooCommerce Adapter

Surface that exists:

- README names Elementor, WooCommerce, JetEngine and generic listings under DOM
  provider.
- Editor/Frontend detector knows selectors for Jet listing, products and
  Elementor posts/loop containers.

Gap:

- There is no WooCommerce adapter.
- There is no JetEngine adapter.
- There is no provider-specific contract for pagination, query state, stock,
  price, taxonomy, variations or Jet query context.

Evidence:

- `readme.md`
- `assets/js/eit-editor.js`
- `assets/js/eit-frontend.js`
- `includes/Support/FilterResolver.php`

Why this matters:

The product can support those listings opportunistically, but the wording should
not imply certified integrations.

Correction shape:

- Use language like "can detect common markup from..." instead of "provider for".
- Add adapter status only when adapter contracts exist.
- Add per-page evidence from Flight Recorder before making integration claims.

### 14. CCT Admin CRUD Exists, But Content Operations Are Still Basic

Surface that exists:

- CCT definitions create dedicated admin menus.
- CCT item CRUD exists.
- Media picker exists.
- Archive/restore exists at definition level.

Gap:

- Item list shows title, status, order and updated date only.
- No configurable columns from CCT fields.
- No bulk actions.
- Validation errors redirect to generic error notice.
- No import/export.
- No duplicate item.
- No preview/open-in-Elementor context action.

Evidence:

- `includes/Admin/CctItemAdmin.php`
- `includes/Admin/CctDefinitionAdmin.php`
- `includes/CCT/Repository.php`

Why this matters:

The storage model is real, but the day-to-day content management experience is
still early.

Correction shape:

- Add field columns for chosen fields.
- Add detailed validation notices.
- Add duplicate/import/export later.
- Add template preview/handoff action when Elementor context is available.

### 15. Preset Library Has Good Shape Diagnostics But No Runtime Proof

Surface that exists:

- Preset list has health states.
- Preset preview shows source, provider, filters and diagnostics.

Gap:

- It cannot confirm a selector exists on a real page.
- It cannot confirm how many items will be indexed.
- It cannot show which fields are present/missing in indexed items.
- It cannot replay a scenario.

Evidence:

- `includes/Admin/FilterPresetAdmin.php`
- `assets/js/eit-frontend.js`

Why this matters:

The preset can look healthy while failing on the actual Elementor page.

Correction shape:

- Add "runtime evidence" as a separate status from "shape valid".
- First slice can store manual evidence:
  - page URL;
  - selector;
  - detected item count;
  - sample item data keys;
  - REST result summary.

## P2 Findings

### 16. Option Counts Are Static, Not Faceted Counts

Surface that exists:

- Option format supports `value|Label|visual|count`.
- UI can render option count badges.
- Admin has "Show counts".

Gap:

- Counts are not calculated from current result set.
- Options are not disabled when unavailable.

Evidence:

- `includes/Elementor/FilterController/FilterOptions.php`
- `includes/Elementor/FilterController/Renderers/Types/ChoiceOptionsRenderer.php`
- `assets/js/eit-frontend.js`

Correction shape:

- Rename current behavior to "static option counts" if kept.
- Build real faceted counts later for CCT first, DOM second.

### 17. Reusable Product Needs Import/Export Before It Feels Portable

Surface that exists:

- Presets, CPT definitions and CCT definitions are stored as options/custom
  tables.
- README frames them as reusable structures across implementation work.

Gap:

- No export/import path for presets, CPT definitions, CCT definitions or seed
  data.
- No migration preview.
- No rollback snapshot before destructive changes.

Evidence:

- `includes/Support/FilterPresets.php`
- `includes/CPT/CptManager.php`
- `includes/CCT/DefinitionManager.php`

Correction shape:

- Add JSON export/import for presets first.
- Add CPT/CCT definition export later.
- Add seed import for CCT only after validation preview exists.

### 18. Verification Exists, But Product QA Is Not Yet Closed

Surface that exists:

- There are verification scripts for line budget, filter robustness and CCT.
- Scripts explicitly skip visual/editor QA owned by Guilherme.

Gap:

- No automated browser smoke for the actual Elementor editor/frontend workflow.
- No saved screenshots/evidence artifact for product claims.
- Some large files remain known debt.

Evidence:

- `scripts/verify-line-budget.php`
- `scripts/verify-filter-controller-robustness.php`
- `scripts/verify-cct.php`

Correction shape:

- Keep mechanical scripts.
- Add Playwright smoke for a minimal frontend page when feasible.
- Add an evidence packet format for manual Elementor QA.

## Recommended Implementation Order

Do not start with adapters.

Start by making current surfaces honest and complete.

### Slice 1 - Truthful Surface Pass

Goal:

Remove or reword claims that imply runtime capabilities not currently proven.

Scope:

- README scope wording.
- Dashboard/settings "Ready" labels.
- Preset provider mode labels.
- Filter template bridge copy.
- CCT Loop/Pro availability copy.

Exit criteria:

- No UI says "ready" unless it is backed by a check.
- No admin option suggests adapter support without adapter runtime.
- CCT Loop Grid support is explicitly condition-gated.

### Slice 2 - CPT Professionalization Pack

Goal:

Make CPT manager feel like a serious Elementor implementation surface.

Scope:

- CPT media selector parity with CCT.
- CPT dynamic tags.
- Structured editing mode.
- Elementor CPT support diagnostic.

Exit criteria:

- Toolkit-managed CPT image/gallery fields no longer feel worse than CCT.
- Elementor can bind to CPT meta without manual key typing.
- CPT bridge shows concrete next actions, not generic copy.

### Slice 3 - Runtime Contract Alignment

Goal:

Make saved preset settings actually control runtime behavior.

Scope:

- `provider_mode`.
- `query_var`.
- `default_value`.
- `empty_behavior`.
- `show_count`.

Exit criteria:

- Every visible/saved setting either has runtime effect or is hidden/renamed.
- Preset import/export does not preserve dead promises.

### Slice 4 - Real Diagnostics Baseline

Goal:

Separate "shape valid" from "runtime proven".

Scope:

- Preset selector evidence.
- target item count.
- field/key availability.
- CCT provider readiness.
- Elementor/Loop Builder availability.

Exit criteria:

- Diagnostics output facts, impact and next action.
- Admin can explain why a preset is not ready.

### Slice 5 - Field Contract Wizard

Goal:

Replace raw key entry with field-aware binding.

Scope:

- Toolkit field catalog contract.
- source/data type propagation.
- duplicate-key handling.
- CCT/CPT compatibility with filter types.

Exit criteria:

- Binding a field stores a contract, not only a string.
- The widget can explain what it is filtering.

## Codex Instruction For Future Sessions

When Guilherme says:

> olha o implementation toolkit e implementa as melhorias obvias

Codex should not jump to new features.

Codex should first open this audit and implement the next smallest slice from
the order above, unless Guilherme names a specific gap.

Default first code slice:

```text
Truthful Surface Pass for Productization Gap Audit 2026-07-02.
```

Default first engineering target after copy/status cleanup:

```text
CPT media selector parity with CCT, preserving existing URL-backed CPT values.
```
