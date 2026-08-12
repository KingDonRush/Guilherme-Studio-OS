<?php
/**
 * Admin-post actions for Portfolio Area Map.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Areas\Admin;

use GuilhermePortfolio\Areas\AreaItemRepository;
use GuilhermePortfolio\Areas\AreaRepository;
use GuilhermePortfolio\Areas\AreaUrl;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class AreaMapActions {

	public const NONCE_ACTION = 'gp_area_map_action';
	public const NONCE_NAME   = 'gp_area_map_nonce';

	private AreaRepository $areas;
	private AreaItemRepository $items;

	public function __construct( AreaRepository $areas, AreaItemRepository $items ) {
		$this->areas = $areas;
		$this->items = $items;
	}

	public function init_hooks(): void {
		add_action( 'admin_post_gp_area_create', array( $this, 'create_area' ) );
		add_action( 'admin_post_gp_area_update', array( $this, 'update_area' ) );
		add_action( 'admin_post_gp_area_delete', array( $this, 'delete_area' ) );
		add_action( 'admin_post_gp_area_restore', array( $this, 'restore_area' ) );
		add_action( 'admin_post_gp_area_item_attach', array( $this, 'attach_item' ) );
		add_action( 'admin_post_gp_area_item_update', array( $this, 'update_item' ) );
		add_action( 'admin_post_gp_area_item_detach', array( $this, 'detach_item' ) );
	}

	public function create_area(): void {
		$this->guard();
		$area = $this->areas->create( $this->posted_array( 'gp_area' ) );
		$this->redirect( (int) $area['id'], 'area-created' );
	}

	public function update_area(): void {
		$this->guard();
		$area = $this->areas->update( $this->posted_area_id(), $this->posted_array( 'gp_area' ) );
		$this->redirect( (int) $area['id'], 'area-saved', 'archived' === $area['status'] ? 'archived' : 'active' );
	}

	public function delete_area(): void {
		$this->guard();
		$area_id = $this->posted_area_id();
		$this->areas->archive( $area_id );
		$this->redirect( $area_id, 'area-archived', 'archived' );
	}

	public function restore_area(): void {
		$this->guard();
		$area = $this->areas->restore( $this->posted_area_id() );
		$this->redirect( (int) $area['id'], 'area-restored' );
	}

	public function attach_item(): void {
		$this->guard();
		$area_id = $this->posted_area_id();
		$this->items->attach( $area_id, $this->posted_array( 'gp_area_item' ) );
		$this->redirect( $area_id, 'item-attached' );
	}

	public function update_item(): void {
		$this->guard();
		$area_id = $this->posted_area_id();
		$item_id = isset( $_POST['item_id'] ) ? sanitize_key( wp_unslash( $_POST['item_id'] ) ) : '';
		$this->items->update( $area_id, $item_id, $this->posted_array( 'gp_area_item' ) );
		$this->redirect( $area_id, 'item-saved' );
	}

	public function detach_item(): void {
		$this->guard();
		$area_id = $this->posted_area_id();
		$item_id = isset( $_POST['item_id'] ) ? sanitize_key( wp_unslash( $_POST['item_id'] ) ) : '';
		$this->items->detach( $area_id, $item_id );
		$this->redirect( $area_id, 'item-detached' );
	}

	private function guard(): void {
		if ( ! current_user_can( AreaMapPage::CAPABILITY ) ) {
			wp_die( esc_html__( 'You do not have permission to update this map.', 'guilherme-portfolio' ) );
		}

		if ( ! isset( $_POST[ self::NONCE_NAME ] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST[ self::NONCE_NAME ] ) ), self::NONCE_ACTION ) ) {
			wp_die( esc_html__( 'Invalid area map request.', 'guilherme-portfolio' ) );
		}
	}

	private function posted_area_id(): int {
		return isset( $_POST['area'] ) ? absint( $_POST['area'] ) : 0;
	}

	private function posted_array( string $key ): array {
		$value = isset( $_POST[ $key ] ) && is_array( $_POST[ $key ] ) ? wp_unslash( $_POST[ $key ] ) : array();
		return is_array( $value ) ? $value : array();
	}

	private function redirect( int $area_id, string $notice, string $view = 'active' ): void {
		$args = array(
			'page'           => AreaMapPage::MENU_SLUG,
			'gp_area_notice' => $notice,
		);

		if ( 'archived' === $view ) {
			$args['area_status'] = 'archived';
		}

		if ( $area_id ) {
			$args['area'] = $area_id;
		}

		wp_safe_redirect( add_query_arg( $args, AreaUrl::admin( 'admin.php' ) ) );
		exit;
	}
}
