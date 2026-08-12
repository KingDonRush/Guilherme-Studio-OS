<?php
/**
 * Sidebar for Portfolio Area Map.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Areas\Admin\Views;

use GuilhermePortfolio\Areas\Admin\AreaMapPage;
use GuilhermePortfolio\Areas\AreaUrl;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class AreaMapSidebarView {

	public function render( array $areas, ?array $selected, string $area_view = 'active', int $archived_count = 0 ): void {
		$is_archive_view = 'archived' === $area_view;
		?>
		<section class="gp-area-map-side-card">
			<header>
				<h3>
					<?php echo esc_html( $is_archive_view ? __( 'Áreas arquivadas', 'guilherme-portfolio' ) : __( 'Áreas', 'guilherme-portfolio' ) ); ?>
				</h3>
				<button type="button" class="button" data-gp-modal-open="create-area">
					<span class="dashicons dashicons-plus-alt2" aria-hidden="true"></span>
					<?php esc_html_e( 'Adicionar área', 'guilherme-portfolio' ); ?>
				</button>
			</header>
			<label class="screen-reader-text" for="gp-area-map-area-search"><?php esc_html_e( 'Buscar áreas', 'guilherme-portfolio' ); ?></label>
			<input id="gp-area-map-area-search" class="gp-area-map-area-search" type="search" placeholder="<?php esc_attr_e( 'Buscar área...', 'guilherme-portfolio' ); ?>" data-gp-area-search>
			<p class="gp-area-map-area-meta">
				<?php
				echo esc_html(
					$is_archive_view
						? sprintf( _n( '%d área arquivada', '%d áreas arquivadas', count( $areas ), 'guilherme-portfolio' ), count( $areas ) )
						: sprintf( _n( '%d área ativa', '%d áreas ativas', count( $areas ), 'guilherme-portfolio' ), count( $areas ) )
				);
				?>
			</p>
			<nav class="gp-area-map-area-list" aria-label="<?php esc_attr_e( 'Portfolio areas', 'guilherme-portfolio' ); ?>">
				<?php foreach ( $areas as $area ) : ?>
					<a class="<?php echo esc_attr( $selected && $selected['id'] === $area['id'] ? 'is-selected' : '' ); ?>" href="<?php echo esc_url( $this->area_url( $area['id'], $area_view ) ); ?>" data-gp-area-row data-gp-area-name="<?php echo esc_attr( strtolower( $area['title'] . ' ' . $area['slug'] ) ); ?>">
						<span class="gp-area-map-small-avatar" aria-hidden="true"><?php echo esc_html( AreaMapIcons::initials( $area['title'] ) ); ?></span>
						<strong><?php echo esc_html( $area['title'] ); ?></strong>
						<?php if ( $is_archive_view ) : ?>
							<span class="gp-area-map-side-status"><?php esc_html_e( 'Arquivada', 'guilherme-portfolio' ); ?></span>
						<?php endif; ?>
					</a>
				<?php endforeach; ?>
			</nav>
			<footer class="gp-area-map-side-footer">
				<?php if ( $is_archive_view ) : ?>
					<a href="<?php echo esc_url( $this->area_index_url() ); ?>">
						<span class="dashicons dashicons-undo" aria-hidden="true"></span>
						<?php esc_html_e( 'Ver áreas ativas', 'guilherme-portfolio' ); ?>
					</a>
				<?php elseif ( 0 < $archived_count ) : ?>
					<a href="<?php echo esc_url( $this->area_archive_url() ); ?>">
						<span class="dashicons dashicons-archive" aria-hidden="true"></span>
						<?php echo esc_html( sprintf( _n( '%d arquivada', '%d arquivadas', $archived_count, 'guilherme-portfolio' ), $archived_count ) ); ?>
					</a>
				<?php else : ?>
					<span>
						<span class="dashicons dashicons-archive" aria-hidden="true"></span>
						<?php esc_html_e( 'Nenhuma arquivada', 'guilherme-portfolio' ); ?>
					</span>
				<?php endif; ?>
			</footer>
		</section>
		<?php
	}

	private function area_url( int $area_id, string $area_view ): string {
		$args = array(
			'page' => AreaMapPage::MENU_SLUG,
			'area' => $area_id,
		);

		if ( 'archived' === $area_view ) {
			$args['area_status'] = 'archived';
		}

		return add_query_arg(
			$args,
			AreaUrl::admin( 'admin.php' )
		);
	}

	private function area_index_url(): string {
		return add_query_arg(
			array( 'page' => AreaMapPage::MENU_SLUG ),
			AreaUrl::admin( 'admin.php' )
		);
	}

	private function area_archive_url(): string {
		return add_query_arg(
			array(
				'page'        => AreaMapPage::MENU_SLUG,
				'area_status' => 'archived',
			),
			AreaUrl::admin( 'admin.php' )
		);
	}
}
