# Asset Index

Open this file first when looking for project visuals.

The rule is simple: find the **pack**, then inspect mockups, prompts, sources,
production exports and WordPress copies from there. Do not start by guessing
whether an asset lives under `portfolio/`, `sources/`, `distribution/` or
`wordpress/`.

## Active Packs

| Pack | What it is | Start here | Current asset locations | Status |
| --- | --- | --- | --- | --- |
| Mina Forma | Institutional demo site; SBP appears only on the project-planning page. | [`packs/mina-forma/README.md`](packs/mina-forma/README.md) | `docs/assets/portfolio/mockups/mina-forma/`, `docs/assets/sources/imagegen/mina-forma/`, `wordpress/wp-content/themes/guilherme-portfolio/assets/images/mina-forma/` | mockups + generated WordPress WebPs exist; needs pack migration |
| Portfolio Home | Main Guilherme portfolio home/hero assets. | [`portfolio/README.md`](portfolio/README.md) | `docs/assets/portfolio/`, `docs/assets/distribution/lovable/portfolio-home-*` | active legacy pack |
| Simple Budget Plugin | SBP plugin page and demo imagery. | [`simple-budget-demo/ASSET-MANIFEST.md`](simple-budget-demo/ASSET-MANIFEST.md) | `docs/assets/simple-budget-demo/` | active legacy pack |
| Elementor Implementation Toolkit | Admin/product imagery for implementation tooling. | `implementation-toolkit/admin-v0.2/` | `docs/assets/implementation-toolkit/admin-v0.2/` | active legacy pack |
| Shared Assets | Cross-pack identity, icons, textures and backgrounds. | [`shared/README.md`](shared/README.md) | `docs/assets/shared/`, `docs/assets/portfolio/icons/` | shared |
| Distribution | GitHub, Open Graph, social and public channel crops. | [`distribution/README.md`](distribution/README.md) | `docs/assets/distribution/` | channel output |
| Sources | Raw imagegen, chroma and screenshots. | [`sources/README.md`](sources/README.md) | `docs/assets/sources/` | source archive |

## Fast Paths

### Mina Forma

- Pack hub: [`packs/mina-forma/README.md`](packs/mina-forma/README.md)
- Full map: [`packs/mina-forma/ASSET_MAP.md`](packs/mina-forma/ASSET_MAP.md)
- Mockups: `docs/assets/portfolio/mockups/mina-forma/`
- Prompt/source images: `docs/assets/sources/imagegen/mina-forma/`
- WordPress WebPs: `wordpress/wp-content/themes/guilherme-portfolio/assets/images/mina-forma/`

### Portfolio Home

- Current pack notes: [`portfolio/README.md`](portfolio/README.md)
- Final implementation assets: `docs/assets/portfolio/final/`
- Icons: `docs/assets/portfolio/icons/`

### Simple Budget Plugin

- Manifest: [`simple-budget-demo/ASSET-MANIFEST.md`](simple-budget-demo/ASSET-MANIFEST.md)
- Backgrounds: `docs/assets/simple-budget-demo/backgrounds/wordpress/`
- Evidence screenshots: `docs/assets/simple-budget-demo/evidence/wordpress/`
- Product images: `docs/assets/simple-budget-demo/products/wordpress/`

## Navigation Rule

When adding or searching assets:

1. Pick the pack first.
2. Use the pack README to find current locations.
3. Store new project-specific material under that pack unless a migration note says otherwise.
4. Use `shared/` only for assets intentionally reused across packs.
5. Use `distribution/` only for channel-specific exports.
6. Use `sources/` only for raw inputs that are not the human entrypoint.

Legacy folders may remain while links/manifests depend on them. New work should
prefer `packs/<slug>/` as the navigation home.
