# Guilherme Studio OS

Private local-first operating system for Guilherme Silva's international
WordPress business, products, portfolio, career pipeline, and governed agent
work.

The normative product specification lives in
[`docs/studio-os/`](docs/studio-os/00-index.md).

## Agent entry point

An agent or external reviewer should read the repository in this order:

1. [`AGENTS.md`](AGENTS.md) for the complete operating instructions and safety
   boundaries;
2. [`docs/studio-os/00-index.md`](docs/studio-os/00-index.md) for the normative
   system map and document authority;
3. [`docs/studio-os/architecture/04-repository-wordpress-topology.md`](docs/studio-os/architecture/04-repository-wordpress-topology.md)
   for repository ownership, WordPress mounts, and product boundaries.

The records in `products/` describe independently versioned plugin repositories.
Their working trees live locally under `products/<slug>/repository/` and are
intentionally ignored here because each plugin has its own GitHub history.

`wordpress/` is a reproducible local runtime, not a WordPress distribution. This
repository keeps only its local orchestration, owned scripts, owned MU-plugins,
owned page implementations, and the `guilherme-portfolio` theme. WordPress core,
uploads, caches, external plugins, generated state, and secrets remain ignored.

## Toolchain

- Node.js 24.16.0
- npm 11.13.0
- TypeScript workspaces
- YAML/Markdown canonical records
- derived local SQLite projection

## Development

```bash
npm ci
npm run verify
npm run studio -- validate
```

The dashboard is local-only:

```bash
npm run studio -- dashboard
```

Secrets are never stored in this repository. Raster source files belong under
the ignored `runtime/assets/sources/`; only approved optimized WebP derivatives
are versioned.
