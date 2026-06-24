<?php
/**
 * Portfolio Workbench category registry.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class CategoryRegistry {

	public static function all(): array {
		$categories = apply_filters(
			'gp_project_workbench_categories',
			array(
				'entry'        => self::category( 'entry', __( 'Entry', 'guilherme-portfolio' ), 'admin-home', __( 'Root page, front-page touchpoints and first contact surfaces.', 'guilherme-portfolio' ) ),
				'pages'        => self::category( 'pages', __( 'Pages', 'guilherme-portfolio' ), 'admin-page', __( 'WordPress pages that belong to this project.', 'guilherme-portfolio' ) ),
				'content'      => self::category( 'content', __( 'Content', 'guilherme-portfolio' ), 'screenoptions', __( 'Posts, CPT records and CCT-like content structures.', 'guilherme-portfolio' ) ),
				'presentation' => self::category( 'presentation', __( 'Presentation', 'guilherme-portfolio' ), 'layout', __( 'Menus, templates, Theme Builder pieces and layout surfaces.', 'guilherme-portfolio' ) ),
				'data'         => self::category( 'data', __( 'Data', 'guilherme-portfolio' ), 'database', __( 'Fields, filters, prices, ranges and dynamic data contracts.', 'guilherme-portfolio' ) ),
				'evidence'     => self::category( 'evidence', __( 'Evidence', 'guilherme-portfolio' ), 'yes-alt', __( 'Proof, screenshots, case artifacts and implementation receipts.', 'guilherme-portfolio' ) ),
				'providers'    => self::category( 'providers', __( 'Providers', 'guilherme-portfolio' ), 'plugins-checked', __( 'Plugin capabilities available to this project.', 'guilherme-portfolio' ) ),
				'suggestions'  => self::category( 'suggestions', __( 'Suggestions', 'guilherme-portfolio' ), 'lightbulb', __( 'Pending hints that are not confirmed facts yet.', 'guilherme-portfolio' ) ),
				'relations'    => self::category( 'relations', __( 'Relations', 'guilherme-portfolio' ), 'networking', __( 'Manual links between attached items.', 'guilherme-portfolio' ) ),
			)
		);

		return self::normalize( $categories );
	}

	public static function labels(): array {
		$labels = array();

		foreach ( self::all() as $key => $category ) {
			$labels[ $key ] = $category['label'];
		}

		return $labels;
	}

	public static function sanitize( $value ): string {
		$value = sanitize_key( $value );

		return array_key_exists( $value, self::all() ) ? $value : 'content';
	}

	private static function category( string $key, string $label, string $icon, string $tip ): array {
		return compact( 'key', 'label', 'icon', 'tip' );
	}

	private static function normalize( $categories ): array {
		$normalized = array();

		foreach ( (array) $categories as $key => $category ) {
			$category = is_array( $category ) ? $category : array( 'label' => $category );
			$key      = sanitize_key( $category['key'] ?? $key );

			if ( '' === $key ) {
				continue;
			}

			$normalized[ $key ] = array(
				'key'   => $key,
				'label' => WorkbenchSanitizer::label( $category['label'] ?? $key, 60 ),
				'icon'  => sanitize_html_class( $category['icon'] ?? 'marker' ),
				'tip'   => WorkbenchSanitizer::label( $category['tip'] ?? '', 160 ),
			);
		}

		return $normalized;
	}
}
