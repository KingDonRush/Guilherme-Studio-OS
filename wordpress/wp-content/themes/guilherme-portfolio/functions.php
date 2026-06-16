<?php
/**
 * Guilherme Portfolio theme functions.
 *
 * @package GuilhermePortfolio
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'GP_THEME_VERSION', '0.3.27' );
define( 'GP_THEME_DIR', get_template_directory() );
define( 'GP_THEME_URI', get_template_directory_uri() );

add_action(
	'after_setup_theme',
	static function (): void {
		add_theme_support( 'title-tag' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'responsive-embeds' );
		add_theme_support( 'editor-styles' );
		add_theme_support( 'html5', array( 'caption', 'comment-form', 'comment-list', 'gallery', 'search-form', 'script', 'style' ) );
		add_theme_support( 'elementor' );

		register_nav_menus(
			array(
				'primary' => __( 'Primary Navigation', 'guilherme-portfolio' ),
				'footer'  => __( 'Footer Navigation', 'guilherme-portfolio' ),
			)
		);
	}
);

add_action(
	'wp_enqueue_scripts',
	static function (): void {
		wp_enqueue_style(
			'gp-fonts',
			'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Geist:wght@400;500;600;700;800&family=Hind:wght@400;500;600;700&family=Onest:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap',
			array(),
			null
		);

		if ( is_front_page() || is_page( 'simple-budget-plugin' ) ) {
			wp_enqueue_style(
				'gp-font-awesome',
				plugins_url( 'elementor/assets/lib/font-awesome/css/all.min.css' ),
				array(),
				'5.15.3'
			);
		}

		wp_enqueue_style(
			'gp-theme',
			GP_THEME_URI . '/assets/css/theme.css',
			array( 'gp-fonts' ),
			GP_THEME_VERSION
		);

		if ( is_page( 'simple-budget-plugin' ) ) {
			wp_enqueue_style(
				'gp-simple-budget-case',
				GP_THEME_URI . '/assets/css/case-simple-budget.css',
				array( 'gp-theme' ),
				GP_THEME_VERSION
			);
			wp_enqueue_script(
				'gp-simple-budget-case',
				GP_THEME_URI . '/assets/js/case-simple-budget.js',
				array(),
				GP_THEME_VERSION,
				true
			);
		}

		wp_enqueue_script(
			'gp-theme',
			GP_THEME_URI . '/assets/js/theme.js',
			array(),
			GP_THEME_VERSION,
			true
		);
	}
);

add_action(
	'wp_enqueue_scripts',
	static function (): void {
		if ( ! is_page( 'simple-budget-plugin' ) ) {
			return;
		}

		wp_dequeue_script( 'elementor-frontend' );
		wp_dequeue_script( 'elementor-webpack-runtime' );
	},
	100
);

/**
 * Return a theme asset URL.
 */
function gp_asset_url( string $path ): string {
	return GP_THEME_URI . '/' . ltrim( $path, '/' );
}

/**
 * Print an image-like icon from the theme asset folder.
 */
function gp_icon_img( string $filename, string $alt = '', string $class = '' ): string {
	$src = gp_asset_url( 'assets/icons/' . ltrim( $filename, '/' ) );

	return sprintf(
		'<img class="%1$s" src="%2$s" alt="%3$s" decoding="async">',
		esc_attr( trim( 'gp-icon ' . $class ) ),
		esc_url( $src ),
		esc_attr( $alt )
	);
}

/**
 * Render an optional Elementor template slot by slug.
 */
function gp_render_elementor_slot( string $slug, string $fallback = '' ): void {
	if ( ! did_action( 'elementor/loaded' ) || ! class_exists( '\Elementor\Plugin' ) ) {
		echo wp_kses_post( $fallback );
		return;
	}

	$template = get_page_by_path( sanitize_title( $slug ), OBJECT, 'elementor_library' );

	if ( ! $template instanceof WP_Post ) {
		echo wp_kses_post( $fallback );
		return;
	}

	echo \Elementor\Plugin::instance()->frontend->get_builder_content_for_display( $template->ID ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}

/**
 * Fallback navigation used before menus are configured.
 */
function gp_default_nav(): void {
	?>
	<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Work', 'guilherme-portfolio' ); ?></a>
	<a href="<?php echo esc_url( home_url( '/work/simple-budget-plugin/' ) ); ?>"><?php esc_html_e( 'Simple Budget', 'guilherme-portfolio' ); ?></a>
	<a href="<?php echo esc_url( home_url( '/budget-demo/products/' ) ); ?>"><?php esc_html_e( 'Demo', 'guilherme-portfolio' ); ?></a>
	<a href="#contact"><?php esc_html_e( 'Contact', 'guilherme-portfolio' ); ?></a>
	<?php
}

/**
 * Return published portfolio projects from the Toolkit CCT.
 *
 * @return array<int,array<string,mixed>>
 */
function gp_portfolio_projects(): array {
	if ( ! function_exists( 'eit_query_cct_items' ) ) {
		return array();
	}

	$result = eit_query_cct_items(
		'projects',
		array(
			'status'   => array( 'publish' ),
			'per_page' => 100,
			'orderby'  => 'menu_order',
			'order'    => 'ASC',
		)
	);

	return is_array( $result['items'] ?? null ) ? $result['items'] : array();
}

/**
 * Resolve a stack identifier to an existing theme asset.
 */
function gp_stack_icon( string $stack ): string {
	$icons = array(
		'threejs'     => 'threejs-mark.svg',
		'acf'         => 'acf-mark.svg',
		'rank-math'   => 'rank-math-mark.svg',
		'woocommerce' => 'woocommerce-mark.svg',
	);

	return $icons[ $stack ] ?? '';
}

/**
 * Resolve common stacks to the brand marks bundled with Elementor.
 */
function gp_stack_mark( string $stack ): string {
	$marks = array(
		'wordpress'   => 'fab fa-wordpress-simple',
		'elementor'   => 'fab fa-elementor',
		'php'         => 'fab fa-php',
		'javascript'  => 'fab fa-js',
		'css'         => 'fab fa-css3-alt',
		'performance' => 'fas fa-tachometer-alt',
	);

	return $marks[ $stack ] ?? '';
}
