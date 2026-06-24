<?php
/**
 * Theme service bootstrap.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio;

use GuilhermePortfolio\CLI\Command;
use GuilhermePortfolio\CLI\WorkbenchCommand;
use GuilhermePortfolio\Projects\AdminColumns;
use GuilhermePortfolio\Projects\ContentAssignmentMetaBox;
use GuilhermePortfolio\Projects\ProjectMetaRegistration;
use GuilhermePortfolio\Projects\ProjectMetaBox;
use GuilhermePortfolio\Projects\ProjectPostType;
use GuilhermePortfolio\Projects\ProjectRepository;
use GuilhermePortfolio\Workbench\Admin\AdminActions;
use GuilhermePortfolio\Workbench\Admin\AdminPage;
use GuilhermePortfolio\Workbench\Admin\Views\CategoryModulesView;
use GuilhermePortfolio\Workbench\Admin\Views\FormsView;
use GuilhermePortfolio\Workbench\Admin\Views\OverviewView;
use GuilhermePortfolio\Workbench\Admin\Views\ProjectFormsView;
use GuilhermePortfolio\Workbench\Admin\Views\RelationsStripView;
use GuilhermePortfolio\Workbench\Admin\Views\SidebarView;
use GuilhermePortfolio\Workbench\Admin\Views\ViewParts;
use GuilhermePortfolio\Workbench\ItemStore;
use GuilhermePortfolio\Workbench\PageCreator;
use GuilhermePortfolio\Workbench\ProviderDataRegistry;
use GuilhermePortfolio\Workbench\RelationStore;
use GuilhermePortfolio\Workbench\SuggestionReviewer;
use GuilhermePortfolio\Workbench\SuggestionStore;
use GuilhermePortfolio\Workbench\TopologyService;

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
		$items      = new ItemStore( $repository );
		$pages      = new PageCreator( $items );
		$relations  = new RelationStore();
		$suggestions = new SuggestionStore();
		$reviewer   = new SuggestionReviewer( $suggestions, $relations );
		$providers  = new ProviderDataRegistry();
		$topology   = new TopologyService( $repository, $items, $relations, $suggestions, $providers );
		$form_view  = new FormsView();
		$project_forms = new ProjectFormsView();
		$view_parts = new ViewParts();

		( new ProjectPostType() )->init_hooks();
		( new ProjectMetaRegistration() )->init_hooks();
		( new ProjectMetaBox( $repository ) )->init_hooks();
		( new ContentAssignmentMetaBox( $repository ) )->init_hooks();
		( new AdminColumns( $repository ) )->init_hooks();
		( new Command( $repository ) )->init_hooks();
		( new WorkbenchCommand( $items, $pages, $relations, $reviewer, $suggestions, $topology ) )->init_hooks();
		( new AdminActions( $repository, $items, $pages, $relations, $reviewer, $suggestions ) )->init_hooks();
		( new AdminPage(
			$topology,
			new OverviewView(
				new CategoryModulesView( $form_view, $view_parts ),
				new RelationsStripView( $form_view, $view_parts ),
				new SidebarView( $form_view, $view_parts, $project_forms ),
				$view_parts
			),
			$project_forms
		) )->init_hooks();

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
