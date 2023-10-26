<?php

if ( ! class_exists( 'Pronamic_Reporting_Admin_Page' ) ) {
    
    class Pronamic_Reporting_Admin_Page {

        public function __construct() {
            add_action( 'admin_menu', array( $this, 'add_menus' ) );
            add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
        }

        public function add_menus() {
            add_menu_page(
				'Pronamic Reporting',
				'Pronamic Reporting',
				'administrator', // capability
				'pronamic-reporting',
				array( $this, 'admin_page' ),
				'dashicons-chart-area', // icon URL
				null // position
			);		
			add_submenu_page(
				'pronamic-reporting',
				'Payments',
				'Payments',
				'administrator',
				'pronamic-reporting-payments',
				array($this, 'admin_page'),
			);			
			add_submenu_page(
				'pronamic-reporting',
				'Subscriptions',
				'Subscriptions',
				'administrator',
				'pronamic-reporting-subscriptions',
				array($this, 'admin_page'),
			);
			remove_submenu_page('pronamic-reporting', 'pronamic-reporting');

        }
		
        public function admin_page() 
		{			 
            echo '<div id="wp-admin-plugin-page-root"></div>';
        }

        public function enqueue_assets($hook) 
		{

			$admin_pages = array(
				'toplevel_page_pronamic-reporting',
				'pronamic-reporting_page_pronamic-reporting-payments',
				'pronamic-reporting_page_pronamic-reporting-subscriptions',
			);

			if ( !in_array( $hook, $admin_pages ) ) {
				return;
			}
            $script      = 'assets/bundle.js';
            $script_file = WP_REACT_ADMIN_DIR . '/' . $script;

            if ( file_exists( $script_file ) ) {
                wp_enqueue_script( 'pronamic-reporting', WP_REACT_ADMIN_URL . $script, array(), filemtime( $script_file ), true );
            }
            $style      = 'assets/bundle.css';
            $style_file = WP_REACT_ADMIN_DIR . '/' . $style;

            if ( file_exists( $style_file ) ) {
                wp_enqueue_style( 'pronamic-reporting', WP_REACT_ADMIN_URL . $style, array(), filemtime( $style_file ) );
            }
        }
        
    }

}