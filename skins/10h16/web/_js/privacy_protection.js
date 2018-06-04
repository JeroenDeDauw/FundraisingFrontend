$( function() {
	var isTracked = true;
	var trackingUrl = document.getElementById( 'privacy_opt_out' ).dataset.tracking_url;

	$( '#tracking-opt-in' )
		.click( function() {
			piwikAjaxOptOutTrack();
		} );

	$( '#tracking-opt-out' )
		.click( function() {
			piwikAjaxOptOutUntrack();
		} );

	/**
	 * Initial call to establish the tracking state of the current user
	 */
	$.ajax( {
		url: trackingUrl + "index.php?module=API&method=AjaxOptOut.isTracked&format=json",
		jsonp: "callback",
		dataType: "jsonp",
		success: function( d ) {
			isTracked = d.value;
			updateFormState();
		}
	} );

	function piwikAjaxOptOutTrack() {
		$.ajax( {
			url: trackingUrl + "index.php?module=API&method=AjaxOptOut.doTrack&format=json",
			jsonp: "callback",
			dataType: "jsonp",
			success: function() {
				isTracked = true;
				updateFormState();
			}
		} );
	}

	function piwikAjaxOptOutUntrack() {
		$.ajax( {
			url: trackingUrl + "index.php?module=API&method=AjaxOptOut.doIgnore&format=json",
			jsonp: "callback",
			dataType: "jsonp",
			success: function() {
				isTracked = false;
				updateFormState();
			}
		} );
	}

	function updateFormState() {
		if( isTracked === true ) {
			$( '#tracking-opt-in' ).prop( "checked", true );
			$( '.opted-out' ).hide();
		} else {
			$( '#tracking-opt-out' ).prop( "checked", true );
			$( '.opted-out' ).show();
		}
	}
} );
