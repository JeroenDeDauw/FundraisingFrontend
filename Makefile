current_user  := $(shell id -u)
current_group := $(shell id -g)
BUILD_DIR     := $(PWD)
TMPDIR        := $(BUILD_DIR)/tmp
COMPOSER_FLAGS :=
NPM_FLAGS     := --prefer-offline
DOCKER_FLAGS  := --interactive --tty

install-js:
	-mkdir -p $(TMPDIR)/home
	-echo "node:x:$(current_user):$(current_group)::/var/nodehome:/bin/bash" > $(TMPDIR)/passwd
	docker run --rm $(DOCKER_FLAGS) --user $(current_user):$(current_group) -v $(BUILD_DIR):/data:delegated -w /data -v $(TMPDIR)/home:/var/nodehome:delegated -v $(TMPDIR)/passwd:/etc/passwd node:8 npm install $(NPM_FLAGS)

install-php:
	docker run --rm $(DOCKER_FLAGS) --volume $(BUILD_DIR):/app -w /app --volume ~/.composer:/composer --user $(current_user):$(current_group) composer install --ignore-platform-reqs $(COMPOSER_FLAGS)

js:
	docker run --rm $(DOCKER_FLAGS) --user $(current_user):$(current_group) -v $(BUILD_DIR):/data:delegated -w /data -e NO_UPDATE_NOTIFIER=1 node:8 npm run build-assets
	docker run --rm $(DOCKER_FLAGS) --user $(current_user):$(current_group) -v $(BUILD_DIR):/data:delegated -w /data -e NO_UPDATE_NOTIFIER=1 node:8 npm run copy-assets

clear:
	rm -rf var/cache/

ui: clear js

cs:
	docker-compose run --rm app ./vendor/bin/phpcs

test: covers phpunit

covers:
	docker-compose run --rm app ./vendor/bin/covers-validator

phpunit:
	docker-compose run --rm app ./vendor/bin/phpunit

stan:
	docker-compose run --rm app ./vendor/bin/phpstan analyse --level=1 --no-progress cli/ contexts/ src/ tests/

ci: covers phpunit cs stan

.PHONY: js clear ui ci test covers phpunit cs stan install-php install-js
