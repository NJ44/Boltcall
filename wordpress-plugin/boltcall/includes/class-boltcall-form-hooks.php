<?php
/**
 * Native hooks for popular WordPress form plugins.
 * Each hook extracts submission fields server-side and forwards to Boltcall.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Boltcall_Form_Hooks {

	public function __construct() {
		add_action( 'wpcf7_mail_sent', array( $this, 'forward_cf7' ) );
		add_action( 'wpforms_process_complete', array( $this, 'forward_wpforms' ), 10, 4 );
		add_action( 'gform_after_submission', array( $this, 'forward_gravity' ), 10, 2 );
		add_action( 'elementor_pro/forms/new_record', array( $this, 'forward_elementor' ), 10, 2 );
		add_action( 'ninja_forms_after_submission', array( $this, 'forward_ninja' ) );
		add_action( 'fluentform/submission_inserted', array( $this, 'forward_fluent' ), 10, 3 );
	}

	private function is_enabled( $key ) {
		$integrations = get_option(
			'boltcall_integrations',
			array(
				'cf7' => '1', 'wpforms' => '1', 'gravity' => '1',
				'elementor' => '1', 'ninja' => '1', 'fluent' => '1',
			)
		);
		return isset( $integrations[ $key ] ) && '1' === (string) $integrations[ $key ];
	}

	private function dispatch( $fields, $source ) {
		$last_error = get_transient( 'boltcall_last_error' );
		$result = Boltcall_API::send_lead( $fields, $source );
		if ( is_wp_error( $result ) ) {
			set_transient( 'boltcall_last_error', $result->get_error_message(), HOUR_IN_SECONDS );
			error_log( '[Boltcall] ' . $source . ' forward failed: ' . $result->get_error_message() );
		} else {
			delete_transient( 'boltcall_last_error' );
			set_transient( 'boltcall_last_success', current_time( 'mysql' ), DAY_IN_SECONDS );
		}
	}

	public function forward_cf7( $contact_form ) {
		if ( ! $this->is_enabled( 'cf7' ) ) return;
		if ( ! class_exists( 'WPCF7_Submission' ) ) return;
		$submission = WPCF7_Submission::get_instance();
		if ( ! $submission ) return;
		$data = $submission->get_posted_data();
		$this->dispatch( $data, 'wordpress_cf7' );
	}

	public function forward_wpforms( $fields, $entry, $form_data, $entry_id ) {
		if ( ! $this->is_enabled( 'wpforms' ) ) return;
		$flat = array();
		foreach ( (array) $fields as $field ) {
			if ( ! is_array( $field ) ) continue;
			$name  = isset( $field['name'] ) ? $field['name'] : ( isset( $field['id'] ) ? 'field_' . $field['id'] : '' );
			$value = isset( $field['value'] ) ? $field['value'] : '';
			if ( $name && $value !== '' ) {
				$flat[ $name ] = $value;
			}
		}
		$this->dispatch( $flat, 'wordpress_wpforms' );
	}

	public function forward_gravity( $entry, $form ) {
		if ( ! $this->is_enabled( 'gravity' ) ) return;
		$flat = array();
		foreach ( (array) $form['fields'] as $field ) {
			$label = isset( $field->label ) ? $field->label : '';
			$id    = isset( $field->id ) ? $field->id : '';
			if ( ! $label || '' === $id ) continue;
			$value = rgar( $entry, (string) $id );
			if ( $value !== '' ) {
				$flat[ sanitize_title( $label ) ] = $value;
			}
		}
		$this->dispatch( $flat, 'wordpress_gravity' );
	}

	public function forward_elementor( $record, $handler ) {
		if ( ! $this->is_enabled( 'elementor' ) ) return;
		$raw_fields = $record->get( 'fields' );
		$flat = array();
		foreach ( (array) $raw_fields as $id => $field ) {
			$flat[ $id ] = isset( $field['value'] ) ? $field['value'] : '';
		}
		$this->dispatch( $flat, 'wordpress_elementor' );
	}

	public function forward_ninja( $form_data ) {
		if ( ! $this->is_enabled( 'ninja' ) ) return;
		$flat = array();
		if ( isset( $form_data['fields'] ) && is_array( $form_data['fields'] ) ) {
			foreach ( $form_data['fields'] as $field ) {
				$key   = isset( $field['key'] ) ? $field['key'] : ( isset( $field['id'] ) ? 'f_' . $field['id'] : '' );
				$value = isset( $field['value'] ) ? $field['value'] : '';
				if ( $key && $value !== '' ) {
					$flat[ $key ] = $value;
				}
			}
		}
		$this->dispatch( $flat, 'wordpress_ninja' );
	}

	public function forward_fluent( $entry_id, $form_data, $form ) {
		if ( ! $this->is_enabled( 'fluent' ) ) return;
		$this->dispatch( (array) $form_data, 'wordpress_fluent' );
	}
}
