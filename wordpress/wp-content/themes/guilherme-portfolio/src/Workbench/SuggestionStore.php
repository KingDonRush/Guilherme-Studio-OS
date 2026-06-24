<?php
/**
 * Pending Workbench suggestion storage.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class SuggestionStore {

	private const LIMIT = 200;
	private const STATES = array( 'pending', 'marked', 'ignored' );

	private ContextStorage $storage;

	public function __construct( ContextStorage $storage ) {
		$this->storage = $storage;
	}

	public function all( int $project_id ): array {
		return self::sanitize_suggestions( get_post_meta( $project_id, WorkbenchMeta::SUGGESTIONS, true ) );
	}

	public function all_for_context( Context $context ): array {
		return $this->storage->suggestions( $context );
	}

	public function find( int $project_id, string $suggestion_id ): ?array {
		$suggestions = $this->all( $project_id );
		$index       = $this->find_index( $suggestions, $suggestion_id );

		return null === $index ? null : $suggestions[ $index ];
	}

	public function find_in_context( Context $context, string $suggestion_id ): ?array {
		$suggestions = $this->all_for_context( $context );
		$index       = $this->find_index( $suggestions, $suggestion_id );

		return null === $index ? null : $suggestions[ $index ];
	}

	public function add( int $project_id, array $raw ): array {
		$suggestion  = self::sanitize_suggestion( $raw );
		$suggestions = $this->all( $project_id );
		$index       = $this->find_index( $suggestions, $suggestion['id'] );

		if ( null !== $index ) {
			$suggestion['created_at'] = $suggestions[ $index ]['created_at'];
			$suggestions[ $index ]    = $suggestion;
		} else {
			$suggestion['id'] = $this->unique_id( $suggestion['id'], $suggestions );
			$suggestions[]    = $suggestion;
		}

		update_post_meta( $project_id, WorkbenchMeta::SUGGESTIONS, array_slice( $suggestions, 0, self::LIMIT ) );

		return $suggestion;
	}

	public function add_to_context( Context $context, array $raw ): array {
		$suggestion  = self::sanitize_suggestion( $raw );
		$suggestions = $this->all_for_context( $context );
		$index       = $this->find_index( $suggestions, $suggestion['id'] );

		if ( null !== $index ) {
			$suggestion['created_at'] = $suggestions[ $index ]['created_at'];
			$suggestions[ $index ]    = $suggestion;
		} else {
			$suggestion['id'] = $this->unique_id( $suggestion['id'], $suggestions );
			$suggestions[]    = $suggestion;
		}

		$this->storage->save_suggestions( $context, array_slice( $suggestions, 0, self::LIMIT ) );

		return $suggestion;
	}

	public function set_state( int $project_id, string $suggestion_id, string $state ): ?array {
		$suggestions = $this->all( $project_id );
		$index       = $this->find_index( $suggestions, $suggestion_id );

		if ( null === $index ) {
			return null;
		}

		$suggestions[ $index ]['state']      = WorkbenchSanitizer::allowed( $state, self::STATES, 'pending' );
		$suggestions[ $index ]['updated_at'] = current_time( 'mysql' );
		update_post_meta( $project_id, WorkbenchMeta::SUGGESTIONS, $suggestions );

		return $suggestions[ $index ];
	}

	public function set_context_state( Context $context, string $suggestion_id, string $state ): ?array {
		$suggestions = $this->all_for_context( $context );
		$index       = $this->find_index( $suggestions, $suggestion_id );

		if ( null === $index ) {
			return null;
		}

		$suggestions[ $index ]['state']      = WorkbenchSanitizer::allowed( $state, self::STATES, 'pending' );
		$suggestions[ $index ]['updated_at'] = current_time( 'mysql' );
		$this->storage->save_suggestions( $context, $suggestions );

		return $suggestions[ $index ];
	}

	public static function sanitize_suggestions( $raw ): array {
		$suggestions = array();

		foreach ( WorkbenchSanitizer::list_slice( $raw, self::LIMIT ) as $suggestion ) {
			if ( is_array( $suggestion ) ) {
				$suggestions[] = self::sanitize_suggestion( $suggestion );
			}
		}

		return array_values( $suggestions );
	}

	public static function sanitize_suggestion( array $raw ): array {
		$type  = WorkbenchSanitizer::key( $raw['type'] ?? 'relation', 'relation' );
		$label = WorkbenchSanitizer::label( $raw['label'] ?? $type );

		return array(
			'id'         => WorkbenchSanitizer::id( $raw['id'] ?? '', 'sug-' . sanitize_title( $label ) ),
			'label'      => $label,
			'type'       => $type,
			'provider'   => WorkbenchSanitizer::key( $raw['provider'] ?? 'manual', 'manual' ),
			'state'      => WorkbenchSanitizer::allowed( $raw['state'] ?? 'pending', self::STATES, 'pending' ),
			'payload'    => WorkbenchSanitizer::payload( $raw['payload'] ?? array() ),
			'notes'      => WorkbenchSanitizer::notes( $raw['notes'] ?? '' ),
			'created_at' => WorkbenchSanitizer::timestamp( $raw['created_at'] ?? '' ),
			'updated_at' => WorkbenchSanitizer::timestamp( $raw['updated_at'] ?? '' ),
		);
	}

	private function find_index( array $suggestions, string $suggestion_id ): ?int {
		$suggestion_id = WorkbenchSanitizer::id( $suggestion_id );

		foreach ( $suggestions as $index => $suggestion ) {
			if ( $suggestion['id'] === $suggestion_id ) {
				return $index;
			}
		}

		return null;
	}

	private function unique_id( string $base, array $suggestions ): string {
		$ids = wp_list_pluck( $suggestions, 'id' );
		$id  = '' !== $base ? $base : 'suggestion';

		for ( $i = 2; in_array( $id, $ids, true ); $i++ ) {
			$id = $base . '-' . $i;
		}

		return $id;
	}
}
