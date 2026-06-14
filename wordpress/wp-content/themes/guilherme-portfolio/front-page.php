<?php
/**
 * Portfolio home.
 *
 * @package GuilhermePortfolio
 */

get_header();

$projects = array_values(
	array_filter(
		gp_portfolio_projects(),
		static function ( array $project ): bool {
			return ! empty( $project['featured'] );
		}
	)
);
$counts   = array( 'plugin' => 0, 'website' => 0 );

foreach ( $projects as $project ) {
	$type = in_array( $project['project_type'] ?? '', array_keys( $counts ), true ) ? $project['project_type'] : 'website';
	$counts[ $type ]++;
}

$project_visuals = array(
	'simple-budget-plugin'              => 'lovable-aster-workspaces-acoustic-meeting-pod-v1.webp',
	'3d-viewer-for-elementor'           => 'lovable-aster-workspaces-ergo-lounge-chair-v1.webp',
	'woocommerce-toolkit-for-elementor' => 'lovable-aster-workspaces-linear-acoustic-light-v1.webp',
	'woocommerce-toolkit'               => 'lovable-aster-workspaces-linear-acoustic-light-v1.webp',
	'landing-page-implementation'       => 'lovable-landing-page-office-blue-hour.webp',
	'institutional-website'             => 'lovable-institutional-office-daylight.webp',
	'woocommerce-store'                 => 'lovable-aster-workspaces-acoustic-meeting-pod-v1.webp',
);

$home_project_image = static function ( array $project, string $size = 'large' ) use ( $project_visuals ): string {
	$key = sanitize_title( (string) ( $project['title'] ?? '' ) );

	if ( isset( $project_visuals[ $key ] ) ) {
		return gp_asset_url( 'assets/images/' . $project_visuals[ $key ] );
	}

	$image_id = absint( $project['main_image'] ?? $project['thumbnail'] ?? 0 );

	return $image_id ? (string) wp_get_attachment_image_url( $image_id, $size ) : '';
};
?>
<main id="main" class="pf-page" aria-labelledby="portfolio-title">
	<section class="pf-stage">
		<aside class="pf-identity">
			<div class="pf-portrait-wrap">
				<img src="<?php echo esc_url( gp_asset_url( 'assets/images/lovable-guilherme-silva-profile-cutout.webp' ) ); ?>" alt="<?php esc_attr_e( 'Guilherme Silva, WordPress developer', 'guilherme-portfolio' ); ?>" width="768" height="768">
				<span class="pf-availability"><i aria-hidden="true"></i><?php esc_html_e( 'Available', 'guilherme-portfolio' ); ?></span>
			</div>

			<p class="pf-kicker"><?php esc_html_e( 'WordPress Developer · Brazil', 'guilherme-portfolio' ); ?></p>
			<h1 id="portfolio-title">Guilherme<br>Silva</h1>
			<a class="pf-handle" href="https://github.com/KingDonRush" aria-label="<?php esc_attr_e( 'kingdonrush on GitHub', 'guilherme-portfolio' ); ?>">
				<i class="fab fa-github" aria-hidden="true"></i>
				<span>@kingdonrush</span>
			</a>
			<p class="pf-lead"><?php esc_html_e( 'Maintainable WordPress systems, custom plugins and design-led digital experiences.', 'guilherme-portfolio' ); ?></p>

			<div class="pf-interaction-grid">
				<div class="pf-specialties" aria-label="<?php esc_attr_e( 'Specialties', 'guilherme-portfolio' ); ?>">
					<div>
						<i class="fas fa-puzzle-piece" aria-hidden="true"></i>
						<span><b><?php esc_html_e( 'Custom', 'guilherme-portfolio' ); ?></b> <?php esc_html_e( 'plugins', 'guilherme-portfolio' ); ?></span>
					</div>
					<div>
						<i class="fab fa-elementor" aria-hidden="true"></i>
						<span><b><?php esc_html_e( 'Elementor', 'guilherme-portfolio' ); ?></b> <?php esc_html_e( 'systems', 'guilherme-portfolio' ); ?></span>
					</div>
					<div>
						<i class="fas fa-shopping-bag" aria-hidden="true"></i>
						<span><b><?php esc_html_e( 'Woo', 'guilherme-portfolio' ); ?></b> <?php esc_html_e( 'builds', 'guilherme-portfolio' ); ?></span>
					</div>
					<div>
						<i class="fas fa-laptop-code" aria-hidden="true"></i>
						<span><b><?php esc_html_e( 'Design', 'guilherme-portfolio' ); ?></b> <?php esc_html_e( 'dev', 'guilherme-portfolio' ); ?></span>
					</div>
				</div>

				<nav class="pf-socials" aria-label="<?php esc_attr_e( 'Social profiles', 'guilherme-portfolio' ); ?>">
					<a href="https://www.linkedin.com/" aria-label="LinkedIn"><i class="fab fa-linkedin-in" aria-hidden="true"></i></a>
					<a href="https://wa.me/" aria-label="WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i></a>
					<a href="mailto:hello@guilhermesilva.dev" aria-label="Email"><i class="fas fa-envelope" aria-hidden="true"></i></a>
					<a href="https://www.instagram.com/" aria-label="Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>
					<a href="https://github.com/KingDonRush" aria-label="GitHub"><i class="fab fa-github" aria-hidden="true"></i></a>
				</nav>
			</div>
		</aside>

		<section class="pf-showcase" aria-labelledby="selected-work">
			<header class="pf-section-head">
				<div>
					<p><?php esc_html_e( 'Portfolio / 2026', 'guilherme-portfolio' ); ?></p>
					<h2 id="selected-work"><?php esc_html_e( 'Selected work', 'guilherme-portfolio' ); ?></h2>
				</div>
				<a class="pf-primary" href="mailto:hello@guilhermesilva.dev?subject=Discuss%20a%20project">
					<span><?php esc_html_e( 'Discuss', 'guilherme-portfolio' ); ?></span>
					<i class="fas fa-arrow-right" aria-hidden="true"></i>
				</a>
			</header>

			<?php if ( empty( $projects ) ) : ?>
				<div class="pf-project-empty">
					<strong><?php esc_html_e( 'Project data is not available.', 'guilherme-portfolio' ); ?></strong>
					<span><?php esc_html_e( 'Activate Elementor Implementation Toolkit and synchronize the Projects content type.', 'guilherme-portfolio' ); ?></span>
				</div>
			<?php else : ?>
				<div class="pf-carousel" data-project-showcase aria-label="<?php esc_attr_e( 'Selected projects', 'guilherme-portfolio' ); ?>">
					<div class="pf-focus-stage">
						<?php foreach ( $projects as $index => $project ) : ?>
							<?php
							$type      = 'plugin' === ( $project['project_type'] ?? '' ) ? 'plugin' : 'website';
							$image_url = $home_project_image( $project );
							$stack     = is_array( $project['stacks'] ?? null ) ? $project['stacks'] : array();
							$case_url  = (string) ( $project['case_url'] ?? home_url( '/work/' ) );
							?>
							<article class="pf-focus <?php echo 0 === $index ? 'is-active' : ''; ?>" data-project-panel="<?php echo esc_attr( $index ); ?>" data-project-type="<?php echo esc_attr( $type ); ?>" <?php echo 0 === $index ? '' : 'hidden'; ?>>
								<div class="pf-focus-visual">
									<?php if ( $image_url ) : ?>
										<img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $project['title'] . ' preview' ); ?>" width="960" height="610" <?php echo 0 === $index ? '' : 'loading="lazy"'; ?>>
									<?php endif; ?>
									<span><?php echo esc_html( str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></span>
								</div>
								<div class="pf-focus-copy">
									<span class="pf-number"><?php echo esc_html( str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?> / <?php echo esc_html( $type === 'plugin' ? 'Featured system' : 'Website build' ); ?></span>
									<h3><?php echo esc_html( $project['title'] ); ?></h3>
									<p><?php echo esc_html( $project['summary'] ); ?></p>
									<div class="pf-tags" role="list" aria-label="<?php echo esc_attr( $project['title'] . ' stack' ); ?>">
										<?php foreach ( $stack as $technology ) : ?>
											<?php
											$technology = (string) $technology;
											$stack_icon = gp_stack_icon( $technology );
											$stack_mark = gp_stack_mark( $technology );
											$label      = ucwords( str_replace( '-', ' ', $technology ) );
											?>
											<?php if ( $stack_mark || $stack_icon ) : ?>
												<span role="listitem" aria-label="<?php echo esc_attr( $label ); ?>" title="<?php echo esc_attr( $label ); ?>">
													<?php if ( $stack_mark ) : ?>
														<i class="<?php echo esc_attr( $stack_mark ); ?>" aria-hidden="true"></i>
													<?php else : ?>
														<?php echo gp_icon_img( $stack_icon, '', 'pf-stack-icon pf-stack-icon--' . sanitize_html_class( $technology ) ); ?>
													<?php endif; ?>
												</span>
											<?php endif; ?>
										<?php endforeach; ?>
									</div>
									<a class="pf-project-link" href="<?php echo esc_url( $case_url ); ?>">
										<?php esc_html_e( 'View case', 'guilherme-portfolio' ); ?>
										<i class="fas fa-arrow-right" aria-hidden="true"></i>
									</a>
								</div>
							</article>
						<?php endforeach; ?>
					</div>

					<div class="pf-project-index">
						<div class="pf-project-index-head">
							<div class="pf-project-tabs" role="tablist" aria-label="<?php esc_attr_e( 'Project categories', 'guilherme-portfolio' ); ?>">
								<button type="button" class="is-active" role="tab" aria-selected="true" data-project-tab="plugin">
									<?php esc_html_e( 'Plugin systems', 'guilherme-portfolio' ); ?>
									<span><?php echo esc_html( str_pad( (string) $counts['plugin'], 2, '0', STR_PAD_LEFT ) ); ?></span>
								</button>
								<button type="button" role="tab" aria-selected="false" data-project-tab="website">
									<?php esc_html_e( 'Website builds', 'guilherme-portfolio' ); ?>
									<span><?php echo esc_html( str_pad( (string) $counts['website'], 2, '0', STR_PAD_LEFT ) ); ?></span>
								</button>
							</div>
							<div class="pf-index-meta">
								<span data-project-counter aria-live="polite">01 / <?php echo esc_html( str_pad( (string) count( $projects ), 2, '0', STR_PAD_LEFT ) ); ?></span>
								<div class="pf-index-controls" aria-label="<?php esc_attr_e( 'Browse selected projects', 'guilherme-portfolio' ); ?>">
									<button type="button" data-project-prev aria-label="<?php esc_attr_e( 'Previous project', 'guilherme-portfolio' ); ?>" title="<?php esc_attr_e( 'Previous project', 'guilherme-portfolio' ); ?>">
										<i class="fas fa-arrow-left" aria-hidden="true"></i>
									</button>
									<button type="button" data-project-next aria-label="<?php esc_attr_e( 'Next project', 'guilherme-portfolio' ); ?>" title="<?php esc_attr_e( 'Next project', 'guilherme-portfolio' ); ?>">
										<i class="fas fa-arrow-right" aria-hidden="true"></i>
									</button>
								</div>
							</div>
						</div>

						<div class="pf-project-rail" data-project-rail>
							<div class="pf-project-track" data-project-track>
								<?php foreach ( $projects as $index => $project ) : ?>
									<?php
									$type      = 'plugin' === ( $project['project_type'] ?? '' ) ? 'plugin' : 'website';
									$image_url = $home_project_image( $project, 'medium' );
									?>
									<button type="button" class="pf-project-thumb <?php echo 0 === $index ? 'is-active' : ''; ?>" data-project-trigger="<?php echo esc_attr( $index ); ?>" data-project-type="<?php echo esc_attr( $type ); ?>" aria-pressed="<?php echo 0 === $index ? 'true' : 'false'; ?>">
										<span class="pf-thumb-image">
											<?php if ( $image_url ) : ?>
												<img src="<?php echo esc_url( $image_url ); ?>" alt="" width="270" height="156" loading="lazy">
											<?php endif; ?>
											<b><?php echo esc_html( str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></b>
										</span>
										<span><?php echo esc_html( $project['title'] ); ?></span>
									</button>
								<?php endforeach; ?>
							</div>
						</div>
					</div>
				</div>
			<?php endif; ?>
		</section>
	</section>
</main>
<?php
get_footer();
