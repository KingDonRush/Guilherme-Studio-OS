<?php
/**
 * Shared sanitization for Portfolio Area Map records.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Areas;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class AreaSanitizer {

	private const STATUSES   = array( 'active', 'draft', 'paused', 'archived' );
	private const CATEGORIES = array( 'pages', 'content', 'presentation', 'navigation', 'admin', 'references' );
	private const TYPES      = array( 'post', 'post_type', 'taxonomy', 'menu', 'theme_builder', 'media', 'admin_url', 'reference', 'custom' );

	public static function label( $value, int $limit = 120 ): string {
		return substr( sanitize_text_field( (string) $value ), 0, $limit );
	}

	public static function notes( $value ): string {
		return sanitize_textarea_field( (string) $value );
	}

	public static function key( $value, string $fallback = '' ): string {
		$key = sanitize_key( (string) $value );
		return '' !== $key ? $key : $fallback;
	}

	public static function status( $value ): string {
		return self::allowed( $value, self::STATUSES, 'active' );
	}

	public static function category( $value ): string {
		return self::allowed( $value, self::CATEGORIES, 'content' );
	}

	public static function type( $value ): string {
		return self::allowed( $value, self::TYPES, 'custom' );
	}

	public static function id( $value, string $fallback = '' ): string {
		$id = sanitize_key( (string) $value );
		return '' !== $id ? $id : $fallback;
	}

	public static function object_id( $value ): string {
		return substr( sanitize_text_field( (string) $value ), 0, 120 );
	}

	public static function order( $value ): int {
		return max( 0, min( 9999, absint( $value ) ) );
	}

	public static function admin_path( $value ): string {
		$url = trim( (string) $value );

		if ( '' === $url ) {
			return '';
		}

		$admin_url  = admin_url();
		$admin_path = wp_parse_url( $admin_url, PHP_URL_PATH ) ?: '/wp-admin/';

		if ( 0 === strpos( $url, $admin_url ) ) {
			$url = substr( $url, strlen( $admin_url ) );
		}

		if ( preg_match( '#^[a-z][a-z0-9+.-]*:#i', $url ) || str_starts_with( $url, '//' ) ) {
			$parts = wp_parse_url( $url );
			$path  = is_array( $parts ) ? ( $parts['path'] ?? '' ) : '';

			if ( ! is_string( $path ) || ! str_starts_with( trailingslashit( $path ), trailingslashit( $admin_path ) ) ) {
				return '';
			}

			$url = ltrim( substr( $path, strlen( $admin_path ) ), '/' );

			if ( isset( $parts['query'] ) ) {
				$url .= '?' . $parts['query'];
			}

			if ( isset( $parts['fragment'] ) ) {
				$url .= '#' . $parts['fragment'];
			}
		}

		if ( str_contains( $url, '..' ) || str_contains( $url, '\\' ) ) {
			return '';
		}

		$url = ltrim( $url, '/' );

		if ( str_starts_with( trailingslashit( $url ), ltrim( trailingslashit( $admin_path ), '/' ) ) ) {
			$url = ltrim( substr( $url, strlen( ltrim( $admin_path, '/' ) ) ), '/' );
		}

		if ( ! preg_match( '~^[A-Za-z0-9_./?=&%:#-]+$~', $url ) ) {
			return '';
		}

		return $url;
	}

	public static function allowed( $value, array $allowed, string $fallback ): string {
		$value = sanitize_key( (string) $value );
		return in_array( $value, $allowed, true ) ? $value : $fallback;
	}
}
