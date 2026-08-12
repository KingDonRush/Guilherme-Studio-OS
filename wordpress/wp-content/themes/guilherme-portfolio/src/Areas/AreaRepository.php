<?php
/**
 * Portfolio Area records.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Areas;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class AreaRepository {

	public const POST_TYPE = 'gp_area';

	/**
	 * @return array<int,array<string,mixed>>
	 */
	public function all( string $view = 'active' ): array {
		$posts = get_posts(
			array(
				'post_type'      => self::POST_TYPE,
					'post_status'    => in_array( $view, array( 'archived', 'all' ), true )
						? array( 'publish', 'draft', 'private', 'pending', 'trash' )
						: array( 'publish', 'draft', 'private', 'pending' ),
				'posts_per_page' => 200,
				'orderby'        => array(
					'menu_order' => 'ASC',
					'title'      => 'ASC',
				),
				'no_found_rows'  => true,
			)
		);

		return array_values(
			array_filter(
				array_map( array( $this, 'payload' ), $posts ),
				static function ( array $area ) use ( $view ): bool {
					$is_archived = 'archived' === $area['status'] || 'trash' === $area['post_status'];

					if ( 'archived' === $view ) {
						return $is_archived;
					}

					if ( 'all' === $view ) {
						return true;
					}

					return ! $is_archived;
				}
			)
		);
	}

	public function archived_count(): int {
		return count( $this->all( 'archived' ) );
	}

	public function get( $area ): ?array {
		$post = $this->find_post( $area );
		return $post ? $this->payload( $post ) : null;
	}

	public function create( array $raw ): array {
		$title = AreaSanitizer::label( $raw['title'] ?? '' );

		if ( '' === $title ) {
			throw new \InvalidArgumentException( __( 'Area title is required.', 'guilherme-portfolio' ) );
		}

		$post_id = wp_insert_post(
			array(
				'post_type'   => self::POST_TYPE,
				'post_title'  => $title,
				'post_name'   => AreaSanitizer::key( $raw['slug'] ?? '' ),
				'post_status' => 'publish',
				'menu_order'  => AreaSanitizer::order( $raw['order'] ?? 0 ),
			),
			true
		);

		if ( is_wp_error( $post_id ) ) {
			throw new \RuntimeException( $post_id->get_error_message() );
		}

		$this->save_meta( $post_id, $raw );
		return $this->get( $post_id );
	}

	public function update( $area, array $raw ): array {
		$current = $this->require_area( $area );
		$post    = array( 'ID' => $current['id'] );

		if ( array_key_exists( 'title', $raw ) ) {
			$title = AreaSanitizer::label( $raw['title'] );

			if ( '' !== $title ) {
				$post['post_title'] = $title;
			}
		}

		if ( array_key_exists( 'slug', $raw ) ) {
			$post['post_name'] = AreaSanitizer::key( $raw['slug'] );
		}

		if ( array_key_exists( 'order', $raw ) ) {
			$post['menu_order'] = AreaSanitizer::order( $raw['order'] );
		}

		$result = wp_update_post( $post, true );

		if ( is_wp_error( $result ) ) {
			throw new \RuntimeException( $result->get_error_message() );
		}

		$this->save_meta( $current['id'], $raw );
		return $this->get( $current['id'] );
	}

	public function archive( $area ): void {
		$current = $this->require_area( $area );
		update_post_meta( $current['id'], AreaMeta::STATUS, 'archived' );
	}

	public function restore( $area ): array {
		$current = $this->require_area( $area );

		if ( 'trash' === $current['post_status'] ) {
			$result = wp_untrash_post( $current['id'] );

			if ( ! $result ) {
				throw new \RuntimeException( __( 'Could not restore the area.', 'guilherme-portfolio' ) );
			}
		}

		update_post_meta( $current['id'], AreaMeta::STATUS, 'active' );
		return $this->get( $current['id'] );
	}

	public function delete( $area, bool $force = false ): void {
		$current = $this->require_area( $area );
		$result  = $force ? wp_delete_post( $current['id'], true ) : wp_trash_post( $current['id'] );

		if ( ! $result ) {
			throw new \RuntimeException( __( 'Could not remove the area.', 'guilherme-portfolio' ) );
		}
	}

	public function require_area( $area ): array {
		$payload = $this->get( $area );

		if ( ! $payload ) {
			throw new \InvalidArgumentException( __( 'Portfolio area not found.', 'guilherme-portfolio' ) );
		}

		return $payload;
	}

	private function find_post( $area ): ?\WP_Post {
		if ( is_numeric( $area ) ) {
			$post = get_post( absint( $area ) );
			return $post instanceof \WP_Post && self::POST_TYPE === $post->post_type ? $post : null;
		}

		$post = get_page_by_path( sanitize_title( (string) $area ), OBJECT, self::POST_TYPE );
		return $post instanceof \WP_Post ? $post : null;
	}

	private function payload( \WP_Post $post ): array {
		$status = AreaSanitizer::status( get_post_meta( $post->ID, AreaMeta::STATUS, true ) );

		if ( 'trash' === $post->post_status ) {
			$status = 'archived';
		}

		return array(
			'id'          => $post->ID,
			'title'       => get_the_title( $post ),
			'slug'        => $post->post_name,
			'post_status' => $post->post_status,
			'status'      => $status,
			'notes'       => get_post_meta( $post->ID, AreaMeta::NOTES, true ),
			'order'       => (int) $post->menu_order,
			'created_at'  => get_post_time( DATE_ATOM, true, $post ),
			'updated_at'  => get_post_modified_time( DATE_ATOM, true, $post ),
		);
	}

	private function save_meta( int $post_id, array $raw ): void {
		if ( array_key_exists( 'status', $raw ) ) {
			update_post_meta( $post_id, AreaMeta::STATUS, AreaSanitizer::status( $raw['status'] ) );
		}

		if ( array_key_exists( 'notes', $raw ) ) {
			update_post_meta( $post_id, AreaMeta::NOTES, AreaSanitizer::notes( $raw['notes'] ) );
		}
	}
}
