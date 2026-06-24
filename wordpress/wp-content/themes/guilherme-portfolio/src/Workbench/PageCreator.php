<?php
/**
 * Create normal WordPress pages from Workbench intent.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class PageCreator {

	private ItemStore $items;

	public function __construct( ItemStore $items ) {
		$this->items = $items;
	}

	public function create( int $project_id, array $raw ): array {
		$title = WorkbenchSanitizer::label( $raw['title'] ?? '', 140 );

		if ( '' === $title ) {
			throw new \InvalidArgumentException( 'Page title is required.' );
		}

		$post_id = wp_insert_post(
			array(
				'post_type'    => 'page',
				'post_status'  => $this->status( $raw['status'] ?? 'draft' ),
				'post_title'   => $title,
				'post_content' => '',
			),
			true
		);

		if ( is_wp_error( $post_id ) ) {
			throw new \RuntimeException( $post_id->get_error_message() );
		}

		$item = $this->items->attach(
			$project_id,
			array(
				'type'        => 'page',
				'label'       => $title,
				'object_id'   => $post_id,
				'object_type' => 'page',
				'category'    => $raw['category'] ?? 'pages',
				'role'        => $raw['role'] ?? 'other',
				'provider'    => 'workbench',
				'state'       => 'confirmed',
				'notes'       => $raw['notes'] ?? '',
			)
		);

		return array(
			'post_id' => (int) $post_id,
			'item'    => $item,
			'edit'    => get_edit_post_link( (int) $post_id, '' ),
		);
	}

	private function status( $status ): string {
		$status = sanitize_key( $status );

		return in_array( $status, array( 'draft', 'publish', 'private', 'pending' ), true ) ? $status : 'draft';
	}
}
