<?php
/**
 * Elementor library preview template.
 *
 * Theme Builder documents need the theme frame without the generic post card.
 *
 * @package GuilhermePortfolio
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>
<main id="main" class="gp-elementor-library-preview">
	<?php
	while ( have_posts() ) {
		the_post();
		the_content();
	}
	?>
</main>
<?php
get_footer();
