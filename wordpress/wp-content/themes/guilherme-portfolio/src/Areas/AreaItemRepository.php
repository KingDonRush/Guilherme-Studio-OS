<?php
/**
 * Area item associations.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Areas;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class AreaItemRepository {

	private const LIMIT = 300;

	private AreaRepository $areas;

	public function __construct( AreaRepository $areas ) {
		$this->areas = $areas;
	}

	public static function categories(): array {
		return array(
			'pages'        => __( 'Páginas', 'guilherme-portfolio' ),
			'content'      => __( 'Conteúdo', 'guilherme-portfolio' ),
			'presentation' => __( 'Theme Builder', 'guilherme-portfolio' ),
			'navigation'   => __( 'Navegação', 'guilherme-portfolio' ),
			'admin'        => __( 'Admin', 'guilherme-portfolio' ),
			'references'   => __( 'Referências', 'guilherme-portfolio' ),
		);
	}

	public static function types(): array {
		return array(
			'post'          => __( 'Página, post ou CPT', 'guilherme-portfolio' ),
			'post_type'     => __( 'Tipo de post', 'guilherme-portfolio' ),
			'taxonomy'      => __( 'Taxonomia', 'guilherme-portfolio' ),
			'menu'          => __( 'Menu', 'guilherme-portfolio' ),
			'theme_builder' => __( 'Theme Builder', 'guilherme-portfolio' ),
			'media'         => __( 'Mídia', 'guilherme-portfolio' ),
			'admin_url'     => __( 'URL administrativa', 'guilherme-portfolio' ),
			'reference'     => __( 'Referência', 'guilherme-portfolio' ),
			'custom'        => __( 'Personalizado', 'guilherme-portfolio' ),
		);
	}

	public static function roles(): array {
		return array(
			'home'            => __( 'Home', 'guilherme-portfolio' ),
			'about'           => __( 'Sobre', 'guilherme-portfolio' ),
			'services'        => __( 'Serviços', 'guilherme-portfolio' ),
			'contact'         => __( 'Contato', 'guilherme-portfolio' ),
			'blog'            => __( 'Blog', 'guilherme-portfolio' ),
			'case'            => __( 'Case', 'guilherme-portfolio' ),
			'menu'            => __( 'Menu', 'guilherme-portfolio' ),
			'header'          => __( 'Cabeçalho', 'guilherme-portfolio' ),
			'footer'          => __( 'Rodapé', 'guilherme-portfolio' ),
			'single'          => __( 'Single', 'guilherme-portfolio' ),
			'single-post'     => __( 'Single post', 'guilherme-portfolio' ),
			'single-product'  => __( 'Página de produto', 'guilherme-portfolio' ),
			'archive'         => __( 'Arquivo', 'guilherme-portfolio' ),
			'archive-product' => __( 'Arquivo de produtos', 'guilherme-portfolio' ),
			'loop'            => __( 'Item de loop', 'guilherme-portfolio' ),
			'popup'           => __( 'Popup', 'guilherme-portfolio' ),
			'section'         => __( 'Seção', 'guilherme-portfolio' ),
			'cart'            => __( 'Carrinho', 'guilherme-portfolio' ),
			'checkout'        => __( 'Finalização', 'guilherme-portfolio' ),
			'search'          => __( 'Busca', 'guilherme-portfolio' ),
			'not-found'       => __( '404', 'guilherme-portfolio' ),
			'template'        => __( 'Template', 'guilherme-portfolio' ),
			'other'           => __( 'Outro', 'guilherme-portfolio' ),
		);
	}

	public function all( $area ): array {
		$current = $this->areas->require_area( $area );
		return self::sanitize_items( get_post_meta( $current['id'], AreaMeta::ITEMS, true ) );
	}

	public function attach( $area, array $raw ): array {
		$current = $this->areas->require_area( $area );
		$items   = $this->all( $current['id'] );
		$item    = self::sanitize_item( $this->prepare_item( $raw ) );

		$this->validate_item( $item );
		$items[] = $item;
		$this->save( $current['id'], $items );

		return $item;
	}

	public function update( $area, string $item_id, array $raw ): array {
		$current = $this->areas->require_area( $area );
		$items   = $this->all( $current['id'] );

		foreach ( $items as $index => $item ) {
			if ( $item['id'] !== AreaSanitizer::id( $item_id ) ) {
				continue;
			}

			$updated = self::sanitize_item(
				array_merge(
					$item,
					$raw,
					array( 'updated_at' => current_time( 'mysql' ) )
				)
			);

			$this->validate_item( $updated );
			$items[ $index ] = $updated;
			$this->save( $current['id'], $items );

			return $updated;
		}

		throw new \InvalidArgumentException( __( 'Area item not found.', 'guilherme-portfolio' ) );
	}

	public function detach( $area, string $item_id ): void {
		$current = $this->areas->require_area( $area );
		$item_id = AreaSanitizer::id( $item_id );
		$items   = array_values(
			array_filter(
				$this->all( $current['id'] ),
				static fn( array $item ): bool => $item['id'] !== $item_id
			)
		);

		$this->save( $current['id'], $items );
	}

	public static function sanitize_items( $raw ): array {
		$items = array();

		foreach ( is_array( $raw ) ? array_slice( $raw, 0, self::LIMIT ) : array() as $item ) {
			if ( is_array( $item ) ) {
				$items[] = self::sanitize_item( $item );
			}
		}

		usort(
			$items,
			static fn( array $a, array $b ): int => ( $a['order'] <=> $b['order'] ) ?: strcasecmp( $a['label'], $b['label'] )
		);

		return $items;
	}

	public static function sanitize_item( array $raw ): array {
		$type       = AreaSanitizer::type( $raw['type'] ?? 'custom' );
		$created_at = sanitize_text_field( (string) ( $raw['created_at'] ?? current_time( 'mysql' ) ) );

		return array(
			'id'          => AreaSanitizer::id( $raw['id'] ?? '', 'item-' . wp_generate_uuid4() ),
			'type'        => $type,
			'category'    => AreaSanitizer::category( $raw['category'] ?? self::default_category( $type ) ),
			'role'        => AreaSanitizer::key( $raw['role'] ?? 'other', 'other' ),
			'label'       => AreaSanitizer::label( $raw['label'] ?? '' ),
			'object_type' => AreaSanitizer::key( $raw['object_type'] ?? '' ),
			'object_id'   => AreaSanitizer::object_id( $raw['object_id'] ?? '' ),
			'admin_url'   => AreaSanitizer::admin_path( $raw['admin_url'] ?? '' ),
			'notes'       => AreaSanitizer::notes( $raw['notes'] ?? '' ),
			'order'       => AreaSanitizer::order( $raw['order'] ?? 0 ),
			'created_at'  => $created_at,
			'updated_at'  => sanitize_text_field( (string) ( $raw['updated_at'] ?? $created_at ) ),
		);
	}

	private function prepare_item( array $raw ): array {
		$type = AreaSanitizer::type( $raw['type'] ?? 'custom' );

		if ( empty( $raw['label'] ) ) {
			$raw['label'] = $this->default_label( $type, $raw );
		}

		return $raw;
	}

	private function validate_item( array $item ): void {
		if ( '' === $item['label'] ) {
			throw new \InvalidArgumentException( __( 'Item label is required.', 'guilherme-portfolio' ) );
		}

		if ( 'post' === $item['type'] && ! get_post( absint( $item['object_id'] ) ) ) {
			throw new \InvalidArgumentException( __( 'A valid post/page ID is required.', 'guilherme-portfolio' ) );
		}

		if ( 'post_type' === $item['type'] && ! post_type_exists( $item['object_type'] ) ) {
			throw new \InvalidArgumentException( __( 'A valid post type is required.', 'guilherme-portfolio' ) );
		}

		if ( 'taxonomy' === $item['type'] && ! taxonomy_exists( $item['object_type'] ) ) {
			throw new \InvalidArgumentException( __( 'A valid taxonomy is required.', 'guilherme-portfolio' ) );
		}

		if ( 'admin_url' === $item['type'] && '' === $item['admin_url'] && ! absint( $item['object_id'] ) ) {
			throw new \InvalidArgumentException( __( 'A safe admin URL or object ID is required.', 'guilherme-portfolio' ) );
		}
	}

	private function default_label( string $type, array $raw ): string {
		if ( 'post' === $type && ! empty( $raw['object_id'] ) ) {
			return get_the_title( absint( $raw['object_id'] ) );
		}

		if ( in_array( $type, array( 'post_type', 'taxonomy' ), true ) && ! empty( $raw['object_type'] ) ) {
			return $raw['object_type'];
		}

		return '';
	}

	private static function default_category( string $type ): string {
		return array(
			'post'          => 'pages',
			'post_type'     => 'content',
			'taxonomy'      => 'content',
			'menu'          => 'navigation',
			'theme_builder' => 'presentation',
			'media'         => 'references',
			'admin_url'     => 'admin',
			'reference'     => 'references',
		)[ $type ] ?? 'content';
	}

	private function save( int $area_id, array $items ): void {
		update_post_meta( $area_id, AreaMeta::ITEMS, array_slice( self::sanitize_items( $items ), 0, self::LIMIT ) );
	}
}
