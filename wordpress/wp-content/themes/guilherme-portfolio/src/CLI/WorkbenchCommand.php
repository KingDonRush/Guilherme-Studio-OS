<?php
/**
 * WP-CLI commands for Portfolio Workbench records.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\CLI;

use GuilhermePortfolio\Workbench\CodePageRegistry;
use GuilhermePortfolio\Workbench\Context;
use GuilhermePortfolio\Workbench\ContextResolver;
use GuilhermePortfolio\Workbench\FrontPageService;
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

	private ContextResolver $contexts;
	private CodePageRegistry $code_pages;
	private FrontPageService $frontpages;
	private ItemStore $items;
	private PageCreator $pages;
	private RelationStore $relations;
	private SuggestionReviewer $reviewer;
	private SuggestionStore $suggestions;
	private TopologyService $topology;

	public function __construct(
		ContextResolver $contexts,
		CodePageRegistry $code_pages,
		FrontPageService $frontpages,
		ItemStore $items,
		PageCreator $pages,
		RelationStore $relations,
		SuggestionReviewer $reviewer,
		SuggestionStore $suggestions,
		TopologyService $topology
	) {
		$this->contexts    = $contexts;
		$this->code_pages  = $code_pages;
		$this->frontpages  = $frontpages;
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
		\WP_CLI::add_command( 'gp frontpage', array( $this, 'frontpage' ) );
		\WP_CLI::add_command( 'gp code-page', array( $this, 'code_page' ) );
	}

	public function item( array $args, array $assoc_args ): void {
		$action  = $args[0] ?? 'list';
		$context = $this->context_arg( $args, $assoc_args, 1 );

		if ( 'list' === $action ) {
			WorkbenchCommandSupport::format_items( $assoc_args, $this->items->all_for_context( $context ), array( 'id', 'type', 'label', 'category', 'role', 'provider', 'state' ) );
			return;
		}

		if ( 'attach' === $action ) {
			$item = $this->items->attach_to_context( $context, WorkbenchCommandSupport::item_args( $assoc_args ) );
			WorkbenchCommandSupport::success_payload( 'Workbench item attached.', $item, $assoc_args );
			return;
		}

		if ( 'create-page' === $action ) {
			try {
				$page = $this->pages->create_for_context( $context, WorkbenchCommandSupport::page_args( $assoc_args ) );
				$this->apply_page_flags( (int) $page['post_id'], $assoc_args );
			} catch ( \Throwable $error ) {
				\WP_CLI::error( $error->getMessage() );
			}

			WorkbenchCommandSupport::success_payload( 'Workbench page created and attached.', $page, $assoc_args );
			return;
		}

		if ( 'detach' === $action ) {
			$item_id = WorkbenchCommandSupport::record_arg( $args, $assoc_args, 'Workbench item ID is required.' );

			if ( ! $this->items->detach_from_context( $context, $item_id ) ) {
				\WP_CLI::error( 'Workbench item not found.' );
			}

			\WP_CLI::success( 'Workbench item detached.' );
			return;
		}

		\WP_CLI::error( 'Use one of: list, attach, create-page, detach.' );
	}

	public function relation( array $args, array $assoc_args ): void {
		$action  = $args[0] ?? 'list';
		$context = $this->context_arg( $args, $assoc_args, 1 );

		if ( 'list' === $action ) {
			WorkbenchCommandSupport::format_items( $assoc_args, $this->relations->all_for_context( $context ), array( 'id', 'source', 'relation', 'target', 'provider', 'state' ) );
			return;
		}

		if ( 'add' === $action ) {
			$relation = $this->relations->add_to_context( $context, WorkbenchCommandSupport::relation_args( $assoc_args ) );
			WorkbenchCommandSupport::success_payload( 'Workbench relation stored.', $relation, $assoc_args );
			return;
		}

		if ( 'update' === $action ) {
			$relation_id = WorkbenchCommandSupport::record_arg( $args, $assoc_args, 'Workbench relation ID is required.' );
			$relation    = $this->relations->update_context_state( $context, $relation_id, $assoc_args['state'] ?? 'needs_review' );

			if ( ! $relation ) {
				\WP_CLI::error( 'Workbench relation not found.' );
			}

			WorkbenchCommandSupport::success_payload( 'Workbench relation updated.', $relation, $assoc_args );
			return;
		}

		if ( 'remove' === $action ) {
			$relation_id = WorkbenchCommandSupport::record_arg( $args, $assoc_args, 'Workbench relation ID is required.' );

			if ( ! $this->relations->remove_from_context( $context, $relation_id ) ) {
				\WP_CLI::error( 'Workbench relation not found.' );
			}

			\WP_CLI::success( 'Workbench relation removed.' );
			return;
		}

		\WP_CLI::error( 'Use one of: list, add, update, remove.' );
	}

	public function suggestion( array $args, array $assoc_args ): void {
		$action  = $args[0] ?? 'list';
		$context = $this->context_arg( $args, $assoc_args, 1 );

		if ( 'list' === $action ) {
			WorkbenchCommandSupport::format_items( $assoc_args, $this->suggestions->all_for_context( $context ), array( 'id', 'label', 'type', 'provider', 'state' ) );
			return;
		}

		if ( 'add' === $action ) {
			$suggestion = $this->suggestions->add_to_context( $context, WorkbenchCommandSupport::suggestion_args( $assoc_args ) );
			WorkbenchCommandSupport::success_payload( 'Workbench suggestion stored.', $suggestion, $assoc_args );
			return;
		}

		if ( in_array( $action, array( 'mark', 'ignore' ), true ) ) {
			$suggestion_id = WorkbenchCommandSupport::record_arg( $args, $assoc_args, 'Workbench suggestion ID is required.' );
			$suggestion = 'mark' === $action
				? $this->reviewer->mark_in_context( $context, $suggestion_id )
				: $this->reviewer->ignore_in_context( $context, $suggestion_id );

			if ( ! $suggestion ) {
				\WP_CLI::error( 'Workbench suggestion not found.' );
			}

			WorkbenchCommandSupport::success_payload( 'Workbench suggestion updated.', $suggestion, $assoc_args );
			return;
		}

		\WP_CLI::error( 'Use one of: list, add, mark, ignore.' );
	}

	public function topology( array $args, array $assoc_args ): void {
		$context_id = $assoc_args['context'] ?? ( $args[0] ?? Context::ROOT_ID );
		WorkbenchCommandSupport::line_json( $this->topology->context( (string) $context_id ), $assoc_args );
	}

	public function frontpage( array $args, array $assoc_args ): void {
		$action  = $args[0] ?? 'get';
		$page_id = absint( $args[1] ?? 0 );

		if ( 'get' === $action ) {
			WorkbenchCommandSupport::line_json(
				array(
					'show_on_front' => get_option( 'show_on_front' ),
					'front_page_id' => (int) get_option( 'page_on_front' ),
					'posts_page_id' => (int) get_option( 'page_for_posts' ),
				),
				$assoc_args
			);
			return;
		}

		if ( ! $page_id ) {
			\WP_CLI::error( 'A WordPress page ID is required.' );
		}

		try {
			if ( 'set' === $action ) {
				$this->frontpages->set_front_page( $page_id );
				\WP_CLI::success( 'Portfolio front page updated.' );
				return;
			}

			if ( 'posts-page' === $action ) {
				$this->frontpages->set_posts_page( $page_id );
				\WP_CLI::success( 'Portfolio posts page updated.' );
				return;
			}
		} catch ( \Throwable $error ) {
			\WP_CLI::error( $error->getMessage() );
		}

		\WP_CLI::error( 'Use one of: get, set, posts-page.' );
	}

	public function code_page( array $args, array $assoc_args ): void {
		$action = $args[0] ?? 'list';

		if ( 'list' === $action ) {
			WorkbenchCommandSupport::format_items( $assoc_args, WorkbenchCommandSupport::code_page_rows( $this->code_pages ), array( 'id', 'title', 'slug', 'scope', 'role' ) );
			return;
		}

		if ( 'materialize' === $action ) {
			$context       = $this->context_arg( $args, $assoc_args, 1 );
			$definition_id = WorkbenchCommandSupport::record_arg( $args, $assoc_args, 'Coded page definition ID is required.' );

			try {
				$page = $this->pages->materialize_for_context( $context, $definition_id );
				$this->apply_page_flags( (int) $page['post_id'], $page['definition'] );
			} catch ( \Throwable $error ) {
				\WP_CLI::error( $error->getMessage() );
			}

			WorkbenchCommandSupport::success_payload( 'Coded page materialized.', $page, $assoc_args );
			return;
		}

		\WP_CLI::error( 'Use one of: list, materialize.' );
	}

	private function context_arg( array $args, array $assoc_args, int $index ): Context {
		$context_id = (string) ( $assoc_args['context'] ?? ( $args[ $index ] ?? Context::ROOT_ID ) );

		try {
			return $this->contexts->resolve( $context_id );
		} catch ( \InvalidArgumentException $error ) {
			\WP_CLI::error( $error->getMessage() );
		}
	}

	private function apply_page_flags( int $page_id, array $assoc_args ): void {
		if ( ! empty( $assoc_args['set-frontpage'] ) ) {
			$this->frontpages->set_front_page( $page_id );
		}

		if ( ! empty( $assoc_args['set-posts-page'] ) ) {
			$this->frontpages->set_posts_page( $page_id );
		}
	}
}
