# Portfolio Icon Library

Standalone icon package for the Guilherme Silva portfolio and its project
previews.

## Directories

- `portfolio/brand-tech/`: technology and platform marks already used by the
  WordPress theme.
- `portfolio/capabilities/`: icons for the professional capability list.
- `portfolio/social/`: contact and social icons.
- `portfolio/actions/`: project and repository action icons.
- `custom-badges/`: approved raster badges whose final appearance is not
  equivalent to the fallback SVG mark.
- `interface/`: standalone SVG controls extracted from Font Awesome Free
  bundled with the local Elementor installation.
- `LICENSES/`: attribution and license notices.

## Usage

This package is historical/exported material from the previous handoff. Do not
use it as permission to create new icons in code.

For new work, use icons already available in WordPress, Elementor, the active
theme, or an approved local package. If a required icon is missing or visually
weak, create it through imagegen and process it as a normal asset.

Do not inject new SVG markup, use masks, draw CSS icons, or create path data to
invent icons during implementation.

Use the WebP version from `custom-badges/` when the approved mockup shows that
specific badge. The similarly named SVG is a simpler fallback, not a visual
replacement.

`preview.html` is a local contact sheet for checking the package.

## Provenance

The portfolio icons were copied from:

`wordpress/wp-content/themes/guilherme-portfolio/assets/icons/`

The generic interface paths were extracted from:

`wordpress/wp-content/plugins/elementor/assets/lib/font-awesome/json/`

See `icon-manifest.json` for hashes, categories, and source information.

## Trademark Note

WordPress, Elementor, WooCommerce, GitHub, PHP, JavaScript, ACF, Three.js,
Rank Math, Crocoblock, and social platform names and marks belong to their
respective owners. Their inclusion identifies technologies used by the
portfolio and does not imply endorsement.
