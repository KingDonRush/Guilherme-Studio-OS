<?php
/**
 * Apply Mina Forma colors and typography to the active Elementor kit.
 *
 * Usage:
 *   docker compose run --rm -T wpcli eval-file scripts/apply-mina-forma-elementor-kit.php
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

$upsert = static function ( array $existing, array $incoming ): array {
	$incoming_ids = array_map(
		static fn ( array $item ): string => (string) ( $item['_id'] ?? '' ),
		$incoming
	);
	$kept         = array_values(
		array_filter(
			$existing,
			static fn ( array $item ): bool => ! in_array( (string) ( $item['_id'] ?? '' ), $incoming_ids, true )
		)
	);

	return array_values( array_merge( $kept, $incoming ) );
};

$mina_colors = array(
	array( '_id' => 'mf_ink', 'title' => 'Mina 01 Ink', 'color' => '#151513' ),
	array( '_id' => 'mf_paper', 'title' => 'Mina 02 Warm Paper', 'color' => '#F4EFE5' ),
	array( '_id' => 'mf_surface', 'title' => 'Mina 03 Surface', 'color' => '#FBF8F0' ),
	array( '_id' => 'mf_line', 'title' => 'Mina 04 Fine Line', 'color' => '#D8D0C4' ),
	array( '_id' => 'mf_muted', 'title' => 'Mina 05 Muted Text', 'color' => '#5F625D' ),
	array( '_id' => 'mf_cyan', 'title' => 'Mina 06 Technical Cyan', 'color' => '#14D8D2' ),
	array( '_id' => 'mf_clay', 'title' => 'Mina 07 Clay Accent', 'color' => '#D96E32' ),
	array( '_id' => 'mf_violet', 'title' => 'Mina 08 Violet Accent', 'color' => '#6654D9' ),
	array( '_id' => 'mf_dark', 'title' => 'Mina 09 Dark Section', 'color' => '#23211E' ),
	array( '_id' => 'mf_success', 'title' => 'Mina 10 Success', 'color' => '#2F9B75' ),
);

$mina_typography = array(
	array(
		'_id'                       => 'mf_display',
		'title'                     => 'Mina 01 Display H1',
		'typography_typography'     => 'custom',
		'typography_font_family'    => 'Archivo Black',
		'typography_font_size'      => $size( 58 ),
		'typography_font_weight'    => '400',
		'typography_line_height'    => $em( 0.95 ),
		'typography_letter_spacing' => $zero_px,
	),
	array(
		'_id'                       => 'mf_heading',
		'title'                     => 'Mina 02 Section Heading',
		'typography_typography'     => 'custom',
		'typography_font_family'    => 'Space Grotesk',
		'typography_font_size'      => $size( 36 ),
		'typography_font_weight'    => '700',
		'typography_line_height'    => $em( 1.08 ),
		'typography_letter_spacing' => $zero_px,
	),
	array(
		'_id'                       => 'mf_card_title',
		'title'                     => 'Mina 03 Card Title',
		'typography_typography'     => 'custom',
		'typography_font_family'    => 'Space Grotesk',
		'typography_font_size'      => $size( 20 ),
		'typography_font_weight'    => '700',
		'typography_line_height'    => $em( 1.15 ),
		'typography_letter_spacing' => $zero_px,
	),
	array(
		'_id'                       => 'mf_body',
		'title'                     => 'Mina 04 Body',
		'typography_typography'     => 'custom',
		'typography_font_family'    => 'Hind',
		'typography_font_size'      => $size( 17 ),
		'typography_font_weight'    => '500',
		'typography_line_height'    => $em( 1.48 ),
		'typography_letter_spacing' => $zero_px,
	),
	array(
		'_id'                       => 'mf_small',
		'title'                     => 'Mina 05 Small Copy',
		'typography_typography'     => 'custom',
		'typography_font_family'    => 'Hind',
		'typography_font_size'      => $size( 14 ),
		'typography_font_weight'    => '500',
		'typography_line_height'    => $em( 1.35 ),
		'typography_letter_spacing' => $zero_px,
	),
	array(
		'_id'                       => 'mf_label',
		'title'                     => 'Mina 06 Label',
		'typography_typography'     => 'custom',
		'typography_font_family'    => 'Space Grotesk',
		'typography_font_size'      => $size( 12 ),
		'typography_font_weight'    => '700',
		'typography_text_transform' => 'uppercase',
		'typography_line_height'    => $em( 1.2 ),
		'typography_letter_spacing' => $zero_px,
	),
);

$settings['custom_colors']     = $upsert( is_array( $settings['custom_colors'] ?? null ) ? $settings['custom_colors'] : array(), $mina_colors );
$settings['custom_typography'] = $upsert( is_array( $settings['custom_typography'] ?? null ) ? $settings['custom_typography'] : array(), $mina_typography );

update_post_meta( $kit_id, '_elementor_page_settings', $settings );
delete_post_meta( $kit_id, '_elementor_css' );

if ( class_exists( '\\Elementor\\Plugin' ) ) {
	\Elementor\Plugin::$instance->files_manager->clear_cache();
}

WP_CLI::line(
	wp_json_encode(
		array(
			'apiVersion' => 'studio.guilherme.dev/elementor-kit-v1',
			'site'       => 'mina-forma',
			'kitId'      => $kit_id,
			'colors'     => count( $mina_colors ),
			'typography' => count( $mina_typography ),
			'status'     => 'applied',
		)
	)
);
