<?php
/**
 * Project columns and filters for content list screens.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Projects;

use GuilhermePortfolio\Workbench\Admin\AdminPage;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class AdminColumns {

	private ProjectRepository $repository;

	public function __construct( ProjectRepository $repository ) {
		$this->repository = $repository;
	}

	public function init_hooks(): void {
		add_action( 'admin_init', array( $this, 'register_column_hooks' ) );
		add_action( 'restrict_manage_posts', array( $this, 'render_project_filter' ) );
		add_action( 'pre_get_posts', array( $this, 'apply_project_filter' ) );
	}

	public function register_column_hooks(): void {
		foreach ( ProjectRepository::supported_content_post_types() as $post_type ) {
			add_filter( 'manage_' . $post_type . '_posts_columns', array( $this, 'add_columns' ) );
			add_action( 'manage_' . $post_type . '_posts_custom_column', array( $this, 'render_column' ), 10, 2 );
		}
	}

	public function add_columns( array $columns ): array {
		$insert = array(
			'gp_project' => __( 'Project', 'guilherme-portfolio' ),
			'gp_project_role' => __( 'Project Role', 'guilherme-portfolio' ),
		);

		if ( isset( $columns['date'] ) ) {
			$updated = array();
			foreach ( $columns as $key => $label ) {
				if ( 'date' === $key ) {
					$updated += $insert;
				}
				$updated[ $key ] = $label;
			}

			return $updated;
		}

		return $columns + $insert;
	}

	public function render_column( string $column, int $post_id ): void {
		if ( 'gp_project' === $column ) {
			$project_id = $this->repository->assigned_project_id( $post_id );

			if ( ! $project_id ) {
				echo '&mdash;';
				return;
			}

			$title = get_the_title( $project_id );
			$url   = add_query_arg(
				array(
					'page'    => AdminPage::MENU_SLUG,
					'project' => $project_id,
				),
				admin_url( 'themes.php' )
			);

			printf( '<a href="%1$s">%2$s</a>', esc_url( $url ), esc_html( $title ) );
			return;
		}

		if ( 'gp_project_role' === $column ) {
			$role  = $this->repository->assigned_role( $post_id );
			$roles = ProjectRepository::roles();

			echo esc_html( $roles[ $role ] ?? $role );
		}
	}

	public function render_project_filter( string $post_type ): void {
		if ( ! in_array( $post_type, ProjectRepository::supported_content_post_types(), true ) ) {
			return;
		}

		$projects = $this->repository->project_options();

		if ( empty( $projects ) ) {
			return;
		}

		$current = isset( $_GET['gp_project_filter'] ) ? absint( $_GET['gp_project_filter'] ) : 0;
		?>
		<label for="gp-project-filter" class="screen-reader-text"><?php esc_html_e( 'Filter by portfolio project', 'guilherme-portfolio' ); ?></label>
		<select id="gp-project-filter" name="gp_project_filter">
			<option value="0"><?php esc_html_e( 'All portfolio projects', 'guilherme-portfolio' ); ?></option>
			<?php foreach ( $projects as $id => $title ) : ?>
				<option value="<?php echo esc_attr( $id ); ?>" <?php selected( $current, absint( $id ) ); ?>><?php echo esc_html( $title ); ?></option>
			<?php endforeach; ?>
		</select>
		<?php
	}

	public function apply_project_filter( \WP_Query $query ): void {
		if ( ! is_admin() || ! $query->is_main_query() ) {
			return;
		}

		$post_type = $query->get( 'post_type' ) ?: 'post';

		if ( ! in_array( $post_type, ProjectRepository::supported_content_post_types(), true ) ) {
			return;
		}

		$project_id = isset( $_GET['gp_project_filter'] ) ? absint( $_GET['gp_project_filter'] ) : 0;

		if ( ! $project_id ) {
			return;
		}

		$query->set(
			'meta_query',
			array(
				array(
					'key'   => ProjectRepository::META_ASSIGNED_PROJECT,
					'value' => $project_id,
				),
			)
		);
	}
}
