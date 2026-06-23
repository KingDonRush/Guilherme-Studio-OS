<?php
/**
 * WP-CLI surface for the portfolio theme workbench.
 */

namespace GuilhermePortfolio\CLI;

use GuilhermePortfolio\Projects\ProjectRepository;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Command {

	private ProjectRepository $repository;

	public function __construct( ProjectRepository $repository ) {
		$this->repository = $repository;
	}

	public function init_hooks(): void {
		if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
			return;
		}

		\WP_CLI::add_command( 'gp', $this );
		\WP_CLI::add_command( 'gp project', array( $this, 'project' ) );
		\WP_CLI::add_command( 'gp assignment', array( $this, 'assignment' ) );
	}

	/**
	 * Manage theme-owned portfolio projects.
	 */
	public function project( array $args, array $assoc_args ): void {
		$action = $args[0] ?? 'list';

		if ( 'list' === $action ) {
			$this->format_items( $assoc_args, $this->project_rows(), array( 'id', 'title', 'status', 'mode', 'surfaces', 'integrations' ) );
			return;
		}

		if ( 'schema' === $action ) {
			$this->line_json(
				array(
					'modes'       => ProjectRepository::modes(),
					'surfaces'    => ProjectRepository::surfaces(),
					'integrations' => ProjectRepository::integrations(),
					'roles'       => ProjectRepository::roles(),
				),
				$assoc_args
			);
			return;
		}

		if ( 'get' === $action ) {
			$this->line_json( $this->project_payload( $this->project_id_arg( $args, 1 ) ), $assoc_args );
			return;
		}

		if ( 'create' === $action ) {
			$this->create_project( $args[1] ?? '', $assoc_args );
			return;
		}

		if ( 'update' === $action ) {
			$this->update_project( $this->project_id_arg( $args, 1 ), $assoc_args );
			return;
		}

		if ( 'trash' === $action ) {
			$this->trash_project( $this->project_id_arg( $args, 1 ) );
			return;
		}

		\WP_CLI::error( 'Use one of: list, schema, get, create, update, trash.' );
	}

	/**
	 * Manage project assignment for Pages, posts and public CPT entries.
	 */
	public function assignment( array $args, array $assoc_args ): void {
		$action = $args[0] ?? 'get';
		$post_id = absint( $args[1] ?? 0 );

		if ( ! $post_id ) {
			\WP_CLI::error( 'A content post ID is required.' );
		}

		if ( 'get' === $action ) {
			$this->line_json( $this->assignment_payload( $post_id ), $assoc_args );
			return;
		}

		if ( ! in_array( get_post_type( $post_id ), ProjectRepository::supported_content_post_types(), true ) ) {
			\WP_CLI::error( 'This post type cannot be assigned to a portfolio project.' );
		}

		if ( 'set' === $action ) {
			if ( ! isset( $assoc_args['project'] ) ) {
				\WP_CLI::error( 'Use --project=<id> to store an assignment.' );
			}

			$this->repository->save_assignment(
				$post_id,
				array(
					'project_id' => $assoc_args['project'] ?? 0,
					'role'       => $assoc_args['role'] ?? 'other',
				)
			);
			\WP_CLI::success( 'Portfolio project assignment stored.' );
			return;
		}

		if ( 'clear' === $action ) {
			$this->repository->save_assignment( $post_id, array( 'project_id' => 0 ) );
			\WP_CLI::success( 'Portfolio project assignment cleared.' );
			return;
		}

		\WP_CLI::error( 'Use one of: get, set, clear.' );
	}

	private function create_project( string $title, array $assoc_args ): void {
		$title = sanitize_text_field( $title );

		if ( '' === $title ) {
			\WP_CLI::error( 'Project title is required.' );
		}

		$post_id = wp_insert_post(
			array(
				'post_type'   => ProjectRepository::POST_TYPE,
				'post_title'  => $title,
				'post_status' => $this->sanitize_status( $assoc_args['status'] ?? 'draft' ),
			),
			true
		);

		if ( is_wp_error( $post_id ) ) {
			\WP_CLI::error( $post_id->get_error_message() );
		}

		$this->repository->save_config( $post_id, $this->config_from_args( $assoc_args, $this->repository->config( $post_id ) ) );
		\WP_CLI::success( 'Portfolio project created: ' . $post_id );
	}

	private function update_project( int $project_id, array $assoc_args ): void {
		$config = $this->repository->config( $project_id );
		$title  = isset( $assoc_args['title'] ) ? sanitize_text_field( $assoc_args['title'] ) : '';
		$status = isset( $assoc_args['status'] ) ? $this->sanitize_status( $assoc_args['status'] ) : '';

		if ( '' !== $title || '' !== $status ) {
			$result = wp_update_post(
				array_filter(
					array(
						'ID'          => $project_id,
						'post_title'  => $title,
						'post_status' => $status,
					)
				),
				true
			);

			if ( is_wp_error( $result ) ) {
				\WP_CLI::error( $result->get_error_message() );
			}
		}

		$this->repository->save_config( $project_id, $this->config_from_args( $assoc_args, $config ) );
		\WP_CLI::success( 'Portfolio project updated.' );
	}

	private function trash_project( int $project_id ): void {
		if ( ! wp_trash_post( $project_id ) ) {
			\WP_CLI::error( 'Could not move the portfolio project to trash.' );
		}

		\WP_CLI::success( 'Portfolio project moved to trash.' );
	}

	private function config_from_args( array $assoc_args, array $base ): array {
		if ( isset( $assoc_args['mode'] ) ) {
			$base['mode'] = $assoc_args['mode'];
		}

		if ( isset( $assoc_args['surfaces'] ) ) {
			$base['surfaces'] = $this->csv_arg( $assoc_args['surfaces'] );
		}

		if ( isset( $assoc_args['integrations'] ) ) {
			$base['integrations'] = $this->csv_arg( $assoc_args['integrations'] );
		}

		if ( isset( $assoc_args['notes'] ) ) {
			$base['notes'] = $assoc_args['notes'];
		}

		return $base;
	}

	private function project_rows(): array {
		return array_map(
			function ( \WP_Post $project ): array {
				$payload = $this->project_payload( $project->ID );

				return array(
					'id'           => $payload['id'],
					'title'        => $payload['title'],
					'status'       => $payload['status'],
					'mode'         => $payload['mode'],
					'surfaces'     => implode( ',', $payload['surfaces'] ),
					'integrations' => implode( ',', $payload['integrations'] ),
				);
			},
			$this->query_projects()
		);
	}

	private function project_payload( int $project_id ): array {
		$project = get_post( $project_id );

		if ( ! $project || ProjectRepository::POST_TYPE !== $project->post_type ) {
			\WP_CLI::error( 'Portfolio project not found.' );
		}

		$config = $this->repository->config( $project->ID );

		return array(
			'id'           => $project->ID,
			'title'        => get_the_title( $project ),
			'status'       => $project->post_status,
			'menu_order'   => (int) $project->menu_order,
			'config'       => $config,
		) + $config;
	}

	private function assignment_payload( int $post_id ): array {
		$post = get_post( $post_id );

		if ( ! $post ) {
			\WP_CLI::error( 'Content post not found.' );
		}

		return array(
			'post_id'    => $post->ID,
			'post_type'  => $post->post_type,
			'title'      => get_the_title( $post ),
			'project_id' => $this->repository->assigned_project_id( $post->ID ),
			'role'       => $this->repository->assigned_role( $post->ID ),
		);
	}

	private function query_projects(): array {
		return get_posts(
			array(
				'post_type'      => ProjectRepository::POST_TYPE,
				'post_status'    => array( 'publish', 'draft', 'private', 'pending' ),
				'posts_per_page' => 200,
				'orderby'        => 'title',
				'order'          => 'ASC',
				'no_found_rows'  => true,
			)
		);
	}

	private function project_id_arg( array $args, int $index ): int {
		$project_id = absint( $args[ $index ] ?? 0 );

		if ( ! $project_id ) {
			\WP_CLI::error( 'Portfolio project ID is required.' );
		}

		$this->project_payload( $project_id );
		return $project_id;
	}

	private function sanitize_status( $status ): string {
		$status = sanitize_key( $status );
		return in_array( $status, array( 'draft', 'publish', 'private', 'pending' ), true ) ? $status : 'draft';
	}

	private function csv_arg( $value ): array {
		return array_filter( array_map( 'trim', explode( ',', (string) $value ) ) );
	}

	private function format_items( array $assoc_args, array $items, array $fields ): void {
		\WP_CLI\Utils\format_items( $assoc_args['format'] ?? 'table', $items, $fields );
	}

	private function line_json( array $payload, array $assoc_args ): void {
		if ( 'table' === ( $assoc_args['format'] ?? '' ) ) {
			$this->format_items( $assoc_args, array( $payload ), array_keys( $payload ) );
			return;
		}

		\WP_CLI::line( wp_json_encode( $payload ) );
	}
}
