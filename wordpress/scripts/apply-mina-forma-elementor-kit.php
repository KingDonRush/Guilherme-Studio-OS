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

$without_ids = static function ( array $existing, array $ids ): array {
	return array_values(
		array_filter(
			$existing,
			static fn ( array $item ): bool => ! in_array( (string) ( $item['_id'] ?? '' ), $ids, true )
		)
	);
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

$type = static function (
	string $id,
	string $title,
	string $family,
	int $font_size,
	string $weight,
	float $line_height,
	bool $uppercase = false
) use ( $size, $em, $zero_px ): array {
	$token = array(
		'_id'                       => $id,
		'title'                     => $title,
		'typography_typography'     => 'custom',
		'typography_font_family'    => $family,
		'typography_font_size'      => $size( $font_size ),
		'typography_font_weight'    => $weight,
		'typography_line_height'    => $em( $line_height ),
		'typography_letter_spacing' => $zero_px,
	);

	if ( $uppercase ) {
		$token['typography_text_transform'] = 'uppercase';
	}

	return $token;
};

$mina_typography = array(
	$type( 'mf_display', 'Base - Display / H1', 'Bebas Neue', 72, '400', 0.88, true ),
	$type( 'mf_heading', 'Base - Section heading', 'Bebas Neue', 40, '400', 0.92, true ),
	$type( 'mf_body', 'Base - Body copy', 'Geist', 17, '400', 1.45 ),
	$type( 'mf_card_title', 'Base - Card title', 'Barlow Condensed', 28, '700', 0.98, true ),
	$type( 'mf_small', 'Base - Small copy', 'Geist', 20, '500', 1.35 ),
	$type( 'mf_label', 'Base - Label / nav / button', 'Barlow Condensed', 17, '800', 1.05, true ),
	$type( 'mf_logo', 'Base - Wordmark', 'Barlow Condensed', 27, '800', 0.95 ),
	$type( 'mf_header_main_title', 'Header - Main title / wordmark', 'Barlow Condensed', 40, '800', 0.9 ),
	$type( 'mf_header_menu', 'Header - Menu', 'Barlow Condensed', 13, '800', 1.05, true ),
	$type( 'mf_header_cta', 'Header - CTA', 'Barlow Condensed', 13, '800', 1.05, true ),
	$type( 'mf_page_kicker', 'Page - Kicker', 'Barlow Condensed', 17, '800', 1.05, true ),
	$type( 'mf_page_title', 'Page - Main title', 'Bebas Neue', 72, '400', 0.88, true ),
	$type( 'mf_page_lead', 'Page - Lead copy', 'Geist', 20, '500', 1.42 ),
	$type( 'mf_section_kicker', 'Section - Kicker', 'Barlow Condensed', 17, '800', 1.05, true ),
	$type( 'mf_section_title', 'Section - Title', 'Bebas Neue', 42, '400', 0.92, true ),
	$type( 'mf_section_body', 'Section - Body', 'Geist', 17, '400', 1.45 ),
	$type( 'mf_body_long', 'Body - Long form', 'Geist', 17, '400', 1.55 ),
	$type( 'mf_metadata', 'Metadata - Small detail', 'Geist', 18, '500', 1.25 ),
	$type( 'mf_inline_link', 'Inline - Text link', 'Barlow Condensed', 18, '800', 1.05, true ),
	$type( 'mf_button', 'Button - Primary / Secondary', 'Barlow Condensed', 17, '800', 1.05, true ),
	$type( 'mf_home_hero_eyebrow', 'Home Hero - Eyebrow', 'Barlow Condensed', 18, '800', 1.05, true ),
	$type( 'mf_home_hero_title', 'Home Hero - Main title', 'Bebas Neue', 80, '400', 0.88, true ),
	$type( 'mf_home_hero_lead', 'Home Hero - Lead', 'Geist', 20, '500', 1.42 ),
	$type( 'mf_home_proof_value', 'Home Proof - Value', 'Barlow Condensed', 24, '800', 1.0, true ),
	$type( 'mf_home_proof_label', 'Home Proof - Label', 'Barlow Condensed', 17, '800', 1.05, true ),
	$type( 'mf_home_service_number', 'Home Service Card - Number', 'Barlow Condensed', 18, '800', 1.0, true ),
	$type( 'mf_home_service_title', 'Home Service Card - Title', 'Barlow Condensed', 28, '700', 0.98, true ),
	$type( 'mf_home_service_body', 'Home Service Card - Body', 'Geist', 21, '400', 1.4 ),
	$type( 'mf_home_project_title', 'Home Project Card - Title', 'Barlow Condensed', 28, '700', 0.98, true ),
	$type( 'mf_home_cta_title', 'Home CTA - Title', 'Bebas Neue', 56, '400', 0.9, true ),
	$type( 'mf_about_hero_title', 'About Hero - Title', 'Bebas Neue', 72, '400', 0.88, true ),
	$type( 'mf_about_statement', 'About - Statement / quote', 'Geist', 24, '500', 1.32 ),
	$type( 'mf_about_process_title', 'About Process - Step title', 'Barlow Condensed', 24, '700', 1.0, true ),
	$type( 'mf_about_process_body', 'About Process - Body', 'Geist', 16, '400', 1.45 ),
	$type( 'mf_services_page_title', 'Services Page - Title', 'Bebas Neue', 72, '400', 0.88, true ),
	$type( 'mf_services_card_title', 'Services Card - Title', 'Barlow Condensed', 30, '700', 0.98, true ),
	$type( 'mf_services_card_body', 'Services Card - Body', 'Geist', 16, '400', 1.45 ),
	$type( 'mf_service_detail_title', 'Service Detail - Title', 'Bebas Neue', 68, '400', 0.88, true ),
	$type( 'mf_service_detail_lead', 'Service Detail - Lead', 'Geist', 20, '500', 1.42 ),
	$type( 'mf_service_deliverable_title', 'Service Detail - Deliverable title', 'Barlow Condensed', 22, '700', 1.0, true ),
	$type( 'mf_projects_page_title', 'Projects Page - Title', 'Bebas Neue', 72, '400', 0.88, true ),
	$type( 'mf_projects_filter_label', 'Projects Filter - Label', 'Barlow Condensed', 17, '800', 1.05, true ),
	$type( 'mf_projects_card_title', 'Projects Card - Title', 'Barlow Condensed', 30, '700', 0.98, true ),
	$type( 'mf_projects_card_meta', 'Projects Card - Meta', 'Geist', 18, '500', 1.25 ),
	$type( 'mf_case_hero_title', 'Case Detail - Hero title', 'Bebas Neue', 76, '400', 0.88, true ),
	$type( 'mf_case_hero_lead', 'Case Detail - Lead', 'Geist', 20, '500', 1.42 ),
	$type( 'mf_case_metric_value', 'Case Detail - Metric value', 'Barlow Condensed', 34, '800', 0.95, true ),
	$type( 'mf_case_metric_label', 'Case Detail - Metric label', 'Barlow Condensed', 17, '800', 1.05, true ),
	$type( 'mf_case_caption', 'Case Detail - Gallery caption', 'Geist', 18, '500', 1.35 ),
	$type( 'mf_plan_hero_title', 'Plan Page - Hero title', 'Bebas Neue', 72, '400', 0.88, true ),
	$type( 'mf_plan_hero_lead', 'Plan Page - Lead', 'Geist', 20, '500', 1.42 ),
	$type( 'mf_plan_form_label', 'Plan Form - Label', 'Barlow Condensed', 17, '800', 1.05, true ),
	$type( 'mf_plan_form_input', 'Plan Form - Input text', 'Geist', 21, '400', 1.35 ),
	$type( 'mf_plan_item_title', 'Plan Quote Item - Title', 'Geist', 21, '600', 1.3 ),
	$type( 'mf_plan_item_meta', 'Plan Quote Item - Meta', 'Geist', 17, '500', 1.25 ),
	$type( 'mf_plan_table_head', 'Plan Quote Table - Header', 'Barlow Condensed', 16, '800', 1.05, true ),
	$type( 'mf_plan_price', 'Plan Quote - Price / Total', 'Barlow Condensed', 22, '800', 0.95, true ),
	$type( 'mf_plan_empty_title', 'Plan Empty State - Title', 'Barlow Condensed', 26, '700', 1.0, true ),
	$type( 'mf_plan_empty_body', 'Plan Empty State - Body', 'Geist', 21, '400', 1.45 ),
	$type( 'mf_contact_page_title', 'Contact Page - Title', 'Bebas Neue', 72, '400', 0.88, true ),
	$type( 'mf_contact_form_label', 'Contact Form - Label', 'Barlow Condensed', 17, '800', 1.05, true ),
	$type( 'mf_contact_input', 'Contact Form - Input text', 'Geist', 21, '400', 1.35 ),
	$type( 'mf_contact_detail_title', 'Contact Detail - Title', 'Barlow Condensed', 24, '700', 1.0, true ),
	$type( 'mf_contact_detail_body', 'Contact Detail - Body', 'Geist', 21, '400', 1.4 ),
	$type( 'mf_footer_wordmark', 'Footer - Wordmark', 'Barlow Condensed', 28, '800', 0.95 ),
	$type( 'mf_footer_heading', 'Footer - Column heading', 'Barlow Condensed', 17, '800', 1.05, true ),
	$type( 'mf_footer_nav', 'Footer - Nav / legal', 'Geist', 17, '500', 1.35 ),
);

$legacy_mina_typography_ids = array(
	'primary',
	'secondary',
	'project_title_type',
	'text',
	'project_body_type',
	'accent',
	'micro_label_type',
	'hero_lead_type',
	'detail_type',
	'bio_name_type',
);

$settings['custom_colors']     = $upsert( is_array( $settings['custom_colors'] ?? null ) ? $settings['custom_colors'] : array(), $mina_colors );
$settings['custom_typography'] = $upsert(
	$without_ids(
		is_array( $settings['custom_typography'] ?? null ) ? $settings['custom_typography'] : array(),
		$legacy_mina_typography_ids
	),
	$mina_typography
);

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
