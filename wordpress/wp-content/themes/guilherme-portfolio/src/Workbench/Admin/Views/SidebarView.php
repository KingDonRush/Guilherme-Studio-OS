<?php
/**
 * Portfolio Workbench sidebar.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench\Admin\Views;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class SidebarView {

	private FormsView $forms;
	private ViewParts $parts;

	public function __construct( FormsView $forms, ViewParts $parts ) {
		$this->forms = $forms;
		$this->parts = $parts;
	}

	public function render( array $payload, int $project_id ): void {
		?>
		<aside class="gp-workbench-side">
			<?php $this->project_inspector( $payload ); ?>
			<?php $this->forms->attach_item( $project_id, $payload['providers'] ); ?>
			<?php $this->forms->add_relation( $project_id, $payload['items'] ); ?>
			<?php $this->suggestions_inbox( $payload['suggestions'], $project_id ); ?>
			<?php $this->forms->add_suggestion( $project_id ); ?>
		</aside>
		<?php
	}

	private function project_inspector( array $payload ): void {
		$config = $payload['config'];
		?>
		<section class="gp-workbench-panel">
			<header>
				<h2><?php esc_html_e( 'Inspector', 'guilherme-portfolio' ); ?></h2>
				<a href="<?php echo esc_url( $payload['project']['edit'] ); ?>"><?php esc_html_e( 'Edit project', 'guilherme-portfolio' ); ?></a>
			</header>
			<div class="gp-workbench-panel-body">
				<p><strong><?php echo esc_html( $payload['project']['title'] ); ?></strong></p>
				<div class="gp-workbench-badges">
					<?php $this->parts->badge( $config['mode'], 'type', __( 'Project mode', 'guilherme-portfolio' ) ); ?>
					<?php foreach ( $config['surfaces'] as $surface ) : ?>
						<?php $this->parts->badge( $surface, 'type', __( 'Enabled surface', 'guilherme-portfolio' ) ); ?>
					<?php endforeach; ?>
					<?php foreach ( $config['integrations'] as $integration ) : ?>
						<?php $this->parts->badge( $integration, 'state', __( 'Enabled provider bridge', 'guilherme-portfolio' ) ); ?>
					<?php endforeach; ?>
				</div>
				<?php if ( '' !== $config['notes'] ) : ?>
					<p class="description"><?php echo esc_html( $config['notes'] ); ?></p>
				<?php endif; ?>
			</div>
		</section>
		<?php
	}

	private function suggestions_inbox( array $suggestions, int $project_id ): void {
		$pending = array_values(
			array_filter(
				$suggestions,
				static function ( array $suggestion ): bool {
					return 'pending' === $suggestion['state'];
				}
			)
		);
		?>
		<section class="gp-workbench-panel">
			<header>
				<h2><?php esc_html_e( 'Suggestion inbox', 'guilherme-portfolio' ); ?> <?php $this->parts->tip( __( 'Suggestions are not facts until marked.', 'guilherme-portfolio' ) ); ?></h2>
				<?php $this->parts->badge( (string) count( $pending ), 'count', __( 'Pending suggestions', 'guilherme-portfolio' ) ); ?>
			</header>
			<div class="gp-workbench-panel-body">
				<?php if ( empty( $pending ) ) : ?>
					<p class="description"><?php esc_html_e( 'No pending suggestions for this project.', 'guilherme-portfolio' ); ?></p>
				<?php endif; ?>
				<?php foreach ( $pending as $suggestion ) : ?>
					<div class="gp-workbench-suggestion">
						<strong><?php echo esc_html( $suggestion['label'] ); ?></strong>
						<span><?php echo esc_html( $suggestion['provider'] ); ?></span>
						<div>
							<?php $this->forms->row_action( 'gp_workbench_mark_suggestion', $project_id, 'suggestion_id', $suggestion['id'], __( 'Mark', 'guilherme-portfolio' ) ); ?>
							<?php $this->forms->row_action( 'gp_workbench_ignore_suggestion', $project_id, 'suggestion_id', $suggestion['id'], __( 'Ignore', 'guilherme-portfolio' ) ); ?>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		</section>
		<?php
	}
}
