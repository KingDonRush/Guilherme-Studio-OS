# Mina Forma Asset Inventory

Inventory generated from the page agents after the mockup pass.

Scope rules:

- This is the institutional demo site.
- SBP detailed visuals appear only on `Plan your project / Orcamento`.
- Landing and ecommerce assets are out of scope.
- Borders, buttons, cards, grids, labels, form fields and layout masks should be
  Elementor/CSS/HTML unless explicitly marked as raster/SVG.
- Prefer bundled Elementor/Font Awesome icons before generating icon rasters.

## Page Inventories

### Home

| asset_id | type | crop | priority | purpose / prompt seed | implementation note |
| --- | --- | --- | --- | --- | --- |
| `mina-home-mockup-ref-v1` | raster mockup | full page | high | Existing mockup reference. | Reference only, not frontend. |
| `mina-home-hero-interior-v1` | photography | 4:3 or 5:4 desktop, 4:5 mobile | high | Commercial interior architecture studio scene, warm wood ceiling, stone counter, lighting, floor plan and material samples. | Main Home hero. Borders/shadow/labels are CSS. |
| `mina-home-proof-materials-v1` | photography/detail | 4:3 | high | Close-up material board with stone, wood, metal and fabric samples. | Reusable in services/process. |
| `mina-home-proof-plan-v1` | photography/detail | 4:3 | high | Architectural floor plan close-up with pen and annotations. | Reusable for method/CTA. |
| `mina-home-proof-built-corner-v1` | photography/detail | 4:3 | medium | Warm commercial interior corner with shelves, seating and soft lighting. | Avoid duplicating hero too closely. |
| `mina-home-project-retail-v1` | project photo | 4:3 | high | Boutique retail fit-out interior, product display table, warm wood. | Featured project card. |
| `mina-home-project-cafe-v1` | project photo | 4:3 | high | Cafe counter system interior, espresso bar, warm shelves, pendant lighting. | Candidate for future case imagery. |
| `mina-home-project-reception-v1` | project photo | 4:3 | high | Studio reception interior, stone desk, slatted wood wall. | Needs to differ from hero. |
| `mina-home-cta-planning-v1` | still-life photo | 16:7 or 2:1 | high | Architectural planning desk, sketchbook, material sample, small plant. | Suggests planning only, no SBP UI. |
| `mina-home-metric-icons-v1` | icon set | 1:1 line icons | medium | Calendar/process, layout, scope/document icons. | Prefer existing icon library. |
| `mina-home-service-markers-v1` | line accent | CSS/SVG simple line | low | Minimal cyan corner marker. | Prefer CSS pseudo-elements. |
| `mina-home-paper-grain-v1` | subtle texture | tile or large background | low | Subtle warm off-white paper grain. | Optional; CSS color may be enough. |

### About

| asset_id | type | crop | priority | purpose / prompt seed | implementation note |
| --- | --- | --- | --- | --- | --- |
| `mf-about-mockup-v1` | raster mockup | full page | high | Existing About mockup reference. | Reference only. |
| `mf-global-paper-grain` | texture | seamless tile or 1600x1600 | medium | Subtle warm off-white paper grain. | Optional CSS fallback. |
| `mf-brand-square-m` | logo/line-art | 1:1 SVG or transparent PNG | medium | Minimal square M monogram. | Can be HTML/CSS text if typography works. |
| `mf-about-hero-studio-desk` | photo | 5:4 or 4:3 | high | Architectural studio desk with hands reviewing plans, material samples, concrete and wood slats. | No SBP, no ecommerce. Stepped crop is CSS. |
| `mf-material-stone-slab` | texture/photo crop | vertical strip 1:3 | high | Pale stone slab close crop. | Material strip asset. |
| `mf-material-wood-slats` | texture/photo crop | vertical strip 1:3 | high | Vertical dark walnut wood slats. | Reusable across site. |
| `mf-material-clay-fabric` | texture/photo crop | vertical strip 1:3 | high | Clay orange textured upholstery fabric. | Must feel material, not gradient. |
| `mf-material-light-concrete` | texture/photo crop | vertical strip 1:3 | medium | Warm concrete/plaster wall texture. | CSS fallback possible. |
| `mf-material-dark-metal-handle` | texture/photo crop | vertical strip 1:3 | medium | Dark bronze/black metal handle on panel. | Reusable in service/project. |
| `mf-method-line-icons` | icon set | 1:1 SVG | medium | Listen, Shape, Specify, Support line icons. | Prefer local icon library. |
| `mf-timeline-atelier-pinboard` | photo | 4:3 or 5:4 | high | Atelier pinboard with sketches, photos, lamp, plans, samples. | Avoid legible fake notes. |
| `mf-principle-materials-still` | photo | square or 4:5 | high | Minimal architectural material still life. | Principle image. |
| `mf-principle-clay-chair` | photo | square or 4:5 | high | Clay chair beside dark wood slat wall. | Palette reinforcement. |
| `mf-principle-corridor-plant` | photo | square or 4:5 | high | Quiet commercial interior corridor with plant. | Principle image. |
| `mf-human-process-table` | photo | 16:7 or 2.4:1 | high | Two people discussing architectural plans around material boards. | Human process, not SBP. |
| `mf-footer-blueprint-lineart` | line-art | wide 3:1 SVG | medium | Thin white architectural floor plan line drawing. | Prefer SVG inline. |
| `mf-social-icon-set` | icon set | 1:1 | low | Instagram, LinkedIn, email. | Use bundled icons. |
| `mf-open-graph-about` | social preview | 1200x630 | low | About page social preview from hero/mark. | Meta asset only. |

### Services Listing

| asset_id | type | crop | priority | purpose / prompt seed | implementation note |
| --- | --- | --- | --- | --- | --- |
| `mf-services-hero-materials-v1` | photo | 16:9 wide | high | Architectural material samples, stone, wood, concrete, technical plans, pen. | Stepped mask is CSS. |
| `mf-services-icon-concept-layout-v1` | icon/line-art | 1:1 SVG | high | Minimal floor plan line icon. | SVG or local icon. |
| `mf-services-icon-interior-design-v1` | icon/line-art | 1:1 SVG | high | Chair and floor lamp line icon. | Black stroke, no fill. |
| `mf-services-icon-technical-detailing-v1` | icon/line-art | 1:1 SVG | high | Technical document sheet icon. | Custom SVG if needed. |
| `mf-services-icon-furniture-joinery-v1` | icon/line-art | 1:1 SVG | high | Vertical wood slats/cabinet front icon. | Color via CSS. |
| `mf-services-icon-material-spec-v1` | icon/line-art | 1:1 SVG | medium | Material swatches with pencil icon. | Optional custom SVG. |
| `mf-services-icon-site-support-v1` | icon/line-art | 1:1 SVG | medium | Construction hard hat line icon. | Use library if compatible. |
| `mf-services-joinery-detail-v1` | photo | 4:3 or 3:2 | high | Custom wood joinery close-up, vertical slats, cabinet detail. | Highlighted service image. |
| `mf-services-approach-brief-icon-v1` | icon/line-art | 1:1 SVG | medium | Brief document and pencil. | Sequence icon. |
| `mf-services-approach-plan-icon-v1` | icon/line-art | 1:1 SVG | medium | Simple cube/spatial block. | Sequence icon. |
| `mf-services-approach-detail-icon-v1` | icon/line-art | 1:1 SVG | medium | Technical drawing detail with ruler marks. | Sequence icon. |
| `mf-services-approach-implement-icon-v1` | icon/line-art | 1:1 SVG | medium | Finished chair or installed furniture piece. | Sequence icon. |
| `mf-services-cta-blueprint-v1` | line-art/texture | 21:9 or 3:1 | high | Fine architectural blueprint line drawing on ink background. | Can be SVG or WebP background. |
| `mf-paper-grain-texture-v1` | texture | tile or large | low | Subtle warm off-white paper grain. | CSS fallback. |
| `mf-footer-technical-line-v1` | line-art | 4:1 wide strip | low | Minimal architectural technical line sketch. | Optional footer accent. |

### Service Detail

| asset_id | type | crop | priority | purpose / prompt seed | implementation note |
| --- | --- | --- | --- | --- | --- |
| `mf-service-hero-commercial-interior` | photo | 4:3 or 16:10 | high | Commercial cafe/interior, wood, concrete, black pendants, vegetation. | Stepped mask is CSS. |
| `mf-icon-service-brief` | line-art icon | 1:1 | high | Stacked concept boards icon. | SVG/icon font. |
| `mf-icon-service-spatial-direction` | line-art icon | 1:1 | high | Architectural floor plan icon. | SVG inline. |
| `mf-icon-service-material-logic` | line-art icon | 1:1 | high | Specification sheets icon. | SVG set candidate. |
| `mf-icon-service-implementation-notes` | line-art icon | 1:1 | high | Interior elevation/cabinetry icon. | SVG. |
| `mf-material-oak-timber` | texture/raster | 1:1 | high | Oak timber slats or veneer. | Reusable material swatch. |
| `mf-material-microcement` | texture/raster | 1:1 | high | Light grey microcement texture. | Library/source acceptable. |
| `mf-material-terrazzo` | texture/raster | 1:1 | high | White terrazzo with stone chips. | Must read at small size. |
| `mf-material-black-metal` | texture/raster | 1:1 | medium | Matte black metal architectural detail. | Avoid excessive shine. |
| `mf-material-textured-fabric` | texture/raster | 1:1 | medium | Warm tan textured upholstery fabric. | Reusable in furniture cards. |
| `mf-material-fluted-glass` | texture/raster | 1:1 | medium | Fluted glass texture with warm light. | Keep abstract. |
| `mf-deliverable-concept-board` | thumbnail photo | 4:3 | high | Interior concept board with material samples. | Small text may be fake. |
| `mf-deliverable-layout-direction` | thumbnail photo | 4:3 | high | Floor plan on off-white paper with pencil/ruler. | Can be real photo or generated render. |
| `mf-deliverable-material-palette` | thumbnail photo | 4:3 | high | Material palette board with oak, terrazzo, black metal, fabric. | Reuses swatch language. |
| `mf-deliverable-lighting-notes` | photo | 4:3 | medium | Warm pendant lighting in commercial interior. | Derivable from project set. |
| `mf-deliverable-spec-checklist` | thumbnail photo | 4:3 | medium | Printed specification checklist on desk. | No real data. |
| `mf-elementor-ready-glyph` | brand/icon | 1:1 | medium | Generic Elementor-ready interface block glyph. | Prefer existing/licensed icon or generic representation. |
| `mf-project-aurora-cafe` | project photo | 16:9 or 4:3 | high | Warm cafe interior with arches, wood, concrete, plants. | Related project. |
| `mf-project-clinica-noma` | project photo | 16:9 or 4:3 | high | Minimal wellness clinic reception. | Related project. |
| `mf-project-atelier-rua-9` | project photo | 16:9 or 4:3 | high | Boutique retail atelier with clothes, wood, concrete. | Related project. |
| `mf-cta-planning-desk` | photo | 16:9 or 3:1 | high | Top-down planning desk, floor plan, samples, pencil. | CTA, no SBP detail. |
| `mf-footer-blueprint-lineart` | line-art/texture | 16:5 or SVG wide | medium | Thin architectural blueprint line drawing. | Prefer SVG/CSS. |
| `mf-logo-square-mark` | brand mark | 1:1 | medium | Square M monogram. | Can be HTML/CSS text. |
| `mf-paper-grain-texture` | texture | tile or 1:1 large | low | Subtle warm paper texture. | CSS fallback. |

### Projects / Cases Listing

| asset_id | type | crop | priority | purpose / prompt seed | implementation note |
| --- | --- | --- | --- | --- | --- |
| `mina-forma-logo-lockup-v1` | logo/vector | horizontal SVG | P0 | Mina Forma editorial wordmark with square border. | HTML/CSS if font works. |
| `mina-forma-paper-grain-v1` | texture | seamless/large tile | P0 | Subtle warm off-white paper grain. | CSS fallback. |
| `mf-projects-hero-cafe-interior-v1` | photo | 16:9 or 4:3 | P0 | Warm cafe interior, clay counter, wood ceiling, daylight, no people. | No SBP/ecommerce/3D. |
| `mf-case-cafe-pedra-clara-wide-v1` | project photo | 12:5 or 21:9 | P0 | Wide cafe counter photo, green tile bar, warm shelves. | Featured case, can feed case detail. |
| `mf-case-clinica-lume-v1` | project photo | 4:3 or 3:2 | P0 | Small clinic reception, warm clinical minimalism. | Avoid hospital stock feel. |
| `mf-case-loja-terral-v1` | project photo | 4:3 | P0 | Boutique storefront/interior named Terral. | Avoid ecommerce/catalog reading. |
| `mf-case-studio-norte-v1` | project photo | 4:3 | P0 | Quiet creative studio workspace with shelves and desk. | Reusable in About/Method. |
| `mf-case-cafe-linha-detail-v1` | project photo | 4:3 | P1 | Cafe detail, green tiles, wooden stool, shelf. | Good for small cards/mobile. |
| `mf-case-clinica-arco-v1` | project photo | 2:1 wide plus 4:3 fallback | P1 | Clinic lounge with arched detail, soft beige interior. | Needs wide-card-safe crop. |
| `mf-case-atelie-mercado-v1` | project photo | 2:1 wide plus 4:3 fallback | P1 | Atelier retail studio with garments and raw materials. | Avoid catalog/prices. |
| `mf-case-studio-campo-v1` | project photo | 2:1 wide plus 4:3 fallback | P1 | Small studio workspace with plants and daylight. | Related project candidate. |
| `mf-arrow-line-icon-v1` | icon/line-art | 24x24 SVG | P2 | Minimal right arrow icon. | Prefer CSS/Font Awesome. |
| `mf-taxonomy-filter-icons-v1` | icon set | 24x24 SVG | P3 | Cafe, clinic, store, studio line icons. | Optional; text filters work. |
| `mf-proof-strip-dividers-v1` | line-art/CSS | CSS lines | P3 | Thin editorial divider marks. | CSS, no raster. |

### Case Detail / Aurora Cafe

| asset_id | type | crop | priority | purpose / prompt seed | implementation note |
| --- | --- | --- | --- | --- | --- |
| `mina-forma-case-aurora-cafe-mockup-v1` | raster mockup | full page | P0 | Existing case detail reference. | Reference only. |
| `aurora-cafe-hero-interior` | photo | 16:9 wide | P0 | Warm cafe interior, oak slatted counter, concrete, clay chairs, pendants, arch. | Corner mask via CSS. |
| `aurora-cafe-floorplan-notes` | line-art/raster scan | 2.2:1 | P0 | Hand-drawn cafe floorplan with circulation notes. | SVG or PNG. |
| `aurora-cafe-gallery-counter` | photo | square or 4:3 | P0 | Cafe service counter detail, espresso machine, shelves. | Same fictional project set. |
| `aurora-cafe-gallery-seating` | photo | square or 4:3 | P0 | Cafe seating area, tables, clay chairs, arch, plants. | Same project set. |
| `aurora-cafe-gallery-material` | photo | square or 4:3 | P0 | Oak slats, black metal, terrazzo/concrete, clay upholstery. | Can double as material image. |
| `material-oak-slatted-timber` | texture swatch | square | P1 | Oak slatted timber texture. | CSS fallback only if texture not needed. |
| `material-cast-concrete` | texture swatch | square | P1 | Pale cast concrete texture. | CSS fallback acceptable. |
| `material-warm-lime-plaster` | texture swatch | square | P1 | Warm off-white lime plaster. | CSS fallback acceptable. |
| `material-black-metal` | texture/color swatch | square | P2 | Matte black metal texture. | CSS color possible. |
| `material-clay-upholstery` | texture swatch | square | P1 | Clay orange upholstery fabric. | CSS fallback acceptable if not critical. |
| `icon-service-concept-layout` | SVG/icon | square | P1 | Floorplan icon. | Prefer local icon/SVG. |
| `icon-service-interior-design` | SVG/icon | square | P1 | Pendant lamp and chairs icon. | Custom SVG possible. |
| `icon-service-technical-detailing` | SVG/icon | square | P1 | Technical section/detail icon. | Reusable. |
| `icon-result-queue-flow` | SVG/icon | square | P2 | People/flow icon. | Existing icon library if possible. |
| `icon-result-dwell-time` | SVG/icon | square | P2 | Coffee cup/steam icon. | Existing icon library if possible. |
| `icon-result-counter-redesign` | SVG/icon | square | P2 | Service counter/workflow icon. | Existing icon library if possible. |
| `footer-mina-monogram` | SVG mark | 1:1 | P1 | White M inside square outline. | HTML text possible. |
| `footer-blueprint-line-art` | SVG/line-art | 2.5:1 wide | P1 | White technical floorplan line drawing. | SVG preferred. |
| `paper-background-texture` | subtle texture | tile/full background | P2 | Warm off-white paper texture. | Optional CSS fallback. |
| `photo-treatment-preset` | treatment reference | reusable | P1 | Warm editorial interior photo grade. | Not an asset file by itself. |

### Plan Your Project / Orcamento

| asset_id | type | crop | priority | purpose / prompt seed | implementation note |
| --- | --- | --- | --- | --- | --- |
| `mf-global-paper-texture` | texture | seamless/CSS noise | P1 | Subtle warm off-white paper texture. | Site visual; CSS noise can replace. |
| `mf-logo-system-svg` | SVG logo | vector | P0 | Mina Forma wordmark plus square M. | Site visual; text/CSS possible. |
| `mf-hero-material-plans` | photo | 16:10 horizontal | P0 | Architectural material samples on floor plans, wood, stone, metal, warm light. | Main site visual. |
| `mf-proof-strip-icons` | SVG icon set | 1:1 | P1 | Target/scope, calculator, document estimate, paper plane icons. | Site visual; prefer SVG/library. |
| `sbp-item-thumb-interior-concept` | raster thumb | 4:3 | P0 | Neutral interior material sample, stone and fabric. | SBP public flow asset. |
| `sbp-item-thumb-layout-study` | raster thumb | 4:3 | P0 | Architectural floor plan sketch close-up. | SBP public flow asset. |
| `sbp-item-thumb-furniture-package` | raster thumb | 4:3 | P0 | Wood veneer/joinery material close-up. | SBP public flow asset. |
| `sbp-item-thumb-lighting-plan` | raster thumb | 4:3 | P0 | Minimal pendant lamp close-up. | SBP public flow asset. |
| `sbp-item-thumb-site-visit` | raster thumb | 4:3 | P0 | Concrete wall/site detail. | SBP public flow asset. |
| `sbp-item-thumb-implementation-support` | raster thumb | 4:3 | P0 | Architectural plan with material samples and pencil. | SBP public flow asset. |
| `sbp-empty-proposal-line-art` | SVG line-art | 3:2 | P0 | Minimal empty room/folded panels drawing. | SBP public flow asset; state text/container are plugin UI. |
| `sbp-support-icons` | SVG icon set | 1:1 | P2 | Info, shield/check, review icons. | SBP public flow; use local icons if possible. |
| `mf-process-review-photo` | photo | 16:9 | P1 | Material samples on architectural drawings. | Site visual. |
| `mf-process-clarify-photo` | photo | 16:9 | P1 | Hand drawing notes on floor plan. | Site visual. |
| `mf-process-proposal-photo` | photo | 16:9 | P1 | Printed architecture proposal booklet. | Avoid tiny fake text. |
| `mf-related-interior-concept-photo` | photo | 4:3 or 1:1 | P1 | Warm commercial interior concept. | Reusable in Services. |
| `mf-related-implementation-photo` | photo | 4:3 or 1:1 | P1 | Commercial interior implementation scene. | Reusable in Services/Cases. |
| `mf-related-joinery-photo` | photo | 4:3 or vertical | P1 | Wood slat joinery close-up. | Reusable in Services. |
| `mf-footer-blueprint-line-art` | SVG/texture | wide horizontal | P2 | Subtle architectural blueprint linework. | Footer links/divisions are CSS. |

SBP elements that must not be generated as images: item list layout, plus/minus
buttons, quantity controls, prices, subtotal, estimated total, form fields,
checkboxes, CTA buttons, borders, cards and plugin logic.

### Contact

| asset_id | type | crop | priority | purpose / prompt seed | implementation note |
| --- | --- | --- | --- | --- | --- |
| `mf-contact-hero-studio-desk` | photo | 16:10 wide | P0 | Tactile architectural studio desk, floor plans, samples, clay fabric, natural side light. | Main contact photo, no app mockup. |
| `mf-contact-paper-texture` | texture | tile/full-width | P1 | Subtle warm off-white paper/mineral texture. | CSS fallback. |
| `mf-contact-channel-icons` | icon set | 1:1 | P0 | Email, WhatsApp, LinkedIn icons. | Use bundled icons, no raster. |
| `mf-contact-arrow-icon` | icon | 1:1/glyph | P1 | Arrow for CTAs/links. | CSS or Font Awesome. |
| `mf-contact-summary-icons` | icon set | 24-32px | P0 | Space type, current stage, decision window, known constraints. | Local icons or simple SVG. |
| `mf-contact-map-line-art` | line-art/SVG | 21:9 wide | P0 | Fictional Belo Horizonte neighborhood map with clay M marker. | Do not use real map screenshot. |
| `mf-contact-blueprint-overlay` | line-art texture | 3:1 wide | P1 | Dark CTA blueprint linework texture. | SVG background preferred. |
| `mf-contact-footer-social-icons` | icon set | 18-24px | P2 | Instagram, LinkedIn, email footer icons. | Use bundled icons. |
| `mf-contact-logo-mark-m` | logo mark | 1:1 | P1 | Compact square M monogram. | HTML/CSS or SVG if recurring. |
| `mf-contact-form-lock-icon` | icon | 14-18px | P2 | Small lock/privacy icon. | Existing icon. |
| `mf-contact-accordion-plus` | icon/control | 1:1 | P2 | Plus sign for quick-question accordions. | CSS text, no image. |
| `mf-contact-material-micro-crops` | optional photo crops | 1:1, 4:3, 3:2 | P3 | Clay textile, concrete, wood grain, metal edge. | Only if implementation feels visually poor. |

## Consolidated Generation Batches

### Batch 1: core reusable photography

Generate first because these carry the site:

- `mf-hero-material-plans`
- `mf-about-hero-studio-desk`
- `mf-services-hero-materials-v1`
- `mina-home-hero-interior-v1`
- `mf-contact-hero-studio-desk`
- `mf-cta-planning-desk`
- `mf-human-process-table`

### Batch 2: project universe

Generate as coherent fictional projects, not one-off stock-like images:

- `aurora-cafe-hero-interior`
- `aurora-cafe-gallery-counter`
- `aurora-cafe-gallery-seating`
- `aurora-cafe-gallery-material`
- `mf-case-cafe-pedra-clara-wide-v1`
- `mf-case-clinica-lume-v1`
- `mf-case-loja-terral-v1`
- `mf-case-studio-norte-v1`
- `mf-case-cafe-linha-detail-v1`
- `mf-case-clinica-arco-v1`
- `mf-case-atelie-mercado-v1`
- `mf-case-studio-campo-v1`

### Batch 3: material and deliverable crops

Generate after core photography so the palette stays consistent:

- `mf-material-oak-timber`
- `mf-material-microcement`
- `mf-material-terrazzo`
- `mf-material-black-metal`
- `mf-material-textured-fabric`
- `mf-material-fluted-glass`
- `mf-material-stone-slab`
- `mf-material-wood-slats`
- `mf-material-clay-fabric`
- `mf-material-light-concrete`
- `mf-material-dark-metal-handle`
- `mf-deliverable-concept-board`
- `mf-deliverable-layout-direction`
- `mf-deliverable-material-palette`
- `mf-deliverable-lighting-notes`
- `mf-deliverable-spec-checklist`

### Batch 4: SBP-specific public flow assets

Generate only for the Orçamento page and keep them visually integrated with the
institutional site:

- `sbp-item-thumb-interior-concept`
- `sbp-item-thumb-layout-study`
- `sbp-item-thumb-furniture-package`
- `sbp-item-thumb-lighting-plan`
- `sbp-item-thumb-site-visit`
- `sbp-item-thumb-implementation-support`
- `sbp-empty-proposal-line-art`

### Batch 5: line-art, icons and backgrounds

Do this last. First check Elementor/Font Awesome/Lucide/local icon availability:

- `mf-footer-blueprint-lineart`
- `footer-blueprint-line-art`
- `mf-services-cta-blueprint-v1`
- `mf-contact-map-line-art`
- `mf-contact-blueprint-overlay`
- `aurora-cafe-floorplan-notes`
- service/process icon sets
- contact summary icons
- SBP support icons
- optional paper grain textures

## Do Not Generate As Raster

These should be implemented as HTML/CSS/plugin behavior:

- page borders, shadows, layout grid and section dividers;
- stepped/offset image masks;
- buttons, CTAs, arrows when icon font is enough;
- taxonomy filters and chips;
- form fields, labels and validation states;
- accordions and plus signs;
- SBP item cards, quantity controls, prices, subtotal, total, form and logic;
- footer layout and link columns;
- text content and small labels.
