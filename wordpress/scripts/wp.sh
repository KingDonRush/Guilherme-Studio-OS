#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$WP_DIR"

docker compose run --rm wpcli "$@"
