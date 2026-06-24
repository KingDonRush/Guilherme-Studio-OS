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
	private PageFormsView $page_forms;
	private ViewParts $parts;
	private ProjectFormsView $project_forms;

	public function __construct( FormsView $forms, PageFormsView $page_forms, ViewParts $parts, ProjectFormsView $project_forms ) {
		$this->forms         = $forms;
		$this->page_forms    = $page_forms;
		$this->parts         = $parts;
		$this->project_forms = $project_forms;
	}

	public function render( array $payload, string $context_id ): void {
		$is_root = 'root' === ( $payload['context']['type'] ?? '' );
		?>
		<aside class="gp-workbench-side">
			<?php $this->project_forms->context_settings( $payload ); ?>
			<?php if ( $is_root ) : ?>
				<?php $this->page_forms->frontpage_setup( $context_id ); ?>
				<?php $this->page_forms->code_pages( $context_id, $payload['code_pages'] ?? array() ); ?>
			<?php endif; ?>
			<?php $this->forms->attach_item( $context_id, $payload['providers'] ); ?>
			<?php $this->page_forms->create_page( $context_id, $is_root ); ?>
			<?php $this->forms->add_relation( $context_id, $payload['items'] ); ?>
			<?php $this->suggestions_inbox( $payload['suggestions'], $context_id ); ?>
			<?php $this->forms->add_suggestion( $context_id ); ?>
			<?php $this->project_forms->create_project(); ?>
		</aside>
		<?php
	}

	private function suggestions_inbox( array $suggestions, string $context_id ): void {
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
					<p class="description"><?php esc_html_e( 'No pending suggestions for this context.', 'guilherme-portfolio' ); ?></p>
				<?php endif; ?>
				<?php foreach ( $pending as $suggestion ) : ?>
					<div class="gp-workbench-suggestion">
						<strong><?php echo esc_html( $suggestion['label'] ); ?></strong>
						<span><?php echo esc_html( $suggestion['provider'] ); ?></span>
						<div>
							<?php $this->forms->row_action( 'gp_workbench_mark_suggestion', $context_id, 'suggestion_id', $suggestion['id'], __( 'Mark', 'guilherme-portfolio' ) ); ?>
							<?php $this->forms->row_action( 'gp_workbench_ignore_suggestion', $context_id, 'suggestion_id', $suggestion['id'], __( 'Ignore', 'guilherme-portfolio' ) ); ?>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		</section>
		<?php
	}
}
