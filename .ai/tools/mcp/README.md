# MCP Tooling

This folder installs local MCP packages useful for WordPress portfolio work.

## Packages

- `mcp-wordpress`: general WordPress MCP server.
- `@automattic/mcp-wordpress-remote`: Automattic remote WordPress MCP proxy.
- `@respira/wordpress-mcp-server`: WordPress MCP with page-builder awareness,
  including Elementor-focused workflows.

## Install

```bash
npm install --prefix .ai/tools/mcp
```

## Config

Use `mcp.example.json` as a starting point for a local MCP client config. Do not
commit credentials.

## Safety

Use MCPs against local WordPress first. For production or client sites, require
explicit approval and prefer draft/duplicate-first operations.
