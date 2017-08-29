.PHONY: test

install:
	make -C api install
	make -C cli install
	make -C admin install
	make -C test install

migrate:
	make -C api migrate

test:
	make -C api test
	make -C cli test
	make -C admin test
	make -C test test

deploy:
	cd api && NODE_ENV=production make deploy

publish-cli:
	npm publish ./cli

publish-admin:
	npm publish ./admin
