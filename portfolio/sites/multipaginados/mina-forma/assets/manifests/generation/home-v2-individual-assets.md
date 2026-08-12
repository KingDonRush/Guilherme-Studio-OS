# Home V2 Individual Assets

Date: 2026-07-02

Source visual contract:

- `assets/mockups/mina-forma-home-mockup-v2.png`

Rule followed:

- one imagegen call per distinct asset;
- no packed asset sheet;
- no crop from the full-page mockup;
- generated icons and decorative shapes used chroma-key first, then local alpha
  extraction and trim validation.

Runtime review files:

- raw generated PNGs:
  `runtime/generated/assets/mina-forma/home-v2-individual/assets/raw/`
- transparent alpha PNGs:
  `runtime/generated/assets/mina-forma/home-v2-individual/assets/alpha/`
- raw contact sheet:
  `runtime/generated/assets/mina-forma/home-v2-individual/home-v2-individual-contact-sheet.png`
- final WebP review sheet:
  `runtime/generated/assets/mina-forma/home-v2-individual/home-v2-final-webp-review-sheet.png`

Production WebP folder:

- `assets/wordpress/home-v2-individual/`

## Assets

| asset_id | category | production file | dimensions | alpha | placement |
| --- | --- | --- | ---: | --- | --- |
| `mina-home-v2-hero-reception-interior` | photo | `home-v2-individual/mina-home-v2-hero-reception-interior.webp` | 1516x1038 | no | Home hero image |
| `mina-home-v2-field-materials` | photo/detail | `home-v2-individual/mina-home-v2-field-materials.webp` | 1000x1000 | no | Field Notes material tile |
| `mina-home-v2-field-floor-plan` | photo/detail | `home-v2-individual/mina-home-v2-field-floor-plan.webp` | 1000x1000 | no | Field Notes plan tile |
| `mina-home-v2-field-chair-corner` | photo/detail | `home-v2-individual/mina-home-v2-field-chair-corner.webp` | 1000x1000 | no | Field Notes interior tile |
| `mina-home-v2-project-retail-fitout` | project photo | `home-v2-individual/mina-home-v2-project-retail-fitout.webp` | 1200x900 | no | Featured Projects card |
| `mina-home-v2-project-cafe-counter` | project photo | `home-v2-individual/mina-home-v2-project-cafe-counter.webp` | 1200x900 | no | Featured Projects card |
| `mina-home-v2-project-studio-reception` | project photo | `home-v2-individual/mina-home-v2-project-studio-reception.webp` | 1200x900 | no | Featured Projects card |
| `mina-home-v2-cta-planning-desk` | banner photo | `home-v2-individual/mina-home-v2-cta-planning-desk.webp` | 1920x640 | no | Home CTA image |
| `mina-home-v2-paper-grain` | texture | `home-v2-individual/mina-home-v2-paper-grain.webp` | 900x900 | no | Optional page background texture |
| `mina-home-v2-icon-calendar-check` | icon | `home-v2-individual/mina-home-v2-icon-calendar-check.webp` | 495x512 | yes | Hero attribute icon |
| `mina-home-v2-icon-storefront` | icon | `home-v2-individual/mina-home-v2-icon-storefront.webp` | 512x498 | yes | Hero attribute icon |
| `mina-home-v2-icon-scope-document` | icon | `home-v2-individual/mina-home-v2-icon-scope-document.webp` | 389x512 | yes | Hero attribute icon |
| `mina-home-v2-shape-corner-mark` | decorative shape | `home-v2-individual/mina-home-v2-shape-corner-mark.webp` | 256x238 | yes | Card/project corner marker |
| `mina-home-v2-icon-orange-arrow` | decorative icon | `home-v2-individual/mina-home-v2-icon-orange-arrow.webp` | 256x102 | yes | Service/CTA arrow |

## Checksum

The production WebPs are included in:

- `assets/manifests/wordpress-webp-sha256.txt`

## Approved Fidelity Refresh

The `mina-home-v2-cta-planning-desk` banner was regenerated and approved by
Guilherme on 2026-07-02 against the Home V2 visual contract.

- approved raw PNG:
  `runtime/generated/assets/mina-forma/home-v2-individual/assets/approved/mina-home-v2-cta-planning-desk-approved-v2.png`
- production output: `1920x640` opaque WebP;
- composition invariants: one open architectural sketchbook on the right, one
  diagonal black pen, two separated rectangular material samples, and broad
  warm negative space on the left;
- previous production WebP preserved under:
  `runtime/backups/assets/mina-forma/2026-07-02-cta-planning-desk/`;
- attachment `724` retained and its registered WordPress image sizes were
  regenerated after replacement.

## WordPress Media Library

Imported on 2026-07-02 into local WordPress.

Group:

- taxonomy: `studio_media_group`
- name: `Mina Forma - Home v2 Individual Assets`
- slug: `mina-forma-home-v2-individual-assets`
- term ID: `44`
- count after recount: `14`

| asset_id | attachment ID | Media Library URL |
| --- | ---: | --- |
| `mina-home-v2-hero-reception-interior` | 717 | `http://100.91.124.42:8080/wp-content/uploads/2026/07/mina-home-v2-hero-reception-interior.webp` |
| `mina-home-v2-field-materials` | 718 | `http://100.91.124.42:8080/wp-content/uploads/2026/07/mina-home-v2-field-materials.webp` |
| `mina-home-v2-field-floor-plan` | 719 | `http://100.91.124.42:8080/wp-content/uploads/2026/07/mina-home-v2-field-floor-plan.webp` |
| `mina-home-v2-field-chair-corner` | 720 | `http://100.91.124.42:8080/wp-content/uploads/2026/07/mina-home-v2-field-chair-corner.webp` |
| `mina-home-v2-project-retail-fitout` | 721 | `http://100.91.124.42:8080/wp-content/uploads/2026/07/mina-home-v2-project-retail-fitout.webp` |
| `mina-home-v2-project-cafe-counter` | 722 | `http://100.91.124.42:8080/wp-content/uploads/2026/07/mina-home-v2-project-cafe-counter.webp` |
| `mina-home-v2-project-studio-reception` | 723 | `http://100.91.124.42:8080/wp-content/uploads/2026/07/mina-home-v2-project-studio-reception.webp` |
| `mina-home-v2-cta-planning-desk` | 724 | `http://100.91.124.42:8080/wp-content/uploads/2026/07/mina-home-v2-cta-planning-desk.webp` |
| `mina-home-v2-paper-grain` | 725 | `http://100.91.124.42:8080/wp-content/uploads/2026/07/mina-home-v2-paper-grain.webp` |
| `mina-home-v2-icon-calendar-check` | 726 | `http://100.91.124.42:8080/wp-content/uploads/2026/07/mina-home-v2-icon-calendar-check.webp` |
| `mina-home-v2-icon-storefront` | 727 | `http://100.91.124.42:8080/wp-content/uploads/2026/07/mina-home-v2-icon-storefront.webp` |
| `mina-home-v2-icon-scope-document` | 728 | `http://100.91.124.42:8080/wp-content/uploads/2026/07/mina-home-v2-icon-scope-document.webp` |
| `mina-home-v2-shape-corner-mark` | 729 | `http://100.91.124.42:8080/wp-content/uploads/2026/07/mina-home-v2-shape-corner-mark.webp` |
| `mina-home-v2-icon-orange-arrow` | 730 | `http://100.91.124.42:8080/wp-content/uploads/2026/07/mina-home-v2-icon-orange-arrow.webp` |

Import evidence:

- `runtime/wordpress-media-imports/mina-forma-home-v2/initial-import.json`
- `runtime/wordpress-media-imports/mina-forma-home-v2/idempotency-rerun.json`
