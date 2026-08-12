<?php
/**
 * Modal surfaces for Portfolio Area Map.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Areas\Admin\Views;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class AreaMapModalView {

	private AreaFormsView $forms;

	public function __construct( AreaFormsView $forms ) {
		$this->forms = $forms;
	}

	public function render( ?array $area ): void {
		$this->start( 'create-area', __( 'Adicionar área', 'guilherme-portfolio' ) );
		$this->forms->create_area();
		$this->end();

		if ( ! $area ) {
			return;
		}

		$this->start( 'attach-item', __( 'Associar item existente', 'guilherme-portfolio' ) );
		$this->forms->attach_item( $area );
		$this->end();

		$this->start( 'edit-area', __( 'Editar área', 'guilherme-portfolio' ) );
		?>
		<div class="gp-area-map-manage-grid">
			<section class="gp-area-map-manage-panel">
				<h3><?php esc_html_e( 'Identidade e estado', 'guilherme-portfolio' ); ?></h3>
				<?php $this->forms->update_area( $area ); ?>
			</section>
			<section class="gp-area-map-manage-panel is-state">
				<h3><?php esc_html_e( 'Disponibilidade', 'guilherme-portfolio' ); ?></h3>
				<p class="description">
					<?php esc_html_e( 'Arquivar tira a área da lista ativa sem apagar suas conexões.', 'guilherme-portfolio' ); ?>
				</p>
				<?php
				if ( 'archived' === $area['status'] ) {
					$this->forms->restore_area( $area );
				} else {
					$this->forms->delete_area( $area );
				}
				?>
			</section>
		</div>
		<?php
		$this->end();
	}

	private function start( string $id, string $title ): void {
		?>
		<div class="gp-area-map-modal" data-gp-modal="<?php echo esc_attr( $id ); ?>" hidden aria-hidden="true">
			<div class="gp-area-map-modal-backdrop" data-gp-modal-close></div>
			<section class="gp-area-map-modal-panel" role="dialog" aria-modal="true" aria-labelledby="gp-area-map-modal-title-<?php echo esc_attr( $id ); ?>">
				<header>
					<h2 id="gp-area-map-modal-title-<?php echo esc_attr( $id ); ?>"><?php echo esc_html( $title ); ?></h2>
					<button type="button" class="button-link gp-area-map-modal-close" data-gp-modal-close>
						<span class="dashicons dashicons-no-alt" aria-hidden="true"></span>
						<span class="screen-reader-text"><?php esc_html_e( 'Fechar', 'guilherme-portfolio' ); ?></span>
					</button>
				</header>
				<div class="gp-area-map-modal-body">
		<?php
	}

	private function end(): void {
		?>
				</div>
			</section>
		</div>
		<?php
	}
}
