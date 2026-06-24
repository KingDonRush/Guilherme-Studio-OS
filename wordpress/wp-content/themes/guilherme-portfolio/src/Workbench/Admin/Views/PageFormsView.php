<?php
/**
 * Page-oriented forms for Portfolio Workbench contexts.
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

final class PageFormsView {

	public function create_page( string $context_id, bool $show_frontpage_flags = false ): void {
		?>
		<details class="gp-workbench-disclosure">
			<summary><?php esc_html_e( 'Create page', 'guilherme-portfolio' ); ?></summary>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="gp-workbench-form">
				<?php $this->hidden_action( 'gp_workbench_create_page', $context_id ); ?>
				<label>
					<span><?php esc_html_e( 'Page title', 'guilherme-portfolio' ); ?></span>
					<input type="text" name="gp_workbench_page[title]" class="regular-text" required>
				</label>
				<div class="gp-workbench-form-grid">
					<?php $this->select( 'gp_workbench_page[status]', __( 'Status', 'guilherme-portfolio' ), $this->page_statuses(), 'draft' ); ?>
					<?php $this->select( 'gp_workbench_page[category]', __( 'Category', 'guilherme-portfolio' ), CategoryRegistry::labels(), 'pages' ); ?>
					<?php $this->select( 'gp_workbench_page[role]', __( 'Role', 'guilherme-portfolio' ), ProjectRepository::roles(), 'other' ); ?>
				</div>
				<textarea name="gp_workbench_page[notes]" rows="2" placeholder="<?php esc_attr_e( 'Optional note for the attached item', 'guilherme-portfolio' ); ?>"></textarea>
				<?php if ( $show_frontpage_flags ) : ?>
					<label>
						<input type="checkbox" name="gp_workbench_page[set_frontpage]" value="1">
						<?php esc_html_e( 'Set as portfolio front page', 'guilherme-portfolio' ); ?>
					</label>
					<label>
						<input type="checkbox" name="gp_workbench_page[set_posts_page]" value="1">
						<?php esc_html_e( 'Set as portfolio posts page', 'guilherme-portfolio' ); ?>
					</label>
				<?php endif; ?>
				<button type="submit" class="button"><?php esc_html_e( 'Create and attach', 'guilherme-portfolio' ); ?></button>
			</form>
		</details>
		<?php
	}

	public function frontpage_setup( string $context_id ): void {
		$pages = $this->page_options();
		?>
		<section class="gp-workbench-panel">
			<header>
				<h2><?php esc_html_e( 'Front page', 'guilherme-portfolio' ); ?></h2>
			</header>
			<div class="gp-workbench-panel-body">
				<?php if ( empty( $pages ) ) : ?>
					<p class="description"><?php esc_html_e( 'No pages available yet. Create a page below first.', 'guilherme-portfolio' ); ?></p>
				<?php else : ?>
					<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="gp-workbench-form is-compact">
						<?php $this->hidden_action( 'gp_workbench_set_frontpage', $context_id ); ?>
						<?php $this->select( 'page_id', __( 'Existing page', 'guilherme-portfolio' ), $pages, (string) get_option( 'page_on_front' ) ); ?>
						<button type="submit" class="button button-primary"><?php esc_html_e( 'Set as portfolio front page', 'guilherme-portfolio' ); ?></button>
					</form>
					<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="gp-workbench-form is-compact">
						<?php $this->hidden_action( 'gp_workbench_set_posts_page', $context_id ); ?>
						<?php $this->select( 'page_id', __( 'Existing page', 'guilherme-portfolio' ), $pages, (string) get_option( 'page_for_posts' ) ); ?>
						<button type="submit" class="button"><?php esc_html_e( 'Set as portfolio posts page', 'guilherme-portfolio' ); ?></button>
					</form>
				<?php endif; ?>
			</div>
		</section>
		<?php
	}

	public function code_pages( string $context_id, array $code_pages ): void {
		if ( empty( $code_pages ) ) {
			return;
		}
		?>
		<details class="gp-workbench-disclosure">
			<summary><?php esc_html_e( 'Coded pages', 'guilherme-portfolio' ); ?></summary>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="gp-workbench-form">
				<?php $this->hidden_action( 'gp_workbench_materialize_page', $context_id ); ?>
				<?php $this->select( 'definition_id', __( 'Definition', 'guilherme-portfolio' ), $this->code_page_options( $code_pages ), '' ); ?>
				<p class="description"><?php esc_html_e( 'Creates the page only if its slug does not exist, then attaches it to this context.', 'guilherme-portfolio' ); ?></p>
				<button type="submit" class="button"><?php esc_html_e( 'Materialize page', 'guilherme-portfolio' ); ?></button>
			</form>
		</details>
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

	private function page_options(): array {
		$posts = get_posts(
			array(
				'post_type'      => 'page',
				'post_status'    => array( 'publish', 'draft', 'private', 'pending' ),
				'posts_per_page' => 100,
				'orderby'        => 'title',
				'order'          => 'ASC',
				'no_found_rows'  => true,
			)
		);
		$options = array();

		foreach ( $posts as $post ) {
			$options[ (string) $post->ID ] = get_the_title( $post ) ?: sprintf( 'Page #%d', $post->ID );
		}

		return $options;
	}

	private function code_page_options( array $code_pages ): array {
		$options = array( '' => __( 'Select coded page', 'guilherme-portfolio' ) );

		foreach ( $code_pages as $id => $page ) {
			$options[ $id ] = $page['title'] ?? $id;
		}

		return $options;
	}

	private function page_statuses(): array {
		return array(
			'draft'   => __( 'Draft', 'guilherme-portfolio' ),
			'private' => __( 'Private', 'guilherme-portfolio' ),
			'pending' => __( 'Pending', 'guilherme-portfolio' ),
			'publish' => __( 'Publish', 'guilherme-portfolio' ),
		);
	}
}
