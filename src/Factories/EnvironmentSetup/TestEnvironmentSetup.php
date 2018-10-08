<?php

declare( strict_types = 1 );

namespace WMDE\Fundraising\Frontend\Factories\EnvironmentSetup;

use Symfony\Component\Translation\Translator;
use WMDE\Fundraising\Frontend\Factories\FunFunFactory;
use WMDE\Fundraising\Frontend\Tests\Fixtures\FakeUrlGenerator;

class TestEnvironmentSetup  implements EnvironmentSetup {

	public function setEnvironmentDependentInstances( FunFunFactory $factory ) {
		$factory->setNullMessenger();
		$factory->setSkinTwigEnvironment( new \Twig_Environment() );
		$factory->setUrlGenerator( new FakeUrlGenerator() );

		// disabling translations in tests (will result in returned keys we can more easily test for)
		$factory->setTranslator( new Translator( 'zz_ZZ' ) );
	}

}