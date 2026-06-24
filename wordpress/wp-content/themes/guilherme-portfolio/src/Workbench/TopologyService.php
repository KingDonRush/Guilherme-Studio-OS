<?php
/**
 * Read model for Portfolio Workbench context.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench;

use GuilhermePortfolio\Projects\ProjectRepository;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class TopologyService {

	private ProjectRepository $projects;
	private ItemStore $items;
	private RelationStore $relations;
	private SuggestionStore $suggestions;
	private ProviderDataRegistry $providers;

	public function __construct(
		ProjectRepository $projects,
		ItemStore $items,
		RelationStore $relations,
		SuggestionStore $suggestions,
		ProviderDataRegistry $providers
	) {
		$this->projects     = $projects;
		$this->items        = $items;
		$this->relations    = $relations;
		$this->suggestions  = $suggestions;
		$this->providers    = $providers;
	}

	public function project( int $project_id ): array {
		$project = $this->require_project( $project_id );
		$items   = $this->items->all( $project_id );

		return array(
			'root'        => $this->front_page(),
			'project'     => $this->project_payload( $project ),
			'config'      => $this->projects->config( $project_id ),
			'categories'  => CategoryRegistry::all(),
			'items'       => $items,
			'groups'      => $this->group_items( $items ),
			'relations'   => $this->relations->all( $project_id ),
			'suggestions' => $this->suggestions->all( $project_id ),
			'providers'   => $this->providers->providers(),
			'provider_records' => $this->providers->records(),
		);
	}

	public function project_options(): array {
		return $this->projects->project_options();
	}

	private function require_project( int $project_id ): \WP_Post {
		$project = get_post( $project_id );

		if ( ! $project || ProjectRepository::POST_TYPE !== $project->post_type ) {
			throw new \InvalidArgumentException( 'Portfolio project not found.' );
		}

		return $project;
	}

	private function front_page(): array {
		$front_page_id = (int) get_option( 'page_on_front' );
		$front_page    = $front_page_id ? get_post( $front_page_id ) : null;

		return array(
			'id'     => $front_page ? $front_page->ID : 0,
			'label'  => $front_page ? get_the_title( $front_page ) : __( 'Portfolio Front Page', 'guilherme-portfolio' ),
			'type'   => 'front_page',
			'status' => $front_page ? $front_page->post_status : 'missing',
		);
	}

	private function project_payload( \WP_Post $project ): array {
		return array(
			'id'     => $project->ID,
			'title'  => get_the_title( $project ),
			'status' => $project->post_status,
		);
	}

	private function group_items( array $items ): array {
		$groups = array_fill_keys( array_keys( CategoryRegistry::all() ), array() );

		foreach ( $items as $item ) {
			$category = CategoryRegistry::sanitize( $item['category'] );
			$groups[ $category ][] = $item;
		}

		return $groups;
	}
}
