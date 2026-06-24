<?php
/**
 * Shared small view primitives for Portfolio Workbench.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench\Admin\Views;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class ViewParts {

	public function metric( int $value, string $label ): void {
		?>
		<div class="gp-workbench-metric">
			<strong><?php echo esc_html( number_format_i18n( $value ) ); ?></strong>
			<span><?php echo esc_html( $label ); ?></span>
		</div>
		<?php
	}

	public function empty_hint(): void {
		?>
		<p class="gp-workbench-muted"><?php esc_html_e( 'Nothing attached here yet.', 'guilherme-portfolio' ); ?></p>
		<?php
	}

	public function tip( string $text ): void {
		if ( '' === $text ) {
			return;
		}
		?>
		<span class="gp-workbench-tip dashicons dashicons-editor-help" tabindex="0" title="<?php echo esc_attr( $text ); ?>" aria-label="<?php echo esc_attr( $text ); ?>"></span>
		<?php
	}

	public function badge( string $label, string $kind, string $tip ): void {
		?>
		<span class="gp-workbench-badge is-<?php echo esc_attr( sanitize_html_class( $kind ) ); ?>" title="<?php echo esc_attr( $tip ); ?>"><?php echo esc_html( $label ); ?></span>
		<?php
	}

	public function notice( string $notice ): void {
		if ( '' === $notice ) {
			return;
		}

		$messages = array(
			'item_attached'      => __( 'Workbench item attached.', 'guilherme-portfolio' ),
			'project_created'    => __( 'Project created in Workbench.', 'guilherme-portfolio' ),
			'project_updated'    => __( 'Project updated.', 'guilherme-portfolio' ),
			'project_create_failed' => __( 'Could not create the project.', 'guilherme-portfolio' ),
			'page_created'       => __( 'Page created and attached.', 'guilherme-portfolio' ),
			'page_create_failed' => __( 'Could not create the page.', 'guilherme-portfolio' ),
			'item_detached'      => __( 'Workbench item detached.', 'guilherme-portfolio' ),
			'relation_stored'    => __( 'Workbench relation stored.', 'guilherme-portfolio' ),
			'relation_updated'   => __( 'Workbench relation updated.', 'guilherme-portfolio' ),
			'relation_removed'   => __( 'Workbench relation removed.', 'guilherme-portfolio' ),
			'suggestion_stored'  => __( 'Workbench suggestion stored.', 'guilherme-portfolio' ),
			'suggestion_marked'  => __( 'Suggestion marked.', 'guilherme-portfolio' ),
			'suggestion_ignored' => __( 'Suggestion ignored.', 'guilherme-portfolio' ),
		);

		if ( ! isset( $messages[ $notice ] ) ) {
			return;
		}
		?>
		<div class="notice notice-success is-dismissible"><p><?php echo esc_html( $messages[ $notice ] ); ?></p></div>
		<?php
	}
}
