<?php

//* --------------------------------------------------------
//* PAYMENT METHODS
//* --------------------------------------------------------

if (!defined('ABSPATH')) {
	exit();
}

use Pronamic_Reporting_API_Utilties as Utils;

if ( ! class_exists('Pronamic_Reporting_API_Payments' ) ) {
    
    class Pronamic_Reporting_API_Payments {

        public function __construct() {
            add_action( 'wp_ajax_get_payments', array( $this, 'get_payments_data' ) );
        }

		/**
		 * Process paymenets request
		 *
		 * @return void
		 */
		function get_payments_data()
		{
			header('Content-Type: application/json');
			
			if ( !is_admin() && wp_doing_ajax()) {
				echo json_encode('Permission denied');
				exit;
			}

			$posts 		= $this->get_payments();
			$payments 	= $this->get_payment_details($posts);

			// error_log( print_r( $payments, true ) );

			echo json_encode(array(
				'results'	=> $payments,
			));

			exit;
		}

		/**
		 * Get Payment Data
		 *
		 * @param [type] $range
		 * @param [type] $period
		 * @return void
		 */
		function get_payments()
		{
			global $wpdb;

			$query = $wpdb->prepare(
				"SELECT $wpdb->posts.post_content
				 FROM $wpdb->posts 
				 WHERE $wpdb->posts.post_type = %s 
				 AND $wpdb->posts.post_status = %s
				",
				'pronamic_payment',
				'payment_completed'
			);

			$posts = $wpdb->get_results($query);
			$filtered_posts	 = array();
			foreach ($posts as $post) 
			{
				$content 			= maybe_unserialize($post->post_content);
				$data 				= json_decode($content);
				if ( !empty( $data->id ) ) {
					$filtered_posts[] 	 = $data;
				}
			}
			return $filtered_posts;
		}

		/**
		 * Format payments details
		 *
		 * @return void
		 */
		function get_payment_details($posts)
		{
			$data = array();
			foreach ($posts as $post) {
				$name = Utils::find_name($post);
				$email = Utils::find_email($post);
				$source = get_post_meta($post->id, 'pronamic_payment_source');

				$data[] = array(
					'payment'	=> $post->id,
					'status'	=> isset( $post->status ) ? $post->status : '-',
					'method'	=> isset( $post->payment_method ) ? $post->payment_method : '-',
					'name'		=> $name,
					'email'		=> $email,
					'amount'	=> $post->total_amount->value,
					'date'		=> get_the_date('Y-m-d', $post->id),
					'source'	=> !empty( $source ) ? $source : '-',
				);
			}
			return $data;
		}

    }

}