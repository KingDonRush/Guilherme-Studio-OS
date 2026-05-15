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
  "portfolio_main_background_elementor_1920x960_v2" \
  "wp-content/uploads/portfolio-assets/final/portfolio-main-background-elementor-1920x960-v2.webp" \
  "Portfolio Main Background Elementor 1920x960 V2" \
  "WebP background-only portfolio hero container for Guilherme Silva"

import_if_missing \
  "profile_guilherme_light_match_cutout_v2" \
  "wp-content/uploads/portfolio-assets/final/profile-guilherme-light-match-cutout-v2.webp" \
  "Profile Guilherme Light Match Cutout V2" \
  "Optimized WebP transparent studio profile cutout of Guilherme Silva"

import_if_missing \
  "portfolio_acf_badge_webp_v2" \
  "wp-content/uploads/portfolio-assets/final/icons-custom/individual-webp/portfolio-acf-badge-v2.webp" \
  "Portfolio ACF Badge WebP V2" \
  "Optimized WebP custom ACF badge for Guilherme Silva portfolio project cards"

import_if_missing \
  "portfolio_crocoblock_badge_webp_v2" \
  "wp-content/uploads/portfolio-assets/final/icons-custom/individual-webp/portfolio-crocoblock-badge-v2.webp" \
  "Portfolio Crocoblock Badge WebP V2" \
  "Optimized WebP custom Crocoblock badge for Guilherme Silva portfolio project cards"

import_if_missing \
  "portfolio_threejs_badge_webp_v2" \
  "wp-content/uploads/portfolio-assets/final/icons-custom/individual-webp/portfolio-threejs-badge-v2.webp" \
  "Portfolio Three.js Badge WebP V2" \
  "Optimized WebP custom Three.js badge for Guilherme Silva portfolio project cards"

import_if_missing \
  "portfolio_rank_math_badge_webp_v2" \
  "wp-content/uploads/portfolio-assets/final/icons-custom/individual-webp/portfolio-rank-math-badge-v2.webp" \
  "Portfolio Rank Math Badge WebP V2" \
  "Optimized WebP custom Rank Math badge for Guilherme Silva portfolio project cards"
