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
