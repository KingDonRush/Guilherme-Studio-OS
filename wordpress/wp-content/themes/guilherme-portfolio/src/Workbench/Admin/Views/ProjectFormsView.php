<?php
/**
 * Project forms rendered inside Portfolio Workbench.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench\Admin\Views;

use GuilhermePortfolio\Projects\ProjectRepository;
use GuilhermePortfolio\Workbench\Admin\AdminActions;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class ProjectFormsView {

	public function create_project(): void {
		?>
		<details class="gp-workbench-disclosure" open>
			<summary><?php esc_html_e( 'Create project', 'guilherme-portfolio' ); ?></summary>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="gp-workbench-form">
				<?php $this->hidden_action( 'gp_workbench_create_project' ); ?>
				<label>
					<span><?php esc_html_e( 'Project title', 'guilherme-portfolio' ); ?></span>
					<input type="text" name="gp_workbench_project[title]" class="regular-text" required>
				</label>
				<div class="gp-workbench-form-grid">
					<?php $this->select( 'gp_workbench_project[status]', __( 'Status', 'guilherme-portfolio' ), $this->statuses(), 'draft' ); ?>
					<?php $this->select( 'gp_workbench_project[mode]', __( 'Mode', 'guilherme-portfolio' ), ProjectRepository::modes(), 'multi_page' ); ?>
				</div>
				<textarea name="gp_workbench_project[notes]" rows="2" placeholder="<?php esc_attr_e( 'Operating note', 'guilherme-portfolio' ); ?>"></textarea>
				<button type="submit" class="button button-primary"><?php esc_html_e( 'Create in Workbench', 'guilherme-portfolio' ); ?></button>
			</form>
		</details>
		<?php
	}

	public function project_settings( array $payload, int $project_id ): void {
		$config  = $payload['config'];
		$project = $payload['project'];
		?>
		<section class="gp-workbench-panel">
			<header>
				<h2><?php esc_html_e( 'Project settings', 'guilherme-portfolio' ); ?></h2>
			</header>
			<div class="gp-workbench-panel-body">
				<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="gp-workbench-form is-compact">
					<?php $this->hidden_action( 'gp_workbench_update_project', $project_id ); ?>
					<label>
						<span><?php esc_html_e( 'Title', 'guilherme-portfolio' ); ?></span>
						<input type="text" name="gp_workbench_project[title]" value="<?php echo esc_attr( $project['title'] ); ?>" required>
					</label>
					<div class="gp-workbench-form-grid">
						<?php $this->select( 'gp_workbench_project[status]', __( 'Status', 'guilherme-portfolio' ), $this->statuses(), $project['status'] ); ?>
						<?php $this->select( 'gp_workbench_project[mode]', __( 'Mode', 'guilherme-portfolio' ), ProjectRepository::modes(), $config['mode'] ); ?>
					</div>
					<?php $this->checks( 'gp_workbench_project[surfaces]', ProjectRepository::surfaces(), $config['surfaces'], __( 'Surfaces', 'guilherme-portfolio' ) ); ?>
					<?php $this->checks( 'gp_workbench_project[integrations]', ProjectRepository::integrations(), $config['integrations'], __( 'Providers', 'guilherme-portfolio' ) ); ?>
					<textarea name="gp_workbench_project[notes]" rows="3"><?php echo esc_textarea( $config['notes'] ); ?></textarea>
					<button type="submit" class="button"><?php esc_html_e( 'Save project', 'guilherme-portfolio' ); ?></button>
				</form>
			</div>
		</section>
		<?php
	}

	private function hidden_action( string $action, int $project_id = 0 ): void {
		wp_nonce_field( AdminActions::NONCE_ACTION, AdminActions::NONCE_NAME );
		?>
		<input type="hidden" name="action" value="<?php echo esc_attr( $action ); ?>">
		<?php if ( $project_id ) : ?>
			<input type="hidden" name="project_id" value="<?php echo esc_attr( $project_id ); ?>">
		<?php endif; ?>
		<?php
	}

	private function checks( string $name, array $options, array $selected, string $label ): void {
		?>
		<fieldset class="gp-workbench-checks">
			<legend><?php echo esc_html( $label ); ?></legend>
			<?php foreach ( $options as $value => $text ) : ?>
				<?php $text = is_array( $text ) ? ( $text['label'] ?? $value ) : $text; ?>
				<label>
					<input type="checkbox" name="<?php echo esc_attr( $name ); ?>[]" value="<?php echo esc_attr( $value ); ?>" <?php checked( in_array( (string) $value, $selected, true ) ); ?>>
					<?php echo esc_html( $text ); ?>
				</label>
			<?php endforeach; ?>
		</fieldset>
		<?php
	}

	private function select( string $name, string $label, array $options, string $selected ): void {
		?>
		<label>
			<span><?php echo esc_html( $label ); ?></span>
			<select name="<?php echo esc_attr( $name ); ?>">
				<?php foreach ( $options as $value => $text ) : ?>
					<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $selected, (string) $value ); ?>><?php echo esc_html( $text ); ?></option>
				<?php endforeach; ?>
			</select>
		</label>
		<?php
	}

	private function statuses(): array {
		return array(
			'draft'   => __( 'Draft', 'guilherme-portfolio' ),
			'private' => __( 'Private', 'guilherme-portfolio' ),
			'pending' => __( 'Pending', 'guilherme-portfolio' ),
			'publish' => __( 'Active', 'guilherme-portfolio' ),
		);
	}
}
