# Mina Forma Portfolio Capsule

Mina Forma is the institutional demo site for the portfolio.

Purpose:

- prove a serious WordPress/Elementor institutional build;
- use Simple Budget Plugin only on the public project-planning/orcamento page;
- keep ecommerce and 3D viewer out of this site;
- show Implementation Toolkit-style structured content through services,
  projects, filters, templates and reusable page types.

## Open This First

- Full current map: [`ASSET_MAP.md`](ASSET_MAP.md)
- Original mockup prompts: [`MOCKUP_PROMPTS.md`](MOCKUP_PROMPTS.md)
- Mockups: [`../assets/mockups/`](../assets/mockups/)
- Raw/source images: [`../assets/sources/`](../assets/sources/)
- Manifests and generation records: [`../assets/manifests/`](../assets/manifests/)
- Production WordPress WebPs: [`../assets/wordpress/`](../assets/wordpress/)
- WordPress WebP runtime copies:
  `wordpress/wp-content/themes/guilherme-portfolio/assets/images/mina-forma/`

## Current Status

Current state:

- full-page mockups live in `../assets/mockups/`;
- original prompt/art-direction text lives in `MOCKUP_PROMPTS.md`;
- asset inventory and generation manifests live in `../assets/manifests/`;
- raw imagegen source files live in `../assets/sources/`;
- optimized WebP batches live in `../assets/wordpress/`;
- the WordPress theme still keeps runtime copies under
  `wordpress/wp-content/themes/guilherme-portfolio/assets/images/mina-forma/`.

## Current Pages

| Page | Mockup |
| --- | --- |
| Art direction guide | `../assets/mockups/mina-forma-art-direction-guide-v1.png` |
| Home | `../assets/mockups/mina-forma-home-mockup-v1.png` |
| About | `../assets/mockups/mina-forma-about-mockup-v1.png` |
| Services listing | `../assets/mockups/mina-forma-services-listing-mockup-v1.png` |
| Service detail | `../assets/mockups/mina-forma-service-detail-mockup-v1.png` |
| Projects/cases listing | `../assets/mockups/mina-forma-projects-cases-listing-mockup-v1.png` |
| Aurora Cafe case | `../assets/mockups/mina-forma-case-aurora-cafe-mockup-v1.png` |
| Plan your project / Orcamento | `../assets/mockups/mina-forma-plan-your-project-orcamento-mockup-v1.png` |
| Contact | `../assets/mockups/mina-forma-contact-mockup-v1.png` |

## WordPress WebP Batches

| Batch | Capsule asset folder | Meaning |
| --- | --- | --- |
| Batch 1 core | `../assets/wordpress/batch-1-core/` | reusable hero/process/contact imagery |
| Batch 2 projects | `../assets/wordpress/batch-2-projects/` | fictional project/case imagery |
| Batch 3 materials | `../assets/wordpress/batch-3-materials/` | material, texture and deliverable imagery |
| Batch 4 SBP | `../assets/wordpress/batch-4-sbp/` | Simple Budget public quote-flow thumbnails and empty state |
| Batch 5 lineart | `../assets/wordpress/batch-5-lineart/` | blueprint/map/floorplan line-art exports |

Runtime mirror:

```text
wordpress/wp-content/themes/guilherme-portfolio/assets/images/mina-forma/
```

Checksum manifest:

```text
../assets/manifests/wordpress-webp-sha256.txt
```

## Use Rules

- Do not add ecommerce or 3D viewer assets to Mina Forma.
- Do not treat SBP as the whole site; it appears only on the planning page.
- Do not put raw/source rasters into the WordPress runtime folder.
- Use `../assets/wordpress/` as the source-of-truth production WebP set.
- Keep the WordPress theme path as the runtime implementation copy.
- Use `../assets/mockups/` as visual references.
- When generating new Mina Forma assets, add them to this capsule first.

## Capsule Layout

```text
portfolio/sites/multipaginados/mina-forma/
  docs/
    README.md
    ASSET_MAP.md
    MOCKUP_PROMPTS.md
  assets/
    mockups/
    sources/
    wordpress/
    manifests/
```

Old `docs/assets` entrypoints are redirects only. Keep them until external
notes or chat references have aged out, but do not add new Mina Forma files
there.
