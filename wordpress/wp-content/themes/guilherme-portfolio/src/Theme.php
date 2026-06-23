<?php
/**
 * Theme service bootstrap.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio;

use GuilhermePortfolio\Projects\AdminColumns;
use GuilhermePortfolio\Projects\ContentAssignmentMetaBox;
use GuilhermePortfolio\Projects\ProjectMetaBox;
use GuilhermePortfolio\Projects\ProjectPostType;
use GuilhermePortfolio\Projects\ProjectRepository;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Theme {

	private static bool $booted = false;

	public static function boot(): void {
		if ( self::$booted ) {
			return;
		}

		self::$booted = true;

		$repository = new ProjectRepository();

		( new ProjectPostType() )->init_hooks();
		( new ProjectMetaBox( $repository ) )->init_hooks();
		( new ContentAssignmentMetaBox( $repository ) )->init_hooks();
		( new AdminColumns( $repository ) )->init_hooks();

		add_action( 'admin_enqueue_scripts', array( self::class, 'enqueue_admin_assets' ) );
	}

	public static function enqueue_admin_assets(): void {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;

		if ( ! $screen || ! self::is_project_admin_screen( $screen ) ) {
			return;
		}

		wp_enqueue_style(
			'gp-project-admin',
			GP_THEME_URI . '/assets/css/admin-projects.css',
			array(),
			GP_THEME_VERSION
		);
	}

	private static function is_project_admin_screen( \WP_Screen $screen ): bool {
		if ( ProjectRepository::POST_TYPE === $screen->post_type ) {
			return true;
		}

		if ( 'edit' === $screen->base || 'post' === $screen->base ) {
			return in_array( $screen->post_type, ProjectRepository::supported_content_post_types(), true );
		}

		return false;
	}
}
