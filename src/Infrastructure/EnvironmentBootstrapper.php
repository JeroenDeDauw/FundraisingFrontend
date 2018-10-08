<?php

declare( strict_types = 1 );

namespace WMDE\Fundraising\Frontend\Infrastructure;

class EnvironmentBootstrapper {
	public static function getConfigurationPathsForEnvironment( string $environmentName, string $configPath ): array {
		$paths = self::removeNonexistentOptionalPaths( ...[
			$configPath . '/config.dist.json',
			$configPath . '/config.' . $environmentName . '.json',
			$configPath . '/config.' . $environmentName . '.local.json',
		] );
		self::checkIfPathsExist( ...$paths );
		return $paths;
	}

	private static function removeNonexistentOptionalPaths( string ...$paths ): array {
		if ( !file_exists( $paths[2] ) ) {
			array_splice( $paths, 2 );
		}
		return $paths;
	}

	private static function checkIfPathsExist( string ...$paths ): void {
		array_map(
			function ( $path ) {
				if ( !is_readable( $path ) ) {
					throw new \RuntimeException( 'Configuration file "' . $path . '" not found' );
				}
			},
			$paths
		);
	}
}
