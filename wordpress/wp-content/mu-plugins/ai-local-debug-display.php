<?php
/**
 * Plugin Name: AI Local Debug Display Guard
 * Description: Keeps local PHP debug output out of public HTML while preserving server logs.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
	@ini_set( 'display_errors', '0' );
	@ini_set( 'log_errors', '1' );

	error_reporting( E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED );
}
