<?php
/**
 * Template Name: GP Elementor With Frame
 * Template Post Type: page
 *
 * @package GuilhermePortfolio
 */

get_header();
?>
<main id="main" class="gp-elementor-frame">
	<?php
	while ( have_posts() ) {
		the_post();
		the_content();
	}
	?>
</main>
<?php
get_footer();
