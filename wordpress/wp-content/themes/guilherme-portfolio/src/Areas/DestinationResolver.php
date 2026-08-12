<?php
/**
 * Native WordPress destination links for area items.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Areas;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class DestinationResolver {

	/**
	 * @return array<int,array{key:string,label:string,url:string,primary:bool}>
	 */
	public function links( array $item ): array {
		$links = array();

		if ( 'post' === $item['type'] ) {
			$links = $this->post_links( absint( $item['object_id'] ) );
		} elseif ( 'post_type' === $item['type'] ) {
			$links = $this->post_type_links( $item['object_type'] );
		} elseif ( 'taxonomy' === $item['type'] ) {
			$links = $this->taxonomy_links( $item['object_type'] );
		} elseif ( 'menu' === $item['type'] ) {
			$links[] = $this->link( 'menus', __( 'Menus', 'guilherme-portfolio' ), admin_url( 'nav-menus.php' ), true );
		} elseif ( 'theme_builder' === $item['type'] ) {
			$links = $this->theme_builder_links( $item );
		} elseif ( 'media' === $item['type'] ) {
			$links = $this->media_links( absint( $item['object_id'] ) );
		} elseif ( in_array( $item['type'], array( 'admin_url', 'reference', 'custom' ), true ) && '' !== $item['admin_url'] ) {
			$links[] = $this->link( 'open', __( 'Abrir', 'guilherme-portfolio' ), $this->admin_url( $item['admin_url'] ), true );
		}

		return array_values( array_filter( $links, static fn( array $link ): bool => '' !== $link['url'] ) );
	}

	private function post_links( int $post_id ): array {
		if ( ! $post_id || ! get_post( $post_id ) ) {
			return array();
		}

		return array(
			$this->link( 'edit', __( 'Editar', 'guilherme-portfolio' ), admin_url( 'post.php?post=' . $post_id . '&action=edit' ), true ),
			$this->link( 'elementor', __( 'Elementor', 'guilherme-portfolio' ), admin_url( 'post.php?post=' . $post_id . '&action=elementor' ), false ),
			$this->link( 'view', __( 'Ver', 'guilherme-portfolio' ), get_permalink( $post_id ), false ),
		);
	}

	private function post_type_links( string $post_type ): array {
		if ( ! post_type_exists( $post_type ) ) {
			return array();
		}

		$list = 'post' === $post_type ? admin_url( 'edit.php' ) : admin_url( 'edit.php?post_type=' . $post_type );
		$new  = 'post' === $post_type ? admin_url( 'post-new.php' ) : admin_url( 'post-new.php?post_type=' . $post_type );

		return array(
			$this->link( 'list', __( 'Listar', 'guilherme-portfolio' ), $list, true ),
			$this->link( 'new', __( 'Novo', 'guilherme-portfolio' ), $new, false ),
		);
	}

	private function taxonomy_links( string $taxonomy ): array {
		if ( ! taxonomy_exists( $taxonomy ) ) {
			return array();
		}

		return array(
			$this->link( 'terms', __( 'Termos', 'guilherme-portfolio' ), admin_url( 'edit-tags.php?taxonomy=' . $taxonomy ), true ),
		);
	}

	private function theme_builder_links( array $item ): array {
		if ( '' !== $item['admin_url'] ) {
			return array(
				$this->link( 'open', __( 'Abrir', 'guilherme-portfolio' ), $this->admin_url( $item['admin_url'] ), true ),
			);
		}

		$post_id = absint( $item['object_id'] );

		if ( $post_id ) {
			return array(
				$this->link( 'elementor', __( 'Elementor', 'guilherme-portfolio' ), admin_url( 'post.php?post=' . $post_id . '&action=elementor' ), true ),
				$this->link( 'edit', __( 'Editar', 'guilherme-portfolio' ), admin_url( 'post.php?post=' . $post_id . '&action=edit' ), false ),
			);
		}

		return array(
			$this->link( 'library', $this->theme_builder_label( $item['role'] ), $this->theme_builder_library_url( $item['role'] ), true ),
		);
	}

	private function theme_builder_library_url( string $role ): string {
		$args = array(
			'post_type'  => 'elementor_library',
			'tabs_group' => 'theme',
		);

		$template_type = $this->elementor_template_type( $role );

		if ( '' !== $template_type ) {
			$args['elementor_library_type'] = $template_type;
		}

		return add_query_arg( $args, admin_url( 'edit.php' ) );
	}

	private function theme_builder_label( string $role ): string {
		return array(
			'header'          => __( 'Cabeçalhos no Theme Builder', 'guilherme-portfolio' ),
			'footer'          => __( 'Rodapés no Theme Builder', 'guilherme-portfolio' ),
			'single'          => __( 'Singles no Theme Builder', 'guilherme-portfolio' ),
			'single-post'     => __( 'Singles no Theme Builder', 'guilherme-portfolio' ),
			'single-product'  => __( 'Produtos no Theme Builder', 'guilherme-portfolio' ),
			'archive'         => __( 'Arquivos no Theme Builder', 'guilherme-portfolio' ),
			'archive-product' => __( 'Arquivos no Theme Builder', 'guilherme-portfolio' ),
			'loop'            => __( 'Itens de loop no Theme Builder', 'guilherme-portfolio' ),
			'popup'           => __( 'Popups do Elementor', 'guilherme-portfolio' ),
		)[ $role ] ?? __( 'Theme Builder', 'guilherme-portfolio' );
	}

	private function elementor_template_type( string $role ): string {
		return array(
			'header'          => 'header',
			'footer'          => 'footer',
			'single'          => 'single',
			'single-post'     => 'single',
			'single-product'  => 'single',
			'archive'         => 'archive',
			'archive-product' => 'archive',
			'loop'            => 'loop-item',
			'popup'           => 'popup',
			'section'         => 'section',
		)[ $role ] ?? '';
	}

	private function media_links( int $media_id ): array {
		if ( ! $media_id || ! wp_attachment_is_image( $media_id ) ) {
			return array(
				$this->link( 'library', __( 'Mídia', 'guilherme-portfolio' ), admin_url( 'upload.php' ), true ),
			);
		}

		return array(
			$this->link( 'edit', __( 'Editar', 'guilherme-portfolio' ), admin_url( 'post.php?post=' . $media_id . '&action=edit' ), true ),
		);
	}

	private function admin_url( string $path ): string {
		return 0 === strpos( $path, admin_url() ) ? AreaUrl::internal( $path ) : AreaUrl::admin( $path );
	}

	private function link( string $key, string $label, $url, bool $primary ): array {
		return array(
			'key'     => $key,
			'label'   => $label,
			'url'     => AreaUrl::internal( $url ),
			'primary' => $primary,
		);
	}
}
