<?php
/**
 * Forms for Portfolio Area Map.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Areas\Admin\Views;

use GuilhermePortfolio\Areas\Admin\AreaMapActions;
use GuilhermePortfolio\Areas\AreaItemRepository;
use GuilhermePortfolio\Areas\AreaUrl;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class AreaFormsView {

	public function create_area(): void {
		?>
		<form method="post" action="<?php echo esc_url( AreaUrl::admin( 'admin-post.php' ) ); ?>" class="gp-area-map-form">
			<?php $this->action_fields( 'gp_area_create' ); ?>
			<label>
				<span><?php esc_html_e( 'Nova área', 'guilherme-portfolio' ); ?></span>
				<input type="text" name="gp_area[title]" required placeholder="<?php esc_attr_e( 'Mina Forma', 'guilherme-portfolio' ); ?>">
			</label>
			<div class="gp-area-map-form-row">
				<label>
					<span><?php esc_html_e( 'Slug', 'guilherme-portfolio' ); ?></span>
					<input type="text" name="gp_area[slug]" placeholder="mina-forma">
				</label>
				<label>
					<span><?php esc_html_e( 'Status', 'guilherme-portfolio' ); ?></span>
					<?php $this->status_select( 'gp_area[status]', 'active' ); ?>
				</label>
			</div>
			<label>
				<span><?php esc_html_e( 'Notas', 'guilherme-portfolio' ); ?></span>
				<textarea name="gp_area[notes]" rows="2"></textarea>
			</label>
			<?php submit_button( __( 'Criar área', 'guilherme-portfolio' ), 'primary', 'submit', false ); ?>
		</form>
		<?php
	}

	public function update_area( array $area ): void {
		?>
		<form method="post" action="<?php echo esc_url( AreaUrl::admin( 'admin-post.php' ) ); ?>" class="gp-area-map-form">
			<?php $this->action_fields( 'gp_area_update' ); ?>
			<input type="hidden" name="area" value="<?php echo esc_attr( $area['id'] ); ?>">
			<div class="gp-area-map-form-row">
				<label>
					<span><?php esc_html_e( 'Nome', 'guilherme-portfolio' ); ?></span>
					<input type="text" name="gp_area[title]" value="<?php echo esc_attr( $area['title'] ); ?>" required>
				</label>
				<label>
					<span><?php esc_html_e( 'Status', 'guilherme-portfolio' ); ?></span>
					<?php $this->status_select( 'gp_area[status]', $area['status'] ); ?>
				</label>
			</div>
			<label>
				<span><?php esc_html_e( 'Notas', 'guilherme-portfolio' ); ?></span>
				<textarea name="gp_area[notes]" rows="3"><?php echo esc_textarea( $area['notes'] ); ?></textarea>
			</label>
			<?php submit_button( __( 'Salvar área', 'guilherme-portfolio' ), 'secondary', 'submit', false ); ?>
		</form>
		<?php
	}

	public function attach_item( array $area ): void {
		?>
		<form method="post" action="<?php echo esc_url( AreaUrl::admin( 'admin-post.php' ) ); ?>" class="gp-area-map-form gp-area-map-association-form">
			<?php $this->action_fields( 'gp_area_item_attach' ); ?>
			<input type="hidden" name="area" value="<?php echo esc_attr( $area['id'] ); ?>">
			<p class="description"><?php esc_html_e( 'Associe algo que já existe e deixe o mapa abrir o lugar certo do WordPress depois.', 'guilherme-portfolio' ); ?></p>

			<fieldset class="gp-area-map-fieldset">
				<legend><?php esc_html_e( 'O que entra no mapa', 'guilherme-portfolio' ); ?></legend>
				<label>
					<span><?php esc_html_e( 'Nome no mapa', 'guilherme-portfolio' ); ?></span>
					<input type="text" name="gp_area_item[label]" required placeholder="<?php esc_attr_e( 'Home Mina Forma', 'guilherme-portfolio' ); ?>">
				</label>
				<div class="gp-area-map-form-row">
					<label>
						<span><?php esc_html_e( 'Alvo', 'guilherme-portfolio' ); ?></span>
						<?php $this->select( 'gp_area_item[type]', AreaItemRepository::types(), 'post' ); ?>
					</label>
					<label>
						<span><?php esc_html_e( 'Onde aparece', 'guilherme-portfolio' ); ?></span>
						<?php $this->select( 'gp_area_item[category]', AreaItemRepository::categories(), 'pages' ); ?>
					</label>
				</div>
				<label>
					<span><?php esc_html_e( 'Papel visual', 'guilherme-portfolio' ); ?></span>
					<?php $this->select( 'gp_area_item[role]', AreaItemRepository::roles(), 'other' ); ?>
				</label>
			</fieldset>

			<fieldset class="gp-area-map-fieldset">
				<legend><?php esc_html_e( 'Atalho nativo', 'guilherme-portfolio' ); ?></legend>
				<div class="gp-area-map-form-row">
					<label>
						<span><?php esc_html_e( 'ID do conteúdo ou template', 'guilherme-portfolio' ); ?></span>
						<input type="text" name="gp_area_item[object_id]" list="gp-area-map-object-options" inputmode="numeric" placeholder="42">
					</label>
					<label>
						<span><?php esc_html_e( 'Post type ou taxonomia', 'guilherme-portfolio' ); ?></span>
						<?php $this->object_type_select( 'gp_area_item[object_type]' ); ?>
					</label>
				</div>
				<?php $this->object_id_datalist(); ?>
			</fieldset>

			<details class="gp-area-map-advanced-fields">
				<summary><?php esc_html_e( 'Avançado: URL administrativa e notas', 'guilherme-portfolio' ); ?></summary>
				<label>
					<span><?php esc_html_e( 'URL administrativa segura', 'guilherme-portfolio' ); ?></span>
					<input type="text" name="gp_area_item[admin_url]" placeholder="admin.php?page=...">
				</label>
				<label>
					<span><?php esc_html_e( 'Notas', 'guilherme-portfolio' ); ?></span>
					<textarea name="gp_area_item[notes]" rows="2"></textarea>
				</label>
			</details>
			<?php submit_button( __( 'Associar item', 'guilherme-portfolio' ), 'primary', 'submit', false ); ?>
		</form>
		<?php
	}

	public function detach_item( array $area, array $item ): void {
		?>
		<form method="post" action="<?php echo esc_url( AreaUrl::admin( 'admin-post.php' ) ); ?>" class="gp-area-map-inline-form">
			<?php $this->action_fields( 'gp_area_item_detach' ); ?>
			<input type="hidden" name="area" value="<?php echo esc_attr( $area['id'] ); ?>">
			<input type="hidden" name="item_id" value="<?php echo esc_attr( $item['id'] ); ?>">
			<button type="submit" class="button button-link-delete"><?php esc_html_e( 'Desassociar', 'guilherme-portfolio' ); ?></button>
		</form>
		<?php
	}

	public function delete_area( array $area ): void {
		?>
		<form method="post" action="<?php echo esc_url( AreaUrl::admin( 'admin-post.php' ) ); ?>" class="gp-area-map-inline-form">
			<?php $this->action_fields( 'gp_area_delete' ); ?>
			<input type="hidden" name="area" value="<?php echo esc_attr( $area['id'] ); ?>">
			<button type="submit" class="button button-link-delete"><?php esc_html_e( 'Arquivar área', 'guilherme-portfolio' ); ?></button>
		</form>
		<?php
	}

	public function restore_area( array $area ): void {
		?>
		<form method="post" action="<?php echo esc_url( AreaUrl::admin( 'admin-post.php' ) ); ?>" class="gp-area-map-inline-form">
			<?php $this->action_fields( 'gp_area_restore' ); ?>
			<input type="hidden" name="area" value="<?php echo esc_attr( $area['id'] ); ?>">
			<button type="submit" class="button button-primary"><?php esc_html_e( 'Restaurar área', 'guilherme-portfolio' ); ?></button>
		</form>
		<?php
	}

	private function action_fields( string $action ): void {
		wp_nonce_field( AreaMapActions::NONCE_ACTION, AreaMapActions::NONCE_NAME );
		?>
		<input type="hidden" name="action" value="<?php echo esc_attr( $action ); ?>">
		<?php
	}

	private function status_select( string $name, string $selected ): void {
		$this->select(
			$name,
			array(
				'active'   => __( 'Ativa', 'guilherme-portfolio' ),
				'draft'    => __( 'Rascunho', 'guilherme-portfolio' ),
				'paused'   => __( 'Pausada', 'guilherme-portfolio' ),
				'archived' => __( 'Arquivada', 'guilherme-portfolio' ),
			),
			$selected
		);
	}

	private function select( string $name, array $options, string $selected ): void {
		?>
		<select name="<?php echo esc_attr( $name ); ?>">
			<?php foreach ( $options as $value => $label ) : ?>
				<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $selected, $value ); ?>><?php echo esc_html( $label ); ?></option>
			<?php endforeach; ?>
		</select>
		<?php
	}

	private function object_type_select( string $name ): void {
		$options = array( '' => __( 'Nenhum', 'guilherme-portfolio' ) );

		foreach ( get_post_types( array( 'show_ui' => true ), 'objects' ) as $post_type ) {
			$options[ $post_type->name ] = sprintf(
				/* translators: %s: post type label. */
				__( 'Post type: %s', 'guilherme-portfolio' ),
				$post_type->label
			);
		}

		foreach ( get_taxonomies( array( 'show_ui' => true ), 'objects' ) as $taxonomy ) {
			$options[ $taxonomy->name ] = sprintf(
				/* translators: %s: taxonomy label. */
				__( 'Taxonomia: %s', 'guilherme-portfolio' ),
				$taxonomy->label
			);
		}

		$this->select( $name, $options, '' );
	}

	private function object_id_datalist(): void {
		$posts = get_posts(
			array(
				'post_type'      => array( 'page', 'post', 'elementor_library' ),
				'post_status'    => array( 'publish', 'draft', 'private', 'pending' ),
				'posts_per_page' => 50,
				'orderby'        => 'modified',
				'order'          => 'DESC',
				'no_found_rows'  => true,
			)
		);
		?>
			<datalist id="gp-area-map-object-options">
				<?php foreach ( $posts as $post ) : ?>
					<option
						value="<?php echo esc_attr( (string) $post->ID ); ?>"
						label="<?php echo esc_attr( get_the_title( $post ) . ' - ' . $post->post_type ); ?>"
					></option>
				<?php endforeach; ?>
			</datalist>
		<?php
	}
}
