<?php

declare( strict_types = 1 );

namespace WMDE\Fundraising\Frontend\Infrastructure\Sofort\Transfer;

class Response {

	/**
	 * @var string
	 */
	private $transactionId = '';
	/**
	 * @var string
	 */
	private $paymentUrl = '';

	/**
	 * @return string
	 */
	public function getTransactionId() {
		return $this->transactionId;
	}

	/**
	 * @param mixed $transactionId
	 */
	public function setTransactionId( $transactionId ) {
		$this->transactionId = $transactionId;
	}

	/**
	 * @return string
	 */
	public function getPaymentUrl(): string {
		return $this->paymentUrl;
	}

	/**
	 * @param string $paymentUrl
	 */
	public function setPaymentUrl( string $paymentUrl ) {
		$this->paymentUrl = $paymentUrl;
	}
}
