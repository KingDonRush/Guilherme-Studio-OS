<?php
/**
 * Portfolio Workbench overview screen.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench\Admin\Views;

use GuilhermePortfolio\Workbench\Admin\AdminPage;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class OverviewView {

	private CategoryModulesView $categories;
	private RelationsStripView $relations;
	private SidebarView $sidebar;
	private ViewParts $parts;

	public function __construct(
		CategoryModulesView $categories,
		RelationsStripView $relations,
		SidebarView $sidebar,
		ViewParts $parts
	) {
		$this->categories = $categories;
		$this->relations  = $relations;
		$this->sidebar    = $sidebar;
		$this->parts      = $parts;
	}

	public function render( array $payload, array $project_options, int $project_id, string $notice ): void {
		?>
		<div class="wrap gp-workbench">
			<h1><?php esc_html_e( 'Portfolio Workbench', 'guilherme-portfolio' ); ?></h1>
			<hr class="wp-header-end">
			<?php $this->parts->notice( $notice ); ?>
			<?php $this->toolbar( $project_options, $project_id ); ?>
			<?php $this->breadcrumb( $payload ); ?>
			<?php $this->metrics( $payload ); ?>
			<div class="gp-workbench-layout">
				<main class="gp-workbench-main">
					<?php $this->categories->render( $payload, $project_id ); ?>
					<?php $this->relations->render( $payload['relations'], $project_id ); ?>
				</main>
				<?php $this->sidebar->render( $payload, $project_id ); ?>
			</div>
		</div>
		<?php
	}

	private function toolbar( array $project_options, int $project_id ): void {
		?>
		<form method="get" class="gp-workbench-toolbar">
			<input type="hidden" name="page" value="<?php echo esc_attr( AdminPage::MENU_SLUG ); ?>">
			<label for="gp-workbench-project"><?php esc_html_e( 'Project context', 'guilherme-portfolio' ); ?></label>
			<select id="gp-workbench-project" name="project">
				<?php foreach ( $project_options as $id => $title ) : ?>
					<option value="<?php echo esc_attr( $id ); ?>" <?php selected( $project_id, absint( $id ) ); ?>><?php echo esc_html( $title ); ?></option>
				<?php endforeach; ?>
			</select>
			<button type="submit" class="button"><?php esc_html_e( 'Open', 'guilherme-portfolio' ); ?></button>
		</form>
		<?php
	}

	private function breadcrumb( array $payload ): void {
		?>
		<div class="gp-workbench-root">
			<div>
				<span class="dashicons dashicons-admin-home" aria-hidden="true"></span>
				<strong><?php echo esc_html( $payload['root']['label'] ); ?></strong>
				<span class="gp-workbench-separator">/</span>
				<strong><?php echo esc_html( $payload['project']['title'] ); ?></strong>
			</div>
			<?php $this->parts->badge( $payload['project']['status'], 'state', __( 'WordPress project post status', 'guilherme-portfolio' ) ); ?>
		</div>
		<?php
	}

	private function metrics( array $payload ): void {
		$pending = array_filter(
			$payload['suggestions'],
			static function ( array $suggestion ): bool {
				return 'pending' === $suggestion['state'];
			}
		);
		?>
		<div class="gp-workbench-metrics">
			<?php $this->parts->metric( count( $payload['items'] ), __( 'attached items', 'guilherme-portfolio' ) ); ?>
			<?php $this->parts->metric( count( $payload['relations'] ), __( 'manual relations', 'guilherme-portfolio' ) ); ?>
			<?php $this->parts->metric( count( $pending ), __( 'pending suggestions', 'guilherme-portfolio' ) ); ?>
		</div>
		<?php
	}
}
