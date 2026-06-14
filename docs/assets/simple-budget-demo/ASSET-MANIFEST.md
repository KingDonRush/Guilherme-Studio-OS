# Simple Budget Case Asset Manifest

## Ready

### Portfolio reuse

- WordPress, Elementor, and social SVGs:
  `docs/assets/portfolio/icons/`

### Case-specific assets

- Guilherme header profile badge:
  `profile/wordpress/guilherme-silva-wordpress-developer-profile-badge-v1.webp`
- Locked rigid-page pictogram:
  `icons/wordpress/simple-budget-plugin-rigid-page-locked-layout-v3.webp`
- Product cutouts with transparent shadows:
  `products/wordpress/*.webp`
- Dark technical hero background:
  `backgrounds/wordpress/simple-budget-plugin-dark-technical-hero-background-1920x960-v1.webp`
  - Source PNG:
    `backgrounds/source/case-hero-dark-technical-background-v1.png`
- Approved full-page reference:
  `01-case-portfolio-v4-spacious.png`
- Current real Elementor evidence candidates:
  - `evidence/wordpress/simple-budget-open-cart-button-editor-v1.webp`
  - `evidence/wordpress/simple-budget-listing-editor-v1.webp`
  - `evidence/wordpress/simple-budget-cart-template-editor-v1.webp`
  - Raw browser captures remain in `evidence/source/`.

## WordPress Media Library

| Attachment ID | Asset | Dimensions | Alt text |
| --- | --- | --- | --- |
| `430` | Aster Workspaces Ergo Lounge Chair | 912 x 1147 | `Charcoal ergonomic lounge chair` |
| `431` | Aster Workspaces Acoustic Meeting Pod | 934 x 1191 | `Single-person acoustic meeting pod with glass door` |
| `432` | Aster Workspaces Linear Acoustic Light | 1276 x 835 | `Suspended linear acoustic office light in gray felt and black metal` |
| `460` | Simple Budget Plugin Rigid Page Illustration | 842 x 1235 | `Locked rigid plugin page layout` |
| `434` | Simple Budget Plugin Dark Technical Hero Background | 1920 x 960 | Empty because the background is decorative |
| `435` | Guilherme Silva WordPress Developer Profile Badge | 768 x 768 | `Guilherme Silva, WordPress developer` |

All six attachments use `image/webp`, semantic filenames, optimized file sizes,
human-readable titles, and verified Media Library metadata. The rigid-page
illustration also passes the pixel-tight alpha-bounds check on all four edges.

## Real Elementor Capture Status

The current case implementation uses three captures from the real local
Elementor editor:

- Budget Button with `Open budget popup` and real cart-shell controls.
- Budget Listing with real visibility controls and editor preview.
- The real Simple Budget cart template on the Elementor canvas.

These are candidate assets until Guilherme approves the redesigned case.

## Still required

1. A focused add-item capture:
   - Budget Button selected.
   - `Budget Action` section visible.
   - `Action: Add current item`.
   - `Item Source: Current post`.
   - `Quantity: 1`.
   - Product preview with the real button.
2. A stronger cart-template preview:
   - `Design Preview` controls visible.
   - Three real preview products.

## Build in Elementor

Do not create image assets for:

- headings, labels, paragraphs, and CTA buttons;
- section numbers and divider rules;
- comparison cards and connector arrows;
- check rows and four-step lists;
- icon tiles and technical-proof columns;
- white/off-white section backgrounds;
- borders, shadows, spacing, and responsive layout.

See `icons/README.md` for the exact native icon mapping.
