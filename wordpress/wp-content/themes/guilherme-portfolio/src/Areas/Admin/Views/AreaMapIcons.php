<?php
/**
 * Visual helper tokens for Portfolio Area Map.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Areas\Admin\Views;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class AreaMapIcons {

	public static function initials( string $title ): string {
		$words  = preg_split( '/\s+/', trim( $title ) );
		$first  = strtoupper( substr( $words[0] ?? 'A', 0, 1 ) );
		$second = strtoupper( substr( $words[1] ?? '', 0, 1 ) );

		return '' !== $second ? $first . $second : substr( strtoupper( $title ), 0, 2 );
	}

	public static function role( string $role ): string {
		return array(
			'home'            => 'dashicons-admin-home',
			'about'           => 'dashicons-id',
			'services'        => 'dashicons-portfolio',
			'contact'         => 'dashicons-email',
			'blog'            => 'dashicons-welcome-write-blog',
			'archive'         => 'dashicons-archive',
			'template'        => 'dashicons-layout',
			'menu'            => 'dashicons-menu-alt3',
			'case'            => 'dashicons-media-document',
			'header'          => 'dashicons-align-full-width',
			'footer'          => 'dashicons-align-wide',
			'single'          => 'dashicons-media-default',
			'single-post'     => 'dashicons-media-default',
			'single-product'  => 'dashicons-products',
			'archive-product' => 'dashicons-store',
			'loop'            => 'dashicons-grid-view',
			'popup'           => 'dashicons-welcome-view-site',
			'section'         => 'dashicons-screenoptions',
			'cart'            => 'dashicons-cart',
			'checkout'        => 'dashicons-yes-alt',
			'search'          => 'dashicons-search',
			'not-found'       => 'dashicons-dismiss',
		)[ $role ] ?? 'dashicons-admin-page';
	}

	public static function action( string $action ): string {
		return array(
			'edit'      => 'dashicons-edit',
			'elementor' => 'dashicons-layout',
			'view'      => 'dashicons-visibility',
			'open'      => 'dashicons-external',
			'list'      => 'dashicons-list-view',
			'new'       => 'dashicons-plus-alt2',
		)[ $action ] ?? 'dashicons-admin-links';
	}

	public static function type( string $type ): string {
		return array(
			'post'          => 'dashicons-media-document',
			'post_type'     => 'dashicons-index-card',
			'taxonomy'      => 'dashicons-category',
			'menu'          => 'dashicons-menu',
			'theme_builder' => 'dashicons-layout',
			'media'         => 'dashicons-format-image',
			'admin_url'     => 'dashicons-admin-generic',
			'reference'     => 'dashicons-book',
		)[ $type ] ?? 'dashicons-admin-links';
	}
}
