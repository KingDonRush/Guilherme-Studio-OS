<?php
/**
 * Context panel for Portfolio Area Map.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Areas\Admin\Views;

use GuilhermePortfolio\Areas\AreaItemRepository;
use GuilhermePortfolio\Areas\AreaUrl;
use GuilhermePortfolio\Areas\DestinationResolver;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class AreaMapContextView {

	private AreaFormsView $forms;
	private DestinationResolver $destinations;

	public function __construct( AreaFormsView $forms, DestinationResolver $destinations ) {
		$this->forms        = $forms;
		$this->destinations = $destinations;
	}

	public function render( array $area, array $pages, array $groups ): void {
		?>
		<aside id="gp-area-map-context" class="gp-area-map-context" aria-live="polite">
			<?php $this->area_panel( $area, $groups ); ?>
			<?php foreach ( $pages as $item ) : ?>
				<?php $this->page_panel( $area, $item ); ?>
			<?php endforeach; ?>
		</aside>
		<?php
	}

	public function connection_count( array $groups ): int {
		return count( $this->group_connections( $groups ) ) + 2;
	}

	private function area_panel( array $area, array $groups ): void {
		?>
		<div data-gp-context-panel="area">
			<h4><?php esc_html_e( 'Conexões da área', 'guilherme-portfolio' ); ?></h4>
			<?php if ( '' !== $area['notes'] ) : ?>
				<p><?php echo esc_html( $area['notes'] ); ?></p>
			<?php endif; ?>
			<div class="gp-area-map-tabs" data-gp-tabset>
				<?php $this->tabs( array( 'pages' => __( 'Páginas', 'guilherme-portfolio' ), 'elementor' => __( 'Elementor', 'guilherme-portfolio' ), 'theme' => __( 'Theme Builder', 'guilherme-portfolio' ), 'other' => __( 'Outros', 'guilherme-portfolio' ) ) ); ?>
				<div class="gp-area-map-tab-panel" data-gp-tab-panel="pages">
					<?php $this->native_connection( 'edit.php?post_type=page', 'dashicons-admin-page', __( 'Abrir Pages', 'guilherme-portfolio' ) ); ?>
				</div>
				<div class="gp-area-map-tab-panel" data-gp-tab-panel="elementor" hidden>
					<?php $this->native_connection( 'edit.php?post_type=elementor_library', 'dashicons-layout', __( 'Biblioteca Elementor', 'guilherme-portfolio' ) ); ?>
				</div>
				<div class="gp-area-map-tab-panel" data-gp-tab-panel="theme" hidden>
					<?php $this->native_connection( 'edit.php?post_type=elementor_library&tabs_group=theme', 'dashicons-layout', __( 'Abrir Theme Builder', 'guilherme-portfolio' ) ); ?>
					<?php if ( ! empty( $groups['presentation'] ) ) : ?>
						<?php $this->connection_list( $groups['presentation'], '' ); ?>
					<?php endif; ?>
				</div>
				<div class="gp-area-map-tab-panel" data-gp-tab-panel="other" hidden>
					<?php $this->connection_list( $this->group_connections( $groups, false ), __( 'Nenhuma outra conexão associada.', 'guilherme-portfolio' ) ); ?>
				</div>
			</div>
		</div>
		<?php
	}

	private function page_panel( array $area, array $item ): void {
		$links = $this->links_by_tab( $item );
		?>
		<div data-gp-context-panel="<?php echo esc_attr( $item['id'] ); ?>" hidden>
			<h4><?php echo esc_html( $item['label'] ); ?></h4>
			<p><?php esc_html_e( 'Ações nativas deste item.', 'guilherme-portfolio' ); ?></p>
			<div class="gp-area-map-tabs" data-gp-tabset>
				<?php $this->tabs( array( 'pages' => __( 'Páginas', 'guilherme-portfolio' ), 'elementor' => __( 'Elementor', 'guilherme-portfolio' ), 'theme' => __( 'Theme Builder', 'guilherme-portfolio' ) ) ); ?>
				<div class="gp-area-map-tab-panel" data-gp-tab-panel="pages">
					<?php $this->link_list( $links['pages'], __( 'Nenhuma ação de página encontrada.', 'guilherme-portfolio' ) ); ?>
					<?php $this->forms->detach_item( $area, $item ); ?>
				</div>
				<div class="gp-area-map-tab-panel" data-gp-tab-panel="elementor" hidden>
					<?php $this->link_list( $links['elementor'], __( 'Este item não tem atalho Elementor.', 'guilherme-portfolio' ) ); ?>
				</div>
				<div class="gp-area-map-tab-panel" data-gp-tab-panel="theme" hidden>
					<p class="gp-area-map-empty-line"><?php esc_html_e( 'Templates ficam nas conexões gerais da área.', 'guilherme-portfolio' ); ?></p>
				</div>
			</div>
		</div>
		<?php
	}

	private function tabs( array $tabs ): void {
		?>
		<div class="gp-area-map-tab-list" role="tablist">
			<?php foreach ( $tabs as $id => $label ) : ?>
				<button type="button" class="button-link" data-gp-tab="<?php echo esc_attr( $id ); ?>"><?php echo esc_html( $label ); ?></button>
			<?php endforeach; ?>
		</div>
		<?php
	}

	private function connection_list( array $items, string $empty ): void {
		if ( empty( $items ) ) {
			$this->empty_line( $empty );
			return;
		}
		?>
		<div class="gp-area-map-connection-list">
			<?php foreach ( $items as $item ) : ?>
				<?php $this->connection_item( $item ); ?>
			<?php endforeach; ?>
		</div>
		<?php
	}

	private function link_list( array $links, string $empty ): void {
		if ( empty( $links ) ) {
			$this->empty_line( $empty );
			return;
		}
		?>
		<div class="gp-area-map-connection-list">
			<?php foreach ( $links as $link ) : ?>
				<a class="gp-area-map-connection" href="<?php echo esc_url( $link['url'] ); ?>">
					<span class="dashicons <?php echo esc_attr( AreaMapIcons::action( $link['key'] ) ); ?>" aria-hidden="true"></span>
					<?php echo esc_html( $link['label'] ); ?>
				</a>
			<?php endforeach; ?>
		</div>
		<?php
	}

	private function native_connection( string $path, string $icon, string $label ): void {
		?>
		<a class="gp-area-map-connection is-native" href="<?php echo esc_url( AreaUrl::admin( $path ) ); ?>">
			<span class="dashicons <?php echo esc_attr( $icon ); ?>" aria-hidden="true"></span>
			<?php echo esc_html( $label ); ?>
		</a>
		<?php
	}

	private function connection_item( array $item ): void {
		$links = $this->destinations->links( $item );
		$url   = $links[0]['url'] ?? '';
		$tag   = '' !== $url ? 'a' : 'span';
		$attrs = '' !== $url ? ' href="' . esc_url( $url ) . '"' : '';
		?>
		<<?php echo esc_attr( $tag ) . $attrs; ?> class="gp-area-map-connection" title="<?php echo esc_attr( $this->connection_tip( $item ) ); ?>">
			<span class="dashicons <?php echo esc_attr( AreaMapIcons::type( $item['type'] ) ); ?>" aria-hidden="true"></span>
			<?php echo esc_html( $this->item_label( $item ) ); ?>
		</<?php echo esc_attr( $tag ); ?>>
		<?php
	}

	private function links_by_tab( array $item ): array {
		$links = array( 'pages' => array(), 'elementor' => array() );

		foreach ( $this->destinations->links( $item ) as $link ) {
			$links[ 'elementor' === $link['key'] ? 'elementor' : 'pages' ][] = $link;
		}

		return $links;
	}

	private function group_connections( array $groups, bool $include_presentation = true ): array {
		$sets = array( $groups['content'], $groups['navigation'], $groups['admin'], $groups['references'] );

		if ( $include_presentation ) {
			array_unshift( $sets, $groups['presentation'] );
		}

		return array_merge( ...$sets );
	}

	private function item_label( array $item ): string {
		if ( 'post_type' === $item['type'] && post_type_exists( $item['object_type'] ) ) {
			$post_type = get_post_type_object( $item['object_type'] );
			return $post_type ? $post_type->label : $item['label'];
		}

		return $item['label'];
	}

	private function connection_tip( array $item ): string {
		return array(
			'content'      => __( 'Estrutura de conteúdo associada a esta área.', 'guilherme-portfolio' ),
			'presentation' => __( 'Template ou Theme Builder ligado a esta área.', 'guilherme-portfolio' ),
			'navigation'   => __( 'Menu ou ponto de navegação relacionado.', 'guilherme-portfolio' ),
			'admin'        => __( 'Atalho administrativo seguro para este contexto.', 'guilherme-portfolio' ),
			'references'   => __( 'Referência operacional ligada a esta área.', 'guilherme-portfolio' ),
		)[ $item['category'] ] ?? __( 'Atalho associado a esta área.', 'guilherme-portfolio' );
	}

	private function empty_line( string $text ): void {
		?>
		<p class="gp-area-map-empty-line"><?php echo esc_html( $text ); ?></p>
		<?php
	}
}
