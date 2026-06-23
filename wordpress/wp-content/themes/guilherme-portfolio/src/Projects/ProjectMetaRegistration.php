<?php
/**
 * Register project meta with WordPress APIs.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Projects;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class ProjectMetaRegistration {

	public function init_hooks(): void {
		add_action( 'init', array( $this, 'register' ), 30 );
	}

	public function register(): void {
		$this->register_project_meta();
		$this->register_assignment_meta();
	}

	private function register_project_meta(): void {
		register_post_meta(
			ProjectRepository::POST_TYPE,
			ProjectRepository::META_MODE,
			$this->string_meta_args( array( ProjectRepository::class, 'sanitize_mode_value' ) )
		);

		register_post_meta(
			ProjectRepository::POST_TYPE,
			ProjectRepository::META_SURFACES,
			$this->array_meta_args( array( ProjectRepository::class, 'sanitize_surfaces_value' ) )
		);

		register_post_meta(
			ProjectRepository::POST_TYPE,
			ProjectRepository::META_INTEGRATIONS,
			$this->array_meta_args( array( ProjectRepository::class, 'sanitize_integrations_value' ) )
		);

		register_post_meta(
			ProjectRepository::POST_TYPE,
			ProjectRepository::META_NOTES,
			$this->string_meta_args( 'sanitize_textarea_field' )
		);
	}

	private function register_assignment_meta(): void {
		foreach ( ProjectRepository::supported_content_post_types() as $post_type ) {
			register_post_meta(
				$post_type,
				ProjectRepository::META_ASSIGNED_PROJECT,
				array(
					'type'              => 'integer',
					'single'            => true,
					'show_in_rest'      => true,
					'sanitize_callback' => 'absint',
					'auth_callback'     => array( $this, 'can_edit_posts' ),
				)
			);

			register_post_meta(
				$post_type,
				ProjectRepository::META_ASSIGNED_ROLE,
				$this->string_meta_args( array( ProjectRepository::class, 'sanitize_role_value' ) )
			);
		}
	}

	public function can_edit_posts(): bool {
		return current_user_can( 'edit_posts' );
	}

	private function string_meta_args( $sanitize_callback ): array {
		return array(
			'type'              => 'string',
			'single'            => true,
			'show_in_rest'      => true,
			'sanitize_callback' => $sanitize_callback,
			'auth_callback'     => array( $this, 'can_edit_posts' ),
		);
	}

	private function array_meta_args( $sanitize_callback ): array {
		return array(
			'type'              => 'array',
			'single'            => true,
			'show_in_rest'      => array(
				'schema' => array(
					'type'  => 'array',
					'items' => array(
						'type' => 'string',
					),
				),
			),
			'sanitize_callback' => $sanitize_callback,
			'auth_callback'     => array( $this, 'can_edit_posts' ),
		);
	}
}
