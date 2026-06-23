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
		return array(
			'simple_budget' => array(
				'label'       => __( 'Simple Budget Plugin', 'guilherme-portfolio' ),
				'description' => __( 'Budget buttons, quote cart, pricing metadata and WhatsApp handoff.', 'guilherme-portfolio' ),
				'active'      => defined( 'SBP_VERSION' ) || class_exists( '\SBP\Core\Main' ),
			),
			'implementation_toolkit' => array(
				'label'       => __( 'Elementor Implementation Toolkit', 'guilherme-portfolio' ),
				'description' => __( 'CPTs, CCT records, filter presets and implementation structures.', 'guilherme-portfolio' ),
				'active'      => defined( 'EIT_VERSION' ) || function_exists( 'eit_query_cct_items' ),
			),
			'viewer_3d' => array(
				'label'       => __( '3D Viewer for Elementor', 'guilherme-portfolio' ),
				'description' => __( '3D product/viewer proof inside Elementor layouts.', 'guilherme-portfolio' ),
				'active'      => defined( 'VIEWER_3D_VERSION' ) || class_exists( '\ThreeDViewer\Elementor\Widget3DViewer' ),
			),
		);
	}
}
