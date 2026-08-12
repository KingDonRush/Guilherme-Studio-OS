<?php
if (!defined('WP_CLI') || !WP_CLI) {
	exit(1);
}

if (!get_current_user_id()) {
	$administrators = get_users(array('role' => 'administrator', 'number' => 1, 'fields' => 'ids'));
	if (!empty($administrators[0])) {
		wp_set_current_user(absint($administrators[0]));
	}
}

require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

if (!taxonomy_exists('studio_media_group')) {
	register_taxonomy(
		'studio_media_group',
		array('attachment'),
		array(
			'public' => false,
			'show_ui' => true,
			'show_admin_column' => true,
			'show_in_rest' => true,
			'hierarchical' => false,
			'rewrite' => false,
			'query_var' => true,
		)
	);
}

$group_name = 'Mina Forma - Home v2 Individual Assets';
$group_slug = 'mina-forma-home-v2-individual-assets';
$term = term_exists($group_slug, 'studio_media_group');
if (!$term) {
	$term = wp_insert_term($group_name, 'studio_media_group', array('slug' => $group_slug));
}
if (is_wp_error($term)) {
	WP_CLI::error($term->get_error_message());
}
$term_id = is_array($term) ? absint($term['term_id']) : absint($term);

$assets = array(
	array(
		'sourcePath' => 'portfolio/sites/multipaginados/mina-forma/assets/wordpress/home-v2-individual/mina-home-v2-hero-reception-interior.webp',
		'wpPath' => 'wp-content/themes/guilherme-portfolio/assets/images/mina-forma/home-v2-individual/mina-home-v2-hero-reception-interior.webp',
		'title' => 'Mina Forma Home V2 Hero Reception Interior',
		'alt' => 'Mina Forma Home v2 reception interior with stone counter, walnut slats and architectural plans.',
	),
	array(
		'sourcePath' => 'portfolio/sites/multipaginados/mina-forma/assets/wordpress/home-v2-individual/mina-home-v2-field-materials.webp',
		'wpPath' => 'wp-content/themes/guilherme-portfolio/assets/images/mina-forma/home-v2-individual/mina-home-v2-field-materials.webp',
		'title' => 'Mina Forma Home V2 Field Materials',
		'alt' => 'Mina Forma Home v2 material palette with stone, wood, terrazzo and clay textile samples.',
	),
	array(
		'sourcePath' => 'portfolio/sites/multipaginados/mina-forma/assets/wordpress/home-v2-individual/mina-home-v2-field-floor-plan.webp',
		'wpPath' => 'wp-content/themes/guilherme-portfolio/assets/images/mina-forma/home-v2-individual/mina-home-v2-field-floor-plan.webp',
		'title' => 'Mina Forma Home V2 Field Floor Plan',
		'alt' => 'Mina Forma Home v2 architectural floor plan detail with a black technical pen.',
	),
	array(
		'sourcePath' => 'portfolio/sites/multipaginados/mina-forma/assets/wordpress/home-v2-individual/mina-home-v2-field-chair-corner.webp',
		'wpPath' => 'wp-content/themes/guilherme-portfolio/assets/images/mina-forma/home-v2-individual/mina-home-v2-field-chair-corner.webp',
		'title' => 'Mina Forma Home V2 Field Chair Corner',
		'alt' => 'Mina Forma Home v2 quiet chair corner with walnut slats, stone side table and warm accent light.',
	),
	array(
		'sourcePath' => 'portfolio/sites/multipaginados/mina-forma/assets/wordpress/home-v2-individual/mina-home-v2-project-retail-fitout.webp',
		'wpPath' => 'wp-content/themes/guilherme-portfolio/assets/images/mina-forma/home-v2-individual/mina-home-v2-project-retail-fitout.webp',
		'title' => 'Mina Forma Home V2 Project Retail Fit-Out',
		'alt' => 'Mina Forma Home v2 retail fit-out project image with walnut display table and minimal clothing rail.',
	),
	array(
		'sourcePath' => 'portfolio/sites/multipaginados/mina-forma/assets/wordpress/home-v2-individual/mina-home-v2-project-cafe-counter.webp',
		'wpPath' => 'wp-content/themes/guilherme-portfolio/assets/images/mina-forma/home-v2-individual/mina-home-v2-project-cafe-counter.webp',
		'title' => 'Mina Forma Home V2 Project Cafe Counter',
		'alt' => 'Mina Forma Home v2 cafe counter system project image with stone counter and walnut slat frontage.',
	),
	array(
		'sourcePath' => 'portfolio/sites/multipaginados/mina-forma/assets/wordpress/home-v2-individual/mina-home-v2-project-studio-reception.webp',
		'wpPath' => 'wp-content/themes/guilherme-portfolio/assets/images/mina-forma/home-v2-individual/mina-home-v2-project-studio-reception.webp',
		'title' => 'Mina Forma Home V2 Project Studio Reception',
		'alt' => 'Mina Forma Home v2 studio reception project image with stone desk, walnut slats and warm light.',
	),
	array(
		'sourcePath' => 'portfolio/sites/multipaginados/mina-forma/assets/wordpress/home-v2-individual/mina-home-v2-cta-planning-desk.webp',
		'wpPath' => 'wp-content/themes/guilherme-portfolio/assets/images/mina-forma/home-v2-individual/mina-home-v2-cta-planning-desk.webp',
		'title' => 'Mina Forma Home V2 CTA Planning Desk',
		'alt' => 'Mina Forma Home v2 planning desk banner with open sketchbook, pen and material samples.',
	),
	array(
		'sourcePath' => 'portfolio/sites/multipaginados/mina-forma/assets/wordpress/home-v2-individual/mina-home-v2-paper-grain.webp',
		'wpPath' => 'wp-content/themes/guilherme-portfolio/assets/images/mina-forma/home-v2-individual/mina-home-v2-paper-grain.webp',
		'title' => 'Mina Forma Home V2 Paper Grain',
		'alt' => 'Mina Forma Home v2 subtle warm off-white paper grain texture.',
	),
	array(
		'sourcePath' => 'portfolio/sites/multipaginados/mina-forma/assets/wordpress/home-v2-individual/mina-home-v2-icon-calendar-check.webp',
		'wpPath' => 'wp-content/themes/guilherme-portfolio/assets/images/mina-forma/home-v2-individual/mina-home-v2-icon-calendar-check.webp',
		'title' => 'Mina Forma Home V2 Icon Calendar Check',
		'alt' => 'Mina Forma Home v2 transparent turquoise calendar check icon.',
	),
	array(
		'sourcePath' => 'portfolio/sites/multipaginados/mina-forma/assets/wordpress/home-v2-individual/mina-home-v2-icon-storefront.webp',
		'wpPath' => 'wp-content/themes/guilherme-portfolio/assets/images/mina-forma/home-v2-individual/mina-home-v2-icon-storefront.webp',
		'title' => 'Mina Forma Home V2 Icon Storefront',
		'alt' => 'Mina Forma Home v2 transparent turquoise storefront icon.',
	),
	array(
		'sourcePath' => 'portfolio/sites/multipaginados/mina-forma/assets/wordpress/home-v2-individual/mina-home-v2-icon-scope-document.webp',
		'wpPath' => 'wp-content/themes/guilherme-portfolio/assets/images/mina-forma/home-v2-individual/mina-home-v2-icon-scope-document.webp',
		'title' => 'Mina Forma Home V2 Icon Scope Document',
		'alt' => 'Mina Forma Home v2 transparent turquoise scope document checklist icon.',
	),
	array(
		'sourcePath' => 'portfolio/sites/multipaginados/mina-forma/assets/wordpress/home-v2-individual/mina-home-v2-shape-corner-mark.webp',
		'wpPath' => 'wp-content/themes/guilherme-portfolio/assets/images/mina-forma/home-v2-individual/mina-home-v2-shape-corner-mark.webp',
		'title' => 'Mina Forma Home V2 Shape Corner Mark',
		'alt' => 'Mina Forma Home v2 transparent turquoise corner marker shape.',
	),
	array(
		'sourcePath' => 'portfolio/sites/multipaginados/mina-forma/assets/wordpress/home-v2-individual/mina-home-v2-icon-orange-arrow.webp',
		'wpPath' => 'wp-content/themes/guilherme-portfolio/assets/images/mina-forma/home-v2-individual/mina-home-v2-icon-orange-arrow.webp',
		'title' => 'Mina Forma Home V2 Icon Orange Arrow',
		'alt' => 'Mina Forma Home v2 transparent orange right arrow icon.',
	),
);

$results = array();

foreach ($assets as $asset) {
	$source = ABSPATH . $asset['wpPath'];
	if (!is_file($source)) {
		$results[] = array(
			'status' => 'missing_source',
			'sourcePath' => $asset['sourcePath'],
			'wpPath' => $asset['wpPath'],
		);
		continue;
	}

	$checksum = hash_file('sha256', $source);
	$existing = get_posts(
		array(
			'post_type' => 'attachment',
			'post_status' => 'inherit',
			'posts_per_page' => 1,
			'fields' => 'ids',
			'meta_key' => '_studio_asset_source',
			'meta_value' => $asset['sourcePath'],
		)
	);

	if (!empty($existing[0])) {
		$id = absint($existing[0]);
		wp_update_post(
			array(
				'ID' => $id,
				'post_title' => $asset['title'],
				'post_excerpt' => $asset['alt'],
			)
		);
		update_post_meta($id, '_wp_attachment_image_alt', $asset['alt']);
		update_post_meta($id, '_studio_asset_checksum', $checksum);
		update_post_meta($id, '_studio_asset_site', 'mina-forma');
		update_post_meta($id, '_studio_media_group', $group_slug);
		wp_set_object_terms($id, array($term_id), 'studio_media_group', false);
		$results[] = array(
			'id' => $id,
			'status' => 'existing',
			'sourcePath' => $asset['sourcePath'],
			'url' => wp_get_attachment_url($id),
		);
		continue;
	}

	$uploads = wp_upload_dir();
	if (!empty($uploads['error'])) {
		WP_CLI::error($uploads['error']);
	}

	$filename = wp_unique_filename($uploads['path'], basename($source));
	$destination = trailingslashit($uploads['path']) . $filename;
	if (!copy($source, $destination)) {
		$results[] = array(
			'status' => 'copy_failed',
			'sourcePath' => $asset['sourcePath'],
		);
		continue;
	}

	$filetype = wp_check_filetype($filename, null);
	$id = wp_insert_attachment(
		array(
			'post_mime_type' => $filetype['type'],
			'post_title' => $asset['title'],
			'post_name' => sanitize_title($asset['title']),
			'post_content' => '',
			'post_excerpt' => $asset['alt'],
			'post_status' => 'inherit',
		),
		$destination
	);

	if (is_wp_error($id)) {
		@unlink($destination);
		$results[] = array(
			'status' => 'insert_failed',
			'sourcePath' => $asset['sourcePath'],
			'error' => $id->get_error_message(),
		);
		continue;
	}

	$metadata = wp_generate_attachment_metadata($id, $destination);
	wp_update_attachment_metadata($id, $metadata);
	update_post_meta($id, '_wp_attachment_image_alt', $asset['alt']);
	update_post_meta($id, '_studio_asset_source', $asset['sourcePath']);
	update_post_meta($id, '_studio_asset_checksum', $checksum);
	update_post_meta($id, '_studio_asset_site', 'mina-forma');
	update_post_meta($id, '_studio_media_group', $group_slug);
	wp_set_object_terms($id, array($term_id), 'studio_media_group', false);

	$results[] = array(
		'id' => $id,
		'status' => 'imported',
		'sourcePath' => $asset['sourcePath'],
		'url' => wp_get_attachment_url($id),
	);
}

WP_CLI::line(
	wp_json_encode(
		array(
			'apiVersion' => 'studio.guilherme.dev/mina-forma-home-v2-media-import-v1',
			'group' => array(
				'taxonomy' => 'studio_media_group',
				'name' => $group_name,
				'slug' => $group_slug,
				'term_id' => $term_id,
			),
			'assets' => $results,
		),
		JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES
	)
);
