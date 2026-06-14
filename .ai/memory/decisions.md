# Decisions

## 2026-05-14

- The root repository is the orchestration layer for portfolio strategy,
  environment, docs, and AI brain.
- Plugin source lives in `wordpress/wp-content/plugins/` and should keep
  separate git history.
- WordPress local runtime lives in `wordpress/`; generated core/runtime files are
  ignored, but setup/tooling inside `wordpress/` is tracked.
- `.ai/` is reserved for the AI brain and must not store project deliverables.
- Initial local environment will use Docker Compose with WordPress, MySQL, and
  WP-CLI.
- The root directory should contain only `AGENTS.md`, `.ai/`, `docs/`, and
  `wordpress/`.
- Generated portfolio/site images must be treated as scalable UI systems, not
  single shots. Compose them so new sites, cards, or modules can be added later
  without breaking the layout, and prefer modular, thematic, personality-rich
  visuals over literal photography.
- "Scalable UI system" means a public-facing portfolio layout that can receive
  more case-study cards, sections, or categories later. It must not look like an
  internal app, admin dashboard, project manager, software UI, or editable
  canvas. Never include add-project buttons, empty editable slots, builder
  controls, or placeholder rails in public portfolio hero images.
- For public portfolio images, prefer a strong 100vh-style hero composition
  with a compact bio block, clear role statement, and higher visual contrast
  over a full-page white-heavy layout. Keep the design modular, but make the
  first impression more vivid and less sober.
- If the hero is 100vh, do not add a top header/navigation bar inside the
  composition. Put metadata, bio, and stack details in a lateral rail, lower
  band, or background treatment instead.
- Keep the bio compact and readable. Do not crowd the hero with many tech tags;
  make the stack feel intentional by placing it in a side rail or footer strip.
- The confirmed tech stack for public portfolio visuals includes WordPress,
  Elementor, WooCommerce, PHP, JS, CSS, Git, ACF, and the Crocoblock suite.
- Avoid AI-generated visual noise in portfolio hero images. Do not use busy
  code backgrounds, decorative micro-icons, floating labels, dense texture,
  fake terminal snippets, or technical confetti that competes with the copy.
  The background should be quiet and thematic, with a few large supporting
  shapes or project previews.
- Never infer the user's public name, personal brand, or portfolio identity from
  indirect context. Use placeholders until the user explicitly defines the name
  or brand.

## 2026-05-15

- Public portfolio identity is Guilherme Silva with the handle `kingdonrush`.
  Do not use Kaue, Kaue Rush, or any other inferred name.
- The portfolio visual direction should blend Discord-like human/community
  energy with OpenAI-like restraint and precision, without copying either
  brand. Use this as a visual grammar, not as brand imitation.
- The preferred first-screen concept is a dark, richer profile area on the left
  and a light, modular selected-work grid on the right. The transition between
  them should be polished and intentional, not an abrupt black/white cut.
- Future portfolio mockups should include social/contact icons for LinkedIn,
  WhatsApp, email, Instagram, and GitHub in the profile area.
- WordPress, Elementor, WooCommerce, plugin, and public technical-positioning
  decisions must follow the evidence-first rule in
  `.ai/operational/evidence-first.md`. Do not infer Elementor behavior, plugin
  capability, SEO-tool quality, or compatibility claims from memory alone. For
  Elementor-specific work, load `.ai/operational/elementor-evidence-map.md`.
- The current provisional portfolio hero baseline is
  `docs/assets/portfolio/provisional/portfolio-hero-provisional-v1.png`, with
  supporting assets in `docs/assets/portfolio/`.
- The 3D Viewer project should use a Three.js stack badge instead of a generic
  `3D` badge when represented in portfolio visuals.
- Rank Math is the provisional named SEO badge for portfolio implementation
  cards because its public WordPress.org plugin page documents Elementor and
  WooCommerce SEO relevance. This is not a universal claim that Rank Math is
  always the best SEO plugin; Yoast remains a valid alternative and has a larger
  install base.
- The next project work focus is `3d-viewer-to-elementor` first and
  `simple-budget-plugin` second. The WooCommerce Toolkit for Elementor idea
  stays parked until those two assets are stronger.
- Portfolio assets should be sourced from `docs/assets/portfolio/` and synced
  into local WordPress runtime at `wordpress/wp-content/uploads/portfolio-assets/`.
  Import PNG reference assets into the Media Library when useful, but do not
  import SVG icons into the Media Library unless a sanitization/upload policy is
  deliberately added.
- Visual portfolio assets must be generated or refined with imagegen when
  fidelity matters. CLI/SVG/CSS generation is acceptable only for technical
  placeholders, sync/import work, optimization, or implementation wrappers after
  an imagegen-approved asset exists. The current handwritten SVG icons and
  `profile-edge-wave.svg` are placeholders until replaced or approved.
- Plugin work must be isolated as a separate plugin repository and published to
  GitHub when it is portfolio evidence. New plugins should be initialized as
  their own repos before being presented publicly. `simple-budget-plugin` and
  `3d-viewer-to-elementor` already have GitHub repositories and should preserve
  those histories/remotes.
- Public plugin promises must depend only on WordPress, Elementor free, and the
  plugin's declared dependencies. Pro Elements/Elementor Pro may be used in the
  local low-budget implementation environment for premium editor conveniences
  such as custom CSS, but public plugin architecture must not require Pro
  Elements unless a later project explicitly changes that promise.
- Portfolio plugin repositories need strong GitHub presentation assets: README
  visuals, edited demo GIFs or video-like captures, screenshots, clear GitHub
  links from the site, and practical visual proof of what the plugin enables.
  AI-generated visuals/video may be used for polished presentation as long as
  behavior claims are grounded in real plugin evidence.
- For Elementor Free plugin features that need implementer-editable layout
  surfaces, prefer using Elementor's own `elementor_library` editor workflow
  instead of depending on Elementor Pro Theme Builder. The useful pattern is:
  plugin-owned admin flow creates/labels the template, redirects to the
  Elementor editor, widget controls select the template, and frontend rendering
  uses Elementor content rendering under plugin-controlled validation/fallbacks.
- Plugin-owned Elementor modal/fragment templates must use Elementor Canvas for
  the editor surface. Do not let these templates default to Theme or Elementor
  Full Width because headers/footers become visible in the editor preview and
  confuse the implementer. When using `elementor_library`, create/normalize the
  document as a page template and set `_wp_page_template` plus page settings to
  `elementor_canvas`.
- For Elementor implementation widgets, keep action ownership aligned with
  runtime context. Global or opener actions belong in a button widget
  (`add`, `toggle`, `open`, `close`, `send`). Item-scoped actions that require
  a repeated row context, especially remove and quantity controls, belong in the
  listing/widget that renders the item and can attach the correct item ID.
- For Simple Budget-style popup richness, separate editable content from shell
  behavior. Elementor templates own content layout; the plugin shell owns modal
  vs drawer vs bottom-sheet presentation, overlay, animation, close behavior,
  accessibility, and preview framing. Do not inflate a focused cart plugin into
  a generic popup-condition engine unless that becomes a separate plugin scope.
- For Simple Budget's `Budget Button`, keep icon layout/styling controls grouped
  under `Style > Icon` for implementer ergonomics, while preserving Elementor
  button-like markup and existing control IDs such as `icon_align` and
  `icon_indent` for template compatibility.
- For Simple Budget's `Budget Listing`, keep item-action positioning controls
  such as the remove button position under the relevant Style section, not under
  Content. The remove button position should use an Elementor Icon Box-like
  choose control with Start, End, Top, and Bottom while preserving
  `remove_position` for compatibility.
- For Simple Budget cart shell settings that represent dimensions, use native
  Elementor responsive controls and carry desktop/tablet/mobile values through
  explicit frontend `data-*` attributes. Do not use a single fixed shell width
  when the resulting UI changes substantially across breakpoints.
- For Simple Budget options that materially change layout or interaction by
  breakpoint, prefer responsive Elementor controls plus explicit frontend
  fallback resolution. Current strategic responsive controls include cart shell
  type, shell animation, panel width, overlay opacity, and Budget Listing remove
  button position.
- For Simple Budget v3+, treat the plugin as Elementor-only. Remove shortcode
  and fixed-ID button compatibility once native widgets exist, and replace
  missing-template fallbacks with an implementer setup prompt that points back to
  `Simple Budget > Templates` instead of reviving legacy cart rendering.
- For public Simple Budget AJAX flows, centralize validation in shared support
  classes before rendering output: template role/status/capability in
  `CartTemplateManager`, and product IDs, allowed post types, item counts, and
  quantities in `CartRenderer`.
- For Elementor Free templates that depend on dynamic runtime context, prefer
  editor-only preview controls inside the widget that renders the dynamic
  surface instead of creating a Pro-style document/page-settings dependency.
  In Simple Budget this means `Budget Listing` owns cart-item preview data:
  selected public post type, optional IDs, item count, quantity, and safe
  placeholders. Preview actions must be inert and must not mutate the visitor
  cart or frontend behavior.

## 2026-05-19

- Elementor Implementation Toolkit must not resurrect the rejected admin v0.2
  custom shell/canvas direction. The plugin admin should stay closer to native
  WordPress admin patterns unless a future approved design explicitly justifies
  a new product surface. The backend complements WordPress/Elementor workflows;
  it is not a second builder.

## 2026-06-04

- Elementor Implementation Toolkit filter work should move toward a
  widget-first preset model. The primary filter-building surface is the
  Elementor widget because filter composition, target listing selection, and
  visual customization are page-contextual. The admin should act as a saved
  preset library, preview/status surface, diagnostics area, and optional
  recovery/editing surface, not as the required filter builder.
- Saved filter presets should be creatable from the Elementor widget, then
  visible in the WordPress admin as reusable records with preview and metadata.
  This mirrors the Simple Budget pattern where Elementor owns editable visual
  content while the plugin owns persistence, shell/runtime behavior, and safe
  handoff.
- Next implementation direction, not immediate work: make the Filter Controller
  cleaner and more intimate with Elementor by showing style controls only for
  filter types selected in Content, then audit every filter type for deeper
  Elementor-native frontend customization.
- QA boundary: Guilherme is the final frontend QA for visual judgment, motion,
  Elementor editing flows, hierarchy discernment, and interaction-heavy tests
  that require many screens, many clicks, or concatenated nuance. Codex visual
  inspection is still valid for punctual, honest checks such as obvious
  overlap, clipped text, blank renders, broken screenshots, missing assets, and
  simple responsive regressions. Codex may validate backend behavior, syntax,
  static checks, simple runtime paths, generated HTML, screenshots for gross
  breakage, and other mechanical evidence, but must not treat AI visual
  inspection as final approval for complex frontend craft or Elementor editor
  UX.
- Git/GitHub workflow must distinguish local checkpoints, implementation
  evidence, and public GitHub history before work starts. Public plugin work
  should declare a Git mode and commit map before accumulating commits. If a
  feature branch or main branch is ahead by more than three unpublished commits
  for one delivery slice, Codex must stop and create a publication plan instead
  of pushing or using reactive squash as the default repair.

## 2026-06-05

- Simple Budget Plugin visual work must be designed as something Guilherme can
  actually build in WordPress/Elementor. Before approving or regenerating a
  mockup, check whether the layout maps cleanly to Elementor containers,
  columns, grids, equal-height cards, and predictable responsive breakpoints.
  Avoid attractive but fragile compositions with diagonal splits across
  sections, overlapping cards, masonry/collage structure, or positioning that
  would require brittle custom CSS.
- Simple Budget Plugin presentation pages must stay inside the visual language
  already established for Guilherme's portfolio. Do not drift into a separate
  SaaS/product landing page, Casa Clara/service-company aesthetic, or a new
  brand system unless Guilherme explicitly asks for that. The default reference
  is the existing portfolio direction: dark technical profile surface,
  warm off-white project surface, subtle cyan/violet accents, restrained
  bento/card structure, and evidence-oriented project presentation.
- Split Simple Budget visual surfaces clearly. The `/work/simple-budget-plugin/`
  page is the portfolio case page and may use Guilherme's portfolio language,
  direct copy, `Guilherme Silva` identity, and a small portrait/avatar. The
  `/budget-demo/*` pages are roleplay demo pages and must use a distinct
  fictional catalog/site identity; do not reuse the portfolio header, dark
  technical hero, kingdonrush branding, or plugin-LP visual system on the demo
  pages. Keep the demo believable as a real client/catalog site that happens to
  use the plugin.
- Current Simple Budget demo image pack: one portfolio case page plus a
  fictional Aster Workspaces site pack. The fictional site frames are an
  institutional landing page, a search/listing page using the Elementor
  Implementation Toolkit filter direction, and a single product/detail page.
  The institutional LP should stay a normal company page and should not absorb
  the listing/search or detail-page jobs.
- Elementor Implementation Toolkit filter feedback must treat named filters as
  examples when Guilherme frames the issue as system-wide. For filter work,
  Codex must audit the shared contracts and every affected filter type before
  implementing a narrow repair. Required audit evidence includes source paths,
  Elementor control IDs, preset fields, render selectors, failure modes, and a
  separate implementation/test recommendation. Range, Rating, or any other
  named component must not become the entire scope unless Guilherme explicitly
  narrows the request to that component only.
- Explicit approval of an implementation-bound raster image triggers the full
  WordPress delivery pipeline: preserve the chroma/PNG source, export a
  semantic optimized WebP with alpha when needed, add factual attachment title
  and alt text, import it into the Media Library, verify the resulting
  attachment, and record its ID in the relevant asset manifest.
- Approved mockup assets must use the global `approved-asset-fidelity` skill.
  Treat the selected visual as a contract, preserve its exact geometry and
  intended shadows, and require a pixel-tight alpha bounding box with visible
  pixels touching all four final canvas edges before WordPress promotion.

## 2026-06-11

- Public website and portfolio mockups must use the global
  `ux-ui-design-director` skill before generation and before presentation. The
  skill replaces section-list-driven composition with a direction contract:
  page job, user moment, memorable truth, primary action, first three eye stops,
  section jobs, content budget, evidence, implementation map, and one deliberate
  creative risk.
- Do not show Guilherme the first generated design by default. Inspect the
  actual artifact, reject hard failures, and iterate internally when hierarchy,
  density, duplicated information, generic AI patterns, product truth, or
  Elementor feasibility are weak.
- The useful design-planning and critique concepts from `garrytan/gstack` may be
  adapted only through a minimal local skill. Do not import its updater,
  telemetry, runtime installer, global state, CLAUDE.md writes, automatic
  commits, or other operational infrastructure.

## 2026-06-12

- Impeccable is the default design-context system for the portfolio. Use
  `docs/PRODUCT.md` for strategic brand context and `docs/DESIGN.md` for stable
  visual rules before shaping, critiquing, generating, or implementing public
  interfaces. Do not maintain or consult a separate all-purpose brand-guide
  prompt; it duplicates the design system and encourages generic, oversized
  output.
- The client-facing identity is `Guilherme Silva`. The technical identity is
  `kingdonrush`, used for GitHub, repositories, code authorship, packages, and
  developer-community presence. When shown in the portfolio, `kingdonrush`
  always appears below `Guilherme Silva`, with lower visual emphasis, alongside
  the GitHub logo, and as part of one hyperlink to the GitHub profile. It must
  not act as a competing commercial brand.
- `docs/assets/` is the portfolio asset registry root. Do not place visual
  asset systems in the physical repository root. Use `docs/assets/README.md`,
  `docs/assets/asset-taxonomy.md`, and `docs/assets/asset-manifest.json` to
  classify active assets by function, channel, status, source type,
  implementation role, files, tags, approval, and WordPress/GitHub metadata.
- Asset thinking must be channel-aware. Portfolio pages, WordPress runtime,
  WordPress Media Library, Elementor references, GitHub README media, GitHub
  social previews, release notes, social posts, Open Graph images, case studies,
  demo sites, and archival sources are distinct channels and should be tagged
  explicitly.
- GitHub distribution assets are part of public plugin evidence, not leftover
  design exports. For plugins, prioritize README heroes, real editor captures,
  frontend behavior screenshots, flow frames, social previews, and proof media
  grounded in verified plugin behavior.
- The micro-component method means practical asset decomposition: code and
  Elementor own structure, layout, text, responsive behavior, connector lines,
  and interactions; imagegen or captures supply faces, products, places,
  textures, atmosphere, proof media, custom iconography, and channel-specific
  presentation assets when code would look fake or underpowered.
- Website visual work uses an image-first approval loop. Codex first generates
  and refines one complete page image per route. After explicit approval, Codex
  decomposes the approved composition into Elementor-native elements,
  code-native elements, existing icons, real screenshots, and raster assets.
  Guilherme owns final Elementor implementation and visual tuning unless he
  explicitly delegates code.
- The global `image-first-web-design` skill coordinates this workflow. It uses
  `website-image-art-direction` for full-page composition,
  `visual-image-prompting` with the official imagegen tool for rendering and
  controlled edits, `ux-ui-design-director` as the internal review gate, and
  `approved-asset-fidelity` only after approval.
- `website-image-art-direction` adapts the useful art-direction concepts from
  `Leonxlnx/taste-skill` but explicitly rejects its mandatory
  one-horizontal-image-per-section output rule. The project approval unit is
  one coherent full-page image per route.
- `visual-image-prompting` adapts prompting and editing references from
  `smixs/visual-skills` but does not select external providers, request API
  keys, or replace the available imagegen tool.
- `indigokarasu/imagine` remains rejected for direct installation because its
  package includes silent self-update behavior, global state and journaling,
  an implicit update cron, and a script that runs `git reset --hard` and
  `git clean -fd`.

## 2026-06-14

- Portfolio icon creation is strictly asset-first. Codex must never create new
  icons through handwritten SVG, CSS, canvas, HTML characters, emoji, generated
  path data, or improvised code. Icons may only come from existing
  WordPress/Elementor/theme/approved local assets, or be created through
  imagegen and then processed, optimized, registered, and imported when
  implementation-bound.
