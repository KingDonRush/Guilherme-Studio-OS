<?php
/**
 * Small helpers for Portfolio Workbench WP-CLI commands.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\CLI;

use GuilhermePortfolio\Workbench\CodePageRegistry;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class WorkbenchCommandSupport {

	public static function item_args( array $assoc_args ): array {
		return array(
			'id'          => $assoc_args['id'] ?? '',
			'type'        => $assoc_args['type'] ?? 'custom',
			'label'       => $assoc_args['label'] ?? '',
			'object_id'   => $assoc_args['object-id'] ?? '',
			'object_type' => $assoc_args['object-type'] ?? '',
			'category'    => $assoc_args['category'] ?? 'content',
			'role'        => $assoc_args['role'] ?? 'other',
			'provider'    => $assoc_args['provider'] ?? 'manual',
			'state'       => $assoc_args['state'] ?? 'manual',
			'notes'       => $assoc_args['notes'] ?? '',
		);
	}

	public static function page_args( array $assoc_args ): array {
		if ( empty( $assoc_args['title'] ) ) {
			\WP_CLI::error( 'Use --title=<text> for the new page.' );
		}

		return array(
			'title'    => $assoc_args['title'],
			'status'   => $assoc_args['status'] ?? 'draft',
			'category' => $assoc_args['category'] ?? 'pages',
			'role'     => $assoc_args['role'] ?? 'other',
			'notes'    => $assoc_args['notes'] ?? '',
		);
	}

	public static function relation_args( array $assoc_args ): array {
		foreach ( array( 'source', 'relation', 'target' ) as $required ) {
			if ( empty( $assoc_args[ $required ] ) ) {
				\WP_CLI::error( 'Use --source=<id>, --relation=<type> and --target=<id>.' );
			}
		}

		return array(
			'id'       => $assoc_args['id'] ?? '',
			'source'   => $assoc_args['source'],
			'relation' => $assoc_args['relation'],
			'target'   => $assoc_args['target'],
			'provider' => $assoc_args['provider'] ?? 'manual',
			'state'    => $assoc_args['state'] ?? 'needs_review',
			'notes'    => $assoc_args['notes'] ?? '',
		);
	}

	public static function suggestion_args( array $assoc_args ): array {
		if ( empty( $assoc_args['label'] ) ) {
			\WP_CLI::error( 'Use --label=<text> for the suggestion.' );
		}

		return array(
			'id'       => $assoc_args['id'] ?? '',
			'label'    => $assoc_args['label'],
			'type'     => $assoc_args['type'] ?? 'relation',
			'provider' => $assoc_args['provider'] ?? 'manual',
			'state'    => $assoc_args['state'] ?? 'pending',
			'notes'    => $assoc_args['notes'] ?? '',
			'payload'  => array(
				'source'   => $assoc_args['source'] ?? '',
				'relation' => $assoc_args['relation'] ?? '',
				'target'   => $assoc_args['target'] ?? '',
			),
		);
	}

	public static function code_page_rows( CodePageRegistry $code_pages ): array {
		$rows = array();

		foreach ( $code_pages->all() as $id => $page ) {
			$page['id'] = $id;
			$rows[]     = $page;
		}

		return $rows;
	}

	public static function record_arg( array $args, array $assoc_args, string $message ): string {
		$index = isset( $assoc_args['context'] ) ? 1 : 2;
		$value = $args[ $index ] ?? '';

		if ( '' === trim( (string) $value ) ) {
			\WP_CLI::error( $message );
		}

		return (string) $value;
	}

	public static function success_payload( string $message, array $payload, array $assoc_args ): void {
		if ( 'json' === ( $assoc_args['format'] ?? '' ) ) {
			self::line_json( $payload, $assoc_args );
			return;
		}

		\WP_CLI::success( $message );
	}

	public static function format_items( array $assoc_args, array $items, array $fields ): void {
		\WP_CLI\Utils\format_items( $assoc_args['format'] ?? 'table', $items, $fields );
	}

	public static function line_json( array $payload, array $assoc_args ): void {
		if ( 'table' === ( $assoc_args['format'] ?? '' ) ) {
			self::format_items( $assoc_args, array( $payload ), array_keys( $payload ) );
			return;
		}

		\WP_CLI::line( wp_json_encode( $payload ) );
	}
}
