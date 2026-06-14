<?php
/**
 * Standalone Simple Budget Plugin case page template.
 *
 * Variables provided by the mu-plugin:
 *
 * @var string $assets_url
 * @var string $page_url
 * @var string $demo_url
 * @var string $avatar_url
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$css_url = $assets_url . 'simple-budget-case.css';
$js_url  = $assets_url . 'simple-budget-case.js';
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="theme-color" content="#f5f0e6">
	<title>Simple Budget Plugin | Guilherme Silva</title>
	<meta name="description" content="A WordPress and Elementor plugin case study about flexible quote workflows without plugin-owned pages.">
	<link rel="canonical" href="<?php echo esc_url( $page_url ); ?>">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="<?php echo esc_url( $css_url ); ?>?v=20260611-4">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>

<main id="main" class="sb-case" data-case-page>
	<header class="sb-topbar" aria-label="Portfolio navigation">
		<a class="sb-brand" href="<?php echo esc_url( home_url( '/portfolio/' ) ); ?>">
			<img src="<?php echo esc_url( $avatar_url ); ?>" alt="Guilherme Silva" width="48" height="48">
			<span>
				<strong>Guilherme Silva</strong>
				<small>WordPress Developer</small>
			</span>
		</a>
		<nav class="sb-nav" aria-label="Case sections">
			<a href="<?php echo esc_url( home_url( '/portfolio/' ) ); ?>">Work</a>
			<a href="<?php echo esc_url( $demo_url ); ?>">Demo</a>
			<a href="#decisions">Decisions</a>
			<a href="#contact">Contact</a>
		</nav>
	</header>

	<section class="sb-hero section-reveal" aria-labelledby="case-title">
		<div class="sb-hero__copy">
			<p class="eyebrow">WordPress Plugin / Elementor Implementation</p>
			<p class="case-name">Simple Budget Plugin</p>
			<h1 id="case-title">Quote workflows that keep the page yours.</h1>
			<p class="hero-lede">Simple Budget separates quote behavior from page design: two native widgets and a cart template that can live inside the project’s own layout.</p>
			<div class="hero-actions" aria-label="Primary actions">
				<a class="btn btn-primary" href="<?php echo esc_url( $demo_url ); ?>">
					<span aria-hidden="true">↗</span>
					Open demo catalog
				</a>
				<a class="btn btn-ghost" href="#decisions">Read decisions</a>
			</div>
			<ul class="hero-notes" aria-label="Core implementation signals">
				<li>Budget Button</li>
				<li>Budget Listing</li>
				<li>Theme Builder cart</li>
			</ul>
		</div>

		<div class="sb-hero__visual" aria-label="Plugin behavior layer visual">
			<img
				class="hero-panel-image"
				src="<?php echo esc_url( $assets_url . 'simple-budget-hero-panel-v1.webp' ); ?>"
				alt="Physical interface composition showing custom page layouts connected to a reusable quote behavior layer and cart surface."
				width="1448"
				height="1086"
			>
			<div class="floating-proof">
				<span class="proof-kicker">Core idea</span>
				<strong>Own the behavior, not the page.</strong>
				<small>Buttons, listing, and cart shell adapt to the implementation.</small>
			</div>
		</div>
	</section>

	<section class="sb-thesis section-reveal" aria-labelledby="ownership-title">
		<div class="section-index">01</div>
		<div>
			<p class="eyebrow">The constraint</p>
			<h2 id="ownership-title">Most quote plugins solve the request and steal the implementation.</h2>
		</div>
		<div class="thesis-grid" role="list">
			<div role="listitem">
				<strong>Fixed pages</strong>
				<span>Catalog, cart, and review screens arrive with a visual opinion.</span>
			</div>
			<div role="listitem">
				<strong>Hard styling fights</strong>
				<span>Paid Elementor builds become override work instead of implementation work.</span>
			</div>
			<div role="listitem">
				<strong>Client-specific flows</strong>
				<span>Consultative services, custom products, and CPTs need their own path.</span>
			</div>
		</div>
	</section>

	<section class="sb-workbench section-reveal" aria-labelledby="workbench-title">
		<div class="workbench-copy">
			<p class="eyebrow">The move</p>
			<h2 id="workbench-title">A smaller surface with stronger composition.</h2>
			<p>The plugin exposes primitives that fit the build instead of replacing it. Elementor still owns the page. The plugin owns behavior, state, and handoff.</p>
		</div>

		<div class="primitive-stage" data-case-carousel aria-label="Interactive quote workflow examples">
			<div class="stage-head">
				<span class="mono-label">Implementation mode</span>
				<strong data-carousel-title>Custom catalog</strong>
			</div>

			<div class="stage-viewport">
				<article class="case-slide is-active" data-title="Custom catalog" aria-hidden="false">
					<div class="catalog-board">
						<div class="catalog-card">
							<span class="swatch teal"></span>
							<strong>Acoustic pod</strong>
							<small>Private calls and focus work.</small>
							<button type="button" data-add-item>Add to quote</button>
						</div>
						<div class="catalog-card">
							<span class="swatch cobalt"></span>
							<strong>Lighting kit</strong>
							<small>Soft light for work areas.</small>
							<button type="button" data-add-item>Add to quote</button>
						</div>
					</div>
					<aside class="quote-panel" aria-label="Quote preview">
						<strong>Your quote</strong>
						<p><span data-quote-count>2</span> selected items</p>
						<div class="quote-row"><span>Acoustic pod</span><b>2</b></div>
						<div class="quote-row"><span>Lighting kit</span><b>1</b></div>
						<button type="button">Review and send</button>
					</aside>
				</article>

				<article class="case-slide" data-title="Service package" aria-hidden="true">
					<div class="service-board">
						<div>
							<span>Discovery</span>
							<strong>Scope workshop</strong>
							<button type="button" data-add-item>Add to quote</button>
						</div>
						<div>
							<span>Build</span>
							<strong>Landing implementation</strong>
							<button type="button" data-add-item>Add to quote</button>
						</div>
						<div>
							<span>Care</span>
							<strong>Maintenance pass</strong>
							<button type="button" data-add-item>Add to quote</button>
						</div>
					</div>
					<aside class="quote-panel compact" aria-label="Service quote preview">
						<strong>Quote review</strong>
						<p>Service items, notes, and quantities stay in one shell.</p>
						<button type="button">Review flow</button>
					</aside>
				</article>

				<article class="case-slide" data-title="Archive grid" aria-hidden="true">
					<div class="archive-board">
						<div class="archive-filter"></div>
						<div class="archive-list">
							<span></span><span></span><span></span><span></span>
						</div>
						<button type="button" data-add-item>Add current result</button>
					</div>
					<aside class="quote-panel compact" aria-label="Archive quote preview">
						<strong>Template cart</strong>
						<p>The cart layout is designed once and reused by the shell.</p>
						<button type="button">Open cart</button>
					</aside>
				</article>
			</div>

			<div class="carousel-controls" aria-label="Implementation mode controls">
				<button type="button" data-carousel-prev aria-label="Previous implementation mode">←</button>
				<span data-carousel-counter>01 / 03</span>
				<button type="button" data-carousel-next aria-label="Next implementation mode">→</button>
			</div>
		</div>
	</section>

	<section id="decisions" class="sb-decisions section-reveal" aria-labelledby="decisions-title">
		<div class="decision-asset">
			<div class="module-board" aria-hidden="true">
				<div class="module-chip button-chip">
					<span>01</span>
					<strong>Budget Button</strong>
					<small>Action primitive</small>
				</div>
				<div class="module-chip listing-chip">
					<span>02</span>
					<strong>Budget Listing</strong>
					<small>Selected item state</small>
				</div>
				<div class="module-chip cart-chip">
					<span>03</span>
					<strong>Cart template</strong>
					<small>Theme Builder surface</small>
				</div>
				<i class="module-line line-one"></i>
				<i class="module-line line-two"></i>
			</div>
		</div>
		<div class="decision-copy">
			<p class="eyebrow">Decisions</p>
			<h2 id="decisions-title">Three pieces, not a second store builder.</h2>
			<div class="accordion" data-accordion>
				<section class="accordion-item is-open">
					<button type="button" aria-expanded="true">
						<span>Budget Button</span>
						<small>Adds or opens the quote from the current context.</small>
					</button>
					<div class="accordion-panel">
						<p>Place it on product cards, service blocks, archive items, or custom CPT templates without handing the whole page to the plugin.</p>
					</div>
				</section>
				<section class="accordion-item">
					<button type="button" aria-expanded="false">
						<span>Budget Listing</span>
						<small>Renders selected items and quantity controls.</small>
					</button>
					<div class="accordion-panel">
						<p>The listing owns item-level actions such as quantity and removal because it has the repeated row context.</p>
					</div>
				</section>
				<section class="accordion-item">
					<button type="button" aria-expanded="false">
						<span>Cart template</span>
						<small>Designed in Elementor Theme Builder.</small>
					</button>
					<div class="accordion-panel">
						<p>The project controls cart content and presentation while the plugin controls shell behavior, state, validation, and handoff.</p>
					</div>
				</section>
			</div>
		</div>
	</section>

	<section class="sb-path section-reveal" aria-labelledby="path-title">
		<div>
			<p class="eyebrow">Build path</p>
			<h2 id="path-title">Designed for paid Elementor implementation work.</h2>
		</div>
		<ol class="path-list">
			<li>
				<span>01</span>
				<strong>Place the widget</strong>
				<p>Add quote behavior where the layout already makes sense.</p>
			</li>
			<li>
				<span>02</span>
				<strong>Bind the item</strong>
				<p>Use the current post, a selected item, or the project’s content model.</p>
			</li>
			<li>
				<span>03</span>
				<strong>Design the cart</strong>
				<p>Build review content in Elementor instead of accepting a fixed page.</p>
			</li>
			<li>
				<span>04</span>
				<strong>Choose the shell</strong>
				<p>Open as a drawer, modal, or compact review surface depending on the flow.</p>
			</li>
		</ol>
	</section>

	<section class="sb-final section-reveal" aria-labelledby="final-title">
		<div>
			<p class="eyebrow">Demo</p>
			<h2 id="final-title">See the plugin inside a real catalog.</h2>
		</div>
		<a class="btn btn-primary warm" href="<?php echo esc_url( $demo_url ); ?>">
			<span aria-hidden="true">↗</span>
			Open demo catalog
		</a>
	</section>

	<footer id="contact" class="sb-footer">
		<a class="footer-id" href="<?php echo esc_url( home_url( '/portfolio/' ) ); ?>">
			<img src="<?php echo esc_url( $avatar_url ); ?>" alt="" width="44" height="44">
			<span><strong>Guilherme Silva</strong><small>WordPress Developer</small></span>
		</a>
		<a href="mailto:hello@guilhermesilva.dev">hello@guilhermesilva.dev</a>
		<span>São Paulo, Brazil</span>
		<a href="https://github.com/KingDonRush">GitHub</a>
		<a href="https://www.linkedin.com/">LinkedIn</a>
	</footer>

	<div class="quote-toast" role="status" aria-live="polite" data-quote-toast>Added to quote</div>
</main>

<script src="<?php echo esc_url( $js_url ); ?>?v=20260611-1" defer></script>
</body>
</html>
