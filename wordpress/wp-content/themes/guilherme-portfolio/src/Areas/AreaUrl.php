<?php
/**
 * Host-neutral URLs for Portfolio Area Map.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Areas;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class AreaUrl {

	public static function admin( string $path ): string {
		return self::internal( admin_url( ltrim( $path, '/' ) ) );
	}

	public static function internal( $url ): string {
		$url = is_string( $url ) ? trim( $url ) : '';

		if ( '' === $url || str_starts_with( $url, '/' ) ) {
			return $url;
		}

		$parts = wp_parse_url( $url );

		if ( ! is_array( $parts ) || empty( $parts['host'] ) ) {
			return $url;
		}

		$path     = $parts['path'] ?? '';
		$query    = isset( $parts['query'] ) ? '?' . $parts['query'] : '';
		$fragment = isset( $parts['fragment'] ) ? '#' . $parts['fragment'] : '';

		if ( self::is_known_host( $parts['host'] ) || self::is_admin_path( $path ) ) {
			return ( '' !== $path ? $path : '/' ) . $query . $fragment;
		}

		return $url;
	}

	private static function is_known_host( string $host ): bool {
		$hosts = array_filter(
			array_map(
				static fn( string $url ) => wp_parse_url( $url, PHP_URL_HOST ),
				array( home_url(), site_url(), admin_url() )
			)
		);

		return in_array( $host, $hosts, true );
	}

	private static function is_admin_path( string $path ): bool {
		$admin_path = wp_parse_url( admin_url(), PHP_URL_PATH ) ?: '/wp-admin/';
		return str_starts_with( trailingslashit( $path ), trailingslashit( $admin_path ) );
	}
}
