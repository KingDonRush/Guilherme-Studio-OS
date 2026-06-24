<?php
/**
 * Workbench context value object.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Context {

	public const ROOT_ID = 'root';
	public const PROJECT_PREFIX = 'project:';
	public const PAGE_PREFIX = 'page:';
	public const SECTION_PREFIX = 'section:';

	private string $id;
	private string $type;
	private int $object_id;
	private string $label;
	private string $status;

	public function __construct( string $id, string $type, int $object_id, string $label, string $status ) {
		$this->id        = $id;
		$this->type      = sanitize_key( $type );
		$this->object_id = absint( $object_id );
		$this->label     = WorkbenchSanitizer::label( $label );
		$this->status    = sanitize_key( $status );
	}

	public static function root( ?\WP_Post $front_page ): self {
		return new self(
			self::ROOT_ID,
			'root',
			$front_page ? (int) $front_page->ID : 0,
			$front_page ? get_the_title( $front_page ) : __( 'Portfolio Front Page', 'guilherme-portfolio' ),
			$front_page ? $front_page->post_status : 'missing_frontpage'
		);
	}

	public static function project( \WP_Post $project ): self {
		return new self(
			self::project_id( (int) $project->ID ),
			'project',
			(int) $project->ID,
			get_the_title( $project ),
			$project->post_status
		);
	}

	public static function project_id( int $project_id ): string {
		return self::PROJECT_PREFIX . absint( $project_id );
	}

	public static function page_id( int $page_id ): string {
		return self::PAGE_PREFIX . absint( $page_id );
	}

	public static function section_id( string $section_slug ): string {
		return self::SECTION_PREFIX . sanitize_title( $section_slug );
	}

	public function id(): string {
		return $this->id;
	}

	public function type(): string {
		return $this->type;
	}

	public function object_id(): int {
		return $this->object_id;
	}

	public function label(): string {
		return $this->label;
	}

	public function status(): string {
		return $this->status;
	}

	public function is_project(): bool {
		return 'project' === $this->type;
	}

	public function is_root(): bool {
		return 'root' === $this->type;
	}

	public function to_array(): array {
		return array(
			'id'        => $this->id,
			'type'      => $this->type,
			'object_id' => $this->object_id,
			'label'     => $this->label,
			'status'    => $this->status,
		);
	}
}
