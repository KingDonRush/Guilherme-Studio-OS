<?php
/**
 * Theme header.
 *
 * @package GuilhermePortfolio
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="gp-skip-link" href="#main"><?php esc_html_e( 'Skip to content', 'guilherme-portfolio' ); ?></a>
<header class="gp-site-header" data-site-header>
	<div class="gp-brand">
		<a class="gp-brand__avatar" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php esc_attr_e( 'Guilherme Silva home', 'guilherme-portfolio' ); ?>">
			<img src="<?php echo esc_url( gp_asset_url( 'assets/images/profile-guilherme.webp' ) ); ?>" alt="" width="44" height="44">
		</a>
		<span class="gp-brand__identity">
			<a class="gp-brand__name" href="<?php echo esc_url( home_url( '/' ) ); ?>">Guilherme Silva</a>
			<a class="gp-dev-signature" href="https://github.com/KingDonRush" aria-label="<?php esc_attr_e( 'kingdonrush on GitHub', 'guilherme-portfolio' ); ?>">
				<?php echo gp_icon_img( 'github.svg', '', 'gp-dev-signature__icon' ); ?>
				<span>kingdonrush</span>
			</a>
		</span>
	</div>
	<nav class="gp-primary-nav" aria-label="<?php esc_attr_e( 'Primary navigation', 'guilherme-portfolio' ); ?>">
		<?php
		if ( has_nav_menu( 'primary' ) ) {
			wp_nav_menu(
				array(
					'theme_location' => 'primary',
					'container'      => false,
					'items_wrap'     => '%3$s',
					'depth'          => 1,
				)
			);
		} else {
			gp_default_nav();
		}
		?>
	</nav>
</header>
