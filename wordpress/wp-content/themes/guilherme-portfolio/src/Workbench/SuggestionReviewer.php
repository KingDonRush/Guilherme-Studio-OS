<?php
/**
 * Review pending Workbench suggestions.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class SuggestionReviewer {

	private SuggestionStore $suggestions;
	private RelationStore $relations;

	public function __construct( SuggestionStore $suggestions, RelationStore $relations ) {
		$this->suggestions = $suggestions;
		$this->relations   = $relations;
	}

	public function mark( int $project_id, string $suggestion_id ): ?array {
		$suggestion = $this->suggestions->find( $project_id, $suggestion_id );

		if ( ! $suggestion ) {
			return null;
		}

		$relation = $this->promote_relation( $project_id, $suggestion );
		$suggestion = $this->suggestions->set_state( $project_id, $suggestion_id, 'marked' );

		return array(
			'suggestion' => $suggestion,
			'relation'   => $relation,
		);
	}

	public function ignore( int $project_id, string $suggestion_id ): ?array {
		return $this->suggestions->set_state( $project_id, $suggestion_id, 'ignored' );
	}

	public function mark_in_context( Context $context, string $suggestion_id ): ?array {
		$suggestion = $this->suggestions->find_in_context( $context, $suggestion_id );

		if ( ! $suggestion ) {
			return null;
		}

		$relation = $this->promote_context_relation( $context, $suggestion );
		$suggestion = $this->suggestions->set_context_state( $context, $suggestion_id, 'marked' );

		return array(
			'suggestion' => $suggestion,
			'relation'   => $relation,
		);
	}

	public function ignore_in_context( Context $context, string $suggestion_id ): ?array {
		return $this->suggestions->set_context_state( $context, $suggestion_id, 'ignored' );
	}

	private function promote_relation( int $project_id, array $suggestion ): ?array {
		$payload = $suggestion['payload'] ?? array();
		$source  = WorkbenchSanitizer::id( $payload['source'] ?? '' );
		$target  = WorkbenchSanitizer::id( $payload['target'] ?? '' );

		if ( '' === $source || '' === $target ) {
			return null;
		}

		return $this->relations->add(
			$project_id,
			array(
				'source'   => $source,
				'relation' => $payload['relation'] ?? 'relates_to',
				'target'   => $target,
				'provider' => $suggestion['provider'] ?? 'manual',
				'state'    => 'confirmed',
				'notes'    => $suggestion['label'] ?? '',
			)
		);
	}

	private function promote_context_relation( Context $context, array $suggestion ): ?array {
		$payload = $suggestion['payload'] ?? array();
		$source  = WorkbenchSanitizer::id( $payload['source'] ?? '' );
		$target  = WorkbenchSanitizer::id( $payload['target'] ?? '' );

		if ( '' === $source || '' === $target ) {
			return null;
		}

		return $this->relations->add_to_context(
			$context,
			array(
				'source'   => $source,
				'relation' => $payload['relation'] ?? 'relates_to',
				'target'   => $target,
				'provider' => $suggestion['provider'] ?? 'manual',
				'state'    => 'confirmed',
				'notes'    => $suggestion['label'] ?? '',
			)
		);
	}
}
