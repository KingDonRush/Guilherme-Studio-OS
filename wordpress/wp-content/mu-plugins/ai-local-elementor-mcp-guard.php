<?php
/**
 * Plugin Name: AI Local Elementor MCP Guard
 * Description: Keeps the local Elementor MCP server free from third-party API tools.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter(
	'elementor_mcp_ability_names',
	static function ( array $names ): array {
		$disabled = array(
			'elementor-mcp/search-images',
			'elementor-mcp/sideload-image',
			'elementor-mcp/add-stock-image',
			'elementor-mcp/upload-svg-icon',
		);

		return array_values( array_diff( $names, $disabled ) );
	},
	100
);
