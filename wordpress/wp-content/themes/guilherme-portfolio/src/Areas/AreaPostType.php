<?php
/**
 * Internal Portfolio Area post type.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Areas;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class AreaPostType {

	public function init_hooks(): void {
		add_action( 'init', array( $this, 'register' ) );
	}

	public function register(): void {
		register_post_type(
			AreaRepository::POST_TYPE,
			array(
				'labels'              => array(
					'name'          => __( 'Portfolio Areas', 'guilherme-portfolio' ),
					'singular_name' => __( 'Portfolio Area', 'guilherme-portfolio' ),
				),
				'public'              => false,
				'show_ui'             => false,
				'show_in_menu'        => false,
				'show_in_rest'        => false,
				'capability_type'     => 'post',
				'map_meta_cap'        => true,
				'supports'            => array( 'title', 'page-attributes' ),
				'delete_with_user'    => false,
				'exclude_from_search' => true,
			)
		);

		$this->register_meta();
	}

	private function register_meta(): void {
		register_post_meta(
			AreaRepository::POST_TYPE,
			AreaMeta::STATUS,
			array(
				'type'              => 'string',
				'single'            => true,
				'show_in_rest'      => false,
				'sanitize_callback' => array( AreaSanitizer::class, 'status' ),
				'auth_callback'     => array( $this, 'can_edit_theme' ),
			)
		);

		register_post_meta(
			AreaRepository::POST_TYPE,
			AreaMeta::NOTES,
			array(
				'type'              => 'string',
				'single'            => true,
				'show_in_rest'      => false,
				'sanitize_callback' => array( AreaSanitizer::class, 'notes' ),
				'auth_callback'     => array( $this, 'can_edit_theme' ),
			)
		);

		register_post_meta(
			AreaRepository::POST_TYPE,
			AreaMeta::ITEMS,
			array(
				'type'              => 'array',
				'single'            => true,
				'show_in_rest'      => false,
				'sanitize_callback' => array( AreaItemRepository::class, 'sanitize_items' ),
				'auth_callback'     => array( $this, 'can_edit_theme' ),
			)
		);
	}

	public function can_edit_theme(): bool {
		return current_user_can( 'edit_theme_options' );
	}
}
