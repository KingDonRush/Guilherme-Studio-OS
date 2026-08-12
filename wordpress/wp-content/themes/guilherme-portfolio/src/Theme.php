<?php
/**
 * Theme service bootstrap.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio;

use GuilhermePortfolio\Areas\Admin\AreaMapActions;
use GuilhermePortfolio\Areas\Admin\AreaMapPage;
use GuilhermePortfolio\Areas\Admin\Views\AreaFormsView;
use GuilhermePortfolio\Areas\Admin\Views\AreaMapContextView;
use GuilhermePortfolio\Areas\Admin\Views\AreaMapModalView;
use GuilhermePortfolio\Areas\Admin\Views\AreaMapSidebarView;
use GuilhermePortfolio\Areas\Admin\Views\AreaMapView;
use GuilhermePortfolio\Areas\AreaItemRepository;
use GuilhermePortfolio\Areas\AreaPostType;
use GuilhermePortfolio\Areas\AreaRepository;
use GuilhermePortfolio\Areas\DestinationResolver;
use GuilhermePortfolio\CLI\AreaCommand;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Theme {

	private static bool $booted = false;

	public static function boot(): void {
		if ( self::$booted ) {
			return;
		}

		self::$booted = true;

		$areas        = new AreaRepository();
		$items        = new AreaItemRepository( $areas );
		$destinations = new DestinationResolver();
		$forms        = new AreaFormsView();
		$modals       = new AreaMapModalView( $forms );
		$sidebar      = new AreaMapSidebarView();
		$context      = new AreaMapContextView( $forms, $destinations );

		( new AreaPostType() )->init_hooks();
		( new AreaMapActions( $areas, $items ) )->init_hooks();
		( new AreaMapPage( $areas, $items, new AreaMapView( $destinations, $sidebar, $modals, $context ) ) )->init_hooks();
		( new AreaCommand( $areas, $items, $destinations ) )->init_hooks();
	}
}
