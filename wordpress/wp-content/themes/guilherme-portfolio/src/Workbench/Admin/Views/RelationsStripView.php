<?php
/**
 * Compact relations strip.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench\Admin\Views;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class RelationsStripView {

	private FormsView $forms;
	private ViewParts $parts;

	public function __construct( FormsView $forms, ViewParts $parts ) {
		$this->forms = $forms;
		$this->parts = $parts;
	}

	public function render( array $relations, string $context_id ): void {
		?>
		<section class="gp-workbench-panel">
			<header>
				<h2><?php esc_html_e( 'Recent relations', 'guilherme-portfolio' ); ?></h2>
				<?php $this->parts->badge( (string) count( $relations ), 'count', __( 'Total relations', 'guilherme-portfolio' ) ); ?>
			</header>
			<div class="gp-workbench-relation-strip">
				<?php if ( empty( $relations ) ) : ?>
					<p class="description"><?php esc_html_e( 'No manual relations yet.', 'guilherme-portfolio' ); ?></p>
				<?php endif; ?>
				<?php foreach ( array_slice( $relations, 0, 8 ) as $relation ) : ?>
					<div class="gp-workbench-relation-card">
						<code><?php echo esc_html( $relation['source'] ); ?></code>
						<span><?php echo esc_html( $relation['relation'] ); ?></span>
						<code><?php echo esc_html( $relation['target'] ); ?></code>
						<div>
							<?php $this->parts->badge( $relation['state'], 'state', __( 'Relation state', 'guilherme-portfolio' ) ); ?>
								<?php $this->forms->relation_state_action( $context_id, $relation['id'], 'confirmed', __( 'Confirm', 'guilherme-portfolio' ) ); ?>
								<?php $this->forms->row_action( 'gp_workbench_remove_relation', $context_id, 'relation_id', $relation['id'], __( 'Remove', 'guilherme-portfolio' ) ); ?>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		</section>
		<?php
	}
}
