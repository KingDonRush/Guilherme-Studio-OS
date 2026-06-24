<?php
/**
 * Shared storage for root and project Workbench contexts.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench;

use GuilhermePortfolio\Projects\ProjectRepository;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class ContextStorage {

	private const ROOT_CONFIG = 'gp_workbench_root_config';
	private const ROOT_ITEMS = 'gp_workbench_root_items';
	private const ROOT_RELATIONS = 'gp_workbench_root_relations';
	private const ROOT_SUGGESTIONS = 'gp_workbench_root_suggestions';

	private ProjectRepository $projects;

	public function __construct( ProjectRepository $projects ) {
		$this->projects = $projects;
	}

	public function config( Context $context ): array {
		if ( $context->is_project() ) {
			return $this->projects->config( $context->object_id() );
		}

		return $this->projects->sanitize_config( get_option( self::ROOT_CONFIG, array() ) );
	}

	public function save_config( Context $context, array $raw ): void {
		if ( $context->is_project() ) {
			$this->projects->save_config( $context->object_id(), $raw );
			return;
		}

		update_option( self::ROOT_CONFIG, $this->projects->sanitize_config( $raw ), false );
	}

	public function items( Context $context ): array {
		return ItemStore::sanitize_items( $this->read( $context, WorkbenchMeta::ITEMS, self::ROOT_ITEMS ) );
	}

	public function save_items( Context $context, array $items ): void {
		$this->write( $context, WorkbenchMeta::ITEMS, self::ROOT_ITEMS, $items );
	}

	public function relations( Context $context ): array {
		return RelationStore::sanitize_relations( $this->read( $context, WorkbenchMeta::RELATIONS, self::ROOT_RELATIONS ) );
	}

	public function save_relations( Context $context, array $relations ): void {
		$this->write( $context, WorkbenchMeta::RELATIONS, self::ROOT_RELATIONS, $relations );
	}

	public function suggestions( Context $context ): array {
		return SuggestionStore::sanitize_suggestions( $this->read( $context, WorkbenchMeta::SUGGESTIONS, self::ROOT_SUGGESTIONS ) );
	}

	public function save_suggestions( Context $context, array $suggestions ): void {
		$this->write( $context, WorkbenchMeta::SUGGESTIONS, self::ROOT_SUGGESTIONS, $suggestions );
	}

	private function read( Context $context, string $project_key, string $root_key ) {
		if ( $context->is_project() ) {
			return get_post_meta( $context->object_id(), $project_key, true );
		}

		return get_option( $root_key, array() );
	}

	private function write( Context $context, string $project_key, string $root_key, array $value ): void {
		if ( $context->is_project() ) {
			update_post_meta( $context->object_id(), $project_key, $value );
			return;
		}

		update_option( $root_key, $value, false );
	}
}
