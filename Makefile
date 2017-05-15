install:
	cd api && make install
	cd cli && make install
	cd admin && make install

test:
	cd api && make test
	cd cli && make test

deploy:
	cd api && NODE_ENV=production make deploy

publish-cli:
	npm publish ./cli

publish-admin:
	npm publish ./admin
