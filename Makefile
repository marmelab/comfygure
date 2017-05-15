install:
	cd api && make install
	cd cli && make install
	cd admin && make install

test:
	cd api && make test
	cd cli && make test

deploy:
	cd api && NODE_ENV=production make deploy

publish:
	cd admin && make build
	mv admin/build cli/admin
	npm publish ./cli
