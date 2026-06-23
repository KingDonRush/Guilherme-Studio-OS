<?php
/**
 * Assign content entries to portfolio projects.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Projects;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class ContentAssignmentMetaBox {

	private const NONCE_ACTION = 'gp_save_project_assignment';
	private const NONCE_NAME = 'gp_project_assignment_nonce';

	private ProjectRepository $repository;

	public function __construct( ProjectRepository $repository ) {
		$this->repository = $repository;
	}

	public function init_hooks(): void {
		add_action( 'add_meta_boxes', array( $this, 'register' ) );
		add_action( 'save_post', array( $this, 'save' ) );
	}

	public function register(): void {
		foreach ( ProjectRepository::supported_content_post_types() as $post_type ) {
			add_meta_box(
				'gp-project-assignment',
				__( 'Portfolio Project', 'guilherme-portfolio' ),
				array( $this, 'render' ),
				$post_type,
				'side',
				'default'
			);
		}
	}

	public function render( \WP_Post $post ): void {
		$projects   = $this->repository->project_options();
		$project_id = $this->repository->assigned_project_id( $post->ID );
		$role       = $this->repository->assigned_role( $post->ID );

		wp_nonce_field( self::NONCE_ACTION, self::NONCE_NAME );
		?>
		<div class="gp-project-assignment">
			<p>
				<label for="gp-assigned-project"><strong><?php esc_html_e( 'Project', 'guilherme-portfolio' ); ?></strong></label>
				<select id="gp-assigned-project" name="gp_project_assignment[project_id]" class="widefat">
					<option value="0"><?php esc_html_e( 'No project', 'guilherme-portfolio' ); ?></option>
					<?php foreach ( $projects as $id => $title ) : ?>
						<option value="<?php echo esc_attr( $id ); ?>" <?php selected( $project_id, absint( $id ) ); ?>><?php echo esc_html( $title ); ?></option>
					<?php endforeach; ?>
				</select>
			</p>
			<p>
				<label for="gp-assigned-role"><strong><?php esc_html_e( 'Role', 'guilherme-portfolio' ); ?></strong></label>
				<select id="gp-assigned-role" name="gp_project_assignment[role]" class="widefat">
					<?php foreach ( ProjectRepository::roles() as $value => $label ) : ?>
						<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $role, $value ); ?>><?php echo esc_html( $label ); ?></option>
					<?php endforeach; ?>
				</select>
			</p>
			<p class="description"><?php esc_html_e( 'Used to group Pages, posts and CPT items by portfolio project.', 'guilherme-portfolio' ); ?></p>
		</div>
		<?php
	}

	public function save( int $post_id ): void {
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		$post_type = get_post_type( $post_id );

		if ( ! in_array( $post_type, ProjectRepository::supported_content_post_types(), true ) ) {
			return;
		}

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		if ( ! isset( $_POST[ self::NONCE_NAME ] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST[ self::NONCE_NAME ] ) ), self::NONCE_ACTION ) ) {
			return;
		}

		$raw = isset( $_POST['gp_project_assignment'] ) && is_array( $_POST['gp_project_assignment'] ) ? wp_unslash( $_POST['gp_project_assignment'] ) : array();

		$this->repository->save_assignment( $post_id, $raw );
	}
}
