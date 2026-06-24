<?php
/**
 * Portfolio Workbench admin-post actions.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench\Admin;

use GuilhermePortfolio\Projects\ProjectRepository;
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
	private ItemStore $items;
	private PageCreator $pages;
	private RelationStore $relations;
	private SuggestionReviewer $reviewer;
	private SuggestionStore $suggestions;

	public function __construct(
		ProjectRepository $projects,
		ItemStore $items,
		PageCreator $pages,
		RelationStore $relations,
		SuggestionReviewer $reviewer,
		SuggestionStore $suggestions
	) {
		$this->projects    = $projects;
		$this->items       = $items;
		$this->pages       = $pages;
		$this->relations   = $relations;
		$this->reviewer    = $reviewer;
		$this->suggestions = $suggestions;
	}

	public function init_hooks(): void {
		add_action( 'admin_post_gp_workbench_create_project', array( $this, 'create_project' ) );
		add_action( 'admin_post_gp_workbench_update_project', array( $this, 'update_project' ) );
		add_action( 'admin_post_gp_workbench_attach_item', array( $this, 'attach_item' ) );
		add_action( 'admin_post_gp_workbench_create_page', array( $this, 'create_page' ) );
		add_action( 'admin_post_gp_workbench_detach_item', array( $this, 'detach_item' ) );
		add_action( 'admin_post_gp_workbench_add_relation', array( $this, 'add_relation' ) );
		add_action( 'admin_post_gp_workbench_update_relation', array( $this, 'update_relation' ) );
		add_action( 'admin_post_gp_workbench_remove_relation', array( $this, 'remove_relation' ) );
		add_action( 'admin_post_gp_workbench_add_suggestion', array( $this, 'add_suggestion' ) );
		add_action( 'admin_post_gp_workbench_mark_suggestion', array( $this, 'mark_suggestion' ) );
		add_action( 'admin_post_gp_workbench_ignore_suggestion', array( $this, 'ignore_suggestion' ) );
	}

	public function create_project(): void {
		$this->assert_action();
		$raw   = $this->posted_array( 'gp_workbench_project' );
		$title = sanitize_text_field( $raw['title'] ?? '' );

		if ( '' === $title ) {
			$this->redirect( 0, 'project_create_failed' );
		}

		$project_id = wp_insert_post(
			array(
				'post_type'   => ProjectRepository::POST_TYPE,
				'post_title'  => $title,
				'post_status' => $this->status( $raw['status'] ?? 'draft' ),
			),
			true
		);

		if ( is_wp_error( $project_id ) ) {
			$this->redirect( 0, 'project_create_failed' );
		}

		$this->projects->save_config( (int) $project_id, $raw );
		$this->redirect( (int) $project_id, 'project_created' );
	}

	public function update_project(): void {
		$project_id = $this->project_id();
		$raw        = $this->posted_array( 'gp_workbench_project' );

		wp_update_post(
			array_filter(
				array(
					'ID'          => $project_id,
					'post_title'  => sanitize_text_field( $raw['title'] ?? '' ),
					'post_status' => $this->status( $raw['status'] ?? 'draft' ),
				)
			)
		);

		$this->projects->save_config( $project_id, $raw );
		$this->redirect( $project_id, 'project_updated' );
	}

	public function attach_item(): void {
		$project_id = $this->project_id();
		$raw        = $this->posted_array( 'gp_workbench_item' );

		$this->items->attach( $project_id, $raw );
		$this->redirect( $project_id, 'item_attached' );
	}

	public function create_page(): void {
		$project_id = $this->project_id();
		$raw        = $this->posted_array( 'gp_workbench_page' );

		try {
			$this->pages->create( $project_id, $raw );
		} catch ( \Throwable $error ) {
			$this->redirect( $project_id, 'page_create_failed' );
		}

		$this->redirect( $project_id, 'page_created' );
	}

	public function detach_item(): void {
		$project_id = $this->project_id();
		$item_id    = $this->posted_text( 'item_id' );

		$this->items->detach( $project_id, $item_id );
		$this->redirect( $project_id, 'item_detached' );
	}

	public function add_relation(): void {
		$project_id = $this->project_id();
		$raw        = $this->posted_array( 'gp_workbench_relation' );

		$this->relations->add( $project_id, $raw );
		$this->redirect( $project_id, 'relation_stored' );
	}

	public function update_relation(): void {
		$project_id  = $this->project_id();
		$relation_id = $this->posted_text( 'relation_id' );
		$state       = $this->posted_text( 'state' );

		$this->relations->update_state( $project_id, $relation_id, $state );
		$this->redirect( $project_id, 'relation_updated' );
	}

	public function remove_relation(): void {
		$project_id  = $this->project_id();
		$relation_id = $this->posted_text( 'relation_id' );

		$this->relations->remove( $project_id, $relation_id );
		$this->redirect( $project_id, 'relation_removed' );
	}

	public function add_suggestion(): void {
		$project_id = $this->project_id();
		$raw        = $this->posted_array( 'gp_workbench_suggestion' );

		$this->suggestions->add( $project_id, $raw );
		$this->redirect( $project_id, 'suggestion_stored' );
	}

	public function mark_suggestion(): void {
		$this->set_suggestion_state( 'marked', 'suggestion_marked' );
	}

	public function ignore_suggestion(): void {
		$this->set_suggestion_state( 'ignored', 'suggestion_ignored' );
	}

	private function set_suggestion_state( string $state, string $notice ): void {
		$project_id    = $this->project_id();
		$suggestion_id = $this->posted_text( 'suggestion_id' );

		if ( 'marked' === $state ) {
			$this->reviewer->mark( $project_id, $suggestion_id );
		} else {
			$this->reviewer->ignore( $project_id, $suggestion_id );
		}

		$this->redirect( $project_id, $notice );
	}

	private function project_id(): int {
		$this->assert_action();

		$project_id = isset( $_POST['project_id'] ) ? absint( wp_unslash( $_POST['project_id'] ) ) : 0;

		if ( ! $project_id || ProjectRepository::POST_TYPE !== get_post_type( $project_id ) ) {
			wp_die( esc_html__( 'Portfolio project ID is required.', 'guilherme-portfolio' ) );
		}

		if ( ! current_user_can( 'edit_post', $project_id ) ) {
			wp_die( esc_html__( 'You cannot edit this portfolio project.', 'guilherme-portfolio' ) );
		}

		return $project_id;
	}

	private function assert_permission(): void {
		if ( ! current_user_can( AdminPage::CAPABILITY ) ) {
			wp_die( esc_html__( 'You do not have permission to update this workbench.', 'guilherme-portfolio' ) );
		}
	}

	private function assert_action(): void {
		$this->assert_permission();
		check_admin_referer( self::NONCE_ACTION, self::NONCE_NAME );
	}

	private function posted_array( string $key ): array {
		return isset( $_POST[ $key ] ) && is_array( $_POST[ $key ] ) ? wp_unslash( $_POST[ $key ] ) : array();
	}

	private function posted_text( string $key ): string {
		return isset( $_POST[ $key ] ) ? sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) : '';
	}

	private function redirect( int $project_id, string $notice ): void {
		$args = array(
			'page'                => AdminPage::MENU_SLUG,
			'gp_workbench_notice' => $notice,
		);

		if ( $project_id ) {
			$args['project'] = $project_id;
		}

		wp_safe_redirect( add_query_arg( $args, admin_url( 'themes.php' ) ) );
		exit;
	}

	private function status( $status ): string {
		$status = sanitize_key( $status );

		return in_array( $status, array( 'draft', 'publish', 'private', 'pending' ), true ) ? $status : 'draft';
	}
}
