'use strict';

var test = require( 'tape-catch' ),
	sinon = require( 'sinon' ),
	fieldValueValidityIndicator = require( '../../lib/view_handler/field_value_validity_indicator' ),
	createValidityIndicator = fieldValueValidityIndicator.createFieldValueValidityIndicator;

function ElementStub( parent ) {
	this.addClassSpy = sinon.spy();
	this.removeClassSpy = sinon.spy();
	this.parentElement = parent;
}

ElementStub.prototype = {
	addClass: function ( classToAdd ) {
		this.addClassSpy( classToAdd );
		return this;
	},

	removeClass: function ( classToRemove ) {
		this.removeClassSpy( classToRemove );
		return this;
	},

	parent: function () {
		return this.parentElement;
	}
};

test( 'When validation state has initial status, nothing is indicated', function ( t ) {
	var parentElement = new ElementStub(),
		inputElement = new ElementStub( parentElement ),
		validationState = { dataEntered: false, isValid: null },
		handler = createValidityIndicator( inputElement );

	handler.update( validationState );

	t.ok( inputElement.addClassSpy.notCalled, 'validity indication keeps initial status' );
	t.ok( inputElement.removeClassSpy.withArgs( 'valid invalid' ), 'validity indication is set to neutral' );
	t.ok( parentElement.removeClassSpy.withArgs( 'invalid valid' ).calledOnce, 'parent validity indication is set to neutral' );
	t.end();
} );

test( 'When validation state has valid status, it is indicated', function ( t ) {
	var parentElement = new ElementStub(),
		inputElement = new ElementStub(
			parentElement ),
		validationState = { dataEntered: true, isValid: true },
		handler = createValidityIndicator( inputElement );

	handler.update( validationState );

	t.ok( inputElement.addClassSpy.withArgs( 'valid' ).calledOnce, 'input field set to valid' );
	t.ok( inputElement.removeClassSpy.withArgs( 'invalid' ).calledOnce, 'input field set to not invalid' );
	t.ok( parentElement.removeClassSpy.withArgs( 'invalid' ).calledOnce, 'parent invalidity indication removed' );
	t.ok( parentElement.addClassSpy.withArgs( 'valid' ).calledOnce, 'parent validity indication set' );
	t.end();
} );

test( 'When validation state has invalid status, it is indicated', function ( t ) {
	var parentElement = new ElementStub(),
		inputElement = new ElementStub( parentElement ),
		validationState = { dataEntered: true, isValid: false },
		handler = createValidityIndicator( inputElement );

	handler.update( validationState );

	t.ok( inputElement.addClassSpy.withArgs( 'invalid' ).calledOnce, 'input field set to invalid' );
	t.ok( inputElement.removeClassSpy.withArgs( 'valid' ).calledOnce, 'input field set to not valid' );
	t.ok( parentElement.removeClassSpy.withArgs( 'valid' ).calledOnce, 'parent validity indication removed' );
	t.ok( parentElement.addClassSpy.withArgs( 'invalid' ).calledOnce, 'parent invalidity indication set' );
	t.end();
} );

