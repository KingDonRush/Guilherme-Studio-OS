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
- Legacy mockup pack:
  `docs/assets/portfolio/mockups/mina-forma/`
- Legacy raw/source images:
  `docs/assets/sources/imagegen/mina-forma/`
- WordPress WebP runtime copies:
  `wordpress/wp-content/themes/guilherme-portfolio/assets/images/mina-forma/`

## Current Status

This is a **navigation hub**, not yet the physical storage location for every
Mina Forma file.

Current state:

- full-page mockups exist in the legacy portfolio mockup folder;
- asset inventory and generation manifests exist in that same legacy folder;
- two raw imagegen source files exist under `docs/assets/sources/imagegen/`;
- optimized WebP batches exist under the WordPress theme runtime path;
- physical migration into `docs/assets/packs/mina-forma/` is pending.

## Current Pages

| Page | Mockup |
| --- | --- |
| Art direction guide | `docs/assets/portfolio/mockups/mina-forma/mina-forma-art-direction-guide-v1.png` |
| Home | `docs/assets/portfolio/mockups/mina-forma/mina-forma-home-mockup-v1.png` |
| About | `docs/assets/portfolio/mockups/mina-forma/mina-forma-about-mockup-v1.png` |
| Services listing | `docs/assets/portfolio/mockups/mina-forma/mina-forma-services-listing-mockup-v1.png` |
| Service detail | `docs/assets/portfolio/mockups/mina-forma/mina-forma-service-detail-mockup-v1.png` |
| Projects/cases listing | `docs/assets/portfolio/mockups/mina-forma/mina-forma-projects-cases-listing-mockup-v1.png` |
| Aurora Cafe case | `docs/assets/portfolio/mockups/mina-forma/mina-forma-case-aurora-cafe-mockup-v1.png` |
| Plan your project / Orcamento | `docs/assets/portfolio/mockups/mina-forma/mina-forma-plan-your-project-orcamento-mockup-v1.png` |
| Contact | `docs/assets/portfolio/mockups/mina-forma/mina-forma-contact-mockup-v1.png` |

## WordPress WebP Batches

| Batch | Runtime folder | Meaning |
| --- | --- | --- |
| Batch 1 core | `wordpress/wp-content/themes/guilherme-portfolio/assets/images/mina-forma/batch-1-core/` | reusable hero/process/contact imagery |
| Batch 2 projects | `wordpress/wp-content/themes/guilherme-portfolio/assets/images/mina-forma/batch-2-projects/` | fictional project/case imagery |
| Batch 3 materials | `wordpress/wp-content/themes/guilherme-portfolio/assets/images/mina-forma/batch-3-materials/` | material, texture and deliverable imagery |
| Batch 4 SBP | `wordpress/wp-content/themes/guilherme-portfolio/assets/images/mina-forma/batch-4-sbp/` | Simple Budget public quote-flow thumbnails and empty state |
| Batch 5 lineart | `wordpress/wp-content/themes/guilherme-portfolio/assets/images/mina-forma/batch-5-lineart/` | blueprint/map/floorplan line-art exports |

## Use Rules

- Do not add ecommerce or 3D viewer assets to Mina Forma.
- Do not treat SBP as the whole site; it appears only on the planning page.
- Do not put raw/source rasters into the WordPress runtime folder.
- Use the WordPress WebP batches for implementation.
- Use the legacy mockups as visual references until the physical pack migration
  is done.
- When generating new Mina Forma assets, add them to this pack path first unless
  a migration note says otherwise.

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

Do not move the existing mockups/WebPs in a mixed implementation slice. Migrate
them in a dedicated asset cleanup commit so references and manifests can be
updated safely.
