# 0001. Vite React Plugin Version

## Status

Accepted.

## Context

The Studio OS V1 plan pinned `vite@8.0.16` and `@vitejs/plugin-react@5.1.4`.
During dependency installation, npm refused the dependency tree because
`@vitejs/plugin-react@5.1.4` declares support for Vite 4, 5, 6 and 7, but not
Vite 8.

The npm registry metadata for `@vitejs/plugin-react@6.0.2` declares a peer
dependency on `vite@^8.0.0`.

## Decision

Use `@vitejs/plugin-react@6.0.2` with `vite@8.0.16`.

## Consequences

- The lockfile remains strict and installable without `--force` or
  `--legacy-peer-deps`.
- Vite remains on the planned major version.
- The deviation from the original plan is recorded instead of hidden.
