# Mina Forma Asset Pack

Mina Forma is the institutional demo site for the portfolio.

Purpose:

- prove a serious WordPress/Elementor institutional build;
- use Simple Budget Plugin only on the public project-planning/orcamento page;
- keep ecommerce and 3D viewer out of this site;
- show Implementation Toolkit-style structured content through services,
  projects, filters, templates and reusable page types.

## Open This First

- Full current map: [`ASSET_MAP.md`](ASSET_MAP.md)
- Mockups: [`mockups/`](mockups/)
- Original mockup prompts: [`prompts/MOCKUP_PROMPTS.md`](prompts/MOCKUP_PROMPTS.md)
- Raw/source images: [`sources/`](sources/)
- Manifests and generation records: [`manifests/`](manifests/)
- Production WordPress WebPs: [`production/wordpress/`](production/wordpress/)
- WordPress WebP runtime copies:
  `wordpress/wp-content/themes/guilherme-portfolio/assets/images/mina-forma/`

## Current Status

Current state:

- full-page mockups live in `mockups/`;
- original prompt/art-direction text lives in `prompts/MOCKUP_PROMPTS.md`;
- asset inventory and generation manifests live in `manifests/`;
- raw imagegen source files live in `sources/`;
- optimized WebP batches live in `production/wordpress/`;
- the WordPress theme still keeps runtime copies under
  `wordpress/wp-content/themes/guilherme-portfolio/assets/images/mina-forma/`.

## Current Pages

| Page | Mockup |
| --- | --- |
| Art direction guide | `mockups/mina-forma-art-direction-guide-v1.png` |
| Home | `mockups/mina-forma-home-mockup-v1.png` |
| About | `mockups/mina-forma-about-mockup-v1.png` |
| Services listing | `mockups/mina-forma-services-listing-mockup-v1.png` |
| Service detail | `mockups/mina-forma-service-detail-mockup-v1.png` |
| Projects/cases listing | `mockups/mina-forma-projects-cases-listing-mockup-v1.png` |
| Aurora Cafe case | `mockups/mina-forma-case-aurora-cafe-mockup-v1.png` |
| Plan your project / Orcamento | `mockups/mina-forma-plan-your-project-orcamento-mockup-v1.png` |
| Contact | `mockups/mina-forma-contact-mockup-v1.png` |

## WordPress WebP Batches

| Batch | Pack production folder | Meaning |
| --- | --- | --- |
| Batch 1 core | `production/wordpress/batch-1-core/` | reusable hero/process/contact imagery |
| Batch 2 projects | `production/wordpress/batch-2-projects/` | fictional project/case imagery |
| Batch 3 materials | `production/wordpress/batch-3-materials/` | material, texture and deliverable imagery |
| Batch 4 SBP | `production/wordpress/batch-4-sbp/` | Simple Budget public quote-flow thumbnails and empty state |
| Batch 5 lineart | `production/wordpress/batch-5-lineart/` | blueprint/map/floorplan line-art exports |

Runtime mirror:

```text
wordpress/wp-content/themes/guilherme-portfolio/assets/images/mina-forma/
```

Checksum manifest:

```text
manifests/wordpress-webp-sha256.txt
```

## Use Rules

- Do not add ecommerce or 3D viewer assets to Mina Forma.
- Do not treat SBP as the whole site; it appears only on the planning page.
- Do not put raw/source rasters into the WordPress runtime folder.
- Use `production/wordpress/` as the source-of-truth production WebP set.
- Keep the WordPress theme path as the runtime implementation copy.
- Use `mockups/` as visual references.
- When generating new Mina Forma assets, add them to this pack path first.

## Target Physical Layout

```text
docs/assets/packs/mina-forma/
  README.md
  ASSET_MAP.md
  prompts/
  mockups/
  sources/
  production/
  wordpress/
  manifests/
  deprecated/
```

Legacy folders now contain redirect READMEs only. Keep them until any external
notes or chat references have aged out.
