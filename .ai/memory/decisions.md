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
