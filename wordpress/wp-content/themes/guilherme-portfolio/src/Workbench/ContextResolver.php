<?php
/**
 * Resolve Workbench context IDs into concrete WordPress-backed contexts.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench;

use GuilhermePortfolio\Projects\ProjectRepository;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class ContextResolver {

	private ProjectRepository $projects;

	public function __construct( ProjectRepository $projects ) {
		$this->projects = $projects;
	}

	public function resolve( string $context_id ): Context {
		$context_id = trim( $context_id );

		if ( '' === $context_id || Context::ROOT_ID === $context_id ) {
			return $this->root();
		}

		if ( ctype_digit( $context_id ) ) {
			return $this->project( absint( $context_id ) );
		}

		if ( 0 === strpos( $context_id, Context::PROJECT_PREFIX ) ) {
			return $this->project( absint( substr( $context_id, strlen( Context::PROJECT_PREFIX ) ) ) );
		}

		throw new \InvalidArgumentException( 'Unsupported Workbench context.' );
	}

	public function root(): Context {
		$front_page_id = (int) get_option( 'page_on_front' );
		$front_page    = $front_page_id ? get_post( $front_page_id ) : null;

		return Context::root( $front_page instanceof \WP_Post ? $front_page : null );
	}

	public function project( int $project_id ): Context {
		$project = get_post( $project_id );

		if ( ! $project || ProjectRepository::POST_TYPE !== $project->post_type ) {
			throw new \InvalidArgumentException( 'Portfolio project not found.' );
		}

		return Context::project( $project );
	}

	public function options(): array {
		$options = array(
			Context::ROOT_ID => __( 'Portfolio Front Page', 'guilherme-portfolio' ),
		);

		foreach ( $this->projects->project_options() as $id => $title ) {
			$options[ Context::project_id( absint( $id ) ) ] = $title;
		}

		return $options;
	}
}
