<?php
/**
 * Apply portfolio global colors and typography to the active Elementor Kit.
 *
 * Usage:
 *   docker compose run --rm -T wpcli eval-file scripts/apply-portfolio-elementor-kit.php
 */

$kit_id = (int) get_option( 'elementor_active_kit' );

if ( ! $kit_id ) {
	WP_CLI::error( 'No active Elementor kit found.' );
}

$settings = get_post_meta( $kit_id, '_elementor_page_settings', true );

if ( ! is_array( $settings ) ) {
	$settings = [];
}

$settings['system_colors'] = [
	[
		'_id'   => 'primary',
		'title' => 'Portfolio Teal',
		'color' => '#00D6C9',
	],
	[
		'_id'   => 'secondary',
		'title' => 'Portfolio Ink',
		'color' => '#081020',
	],
	[
		'_id'   => 'text',
		'title' => 'Portfolio Text',
		'color' => '#283241',
	],
	[
		'_id'   => 'accent',
		'title' => 'Portfolio Violet',
		'color' => '#765CFF',
	],
];

$settings['custom_colors'] = [
	[
		'_id'   => 'bio_name',
		'title' => 'Bio Name',
		'color' => '#FFFFFF',
	],
	[
		'_id'   => 'bio_handle',
		'title' => 'Bio Handle',
		'color' => '#00D6C9',
	],
	[
		'_id'   => 'bio_role',
		'title' => 'Bio Role',
		'color' => '#D8DEE8',
	],
	[
		'_id'   => 'bio_body',
		'title' => 'Bio Body',
		'color' => '#D4DAE3',
	],
	[
		'_id'   => 'bio_muted',
		'title' => 'Bio Muted',
		'color' => '#8F9AAA',
	],
	[
		'_id'   => 'project_heading',
		'title' => 'Project Heading',
		'color' => '#081020',
	],
	[
		'_id'   => 'project_section',
		'title' => 'Project Section',
		'color' => '#101827',
	],
	[
		'_id'   => 'project_card_title',
		'title' => 'Project Card Title',
		'color' => '#090F1D',
	],
	[
		'_id'   => 'project_card_body',
		'title' => 'Project Card Body',
		'color' => '#283241',
	],
	[
		'_id'   => 'project_muted',
		'title' => 'Project Muted',
		'color' => '#647083',
	],
	[
		'_id'   => 'project_link',
		'title' => 'Project Link',
		'color' => '#007B78',
	],
	[
		'_id'   => 'divider_light',
		'title' => 'Divider Light',
		'color' => '#D8D0C8',
	],
];

$settings['system_typography'] = [
	[
		'_id'                    => 'primary',
		'title'                  => 'Display / H1',
		'typography_typography'  => 'custom',
		'typography_font_family' => 'Space Grotesk',
		'typography_font_weight' => '800',
		'typography_line_height' => [
			'unit'  => 'em',
			'size'  => 1.02,
			'sizes' => [],
		],
	],
	[
		'_id'                    => 'secondary',
		'title'                  => 'Section Heading',
		'typography_typography'  => 'custom',
		'typography_font_family' => 'Space Grotesk',
		'typography_font_weight' => '700',
		'typography_line_height' => [
			'unit'  => 'em',
			'size'  => 1.12,
			'sizes' => [],
		],
	],
	[
		'_id'                    => 'text',
		'title'                  => 'Body Text',
		'typography_typography'  => 'custom',
		'typography_font_family' => 'Manrope',
		'typography_font_weight' => '400',
		'typography_line_height' => [
			'unit'  => 'em',
			'size'  => 1.5,
			'sizes' => [],
		],
	],
	[
		'_id'                    => 'accent',
		'title'                  => 'Buttons / Labels',
		'typography_typography'  => 'custom',
		'typography_font_family' => 'Space Grotesk',
		'typography_font_weight' => '600',
		'typography_line_height' => [
			'unit'  => 'em',
			'size'  => 1.2,
			'sizes' => [],
		],
	],
];

$settings['custom_typography'] = [
	[
		'_id'                    => 'bio_name_type',
		'title'                  => 'Bio Name',
		'typography_typography'  => 'custom',
		'typography_font_family' => 'Space Grotesk',
		'typography_font_weight' => '800',
		'typography_font_size'   => [
			'unit'  => 'px',
			'size'  => 56,
			'sizes' => [],
		],
		'typography_line_height' => [
			'unit'  => 'em',
			'size'  => 1,
			'sizes' => [],
		],
	],
	[
		'_id'                    => 'project_title_type',
		'title'                  => 'Project Title',
		'typography_typography'  => 'custom',
		'typography_font_family' => 'Space Grotesk',
		'typography_font_weight' => '700',
		'typography_font_size'   => [
			'unit'  => 'px',
			'size'  => 20,
			'sizes' => [],
		],
		'typography_line_height' => [
			'unit'  => 'em',
			'size'  => 1.15,
			'sizes' => [],
		],
	],
	[
		'_id'                    => 'project_body_type',
		'title'                  => 'Project Body',
		'typography_typography'  => 'custom',
		'typography_font_family' => 'Manrope',
		'typography_font_weight' => '500',
		'typography_font_size'   => [
			'unit'  => 'px',
			'size'  => 15,
			'sizes' => [],
		],
		'typography_line_height' => [
			'unit'  => 'em',
			'size'  => 1.42,
			'sizes' => [],
		],
	],
	[
		'_id'                    => 'micro_label_type',
		'title'                  => 'Micro Label',
		'typography_typography'  => 'custom',
		'typography_font_family' => 'Space Grotesk',
		'typography_font_weight' => '600',
		'typography_font_size'   => [
			'unit'  => 'px',
			'size'  => 13,
			'sizes' => [],
		],
		'typography_line_height' => [
			'unit'  => 'em',
			'size'  => 1.2,
			'sizes' => [],
		],
	],
];

$settings['default_generic_fonts'] = 'Sans-serif';

update_post_meta( $kit_id, '_elementor_page_settings', $settings );

if ( class_exists( '\Elementor\Plugin' ) ) {
	\Elementor\Plugin::$instance->files_manager->clear_cache();
}

WP_CLI::success( "Updated Elementor global colors and typography on kit {$kit_id}." );
