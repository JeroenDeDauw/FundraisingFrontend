(function ($) {

	var form = $('#comment-form');

	var inputElements = form.find('input, textarea');
	var submitButton = form.find('input[type="submit"]');

	setupForm();

	function setupForm() {
		setupFormValidation();
		form.bind( 'submit', handleFormSubmission );
	}

	function setupFormValidation() {
		form.submit(onFormSubmit);
		submitButton.click(onFormSubmit);

		inputElements.keypress(function () {
			$(this).data('data-entered', true);
		});

		inputElements.blur(function () {
			if ($(this).data('data-entered')) {
				updateElementValidationState.apply( this );
			}
		});
	}

	function onFormSubmit() {
		inputElements.each(updateElementValidationState);
		return inputElements.filter(elementIsInvalid).length === 0;
	}

	function updateElementValidationState() {
		if ($(this).val() === "" || !this.checkValidity()) {
			$(this).removeClass('valid');
			$(this).parent().removeClass('valid');
			$(this).addClass('invalid');
			$(this).parent().addClass('invalid');
		}
		else {
			$(this).removeClass('invalid');
			$(this).parent().removeClass('invalid');
			$(this).addClass('valid');
			$(this).parent().addClass('valid');
		}
	}

	function elementIsInvalid() {
		return $(this).val() === "" || !this.checkValidity();
	}

	function handleFormSubmission( event ) {
		event.preventDefault();

		submitButton.attr( 'disabled', 'disabled' );
		submitButton.addClass( 'btn-unactive' );

		form.find( '.message' ).remove();

		$.ajax( form.attr( 'action' ), {
			data: $( this ).serialize(),
			dataType: 'json',
			type: 'POST',
			success: function( response ) {
				if ( response.status === 'OK' ) {
					onSubmitSuccess( response.message );
				}
				else {
					onSubmitFailure( response.message );
				}
			},
			error: function ( e ) {
				onSubmitFailure();
			}
		});
	}

	function onSubmitSuccess( message ) {
		submitButton.after(
			$( '<div />' )
				.addClass( 'message' )
				.addClass( 'success-message' )
				.html( message || 'Vielen Dank! Die Nachricht wurde verschickt!' ) // TODO: is this default needed?
		);

		$( '#cancel-link' ).text( 'Zurück zur Spendenbestätigung' ); // TODO: i18n
	}

	function onSubmitFailure( message ) {
		submitButton.removeAttr( 'disabled' );
		submitButton.removeClass( 'btn-unactive' );

		submitButton.after(
			$( '<div />' )
				.addClass( 'message' )
				.addClass( 'error-message' )
				.text( message || 'Die Nachricht konnte auf Grund eines Fehlers nicht verschickt werden.' ) // TODO: is this default needed?
		);
	}

})(jQuery);
