export CI ?= false
export PM2_HOME ?= .pm2

install:
	npm install

run-test-api:
ifeq (${CI},false)
	echo 'Starting test database...'
	-cd ../api && make install-db
	cd ../api && make start-db
endif
	@echo 'Starting test API...'
	./node_modules/.bin/pm2 start pm2_configuration.json
	@echo 'Waiting for webpack...'
	@sleep 10

stop-test-api:
	@echo 'Stopping test API...'
	./node_modules/.bin/pm2 delete pm2_configuration.json
	if [ "${CI}" = "false" ]; then \
		echo 'Stopping test database...'; \
		cd ../api && make stop-db; \
	fi

setup-test: run-test-api
	mkdir -p ./.env
	rm -rf ./.env/*

teardown-test: stop-test-api
	./node_modules/.bin/pm2 kill

test: setup-test
	@echo 'Starting test suite...'
	./node_modules/.bin/mocha --timeout 5000 --require co-mocha \
		./setup.js \
		'./specs/**/*.js'
	make teardown-test

test-watch:
	@echo 'Starting test suite...'
	./node_modules/.bin/mocha --require co-mocha --watch \
		./setup.js \
		'./specs/**/*.js'
	make teardown-test

logs:
	./node_modules/.bin/pm2 logs
