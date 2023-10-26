<?php

if (!defined('ABSPATH')) {
	exit();
}

//* --------------------------------------------------------
//* SUBSCRIBER METHODS
//* --------------------------------------------------------

use Pronamic_Reporting_API_Utilties as Utils;

if ( ! class_exists('Pronamic_Reporting_API_Subscriptions' ) ) {
    
    class Pronamic_Reporting_API_Subscriptions {

        public function __construct() {
            add_action( 'wp_ajax_get_subscriptions', array( $this, 'get_subscriptions_data' ) );
        }

		/**
		 * Process subscriptions request
		 *
		 * @return void
		 */
		function get_subscriptions_data()
		{
			header('Content-Type: application/json');

			if (!is_admin() && wp_doing_ajax()) {
				echo json_encode('Permission denied');
				exit;
			}

			$posts 			= $this->get_subscriptions();
			$subscribers 	= $this->get_subscription_details($posts);
			$intervals 		= $this->get_subscription_intervals($posts);

			echo json_encode(array(
				'results'	 => $subscribers,
				'intervals'	 => $intervals,
			));

			exit;
		}

		public function get_subscriptions()
		{
			global $wpdb;

			$query = $wpdb->prepare(
				"SELECT $wpdb->posts.post_content
				 FROM $wpdb->posts 
				 WHERE $wpdb->posts.post_type = %s
				 AND $wpdb->posts.post_status = %s
				",
				'pronamic_pay_subscr',
				'subscr_active'
			);

			$posts = $wpdb->get_results($query);

			$filtered_posts	 = array();
			foreach ($posts as $post) {
				$content = maybe_unserialize($post->post_content);
				$data = json_decode($content);

				$active_phases = array();

				$phases = $data->phases;
				foreach ($phases as $phase) {
					$active_phases[] = $phase;
				}

				if (!empty($active_phases)) {
					$subscriber 			= $data;
					$subscriber->phases 	= $active_phases;
					$filtered_posts[] 		 = $subscriber;
				}
			}

			return $filtered_posts;
		}



		function get_subscription_intervals($posts)
		{
			$intervals = array();
			foreach ($posts as $post) {
				$phases = $post->phases;
				$sub_id = $post->id;
				foreach ($phases as $phase) {
					$value = $phase->amount->value;
					$interval = $phase->interval;
					if (array_key_exists($interval, $intervals)) {
						$intervals[$interval][$sub_id] = $value;
					} else {
						$intervals[$interval] = array(
							$sub_id => $value
						);
					}
				}
			}
			return $intervals;
		}

		/**
		 * Format subscriber details
		 *
		 * @return void
		 */
		function get_subscription_details($posts)
		{
			$data = array();
			foreach ($posts as $post) 
			{
				$total = $this->get_subscriber_total( $post->phases );
				$name = Utils::find_name( $post );
				$email = Utils::find_email( $post );
				$next = property_exists($post, 'next_payment_date') ? $post->next_payment_date : null;
				$nextDate = !empty( $next ) ? new DateTime( $next ) : null;
				
				$source = get_post_meta($post->id, 'pronamic_payment_source');
				error_log(print_r(get_post_meta($post->id, 'pronamic_payment_source'), true));

				$data[] = array(
					'subscriber'=> $post->id,
					'name'		=> $name,
					'email'		=> $email,
					'date'		=> get_the_date('Y-m-d', $post->id),
					'amount'	=> $post->phases[0]->amount->value,
					'period'	=> $post->phases[0]->interval,
					'next'		=> ! empty( $nextDate ) ? $nextDate->format('Y-m-d') : '-',
					'total'		=> $total,
					'status'	=> $post->status,
					'source'	=> !empty($source) ? $source : '-',
				);
			}
			return $data;
		}

		/*
		 * Count total amount from phases
		 *
		 * @param [type] $phases
		 * @return void
		 */
		function get_subscriber_total( $phases )
		{
			$total = 0;
			foreach( $phases as $phase )
			{
				$total += $phase->amount->value;
			}
			return $total;
		} 




    }

}