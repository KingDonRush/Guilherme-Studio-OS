<?php
/**
 * Portfolio Area Map admin page.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Areas\Admin;

use GuilhermePortfolio\Areas\Admin\Views\AreaMapView;
use GuilhermePortfolio\Areas\AreaItemRepository;
use GuilhermePortfolio\Areas\AreaRepository;
use GuilhermePortfolio\Areas\AreaUrl;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class AreaMapPage {

	public const CAPABILITY = 'edit_theme_options';
	public const MENU_SLUG  = 'gp-portfolio-area-map';
	private const MENU_ICON = 'dashicons-location-alt';
	private const MENU_POSITION = 58;

	private AreaRepository $areas;
	private AreaItemRepository $items;
	private AreaMapView $view;
	/** @var array<int,string> */
	private array $page_hooks = array();

	public function __construct( AreaRepository $areas, AreaItemRepository $items, AreaMapView $view ) {
		$this->areas = $areas;
		$this->items = $items;
		$this->view  = $view;
	}

	public function init_hooks(): void {
		add_action( 'admin_menu', array( $this, 'register_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	public function register_menu(): void {
		$this->page_hooks[] = add_menu_page(
			__( 'Mapa do Portfólio', 'guilherme-portfolio' ),
			__( 'Mapa do Portfólio', 'guilherme-portfolio' ),
			self::CAPABILITY,
			self::MENU_SLUG,
			array( $this, 'render' ),
			self::MENU_ICON,
			self::MENU_POSITION
		);

		$this->page_hooks[] = add_submenu_page(
			self::MENU_SLUG,
			__( 'Mapa do Portfólio', 'guilherme-portfolio' ),
			__( 'Todas as áreas', 'guilherme-portfolio' ),
			self::CAPABILITY,
			self::MENU_SLUG,
			array( $this, 'render' )
		);

		$this->page_hooks[] = add_submenu_page(
			self::MENU_SLUG,
			__( 'Adicionar área', 'guilherme-portfolio' ),
			__( 'Adicionar área', 'guilherme-portfolio' ),
			self::CAPABILITY,
			self::MENU_SLUG . '-add',
			array( $this, 'render' )
		);

		foreach ( array_filter( $this->page_hooks ) as $hook ) {
			add_action( 'load-' . $hook, array( $this, 'contain_global_notices' ) );
		}
	}

	public function enqueue_assets( string $hook_suffix ): void {
		if ( ! in_array( $hook_suffix, $this->page_hooks, true ) ) {
			return;
		}

		wp_enqueue_style(
			'gp-area-map-admin',
			AreaUrl::internal( GP_THEME_URI . '/assets/css/admin-area-map.css' ),
			array( 'dashicons' ),
			GP_THEME_VERSION
		);

		wp_enqueue_script(
			'gp-area-map-admin',
			AreaUrl::internal( GP_THEME_URI . '/assets/js/admin-area-map.js' ),
			array(),
			GP_THEME_VERSION,
			true
		);
	}

	public function contain_global_notices(): void {
		remove_all_actions( 'admin_notices' );
		remove_all_actions( 'all_admin_notices' );
	}

	public function render(): void {
		if ( ! current_user_can( self::CAPABILITY ) ) {
			wp_die( esc_html__( 'You do not have permission to access this page.', 'guilherme-portfolio' ) );
		}

		$area_view      = $this->current_area_view();
		$areas          = $this->areas->all( $area_view );
		$archived_count = $this->areas->archived_count();
		$area  = $this->selected_area( $areas );
		$items = $area ? $this->items->all( $area['id'] ) : array();
		?>
		<div class="wrap gp-area-map">
			<div class="gp-area-map-titlebar">
				<h1 class="screen-reader-text"><?php esc_html_e( 'Mapa do Portfólio', 'guilherme-portfolio' ); ?></h1>
			</div>
			<?php $this->render_notice(); ?>
			<?php $this->view->render( $areas, $area, $items, $area_view, $archived_count ); ?>
		</div>
		<?php
	}

	private function current_area_view(): string {
		$status = isset( $_GET['area_status'] ) ? sanitize_key( wp_unslash( $_GET['area_status'] ) ) : '';
		return 'archived' === $status ? 'archived' : 'active';
	}

	private function selected_area( array $areas ): ?array {
		$selected = isset( $_GET['area'] ) ? absint( $_GET['area'] ) : 0;

		if ( $selected ) {
			foreach ( $areas as $area ) {
				if ( (int) $area['id'] === $selected ) {
					return $area;
				}
			}
		}

		return $areas[0] ?? null;
	}

	private function render_notice(): void {
		$notice = isset( $_GET['gp_area_notice'] ) ? sanitize_key( wp_unslash( $_GET['gp_area_notice'] ) ) : '';

		if ( '' === $notice ) {
			return;
		}

		$messages = array(
			'area-created'  => __( 'Área criada.', 'guilherme-portfolio' ),
			'area-saved'    => __( 'Área salva.', 'guilherme-portfolio' ),
			'area-archived' => __( 'Área arquivada.', 'guilherme-portfolio' ),
			'area-restored' => __( 'Área restaurada.', 'guilherme-portfolio' ),
			'item-attached' => __( 'Item associado.', 'guilherme-portfolio' ),
			'item-saved'    => __( 'Item salvo.', 'guilherme-portfolio' ),
			'item-detached' => __( 'Item desassociado. O conteúdo original não foi deletado.', 'guilherme-portfolio' ),
		);

		if ( ! isset( $messages[ $notice ] ) ) {
			return;
		}

		printf(
			'<div class="notice notice-success is-dismissible gp-area-map-own-notice"><p>%s</p></div>',
			esc_html( $messages[ $notice ] )
		);
	}
}
