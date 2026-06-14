<?php
/**
 * Project card.
 *
 * @package GuilhermePortfolio
 *
 * @var array{project?:array<string,mixed>} $args
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$project = $args['project'] ?? array();

if ( empty( $project ) ) {
	return;
}

$title       = (string) ( $project['title'] ?? '' );
$description = (string) ( $project['description'] ?? '' );
$url         = (string) ( $project['url'] ?? '#' );
$accent      = (string) ( $project['accent'] ?? 'cyan' );
$visual      = (string) ( $project['visual'] ?? 'default' );
$image       = (string) ( $project['image'] ?? '' );
$stack       = is_array( $project['stack'] ?? null ) ? $project['stack'] : array();
?>
<article class="gp-project-card is-<?php echo esc_attr( $accent ); ?>">
	<a class="gp-card-link" href="<?php echo esc_url( $url ); ?>">
		<div class="gp-card-visual is-<?php echo esc_attr( $visual ); ?>" aria-hidden="true">
			<?php if ( '' !== $image ) : ?>
				<img src="<?php echo esc_url( gp_asset_url( 'assets/images/project-previews/' . $image ) ); ?>" alt="" width="270" height="156" loading="eager" decoding="async">
			<?php elseif ( 'budget' === $visual ) : ?>
				<div class="gp-budget-preview">
					<span></span><span></span><span></span>
					<b>Quote</b>
				</div>
			<?php elseif ( 'viewer' === $visual ) : ?>
				<div class="gp-viewer-preview">
					<i></i><i></i><i></i>
					<span></span>
				</div>
			<?php elseif ( 'woo' === $visual ) : ?>
				<div class="gp-woo-preview">
					<strong>Woo</strong>
					<span></span><span></span><span></span><span></span>
				</div>
			<?php else : ?>
				<div class="gp-site-preview">
					<span></span>
					<i></i>
					<i></i>
					<b></b>
				</div>
			<?php endif; ?>
		</div>
		<div class="gp-card-body">
			<h4><?php echo esc_html( $title ); ?></h4>
			<p><?php echo esc_html( $description ); ?></p>
			<div class="gp-stack-row" aria-label="<?php echo esc_attr( $title . ' stack' ); ?>">
				<?php foreach ( $stack as $icon ) : ?>
					<?php echo gp_icon_img( (string) $icon, '', 'gp-stack-icon' ); ?>
				<?php endforeach; ?>
			</div>
			<span class="gp-see-project">See project <span aria-hidden="true">→</span></span>
		</div>
	</a>
</article>
