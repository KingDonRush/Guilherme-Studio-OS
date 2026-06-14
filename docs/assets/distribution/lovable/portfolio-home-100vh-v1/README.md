# Portfolio Home Lovable Handoff

This package implements one approved desktop portfolio direction for Guilherme
Silva.

## Source Of Truth

Use `reference/portfolio-home-100vh-approved-v1.png` as the composition
contract.

Do not use the complete mockup or the files in `reference-panels/` as rendered
page backgrounds. Rebuild their structure as semantic responsive components.

## Production Assets

- `assets/identity/`
  - Exact approved Guilherme Silva portrait cutout.
- `assets/products/`
  - Product media for Simple Budget, 3D Viewer, and WooCommerce previews.
- `assets/architecture/`
  - Production WebPs plus archival PNG sources.
- `assets/stack-icons/`
  - Custom marks not guaranteed to exist in the default icon set.

Use only icons already bundled in this package, already available in the target
WordPress/Elementor/theme environment, or explicitly approved as local assets.
If a required icon is missing or visually weak, create it through imagegen and
process it as an asset before implementation.

Do not create new icons with Lucide, Simple Icons, handwritten SVG, CSS, canvas,
HTML characters, emoji, generated path data, or improvised code during
implementation.

## Reference-Only Assets

The six files in `reference-panels/` communicate hierarchy, crop, density, and
content grouping. Do not ship them as flattened project cards.

## Implementation Boundary

- Desktop at approximately `1672x941`: entire composition fits inside `100svh`.
- Smaller desktop/tablet/mobile: allow vertical flow and recompose the grid.
- Keep text, controls, links, badges, and project surfaces as HTML/CSS.
- Preserve the portrait identity exactly.
- Do not invent metrics, prices, clients, controls, or plugin features.

See `PROMPT.md` for the ready-to-use Lovable instruction and
`asset-manifest.json` for file roles.
