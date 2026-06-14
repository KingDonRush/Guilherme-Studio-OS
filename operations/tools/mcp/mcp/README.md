# MCP Tooling

This folder stores local MCP configuration and helper scripts for the WordPress
portfolio work.

## Elementor MCP

The Elementor MCP must be local and free:

- no hosted MCP service;
- no third-party API key;
- no paid API dependency.

It is implemented through local WordPress plugins and WP-CLI:

- `WordPress/mcp-adapter`
- `msrbuilds/elementor-mcp`

## Install

```bash
cd wordpress
git clone https://github.com/WordPress/mcp-adapter wp-content/plugins/mcp-adapter
git clone https://github.com/msrbuilds/elementor-mcp wp-content/plugins/elementor-mcp
docker run --rm -v "$PWD/wp-content/plugins/mcp-adapter:/app" -w /app composer:2 composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader
scripts/wp.sh plugin activate mcp-adapter elementor-mcp
```

## Config

Use `mcp.example.json` as a starting point for a local MCP client config. Do not
commit credentials.

## Safety

Use MCPs against local WordPress only unless production access is explicitly
approved. The local guard disables Elementor MCP tools that call Openverse or
external URLs.
