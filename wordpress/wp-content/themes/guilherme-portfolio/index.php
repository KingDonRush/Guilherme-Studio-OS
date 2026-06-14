<?php
/**
 * Default template.
 *
 * @package GuilhermePortfolio
 */

get_header();
?>
<main id="main" class="gp-page-shell">
	<?php
	if ( have_posts() ) {
		while ( have_posts() ) {
			the_post();
			?>
			<article <?php post_class( 'gp-content-page' ); ?>>
				<h1><?php the_title(); ?></h1>
				<div class="gp-entry-content">
					<?php the_content(); ?>
				</div>
			</article>
			<?php
		}
	}
	?>
</main>
<?php
get_footer();
