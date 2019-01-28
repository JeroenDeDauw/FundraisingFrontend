'use strict';

const Validity = require( '../../validation/validation_states' ).Validity;

module.exports = function ( state ) {
	return (
		(
			( state.membershipFormContent.addressType === 'person' && state.membershipFormContent.membershipType !== null ) ||
			( state.membershipFormContent.addressType === 'firma' && state.membershipFormContent.membershipType === 'sustaining' )
		) ||
		state.validity.paymentData === Validity.INCOMPLETE ||
		state.membershipInputValidation.email.isValid === Validity.INCOMPLETE ||
		state.validity.address === Validity.INCOMPLETE ||
		(
			( state.membershipFormContent.paymentType === 'BEZ' && state.validity.bankData === Validity.INCOMPLETE ) ||
			( state.membershipFormContent.paymentType !== 'BEZ' )
		)
	);
};
