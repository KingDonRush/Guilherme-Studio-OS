# Mina Forma Generated Assets Index

Generated asset run for the institutional demo site.

The generated files live under `runtime/generated/assets/mina-forma/` because
they are working assets. Runtime is ignored by Git. Promote only reviewed assets
to production folders as optimized WebP/SVG.

## Summary

| Batch | Scope | Files | Manifest |
| --- | --- | ---: | --- |
| `batch-1-core` | Core reusable photography | 14 | [`batch-1-core.md`](generation/batch-1-core.md) |
| `batch-2-projects` | Fictional project universe | 24 | split across [`batch-2a-aurora-cafe.md`](generation/batch-2a-aurora-cafe.md), [`batch-2b-primary-projects.md`](generation/batch-2b-primary-projects.md), [`batch-2c-secondary-projects.md`](generation/batch-2c-secondary-projects.md) |
| `batch-3-materials` | Material swatches and deliverables | 32 | [`batch-3-materials.md`](generation/batch-3-materials.md) |
| `batch-4-sbp` | SBP public-flow visual assets | 14 | [`batch-4-sbp.md`](generation/batch-4-sbp.md) |
| `batch-5-lineart` | Line-art, maps, blueprint overlays and SVG icon sets | 14 | [`batch-5-lineart.md`](generation/batch-5-lineart.md) |

Total generated/runtime files: `98`.

## Batch 1: Core Photography

Folder: `runtime/generated/assets/mina-forma/batch-1-core/`

- `mf-about-hero-studio-desk.png` / `.webp`
- `mf-contact-hero-studio-desk.png` / `.webp`
- `mf-cta-planning-desk.png` / `.webp`
- `mf-hero-material-plans.png` / `.webp`
- `mf-human-process-table.png` / `.webp`
- `mf-services-hero-materials-v1.png` / `.webp`
- `mina-home-hero-interior-v1.png` / `.webp`

## Batch 2: Project Universe

Folder: `runtime/generated/assets/mina-forma/batch-2-projects/`

- `aurora-cafe-gallery-counter.png` / `.webp`
- `aurora-cafe-gallery-material.png` / `.webp`
- `aurora-cafe-gallery-seating.png` / `.webp`
- `aurora-cafe-hero-interior.png` / `.webp`
- `mf-case-atelie-mercado-v1.png` / `.webp`
- `mf-case-cafe-linha-detail-v1.png` / `.webp`
- `mf-case-cafe-pedra-clara-wide-v1.png` / `.webp`
- `mf-case-clinica-arco-v1.png` / `.webp`
- `mf-case-clinica-lume-v1.png` / `.webp`
- `mf-case-loja-terral-v1.png` / `.webp`
- `mf-case-studio-campo-v1.png` / `.webp`
- `mf-case-studio-norte-v1.png` / `.webp`

## Batch 3: Materials And Deliverables

Folder: `runtime/generated/assets/mina-forma/batch-3-materials/`

- `mf-deliverable-concept-board.png` / `.webp`
- `mf-deliverable-layout-direction.png` / `.webp`
- `mf-deliverable-lighting-notes.png` / `.webp`
- `mf-deliverable-material-palette.png` / `.webp`
- `mf-deliverable-spec-checklist.png` / `.webp`
- `mf-material-black-metal.png` / `.webp`
- `mf-material-clay-fabric.png` / `.webp`
- `mf-material-dark-metal-handle.png` / `.webp`
- `mf-material-fluted-glass.png` / `.webp`
- `mf-material-light-concrete.png` / `.webp`
- `mf-material-microcement.png` / `.webp`
- `mf-material-oak-timber.png` / `.webp`
- `mf-material-stone-slab.png` / `.webp`
- `mf-material-terrazzo.png` / `.webp`
- `mf-material-textured-fabric.png` / `.webp`
- `mf-material-wood-slats.png` / `.webp`

## Batch 4: SBP Public Flow

Folder: `runtime/generated/assets/mina-forma/batch-4-sbp/`

- `sbp-empty-proposal-line-art.png` / `.webp`
- `sbp-item-thumb-furniture-package.png` / `.webp`
- `sbp-item-thumb-implementation-support.png` / `.webp`
- `sbp-item-thumb-interior-concept.png` / `.webp`
- `sbp-item-thumb-layout-study.png` / `.webp`
- `sbp-item-thumb-lighting-plan.png` / `.webp`
- `sbp-item-thumb-site-visit.png` / `.webp`

Important: SBP UI controls remain implementation, not image assets. Do not use
images for the item list layout, quantity controls, prices, subtotal, estimated
total, form fields, checkboxes or CTA buttons.

## Batch 5: Line-Art And SVGs

Folder: `runtime/generated/assets/mina-forma/batch-5-lineart/`

- `aurora-cafe-floorplan-notes.png` / `.webp`
- `footer-blueprint-line-art.svg`
- `mf-contact-blueprint-overlay.png` / `.webp`
- `mf-contact-map-line-art.png` / `.webp`
- `mf-contact-summary-icons.svg`
- `mf-footer-blueprint-lineart.svg`
- `mf-proof-strip-icons.svg`
- `mf-service-process-icons.svg`
- `mf-services-cta-blueprint-v1.png` / `.webp`
- `sbp-support-icons.svg`

## Next Gate

Before promotion into production assets:

1. visually review contact sheets and individual images;
2. reject or regenerate weak images;
3. promote approved WebP/SVG into a non-runtime production folder;
4. record source prompt/checksum from the batch manifest;
5. wire only approved assets into the WordPress/Elementor implementation.
