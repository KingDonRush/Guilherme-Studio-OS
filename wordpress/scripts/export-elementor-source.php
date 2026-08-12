<?php
/**
 * Export deterministic, sanitized Elementor page and template sources.
 *
 * Run with:
 * wp eval-file scripts/export-elementor-source.php
 *
 * @package GuilhermePortfolio
 */

if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
	throw new RuntimeException( 'This exporter must run through WP-CLI.' );
}

$export_root = ABSPATH . 'exports/elementor';
$source_root = $export_root . '/sources';

if ( ! wp_mkdir_p( $source_root ) ) {
	WP_CLI::error( 'Could not create the Elementor export directory.' );
}

$uploads = wp_get_upload_dir();
$replacements = array_filter(
	array(
		(string) ( $uploads['baseurl'] ?? '' ) => '{{uploads_url}}',
		untrailingslashit( content_url() )        => '{{content_url}}',
		untrailingslashit( site_url() )           => '{{site_url}}',
		untrailingslashit( home_url() )           => '{{site_url}}',
	),
	static fn ( string $value ): bool => '' !== $value
);

uksort(
	$replacements,
	static fn ( string $left, string $right ): int => strlen( $right ) <=> strlen( $left )
);

/**
 * Remove environment-specific URLs and stabilize associative key order.
 *
 * @param mixed                $value        Export value.
 * @param array<string,string> $replacements URL replacements.
 * @return mixed
 */
$normalize = static function ( $value, array $replacements ) use ( &$normalize ) {
	if ( is_string( $value ) ) {
		$value = str_replace( array_keys( $replacements ), array_values( $replacements ), $value );
		$value = preg_replace(
			'#https?://(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?/wp-content/uploads#i',
			'{{uploads_url}}',
			$value
		);
		$value = preg_replace(
			'#https?://(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?#i',
			'{{site_url}}',
			$value
		);

		return $value;
	}

	if ( ! is_array( $value ) ) {
		return $value;
	}

	if ( ! array_is_list( $value ) ) {
		ksort( $value );
	}

	foreach ( $value as $key => $item ) {
		$value[ $key ] = $normalize( $item, $replacements );
	}

	return $value;
};

/**
 * Write one stable JSON document.
 *
 * @param string               $path  Absolute output path.
 * @param array<string,mixed>  $value JSON value.
 */
$write_json = static function ( string $path, array $value ): void {
	$json = wp_json_encode(
		$value,
		JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
	);

	if ( false === $json ) {
		WP_CLI::error( 'Could not encode export JSON for ' . $path );
	}

	if ( false === file_put_contents( $path, $json . "\n", LOCK_EX ) ) {
		WP_CLI::error( 'Could not write export JSON to ' . $path );
	}

	chmod( $path, 0644 );
};

$existing_exports = glob( $source_root . '/*.json' );

if ( false !== $existing_exports ) {
	foreach ( $existing_exports as $existing_export ) {
		if ( is_file( $existing_export ) && ! unlink( $existing_export ) ) {
			WP_CLI::error( 'Could not remove stale export ' . $existing_export );
		}
	}
}

$posts = get_posts(
	array(
		'post_type'      => array( 'page', 'elementor_library' ),
		'post_status'    => array( 'publish', 'private', 'draft' ),
		'posts_per_page' => -1,
		'orderby'        => 'ID',
		'order'          => 'ASC',
	)
);

$active_theme  = wp_get_theme();
$front_page_id = (int) get_option( 'page_on_front' );
$manifest      = array(
	'schema_version' => 1,
	'exporter'       => 'wordpress/scripts/export-elementor-source.php',
	'scope'          => array(
		'post_statuses' => array( 'publish', 'private', 'draft' ),
		'post_types'    => array( 'page', 'elementor_library' ),
	),
	'runtime'        => array(
		'active_theme'  => $active_theme->get_stylesheet(),
		'theme_version' => $active_theme->get( 'Version' ),
		'front_page_id' => $front_page_id,
	),
	'records'        => array(),
);

$integration_keys = array(
	'_eit_filter_preset',
	'_eit_template_role',
	'_sbp_template_role',
);

foreach ( $posts as $post ) {
	$raw_data      = get_post_meta( $post->ID, '_elementor_data', true );
	$has_data      = is_string( $raw_data ) && '' !== $raw_data;
	$page_template = (string) get_post_meta( $post->ID, '_wp_page_template', true );
	$template_type = (string) get_post_meta( $post->ID, '_elementor_template_type', true );
	$conditions    = get_post_meta( $post->ID, '_elementor_conditions', true );
	$page_settings = get_post_meta( $post->ID, '_elementor_page_settings', true );
	$integrations  = array();

	foreach ( $integration_keys as $integration_key ) {
		$value = get_post_meta( $post->ID, $integration_key, true );

		if ( '' !== $value ) {
			$integrations[ $integration_key ] = $normalize( $value, $replacements );
		}
	}

	$has_source = $has_data
		|| ( is_array( $conditions ) && ! empty( $conditions ) )
		|| ( is_array( $page_settings ) && ! empty( $page_settings ) )
		|| ! empty( $integrations );
	$route         = null;
	$entrypoint    = null;
	$authority     = 'theme_php_fallback';

	if ( 'page' === $post->post_type ) {
		$route = $post->ID === $front_page_id ? '/' : wp_make_link_relative( get_permalink( $post ) );

		if ( $post->ID === $front_page_id && file_exists( get_template_directory() . '/front-page.php' ) ) {
			$authority  = 'theme_php';
			$entrypoint = 'wp-content/themes/guilherme-portfolio/front-page.php';
		} elseif ( $post->post_name && file_exists( get_template_directory() . '/page-' . $post->post_name . '.php' ) ) {
			$authority  = 'theme_php';
			$entrypoint = 'wp-content/themes/guilherme-portfolio/page-' . $post->post_name . '.php';
		} elseif ( $has_data ) {
			$authority  = 'elementor';
			$entrypoint = 'exports/elementor/sources';
		} else {
			$entrypoint = 'wp-content/themes/guilherme-portfolio/page.php';
		}
	} else {
		$authority  = 'elementor_library';
		$entrypoint = $has_source ? 'exports/elementor/sources' : null;
	}

	$record = array(
		'local_id'            => (int) $post->ID,
		'post_type'           => $post->post_type,
		'status'              => $post->post_status,
		'slug'                => $post->post_name,
		'title'               => $post->post_title,
		'parent_id'           => (int) $post->post_parent,
		'route'               => $normalize( $route, $replacements ),
		'render_authority'    => $authority,
		'render_entrypoint'   => $entrypoint,
		'page_template'       => $page_template,
		'elementor_type'      => $template_type,
		'has_elementor_data'  => $has_data,
		'source_file'         => null,
	);

	if ( $has_source ) {
		$decoded_data = array();

		if ( $has_data ) {
			$decoded_data = json_decode( $raw_data, true );

			if ( ! is_array( $decoded_data ) ) {
				WP_CLI::error(
					sprintf( 'Invalid _elementor_data JSON for post %d: %s', $post->ID, json_last_error_msg() )
				);
			}
		}

		$stable_slug = $post->post_name ?: sanitize_title( $post->post_title );
		$stable_slug = $stable_slug ?: 'untitled';
		$filename    = sanitize_file_name( $post->post_type . '--' . $stable_slug . '--' . $post->ID . '.json' );

		$source = array(
			'schema_version' => 1,
			'post'           => array(
				'local_id'  => (int) $post->ID,
				'parent_id' => (int) $post->post_parent,
				'post_type' => $post->post_type,
				'slug'      => $post->post_name,
				'status'    => $post->post_status,
				'title'     => $post->post_title,
			),
			'render'         => array(
				'authority'  => $authority,
				'entrypoint' => $entrypoint,
				'route'      => $normalize( $route, $replacements ),
			),
			'elementor'      => array(
				'conditions'    => $normalize( is_array( $conditions ) ? $conditions : array(), $replacements ),
				'data'          => $normalize( $decoded_data, $replacements ),
				'edit_mode'     => (string) get_post_meta( $post->ID, '_elementor_edit_mode', true ),
				'page_settings' => $normalize( is_array( $page_settings ) ? $page_settings : array(), $replacements ),
				'page_template' => $page_template,
				'pro_version'   => (string) get_post_meta( $post->ID, '_elementor_pro_version', true ),
				'template_type' => $template_type,
				'version'       => (string) get_post_meta( $post->ID, '_elementor_version', true ),
			),
			'integrations'   => $integrations,
			'post_content'   => $normalize( $post->post_content, $replacements ),
		);

		$write_json( $source_root . '/' . $filename, $source );
		$record['source_file'] = 'sources/' . $filename;
	}

	$manifest['records'][] = $record;
}

$write_json( $export_root . '/manifest.json', $manifest );

WP_CLI::success(
	sprintf(
		'Exported %d WordPress records and %d Elementor sources.',
		count( $manifest['records'] ),
		count( glob( $source_root . '/*.json' ) ?: array() )
	)
);
