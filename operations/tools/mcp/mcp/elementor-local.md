# Local Elementor MCP

## Decision

Use a local WordPress plugin stack for Elementor MCP:

- `WordPress/mcp-adapter`
- `msrbuilds/elementor-mcp`
- WP-CLI stdio transport through Docker Compose

Do not use paid APIs, external hosted MCP services, or third-party API keys for
the Elementor MCP layer.

## Local WordPress Plugins

Installed under `wordpress/wp-content/plugins/`:

- `mcp-adapter`
- `elementor-mcp`

These are independent git checkouts and are ignored by the root repository.

## Run

The MCP stdio command is:

```bash
operations/tools/mcp/mcp/elementor-mcp-stdio.sh
```

Example client config:

```json
{
  "mcpServers": {
    "elementor-local": {
      "type": "stdio",
      "command": "/home/kingdonrush/Área de trabalho/Dev/Guilherme-Studio-OS/operations/tools/mcp/mcp/elementor-mcp-stdio.sh",
      "args": []
    }
  }
}
```

## Verification

```bash
printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' \
  | operations/tools/mcp/mcp/elementor-mcp-stdio.sh
```

Expected:

- valid JSON-RPC on stdout;
- no Docker or bridge logs on stdout;
- `elementor-mcp-*` tools listed.

## No Third-Party API Guard

The local MU-plugin `wordpress/wp-content/mu-plugins/ai-local-elementor-mcp-guard.php`
removes Elementor MCP tools that can call third-party services:

- `elementor-mcp/search-images`
- `elementor-mcp/sideload-image`
- `elementor-mcp/add-stock-image`
- `elementor-mcp/upload-svg-icon`

This keeps the operational layer local-first.
