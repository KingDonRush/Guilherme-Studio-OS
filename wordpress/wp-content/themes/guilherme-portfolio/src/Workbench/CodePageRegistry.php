<?php
/**
 * Theme-owned page definitions that can be materialized on demand.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class CodePageRegistry {

	public const SCOPE_ROOT = 'root';
	public const SCOPE_ANY = 'any';

	public function all(): array {
		$definitions = apply_filters(
			'gp_workbench_code_pages',
			array(
				'portfolio-home' => array(
					'title'         => __( 'Portfolio Home', 'guilherme-portfolio' ),
					'slug'          => 'portfolio-home',
					'status'        => 'draft',
					'category'      => 'entry',
					'role'          => 'home',
					'provider'      => 'code',
					'scope'         => self::SCOPE_ROOT,
					'set_frontpage' => true,
					'notes'         => __( 'Theme-defined root page for the portfolio front page.', 'guilherme-portfolio' ),
				),
				'portfolio-notes' => array(
					'title'          => __( 'Portfolio Notes', 'guilherme-portfolio' ),
					'slug'           => 'portfolio-notes',
					'status'         => 'draft',
					'category'       => 'content',
					'role'           => 'blog_index',
					'provider'       => 'code',
					'scope'          => self::SCOPE_ROOT,
					'set_posts_page' => true,
					'notes'          => __( 'Theme-defined blog index for future portfolio writing.', 'guilherme-portfolio' ),
				),
			)
		);

		$clean = array();

		foreach ( (array) $definitions as $id => $definition ) {
			$id = WorkbenchSanitizer::id( $id );

			if ( '' !== $id && is_array( $definition ) ) {
				$clean[ $id ] = $this->sanitize_definition( $definition );
			}
		}

		return $clean;
	}

	public function find( string $id ): ?array {
		$id          = WorkbenchSanitizer::id( $id );
		$definitions = $this->all();

		return $definitions[ $id ] ?? null;
	}

	private function sanitize_definition( array $raw ): array {
		$title = WorkbenchSanitizer::label( $raw['title'] ?? '', 140 );
		$scope = WorkbenchSanitizer::allowed( $raw['scope'] ?? self::SCOPE_ANY, array( self::SCOPE_ROOT, self::SCOPE_ANY ), self::SCOPE_ANY );

		return array(
			'title'          => '' !== $title ? $title : __( 'Untitled coded page', 'guilherme-portfolio' ),
			'slug'           => sanitize_title( $raw['slug'] ?? $title ),
			'status'         => $this->status( $raw['status'] ?? 'draft' ),
			'category'       => CategoryRegistry::sanitize( $raw['category'] ?? 'pages' ),
			'role'           => WorkbenchSanitizer::key( $raw['role'] ?? 'other', 'other' ),
			'provider'       => WorkbenchSanitizer::key( $raw['provider'] ?? 'code', 'code' ),
			'scope'          => $scope,
			'set_frontpage'  => ! empty( $raw['set_frontpage'] ),
			'set_posts_page' => ! empty( $raw['set_posts_page'] ),
			'notes'          => WorkbenchSanitizer::notes( $raw['notes'] ?? '' ),
		);
	}

	private function status( $status ): string {
		$status = sanitize_key( $status );

		return in_array( $status, array( 'draft', 'publish', 'private', 'pending' ), true ) ? $status : 'draft';
	}
}
