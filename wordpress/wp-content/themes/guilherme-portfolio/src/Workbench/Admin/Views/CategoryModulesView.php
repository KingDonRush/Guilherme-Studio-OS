<?php
/**
 * Category modules for the Portfolio Workbench overview.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench\Admin\Views;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class CategoryModulesView {

	private FormsView $forms;
	private ViewParts $parts;

	public function __construct( FormsView $forms, ViewParts $parts ) {
		$this->forms = $forms;
		$this->parts = $parts;
	}

	public function render( array $payload, int $project_id ): void {
		?>
		<div class="gp-workbench-categories">
			<?php foreach ( $payload['categories'] as $key => $category ) : ?>
				<?php $items = $payload['groups'][ $key ] ?? array(); ?>
				<section class="gp-workbench-module">
					<header>
						<h2>
							<span class="dashicons dashicons-<?php echo esc_attr( $category['icon'] ); ?>" aria-hidden="true"></span>
							<?php echo esc_html( $category['label'] ); ?>
							<?php $this->parts->tip( $category['tip'] ); ?>
						</h2>
						<?php $this->parts->badge( (string) count( $items ), 'count', __( 'Items attached to this category', 'guilherme-portfolio' ) ); ?>
					</header>
					<div class="gp-workbench-module-body">
						<?php $this->contents( $key, $items, $payload, $project_id ); ?>
					</div>
				</section>
			<?php endforeach; ?>
		</div>
		<?php
	}

	private function contents( string $key, array $items, array $payload, int $project_id ): void {
		if ( 'providers' === $key ) {
			$this->providers( $payload['providers'] );
			return;
		}

		if ( 'data' === $key ) {
			$this->provider_records( $payload['provider_records'] );
		}

		if ( 'suggestions' === $key ) {
			$this->suggestions( $payload['suggestions'] );
			return;
		}

		if ( 'relations' === $key ) {
			$this->relations( $payload['relations'] );
			return;
		}

		if ( empty( $items ) ) {
			$this->parts->empty_hint();
			return;
		}

		foreach ( $items as $item ) {
			$this->item( $item, $project_id );
		}
	}

	private function item( array $item, int $project_id ): void {
		?>
		<div class="gp-workbench-chip">
			<div>
				<strong><?php echo esc_html( $item['label'] ); ?></strong>
				<span><?php echo esc_html( $item['object_type'] . ( '' !== $item['object_id'] ? ' #' . $item['object_id'] : '' ) ); ?></span>
			</div>
			<div class="gp-workbench-chip-actions">
				<?php $this->parts->badge( $item['type'], 'type', __( 'Attached object type', 'guilherme-portfolio' ) ); ?>
				<?php $this->parts->badge( $item['state'], 'state', __( 'Manual workbench state', 'guilherme-portfolio' ) ); ?>
				<?php $this->forms->row_action( 'gp_workbench_detach_item', $project_id, 'item_id', $item['id'], __( 'Detach', 'guilherme-portfolio' ) ); ?>
			</div>
		</div>
		<?php
	}

	private function providers( array $providers ): void {
		foreach ( $providers as $provider ) {
			$status = sanitize_key( $provider['status'] ?? ( ! empty( $provider['active'] ) ? 'active' : 'missing' ) );
			?>
			<div class="gp-workbench-provider">
				<div>
					<strong><?php echo esc_html( $provider['label'] ); ?></strong>
					<span><?php echo esc_html( $provider['description'] ); ?></span>
				</div>
				<?php $this->parts->badge( $status, 'state', __( 'Provider availability', 'guilherme-portfolio' ) ); ?>
			</div>
			<?php
		}
	}

	private function provider_records( array $records ): void {
		if ( empty( $records ) ) {
			$this->parts->empty_hint();
			return;
		}

		foreach ( array_slice( $records, 0, 8 ) as $record ) {
			?>
			<div class="gp-workbench-provider-record">
				<strong><?php echo esc_html( $record['label'] ); ?></strong>
				<span><?php echo esc_html( $record['summary'] ); ?></span>
				<?php $this->parts->badge( $record['provider'], 'type', __( 'Provider source', 'guilherme-portfolio' ) ); ?>
			</div>
			<?php
		}
	}

	private function relations( array $relations ): void {
		if ( empty( $relations ) ) {
			$this->parts->empty_hint();
			return;
		}

		foreach ( array_slice( $relations, 0, 5 ) as $relation ) {
			?>
			<div class="gp-workbench-relation-chip">
				<code><?php echo esc_html( $relation['source'] ); ?></code>
				<span><?php echo esc_html( $relation['relation'] ); ?></span>
				<code><?php echo esc_html( $relation['target'] ); ?></code>
				<?php $this->parts->badge( $relation['state'], 'state', __( 'Relation state', 'guilherme-portfolio' ) ); ?>
			</div>
			<?php
		}
	}

	private function suggestions( array $suggestions ): void {
		if ( empty( $suggestions ) ) {
			$this->parts->empty_hint();
			return;
		}

		foreach ( array_slice( $suggestions, 0, 6 ) as $suggestion ) {
			?>
			<div class="gp-workbench-mini">
				<strong><?php echo esc_html( $suggestion['label'] ); ?></strong>
				<?php $this->parts->badge( $suggestion['state'], 'state', __( 'Suggestion state', 'guilherme-portfolio' ) ); ?>
			</div>
			<?php
		}
	}
}
