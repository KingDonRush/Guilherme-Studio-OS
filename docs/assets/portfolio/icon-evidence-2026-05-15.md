# Portfolio Icon Evidence

Date: 2026-05-15

Scope: portfolio hero icons for Guilherme Silva / `kingdonrush`.

Local evidence sources:

- Elementor plugin header: `wordpress/wp-content/plugins/elementor/elementor.php`
  reports Elementor `4.0.8`.
- Font Awesome bundled by Elementor:
  `wordpress/wp-content/plugins/elementor/assets/lib/font-awesome/`
  reports Font Awesome Free `5.15.3`.
- Font Awesome JSON checked:
  `brands.json`, `solid.json`, `regular.json`.
- Elementor eicons checked:
  `wordpress/wp-content/plugins/elementor/assets/lib/eicons/eicons.json`
  and `css/elementor-icons.css`.
- 3D Viewer code checked:
  `wordpress/wp-content/plugins/3d-viewer-to-elementor/assets/js/viewer-core.js`
  imports Three.js.

## Decision Table

| Icon | Section | Exists in local Elementor / Font Awesome? | Evidence | Action |
| --- | --- | --- | --- | --- |
| WordPress Developer | Bio | Yes | Font Awesome `brands:wordpress`; Elementor eicon `eicon-wordpress` | Use native |
| Elementor Implementation | Bio | Yes | Font Awesome `brands:elementor`; Elementor eicon `eicon-elementor` | Use native |
| WooCommerce | Bio / tech | Yes via Elementor eicons | `eicon-woocommerce`; no local Font Awesome match | Use Elementor eicon or custom only if widget path requires raster |
| Custom Solutions | Bio | Yes | Font Awesome `solid:puzzle-piece` | Use native |
| Jobs + Freelance | Bio | Yes | Font Awesome `solid:briefcase` | Use native |
| LinkedIn | Social | Yes | Font Awesome `brands:linkedin-in` / `brands:linkedin` | Use native |
| WhatsApp | Social | Yes | Font Awesome `brands:whatsapp` | Use native |
| Email | Social | Yes | Font Awesome `solid:envelope`, `regular:envelope` | Use native |
| Instagram | Social | Yes | Font Awesome `brands:instagram` | Use native |
| GitHub | Social / action | Yes | Font Awesome `brands:github` | Use native |
| WordPress | Stack | Yes | Font Awesome `brands:wordpress`; Elementor eicon `eicon-wordpress` | Use native |
| Elementor | Stack | Yes | Font Awesome `brands:elementor`; Elementor eicon `eicon-elementor` | Use native |
| WooCommerce | Stack | Yes via Elementor eicons | `eicon-woocommerce`, `eicon-woo-cart` | Use Elementor eicon |
| PHP | Stack | Yes | Font Awesome `brands:php` | Use native |
| JavaScript | Stack | Yes | Font Awesome `brands:js` | Use native |
| CSS | Stack | Yes | Font Awesome `brands:css3-alt` | Use native |
| Git | Stack | Yes | Font Awesome `brands:git-alt`, `brands:git` | Use native |
| ACF | Stack | No | No local Font Awesome/eicons match | Generated with imagegen; verify official mark if public brand accuracy becomes critical |
| Crocoblock | Stack | No | No local Font Awesome/eicons match | Generated with imagegen; verify official mark before treating as official logo |
| Three.js | Stack | No local icon; yes local tech evidence | 3D Viewer imports Three.js in local plugin code | Generated with imagegen |
| Rank Math SEO | Stack | No | No local Font Awesome/eicons match | Generated with imagegen for provisional SEO badge |
| Yoast SEO | Stack alternative | Yes | Font Awesome `brands:yoast` | Use native only if a case study uses Yoast |
| Performance | Stack | Yes | Font Awesome `solid:tachometer-alt` | Use native |
| GitHub/action | Cards | Yes | Font Awesome `brands:github` | Use native; top plugin/system cards only |
| See project/action | Cards | Yes | Font Awesome `solid:eye`, `regular:eye` | Use native |
| Puzzle/custom systems | Cards | Yes | Font Awesome `solid:puzzle-piece` | Use native |
| Desktop/implementation | Cards | Yes | Font Awesome `solid:desktop`; Elementor eicon `eicon-device-desktop` | Use native |

## Generated Icon Assets

Only the missing set was generated:

- `docs/assets/portfolio/final/icons-custom/custom-icon-sheet-chroma-v1.png`
- `docs/assets/portfolio/final/icons-custom/acf-transparent-v1.png`
- `docs/assets/portfolio/final/icons-custom/crocoblock-transparent-v1.png`
- `docs/assets/portfolio/final/icons-custom/threejs-transparent-v1.png`
- `docs/assets/portfolio/final/icons-custom/rank-math-transparent-v1.png`

Current v2 sheet:

- `docs/assets/portfolio/final/icons-custom/custom-icon-sheet-chroma-v2.png`
- `docs/assets/portfolio/final/icons-custom/acf-transparent-v2.png`
- `docs/assets/portfolio/final/icons-custom/crocoblock-transparent-v2.png`
- `docs/assets/portfolio/final/icons-custom/threejs-transparent-v2.png`
- `docs/assets/portfolio/final/icons-custom/rank-math-transparent-v2.png`

Current implementation sheet:

- `docs/assets/portfolio/final/icons-custom/portfolio-custom-icons-sheet-transparent-v1.png`
  contains the generated ACF, Crocoblock, Three.js, and Rank Math badges on a
  transparent background.

Current individual implementation assets:

- `docs/assets/portfolio/final/icons-custom/individual-webp/portfolio-acf-badge-v2.webp`
- `docs/assets/portfolio/final/icons-custom/individual-webp/portfolio-crocoblock-badge-v2.webp`
- `docs/assets/portfolio/final/icons-custom/individual-webp/portfolio-threejs-badge-v2.webp`
- `docs/assets/portfolio/final/icons-custom/individual-webp/portfolio-rank-math-badge-v2.webp`

These individual transparent WebPs were cropped programmatically to their alpha
boundaries and should be used for Media Library / Elementor placement. The PNG
sheet is a source/intermediate asset, not the preferred implementation asset.

The generated ACF, Crocoblock, Three.js, and Rank Math icons are custom
portfolio badge assets, not official logo files.

Yoast is intentionally not generated because the local Elementor-bundled Font
Awesome library includes `brands:yoast`.
