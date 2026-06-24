<?php
/**
 * Portfolio Workbench admin-post actions.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench\Admin;

use GuilhermePortfolio\Projects\ProjectRepository;
use GuilhermePortfolio\Workbench\ItemStore;
use GuilhermePortfolio\Workbench\RelationStore;
use GuilhermePortfolio\Workbench\SuggestionStore;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class AdminActions {

	public const NONCE_ACTION = 'gp_workbench_action';
	public const NONCE_NAME = 'gp_workbench_nonce';

	private ItemStore $items;
	private RelationStore $relations;
	private SuggestionStore $suggestions;

	public function __construct( ItemStore $items, RelationStore $relations, SuggestionStore $suggestions ) {
		$this->items       = $items;
		$this->relations   = $relations;
		$this->suggestions = $suggestions;
	}

	public function init_hooks(): void {
		add_action( 'admin_post_gp_workbench_attach_item', array( $this, 'attach_item' ) );
		add_action( 'admin_post_gp_workbench_detach_item', array( $this, 'detach_item' ) );
		add_action( 'admin_post_gp_workbench_add_relation', array( $this, 'add_relation' ) );
		add_action( 'admin_post_gp_workbench_update_relation', array( $this, 'update_relation' ) );
		add_action( 'admin_post_gp_workbench_remove_relation', array( $this, 'remove_relation' ) );
		add_action( 'admin_post_gp_workbench_add_suggestion', array( $this, 'add_suggestion' ) );
		add_action( 'admin_post_gp_workbench_mark_suggestion', array( $this, 'mark_suggestion' ) );
		add_action( 'admin_post_gp_workbench_ignore_suggestion', array( $this, 'ignore_suggestion' ) );
	}

	public function attach_item(): void {
		$project_id = $this->project_id();
		$raw        = $this->posted_array( 'gp_workbench_item' );

		$this->items->attach( $project_id, $raw );
		$this->redirect( $project_id, 'item_attached' );
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

		$this->suggestions->set_state( $project_id, $suggestion_id, $state );
		$this->redirect( $project_id, $notice );
	}

	private function project_id(): int {
		$this->assert_permission();
		check_admin_referer( self::NONCE_ACTION, self::NONCE_NAME );

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

	private function posted_array( string $key ): array {
		return isset( $_POST[ $key ] ) && is_array( $_POST[ $key ] ) ? wp_unslash( $_POST[ $key ] ) : array();
	}

	private function posted_text( string $key ): string {
		return isset( $_POST[ $key ] ) ? sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) : '';
	}

	private function redirect( int $project_id, string $notice ): void {
		wp_safe_redirect(
			add_query_arg(
				array(
					'page'                => AdminPage::MENU_SLUG,
					'project'             => $project_id,
					'gp_workbench_notice' => $notice,
				),
				admin_url( 'themes.php' )
			)
		);
		exit;
	}
}
