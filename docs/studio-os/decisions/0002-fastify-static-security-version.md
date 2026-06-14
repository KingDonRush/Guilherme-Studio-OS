# 0002. Fastify Static Security Version

## Status

Accepted.

## Context

The Studio OS V1 plan pinned `@fastify/static@8.3.0`.
`npm audit` reported two moderate path traversal advisories affecting
`@fastify/static` versions `>=8.0.0 <=9.1.0`.

The local API serves the panel only on loopback, but static file serving is still
a security boundary and must not start with a known advisory.

## Decision

Use `@fastify/static@9.1.3`.

## Consequences

- The local API starts from a patched static serving dependency.
- The project keeps Fastify 5 compatibility.
- This is a security-driven deviation from the original version pin.
