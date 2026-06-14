<?php
/**
 * Theme footer.
 *
 * @package GuilhermePortfolio
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<footer id="contact" class="gp-site-footer">
	<div class="gp-footer-id">
		<strong>Guilherme Silva</strong>
		<a class="gp-dev-signature" href="https://github.com/KingDonRush" aria-label="<?php esc_attr_e( 'kingdonrush on GitHub', 'guilherme-portfolio' ); ?>">
			<?php echo gp_icon_img( 'github.svg', '', 'gp-dev-signature__icon' ); ?>
			<span>kingdonrush</span>
		</a>
	</div>
	<div class="gp-footer-links" aria-label="<?php esc_attr_e( 'Contact links', 'guilherme-portfolio' ); ?>">
		<a href="mailto:hello@guilhermesilva.dev">Email</a>
		<a href="https://github.com/KingDonRush">GitHub</a>
		<a href="https://www.linkedin.com/">LinkedIn</a>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
