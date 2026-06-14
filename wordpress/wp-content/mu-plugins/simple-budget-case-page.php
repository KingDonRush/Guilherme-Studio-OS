<?php
/**
 * Plugin Name: Simple Budget Case Page
 * Description: Serves the custom-coded Simple Budget Plugin portfolio case page.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const GSP_SIMPLE_BUDGET_CASE_ROUTE_VERSION = '2026-06-12.theme.1';

function gsp_simple_budget_case_theme_handles_route(): bool {
	return 'guilherme-portfolio' === get_stylesheet();
}

add_action(
	'init',
	static function (): void {
		if ( gsp_simple_budget_case_theme_handles_route() ) {
			if ( get_option( 'gsp_simple_budget_case_route_version' ) !== GSP_SIMPLE_BUDGET_CASE_ROUTE_VERSION ) {
				flush_rewrite_rules( false );
				update_option( 'gsp_simple_budget_case_route_version', GSP_SIMPLE_BUDGET_CASE_ROUTE_VERSION, false );
			}

			return;
		}

		add_rewrite_rule(
			'^work/simple-budget-plugin/?$',
			'index.php?gsp_simple_budget_case=1',
			'top'
		);

		if ( get_option( 'gsp_simple_budget_case_route_version' ) !== GSP_SIMPLE_BUDGET_CASE_ROUTE_VERSION ) {
			flush_rewrite_rules( false );
			update_option( 'gsp_simple_budget_case_route_version', GSP_SIMPLE_BUDGET_CASE_ROUTE_VERSION, false );
		}
	}
);

add_filter(
	'query_vars',
	static function ( array $vars ): array {
		$vars[] = 'gsp_simple_budget_case';

		return $vars;
	}
);

add_action(
	'template_redirect',
	static function (): void {
		if ( gsp_simple_budget_case_theme_handles_route() ) {
			return;
		}

		if ( '1' !== (string) get_query_var( 'gsp_simple_budget_case' ) ) {
			return;
		}

		$template = WP_CONTENT_DIR . '/pages/simple-budget-case/index.php';

		if ( ! is_readable( $template ) ) {
			status_header( 500 );
			wp_die( esc_html__( 'Simple Budget case template is missing.', 'default' ) );
		}

		$assets_url = content_url( 'pages/simple-budget-case/assets/' );
		$page_url   = home_url( '/work/simple-budget-plugin/' );
		$demo_url   = home_url( '/budget-demo/products/' );
		$avatar_url = content_url( 'uploads/2026/06/guilherme-silva-wordpress-developer-profile-badge-v1.webp' );

		status_header( 200 );
		nocache_headers();

		require $template;
		exit;
	}
);
