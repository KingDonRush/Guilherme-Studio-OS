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

## Implementation Notes

- The SVGs are original simplified implementation assets, not official logo
  copies.
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
