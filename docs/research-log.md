# Research Log

Use this file for human-readable research notes.

## Friend Report Template

- Name or alias:
- Market:
- Role:
- How they got hired:
- Portfolio/GitHub signals:
- Interview process:
- Compensation or rate range:
- English expectations:
- Advice:
- Notes:

## Internet Research Notes

Add dated notes with source links and short conclusions.

### 2026-05-14: Portfolio System Direction

Sources:
- Toptal WordPress Developer Job Description:
  https://www.toptal.com/developers/wordpress/job-description
- WordPress Jobs, posted 2026-05-11:
  https://jobs.wordpress.net/job/wordpress-elementor-woocommerce-developer/
- Elementor WooCommerce widgets documentation:
  https://elementor.com/help/woocommerce-widgets-pro/
- WooCommerce checkout block documentation:
  https://woocommerce.com/document/woocommerce-store-editing/customizing-cart-and-checkout/checkout-block/
- WooCommerce cart/checkout block theming documentation:
  https://developer.woocommerce.com/docs/theming/block-theme-development/cart-and-checkout/
- ShopPress on WordPress.org:
  https://wordpress.org/plugins/shop-press/
- ShopEngine on WordPress.org:
  https://wordpress.org/plugins/shopengine/
- Magical Shop Builder on WordPress.org:
  https://wordpress.org/plugins/magical-products-display/

Conclusion:
- The portfolio should prove a mixed WordPress profile: Elementor
  implementation, WooCommerce, PHP/JS/CSS, plugin development, performance,
  SEO, QA, and handoff documentation.
- Use the Simple Budget demo as a quote/catalog workflow, not a landing page.
- Use the 3D Viewer as the dense JS/Elementor widget proof.
- Add separate proof systems for landing-page implementation, institutional
  multipage delivery, and WooCommerce ecommerce.
- For WooCommerce customization, Elementor Pro is the clean official route when
  available. Without a license, prefer WooCommerce core blocks plus a custom
  theme layer, and test free Elementor WooCommerce builders before committing to
  one.

### 2026-05-14: Elementor/WooCommerce Pain Research

Sources:
- Elementor WooCommerce widgets documentation:
  https://elementor.com/help/woocommerce-widgets-pro/
- Elementor Menu Cart widget:
  https://elementor.com/help/menu-cart-widget-pro/
- WooCommerce add to cart URL docs:
  https://woocommerce.com/document/quick-guide-to-woocommerce-add-to-cart-urls/
- WooCommerce variable product docs:
  https://woocommerce.com/document/variable-product/
- WordPress.org support thread: Ajax add to cart on archives not working on Elementor pages:
  https://wordpress.org/support/topic/ajax-add-to-cart-for-archives-not-working-on-elementor-pages/
- WordPress.org support thread: Add To Cart Not Showing Under Elementor Elements:
  https://wordpress.org/support/topic/add-to-cart-not-showing-under-elementor-elements/
- WordPress.org support thread: Woocommerce Add to Cart not redirecting to checkout after clicking:
  https://wordpress.org/support/topic/woocommerce-add-to-cart-not-redirecting-to-checkout-after-clicking/
- WordPress.org plugin: Anywhere Add to Cart:
  https://wordpress.org/plugins/anywhere-add-to-cart/
- WordPress.org plugin: Product Filter Widget for Elementor:
  https://wordpress.org/plugins/product-filter-widget-for-elementor/
- WordPress.org plugin: Product Table for WooCommerce & Elementor:
  https://wordpress.org/plugins/product-table-for-elementor/
- WordPress.org plugin: Filter Everything:
  https://wordpress.org/plugins/filter-everything/
- WordPress.org plugin: Super Product Filter for WooCommerce:
  https://wordpress.org/plugins/super-product-filter/
- WordPress.org plugin: ShopPress:
  https://wordpress.org/plugins/shop-press/
- WordPress.org plugin: ShopMaker:
  https://wordpress.org/plugins/shopmaker/

Conclusion:
- The pain is real and specific: Elementor/WooCommerce users keep needing
  product actions, header/cart access, filters, and quick ordering outside the
  default template flow.
- Elementor covers the basic single/archive builder surface, but the recurring
  requests are about where those actions can live and how lightly they can be
  inserted into custom layouts.
- Full builders are already crowded. A narrower plugin focused on WooCommerce
  interaction superpowers for Elementor is a better fit for the portfolio and
  for client work.
