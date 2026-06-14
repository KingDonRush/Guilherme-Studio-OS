<?php
/**
 * Apply portfolio/case global colors and typography to the active Elementor kit.
 *
 * Usage:
 *   ./scripts/wp.sh eval-file scripts/apply-simple-budget-elementor-globals.php
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$kit_id = (int) get_option( 'elementor_active_kit' );

if ( ! $kit_id ) {
	WP_CLI::error( 'No active Elementor kit found.' );
}

$settings = get_post_meta( $kit_id, '_elementor_page_settings', true );

if ( ! is_array( $settings ) ) {
	$settings = array();
}

$size = static function ( int $value ): array {
	return array(
		'unit'  => 'px',
		'size'  => $value,
		'sizes' => array(),
	);
};

$em = static function ( float $value ): array {
	return array(
		'unit'  => 'em',
		'size'  => $value,
		'sizes' => array(),
	);
};

$zero_px = array(
	'unit'  => 'px',
	'size'  => 0,
	'sizes' => array(),
);

$settings['custom_colors'] = array(
	array( '_id' => 'secondary', 'title' => '01 Hero bg / footer', 'color' => '#07111C' ),
	array( '_id' => 'hero_panel', 'title' => '02 Dark panel / cards', 'color' => '#0D1721' ),
	array( '_id' => 'bio_name', 'title' => '03 Text on dark / heading', 'color' => '#F7FAFC' ),
	array( '_id' => 'bio_role', 'title' => '04 Text on dark / body', 'color' => '#D8DEE8' ),
	array( '_id' => 'bio_body', 'title' => '05 Text on dark / muted', 'color' => '#B8C2D1' ),
	array( '_id' => 'primary', 'title' => '06 Accent cyan / links', 'color' => '#00D6C9' ),
	array( '_id' => 'bio_handle', 'title' => '07 Cyan active / underline', 'color' => '#22E6D2' ),
	array( '_id' => 'accent', 'title' => '08 Accent violet / plugin', 'color' => '#5E35F2' ),
	array( '_id' => 'accent_deep', 'title' => '09 Violet deep / hover', 'color' => '#3C16C8' ),
	array( '_id' => 'cta_warm', 'title' => '10 CTA warm / demo button', 'color' => '#E36A00' ),
	array( '_id' => 'case_canvas', 'title' => '11 Light bg / case sections', 'color' => '#F7F3EA' ),
	array( '_id' => 'case_card', 'title' => '12 Light card / UI blocks', 'color' => '#FBFAF4' ),
	array( '_id' => 'project_heading', 'title' => '13 Text on light / heading', 'color' => '#081020' ),
	array( '_id' => 'text', 'title' => '14 Text on light / body', 'color' => '#283241' ),
	array( '_id' => 'project_muted', 'title' => '15 Text on light / muted', 'color' => '#647083' ),
	array( '_id' => 'project_link', 'title' => '16 Link on light / teal', 'color' => '#007B78' ),
	array( '_id' => 'divider_light', 'title' => '17 Border on light', 'color' => '#D8D0C8' ),
	array( '_id' => 'border_dark', 'title' => '18 Border on dark', 'color' => '#2B3948' ),
	array( '_id' => 'success_check', 'title' => '19 Success / check icon', 'color' => '#00A899' ),
	array( '_id' => 'warning_line', 'title' => '20 Warning / problem icon', 'color' => '#D97706' ),
);

$settings['custom_typography'] = array(
	array(
		'_id'                       => 'primary',
		'title'                     => '01 Hero H1 / case title',
		'typography_typography'     => 'custom',
		'typography_font_family'    => 'Space Grotesk',
		'typography_font_size'      => $size( 54 ),
		'typography_font_weight'    => '800',
		'typography_line_height'    => $em( 1.02 ),
		'typography_letter_spacing' => $zero_px,
	),
	array(
		'_id'                       => 'secondary',
		'title'                     => '02 Section H2 / fold title',
		'typography_typography'     => 'custom',
		'typography_font_family'    => 'Space Grotesk',
		'typography_font_size'      => $size( 34 ),
		'typography_font_weight'    => '700',
		'typography_line_height'    => $em( 1.12 ),
		'typography_letter_spacing' => $zero_px,
	),
	array(
		'_id'                       => 'project_title_type',
		'title'                     => '03 Card title / feature',
		'typography_typography'     => 'custom',
		'typography_font_family'    => 'Space Grotesk',
		'typography_font_size'      => $size( 19 ),
		'typography_font_weight'    => '700',
		'typography_line_height'    => $em( 1.15 ),
		'typography_letter_spacing' => $zero_px,
	),
	array(
		'_id'                       => 'text',
		'title'                     => '04 Body / long copy',
		'typography_typography'     => 'custom',
		'typography_font_family'    => 'Manrope',
		'typography_font_size'      => $size( 16 ),
		'typography_font_weight'    => '400',
		'typography_line_height'    => $em( 1.55 ),
		'typography_letter_spacing' => $zero_px,
	),
	array(
		'_id'                       => 'project_body_type',
		'title'                     => '05 Card body / evidence',
		'typography_typography'     => 'custom',
		'typography_font_family'    => 'Manrope',
		'typography_font_size'      => $size( 14 ),
		'typography_font_weight'    => '500',
		'typography_line_height'    => $em( 1.45 ),
		'typography_letter_spacing' => $zero_px,
	),
	array(
		'_id'                       => 'accent',
		'title'                     => '06 Button + nav label',
		'typography_typography'     => 'custom',
		'typography_font_family'    => 'Space Grotesk',
		'typography_font_size'      => $size( 14 ),
		'typography_font_weight'    => '600',
		'typography_line_height'    => $em( 1.2 ),
		'typography_letter_spacing' => $zero_px,
	),
	array(
		'_id'                       => 'micro_label_type',
		'title'                     => '07 Kicker / section number',
		'typography_typography'     => 'custom',
		'typography_font_family'    => 'Space Grotesk',
		'typography_font_size'      => $size( 12 ),
		'typography_font_weight'    => '700',
		'typography_line_height'    => $em( 1.2 ),
		'typography_letter_spacing' => $zero_px,
	),
	array(
		'_id'                       => 'hero_lead_type',
		'title'                     => '08 Hero lead / subtitle',
		'typography_typography'     => 'custom',
		'typography_font_family'    => 'Manrope',
		'typography_font_size'      => $size( 20 ),
		'typography_font_weight'    => '600',
		'typography_line_height'    => $em( 1.45 ),
		'typography_letter_spacing' => $zero_px,
	),
	array(
		'_id'                       => 'detail_type',
		'title'                     => '09 Small detail / metadata',
		'typography_typography'     => 'custom',
		'typography_font_family'    => 'Manrope',
		'typography_font_size'      => $size( 13 ),
		'typography_font_weight'    => '500',
		'typography_line_height'    => $em( 1.35 ),
		'typography_letter_spacing' => $zero_px,
	),
	array(
		'_id'                       => 'bio_name_type',
		'title'                     => '10 Header name / signature',
		'typography_typography'     => 'custom',
		'typography_font_family'    => 'Space Grotesk',
		'typography_font_size'      => $size( 20 ),
		'typography_font_weight'    => '800',
		'typography_line_height'    => $em( 1.05 ),
		'typography_letter_spacing' => $zero_px,
	),
);

update_post_meta( $kit_id, '_elementor_page_settings', $settings );
delete_post_meta( $kit_id, '_elementor_css' );

if ( class_exists( '\\Elementor\\Plugin' ) ) {
	\Elementor\Plugin::$instance->files_manager->clear_cache();
}

WP_CLI::success( sprintf( 'Applied %d colors and %d typography globals to Elementor kit %d.', count( $settings['custom_colors'] ), count( $settings['custom_typography'] ), $kit_id ) );
