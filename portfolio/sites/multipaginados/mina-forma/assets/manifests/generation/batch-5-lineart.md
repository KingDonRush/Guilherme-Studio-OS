# Mina Forma Batch 5 Line-Art Manifest

Scope: line-art, blueprint backgrounds, map/floorplan support assets and icon
sets for the Mina Forma institutional demo. This batch intentionally does not
turn UI controls into images.

Output directory:

`runtime/generated/assets/mina-forma/batch-5-lineart/`

## Assets

| asset_id | path | webp_path_or_blank | checksum_sha256 | status | prompt_or_source | notes |
| --- | --- | --- | --- | --- | --- | --- |
| `mf-services-cta-blueprint-v1` | `runtime/generated/assets/mina-forma/batch-5-lineart/mf-services-cta-blueprint-v1.png` | `runtime/generated/assets/mina-forma/batch-5-lineart/mf-services-cta-blueprint-v1.webp` | `cadee419e326d373cdd12ba5e4620b1fad08cb0ae959d37763da06a2c440c12e` | `generated` | Built-in `image_gen`: dark ink architectural blueprint CTA banner, sparse floor plan fragments, calm center-left area, cyan/clay micro accents. | Primary services CTA background. WebP checksum: `06eb2ca668cd120bc2d3345af77a4b6bb5ebca31d9db3efeda12407a5e72dab7`. |
| `mf-contact-blueprint-overlay` | `runtime/generated/assets/mina-forma/batch-5-lineart/mf-contact-blueprint-overlay.png` | `runtime/generated/assets/mina-forma/batch-5-lineart/mf-contact-blueprint-overlay.webp` | `6ab135950d500402ebee2f3f29a3c48a25fd015af18fd164228fe0b0df87a146` | `generated` | Built-in `image_gen`: subtle dark contact CTA blueprint overlay with quiet middle area and sparse linework. | Use behind final contact CTA. WebP checksum: `e9d3a0aea3153ee40747a22c9f01f9c3b43f14d6a95db6438d5fe15c86004dfd`. |
| `mf-contact-map-line-art` | `runtime/generated/assets/mina-forma/batch-5-lineart/mf-contact-map-line-art.png` | `runtime/generated/assets/mina-forma/batch-5-lineart/mf-contact-map-line-art.webp` | `00d2bc2df9309ea725fd95b1ebd0c27f95bc143a7f555172a0168f0556530785` | `generated` | Built-in `image_gen`: fictional Belo Horizonte-inspired neighborhood map, off-white paper, ink street grid, clay `M` marker, cyan route accent. | Fictional map only; not real map data. WebP checksum: `49b1d8803a5c639a592048159861f1ffd3885b5d44e6df3173d5ecbeace2f246`. |
| `aurora-cafe-floorplan-notes` | `runtime/generated/assets/mina-forma/batch-5-lineart/aurora-cafe-floorplan-notes.png` | `runtime/generated/assets/mina-forma/batch-5-lineart/aurora-cafe-floorplan-notes.webp` | `605b1e1ce17289c3fd356e77caf3fc202632fcb3bbf59729dd29d35d10e3b556` | `generated` | Built-in `image_gen`: hand-drawn Aurora Cafe floorplan process sketch with counter, seating, circulation and abstract annotations. | Case-detail support asset, not UI. WebP checksum: `e8e355efc0757aa7302822d445601f1c3f45f5aba5a56688f21aabf0717e89ce`. |
| `mf-footer-blueprint-lineart` | `runtime/generated/assets/mina-forma/batch-5-lineart/mf-footer-blueprint-lineart.svg` |  | `42a30784e2830e77f0f28cb823b642bca849cdbff0919803df6f272c3b331713` | `svg-created` | Manual SVG: transparent wide footer blueprint line-art for dark footer contexts. | Editable vector. Use CSS opacity/color if needed. |
| `footer-blueprint-line-art` | `runtime/generated/assets/mina-forma/batch-5-lineart/footer-blueprint-line-art.svg` |  | `8ebec764fed60ddf4c3222cbe60d6fecce613ff26132c831be210310bb712007` | `svg-created` | Manual SVG: alternate wide footer blueprint line-art. | Kept because inventory had both naming variants. |
| `mf-proof-strip-icons` | `runtime/generated/assets/mina-forma/batch-5-lineart/mf-proof-strip-icons.svg` |  | `08b9cb3e2d0828026e99124b5fd59fdf75df3af0f1efe57dc5b167da07170e37` | `svg-created` | Manual SVG icon set: scope/target, estimate document, calculator-like summary and send action. | Visual support only; not buttons or controls. |
| `mf-contact-summary-icons` | `runtime/generated/assets/mina-forma/batch-5-lineart/mf-contact-summary-icons.svg` |  | `d4fc82fbe309fb9c4ed308f7687970ad57606ec35e240bf86b3bdcdb78519b02` | `svg-created` | Manual SVG icon set: space type, current stage, decision window and constraints. | Can be split into inline SVGs during implementation. |
| `sbp-support-icons` | `runtime/generated/assets/mina-forma/batch-5-lineart/sbp-support-icons.svg` |  | `eebffe055405cfe12810b2d36ece54ae3b86b2728ec384aedc61699561ef0ec3` | `svg-created` | Manual SVG icon set: info, shield check and review clock. | SBP support icons only; no SBP UI controls are images. |
| `mf-service-process-icons` | `runtime/generated/assets/mina-forma/batch-5-lineart/mf-service-process-icons.svg` |  | `1d89a0beffd95756f0e636cd1c84afd92bbc78beca29f98ac4e2f73b91986fb8` | `svg-created` | Manual SVG set for service/process concepts: brief, spatial layout, spec sheets, joinery, plan, detail and implementation. | Covers service/process icon-set need without rasterizing icons. |
| `mf-contact-channel-icons` |  |  |  | `use-library` | Use bundled Font Awesome/Elementor icons for email, WhatsApp and LinkedIn. | Do not generate raster icons. |
| `mf-contact-footer-social-icons` |  |  |  | `use-library` | Use bundled Font Awesome/Elementor social icons. | Footer links remain HTML/CSS. |
| `mf-contact-arrow-icon` |  |  |  | `use-library` | Use Font Awesome arrow or CSS text arrow. | Do not generate arrow raster. |
| `mf-contact-form-lock-icon` |  |  |  | `use-library` | Use Font Awesome lock icon. | Privacy note only. |
| `mf-contact-accordion-plus` |  |  |  | `use-library` | Use CSS text plus/minus. | Accordion control is UI, not image. |
| `mf-taxonomy-filter-icons-v1` |  |  |  | `deferred` | Optional taxonomy symbols can be Font Awesome or a later SVG set if the final filters need icons. | Text-only filters are acceptable for the current design. |

## Non-Image UI Boundary

The following remain HTML/CSS/plugin behavior: buttons, cards, forms, filter
chips, accordions, plus/minus controls, SBP item layout, quantities, prices,
subtotal, estimated total, CTAs, borders, grids and labels.

## Verification

- Generated PNGs were copied from the built-in `image_gen` output directory.
- WebP variants were created with Pillow at quality 88.
- SVG files parse as valid XML with Python `xml.etree.ElementTree`.
- PNG/WebP dimensions were opened with Pillow.
- A visual contact sheet was inspected locally for the four generated PNGs.
