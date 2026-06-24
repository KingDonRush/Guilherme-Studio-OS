<?php
/**
 * Portfolio Workbench admin page.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench\Admin;

use GuilhermePortfolio\Projects\ProjectRepository;
use GuilhermePortfolio\Workbench\Admin\Views\OverviewView;
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

		$projects = $this->topology->project_options();

		if ( empty( $projects ) ) {
			$this->render_empty_state();
			return;
		}

		$project_id = $this->selected_project_id( $projects );

		try {
			$payload = $this->topology->project( $project_id );
		} catch ( \InvalidArgumentException $error ) {
			$project_id = absint( array_key_first( $projects ) );
			$payload    = $this->topology->project( $project_id );
		}

		$this->view->render( $payload, $projects, $project_id, $this->notice() );
	}

	private function render_empty_state(): void {
		$url = admin_url( 'post-new.php?post_type=' . ProjectRepository::POST_TYPE );
		?>
		<div class="wrap gp-workbench">
			<h1><?php esc_html_e( 'Portfolio Workbench', 'guilherme-portfolio' ); ?></h1>
			<div class="gp-workbench-empty">
				<span class="dashicons dashicons-portfolio" aria-hidden="true"></span>
				<h2><?php esc_html_e( 'No portfolio projects yet', 'guilherme-portfolio' ); ?></h2>
				<p><?php esc_html_e( 'Create the first project record, then attach pages, provider data and relations from here.', 'guilherme-portfolio' ); ?></p>
				<a class="button button-primary" href="<?php echo esc_url( $url ); ?>"><?php esc_html_e( 'Create project', 'guilherme-portfolio' ); ?></a>
			</div>
		</div>
		<?php
	}

	private function selected_project_id( array $projects ): int {
		$requested = isset( $_GET['project'] ) ? absint( wp_unslash( $_GET['project'] ) ) : 0;

		if ( $requested && isset( $projects[ (string) $requested ] ) ) {
			return $requested;
		}

		return absint( array_key_first( $projects ) );
	}

	private function notice(): string {
		return isset( $_GET['gp_workbench_notice'] ) ? sanitize_key( wp_unslash( $_GET['gp_workbench_notice'] ) ) : '';
	}
}
