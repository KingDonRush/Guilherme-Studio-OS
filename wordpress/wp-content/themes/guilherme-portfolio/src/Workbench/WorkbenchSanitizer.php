<?php
/**
 * Shared Workbench sanitization helpers.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class WorkbenchSanitizer {

	public static function key( $value, string $fallback = '' ): string {
		$value = sanitize_key( $value );

		return '' !== $value ? $value : sanitize_key( $fallback );
	}

	public static function id( $value, string $fallback = '' ): string {
		$value = self::key( $value );

		return '' !== $value ? $value : self::key( $fallback );
	}

	public static function label( $value, int $limit = 120 ): string {
		return self::limit( sanitize_text_field( $value ), $limit );
	}

	public static function notes( $value, int $limit = 600 ): string {
		return self::limit( sanitize_textarea_field( $value ), $limit );
	}

	public static function allowed( $value, array $allowed, string $fallback ): string {
		$value = self::key( $value );

		return in_array( $value, $allowed, true ) ? $value : $fallback;
	}

	public static function object_id( $value ): string {
		if ( is_numeric( $value ) ) {
			return (string) absint( $value );
		}

		return self::limit( sanitize_text_field( $value ), 80 );
	}

	public static function list_slice( $raw, int $limit ): array {
		return array_slice( is_array( $raw ) ? $raw : array(), 0, $limit );
	}

	public static function timestamp( $value = '' ): string {
		$value = sanitize_text_field( $value );

		return '' !== $value ? self::limit( $value, 32 ) : current_time( 'mysql' );
	}

	public static function payload( $raw, int $limit = 40 ): array {
		$raw = is_array( $raw ) ? $raw : array();

		return self::sanitize_payload_level( $raw, $limit, 0 );
	}

	private static function sanitize_payload_level( array $raw, int $limit, int $depth ): array {
		if ( $depth >= 3 ) {
			return array();
		}

		$clean = array();

		foreach ( array_slice( $raw, 0, $limit ) as $key => $value ) {
			$key = self::key( $key );

			if ( '' === $key ) {
				continue;
			}

			if ( is_array( $value ) ) {
				$clean[ $key ] = self::sanitize_payload_level( $value, $limit, $depth + 1 );
				continue;
			}

			$clean[ $key ] = self::limit( sanitize_text_field( $value ), 180 );
		}

		return $clean;
	}

	private static function limit( string $value, int $limit ): string {
		if ( function_exists( 'mb_substr' ) ) {
			return mb_substr( $value, 0, $limit );
		}

		return substr( $value, 0, $limit );
	}
}
