<?php
/**
 * Manual project relation storage.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class RelationStore {

	private const LIMIT = 300;
	private const STATES = array( 'suggested', 'confirmed', 'ignored', 'needs_review' );

	public function all( int $project_id ): array {
		return self::sanitize_relations( get_post_meta( $project_id, WorkbenchMeta::RELATIONS, true ) );
	}

	public function add( int $project_id, array $raw ): array {
		$relation  = self::sanitize_relation( $raw );
		$relations = $this->all( $project_id );
		$index     = $this->find_index( $relations, $relation['id'] );

		if ( null !== $index ) {
			$relation['created_at'] = $relations[ $index ]['created_at'];
			$relations[ $index ]    = $relation;
		} else {
			$relation['id'] = $this->unique_id( $relation['id'], $relations );
			$relations[]    = $relation;
		}

		update_post_meta( $project_id, WorkbenchMeta::RELATIONS, array_slice( $relations, 0, self::LIMIT ) );

		return $relation;
	}

	public function update_state( int $project_id, string $relation_id, string $state ): ?array {
		$relations = $this->all( $project_id );
		$index     = $this->find_index( $relations, $relation_id );

		if ( null === $index ) {
			return null;
		}

		$relations[ $index ]['state']      = WorkbenchSanitizer::allowed( $state, self::STATES, 'needs_review' );
		$relations[ $index ]['updated_at'] = current_time( 'mysql' );
		update_post_meta( $project_id, WorkbenchMeta::RELATIONS, $relations );

		return $relations[ $index ];
	}

	public function remove( int $project_id, string $relation_id ): bool {
		$relation_id = WorkbenchSanitizer::id( $relation_id );
		$relations   = $this->all( $project_id );
		$filtered    = array_values(
			array_filter(
				$relations,
				static function ( array $relation ) use ( $relation_id ): bool {
					return $relation['id'] !== $relation_id;
				}
			)
		);

		update_post_meta( $project_id, WorkbenchMeta::RELATIONS, $filtered );

		return count( $filtered ) !== count( $relations );
	}

	public static function sanitize_relations( $raw ): array {
		$relations = array();

		foreach ( WorkbenchSanitizer::list_slice( $raw, self::LIMIT ) as $relation ) {
			if ( is_array( $relation ) ) {
				$relations[] = self::sanitize_relation( $relation );
			}
		}

		return array_values( $relations );
	}

	public static function sanitize_relation( array $raw ): array {
		$source   = WorkbenchSanitizer::id( $raw['source'] ?? '' );
		$target   = WorkbenchSanitizer::id( $raw['target'] ?? '' );
		$relation = WorkbenchSanitizer::key( $raw['relation'] ?? 'relates_to', 'relates_to' );

		return array(
			'id'         => WorkbenchSanitizer::id( $raw['id'] ?? '', self::default_id( $source, $relation, $target ) ),
			'source'     => $source,
			'relation'   => $relation,
			'target'     => $target,
			'provider'   => WorkbenchSanitizer::key( $raw['provider'] ?? 'manual', 'manual' ),
			'state'      => WorkbenchSanitizer::allowed( $raw['state'] ?? 'needs_review', self::STATES, 'needs_review' ),
			'notes'      => WorkbenchSanitizer::notes( $raw['notes'] ?? '' ),
			'created_at' => WorkbenchSanitizer::timestamp( $raw['created_at'] ?? '' ),
			'updated_at' => WorkbenchSanitizer::timestamp( $raw['updated_at'] ?? '' ),
		);
	}

	private function find_index( array $relations, string $relation_id ): ?int {
		$relation_id = WorkbenchSanitizer::id( $relation_id );

		foreach ( $relations as $index => $relation ) {
			if ( $relation['id'] === $relation_id ) {
				return $index;
			}
		}

		return null;
	}

	private function unique_id( string $base, array $relations ): string {
		$ids = wp_list_pluck( $relations, 'id' );
		$id  = '' !== $base ? $base : 'relation';

		for ( $i = 2; in_array( $id, $ids, true ); $i++ ) {
			$id = $base . '-' . $i;
		}

		return $id;
	}

	private static function default_id( string $source, string $relation, string $target ): string {
		return 'rel-' . $source . '-' . $relation . '-' . $target;
	}
}
