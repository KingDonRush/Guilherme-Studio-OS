#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
wordpress_dir="$(cd "$script_dir/.." && pwd)"

cd "$wordpress_dir"

wp_cli=(docker compose run --rm wpcli)

import_if_missing() {
  local key="$1"
  local file="$2"
  local title="$3"
  local alt="$4"

  local existing_id
  existing_id="$("${wp_cli[@]}" post list \
    --post_type=attachment \
    --post_status=inherit \
    --meta_key=_portfolio_asset_key \
    --meta_value="$key" \
    --field=ID \
    --format=ids)"

  if [[ -n "$existing_id" ]]; then
    echo "$title already imported as attachment ID: $existing_id"
    return
  fi

  local attachment_id
  attachment_id="$("${wp_cli[@]}" media import "$file" \
    --title="$title" \
    --alt="$alt" \
    --porcelain)"

  "${wp_cli[@]}" post meta update "$attachment_id" _portfolio_asset_key "$key" >/dev/null
  echo "$title imported as attachment ID: $attachment_id"
}

import_if_missing \
  "portfolio_hero_provisional_v1" \
  "wp-content/uploads/portfolio-assets/provisional/portfolio-hero-provisional-v1.png" \
  "Portfolio Hero Provisional V1" \
  "Provisional portfolio hero concept for Guilherme Silva"

import_if_missing \
  "profile_photo_framed_v1" \
  "wp-content/uploads/portfolio-assets/provisional/profile-photo-framed-v1.png" \
  "Profile Photo Framed V1" \
  "Framed profile photo for Guilherme Silva portfolio hero"
