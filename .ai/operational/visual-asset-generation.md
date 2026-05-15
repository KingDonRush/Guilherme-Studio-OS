# Visual Asset Generation Policy

## Rule

When the task is to create or refine visual assets for the portfolio, use
imagegen as the source-of-truth generation step.

This applies to:

- hero concepts;
- profile treatments;
- icon packs with visual style requirements;
- textured backgrounds;
- decorative shapes;
- visual dividers;
- card artwork;
- raster assets intended to match an approved image direction.

## CLI Boundary

CLI tools may be used for file operations only:

- copying files;
- syncing assets into WordPress;
- importing files into the Media Library;
- validating image dimensions or MIME types;
- optimizing exported files after approval;
- generating implementation wrappers from already-approved assets.

CLI tools must not be used as the primary visual creator when fidelity matters.

## SVG / CSS Boundary

Handwritten SVG or CSS is acceptable only for:

- technical placeholders;
- simple geometric implementation masks;
- layout experiments;
- production implementation after an imagegen-approved visual direction exists.

Handwritten SVG/CSS assets must be labeled as implementation placeholders unless
the user explicitly approves them as final.

## Current Correction

The portfolio SVG icon pack and `profile-edge-wave.svg` were created manually.
Treat them as technical placeholders, not final visual assets.

For the final portfolio implementation, regenerate or refine the relevant visual
assets with imagegen first, then use CLI only to place, import, optimize, or wire
them into WordPress.
