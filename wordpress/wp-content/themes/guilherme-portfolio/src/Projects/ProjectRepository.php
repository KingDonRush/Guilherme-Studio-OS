<?php
/**
 * Portfolio project data contract.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Projects;

use GuilhermePortfolio\Support\PluginDetector;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class ProjectRepository {

	public const POST_TYPE = 'gp_project';
	public const META_MODE = '_gp_project_mode';
	public const META_SURFACES = '_gp_project_surfaces';
	public const META_INTEGRATIONS = '_gp_project_integrations';
	public const META_NOTES = '_gp_project_notes';
	public const META_ASSIGNED_PROJECT = '_gp_project_id';
	public const META_ASSIGNED_ROLE = '_gp_project_role';

	public static function modes(): array {
		return self::normalize_label_map(
			apply_filters(
				'gp_project_modes',
				array(
					'one_page'   => __( 'One page', 'guilherme-portfolio' ),
					'multi_page' => __( 'Multi-page site', 'guilherme-portfolio' ),
					'blog'       => __( 'Blog / editorial', 'guilherme-portfolio' ),
					'catalog'    => __( 'Catalog / CPT-driven', 'guilherme-portfolio' ),
					'hybrid'     => __( 'Hybrid implementation', 'guilherme-portfolio' ),
				)
			),
			'multi_page'
		);
	}

	public static function surfaces(): array {
		return self::normalize_label_map(
			apply_filters(
				'gp_project_surfaces',
				array(
					'pages'             => __( 'Pages', 'guilherme-portfolio' ),
					'posts'             => __( 'Posts / articles', 'guilherme-portfolio' ),
					'single_posts'      => __( 'Single templates', 'guilherme-portfolio' ),
					'custom_post_types' => __( 'Custom post types', 'guilherme-portfolio' ),
					'cct_filters'       => __( 'CCT/filter listings', 'guilherme-portfolio' ),
				)
			),
			'pages'
		);
	}

	public static function roles(): array {
		return self::normalize_label_map(
			apply_filters(
				'gp_project_roles',
				array(
					'home'       => __( 'Home', 'guilherme-portfolio' ),
					'landing'    => __( 'Landing', 'guilherme-portfolio' ),
					'about'      => __( 'About', 'guilherme-portfolio' ),
					'services'   => __( 'Services', 'guilherme-portfolio' ),
					'case'       => __( 'Case', 'guilherme-portfolio' ),
					'blog_index' => __( 'Blog index', 'guilherme-portfolio' ),
					'post'       => __( 'Post', 'guilherme-portfolio' ),
					'catalog'    => __( 'Catalog', 'guilherme-portfolio' ),
					'product'    => __( 'Product', 'guilherme-portfolio' ),
					'legal'      => __( 'Legal', 'guilherme-portfolio' ),
					'other'      => __( 'Other', 'guilherme-portfolio' ),
				)
			),
			'other'
		);
	}

	public static function integrations(): array {
		return PluginDetector::integrations();
	}

	public static function supported_content_post_types(): array {
		$post_types = get_post_types( array( 'public' => true ), 'names' );
		$blocked    = array( 'attachment', 'elementor_library', self::POST_TYPE );
		$post_types = array_diff( array_values( $post_types ), $blocked );

		if ( ! in_array( 'page', $post_types, true ) && post_type_exists( 'page' ) ) {
			$post_types[] = 'page';
		}

		return array_values( array_unique( $post_types ) );
	}

	public function project_options(): array {
		$projects = get_posts(
			array(
				'post_type'      => self::POST_TYPE,
				'post_status'    => array( 'publish', 'draft', 'private' ),
				'posts_per_page' => 200,
				'orderby'        => 'title',
				'order'          => 'ASC',
				'no_found_rows'  => true,
			)
		);

		$options = array();

		foreach ( $projects as $project ) {
			$options[ (string) $project->ID ] = get_the_title( $project ) ?: sprintf(
				/* translators: %d: project post ID. */
				__( 'Project #%d', 'guilherme-portfolio' ),
				$project->ID
			);
		}

		return $options;
	}

	public function config( int $project_id ): array {
		return $this->sanitize_config(
			array(
				'mode'         => get_post_meta( $project_id, self::META_MODE, true ),
				'surfaces'     => get_post_meta( $project_id, self::META_SURFACES, true ),
				'integrations' => get_post_meta( $project_id, self::META_INTEGRATIONS, true ),
				'notes'        => sanitize_textarea_field( get_post_meta( $project_id, self::META_NOTES, true ) ),
			)
		);
	}

	public function save_config( int $project_id, array $raw ): void {
		$config = $this->sanitize_config( $raw );

		update_post_meta( $project_id, self::META_MODE, $config['mode'] );
		update_post_meta( $project_id, self::META_SURFACES, $config['surfaces'] );
		update_post_meta( $project_id, self::META_INTEGRATIONS, $config['integrations'] );
		update_post_meta( $project_id, self::META_NOTES, $config['notes'] );
	}

	public function assigned_project_id( int $post_id ): int {
		return absint( get_post_meta( $post_id, self::META_ASSIGNED_PROJECT, true ) );
	}

	public function assigned_role( int $post_id ): string {
		return self::sanitize_role_value( get_post_meta( $post_id, self::META_ASSIGNED_ROLE, true ) );
	}

	public function save_assignment( int $post_id, array $raw ): void {
		$project_id = absint( $raw['project_id'] ?? 0 );
		$role       = self::sanitize_role_value( $raw['role'] ?? '' );

		if ( $project_id && self::POST_TYPE === get_post_type( $project_id ) ) {
			update_post_meta( $post_id, self::META_ASSIGNED_PROJECT, $project_id );
			update_post_meta( $post_id, self::META_ASSIGNED_ROLE, $role );
			return;
		}

		delete_post_meta( $post_id, self::META_ASSIGNED_PROJECT );
		delete_post_meta( $post_id, self::META_ASSIGNED_ROLE );
	}

	public function sanitize_config( array $raw ): array {
		return array(
			'mode'         => self::sanitize_mode_value( $raw['mode'] ?? '' ),
			'surfaces'     => self::sanitize_surfaces_value( $raw['surfaces'] ?? array() ),
			'integrations' => self::sanitize_integrations_value( $raw['integrations'] ?? array() ),
			'notes'        => sanitize_textarea_field( $raw['notes'] ?? '' ),
		);
	}

	public static function sanitize_mode_value( $value ): string {
		$value = sanitize_key( $value );

		return array_key_exists( $value, self::modes() ) ? $value : 'multi_page';
	}

	public static function sanitize_role_value( $value ): string {
		$value = sanitize_key( $value );

		return array_key_exists( $value, self::roles() ) ? $value : 'other';
	}

	public static function sanitize_surfaces_value( $raw ): array {
		return self::sanitize_keys( $raw, array_keys( self::surfaces() ) );
	}

	public static function sanitize_integrations_value( $raw ): array {
		return self::sanitize_keys( $raw, array_keys( self::integrations() ) );
	}

	private static function sanitize_keys( $raw, array $allowed ): array {
		$values = array_map( 'sanitize_key', (array) $raw );
		$values = array_values( array_unique( array_intersect( $values, $allowed ) ) );

		return array_slice( $values, 0, count( $allowed ) );
	}

	private static function normalize_label_map( $items, string $fallback_key ): array {
		$normalized = array();

		foreach ( (array) $items as $key => $label ) {
			$key = sanitize_key( $key );

			if ( '' !== $key ) {
				$normalized[ $key ] = sanitize_text_field( $label );
			}
		}

		if ( empty( $normalized ) ) {
			$normalized[ $fallback_key ] = $fallback_key;
		}

		return $normalized;
	}
}
