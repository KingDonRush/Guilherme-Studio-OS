# Project Dossier: 3d-viewer-to-elementor

## Source

GitHub: `https://github.com/KingDonRush/3d-viewer-to-wordpress`

Local target: `wordpress/wp-content/plugins/3d-viewer-to-elementor`

## Value Signal

This is the dense proof-of-work project:
- complex JavaScript;
- 3D rendering;
- Elementor widget integration;
- WordPress asset loading;
- editor/frontend behavior;
- performance tradeoffs.

## Current Understanding

The viewer had poor behavior in Elementor edit mode. It also needs more
customization controls. Auto-optimization may be overengineered and sometimes
creates heavy files or hardcoded optimization behavior.

## Polish Direction

1. Stabilize Elementor editor behavior.
2. Separate editor preview, frontend render, and asset optimization concerns.
3. Add customization controls only where they map to real user value.
4. Replace hardcoded optimization guesses with explicit settings and safe
   defaults.
5. Add clear docs, screenshots, and demo assets.
6. Add a QA matrix for editor, frontend, mobile, and common 3D file types.

## Portfolio Case Study Angle

"I built an Elementor widget that lets non-technical editors place interactive
3D assets inside WordPress pages while keeping editor behavior and frontend
performance under control."
