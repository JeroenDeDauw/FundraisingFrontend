'use strict';

var objectAssign = require( 'object-assign' ),
	IntervalAndAmountDisplayHandler = {
		intervalElement: null,
		amountElement: null,
		paymentTypeElement: null,
		intervalTranslations: null,
		paymentTypeTranslations: null,
		numberFormatter: null,
		update: function ( formContent ) {
			this.intervalElement.text( this.formatPaymentInterval( formContent.paymentIntervalInMonths ) );
			this.paymentTypeElement.text( this.formatPaymentType( formContent.paymentType ) );
			this.amountElement.text( this.numberFormatter.format( formContent.amount ) );
		},
		formatPaymentInterval: function ( paymentIntervalInMonths ) {
			return this.intervalTranslations[ paymentIntervalInMonths ];
		},
		formatPaymentType: function ( paymentType ) {
			return this.paymentTypeTranslations[ paymentType ];
		}
	};

module.exports = {
	createPaymentIntervalAndAmountDisplayHandler: function ( intervalElement, amountElement, paymentTypeElement,
															intervalTranslations, paymentTypeTranslations, numberFormatter ) {
		return objectAssign( Object.create( IntervalAndAmountDisplayHandler ), {
			intervalElement: intervalElement,
			amountElement: amountElement,
			paymentTypeElement: paymentTypeElement,
			intervalTranslations: intervalTranslations,
			paymentTypeTranslations: paymentTypeTranslations,
			numberFormatter: numberFormatter
		} );
	}
};
