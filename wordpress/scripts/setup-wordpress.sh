#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$WP_DIR"

if [ ! -f .env ]; then
  cp .env.example .env
fi

set -a
. ./.env
set +a

docker compose up -d db wordpress

docker compose exec -T -u root wordpress \
  mkdir -p /var/www/html/wp-content/uploads /var/www/html/wp-content/uploads/elementor/css /var/www/html/wp-content/upgrade

docker compose exec -T -u root wordpress \
  chown -R www-data:www-data /var/www/html/wp-content/uploads /var/www/html/wp-content/upgrade

docker compose exec -T -u root wordpress \
  chmod -R u+rwX,g+rwX /var/www/html/wp-content/uploads /var/www/html/wp-content/upgrade

until docker compose run --rm wpcli core is-installed >/dev/null 2>&1; do
  if docker compose run --rm wpcli core version >/dev/null 2>&1; then
    break
  fi
  sleep 3
done

if ! docker compose run --rm wpcli core is-installed >/dev/null 2>&1; then
  docker compose run --rm wpcli core install \
    --url="${WORDPRESS_URL:-http://localhost:8080}" \
    --title="${WORDPRESS_TITLE:-KingDonRush WordPress Portfolio Lab}" \
    --admin_user="${WORDPRESS_ADMIN_USER:-admin}" \
    --admin_password="${WORDPRESS_ADMIN_PASSWORD:-admin}" \
    --admin_email="${WORDPRESS_ADMIN_EMAIL:-admin@example.test}" \
    --skip-email
fi

docker compose run --rm wpcli plugin install elementor --activate --force
docker compose run --rm wpcli elementor flush_css || true

if docker compose run --rm wpcli plugin is-installed 3d-viewer-to-elementor >/dev/null 2>&1; then
  docker compose run --rm wpcli plugin activate 3d-viewer-to-elementor || true
fi

if docker compose run --rm wpcli plugin is-installed simple-budget-plugin >/dev/null 2>&1; then
  docker compose run --rm wpcli plugin activate simple-budget-plugin || true
fi

docker compose ps
