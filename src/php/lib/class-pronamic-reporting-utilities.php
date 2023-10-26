<?php

if (!class_exists('Pronamic_Reporting_API_Utilties')) {

	class Pronamic_reporting_API_Utilties
	{

		//* --------------------------------------------------------
		//* HELPER METHODS
		//* --------------------------------------------------------

		public static function calculate_median($values)
		{
			sort($values);
			$count = count($values);
			$median_value = 0;
			$middleval = floor(($count - 1) / 2);
			if ($count % 2) {
				$median_value = $values[$middleval];
			} else {
				$low = $values[$middleval];
				$high = $values[$middleval + 1];
				$median_value = (($low + $high) / 2);
			}
			return $median_value;
		}

		public static function find_name($post)
		{
			if (empty($post)) {
				return '-';
			}

			$fname = '';
			$lname = '';

			if (property_exists($post, 'customer')) {
				if ( !empty( $post->customer) ) {
					if (property_exists($post->customer, 'name')) {
						if (property_exists($post->customer->name, 'full_name')) {
							return $post->customer->name->full_name;
						}
						if (property_exists($post->customer->name, 'first_name')) {
							$fname = $post->customer->name->first_name;
						}
						if (property_exists($post->customer->name, 'last_name')) {
							$lname = $post->customer->name->last_name;
						}
						if (!empty($fname) || !empty($lname)) {
							return sprintf('%s %s', $fname, $lname);
						}
					}
				}
			}

			if (property_exists($post, 'billing_address')) {
				if ( !empty( $post->billing_address ) ) {
					if (property_exists($post->billing_address, 'name')) {
						if (property_exists($post->billing_address->name, 'full_name')) {
							return $post->billing_address->name->full_name;
						}
						if (property_exists($post->billing_address->name, 'first_name')) {
							$fname = $post->billing_address->name->first_name;
						}
						if (property_exists($post->billing_address->name, 'last_name')) {
							$lname = $post->billing_address->name->last_name;
						}
						if (!empty($fname) || !empty($lname)) {
							return sprintf('%s %s', $fname, $lname);
						}
					}
				}
			}

			return '-';
		}

		public static function find_email($post)
		{
			if (empty($post)) {
				return '-';
			}
						
			if (property_exists($post, 'billing_address') ) {
				if ( !empty( $post->billing_address ) ) {
					if ( property_exists($post->billing_address, 'email') ) {
						return $post->billing_address->email;
					}
				}
			}
			if (property_exists($post, 'customer') ) {
				if ( !empty( $post->customer ) ) {
					if ( property_exists($post->customer, 'email') ) {
						return $post->customer->email;
					}
				}
			}

			return '-';
		}
	}
}
