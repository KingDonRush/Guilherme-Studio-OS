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

- package setup: `.ai/tools/mcp/package.json`
- example client config: `.ai/tools/mcp/mcp.example.json`
- notes: `.ai/tools/mcp/README.md`
- local Elementor MCP guide: `.ai/tools/mcp/elementor-local.md`
- stdio runner: `.ai/tools/mcp/elementor-mcp-stdio.sh`

## Safety

- Do not connect MCPs to production without explicit approval.
- Prefer duplicate-first or draft-first operations for page edits.
- Keep credentials in `.env`, never in `.ai/` or committed config.
- Document exact MCP capabilities before trusting write operations.
