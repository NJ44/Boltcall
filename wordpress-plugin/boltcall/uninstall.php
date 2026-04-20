<?php
/**
 * Uninstall handler — removes all Boltcall options when the plugin is deleted.
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

$options = array(
	'boltcall_user_id',
	'boltcall_enabled',
	'boltcall_auto_capture',
	'boltcall_form_selector',
	'boltcall_integrations',
);

foreach ( $options as $option ) {
	delete_option( $option );
	delete_site_option( $option );
}

delete_transient( 'boltcall_last_success' );
delete_transient( 'boltcall_last_error' );
