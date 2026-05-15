# WordPress Portfolio Assets

Date: 2026-05-15

## What Was Tested

The portfolio asset pack now exists in two places:

1. Tracked source assets:
   - `docs/assets/portfolio/`
2. Local WordPress runtime copy:
   - `wordpress/wp-content/uploads/portfolio-assets/`

The runtime copy preserves the current folder structure:

- `icons/bio/`
- `icons/social/`
- `icons/tech/`
- `icons/actions/`
- `shapes/`
- `provisional/`
- `references/`
- `final/`

This is intentional. WordPress core can upload media into the Media Library, but
the default physical storage model is upload-based and date-based, not a clean
editorial folder tree.

## Commands

Sync tracked assets into the local WordPress uploads folder:

```bash
wordpress/scripts/sync-portfolio-assets.sh
```

Import the current optimized WebP implementation assets into the WordPress
Media Library:

```bash
wordpress/scripts/import-portfolio-media.sh
```

Current WebP implementation attachments:

- `Portfolio Main Background Elementor 1920x960 V2`: attachment ID `174`
  - `http://localhost:8080/wp-content/uploads/2026/05/portfolio-main-background-elementor-1920x960-v2.webp`
- `Profile Guilherme Light Match Cutout V2`: attachment ID `175`
  - `http://localhost:8080/wp-content/uploads/2026/05/profile-guilherme-light-match-cutout-v2.webp`
- `Portfolio ACF Badge WebP V2`: attachment ID `176`
  - `http://localhost:8080/wp-content/uploads/2026/05/portfolio-acf-badge-v2.webp`
- `Portfolio Crocoblock Badge WebP V2`: attachment ID `177`
  - `http://localhost:8080/wp-content/uploads/2026/05/portfolio-crocoblock-badge-v2.webp`
- `Portfolio Three.js Badge WebP V2`: attachment ID `178`
  - `http://localhost:8080/wp-content/uploads/2026/05/portfolio-threejs-badge-v2.webp`
- `Portfolio Rank Math Badge WebP V2`: attachment ID `179`
  - `http://localhost:8080/wp-content/uploads/2026/05/portfolio-rank-math-badge-v2.webp`

The import script stores `_portfolio_asset_key` post meta to avoid duplicate
imports on repeated runs.

Earlier PNG attachment IDs `154` through `162` are superseded implementation
assets. They were not deleted so existing Elementor placements do not break
before they are manually replaced with the WebP attachments above.

## SVG Decision

Do not import the SVG icon pack into the Media Library by default.

Reason:

- WordPress validates uploads through allowed MIME types.
- SVG support is not a normal safe default in WordPress core because SVG can
  carry executable/scriptable content if not sanitized.
- Our SVGs are available by direct URL from `wp-content/uploads/portfolio-assets`
  and can be used in Elementor via HTML, CSS background images, or custom markup.

Example static asset URL:

```text
http://localhost:8080/wp-content/uploads/portfolio-assets/icons/tech/threejs.svg
```

If we later need Media Library SVG selection, add a deliberate SVG sanitization
solution and document it. Do not silently widen upload permissions.

Important visual-source correction:

- The current SVG icon pack and wave shape were created manually as technical
  placeholders.
- They are not final visual assets.
- For faithful portfolio visuals, regenerate or refine these assets with
  imagegen first, then use scripts only to sync/import the approved outputs.
- The mature divider/background reference is now
  `docs/assets/portfolio/references/portfolio-divider-background-reference-v1.png`.
- The current generated complete hero is
  `docs/assets/portfolio/final/portfolio-hero-final-v9-1672.png`.
- The current background-only container asset is
  `docs/assets/portfolio/final/portfolio-main-background-elementor-1920x960-v2.webp`.
- The current transparent profile cutout for implementation is
  `docs/assets/portfolio/final/profile-guilherme-light-match-cutout-v2.webp`.
- The current transparent custom icon sheet is
  `docs/assets/portfolio/final/icons-custom/portfolio-custom-icons-sheet-transparent-v1.png`.
- The transparent custom icon sheet is a source/intermediate asset only.
- Use these individual generated WebP icons in Elementor / Media Library:
  `docs/assets/portfolio/final/icons-custom/individual-webp/portfolio-acf-badge-v2.webp`,
  `docs/assets/portfolio/final/icons-custom/individual-webp/portfolio-crocoblock-badge-v2.webp`,
  `docs/assets/portfolio/final/icons-custom/individual-webp/portfolio-threejs-badge-v2.webp`,
  and
  `docs/assets/portfolio/final/icons-custom/individual-webp/portfolio-rank-math-badge-v2.webp`.
- The individual generated icons include only ACF, Crocoblock, Three.js, and
  Rank Math. All other requested icons are available locally through Elementor
  eicons or Elementor-bundled Font Awesome.
- For WordPress Media Library, use WebP/SVG only. PNG is an intermediate/source
  format for imagegen output, chroma-key removal, or references.

## Elementor Usage

For manual Elementor implementation:

- Use Advanced > CSS ID or CSS Classes to identify containers and buttons.
- Use the static SVG URLs for custom icons where native Elementor/Font Awesome
  icons are not enough.
- Use Media Library attachment `175` for the current WebP profile cutout.
- Use Media Library attachment `174` for the current WebP background if the
  container needs a Media Library-selected background.
- Keep the hero concept image as reference, not as the implemented layout.

## Profile Wave / Shape Strategy

Elementor's local container schema exposes shape divider controls for top and
bottom dividers:

- `shape_divider_top`
- `shape_divider_bottom`

That does not directly model the vertical wavy split used between the dark bio
area and the light project grid. For that effect, use a CSS-positioned SVG asset
or pseudo-element instead of relying only on native shape dividers.

Current placeholder asset:

```text
docs/assets/portfolio/shapes/profile-edge-wave.svg
```

Runtime URL:

```text
http://localhost:8080/wp-content/uploads/portfolio-assets/shapes/profile-edge-wave.svg
```

Suggested CSS shape approach:

```css
.portfolio-profile-panel {
  position: relative;
  isolation: isolate;
  overflow: visible;
}

.portfolio-profile-panel::after {
  content: "";
  position: absolute;
  top: 0;
  right: -145px;
  width: 260px;
  height: 100%;
  background-image: url("/wp-content/uploads/portfolio-assets/shapes/profile-edge-wave.svg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  pointer-events: none;
  z-index: -1;
}
```

If using Elementor Free, place this CSS in a theme/child-theme stylesheet,
WordPress Additional CSS, or a local portfolio stylesheet. Elementor's per-widget
Custom CSS UI should not be assumed available unless Elementor Pro is present.

## Evidence

- WordPress Media Library documentation:
  <https://wordpress.org/documentation/article/media-library-screen/>
- WordPress Media Settings documentation:
  <https://wordpress.org/documentation/article/settings-media-screen/>
- WP-CLI `wp media import`:
  <https://developer.wordpress.org/cli/commands/media/import/>
- WordPress allowed MIME types and `upload_mimes` filter:
  <https://developer.wordpress.org/reference/functions/get_allowed_mime_types/>
- Elementor Advanced tab:
  <https://elementor.com/help/advanced-tab/>
- Elementor custom CSS:
  <https://elementor.com/help/custom-css-in-elementor/>
- Elementor shape hook docs:
  <https://developers.elementor.com/docs/hooks/shapes/>
