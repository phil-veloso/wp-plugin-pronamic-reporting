<?php
/**
 * Plugin Name: Pronamic Reporting
 * Plugin URI: https://github.com/phil-veloso/wp-plugin-pronamic-reporting
 * Description: Custom reporting dashboard for Pronamic Payments built in React.
 * Version: 1.0.1
 * Author: Phil Veloso
 * Author URI: https://philveloso.com
 * License: GPLv2 or later
 */

if (!defined('ABSPATH')) {
	exit();
}

if ( ! class_exists( 'Pronamic_Reporting_Admin' ) ) {

    define( 'WP_REACT_ADMIN_URL', plugin_dir_url( __FILE__ ) );
    define( 'WP_REACT_ADMIN_DIR', __DIR__ );

	require_once( WP_REACT_ADMIN_DIR . '/lib/class-pronamic-reporting-utilities.php');

    class Pronamic_Reporting_Admin {

        public function __construct() {
            $this->register_autoloads();
            $this->init();
        }

        private function register_autoloads() {
            spl_autoload_register(function($name){
				$name = strtolower($name);
				$name = str_replace('_', '-', $name);
				$name = 'class-' . $name;
				$file = __DIR__ . '/lib/' . $name . '.php';

				if ( file_exists( $file ) ) {
					require_once $file;
				}
			});
        }

        public function init() {
            new Pronamic_Reporting_Admin_Page();
            new Pronamic_Reporting_API_Payments();
            new Pronamic_Reporting_API_Subscriptions();
        }

    }
    new Pronamic_Reporting_Admin();

}