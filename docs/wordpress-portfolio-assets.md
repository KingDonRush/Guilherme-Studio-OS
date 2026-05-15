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

This is intentional. WordPress core can upload media into the Media Library, but
the default physical storage model is upload-based and date-based, not a clean
editorial folder tree.

## Commands

Sync tracked assets into the local WordPress uploads folder:

```bash
wordpress/scripts/sync-portfolio-assets.sh
```

Import the two PNG reference assets into the WordPress Media Library:

```bash
wordpress/scripts/import-portfolio-media.sh
```

Current imported attachments:

- `Portfolio Hero Provisional V1`: attachment ID `152`
- `Profile Photo Framed V1`: attachment ID `153`

The import script stores `_portfolio_asset_key` post meta to avoid duplicate
imports on repeated runs.

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

## Elementor Usage

For manual Elementor implementation:

- Use Advanced > CSS ID or CSS Classes to identify containers and buttons.
- Use the static SVG URLs for custom icons where native Elementor/Font Awesome
  icons are not enough.
- Use Media Library attachment `153` for the framed profile photo if a normal
  image widget is easier.
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
