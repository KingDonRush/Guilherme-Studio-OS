#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
wordpress_dir="$(cd "$script_dir/.." && pwd)"
repo_root="$(cd "$wordpress_dir/.." && pwd)"

source_dir="$repo_root/docs/assets/portfolio"
target_dir="$wordpress_dir/wp-content/uploads/portfolio-assets"

if [[ ! -d "$source_dir" ]]; then
  echo "Missing source directory: $source_dir" >&2
  exit 1
fi

target_parent="$(dirname "$target_dir")"

if { [[ -d "$target_dir" && -w "$target_dir" ]] || [[ ! -e "$target_dir" && -w "$target_parent" ]]; }; then
  mkdir -p "$target_dir"
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --delete "$source_dir/" "$target_dir/"
  else
    find "$target_dir" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
    cp -a "$source_dir/." "$target_dir/"
  fi
elif command -v docker >/dev/null 2>&1 && [[ -f "$wordpress_dir/docker-compose.yml" ]]; then
  container_target="/var/www/html/wp-content/uploads/portfolio-assets"
  (cd "$wordpress_dir" && docker compose exec -T -u root wordpress sh -c "rm -rf '$container_target' && mkdir -p '$container_target'")
  tar -C "$source_dir" -cf - . \
    | (cd "$wordpress_dir" && docker compose exec -T -u root wordpress tar -C "$container_target" -xf -)
else
  echo "Target is not writable and Docker Compose fallback is unavailable: $target_dir" >&2
  exit 1
fi

if command -v docker >/dev/null 2>&1 && [[ -f "$wordpress_dir/docker-compose.yml" ]]; then
  (cd "$wordpress_dir" && docker compose exec -T -u root wordpress chown -R www-data:www-data wp-content/uploads/portfolio-assets)
fi

echo "Portfolio assets synced to: $target_dir"
