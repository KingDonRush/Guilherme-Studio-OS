<?php
/**
 * Optional plugin integration detection.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Support;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class PluginDetector {

	public static function integrations(): array {
		$integrations = array(
			'simple_budget' => array(
				'key'         => 'simple_budget',
				'provider'    => 'simple-budget-plugin',
				'label'       => __( 'Simple Budget Plugin', 'guilherme-portfolio' ),
				'description' => __( 'Budget buttons, quote cart, pricing metadata and WhatsApp handoff.', 'guilherme-portfolio' ),
				'capabilities' => array( 'budget_cart', 'pricing_meta', 'wp_cli_settings', 'whatsapp_handoff' ),
				'active'      => defined( 'SBP_VERSION' ) || class_exists( '\SBP\Core\Main' ),
			),
			'implementation_toolkit' => array(
				'key'         => 'implementation_toolkit',
				'provider'    => 'elementor-implementation-toolkit',
				'label'       => __( 'Elementor Implementation Toolkit', 'guilherme-portfolio' ),
				'description' => __( 'CPTs, CCT records, filter presets and implementation structures.', 'guilherme-portfolio' ),
				'capabilities' => array( 'cpt_structures', 'cct_records', 'field_catalog', 'filter_presets' ),
				'active'      => defined( 'EIT_VERSION' ) || function_exists( 'eit_query_cct_items' ),
			),
			'viewer_3d' => array(
				'key'         => 'viewer_3d',
				'provider'    => '3d-viewer-to-elementor',
				'label'       => __( '3D Viewer for Elementor', 'guilherme-portfolio' ),
				'description' => __( '3D product/viewer proof inside Elementor layouts.', 'guilherme-portfolio' ),
				'capabilities' => array( 'elementor_widget', 'model_viewer', 'product_media' ),
				'active'      => defined( 'VIEWER_3D_VERSION' ) || class_exists( '\ThreeDViewer\Elementor\Widget3DViewer' ),
			),
		);

		/**
		 * Register project integration providers.
		 *
		 * Providers are normalized before use so plugins can contribute without
		 * depending on the theme internals.
		 *
		 * @param array<string,array<string,mixed>> $integrations Integration provider definitions.
		 */
		$integrations = apply_filters( 'gp_project_integration_providers', $integrations );

		return self::normalize_integrations( $integrations );
	}

	private static function normalize_integrations( $integrations ): array {
		$normalized = array();

		foreach ( (array) $integrations as $key => $integration ) {
			if ( ! is_array( $integration ) ) {
				continue;
			}

			$key = sanitize_key( $integration['key'] ?? $key );

			if ( '' === $key ) {
				continue;
			}

			$active = ! empty( $integration['active'] );
			$normalized[ $key ] = array(
				'key'          => $key,
				'provider'     => sanitize_key( $integration['provider'] ?? $key ),
				'label'        => sanitize_text_field( $integration['label'] ?? $key ),
				'description'  => sanitize_text_field( $integration['description'] ?? '' ),
				'capabilities' => self::sanitize_capabilities( $integration['capabilities'] ?? array() ),
				'active'       => $active,
				'status'       => sanitize_key( $integration['status'] ?? ( $active ? 'active' : 'missing' ) ),
				'source'       => sanitize_key( $integration['source'] ?? 'theme' ),
			);
		}

		return $normalized;
	}

	private static function sanitize_capabilities( $capabilities ): array {
		$capabilities = array_map( 'sanitize_key', (array) $capabilities );
		$capabilities = array_values( array_filter( array_unique( $capabilities ) ) );

		return array_slice( $capabilities, 0, 20 );
	}
}
