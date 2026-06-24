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
	private ProjectFormsView $project_forms;

	public function __construct( FormsView $forms, ViewParts $parts, ProjectFormsView $project_forms ) {
		$this->forms         = $forms;
		$this->parts         = $parts;
		$this->project_forms = $project_forms;
	}

	public function render( array $payload, int $project_id ): void {
		?>
		<aside class="gp-workbench-side">
			<?php $this->project_forms->project_settings( $payload, $project_id ); ?>
			<?php $this->forms->attach_item( $project_id, $payload['providers'] ); ?>
			<?php $this->forms->create_page( $project_id ); ?>
			<?php $this->forms->add_relation( $project_id, $payload['items'] ); ?>
			<?php $this->suggestions_inbox( $payload['suggestions'], $project_id ); ?>
			<?php $this->forms->add_suggestion( $project_id ); ?>
			<?php $this->project_forms->create_project(); ?>
		</aside>
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
