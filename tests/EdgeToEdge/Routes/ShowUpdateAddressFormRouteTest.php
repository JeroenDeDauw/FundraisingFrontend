<?php

declare( strict_types = 1 );

namespace WMDE\Fundraising\Frontend\Tests\EdgeToEdge\Routes;

use Symfony\Component\DomCrawler\Crawler;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Client;
use WMDE\Fundraising\DonationContext\Tests\Data\ValidDoctrineDonation;
use WMDE\Fundraising\Frontend\Factories\FunFunFactory;
use WMDE\Fundraising\Frontend\Tests\EdgeToEdge\WebRouteTestCase;
use WMDE\Fundraising\Frontend\Tests\Fixtures\OverridingCampaignConfigurationLoader;

/**
 * @license GNU GPL v2+
 */
class ShowUpdateAddressFormRouteTest extends WebRouteTestCase {

	private const PATH = 'update-address';

	const INVALID_TOKEN = 'abcdefghijklmnopqrstuvwxzy12345';

	public function testWhenCorrectUpdateAddressTokenIsSupplied_addressChangeFormIsShown(): void {
		$this->createEnvironment(
			[],
			function ( Client $client, FunFunFactory $factory ): void {
				$this->setDefaultSkin( $factory, 'laika' );

				$donation = ValidDoctrineDonation::newDirectDebitDoctrineDonation();

				$factory->getEntityManager()->persist( $donation );
				$factory->getEntityManager()->flush();

				$addressToken = $donation->getAddressChange()->getCurrentIdentifier();

				$this->performRequest(
					$client,
					$addressToken
				);

				$response = $client->getResponse();
				$dataVars = json_decode(
					$client->getCrawler()->filter( '#app' )->getNode( 0 )->getAttribute( 'data-application-vars' )
				);
				$this->assertTrue( $response->isOk() );
				$this->assertSame( $addressToken, $dataVars->addressToken );
			}
		);
	}

	public function testWhenIncorrectUpdateAddressTokenIsSupplied_accessToAddressChangeFormIsDenied(): void {
		$this->createEnvironment(
			[],
			function ( Client $client, FunFunFactory $factory ): void {
				$this->setDefaultSkin( $factory, 'laika' );

				$donation = ValidDoctrineDonation::newDirectDebitDoctrineDonation();

				$factory->getEntityManager()->persist( $donation );
				$factory->getEntityManager()->flush();

				$this->performRequest(
					$client,
					self::INVALID_TOKEN
				);

				$response = $client->getResponse();
				$this->assertTrue( $response->isForbidden() );
			}
		);
	}

	private function performRequest( Client $client, string $addressToken ): Crawler {
		return $client->request(
			Request::METHOD_GET,
			self::PATH . '?addressToken=' . $addressToken,
			[ 'updateToken' => $addressToken ]
		);
	}

	private function setDefaultSkin( FunFunFactory $factory, string $skinName ): void {
		$factory->setCampaignConfigurationLoader(
			new OverridingCampaignConfigurationLoader(
				$factory->getCampaignConfigurationLoader(),
				[ 'skins' => [ 'default_bucket' => $skinName ] ]
			)
		);
	}
}
