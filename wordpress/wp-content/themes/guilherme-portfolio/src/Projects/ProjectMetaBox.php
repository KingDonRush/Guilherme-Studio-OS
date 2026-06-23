<?php
/**
 * Portfolio project configuration metabox.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Projects;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class ProjectMetaBox {

	private const NONCE_ACTION = 'gp_save_project_config';
	private const NONCE_NAME = 'gp_project_config_nonce';

	private ProjectRepository $repository;

	public function __construct( ProjectRepository $repository ) {
		$this->repository = $repository;
	}

	public function init_hooks(): void {
		add_action( 'add_meta_boxes_' . ProjectRepository::POST_TYPE, array( $this, 'register' ) );
		add_action( 'save_post_' . ProjectRepository::POST_TYPE, array( $this, 'save' ) );
	}

	public function register(): void {
		add_meta_box(
			'gp-project-architecture',
			__( 'Project Architecture', 'guilherme-portfolio' ),
			array( $this, 'render' ),
			ProjectRepository::POST_TYPE,
			'normal',
			'high'
		);
	}

	public function render( \WP_Post $post ): void {
		$config       = $this->repository->config( $post->ID );
		$integrations = ProjectRepository::integrations();

		wp_nonce_field( self::NONCE_ACTION, self::NONCE_NAME );
		?>
		<div class="gp-project-admin">
			<div class="gp-project-grid">
				<section class="gp-project-panel">
					<h3><?php esc_html_e( 'Behavior', 'guilherme-portfolio' ); ?></h3>
					<label for="gp-project-mode" class="gp-project-label"><?php esc_html_e( 'Project mode', 'guilherme-portfolio' ); ?></label>
					<select id="gp-project-mode" name="gp_project_config[mode]" class="widefat">
						<?php foreach ( ProjectRepository::modes() as $mode => $label ) : ?>
							<option value="<?php echo esc_attr( $mode ); ?>" <?php selected( $config['mode'], $mode ); ?>><?php echo esc_html( $label ); ?></option>
						<?php endforeach; ?>
					</select>
					<p class="description"><?php esc_html_e( 'Defines how this project should be assembled and read by the theme/agents.', 'guilherme-portfolio' ); ?></p>
				</section>

				<section class="gp-project-panel">
					<h3><?php esc_html_e( 'Content Surfaces', 'guilherme-portfolio' ); ?></h3>
					<div class="gp-project-checks">
						<?php foreach ( ProjectRepository::surfaces() as $surface => $label ) : ?>
							<label>
								<input type="checkbox" name="gp_project_config[surfaces][]" value="<?php echo esc_attr( $surface ); ?>" <?php checked( in_array( $surface, $config['surfaces'], true ) ); ?> />
								<?php echo esc_html( $label ); ?>
							</label>
						<?php endforeach; ?>
					</div>
				</section>
			</div>

			<section class="gp-project-panel">
				<h3><?php esc_html_e( 'Plugin Bridge', 'guilherme-portfolio' ); ?></h3>
				<div class="gp-project-integrations">
					<?php foreach ( $integrations as $key => $integration ) : ?>
						<label class="gp-project-integration">
							<input type="checkbox" name="gp_project_config[integrations][]" value="<?php echo esc_attr( $key ); ?>" <?php checked( in_array( $key, $config['integrations'], true ) ); ?> />
							<span>
								<strong><?php echo esc_html( $integration['label'] ); ?></strong>
								<em class="gp-project-status <?php echo ! empty( $integration['active'] ) ? 'is-active' : 'is-missing'; ?>">
									<?php echo ! empty( $integration['active'] ) ? esc_html__( 'Active', 'guilherme-portfolio' ) : esc_html__( 'Missing', 'guilherme-portfolio' ); ?>
								</em>
								<small><?php echo esc_html( $integration['description'] ); ?></small>
							</span>
						</label>
					<?php endforeach; ?>
				</div>
			</section>

			<section class="gp-project-panel">
				<h3><?php esc_html_e( 'Operating Notes', 'guilherme-portfolio' ); ?></h3>
				<textarea name="gp_project_config[notes]" class="widefat" rows="5"><?php echo esc_textarea( $config['notes'] ); ?></textarea>
				<p class="description"><?php esc_html_e( 'Short notes for structure, templates, filters, evidence, or handoff. No secrets.', 'guilherme-portfolio' ); ?></p>
			</section>
		</div>
		<?php
	}

	public function save( int $post_id ): void {
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		if ( ! isset( $_POST[ self::NONCE_NAME ] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST[ self::NONCE_NAME ] ) ), self::NONCE_ACTION ) ) {
			return;
		}

		$raw = isset( $_POST['gp_project_config'] ) && is_array( $_POST['gp_project_config'] ) ? wp_unslash( $_POST['gp_project_config'] ) : array();

		$this->repository->save_config( $post_id, $raw );
	}
}
