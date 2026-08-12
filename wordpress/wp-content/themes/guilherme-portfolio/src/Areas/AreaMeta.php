<?php
/**
 * Area storage keys.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Areas;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class AreaMeta {

	public const STATUS = '_gp_area_status';
	public const NOTES  = '_gp_area_notes';
	public const ITEMS  = '_gp_area_items';
}
