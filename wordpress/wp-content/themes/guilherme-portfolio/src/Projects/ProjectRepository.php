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
		return array(
			'one_page' => __( 'One page', 'guilherme-portfolio' ),
			'multi_page' => __( 'Multi-page site', 'guilherme-portfolio' ),
			'blog' => __( 'Blog / editorial', 'guilherme-portfolio' ),
			'catalog' => __( 'Catalog / CPT-driven', 'guilherme-portfolio' ),
			'hybrid' => __( 'Hybrid implementation', 'guilherme-portfolio' ),
		);
	}

	public static function surfaces(): array {
		return array(
			'pages' => __( 'Pages', 'guilherme-portfolio' ),
			'posts' => __( 'Posts / articles', 'guilherme-portfolio' ),
			'single_posts' => __( 'Single templates', 'guilherme-portfolio' ),
			'custom_post_types' => __( 'Custom post types', 'guilherme-portfolio' ),
			'cct_filters' => __( 'CCT/filter listings', 'guilherme-portfolio' ),
		);
	}

	public static function roles(): array {
		return array(
			'home' => __( 'Home', 'guilherme-portfolio' ),
			'landing' => __( 'Landing', 'guilherme-portfolio' ),
			'about' => __( 'About', 'guilherme-portfolio' ),
			'services' => __( 'Services', 'guilherme-portfolio' ),
			'case' => __( 'Case', 'guilherme-portfolio' ),
			'blog_index' => __( 'Blog index', 'guilherme-portfolio' ),
			'post' => __( 'Post', 'guilherme-portfolio' ),
			'catalog' => __( 'Catalog', 'guilherme-portfolio' ),
			'product' => __( 'Product', 'guilherme-portfolio' ),
			'legal' => __( 'Legal', 'guilherme-portfolio' ),
			'other' => __( 'Other', 'guilherme-portfolio' ),
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
		return array(
			'mode'         => $this->sanitize_mode( get_post_meta( $project_id, self::META_MODE, true ) ),
			'surfaces'     => $this->sanitize_keys( get_post_meta( $project_id, self::META_SURFACES, true ), array_keys( self::surfaces() ) ),
			'integrations' => $this->sanitize_keys( get_post_meta( $project_id, self::META_INTEGRATIONS, true ), array_keys( self::integrations() ) ),
			'notes'        => sanitize_textarea_field( get_post_meta( $project_id, self::META_NOTES, true ) ),
		);
	}

	public function save_config( int $project_id, array $raw ): void {
		update_post_meta( $project_id, self::META_MODE, $this->sanitize_mode( $raw['mode'] ?? '' ) );
		update_post_meta( $project_id, self::META_SURFACES, $this->sanitize_keys( $raw['surfaces'] ?? array(), array_keys( self::surfaces() ) ) );
		update_post_meta( $project_id, self::META_INTEGRATIONS, $this->sanitize_keys( $raw['integrations'] ?? array(), array_keys( self::integrations() ) ) );
		update_post_meta( $project_id, self::META_NOTES, sanitize_textarea_field( $raw['notes'] ?? '' ) );
	}

	public function assigned_project_id( int $post_id ): int {
		return absint( get_post_meta( $post_id, self::META_ASSIGNED_PROJECT, true ) );
	}

	public function assigned_role( int $post_id ): string {
		return $this->sanitize_role( get_post_meta( $post_id, self::META_ASSIGNED_ROLE, true ) );
	}

	public function save_assignment( int $post_id, array $raw ): void {
		$project_id = absint( $raw['project_id'] ?? 0 );
		$role       = $this->sanitize_role( $raw['role'] ?? '' );

		if ( $project_id && self::POST_TYPE === get_post_type( $project_id ) ) {
			update_post_meta( $post_id, self::META_ASSIGNED_PROJECT, $project_id );
			update_post_meta( $post_id, self::META_ASSIGNED_ROLE, $role );
			return;
		}

		delete_post_meta( $post_id, self::META_ASSIGNED_PROJECT );
		delete_post_meta( $post_id, self::META_ASSIGNED_ROLE );
	}

	private function sanitize_mode( $value ): string {
		$value = sanitize_key( $value );

		return array_key_exists( $value, self::modes() ) ? $value : 'multi_page';
	}

	private function sanitize_role( $value ): string {
		$value = sanitize_key( $value );

		return array_key_exists( $value, self::roles() ) ? $value : 'other';
	}

	private function sanitize_keys( $raw, array $allowed ): array {
		$values = array_map( 'sanitize_key', (array) $raw );
		$values = array_values( array_unique( array_intersect( $values, $allowed ) ) );

		return array_slice( $values, 0, count( $allowed ) );
	}
}
