<?php
/**
 * Attached project item storage.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench;

use GuilhermePortfolio\Projects\ProjectRepository;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class ItemStore {

	private const LIMIT = 200;

	private const TYPES = array(
		'page',
		'post',
		'cpt',
		'cct',
		'menu',
		'menu_item',
		'template',
		'field',
		'asset',
		'link',
		'evidence',
		'provider',
		'custom',
	);

	private const STATES = array(
		'manual',
		'confirmed',
		'suggested',
		'inherited',
		'missing',
		'needs_review',
		'ignored',
	);

	private ProjectRepository $projects;
	private ContextStorage $storage;

	public function __construct( ProjectRepository $projects, ContextStorage $storage ) {
		$this->projects = $projects;
		$this->storage  = $storage;
	}

	public function all( int $project_id ): array {
		return self::sanitize_items( get_post_meta( $project_id, WorkbenchMeta::ITEMS, true ) );
	}

	public function all_for_context( Context $context ): array {
		return $this->storage->items( $context );
	}

	public function attach( int $project_id, array $raw ): array {
		$item  = self::sanitize_item( $raw );
		$items = $this->all( $project_id );
		$index = $this->find_existing_index( $items, $item );

		if ( null !== $index ) {
			$item['created_at'] = $items[ $index ]['created_at'];
			$items[ $index ]    = $item;
		} else {
			$item['id'] = $this->unique_id( $item['id'], $items );
			$items[]    = $item;
		}

		update_post_meta( $project_id, WorkbenchMeta::ITEMS, array_slice( $items, 0, self::LIMIT ) );
		$this->save_content_assignment( $project_id, $item );

		return $item;
	}

	public function attach_to_context( Context $context, array $raw ): array {
		$item  = self::sanitize_item( $raw );
		$items = $this->all_for_context( $context );
		$index = $this->find_existing_index( $items, $item );

		if ( null !== $index ) {
			$item['created_at'] = $items[ $index ]['created_at'];
			$items[ $index ]    = $item;
		} else {
			$item['id'] = $this->unique_id( $item['id'], $items );
			$items[]    = $item;
		}

		$this->storage->save_items( $context, array_slice( $items, 0, self::LIMIT ) );

		if ( $context->is_project() ) {
			$this->save_content_assignment( $context->object_id(), $item );
		}

		return $item;
	}

	public function detach( int $project_id, string $item_id ): bool {
		$item_id = WorkbenchSanitizer::id( $item_id );
		$items   = $this->all( $project_id );
		$removed = array_values(
			array_filter(
				$items,
				static function ( array $item ) use ( $item_id ): bool {
					return $item['id'] === $item_id;
				}
			)
		);
		$filtered = array_values(
			array_filter(
				$items,
				static function ( array $item ) use ( $item_id ): bool {
					return $item['id'] !== $item_id;
				}
			)
		);

		update_post_meta( $project_id, WorkbenchMeta::ITEMS, $filtered );
		$this->clear_removed_assignments( $project_id, $removed );

		return count( $filtered ) !== count( $items );
	}

	public function detach_from_context( Context $context, string $item_id ): bool {
		$item_id = WorkbenchSanitizer::id( $item_id );
		$items   = $this->all_for_context( $context );
		$removed = $this->matching_items( $items, $item_id );
		$filtered = array_values(
			array_filter(
				$items,
				static function ( array $item ) use ( $item_id ): bool {
					return $item['id'] !== $item_id;
				}
			)
		);

		$this->storage->save_items( $context, $filtered );

		if ( $context->is_project() ) {
			$this->clear_removed_assignments( $context->object_id(), $removed );
		}

		return count( $filtered ) !== count( $items );
	}

	public static function sanitize_items( $raw ): array {
		$items = array();

		foreach ( WorkbenchSanitizer::list_slice( $raw, self::LIMIT ) as $item ) {
			if ( is_array( $item ) ) {
				$items[] = self::sanitize_item( $item );
			}
		}

		return array_values( $items );
	}

	public static function sanitize_item( array $raw ): array {
		$type        = WorkbenchSanitizer::allowed( $raw['type'] ?? '', self::TYPES, 'custom' );
		$object_id   = WorkbenchSanitizer::object_id( $raw['object_id'] ?? '' );
		$object_type = WorkbenchSanitizer::key( $raw['object_type'] ?? $type, $type );
		$label       = WorkbenchSanitizer::label( $raw['label'] ?? '' );
		$label       = '' !== $label ? $label : self::fallback_label( $type, $object_id );

		return array(
			'id'          => WorkbenchSanitizer::id( $raw['id'] ?? '', self::default_id( $type, $object_type, $object_id, $label ) ),
			'type'        => $type,
			'label'       => $label,
			'object_id'   => $object_id,
			'object_type' => $object_type,
			'category'    => CategoryRegistry::sanitize( $raw['category'] ?? $type ),
			'role'        => WorkbenchSanitizer::key( $raw['role'] ?? 'other', 'other' ),
			'provider'    => WorkbenchSanitizer::key( $raw['provider'] ?? 'manual', 'manual' ),
			'state'       => WorkbenchSanitizer::allowed( $raw['state'] ?? 'manual', self::STATES, 'manual' ),
			'notes'       => WorkbenchSanitizer::notes( $raw['notes'] ?? '' ),
			'created_at'  => WorkbenchSanitizer::timestamp( $raw['created_at'] ?? '' ),
			'updated_at'  => WorkbenchSanitizer::timestamp( $raw['updated_at'] ?? '' ),
		);
	}

	private function save_content_assignment( int $project_id, array $item ): void {
		$post_id = absint( $item['object_id'] );

		if ( ! $post_id || ! in_array( get_post_type( $post_id ), ProjectRepository::supported_content_post_types(), true ) ) {
			return;
		}

		$this->projects->save_assignment(
			$post_id,
			array(
				'project_id' => $project_id,
				'role'       => $item['role'],
			)
		);
	}

	private function clear_removed_assignments( int $project_id, array $removed ): void {
		foreach ( $removed as $item ) {
			$post_id = absint( $item['object_id'] ?? 0 );

			if ( ! $post_id || $this->projects->assigned_project_id( $post_id ) !== $project_id ) {
				continue;
			}

			$this->projects->save_assignment( $post_id, array( 'project_id' => 0 ) );
		}
	}

	private function matching_items( array $items, string $item_id ): array {
		return array_values(
			array_filter(
				$items,
				static function ( array $item ) use ( $item_id ): bool {
					return $item['id'] === $item_id;
				}
			)
		);
	}

	private function find_existing_index( array $items, array $item ): ?int {
		foreach ( $items as $index => $stored ) {
			if ( $stored['id'] === $item['id'] ) {
				return $index;
			}

			if ( $stored['type'] === $item['type'] && $stored['object_id'] === $item['object_id'] && '' !== $item['object_id'] ) {
				return $index;
			}
		}

		return null;
	}

	private function unique_id( string $base, array $items ): string {
		$ids = wp_list_pluck( $items, 'id' );
		$id  = '' !== $base ? $base : 'item';

		for ( $i = 2; in_array( $id, $ids, true ); $i++ ) {
			$id = $base . '-' . $i;
		}

		return $id;
	}

	private static function default_id( string $type, string $object_type, string $object_id, string $label ): string {
		return $type . '-' . $object_type . '-' . ( '' !== $object_id ? $object_id : sanitize_title( $label ) );
	}

	private static function fallback_label( string $type, string $object_id ): string {
		return '' !== $object_id ? sprintf( '%1$s #%2$s', $type, $object_id ) : ucfirst( $type );
	}
}
