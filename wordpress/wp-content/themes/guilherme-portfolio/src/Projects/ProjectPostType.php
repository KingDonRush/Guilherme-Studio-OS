<?php
/**
 * Portfolio Project post type.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Projects;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class ProjectPostType {

	public function init_hooks(): void {
		add_action( 'init', array( $this, 'register' ), 8 );
	}

	public function register(): void {
		register_post_type(
			ProjectRepository::POST_TYPE,
			array(
				'labels'              => array(
					'name'               => __( 'Portfolio Projects', 'guilherme-portfolio' ),
					'singular_name'      => __( 'Portfolio Project', 'guilherme-portfolio' ),
					'add_new_item'       => __( 'Add Portfolio Project', 'guilherme-portfolio' ),
					'edit_item'          => __( 'Edit Portfolio Project', 'guilherme-portfolio' ),
					'new_item'           => __( 'New Portfolio Project', 'guilherme-portfolio' ),
					'view_item'          => __( 'View Portfolio Project', 'guilherme-portfolio' ),
					'search_items'       => __( 'Search Portfolio Projects', 'guilherme-portfolio' ),
					'not_found'          => __( 'No portfolio projects found', 'guilherme-portfolio' ),
					'not_found_in_trash' => __( 'No portfolio projects found in Trash', 'guilherme-portfolio' ),
				),
				'description'         => __( 'Theme-owned project definitions that group pages, posts, CPTs and plugin integrations.', 'guilherme-portfolio' ),
				'public'              => false,
				'publicly_queryable'  => false,
				'exclude_from_search' => true,
				'show_ui'             => true,
				'show_in_menu'        => 'themes.php',
				'show_in_rest'        => true,
				'menu_icon'           => 'dashicons-portfolio',
				'capability_type'     => 'page',
				'map_meta_cap'        => true,
				'hierarchical'        => false,
				'supports'            => array( 'title', 'excerpt', 'thumbnail', 'page-attributes' ),
			)
		);
	}
}
