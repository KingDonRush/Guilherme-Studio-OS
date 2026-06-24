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
	private CodePageRegistry $code_pages;

	public function __construct( ItemStore $items, CodePageRegistry $code_pages ) {
		$this->items      = $items;
		$this->code_pages = $code_pages;
	}

	public function create( int $project_id, array $raw ): array {
		$title = WorkbenchSanitizer::label( $raw['title'] ?? '', 140 );

		$post_id = $this->insert_page( $title, $raw );
		$item    = $this->items->attach( $project_id, $this->page_item( $post_id, $title, $raw ) );

		return array(
			'post_id' => (int) $post_id,
			'item'    => $item,
			'edit'    => get_edit_post_link( (int) $post_id, '' ),
		);
	}

	public function materialize_for_context( Context $context, string $definition_id ): array {
		$definition = $this->code_pages->find( $definition_id );

		if ( ! $definition ) {
			throw new \InvalidArgumentException( 'Coded page definition not found.' );
		}

		if ( CodePageRegistry::SCOPE_ROOT === $definition['scope'] && ! $context->is_root() ) {
			throw new \InvalidArgumentException( 'This coded page can only be materialized in the portfolio root context.' );
		}

		$page_id = $this->find_page_id( $definition['slug'] );
		$created = false;

		if ( ! $page_id ) {
			$page_id = $this->insert_page( $definition['title'], $definition );
			$created = true;
		}

		$item = $this->items->attach_to_context( $context, $this->page_item( $page_id, $definition['title'], $definition ) );

		return array(
			'post_id'    => $page_id,
			'created'    => $created,
			'definition' => $definition,
			'item'       => $item,
			'edit'       => get_edit_post_link( $page_id, '' ),
		);
	}

	public function create_for_context( Context $context, array $raw ): array {
		$title = WorkbenchSanitizer::label( $raw['title'] ?? '', 140 );

		$post_id = $this->insert_page( $title, $raw );
		$item    = $this->items->attach_to_context( $context, $this->page_item( $post_id, $title, $raw ) );

		return array(
			'post_id' => (int) $post_id,
			'item'    => $item,
			'edit'    => get_edit_post_link( (int) $post_id, '' ),
		);
	}

	private function insert_page( string $title, array $raw ): int {
		if ( '' === $title ) {
			throw new \InvalidArgumentException( 'Page title is required.' );
		}

		$post = array(
			'post_type'    => 'page',
			'post_status'  => $this->status( $raw['status'] ?? 'draft' ),
			'post_title'   => $title,
			'post_content' => '',
		);

		if ( ! empty( $raw['slug'] ) ) {
			$post['post_name'] = sanitize_title( $raw['slug'] );
		}

		$post_id = wp_insert_post( $post, true );

		if ( is_wp_error( $post_id ) ) {
			throw new \RuntimeException( $post_id->get_error_message() );
		}

		return (int) $post_id;
	}

	private function page_item( int $post_id, string $title, array $raw ): array {
		return array(
			'type'        => 'page',
			'label'       => $title,
			'object_id'   => $post_id,
			'object_type' => 'page',
			'category'    => $raw['category'] ?? 'pages',
			'role'        => $raw['role'] ?? 'other',
			'provider'    => $raw['provider'] ?? 'workbench',
			'state'       => 'confirmed',
			'notes'       => $raw['notes'] ?? '',
		);
	}

	private function find_page_id( string $slug ): int {
		$page = get_page_by_path( sanitize_title( $slug ), OBJECT, 'page' );

		return $page instanceof \WP_Post ? (int) $page->ID : 0;
	}

	private function status( $status ): string {
		$status = sanitize_key( $status );

		return in_array( $status, array( 'draft', 'publish', 'private', 'pending' ), true ) ? $status : 'draft';
	}
}
