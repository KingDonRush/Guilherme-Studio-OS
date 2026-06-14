# Guilherme Studio OS

Private local-first operating system for Guilherme Silva's international
WordPress business, products, portfolio, career pipeline, and governed agent
work.

The normative product specification lives in
[`docs/studio-os/`](docs/studio-os/00-index.md).

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
