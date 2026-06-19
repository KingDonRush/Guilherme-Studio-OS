# Mina Forma Asset Generation Manifest: Batch 1 Core Photography

Scope: reusable core photography assets for the Mina Forma institutional demo.

Generation mode: built-in `image_gen`, one asset per call. No CLI fallback was used.

Post-processing: PNGs were copied into `runtime/generated/assets/mina-forma/batch-1-core/`; WebP derivatives were created locally with Pillow at quality 88.

Visual QA: contact sheet reviewed locally at `/tmp/mina-forma-batch-1-core-contactsheet.png`. All assets are marked `ok`; no mandatory retry noted for this batch.

| asset_id | png_path | webp_path_or_blank | checksum_sha256_png | status | prompt_used | notes |
|---|---|---|---|---|---|---|
| `mf-hero-material-plans` | `runtime/generated/assets/mina-forma/batch-1-core/mf-hero-material-plans.png` | `runtime/generated/assets/mina-forma/batch-1-core/mf-hero-material-plans.webp` | `fc5f328575695fa00a0bcc6524efb53ccd487ace5a89da0c8bd9ff6810c821ee` | ok | `prompt-01` | Material/plans still life; good reusable hero/supporting asset. |
| `mf-about-hero-studio-desk` | `runtime/generated/assets/mina-forma/batch-1-core/mf-about-hero-studio-desk.png` | `runtime/generated/assets/mina-forma/batch-1-core/mf-about-hero-studio-desk.webp` | `85a83621d8e11d5411dda8c24642ed4b695d3c1a9b742b1b5b590c560a3c2eaf` | ok | `prompt-02` | Human presence is limited to hands; no UI or readable text. |
| `mf-services-hero-materials-v1` | `runtime/generated/assets/mina-forma/batch-1-core/mf-services-hero-materials-v1.png` | `runtime/generated/assets/mina-forma/batch-1-core/mf-services-hero-materials-v1.webp` | `bd11d28d0d2b4286c0c898da956eb4bdbb9d8f01c3a9d9a282e554c9d55dc2b0` | ok | `prompt-03` | Clean service-listing material board crop. |
| `mina-home-hero-interior-v1` | `runtime/generated/assets/mina-forma/batch-1-core/mina-home-hero-interior-v1.png` | `runtime/generated/assets/mina-forma/batch-1-core/mina-home-hero-interior-v1.webp` | `a0da9eea279f6ee17245128b3e5dd9ccbbcbb3e454b76d1b401aa4dfd3a7642e` | ok | `prompt-04` | Strong finished-interior hero; suitable for Home. |
| `mf-contact-hero-studio-desk` | `runtime/generated/assets/mina-forma/batch-1-core/mf-contact-hero-studio-desk.png` | `runtime/generated/assets/mina-forma/batch-1-core/mf-contact-hero-studio-desk.webp` | `9ddce795a7232a21b140e1c44e616bc95a51185c150069b0a5e8447e5ebbdbee` | ok | `prompt-05` | Contact/intake desk image without screens or plugin UI. |
| `mf-cta-planning-desk` | `runtime/generated/assets/mina-forma/batch-1-core/mf-cta-planning-desk.png` | `runtime/generated/assets/mina-forma/batch-1-core/mf-cta-planning-desk.webp` | `0d24b0d5f135473df41ba9e932067baed89ab31aef3d5b1ff51ca71a13cee197` | ok | `prompt-06` | Wide CTA/supporting crop; no readable text. |
| `mf-human-process-table` | `runtime/generated/assets/mina-forma/batch-1-core/mf-human-process-table.png` | `runtime/generated/assets/mina-forma/batch-1-core/mf-human-process-table.webp` | `39fea051d9ca7361988f6edf194f36d6e07aea879f88ae9efc1617ba2619c803` | ok | `prompt-07` | Human process image with hands only; good for About/process sections. |

## Prompts Used

### prompt-01: `mf-hero-material-plans`

```text
Create a photorealistic editorial architecture/interiors website asset.

Asset ID: mf-hero-material-plans
Intended placement: Mina Forma institutional site hero/supporting visual.
Scene: a warm architectural studio desk with off-white floor plans spread across a large table, material samples arranged naturally: pale stone, warm oak wood, matte black metal strip, light concrete/plaster sample, and clay-orange fabric swatch. Add a black pencil, ruler, and tracing paper for scale.
Camera: top-down three-quarter editorial crop, medium-format photography feel, deep enough focus for materials and plans to be inspectable.
Lighting and palette: soft natural side light, warm off-white paper, charcoal ink lines, oak wood, pale concrete, stone texture, matte black metal, clay textile accent.
Composition: useful negative space on the left/top for possible crop; no people necessary.
Constraints: no UI, no buttons, no cards, no plugin interface, no dashboard, no ecommerce, no 3D viewer, no browser frame, no logos, no readable text, no watermark, no fake stock-photo smile, no laptop screen.
Format: landscape website asset, approximately 16:10 crop, high-resolution PNG.
```

### prompt-02: `mf-about-hero-studio-desk`

```text
Create a photorealistic editorial architecture/interiors website asset.

Asset ID: mf-about-hero-studio-desk
Intended placement: Mina Forma About page hero.
Scene: an architecture/interior studio desk with two hands reviewing floor plans and tracing paper, surrounded by material samples: warm oak slats, pale concrete, natural stone, matte black metal, and clay-orange fabric. A textured concrete wall and vertical wood slats are softly visible in the background.
Camera: eye-level to slightly elevated editorial crop, 5:4 or 4:3 composition, shallow-to-medium depth of field, hands and plans clear, background tactile but not distracting.
Lighting and palette: soft natural daylight from one side, warm off-white, charcoal plan lines, oak, concrete, stone, black metal, clay textile accent.
Composition: right-side visual weight with breathing room for page typography on the opposite crop if needed.
Constraints: no UI, no buttons, no cards, no plugin, no dashboard, no ecommerce, no 3D viewer, no browser frame, no logos, no readable text, no watermark, no smiling portrait, no stock-photo handshake.
Format: editorial website photo asset, high-resolution PNG.
```

### prompt-03: `mf-services-hero-materials-v1`

```text
Create a photorealistic editorial architecture/interiors website asset.

Asset ID: mf-services-hero-materials-v1
Intended placement: Mina Forma Services listing hero.
Scene: a structured architectural materials composition: stone slab, warm wood sample, light concrete plaster board, matte black metal edge, clay-orange textile, technical floor plans, black pen and scale ruler arranged on a warm off-white studio surface.
Camera: wide landscape crop, slightly elevated angle, architectural editorial still life, clean geometry and crisp edges.
Lighting and palette: soft natural daylight, warm off-white paper, charcoal ink, oak, stone, concrete, matte black, restrained clay/orange accent.
Composition: right-side material cluster with enough negative space and clean crop flexibility; image should work inside a hard square/stepped Elementor mask.
Constraints: no UI, no buttons, no cards, no plugin, no dashboard, no ecommerce, no 3D viewer, no browser frame, no logos, no readable text, no watermark, no human faces, no stock-photo props.
Format: landscape website hero asset, approximately 16:9, high-resolution PNG.
```

### prompt-04: `mina-home-hero-interior-v1`

```text
Create a photorealistic editorial architecture/interiors website asset.

Asset ID: mina-home-hero-interior-v1
Intended placement: Mina Forma Home hero.
Scene: a finished commercial interior for an architecture/interiors studio portfolio: a refined reception or cafe-like counter with warm oak wood, pale stone countertop, light concrete/plaster walls, matte black metal details, subtle clay-orange upholstery, and soft plants or material samples in the foreground.
Camera: architectural wide interior photo, slightly off-center perspective, magazine editorial quality, inspectable real space, no fisheye distortion.
Lighting and palette: natural daylight mixed with warm practical lighting, warm off-white, charcoal shadows, oak, stone, concrete, matte black, clay accent.
Composition: strong main image for first viewport; allow desktop 4:3 or 5:4 crop and mobile 4:5 crop; foreground detail plus visible built space depth.
Constraints: no UI, no buttons, no cards, no plugin, no dashboard, no ecommerce product display, no 3D viewer, no browser frame, no logos, no readable signage, no watermark, no people posing, no stock-photo staging.
Format: architectural hero photo asset, high-resolution PNG.
```

### prompt-05: `mf-contact-hero-studio-desk`

```text
Create a photorealistic editorial architecture/interiors website asset.

Asset ID: mf-contact-hero-studio-desk
Intended placement: Mina Forma Contact page hero.
Scene: a tactile architecture studio desk prepared for a first project conversation: floor plans, blank intake sheets with abstract non-readable lines, material samples of wood, concrete, stone, matte black metal, clay-orange fabric, a pencil and a ceramic cup. No screens.
Camera: wide editorial desk photo, slightly elevated angle, warm documentary detail, enough clean negative space for website composition.
Lighting and palette: soft natural side light, warm off-white surface, charcoal ink, oak, concrete, stone, matte black metal, clay textile accent.
Composition: large right-side image crop for contact page hero; clear depth and materiality; avoid overly busy clutter.
Constraints: no UI, no buttons, no cards, no plugin, no detailed quote builder, no dashboard, no ecommerce, no 3D viewer, no browser frame, no logos, no readable text, no watermark, no phone/laptop screen, no stock-photo handshake.
Format: landscape website asset, approximately 16:10, high-resolution PNG.
```

### prompt-06: `mf-cta-planning-desk`

```text
Create a photorealistic editorial architecture/interiors website asset.

Asset ID: mf-cta-planning-desk
Intended placement: Mina Forma CTA band / planning section.
Scene: an architectural planning desk still life: open sketchbook with abstract interior sketches, small floor plan sheets, oak and stone material samples, clay-orange fabric swatch, black pencil, metal ruler, and a small plant cutting on a warm off-white surface.
Camera: horizontal top-down editorial crop, calm negative space, suitable for a wide CTA band.
Lighting and palette: soft natural daylight, warm off-white paper, charcoal ink marks, oak, pale stone, concrete, matte black metal, clay accent.
Composition: wide crop around 16:7 or 2:1; material cluster on one side, quieter open area on the other; no readable notes.
Constraints: no UI, no buttons, no cards, no plugin, no dashboard, no ecommerce, no 3D viewer, no browser frame, no logos, no readable text, no watermark, no laptop/phone screen.
Format: wide editorial website background asset, high-resolution PNG.
```

### prompt-07: `mf-human-process-table`

```text
Create a photorealistic editorial architecture/interiors website asset.

Asset ID: mf-human-process-table
Intended placement: Mina Forma About / human process section.
Scene: overhead architectural working table where two people are discussing floor plans and material boards. Only hands and forearms are visible; one hand points at a plan, another holds a pencil. Include warm oak, pale stone, concrete/plaster sample, matte black metal strip, clay-orange fabric, tracing paper, and a few interior photo prints with no readable text.
Camera: overhead editorial photo, wide horizontal composition, realistic human process, documentary but composed.
Lighting and palette: natural daylight, warm off-white paper, charcoal drawing lines, oak, concrete, stone, matte black, clay textile accent.
Composition: wide 16:7 or 2.4:1 crop, center table activity with calm margins for website layout; material samples must be tactile and inspectable.
Constraints: no UI, no buttons, no cards, no plugin, no quote builder, no dashboard, no ecommerce, no 3D viewer, no browser frame, no logos, no readable text, no watermark, no face portraits, no handshake pose, no laptop/phone screen.
Format: wide editorial website photo asset, high-resolution PNG.
```
