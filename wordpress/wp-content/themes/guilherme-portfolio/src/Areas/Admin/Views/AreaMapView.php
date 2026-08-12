<?php
/**
 * Main Portfolio Area Map view.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Areas\Admin\Views;

use GuilhermePortfolio\Areas\Admin\AreaMapPage;
use GuilhermePortfolio\Areas\AreaItemRepository;
use GuilhermePortfolio\Areas\AreaUrl;
use GuilhermePortfolio\Areas\DestinationResolver;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class AreaMapView {

	private AreaMapContextView $context;
	private AreaMapModalView $modals;
	private AreaMapSidebarView $sidebar;
	private DestinationResolver $destinations;

	public function __construct( DestinationResolver $destinations, AreaMapSidebarView $sidebar, AreaMapModalView $modals, AreaMapContextView $context ) {
		$this->context      = $context;
		$this->destinations = $destinations;
		$this->sidebar      = $sidebar;
		$this->modals       = $modals;
	}

	public function render( array $areas, ?array $area, array $items, string $area_view = 'active', int $archived_count = 0 ): void {
		$groups = $this->group_items( $items );
		?>
		<div class="gp-area-map-canvas">
			<main class="gp-area-map-main-card">
				<?php
				if ( ! $area ) {
					$this->empty_state();
				} else {
					$this->selected_area( $area, $groups );
				}
				?>
			</main>
			<aside class="gp-area-map-sidebar">
				<?php $this->sidebar->render( $areas, $area, $area_view, $archived_count ); ?>
			</aside>
		</div>
		<footer class="gp-area-map-footnote">
			<span>
				<span class="dashicons dashicons-info" aria-hidden="true"></span>
				<?php esc_html_e( 'Nada é criado aqui por padrão: associe itens e abra o editor nativo quando precisar agir.', 'guilherme-portfolio' ); ?>
			</span>
			<a href="<?php echo esc_url( AreaUrl::admin( 'admin.php?page=' . AreaMapPage::MENU_SLUG ) ); ?>">
				<?php esc_html_e( 'Saiba mais sobre este mapa', 'guilherme-portfolio' ); ?>
				<span class="dashicons dashicons-external" aria-hidden="true"></span>
			</a>
		</footer>
		<?php $this->modals->render( $area ); ?>
		<?php
	}

	private function selected_area( array $area, array $groups ): void {
		$connection_count = $this->context->connection_count( $groups );
		?>
		<section class="gp-area-map-hero">
			<div class="gp-area-map-avatar" aria-hidden="true"><?php echo esc_html( AreaMapIcons::initials( $area['title'] ) ); ?></div>
			<div class="gp-area-map-hero-body">
				<div class="gp-area-map-title-row">
					<h2><?php echo esc_html( $area['title'] ); ?></h2>
					<?php $this->badge( $this->status_label( $area['status'] ), 'archived' === $area['status'] ? 'neutral' : 'success' ); ?>
				</div>
				<div class="gp-area-map-badges">
					<?php $this->badge( __( 'Área manual', 'guilherme-portfolio' ), 'neutral' ); ?>
					<?php $this->badge( sprintf( _n( '%d página', '%d páginas', count( $groups['pages'] ), 'guilherme-portfolio' ), count( $groups['pages'] ) ), 'neutral' ); ?>
					<?php $this->badge( sprintf( _n( '%d conexão', '%d conexões', $connection_count, 'guilherme-portfolio' ), $connection_count ), 'neutral' ); ?>
				</div>
			</div>
			<div class="gp-area-map-hero-tools" aria-label="<?php esc_attr_e( 'Area actions', 'guilherme-portfolio' ); ?>">
				<?php if ( 'archived' === $area['status'] ) : ?>
					<button type="button" class="button button-primary" data-gp-modal-open="edit-area">
						<span class="dashicons dashicons-undo" aria-hidden="true"></span>
						<?php esc_html_e( 'Restaurar área', 'guilherme-portfolio' ); ?>
					</button>
				<?php else : ?>
					<button type="button" class="button button-primary" data-gp-modal-open="attach-item">
						<span class="dashicons dashicons-admin-links" aria-hidden="true"></span>
						<?php esc_html_e( 'Associar item', 'guilherme-portfolio' ); ?>
					</button>
					<button type="button" class="button" data-gp-modal-open="edit-area">
						<span class="dashicons dashicons-admin-generic" aria-hidden="true"></span>
						<?php esc_html_e( 'Editar área', 'guilherme-portfolio' ); ?>
					</button>
				<?php endif; ?>
			</div>
		</section>

		<?php $this->pages_section( $area, $groups ); ?>
		<?php
	}

	private function pages_section( array $area, array $groups ): void {
		$items = $groups['pages'];
		?>
		<section class="gp-area-map-section" data-gp-context-surface>
			<div class="gp-area-map-section-head">
				<h3>
					<?php esc_html_e( 'Páginas associadas', 'guilherme-portfolio' ); ?>
					<span class="dashicons dashicons-info" title="<?php esc_attr_e( 'Páginas e posts reais ligados a esta área humana do portfólio.', 'guilherme-portfolio' ); ?>"></span>
				</h3>
				<span><?php esc_html_e( 'Passe pelo card para ver conexões. Clique para fixar.', 'guilherme-portfolio' ); ?></span>
			</div>
			<div class="gp-area-map-pages-layout">
				<div class="gp-area-map-pages-main">
					<?php if ( empty( $items ) ) : ?>
						<p class="gp-area-map-empty-line"><?php esc_html_e( 'Nenhuma página associada ainda.', 'guilherme-portfolio' ); ?></p>
					<?php else : ?>
						<div class="gp-area-map-page-grid" data-gp-page-grid>
							<?php foreach ( array_values( $items ) as $index => $item ) : ?>
								<?php $this->page_card( $area, $item, $index ); ?>
							<?php endforeach; ?>
						</div>
						<?php if ( 6 < count( $items ) ) : ?>
							<div class="gp-area-map-page-pager" data-gp-page-pager hidden>
								<button type="button" class="button" data-gp-page-prev><?php esc_html_e( 'Anterior', 'guilherme-portfolio' ); ?></button>
								<span data-gp-page-count></span>
								<button type="button" class="button" data-gp-page-next><?php esc_html_e( 'Próxima', 'guilherme-portfolio' ); ?></button>
							</div>
						<?php endif; ?>
					<?php endif; ?>
				</div>
				<?php $this->context->render( $area, $items, $groups ); ?>
			</div>
		</section>
		<?php
	}

	private function page_card( array $area, array $item, int $index ): void {
		$links = $this->destinations->links( $item );
		?>
		<article class="gp-area-map-page-card" tabindex="0" data-gp-page-card data-gp-page-index="<?php echo esc_attr( (string) $index ); ?>" data-gp-context-trigger="<?php echo esc_attr( $item['id'] ); ?>">
			<header>
				<span class="gp-area-map-page-icon dashicons <?php echo esc_attr( AreaMapIcons::role( $item['role'] ) ); ?>" aria-hidden="true"></span>
				<span>
					<strong><?php echo esc_html( $item['label'] ); ?></strong>
				</span>
			</header>
			<div class="gp-area-map-page-status">
				<span><?php echo esc_html( $this->role_label( $item ) ); ?></span>
				<span title="<?php esc_attr_e( 'Atalhos encontrados para este item.', 'guilherme-portfolio' ); ?>">
					<?php echo esc_html( sprintf( _n( '%d atalho', '%d atalhos', count( $links ), 'guilherme-portfolio' ), count( $links ) ) ); ?>
				</span>
			</div>
		</article>
		<?php
	}

	private function empty_state(): void {
		?>
		<section class="gp-area-map-empty">
			<span class="dashicons dashicons-location-alt" aria-hidden="true"></span>
			<h2><?php esc_html_e( 'Mapa pronto para organizar o portfólio.', 'guilherme-portfolio' ); ?></h2>
			<p><?php esc_html_e( 'Crie uma área como Portfolio, Mina Forma ou Ecommerce 3D. Depois associe páginas, post types, menus e atalhos nativos.', 'guilherme-portfolio' ); ?></p>
		</section>
		<?php
	}

	private function role_label( array $item ): string {
		$role = AreaItemRepository::roles()[ $item['role'] ] ?? __( 'Item', 'guilherme-portfolio' );

		if ( 0 === strcasecmp( $role, $item['label'] ) ) {
			return __( 'Página', 'guilherme-portfolio' );
		}

		return $role;
	}

	private function group_items( array $items ): array {
		$groups = array_fill_keys( array_keys( AreaItemRepository::categories() ), array() );

		foreach ( $items as $item ) {
			$groups[ $item['category'] ][] = $item;
		}

		return $groups;
	}

	private function badge( string $label, string $tone, string $tip = '' ): void {
		?>
		<span class="gp-area-map-badge is-<?php echo esc_attr( $tone ); ?>">
			<?php echo esc_html( $label ); ?>
			<?php if ( '' !== $tip ) : ?>
				<span class="dashicons dashicons-info" title="<?php echo esc_attr( $tip ); ?>"></span>
			<?php endif; ?>
		</span>
		<?php
	}

	private function status_label( string $status ): string {
		return array(
			'active'   => __( 'Área ativa', 'guilherme-portfolio' ),
			'draft'    => __( 'Rascunho', 'guilherme-portfolio' ),
			'paused'   => __( 'Pausada', 'guilherme-portfolio' ),
			'archived' => __( 'Arquivada', 'guilherme-portfolio' ),
		)[ $status ] ?? $status;
	}

}
