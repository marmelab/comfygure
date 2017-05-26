.PHONY: test

install:
	cd api && make install
	cd cli && make install
	cd admin && make install
	cd test && make install

test:
	cd api && make test
	cd cli && make test
	cd admin && make test
	cd test && make test

deploy:
	cd api && NODE_ENV=production make deploy

publish-cli:
	npm publish ./cli

publish-admin:
	npm publish ./admin
