<?php
/**
 * WordPress-native front page and posts page mutations.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class FrontPageService {

	public function set_front_page( int $page_id ): void {
		$this->assert_page( $page_id );

		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $page_id );
	}

	public function set_posts_page( int $page_id ): void {
		$this->assert_page( $page_id );

		update_option( 'page_for_posts', $page_id );
	}

	private function assert_page( int $page_id ): void {
		$page = get_post( absint( $page_id ) );

		if ( ! $page || 'page' !== $page->post_type ) {
			throw new \InvalidArgumentException( 'A valid WordPress page is required.' );
		}
	}
}
