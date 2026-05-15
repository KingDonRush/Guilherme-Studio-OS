# Portfolio Asset Pack

Date: 2026-05-15

This folder stores the current implementation assets for the portfolio hero.
These are human-facing design assets, so they belong in `docs/`, not `.ai/`.

## Provisional Baseline

- `provisional/portfolio-hero-provisional-v1.png`
  - Saved copy of the latest approved provisional hero concept.
  - Source copy: `docs/assets/portfolio-home-v8-card-accents.png`.
- `provisional/profile-photo-framed-v1.png`
  - Cropped profile/photo block from the provisional hero.
  - Use as a visual reference for the Elementor implementation, not as a
    locked final export.

## Current Final / Reference Assets

- `references/portfolio-divider-background-reference-v1.png`
  - Mature divider/background reference supplied after the provisional hero.
  - Treat this as the current standard for the dark background and diagonal
    versus-style split.
- `final/portfolio-hero-final-v9-1672.png`
  - Current complete hero concept using the mature divider direction and
    corrected Guilherme portrait treatment.
  - Restores project stack badges and feature-specific previews from the
    stronger provisional reference.
  - Replaces generic `3D` / `SEO` badges with Three.js and Rank Math / Yoast
    signals.
  - Removes decorative technology icons from the background and applies the
    current style direction across the whole layout: dark editorial bento,
    subtle glassmorphism, grain texture, warm paper surface, and Swiss/minimal
    card structure.
- `final/portfolio-main-background-v1.png`
  - Superseded PNG background-only export for the main hero/container.
  - Contains only the dark biography side, warm off-white projects side,
    divider glow, subtle grain, and left-side gradient depth.
  - Does not include portrait, text, project cards, buttons, social dock, or
    stack icons.
- `final/portfolio-main-background-elementor-1920x960-v2.webp`
  - Current WebP implementation background for the Elementor main hero
    container.
  - Uses a 2:1 desktop/container-friendly ratio to avoid the earlier Elementor
    background sizing mismatch.
  - Rebuilds the background from the approved hero direction as a
    foreground-removed asset, with cyan/blue light in the portrait field and
    violet/purple light near the divider.
- `final/profile-guilherme-chroma-v1.png`
  - Chroma-key source generated with imagegen from Guilherme's portrait.
- `final/profile-guilherme-cutout-v2.png`
  - Transparent PNG after local chroma-key removal.
- `final/profile-guilherme-cool-cutout-v1.png`
  - Superseded transparent PNG portrait asset.
  - Uses a cooler studio balance and cyan/violet rim light to fit the divider
    and dark gradient background.
- `final/profile-guilherme-light-match-cutout-v2.webp`
  - Current WebP transparent portrait asset for implementation.
  - Cropped to the alpha boundary, with no extra transparent canvas margin.
  - Lighting is matched to the background: cyan/blue on the viewer-left side
    and violet/purple on the viewer-right side.
- `final/icons-custom/custom-icon-sheet-chroma-v2.png`
  - Chroma-key sheet for only the missing custom icon set: ACF, Crocoblock,
    Three.js, and Rank Math.
- `final/icons-custom/portfolio-custom-icons-sheet-transparent-v1.png`
  - Transparent PNG source sheet for only the missing custom icon set:
    ACF, Crocoblock, Three.js, and Rank Math.
  - Do not add WordPress, Elementor, WooCommerce, PHP, JavaScript, CSS, Git,
    Yoast, social, GitHub, action, performance, code, desktop, or briefcase
    icons here because local Elementor/Font Awesome already provides them.
- `final/icons-custom/individual/portfolio-acf-badge-transparent-v1.png`
- `final/icons-custom/individual/portfolio-crocoblock-badge-transparent-v1.png`
- `final/icons-custom/individual/portfolio-threejs-badge-transparent-v1.png`
- `final/icons-custom/individual/portfolio-rank-math-badge-transparent-v1.png`
  - Superseded individual transparent PNGs.
  - These were cropped programmatically from
    `portfolio-custom-icons-sheet-transparent-v1.png` and normalized to
    512x512 transparent canvases.
- `final/icons-custom/individual-webp/portfolio-acf-badge-v2.webp`
- `final/icons-custom/individual-webp/portfolio-crocoblock-badge-v2.webp`
- `final/icons-custom/individual-webp/portfolio-threejs-badge-v2.webp`
- `final/icons-custom/individual-webp/portfolio-rank-math-badge-v2.webp`
  - Current individual WebP implementation icons for Elementor/media use.
  - Cropped to their alpha boundary and optimized as WebP.
- `icon-evidence-2026-05-15.md`
  - Local Elementor/Font Awesome/eicons evidence table for native versus
    generated icon decisions.

## Icon Folders

- `icons/bio/`
  - Role icons for the profile area:
    WordPress Developer, Elementor Implementation, WooCommerce, Custom
    Solutions, Jobs + Freelance.
- `icons/social/`
  - Contact icons for LinkedIn, WhatsApp, email, Instagram, and GitHub.
- `icons/tech/`
  - Project-level technology badges:
    WordPress, Elementor, WooCommerce, PHP, JavaScript, CSS, Git, ACF,
    Crocoblock, Three.js, Rank Math SEO, and Performance.
- `icons/actions/`
  - Card action icons for the next interaction pass:
    `see-project-eye.svg` and `github-action.svg`.
- `shapes/`
  - CSS/SVG shape assets for the portfolio hero:
    `profile-edge-wave.svg`.

## Implementation Notes

- The SVGs are original simplified implementation placeholders, not official
  logo copies and not final imagegen-approved visual assets.
- Final high-fidelity visual assets should be regenerated or refined with
  imagegen before portfolio production work depends on them.
- For final production, replace social/contact marks with Elementor's native
  Font Awesome brand icons when they are available and visually consistent.
- Keep the profile free from a global tech-stack strip. Put stack icons inside
  project cards.
- Replace the generic `3D` badge in the 3D Viewer card with
  `icons/tech/threejs.svg`.
- Replace the generic `SEO` badge in implementation cards with
  `icons/tech/rank-math.svg` when the case study is built around Rank Math.
- For card actions, prefer this future behavior:
  - the card itself reveals an eye icon plus `See project` on hover/focus;
  - plugin/system cards keep GitHub as a separate small action;
  - site implementation cards do not need GitHub unless a public repo exists.
- `shapes/profile-edge-wave.svg` is a technical placeholder for the
  dark-profile-to-light-grid wave split. Use it only until an imagegen-approved
  divider/background asset replaces it or the user explicitly approves the SVG.

Current correction:

- The old wave divider is superseded by
  `references/portfolio-divider-background-reference-v1.png`.
- Do not use the generated random-human outputs from
  `/home/kingdonrush/.codex/generated_images/019e2b20-c9b1-7062-8971-d3052cfc23b3/`
  as portfolio assets. The accepted profile direction is
  `final/profile-guilherme-cutout-v2.png`.
- Yoast is available as a local Font Awesome brand icon. Do not generate a
  duplicate Yoast icon. Use the generated Rank Math badge only because Rank
  Math is not present in the local Elementor/Font Awesome icon set.
- WordPress implementation assets must be imported as WebP or SVG, not PNG.
  PNG files in this folder are source/intermediate/reference assets unless
  explicitly marked otherwise.

## Evidence Notes

Elementor:

- Elementor documents that the Advanced tab contains CSS ID and CSS Classes,
  and that CSS ID targets a widget with custom CSS rules:
  <https://elementor.com/help/advanced-tab/>
- Elementor documents Clear Files & Data as a CSS/data cache regeneration step:
  <https://elementor.com/help/regenerate-css-data/>
- Elementor documents custom icon workflows through Fontello, IcoMoon, or
  Fontastic, including upload of custom SVG files:
  <https://elementor.com/help/custom-icons-pro/>
- Local WP-CLI check on 2026-05-15 showed Elementor active at version `4.0.8`
  in this workspace.

Three.js:

- The official Three.js repository describes the project as a JavaScript 3D
  library and includes the upstream project icon:
  <https://github.com/mrdoob/three.js>

SEO plugin badge:

- Rank Math is the current provisional SEO badge because its WordPress.org
  plugin page lists 4+ million active installations and explicitly mentions
  Elementor SEO plus WooCommerce SEO support:
  <https://wordpress.org/plugins/seo-by-rank-math/>
- Yoast remains a valid alternative and has the larger installation base
  according to WordPress.org, but the current badge is selected for the
  Elementor/WooCommerce portfolio context rather than as a universal "best SEO
  plugin" claim:
  <https://wordpress.org/plugins/wordpress-seo/>
