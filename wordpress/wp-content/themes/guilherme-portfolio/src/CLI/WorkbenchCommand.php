<?php
/**
 * WP-CLI commands for Portfolio Workbench records.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\CLI;

use GuilhermePortfolio\Projects\ProjectRepository;
use GuilhermePortfolio\Workbench\ItemStore;
use GuilhermePortfolio\Workbench\PageCreator;
use GuilhermePortfolio\Workbench\RelationStore;
use GuilhermePortfolio\Workbench\SuggestionReviewer;
use GuilhermePortfolio\Workbench\SuggestionStore;
use GuilhermePortfolio\Workbench\TopologyService;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class WorkbenchCommand {

	private ItemStore $items;
	private PageCreator $pages;
	private RelationStore $relations;
	private SuggestionReviewer $reviewer;
	private SuggestionStore $suggestions;
	private TopologyService $topology;

	public function __construct(
		ItemStore $items,
		PageCreator $pages,
		RelationStore $relations,
		SuggestionReviewer $reviewer,
		SuggestionStore $suggestions,
		TopologyService $topology
	) {
		$this->items       = $items;
		$this->pages       = $pages;
		$this->relations   = $relations;
		$this->reviewer    = $reviewer;
		$this->suggestions = $suggestions;
		$this->topology    = $topology;
	}

	public function init_hooks(): void {
		if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
			return;
		}

		\WP_CLI::add_command( 'gp item', array( $this, 'item' ) );
		\WP_CLI::add_command( 'gp relation', array( $this, 'relation' ) );
		\WP_CLI::add_command( 'gp suggestion', array( $this, 'suggestion' ) );
		\WP_CLI::add_command( 'gp topology', array( $this, 'topology' ) );
	}

	public function item( array $args, array $assoc_args ): void {
		$action     = $args[0] ?? 'list';
		$project_id = $this->project_id_arg( $args, 1 );

		if ( 'list' === $action ) {
			$this->format_items( $assoc_args, $this->items->all( $project_id ), array( 'id', 'type', 'label', 'category', 'role', 'provider', 'state' ) );
			return;
		}

		if ( 'attach' === $action ) {
			$item = $this->items->attach( $project_id, $this->item_args( $assoc_args ) );
			$this->success_payload( 'Workbench item attached.', $item, $assoc_args );
			return;
		}

		if ( 'create-page' === $action ) {
			try {
				$page = $this->pages->create( $project_id, $this->page_args( $assoc_args ) );
			} catch ( \Throwable $error ) {
				\WP_CLI::error( $error->getMessage() );
			}

			$this->success_payload( 'Workbench page created and attached.', $page, $assoc_args );
			return;
		}

		if ( 'detach' === $action ) {
			$item_id = $args[2] ?? '';
			$this->require_value( $item_id, 'Workbench item ID is required.' );

			if ( ! $this->items->detach( $project_id, $item_id ) ) {
				\WP_CLI::error( 'Workbench item not found.' );
			}

			\WP_CLI::success( 'Workbench item detached.' );
			return;
		}

		\WP_CLI::error( 'Use one of: list, attach, create-page, detach.' );
	}

	public function relation( array $args, array $assoc_args ): void {
		$action     = $args[0] ?? 'list';
		$project_id = $this->project_id_arg( $args, 1 );

		if ( 'list' === $action ) {
			$this->format_items( $assoc_args, $this->relations->all( $project_id ), array( 'id', 'source', 'relation', 'target', 'provider', 'state' ) );
			return;
		}

		if ( 'add' === $action ) {
			$relation = $this->relations->add( $project_id, $this->relation_args( $assoc_args ) );
			$this->success_payload( 'Workbench relation stored.', $relation, $assoc_args );
			return;
		}

		if ( 'update' === $action ) {
			$relation_id = $args[2] ?? '';
			$this->require_value( $relation_id, 'Workbench relation ID is required.' );
			$relation = $this->relations->update_state( $project_id, $relation_id, $assoc_args['state'] ?? 'needs_review' );

			if ( ! $relation ) {
				\WP_CLI::error( 'Workbench relation not found.' );
			}

			$this->success_payload( 'Workbench relation updated.', $relation, $assoc_args );
			return;
		}

		if ( 'remove' === $action ) {
			$relation_id = $args[2] ?? '';
			$this->require_value( $relation_id, 'Workbench relation ID is required.' );

			if ( ! $this->relations->remove( $project_id, $relation_id ) ) {
				\WP_CLI::error( 'Workbench relation not found.' );
			}

			\WP_CLI::success( 'Workbench relation removed.' );
			return;
		}

		\WP_CLI::error( 'Use one of: list, add, update, remove.' );
	}

	public function suggestion( array $args, array $assoc_args ): void {
		$action     = $args[0] ?? 'list';
		$project_id = $this->project_id_arg( $args, 1 );

		if ( 'list' === $action ) {
			$this->format_items( $assoc_args, $this->suggestions->all( $project_id ), array( 'id', 'label', 'type', 'provider', 'state' ) );
			return;
		}

		if ( 'add' === $action ) {
			$suggestion = $this->suggestions->add( $project_id, $this->suggestion_args( $assoc_args ) );
			$this->success_payload( 'Workbench suggestion stored.', $suggestion, $assoc_args );
			return;
		}

		if ( in_array( $action, array( 'mark', 'ignore' ), true ) ) {
			$suggestion_id = $args[2] ?? '';
			$this->require_value( $suggestion_id, 'Workbench suggestion ID is required.' );
			$suggestion = 'mark' === $action
				? $this->reviewer->mark( $project_id, $suggestion_id )
				: $this->reviewer->ignore( $project_id, $suggestion_id );

			if ( ! $suggestion ) {
				\WP_CLI::error( 'Workbench suggestion not found.' );
			}

			$this->success_payload( 'Workbench suggestion updated.', $suggestion, $assoc_args );
			return;
		}

		\WP_CLI::error( 'Use one of: list, add, mark, ignore.' );
	}

	public function topology( array $args, array $assoc_args ): void {
		$project_id = $this->project_id_arg( array( 'get', $args[0] ?? 0 ), 1 );
		$this->line_json( $this->topology->project( $project_id ), $assoc_args );
	}

	private function item_args( array $assoc_args ): array {
		return array(
			'id'          => $assoc_args['id'] ?? '',
			'type'        => $assoc_args['type'] ?? 'custom',
			'label'       => $assoc_args['label'] ?? '',
			'object_id'   => $assoc_args['object-id'] ?? '',
			'object_type' => $assoc_args['object-type'] ?? '',
			'category'    => $assoc_args['category'] ?? 'content',
			'role'        => $assoc_args['role'] ?? 'other',
			'provider'    => $assoc_args['provider'] ?? 'manual',
			'state'       => $assoc_args['state'] ?? 'manual',
			'notes'       => $assoc_args['notes'] ?? '',
		);
	}

	private function page_args( array $assoc_args ): array {
		if ( empty( $assoc_args['title'] ) ) {
			\WP_CLI::error( 'Use --title=<text> for the new page.' );
		}

		return array(
			'title'    => $assoc_args['title'],
			'status'   => $assoc_args['status'] ?? 'draft',
			'category' => $assoc_args['category'] ?? 'pages',
			'role'     => $assoc_args['role'] ?? 'other',
			'notes'    => $assoc_args['notes'] ?? '',
		);
	}

	private function relation_args( array $assoc_args ): array {
		foreach ( array( 'source', 'relation', 'target' ) as $required ) {
			if ( empty( $assoc_args[ $required ] ) ) {
				\WP_CLI::error( 'Use --source=<id>, --relation=<type> and --target=<id>.' );
			}
		}

		return array(
			'id'       => $assoc_args['id'] ?? '',
			'source'   => $assoc_args['source'],
			'relation' => $assoc_args['relation'],
			'target'   => $assoc_args['target'],
			'provider' => $assoc_args['provider'] ?? 'manual',
			'state'    => $assoc_args['state'] ?? 'needs_review',
			'notes'    => $assoc_args['notes'] ?? '',
		);
	}

	private function suggestion_args( array $assoc_args ): array {
		if ( empty( $assoc_args['label'] ) ) {
			\WP_CLI::error( 'Use --label=<text> for the suggestion.' );
		}

		return array(
			'id'       => $assoc_args['id'] ?? '',
			'label'    => $assoc_args['label'],
			'type'     => $assoc_args['type'] ?? 'relation',
			'provider' => $assoc_args['provider'] ?? 'manual',
			'state'    => $assoc_args['state'] ?? 'pending',
			'notes'    => $assoc_args['notes'] ?? '',
			'payload'  => array(
				'source'   => $assoc_args['source'] ?? '',
				'relation' => $assoc_args['relation'] ?? '',
				'target'   => $assoc_args['target'] ?? '',
			),
		);
	}

	private function project_id_arg( array $args, int $index ): int {
		$project_id = absint( $args[ $index ] ?? 0 );

		if ( ! $project_id || ProjectRepository::POST_TYPE !== get_post_type( $project_id ) ) {
			\WP_CLI::error( 'Portfolio project ID is required.' );
		}

		return $project_id;
	}

	private function require_value( $value, string $message ): void {
		if ( '' === trim( (string) $value ) ) {
			\WP_CLI::error( $message );
		}
	}

	private function success_payload( string $message, array $payload, array $assoc_args ): void {
		if ( 'json' === ( $assoc_args['format'] ?? '' ) ) {
			$this->line_json( $payload, $assoc_args );
			return;
		}

		\WP_CLI::success( $message );
	}

	private function format_items( array $assoc_args, array $items, array $fields ): void {
		\WP_CLI\Utils\format_items( $assoc_args['format'] ?? 'table', $items, $fields );
	}

	private function line_json( array $payload, array $assoc_args ): void {
		if ( 'table' === ( $assoc_args['format'] ?? '' ) ) {
			$this->format_items( $assoc_args, array( $payload ), array_keys( $payload ) );
			return;
		}

		\WP_CLI::line( wp_json_encode( $payload ) );
	}
}
