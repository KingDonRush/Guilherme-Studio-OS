# MCP Policy

## Goal

Use MCP servers only when they add clear leverage:
- WordPress inspection;
- Elementor/page-builder operations;
- repository or filesystem context;
- browser verification;
- documentation lookup.

## Initial Candidates

1. `mcp-wordpress`
   - general WordPress management through MCP;
   - useful for local WordPress inspection and content operations.

2. `@automattic/mcp-wordpress-remote`
   - Automattic WordPress remote MCP proxy;
   - useful when connecting to real or remote WordPress sites with stronger auth.

3. `@respira/wordpress-mcp-server`
   - WordPress MCP with page-builder awareness, including Elementor-oriented
     workflows;
   - may need extra plugin/account/API setup.

## Local Files

- package setup: `.ai/tools/mcp/package.json`
- example client config: `.ai/tools/mcp/mcp.example.json`
- notes: `.ai/tools/mcp/README.md`

## Safety

- Do not connect MCPs to production without explicit approval.
- Prefer duplicate-first or draft-first operations for page edits.
- Keep credentials in `.env`, never in `.ai/` or committed config.
- Document exact MCP capabilities before trusting write operations.
