<?php
/**
 * Idempotent local setup for the portfolio Projects CCT and Elementor archive.
 *
 * Run with:
 * docker compose run --rm -T wpcli eval-file scripts/setup-portfolio-projects.php
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use EIT\CCT\DefinitionManager;
use EIT\CCT\Repository;
use EIT\CPT\CptManager;

if ( defined( 'WP_CLI' ) && WP_CLI && ! get_current_user_id() ) {
	$administrators = get_users( [ 'role' => 'administrator', 'number' => 1, 'fields' => 'ids' ] );
	if ( ! empty( $administrators[0] ) ) {
		wp_set_current_user( absint( $administrators[0] ) );
	}
}

$theme_dir = WP_CONTENT_DIR . '/themes/guilherme-portfolio';
$work_page = get_page_by_path( 'work' );
$work_parent = $work_page instanceof WP_Post ? $work_page->ID : 0;

$definition = [
	'slug'        => 'projects',
	'singular'    => 'Project',
	'plural'      => 'Projects',
	'description' => 'Portfolio projects displayed on the home and complete work archive.',
	'menu_icon'   => 'dashicons-portfolio',
	'public'      => true,
	'fields'      => [
		[ 'key' => 'summary', 'label' => 'Summary', 'type' => 'textarea', 'required' => true, 'filterable' => true ],
		[ 'key' => 'project_type', 'label' => 'Project type', 'type' => 'select', 'required' => true, 'filterable' => true, 'options' => "plugin | Plugin system\nwebsite | Website build" ],
		[ 'key' => 'featured', 'label' => 'Featured on home', 'type' => 'boolean', 'filterable' => true ],
		[ 'key' => 'thumbnail', 'label' => 'Thumbnail', 'type' => 'image' ],
		[ 'key' => 'main_image', 'label' => 'Main image', 'type' => 'image' ],
		[
			'key'        => 'stacks',
			'label'      => 'Stack',
			'type'       => 'multiselect',
			'filterable' => true,
			'options'    => "wordpress | WordPress\nelementor | Elementor\nphp | PHP\njavascript | JavaScript\nthreejs | Three.js\nwoocommerce | WooCommerce\ncss | CSS\nacf | ACF\nrank-math | Rank Math\nperformance | Performance",
		],
		[ 'key' => 'case_url', 'label' => 'Case URL', 'type' => 'url', 'required' => true ],
	],
];

DefinitionManager::save( $definition );
$repository = new Repository();

/**
 * Create or retrieve a portfolio case page.
 */
function eit_portfolio_case_page( $title, $slug, $parent = 0 ) {
	$path = $parent ? 'work/' . $slug : $slug;
	$page = get_page_by_path( $path );

	if ( $page instanceof WP_Post ) {
		return $page;
	}

	$id = wp_insert_post(
		[
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_title'   => $title,
			'post_name'    => $slug,
			'post_parent'  => absint( $parent ),
			'post_content' => '<p>This case study is being prepared.</p>',
		]
	);

	return get_post( $id );
}

/**
 * Import a theme preview into the Media Library once.
 */
function eit_portfolio_media( $source, $title, $alt ) {
	$basename = basename( $source );
	$existing = get_posts(
		[
			'post_type'      => 'attachment',
			'post_status'    => 'inherit',
			'posts_per_page' => 1,
			'meta_query'     => [
				[
					'key'     => '_wp_attached_file',
					'value'   => $basename,
					'compare' => 'LIKE',
				],
			],
		]
	);

	if ( $existing ) {
		return $existing[0]->ID;
	}

	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';

	$tmp = wp_tempnam( $basename );
	if ( ! $tmp || ! copy( $source, $tmp ) ) {
		return 0;
	}

	$file = [ 'name' => $basename, 'tmp_name' => $tmp ];
	$id = media_handle_sideload( $file, 0, $title );

	if ( is_wp_error( $id ) ) {
		@unlink( $tmp );
		return 0;
	}

	update_post_meta( $id, '_wp_attachment_image_alt', $alt );
	wp_update_post( [ 'ID' => $id, 'post_excerpt' => $alt ] );

	return $id;
}

$simple_budget = get_page_by_path( 'work/simple-budget-plugin' );
if ( ! $simple_budget ) {
	$simple_budget = get_page_by_path( 'simple-budget-plugin' );
}

$projects = [
	[
		'title'   => 'Simple Budget Plugin',
		'summary' => 'A composable quote workflow for Elementor builds that cannot accept rigid plugin pages.',
		'type'    => 'plugin',
		'stacks'  => [ 'wordpress', 'elementor', 'php', 'javascript' ],
		'image'   => 'simple-budget-preview-v1.webp',
		'page'    => $simple_budget,
	],
	[
		'title'   => '3D Viewer for Elementor',
		'summary' => 'Interactive 3D models inside Elementor with deliberate editor behavior and performance boundaries.',
		'type'    => 'plugin',
		'stacks'  => [ 'wordpress', 'elementor', 'javascript', 'threejs' ],
		'image'   => '3d-viewer-preview-v1.webp',
		'page'    => eit_portfolio_case_page( '3D Viewer for Elementor', '3d-viewer-for-elementor', $work_parent ),
	],
	[
		'title'   => 'WooCommerce Toolkit',
		'summary' => 'Reusable Elementor controls and templates for WooCommerce implementations with custom layouts.',
		'type'    => 'plugin',
		'stacks'  => [ 'wordpress', 'elementor', 'php', 'woocommerce' ],
		'image'   => 'woocommerce-toolkit-preview-v1.webp',
		'page'    => eit_portfolio_case_page( 'WooCommerce Toolkit', 'woocommerce-toolkit', $work_parent ),
	],
	[
		'title'   => 'Landing Page Implementation',
		'summary' => 'Conversion-focused landing page implementation for agencies, designers and product teams.',
		'type'    => 'website',
		'stacks'  => [ 'wordpress', 'elementor', 'css' ],
		'image'   => 'landing-page-preview-v1.webp',
		'page'    => eit_portfolio_case_page( 'Landing Page Implementation', 'landing-page-implementation' ),
	],
	[
		'title'   => 'Institutional Website',
		'summary' => 'Multi-page company websites with maintainable content structure, SEO foundations and clean delivery.',
		'type'    => 'website',
		'stacks'  => [ 'wordpress', 'elementor', 'acf', 'rank-math' ],
		'image'   => 'institutional-website-preview-v1.webp',
		'page'    => eit_portfolio_case_page( 'Institutional Website', 'institutional-website' ),
	],
	[
		'title'   => 'WooCommerce Store',
		'summary' => 'Complete stores with custom product discovery, filtering, cart, checkout and performance work.',
		'type'    => 'website',
		'stacks'  => [ 'wordpress', 'elementor', 'woocommerce', 'performance' ],
		'image'   => 'woocommerce-store-preview-v1.webp',
		'page'    => eit_portfolio_case_page( 'WooCommerce Store', 'woocommerce-store' ),
	],
];

foreach ( $projects as $index => $project ) {
	$image = eit_portfolio_media(
		$theme_dir . '/assets/images/project-previews/' . $project['image'],
		$project['title'] . ' portfolio preview',
		$project['title'] . ' case preview'
	);
	$existing = $repository->query( 'projects', [ 'search' => $project['title'], 'status' => [ 'publish', 'draft', 'archived' ], 'per_page' => 100 ] );
	$item_id = 0;

	foreach ( $existing['items'] as $item ) {
		if ( $item['title'] === $project['title'] ) {
			$item_id = $item['id'];
			break;
		}
	}

	$repository->save(
		'projects',
		[
			'title'        => $project['title'],
			'status'       => 'publish',
			'menu_order'   => $index + 1,
			'summary'      => $project['summary'],
			'project_type' => $project['type'],
			'featured'     => 1,
			'thumbnail'    => $image,
			'main_image'   => $image,
			'stacks'       => $project['stacks'],
			'case_url'     => $project['page'] instanceof WP_Post ? get_permalink( $project['page'] ) : home_url( '/work/' ),
		],
		$item_id
	);
}

$legacy = CptManager::get( '_portfolio_item' );
if ( $legacy ) {
	$counts = wp_count_posts( '_portfolio_item' );
	$meaningful_total = 0;
	foreach ( [ 'publish', 'future', 'draft', 'pending', 'private', 'trash' ] as $status ) {
		$meaningful_total += absint( $counts->{$status} ?? 0 );
	}

	if ( 0 === $meaningful_total ) {
		$auto_drafts = get_posts(
			[
				'post_type'      => '_portfolio_item',
				'post_status'    => 'auto-draft',
				'posts_per_page' => -1,
				'fields'         => 'ids',
			]
		);
		foreach ( $auto_drafts as $auto_draft_id ) {
			wp_delete_post( $auto_draft_id, true );
		}
		CptManager::delete_definition( '_portfolio_item' );
	}
}

/**
 * Return an Elementor dynamic-tag token.
 */
function eit_portfolio_dynamic_tag( $name, array $settings ) {
	return \Elementor\Plugin::$instance->dynamic_tags->tag_data_to_tag_text( wp_generate_uuid4(), $name, $settings );
}

/**
 * Create or update the shared Loop Item document.
 */
function eit_portfolio_loop_template() {
	$template = get_page_by_title( 'Portfolio Project Loop Item', OBJECT, 'elementor_library' );

	if ( ! $template ) {
		$document = \Elementor\Plugin::$instance->documents->create(
			'loop-item',
			[ 'post_title' => 'Portfolio Project Loop Item', 'post_status' => 'publish' ],
			[]
		);
		$template_id = $document ? absint( $document->get_main_id() ) : 0;
	} else {
		$template_id = $template->ID;
		$document = \Elementor\Plugin::$instance->documents->get( $template_id );
	}

	if ( ! $template_id || ! $document ) {
		return 0;
	}

	$text = fn( $field ) => eit_portfolio_dynamic_tag( 'eit-cct-text', [ 'cct_type' => 'projects', 'field' => $field ] );
	$image = eit_portfolio_dynamic_tag( 'eit-cct-image', [ 'cct_type' => 'projects', 'field' => 'thumbnail' ] );
	$url = eit_portfolio_dynamic_tag( 'eit-cct-url', [ 'cct_type' => 'projects', 'field' => 'case_url' ] );
	$elements = [
		[
			'id'       => 'cctcard1',
			'elType'   => 'container',
			'isInner'  => false,
			'settings' => [
				'container_type'      => 'flex',
				'flex_direction'      => 'column',
				'gap'                 => [ 'size' => 16, 'unit' => 'px' ],
				'background_background' => 'classic',
				'background_color'    => '#f7f7f4',
				'border_border'       => 'solid',
				'border_width'        => [ 'top' => 1, 'right' => 1, 'bottom' => 1, 'left' => 1, 'unit' => 'px', 'isLinked' => true ],
				'border_color'        => '#171717',
				'padding'             => [ 'top' => 18, 'right' => 18, 'bottom' => 18, 'left' => 18, 'unit' => 'px', 'isLinked' => true ],
				'_css_classes'        => 'gp-loop-project',
			],
			'elements' => [
				[
					'id'         => 'cctimg01',
					'elType'     => 'widget',
					'widgetType' => 'image',
					'settings'   => [ 'image' => [ 'url' => '', 'id' => '' ], 'image_size' => 'large', '__dynamic__' => [ 'image' => $image ] ],
					'elements'   => [],
				],
				[
					'id'         => 'ccttype1',
					'elType'     => 'widget',
					'widgetType' => 'heading',
					'settings'   => [ 'title' => 'Project type', 'header_size' => 'span', '__dynamic__' => [ 'title' => $text( 'project_type' ) ] ],
					'elements'   => [],
				],
				[
					'id'         => 'ccttitle',
					'elType'     => 'widget',
					'widgetType' => 'heading',
					'settings'   => [ 'title' => 'Project title', 'header_size' => 'h3', '__dynamic__' => [ 'title' => $text( 'title' ) ] ],
					'elements'   => [],
				],
				[
					'id'         => 'cctsum01',
					'elType'     => 'widget',
					'widgetType' => 'text-editor',
					'settings'   => [ 'editor' => 'Project summary', '__dynamic__' => [ 'editor' => $text( 'summary' ) ] ],
					'elements'   => [],
				],
				[
					'id'         => 'cctstack',
					'elType'     => 'widget',
					'widgetType' => 'text-editor',
					'settings'   => [ 'editor' => 'Stack', '__dynamic__' => [ 'editor' => $text( 'stacks' ) ] ],
					'elements'   => [],
				],
				[
					'id'         => 'cctbtn01',
					'elType'     => 'widget',
					'widgetType' => 'button',
					'settings'   => [ 'text' => 'View case', 'link' => [ 'url' => '' ], '__dynamic__' => [ 'link' => $url ] ],
					'elements'   => [],
				],
			],
		],
	];

	$document->save( [ 'elements' => $elements, 'settings' => [] ] );
	update_post_meta( $template_id, '_elementor_template_type', 'loop-item' );
	return $template_id;
}

$loop_template_id = eit_portfolio_loop_template();

if ( $work_page instanceof WP_Post && $loop_template_id ) {
	$work_document = \Elementor\Plugin::$instance->documents->get( $work_page->ID );
	$work_elements = [
		[
			'id'       => 'workwrap',
			'elType'   => 'container',
			'isInner'  => false,
			'settings' => [ 'container_type' => 'flex', 'flex_direction' => 'column', 'gap' => [ 'size' => 28, 'unit' => 'px' ], 'content_width' => 'boxed', '_css_classes' => 'gp-work-archive' ],
			'elements' => [
				[ 'id' => 'workhead', 'elType' => 'widget', 'widgetType' => 'heading', 'settings' => [ 'title' => 'Selected work', 'header_size' => 'h1' ], 'elements' => [] ],
				[
					'id'         => 'workfilt',
					'elType'     => 'widget',
					'widgetType' => 'eit-filter-controller',
					'settings'   => [
						'data_provider'    => 'cct',
						'cct_type'         => 'projects',
						'cct_template_id'  => $loop_template_id,
						'target_selector'  => '.gp-work-loop .elementor-loop-container',
						'configuration_source' => 'widget',
						'auto_apply'       => 'yes',
						'sync_url'         => 'yes',
						'per_page'         => 6,
						'filters'          => [
							[ '_id' => 'searchwork', 'label' => 'Search', 'type' => 'search', 'placeholder' => 'Search projects', 'layout_width' => 60, 'show_label' => '' ],
							[ '_id' => 'typework', 'label' => 'Project type', 'type' => 'chips', 'field_binding' => 'project_type', 'key' => 'project_type', 'resolved_key' => 'project_type', 'source' => 'data_attr', 'options' => "plugin | Plugin systems\nwebsite | Website builds", 'layout_width' => 40, 'show_label' => '' ],
						],
						'show_sort'        => 'yes',
						'layout_direction' => 'row',
						'sort_options_items' => [
							[ '_id' => 'manual', 'label' => 'Curated order', 'source' => 'default', 'direction' => 'asc' ],
							[ '_id' => 'title', 'label' => 'Title A-Z', 'source' => 'title', 'direction' => 'asc' ],
						],
					],
					'elements'   => [],
				],
				[
					'id'         => 'workloop',
					'elType'     => 'widget',
					'widgetType' => 'loop-grid',
					'settings'   => [
						'_skin'                        => 'toolkit-cct',
						'template_id'                  => $loop_template_id,
						'posts_per_page'               => 6,
						'columns'                      => 3,
						'columns_tablet'               => 2,
						'columns_mobile'               => 1,
						'toolkit_cct_cct_type'         => 'projects',
						'toolkit_cct_status'           => 'publish',
						'toolkit_cct_orderby'          => 'menu_order',
						'toolkit_cct_order'            => 'ASC',
						'pagination_type'              => 'numbers',
						'_css_classes'                 => 'gp-work-loop',
					],
					'elements'   => [],
				],
			],
		],
	];

	if ( $work_document ) {
		$work_document->save( [ 'elements' => $work_elements, 'settings' => [ 'template' => 'elementor_full_width' ] ] );
		update_post_meta( $work_page->ID, '_elementor_edit_mode', 'builder' );
		update_post_meta( $work_page->ID, '_wp_page_template', 'elementor_full_width' );
	}
}

WP_CLI::success( 'Projects CCT, media, case placeholders, Loop Item, and Work archive are synchronized.' );
