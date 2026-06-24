<?php
/**
 * Portfolio Workbench admin-post actions.
 *
 * @package GuilhermePortfolio
 */
namespace GuilhermePortfolio\Workbench\Admin;

use GuilhermePortfolio\Projects\ProjectRepository;
use GuilhermePortfolio\Workbench\Context;
use GuilhermePortfolio\Workbench\ContextResolver;
use GuilhermePortfolio\Workbench\ContextStorage;
use GuilhermePortfolio\Workbench\FrontPageService;
use GuilhermePortfolio\Workbench\ItemStore;
use GuilhermePortfolio\Workbench\PageCreator;
use GuilhermePortfolio\Workbench\RelationStore;
use GuilhermePortfolio\Workbench\SuggestionReviewer;
use GuilhermePortfolio\Workbench\SuggestionStore;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class AdminActions {

	public const NONCE_ACTION = 'gp_workbench_action';
	public const NONCE_NAME = 'gp_workbench_nonce';

	private ProjectRepository $projects;
	private ContextResolver $contexts;
	private ContextStorage $storage;
	private FrontPageService $frontpages;
	private ItemStore $items;
	private PageCreator $pages;
	private RelationStore $relations;
	private SuggestionReviewer $reviewer;
	private SuggestionStore $suggestions;

	public function __construct(
		ProjectRepository $projects,
		ContextResolver $contexts,
		ContextStorage $storage,
		FrontPageService $frontpages,
		ItemStore $items,
		PageCreator $pages,
		RelationStore $relations,
		SuggestionReviewer $reviewer,
		SuggestionStore $suggestions
	) {
		$this->projects    = $projects;
		$this->contexts    = $contexts;
		$this->storage     = $storage;
		$this->frontpages  = $frontpages;
		$this->items       = $items;
		$this->pages       = $pages;
		$this->relations   = $relations;
		$this->reviewer    = $reviewer;
		$this->suggestions = $suggestions;
	}

	public function init_hooks(): void {
		add_action( 'admin_post_gp_workbench_create_project', array( $this, 'create_project' ) );
		add_action( 'admin_post_gp_workbench_update_project', array( $this, 'update_project' ) );
		add_action( 'admin_post_gp_workbench_update_context', array( $this, 'update_context' ) );
		add_action( 'admin_post_gp_workbench_attach_item', array( $this, 'attach_item' ) );
		add_action( 'admin_post_gp_workbench_create_page', array( $this, 'create_page' ) );
		add_action( 'admin_post_gp_workbench_materialize_page', array( $this, 'materialize_page' ) );
		add_action( 'admin_post_gp_workbench_set_frontpage', array( $this, 'set_frontpage' ) );
		add_action( 'admin_post_gp_workbench_set_posts_page', array( $this, 'set_posts_page' ) );
		add_action( 'admin_post_gp_workbench_detach_item', array( $this, 'detach_item' ) );
		add_action( 'admin_post_gp_workbench_add_relation', array( $this, 'add_relation' ) );
		add_action( 'admin_post_gp_workbench_update_relation', array( $this, 'update_relation' ) );
		add_action( 'admin_post_gp_workbench_remove_relation', array( $this, 'remove_relation' ) );
		add_action( 'admin_post_gp_workbench_add_suggestion', array( $this, 'add_suggestion' ) );
		add_action( 'admin_post_gp_workbench_mark_suggestion', array( $this, 'mark_suggestion' ) );
		add_action( 'admin_post_gp_workbench_ignore_suggestion', array( $this, 'ignore_suggestion' ) );
	}

	public function create_project(): void {
		AdminActionRequest::assert_action();
		$raw   = AdminActionRequest::posted_array( 'gp_workbench_project' );
		$title = sanitize_text_field( $raw['title'] ?? '' );

		if ( '' === $title ) {
			$this->redirect_context_id( Context::ROOT_ID, 'project_create_failed' );
		}

		$project_id = wp_insert_post(
			array(
				'post_type'   => ProjectRepository::POST_TYPE,
				'post_title'  => $title,
				'post_status' => AdminActionRequest::status( $raw['status'] ?? 'draft' ),
			),
			true
		);

		if ( is_wp_error( $project_id ) ) {
			$this->redirect_context_id( Context::ROOT_ID, 'project_create_failed' );
		}

		$this->projects->save_config( (int) $project_id, $raw );
		$this->redirect_context_id( Context::project_id( (int) $project_id ), 'project_created' );
	}

	public function update_project(): void {
		$this->update_context();
	}

	public function update_context(): void {
		$context = $this->context();
		$raw     = AdminActionRequest::posted_array( 'gp_workbench_context' );

		if ( $context->is_project() ) {
			$this->update_project_post( $context, $raw );
		}

		$this->storage->save_config( $context, $raw );
		$this->redirect_context( $context, 'context_updated' );
	}

	public function attach_item(): void {
		$context = $this->context();
		$raw     = AdminActionRequest::posted_array( 'gp_workbench_item' );

		$this->items->attach_to_context( $context, $raw );
		$this->redirect_context( $context, 'item_attached' );
	}

	public function create_page(): void {
		$context = $this->context();
		$raw     = AdminActionRequest::posted_array( 'gp_workbench_page' );

		try {
			$page = $this->pages->create_for_context( $context, $raw );
			$this->apply_page_flags( (int) $page['post_id'], $raw );
		} catch ( \Throwable $error ) {
			$this->redirect_context( $context, 'page_create_failed' );
		}

		$this->redirect_context( $context, 'page_created' );
	}

	public function materialize_page(): void {
		$context       = $this->context();
		$definition_id = AdminActionRequest::posted_text( 'definition_id' );

		try {
			$page = $this->pages->materialize_for_context( $context, $definition_id );
			$this->apply_page_flags( (int) $page['post_id'], $page['definition'] );
		} catch ( \Throwable $error ) {
			$this->redirect_context( $context, 'page_materialize_failed' );
		}

		$this->redirect_context( $context, 'page_materialized' );
	}

	public function set_frontpage(): void {
		$context = $this->context();

		try {
			$this->frontpages->set_front_page( absint( AdminActionRequest::posted_text( 'page_id' ) ) );
		} catch ( \Throwable $error ) {
			$this->redirect_context( $context, 'frontpage_failed' );
		}

		$this->redirect_context_id( Context::ROOT_ID, 'frontpage_updated' );
	}

	public function set_posts_page(): void {
		$context = $this->context();

		try {
			$this->frontpages->set_posts_page( absint( AdminActionRequest::posted_text( 'page_id' ) ) );
		} catch ( \Throwable $error ) {
			$this->redirect_context( $context, 'posts_page_failed' );
		}

		$this->redirect_context( $context, 'posts_page_updated' );
	}

	public function detach_item(): void {
		$context = $this->context();
		$item_id = AdminActionRequest::posted_text( 'item_id' );

		$this->items->detach_from_context( $context, $item_id );
		$this->redirect_context( $context, 'item_detached' );
	}

	public function add_relation(): void {
		$context = $this->context();
		$raw     = AdminActionRequest::posted_array( 'gp_workbench_relation' );

		$this->relations->add_to_context( $context, $raw );
		$this->redirect_context( $context, 'relation_stored' );
	}

	public function update_relation(): void {
		$context     = $this->context();
		$relation_id = AdminActionRequest::posted_text( 'relation_id' );
		$state       = AdminActionRequest::posted_text( 'state' );

		$this->relations->update_context_state( $context, $relation_id, $state );
		$this->redirect_context( $context, 'relation_updated' );
	}

	public function remove_relation(): void {
		$context     = $this->context();
		$relation_id = AdminActionRequest::posted_text( 'relation_id' );

		$this->relations->remove_from_context( $context, $relation_id );
		$this->redirect_context( $context, 'relation_removed' );
	}

	public function add_suggestion(): void {
		$context = $this->context();
		$raw     = AdminActionRequest::posted_array( 'gp_workbench_suggestion' );

		$this->suggestions->add_to_context( $context, $raw );
		$this->redirect_context( $context, 'suggestion_stored' );
	}

	public function mark_suggestion(): void {
		$this->set_suggestion_state( 'marked', 'suggestion_marked' );
	}

	public function ignore_suggestion(): void {
		$this->set_suggestion_state( 'ignored', 'suggestion_ignored' );
	}

	private function set_suggestion_state( string $state, string $notice ): void {
		$context       = $this->context();
		$suggestion_id = AdminActionRequest::posted_text( 'suggestion_id' );

		if ( 'marked' === $state ) {
			$this->reviewer->mark_in_context( $context, $suggestion_id );
		} else {
			$this->reviewer->ignore_in_context( $context, $suggestion_id );
		}

		$this->redirect_context( $context, $notice );
	}

	private function context(): Context {
		AdminActionRequest::assert_action();
		$context_id = AdminActionRequest::posted_text( 'context_id' );

		if ( '' === $context_id && isset( $_POST['project_id'] ) ) {
			$context_id = Context::project_id( absint( wp_unslash( $_POST['project_id'] ) ) );
		}

		try {
			$context = $this->contexts->resolve( $context_id );
		} catch ( \InvalidArgumentException $error ) {
			wp_die( esc_html__( 'Workbench context is required.', 'guilherme-portfolio' ) );
		}

		if ( $context->is_project() && ! current_user_can( 'edit_post', $context->object_id() ) ) {
			wp_die( esc_html__( 'You cannot edit this portfolio project.', 'guilherme-portfolio' ) );
		}

		return $context;
	}

	private function redirect_context( Context $context, string $notice ): void {
		$this->redirect_context_id( $context->id(), $notice );
	}

	private function redirect_context_id( string $context_id, string $notice ): void {
		$args = array(
			'page'                => AdminPage::MENU_SLUG,
			'gp_workbench_notice' => $notice,
			'context'             => $context_id,
		);

		wp_safe_redirect( add_query_arg( $args, admin_url( 'themes.php' ) ) );
		exit;
	}

	private function update_project_post( Context $context, array $raw ): void {
		wp_update_post(
			array_filter(
				array(
					'ID'          => $context->object_id(),
					'post_title'  => sanitize_text_field( $raw['title'] ?? '' ),
					'post_status' => AdminActionRequest::status( $raw['status'] ?? 'draft' ),
				)
			)
		);
	}

	private function apply_page_flags( int $page_id, array $raw ): void {
		if ( ! empty( $raw['set_frontpage'] ) ) {
			$this->frontpages->set_front_page( $page_id );
		}

		if ( ! empty( $raw['set_posts_page'] ) ) {
			$this->frontpages->set_posts_page( $page_id );
		}
	}
}
