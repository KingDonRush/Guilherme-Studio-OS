#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PRODUCTS_COMPOSE_FILE="$(cd "$WP_DIR/../operations/wordpress" && pwd)/docker-compose.products.yml"
LOG_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/wordpress-portfolio-lab"
LOG_FILE="$LOG_DIR/start.log"
URL="${WORDPRESS_URL:-http://localhost:8080}"

mkdir -p "$LOG_DIR"

log() {
  printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*" | tee -a "$LOG_FILE"
}

notify() {
  if command -v notify-send >/dev/null 2>&1; then
    notify-send "WordPress Portfolio Lab" "$1" --icon=wordpress-portfolio-lab >/dev/null 2>&1 || true
  fi
}

compose() {
  docker compose -f "$WP_DIR/docker-compose.yml" -f "$PRODUCTS_COMPOSE_FILE" "$@"
}

cd "$WP_DIR"

log "Starting Docker services..."
compose up -d db wordpress >>"$LOG_FILE" 2>&1

log "Waiting for MySQL healthcheck..."
for _ in $(seq 1 60); do
  status="$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{end}}' wordpress-db-1 2>/dev/null || true)"
  if [[ "$status" == "healthy" ]]; then
    log "MySQL is healthy."
    break
  fi
  sleep 2
done

if [[ "${status:-}" != "healthy" ]]; then
  log "MySQL did not become healthy in time."
  notify "MySQL did not become healthy. Check $LOG_FILE"
  exit 1
fi

log "Waiting for WordPress HTTP..."
for _ in $(seq 1 60); do
  if curl -fsS --max-time 5 "$URL" >/dev/null 2>&1; then
    log "WordPress is responding at $URL"
    notify "WordPress is ready at $URL"
    xdg-open "$URL" >/dev/null 2>&1 || true
    exit 0
  fi
  sleep 2
done

log "WordPress did not respond in time."
notify "WordPress did not respond. Check $LOG_FILE"
exit 1
