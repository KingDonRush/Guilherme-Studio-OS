<?php
/**
 * Read-only plugin provider hints for the Workbench.
 *
 * @package GuilhermePortfolio
 */

namespace GuilhermePortfolio\Workbench;

use GuilhermePortfolio\Projects\ProjectRepository;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class ProviderDataRegistry {

	public function providers(): array {
		return ProjectRepository::integrations();
	}

	public function records(): array {
		$records = array_merge(
			$this->simple_budget_records(),
			$this->implementation_toolkit_records()
		);

		/**
		 * Extend read-only provider data shown in Portfolio Workbench.
		 *
		 * @param array<int,array<string,mixed>> $records Provider records.
		 */
		$records = apply_filters( 'gp_project_workbench_provider_records', $records );

		return array_values( array_map( array( $this, 'normalize_record' ), is_array( $records ) ? $records : array() ) );
	}

	private function simple_budget_records(): array {
		if ( ! class_exists( '\SBP\Support\BudgetValueFields' ) ) {
			return array();
		}

		try {
			$fields = \SBP\Support\BudgetValueFields::all_fields();
		} catch ( \Throwable $error ) {
			return $this->error_record( 'simple_budget', 'sbp-fields-error', $error->getMessage() );
		}

		$records = array();

		foreach ( array_slice( $fields, 0, 40 ) as $key => $field ) {
			$records[] = array(
				'id'       => 'sbp-field-' . sanitize_key( $key ),
				'provider' => 'simple_budget',
				'type'     => 'value_field',
				'label'    => $field['label'] ?? $key,
				'summary'  => sprintf(
					/* translators: 1: field type, 2: meta key. */
					__( '%1$s field at %2$s', 'guilherme-portfolio' ),
					$field['type'] ?? 'field',
					$key
				),
				'status'   => empty( $field['system'] ) ? 'custom' : 'system',
				'payload'  => array(
					'key'        => $key,
					'type'       => $field['type'] ?? '',
					'unit'       => $field['unit'] ?? '',
					'display'    => ! empty( $field['display'] ) ? 'yes' : 'no',
					'filterable' => ! empty( $field['filterable'] ) ? 'yes' : 'no',
				),
			);
		}

		return $records;
	}

	private function implementation_toolkit_records(): array {
		$records = array_merge(
			$this->eit_field_catalog_records(),
			$this->eit_filter_preset_records()
		);

		return array_slice( $records, 0, 80 );
	}

	private function eit_field_catalog_records(): array {
		if ( ! class_exists( '\EIT\Support\ToolkitFieldCatalog' ) ) {
			return array();
		}

		try {
			$entries = \EIT\Support\ToolkitFieldCatalog::entries();
		} catch ( \Throwable $error ) {
			return $this->error_record( 'implementation_toolkit', 'eit-field-catalog-error', $error->getMessage() );
		}

		$records = array();

		foreach ( array_slice( $entries, 0, 60 ) as $entry ) {
			$records[] = array(
				'id'       => 'eit-field-' . sanitize_key( $entry['key'] ?? '' ),
				'provider' => 'implementation_toolkit',
				'type'     => 'field_catalog',
				'label'    => $entry['label'] ?? $entry['key'] ?? __( 'Toolkit field', 'guilherme-portfolio' ),
				'summary'  => sprintf(
					/* translators: 1: field source, 2: post type. */
					__( '%1$s source for %2$s', 'guilherme-portfolio' ),
					$entry['source'] ?? 'field',
					$entry['post_type'] ?? 'external'
				),
				'status'   => 'available',
				'payload'  => $entry,
			);
		}

		return $records;
	}

	private function eit_filter_preset_records(): array {
		if ( ! class_exists( '\EIT\Support\FilterPresets' ) ) {
			return array();
		}

		try {
			$presets = \EIT\Support\FilterPresets::all();
		} catch ( \Throwable $error ) {
			return $this->error_record( 'implementation_toolkit', 'eit-filter-presets-error', $error->getMessage() );
		}

		$records = array();

		foreach ( array_slice( $presets, 0, 20 ) as $id => $preset ) {
			$filters = is_array( $preset['filters'] ?? null ) ? $preset['filters'] : array();
			$records[] = array(
				'id'       => 'eit-preset-' . sanitize_key( $id ),
				'provider' => 'implementation_toolkit',
				'type'     => 'filter_preset',
				'label'    => $preset['name'] ?? $id,
				'summary'  => sprintf(
					/* translators: %d: filter count. */
					_n( '%d filter', '%d filters', count( $filters ), 'guilherme-portfolio' ),
					count( $filters )
				),
				'status'   => 'available',
				'payload'  => array(
					'id'             => $id,
					'provider_mode'  => $preset['provider_mode'] ?? '',
					'target_selector' => $preset['target_selector'] ?? '',
				),
			);
		}

		return $records;
	}

	private function error_record( string $provider, string $id, string $message ): array {
		return array(
			array(
				'id'       => $id,
				'provider' => $provider,
				'type'     => 'error',
				'label'    => __( 'Provider read error', 'guilherme-portfolio' ),
				'summary'  => $message,
				'status'   => 'error',
				'payload'  => array(),
			),
		);
	}

	private function normalize_record( array $record ): array {
		return array(
			'id'       => WorkbenchSanitizer::id( $record['id'] ?? '', 'provider-record' ),
			'provider' => WorkbenchSanitizer::key( $record['provider'] ?? 'manual', 'manual' ),
			'type'     => WorkbenchSanitizer::key( $record['type'] ?? 'hint', 'hint' ),
			'label'    => WorkbenchSanitizer::label( $record['label'] ?? __( 'Provider record', 'guilherme-portfolio' ) ),
			'summary'  => WorkbenchSanitizer::label( $record['summary'] ?? '', 180 ),
			'status'   => WorkbenchSanitizer::key( $record['status'] ?? 'available', 'available' ),
			'payload'  => WorkbenchSanitizer::payload( $record['payload'] ?? array() ),
		);
	}
}
