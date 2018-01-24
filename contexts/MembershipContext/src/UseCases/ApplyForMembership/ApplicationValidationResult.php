<?php

declare( strict_types = 1 );

namespace WMDE\Fundraising\MembershipContext\UseCases\ApplyForMembership;

/**
 * @license GNU GPL v2+
 * @author Jeroen De Dauw < jeroendedauw@gmail.com >
 */
class ApplicationValidationResult {

	const SOURCE_PAYMENT_AMOUNT = 'amount';
	const SOURCE_IBAN = 'iban';
	const SOURCE_BIC = 'bic';
	const SOURCE_BANK_NAME = 'bank-name';
	const SOURCE_BANK_CODE = 'bank-code';
	const SOURCE_BANK_ACCOUNT = 'bank-account';
	const SOURCE_APPLICANT_DATE_OF_BIRTH = 'applicant-dob';
	const SOURCE_APPLICANT_PHONE_NUMBER = 'applicant-phone';
	const SOURCE_APPLICANT_EMAIL = 'applicant-email';
	const SOURCE_APPLICANT_COMPANY = 'company';
	const SOURCE_APPLICANT_FIRST_NAME = 'applicant-first-name';
	const SOURCE_APPLICANT_LAST_NAME = 'applicant-last-name';
	const SOURCE_APPLICANT_SALUTATION = 'applicant-salutation';
	const SOURCE_APPLICANT_STREET_ADDRESS = 'street-address';
	const SOURCE_APPLICANT_POSTAL_CODE = 'postal-code';
	const SOURCE_APPLICANT_CITY = 'city';
	const SOURCE_APPLICANT_COUNTRY = 'country-code';

	const VIOLATION_TOO_LOW = 'too-low';
	const VIOLATION_WRONG_LENGTH = 'wrong-length';
	const VIOLATION_NOT_MONEY = 'not-money';
	const VIOLATION_MISSING = 'missing';
	const VIOLATION_IBAN_BLOCKED = 'iban-blocked';
	const VIOLATION_IBAN_INVALID = 'iban-invalid';
	const VIOLATION_NOT_DATE = 'not-date';
	const VIOLATION_NOT_PHONE_NUMBER = 'not-phone';
	const VIOLATION_NOT_EMAIL = 'not-email';

	private $violations;

	/**
	 * @param string[] $violations ApplicationValidationResult::SOURCE_ => ApplicationValidationResult::VIOLATION_
	 */
	public function __construct( array $violations = [] ) {
		$this->violations = $violations;
	}

	public function getViolations(): array {
		return $this->violations;
	}

	public function isSuccessful(): bool {
		return empty( $this->violations );
	}

	/**
	 * @return string[]
	 */
	public function getViolationSources(): array {
		return array_keys( $this->violations );
	}

	/**
	 * @param string $source
	 *
	 * @return string
	 * @throws \OutOfBoundsException
	 */
	public function getViolationType( string $source ): string {
		if ( array_key_exists( $source, $this->violations ) ) {
			 return $this->violations[$source];
		}

		throw new \OutOfBoundsException();
	}

}