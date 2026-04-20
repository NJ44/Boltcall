<?php
/**
 * Injects the Boltcall form.js embed script into the site footer
 * so generic <form data-boltcall> elements are captured.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Boltcall_Embed {

	public function __construct() {
		add_action( 'wp_footer', array( $this, 'render_script' ), 99 );
	}

	public function render_script() {
		$user_id  = trim( (string) get_option( 'boltcall_user_id', '' ) );
		$enabled  = '1' === get_option( 'boltcall_enabled', '1' );
		if ( ! $user_id || ! $enabled ) {
			return;
		}

		$selector = (string) get_option( 'boltcall_form_selector', 'form[data-boltcall]' );
		$auto     = '1' === get_option( 'boltcall_auto_capture', '0' );

		$attrs = array(
			'src'           => BOLTCALL_API_BASE . '/form.js',
			'data-user-id'  => $user_id,
			'data-source'   => 'wordpress',
			'data-forms'    => $selector,
			'async'         => 'async',
		);
		if ( $auto ) {
			$attrs['data-auto'] = 'true';
		}

		$html = '<script';
		foreach ( $attrs as $k => $v ) {
			$html .= ' ' . esc_attr( $k ) . '="' . esc_attr( $v ) . '"';
		}
		$html .= '></script>';

		echo "\n<!-- Boltcall Lead Capture -->\n" . $html . "\n";
	}
}
