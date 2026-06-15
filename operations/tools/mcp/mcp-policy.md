# MCP Policy

## Goal

Use MCP servers only when they add clear leverage:
- WordPress inspection;
- Elementor/page-builder operations;
- repository or filesystem context;
- browser verification;
- documentation lookup.

## Current Decision

The Elementor MCP layer must be local and free.

Use:

- `WordPress/mcp-adapter`
- `msrbuilds/elementor-mcp`
- WP-CLI stdio transport through Docker Compose

Do not use `@respira/wordpress-mcp-server` for this project because it is not
the local-only Elementor MCP path we want.

## Local Files

- package setup: `operations/tools/mcp/mcp/package.json`
- example client config: `operations/tools/mcp/mcp/mcp.example.json`
- notes: `operations/tools/mcp/mcp/README.md`
- local Elementor MCP guide: `operations/tools/mcp/mcp/elementor-local.md`
- stdio runner: `operations/tools/mcp/mcp/elementor-mcp-stdio.sh`

## Safety

- Do not connect MCPs to production without explicit approval.
- Prefer duplicate-first or draft-first operations for page edits.
- Keep credentials in `.env`, never in committed config.
- Document exact MCP capabilities before trusting write operations.
