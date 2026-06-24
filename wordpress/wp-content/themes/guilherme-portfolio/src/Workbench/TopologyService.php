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
	private ContextResolver $contexts;
	private ContextStorage $storage;
	private ItemStore $items;
	private RelationStore $relations;
	private SuggestionStore $suggestions;
	private ProviderDataRegistry $providers;
	private CodePageRegistry $code_pages;

	public function __construct(
		ProjectRepository $projects,
		ContextResolver $contexts,
		ContextStorage $storage,
		ItemStore $items,
		RelationStore $relations,
		SuggestionStore $suggestions,
		ProviderDataRegistry $providers,
		CodePageRegistry $code_pages
	) {
		$this->projects     = $projects;
		$this->contexts     = $contexts;
		$this->storage      = $storage;
		$this->items        = $items;
		$this->relations    = $relations;
		$this->suggestions  = $suggestions;
		$this->providers    = $providers;
		$this->code_pages   = $code_pages;
	}

	public function project( int $project_id ): array {
		return $this->context( Context::project_id( $project_id ) );
	}

	public function root(): array {
		return $this->context( Context::ROOT_ID );
	}

	public function context( string $context_id ): array {
		$context = $this->contexts->resolve( $context_id );
		$items   = $this->items->all_for_context( $context );

		return array(
			'root'             => $this->contexts->root()->to_array(),
			'context'          => $context->to_array(),
			'project'          => $this->legacy_project_payload( $context ),
			'config'           => $this->storage->config( $context ),
			'frontpage'        => $this->frontpage_state(),
			'context_options'  => $this->contexts->options(),
			'categories'       => CategoryRegistry::all(),
			'items'            => $items,
			'groups'           => $this->group_items( $items ),
			'relations'        => $this->relations->all_for_context( $context ),
			'suggestions'      => $this->suggestions->all_for_context( $context ),
			'providers'        => $this->providers->providers(),
			'provider_records' => $this->providers->records(),
			'code_pages'       => $this->code_pages->all(),
		);
	}

	public function project_options(): array {
		return $this->projects->project_options();
	}

	public function context_options(): array {
		return $this->contexts->options();
	}

	private function frontpage_state(): array {
		return array(
			'show_on_front' => get_option( 'show_on_front' ),
			'front_page_id' => (int) get_option( 'page_on_front' ),
			'posts_page_id' => (int) get_option( 'page_for_posts' ),
		);
	}

	private function legacy_project_payload( Context $context ): array {
		return array(
			'id'     => $context->is_project() ? $context->object_id() : 0,
			'title'  => $context->label(),
			'status' => $context->status(),
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
