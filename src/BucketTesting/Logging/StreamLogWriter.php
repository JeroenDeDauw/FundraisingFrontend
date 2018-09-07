<?php

declare( strict_types = 1 );

namespace WMDE\Fundraising\Frontend\BucketTesting\Logging;

class StreamLogWriter implements LogWriter {

	private $url;
	private $stream;

	public function __construct( string $url ) {
		$this->url = $url;
	}

	public function write( string $logEntry ) {
		$this->openStreamIfNeeded();
		fwrite(
			$this->stream,
			$logEntry . "\n"
		);
	}

	private function openStreamIfNeeded() {
		if ( $this->stream !== null ) {
			return;
		}
		$this->createPathIfNeeded();
		$this->stream = @fopen( $this->url, 'a' );
		if ( $this->stream === false ) {
			throw new LoggingError( 'Could not open ' . $this->url );
		}
	}

	private function createPathIfNeeded() {
		$path = dirname( $this->url );
		if ( file_exists( $path ) ) {
			return;
		}
		if ( !mkdir( $path, 0777, true ) ) {
			throw new LoggingError( 'Could not create directory ' . $path );
		}
	}

}