<?php
/**
 * Portfolio Workbench admin page.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench\Admin;

use GuilhermePortfolio\Workbench\Admin\Views\OverviewView;
use GuilhermePortfolio\Workbench\Context;
use GuilhermePortfolio\Workbench\TopologyService;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class AdminPage {

	public const CAPABILITY = 'edit_pages';
	public const MENU_SLUG = 'gp-portfolio-workbench';

	private TopologyService $topology;
	private OverviewView $view;
	private string $page_hook = '';

	public function __construct( TopologyService $topology, OverviewView $view ) {
		$this->topology = $topology;
		$this->view     = $view;
	}

	public function init_hooks(): void {
		add_action( 'admin_menu', array( $this, 'register_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	public function register_menu(): void {
		$this->page_hook = add_theme_page(
			__( 'Portfolio Workbench', 'guilherme-portfolio' ),
			__( 'Portfolio Workbench', 'guilherme-portfolio' ),
			self::CAPABILITY,
			self::MENU_SLUG,
			array( $this, 'render' )
		);
	}

	public function enqueue_assets( string $hook_suffix ): void {
		if ( $hook_suffix !== $this->page_hook ) {
			return;
		}

		wp_enqueue_style(
			'gp-workbench-admin',
			GP_THEME_URI . '/assets/css/admin-workbench.css',
			array(),
			GP_THEME_VERSION
		);
	}

	public function render(): void {
		if ( ! current_user_can( self::CAPABILITY ) ) {
			wp_die( esc_html__( 'You do not have permission to access this page.', 'guilherme-portfolio' ) );
		}

		$context_id = $this->selected_context_id();

		try {
			$payload = $this->topology->context( $context_id );
		} catch ( \InvalidArgumentException $error ) {
			$context_id = Context::ROOT_ID;
			$payload    = $this->topology->root();
		}

		$this->view->render( $payload, $this->topology->context_options(), $context_id, $this->notice() );
	}

	private function selected_context_id(): string {
		if ( isset( $_GET['context'] ) ) {
			return sanitize_text_field( wp_unslash( $_GET['context'] ) );
		}

		if ( isset( $_GET['project'] ) ) {
			return Context::project_id( absint( wp_unslash( $_GET['project'] ) ) );
		}

		return Context::ROOT_ID;
	}

	private function notice(): string {
		return isset( $_GET['gp_workbench_notice'] ) ? sanitize_key( wp_unslash( $_GET['gp_workbench_notice'] ) ) : '';
	}
}
