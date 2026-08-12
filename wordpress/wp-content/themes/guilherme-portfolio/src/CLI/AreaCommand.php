<?php
/**
 * WP-CLI commands for Portfolio Area Map.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\CLI;

use GuilhermePortfolio\Areas\AreaItemRepository;
use GuilhermePortfolio\Areas\AreaRepository;
use GuilhermePortfolio\Areas\DestinationResolver;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class AreaCommand {

	private AreaRepository $areas;
	private AreaItemRepository $items;
	private DestinationResolver $destinations;

	public function __construct( AreaRepository $areas, AreaItemRepository $items, DestinationResolver $destinations ) {
		$this->areas        = $areas;
		$this->items        = $items;
		$this->destinations = $destinations;
	}

	public function init_hooks(): void {
		if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
			return;
		}

		\WP_CLI::add_command( 'gp area', array( $this, 'area' ) );
		\WP_CLI::add_command( 'gp area-item', array( $this, 'area_item' ) );
	}

	/**
	 * Manage portfolio areas.
	 */
	public function area( array $args, array $assoc_args ): void {
		$action = $args[0] ?? 'list';

		try {
			if ( 'list' === $action ) {
				$this->format_items( $assoc_args, $this->areas->all( $this->area_view_arg( $assoc_args ) ), array( 'id', 'title', 'slug', 'status', 'post_status', 'order' ) );
				return;
			}

			if ( 'get' === $action ) {
				$this->line_json( $this->areas->require_area( $args[1] ?? 0 ), $assoc_args );
				return;
			}

			if ( 'create' === $action ) {
				$area = $this->areas->create( $this->area_args( $args[1] ?? '', $assoc_args ) );
				$this->success_payload( 'Portfolio area created.', $area, $assoc_args );
				return;
			}

			if ( 'update' === $action ) {
				$area = $this->areas->update( $args[1] ?? 0, $this->assoc_to_area_args( $assoc_args ) );
				$this->success_payload( 'Portfolio area updated.', $area, $assoc_args );
				return;
			}

			if ( 'archive' === $action ) {
				$this->areas->archive( $args[1] ?? 0 );
				\WP_CLI::success( 'Portfolio area archived.' );
				return;
			}

			if ( 'restore' === $action ) {
				$area = $this->areas->restore( $args[1] ?? 0 );
				$this->success_payload( 'Portfolio area restored.', $area, $assoc_args );
				return;
			}

			if ( 'delete' === $action ) {
				$this->areas->delete( $args[1] ?? 0, ! empty( $assoc_args['force'] ) );
				\WP_CLI::success( 'Portfolio area removed.' );
				return;
			}
		} catch ( \Throwable $error ) {
			\WP_CLI::error( $error->getMessage() );
		}

		\WP_CLI::error( 'Use one of: list, get, create, update, archive, restore, delete.' );
	}

	/**
	 * Manage items attached to a portfolio area.
	 */
	public function area_item( array $args, array $assoc_args ): void {
		$action = $args[0] ?? 'list';
		$area   = $args[1] ?? 0;

		try {
			if ( 'list' === $action ) {
				$this->format_items( $assoc_args, $this->items->all( $area ), array( 'id', 'label', 'type', 'category', 'role', 'object_type', 'object_id' ) );
				return;
			}

			if ( 'attach' === $action ) {
				$item = $this->items->attach( $area, $this->item_args( $assoc_args ) );
				$this->success_payload( 'Area item attached.', $item, $assoc_args );
				return;
			}

			if ( 'update' === $action ) {
				$item = $this->items->update( $area, $args[2] ?? '', $this->item_args( $assoc_args, false ) );
				$this->success_payload( 'Area item updated.', $item, $assoc_args );
				return;
			}

			if ( 'detach' === $action ) {
				$this->items->detach( $area, $args[2] ?? '' );
				\WP_CLI::success( 'Area item detached.' );
				return;
			}

			if ( 'links' === $action ) {
				$this->line_json( $this->item_links( $area, $args[2] ?? '' ), $assoc_args );
				return;
			}
		} catch ( \Throwable $error ) {
			\WP_CLI::error( $error->getMessage() );
		}

		\WP_CLI::error( 'Use one of: list, attach, update, detach, links.' );
	}

	private function area_args( string $title, array $assoc_args ): array {
		return array(
			'title'  => $title,
			'slug'   => $assoc_args['slug'] ?? '',
			'status' => $assoc_args['status'] ?? 'active',
			'notes'  => $assoc_args['notes'] ?? '',
			'order'  => $assoc_args['order'] ?? 0,
		);
	}

	private function assoc_to_area_args( array $assoc_args ): array {
		return array_intersect_key(
			$assoc_args,
			array_flip( array( 'title', 'slug', 'status', 'notes', 'order' ) )
		);
	}

	private function area_view_arg( array $assoc_args ): string {
		if ( ! empty( $assoc_args['archived'] ) ) {
			return 'archived';
		}

		if ( ! empty( $assoc_args['all'] ) ) {
			return 'all';
		}

		return 'active';
	}

	private function item_args( array $assoc_args, bool $require_label = true ): array {
		if ( $require_label && empty( $assoc_args['label'] ) ) {
			\WP_CLI::error( 'Use --label=<text> for the item.' );
		}

		return array(
			'id'          => $assoc_args['id'] ?? '',
			'type'        => $assoc_args['type'] ?? 'custom',
			'category'    => $assoc_args['category'] ?? '',
			'role'        => $assoc_args['role'] ?? 'other',
			'label'       => $assoc_args['label'] ?? '',
			'object_type' => $assoc_args['object-type'] ?? '',
			'object_id'   => $assoc_args['object-id'] ?? '',
			'admin_url'   => $assoc_args['admin-url'] ?? '',
			'notes'       => $assoc_args['notes'] ?? '',
			'order'       => $assoc_args['order'] ?? 0,
		);
	}

	private function item_links( $area, string $item_id ): array {
		foreach ( $this->items->all( $area ) as $item ) {
			if ( $item['id'] === sanitize_key( $item_id ) ) {
				return array(
					'item'  => $item,
					'links' => $this->destinations->links( $item ),
				);
			}
		}

		throw new \InvalidArgumentException( 'Area item not found.' );
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
