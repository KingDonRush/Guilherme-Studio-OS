#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
WP_DIR="$ROOT_DIR/wordpress"

cd "$WP_DIR"

exec docker compose run -T --rm wpcli \
  mcp-adapter serve \
  --server=elementor-mcp-server \
  --user="${ELEMENTOR_MCP_USER:-admin}"
