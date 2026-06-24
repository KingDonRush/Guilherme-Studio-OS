<?php
/**
 * Small Workbench forms.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench\Admin\Views;

use GuilhermePortfolio\Projects\ProjectRepository;
use GuilhermePortfolio\Workbench\Admin\AdminActions;
use GuilhermePortfolio\Workbench\CategoryRegistry;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class FormsView {

	public function attach_item( string $context_id, array $providers ): void {
		?>
		<details class="gp-workbench-disclosure" open>
			<summary><?php esc_html_e( 'Attach object', 'guilherme-portfolio' ); ?></summary>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="gp-workbench-form">
				<?php $this->hidden_action( 'gp_workbench_attach_item', $context_id ); ?>
				<label>
					<span><?php esc_html_e( 'Label', 'guilherme-portfolio' ); ?></span>
					<input type="text" name="gp_workbench_item[label]" class="regular-text" required>
				</label>
				<div class="gp-workbench-form-grid">
					<?php $this->select( 'gp_workbench_item[type]', __( 'Type', 'guilherme-portfolio' ), $this->item_types(), 'page' ); ?>
					<?php $this->select( 'gp_workbench_item[category]', __( 'Category', 'guilherme-portfolio' ), CategoryRegistry::labels(), 'pages' ); ?>
					<?php $this->select( 'gp_workbench_item[role]', __( 'Role', 'guilherme-portfolio' ), ProjectRepository::roles(), 'other' ); ?>
					<?php $this->select( 'gp_workbench_item[state]', __( 'State', 'guilherme-portfolio' ), $this->item_states(), 'manual' ); ?>
				</div>
				<div class="gp-workbench-form-grid">
					<label>
						<span><?php esc_html_e( 'Object ID', 'guilherme-portfolio' ); ?></span>
						<input type="text" name="gp_workbench_item[object_id]" placeholder="42">
					</label>
					<label>
						<span><?php esc_html_e( 'Object type', 'guilherme-portfolio' ); ?></span>
						<input type="text" name="gp_workbench_item[object_type]" placeholder="page">
					</label>
					<?php $this->select( 'gp_workbench_item[provider]', __( 'Provider', 'guilherme-portfolio' ), $this->provider_options( $providers ), 'manual' ); ?>
				</div>
				<label>
					<span><?php esc_html_e( 'Notes', 'guilherme-portfolio' ); ?></span>
					<textarea name="gp_workbench_item[notes]" rows="2"></textarea>
				</label>
				<button type="submit" class="button button-primary"><?php esc_html_e( 'Attach', 'guilherme-portfolio' ); ?></button>
			</form>
		</details>
		<?php
	}

	public function add_relation( string $context_id, array $items ): void {
		?>
		<details class="gp-workbench-disclosure">
			<summary><?php esc_html_e( 'Mark relation', 'guilherme-portfolio' ); ?></summary>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="gp-workbench-form">
				<?php $this->hidden_action( 'gp_workbench_add_relation', $context_id ); ?>
				<div class="gp-workbench-form-grid">
					<?php $this->select( 'gp_workbench_relation[source]', __( 'Source', 'guilherme-portfolio' ), $this->item_options( $items ), '' ); ?>
					<label>
						<span><?php esc_html_e( 'Relation', 'guilherme-portfolio' ); ?></span>
						<input type="text" name="gp_workbench_relation[relation]" value="links_to" required>
					</label>
					<?php $this->select( 'gp_workbench_relation[target]', __( 'Target', 'guilherme-portfolio' ), $this->item_options( $items ), '' ); ?>
					<?php $this->select( 'gp_workbench_relation[state]', __( 'State', 'guilherme-portfolio' ), $this->relation_states(), 'confirmed' ); ?>
				</div>
				<textarea name="gp_workbench_relation[notes]" rows="2" placeholder="<?php esc_attr_e( 'Short relation note', 'guilherme-portfolio' ); ?>"></textarea>
				<button type="submit" class="button button-primary" <?php disabled( count( $items ) < 2 ); ?>><?php esc_html_e( 'Save relation', 'guilherme-portfolio' ); ?></button>
			</form>
		</details>
		<?php
	}

	public function add_suggestion( string $context_id ): void {
		?>
		<details class="gp-workbench-disclosure">
			<summary><?php esc_html_e( 'Add suggestion', 'guilherme-portfolio' ); ?></summary>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="gp-workbench-form">
				<?php $this->hidden_action( 'gp_workbench_add_suggestion', $context_id ); ?>
				<label>
					<span><?php esc_html_e( 'Suggestion', 'guilherme-portfolio' ); ?></span>
					<input type="text" name="gp_workbench_suggestion[label]" class="regular-text" required>
				</label>
				<div class="gp-workbench-form-grid">
					<input type="hidden" name="gp_workbench_suggestion[type]" value="relation">
					<input type="hidden" name="gp_workbench_suggestion[state]" value="pending">
					<label>
						<span><?php esc_html_e( 'Provider', 'guilherme-portfolio' ); ?></span>
						<input type="text" name="gp_workbench_suggestion[provider]" value="manual">
					</label>
				</div>
				<button type="submit" class="button"><?php esc_html_e( 'Store suggestion', 'guilherme-portfolio' ); ?></button>
			</form>
		</details>
		<?php
	}

	public function row_action( string $action, string $context_id, string $field, string $value, string $label, string $class = 'button-link' ): void {
		?>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="gp-workbench-inline-form">
			<?php $this->hidden_action( $action, $context_id ); ?>
			<input type="hidden" name="<?php echo esc_attr( $field ); ?>" value="<?php echo esc_attr( $value ); ?>">
			<button type="submit" class="<?php echo esc_attr( $class ); ?>"><?php echo esc_html( $label ); ?></button>
		</form>
		<?php
	}

	public function relation_state_action( string $context_id, string $relation_id, string $state, string $label ): void {
		?>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="gp-workbench-inline-form">
			<?php $this->hidden_action( 'gp_workbench_update_relation', $context_id ); ?>
			<input type="hidden" name="relation_id" value="<?php echo esc_attr( $relation_id ); ?>">
			<input type="hidden" name="state" value="<?php echo esc_attr( $state ); ?>">
			<button type="submit" class="button-link"><?php echo esc_html( $label ); ?></button>
		</form>
		<?php
	}

	private function hidden_action( string $action, string $context_id ): void {
		wp_nonce_field( AdminActions::NONCE_ACTION, AdminActions::NONCE_NAME );
		?>
		<input type="hidden" name="action" value="<?php echo esc_attr( $action ); ?>">
		<input type="hidden" name="context_id" value="<?php echo esc_attr( $context_id ); ?>">
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

	private function provider_options( array $providers ): array {
		$options = array( 'manual' => __( 'Manual', 'guilherme-portfolio' ) );

		foreach ( $providers as $key => $provider ) {
			$options[ $key ] = $provider['label'] ?? $key;
		}

		return $options;
	}

	private function item_options( array $items ): array {
		$options = array( '' => __( 'Select item', 'guilherme-portfolio' ) );

		foreach ( $items as $item ) {
			$options[ $item['id'] ] = $item['label'];
		}

		return $options;
	}

	private function item_types(): array {
		return array(
			'page'      => __( 'Page', 'guilherme-portfolio' ),
			'post'      => __( 'Post', 'guilherme-portfolio' ),
			'cpt'       => __( 'CPT', 'guilherme-portfolio' ),
			'cct'       => __( 'CCT', 'guilherme-portfolio' ),
			'menu'      => __( 'Menu', 'guilherme-portfolio' ),
			'template'  => __( 'Template', 'guilherme-portfolio' ),
			'field'     => __( 'Field', 'guilherme-portfolio' ),
			'evidence'  => __( 'Evidence', 'guilherme-portfolio' ),
			'provider'  => __( 'Provider', 'guilherme-portfolio' ),
			'custom'    => __( 'Custom', 'guilherme-portfolio' ),
		);
	}

	private function item_states(): array {
		return array(
			'manual'       => __( 'Manual', 'guilherme-portfolio' ),
			'confirmed'    => __( 'Confirmed', 'guilherme-portfolio' ),
			'suggested'    => __( 'Suggested', 'guilherme-portfolio' ),
			'inherited'    => __( 'Inherited', 'guilherme-portfolio' ),
			'needs_review' => __( 'Needs review', 'guilherme-portfolio' ),
			'missing'      => __( 'Missing', 'guilherme-portfolio' ),
		);
	}

	private function relation_states(): array {
		return array(
			'confirmed'    => __( 'Confirmed', 'guilherme-portfolio' ),
			'needs_review' => __( 'Needs review', 'guilherme-portfolio' ),
			'suggested'    => __( 'Suggested', 'guilherme-portfolio' ),
			'ignored'      => __( 'Ignored', 'guilherme-portfolio' ),
		);
	}
}
