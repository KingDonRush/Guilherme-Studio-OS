<?php
/**
 * Request helpers for Portfolio Workbench admin actions.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class AdminActionRequest {

	public static function assert_action(): void {
		if ( ! current_user_can( AdminPage::CAPABILITY ) ) {
			wp_die( esc_html__( 'You do not have permission to update this workbench.', 'guilherme-portfolio' ) );
		}

		check_admin_referer( AdminActions::NONCE_ACTION, AdminActions::NONCE_NAME );
	}

	public static function posted_array( string $key ): array {
		return isset( $_POST[ $key ] ) && is_array( $_POST[ $key ] ) ? wp_unslash( $_POST[ $key ] ) : array();
	}

	public static function posted_text( string $key ): string {
		return isset( $_POST[ $key ] ) ? sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) : '';
	}

	public static function status( $status ): string {
		$status = sanitize_key( $status );

		return in_array( $status, array( 'draft', 'publish', 'private', 'pending' ), true ) ? $status : 'draft';
	}
}
