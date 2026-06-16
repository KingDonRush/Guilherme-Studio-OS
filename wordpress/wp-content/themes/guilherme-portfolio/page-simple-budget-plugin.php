<?php
/**
 * Simple Budget Plugin case page.
 *
 * @package GuilhermePortfolio
 */

add_filter(
	'body_class',
	static function ( array $classes ): array {
		$classes[] = 'gp-simple-budget-case-body';
		return $classes;
	}
);

get_header();

$demo_url     = home_url( '/budget-demo/products/' );
$github_url   = 'https://github.com/KingDonRush/simple-budget-plugin';
$profile_url  = 'https://github.com/KingDonRush';
$email_url    = 'mailto:hello@guilhermesilva.dev';
$linkedin_url = 'https://www.linkedin.com/in/guilherme-silva-dev/';

$contact_items = array(
	array(
		'icon'  => 'email.svg',
		'label' => 'Email',
		'value' => 'hello@guilhermesilva.dev',
		'url'   => $email_url,
	),
	array(
		'icon'  => 'linkedin.svg',
		'label' => 'LinkedIn',
		'value' => '/in/guilherme-silva-dev',
		'url'   => $linkedin_url,
	),
	array(
		'icon'  => 'github.svg',
		'label' => 'GitHub',
		'value' => '/kingdonrush',
		'url'   => $profile_url,
	),
	array(
		'icon'  => 'whatsapp.svg',
		'label' => 'Discuss a project',
		'value' => 'Quick and direct',
		'url'   => $email_url,
	),
);

$features = array(
	array(
		'icon' => 'custom-solutions.svg',
		'text' => 'Flexible by design',
	),
	array(
		'icon' => 'elementor.svg',
		'text' => 'Elementor native',
	),
	array(
		'icon' => 'cart.svg',
		'text' => 'Editable cart',
	),
);

$evidence = array(
	array(
		'id'      => 'budget-listing',
		'label'   => 'Quote list',
		'eyebrow' => 'Elementor widget',
		'tab_tag' => 'Widget',
		'title'   => 'Place the quote list inside the project layout.',
		'copy'    => 'Renders selected items with image, title, quantity controls and empty state. Because it is a widget, the quote list can live in a section, service page, modal or custom template without forcing one plugin-owned page.',
		'image'   => 'simple-budget-listing-editor-v1.webp',
		'alt'     => 'Budget Listing widget shown in the Elementor editor.',
		'loading' => 'eager',
	),
	array(
		'id'      => 'budget-button',
		'label'   => 'Add button',
		'eyebrow' => 'Reusable action',
		'tab_tag' => 'Action',
		'title'   => 'Add items to the budget from any conversion point.',
		'copy'    => 'The button can be attached to product cards, service blocks, custom loops or landing page sections. The site decides where the action appears; the plugin handles selection state and quantity behavior.',
		'image'   => 'simple-budget-open-cart-button-editor-v1.webp',
		'alt'     => 'Budget Button controls shown in the Elementor editor.',
		'loading' => 'lazy',
	),
	array(
		'id'      => 'cart-template',
		'label'   => 'Cart flow',
		'eyebrow' => 'Theme Builder',
		'tab_tag' => 'Template',
		'title'   => 'Keep the final quote flow editable in Elementor.',
		'copy'    => 'The cart is a template, not a hardcoded plugin screen. Copy, hierarchy, surrounding content and call to action stay project-owned while the plugin renders selected items and quantities.',
		'image'   => 'simple-budget-cart-template-editor-v1.webp',
		'alt'     => 'Simple Budget cart template shown in the Elementor editor.',
		'loading' => 'lazy',
	),
);
?>
<main id="main" class="sb-case gp-case-page" data-case-page>
	<section class="sb-case__viewport" aria-labelledby="case-title">
		<header class="sb-contact-strip" aria-label="<?php esc_attr_e( 'Contact and case actions', 'guilherme-portfolio' ); ?>">
			<div class="sb-contact-strip__identity">
				<a class="sb-contact-strip__name" href="<?php echo esc_url( home_url( '/' ) ); ?>">Guilherme Silva</a>
				<a class="sb-contact-strip__handle" href="<?php echo esc_url( $profile_url ); ?>" aria-label="<?php esc_attr_e( 'kingdonrush on GitHub', 'guilherme-portfolio' ); ?>">
					<?php echo gp_icon_img( 'github.svg', '', 'sb-icon sb-icon--github' ); ?>
					<span>kingdonrush</span>
				</a>
			</div>

			<div class="sb-contact-strip__links">
				<?php foreach ( $contact_items as $item ) : ?>
					<a class="sb-contact-item" href="<?php echo esc_url( $item['url'] ); ?>">
						<?php echo gp_icon_img( $item['icon'], '', 'sb-contact-item__icon' ); ?>
						<span>
							<strong><?php echo esc_html( $item['label'] ); ?></strong>
							<small><?php echo esc_html( $item['value'] ); ?></small>
						</span>
					</a>
				<?php endforeach; ?>
			</div>

			<div class="sb-contact-strip__actions" aria-label="<?php esc_attr_e( 'Case calls to action', 'guilherme-portfolio' ); ?>">
				<a class="sb-button sb-button--primary" href="<?php echo esc_url( $demo_url ); ?>">
					<span>Open demo</span>
					<?php echo gp_icon_img( 'external-link.svg', '', 'sb-button__icon' ); ?>
				</a>
				<a class="sb-button sb-button--secondary" href="<?php echo esc_url( $github_url ); ?>">
					<span>Repository</span>
					<?php echo gp_icon_img( 'external-link.svg', '', 'sb-button__icon' ); ?>
				</a>
			</div>
		</header>

		<div class="sb-thesis">
			<div class="sb-thesis__title">
				<p class="sb-overline"><span aria-hidden="true"></span> Plugin case study</p>
				<h1 id="case-title">Simple Budget Plugin</h1>
				<ul class="sb-feature-row" aria-label="<?php esc_attr_e( 'Simple Budget implementation traits', 'guilherme-portfolio' ); ?>">
					<?php foreach ( $features as $feature ) : ?>
						<li>
							<?php echo gp_icon_img( $feature['icon'], '', 'sb-feature-row__icon' ); ?>
							<span><?php echo esc_html( $feature['text'] ); ?></span>
						</li>
					<?php endforeach; ?>
				</ul>
			</div>
			<div class="sb-thesis__copy">
				<p class="sb-thesis__label">Implementation model</p>
				<h2>Quote behavior without plugin-owned pages.</h2>
				<p>Two Elementor widgets and one editable cart template adapt to the project layout, content model, and client flow.</p>
			</div>
		</div>

		<div class="sb-evidence-board" data-case-carousel>
			<div class="sb-evidence-board__stage">
				<div class="sb-evidence-board__dots" aria-hidden="true"></div>
				<div class="sb-editor-frame">
					<?php foreach ( $evidence as $index => $item ) : ?>
						<article
							id="evidence-<?php echo esc_attr( $item['id'] ); ?>"
							class="sb-editor-frame__slide<?php echo 0 === $index ? ' is-active' : ''; ?>"
							data-evidence-slide
							aria-hidden="<?php echo 0 === $index ? 'false' : 'true'; ?>"
						>
							<img
								src="<?php echo esc_url( gp_asset_url( 'assets/images/simple-budget-evidence/' . $item['image'] ) ); ?>"
								alt="<?php echo esc_attr( $item['alt'] ); ?>"
								width="1320"
								height="820"
								loading="<?php echo esc_attr( $item['loading'] ); ?>"
								decoding="async"
							>
						</article>
					<?php endforeach; ?>
				</div>

				<div class="sb-evidence-story" aria-live="polite">
					<?php foreach ( $evidence as $index => $item ) : ?>
						<article
							id="evidence-copy-<?php echo esc_attr( $item['id'] ); ?>"
							class="sb-evidence-copy<?php echo 0 === $index ? ' is-active' : ''; ?>"
							data-evidence-copy
							aria-hidden="<?php echo 0 === $index ? 'false' : 'true'; ?>"
						>
							<span class="sb-evidence-copy__number"><?php echo esc_html( $item['eyebrow'] ); ?></span>
							<h2><?php echo esc_html( $item['title'] ); ?></h2>
							<p><?php echo esc_html( $item['copy'] ); ?></p>
						</article>
					<?php endforeach; ?>

					<div class="sb-evidence-rail__tabs" role="tablist" aria-label="<?php esc_attr_e( 'Simple Budget Elementor evidence', 'guilherme-portfolio' ); ?>">
						<?php foreach ( $evidence as $index => $item ) : ?>
							<button
								type="button"
								role="tab"
								aria-selected="<?php echo 0 === $index ? 'true' : 'false'; ?>"
								aria-controls="evidence-<?php echo esc_attr( $item['id'] ); ?>"
								tabindex="<?php echo 0 === $index ? '0' : '-1'; ?>"
								class="sb-evidence-card<?php echo 0 === $index ? ' is-active' : ''; ?>"
								data-evidence-tab
							>
								<span class="sb-evidence-card__text">
									<strong><?php echo esc_html( $item['label'] ); ?></strong>
									<small><?php echo esc_html( $item['tab_tag'] ); ?></small>
								</span>
							</button>
						<?php endforeach; ?>
					</div>

					<div class="sb-evidence-story__footer">
						<div class="sb-evidence-controls" aria-label="<?php esc_attr_e( 'Browse Simple Budget evidence', 'guilherme-portfolio' ); ?>">
							<button type="button" data-evidence-prev aria-label="<?php esc_attr_e( 'Previous evidence', 'guilherme-portfolio' ); ?>" title="<?php esc_attr_e( 'Previous evidence', 'guilherme-portfolio' ); ?>">
								<i class="fas fa-arrow-left" aria-hidden="true"></i>
							</button>
							<button type="button" data-evidence-next aria-label="<?php esc_attr_e( 'Next evidence', 'guilherme-portfolio' ); ?>" title="<?php esc_attr_e( 'Next evidence', 'guilherme-portfolio' ); ?>">
								<i class="fas fa-arrow-right" aria-hidden="true"></i>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>
<?php
get_footer();
