.PHONY: test

PWD = $(shell pwd)

install:
	make -C api install
	make -C cli install
	make -C test install

run:
	-make -C api start-db
	make -C api run

test:
	make -C api test
	make -C cli test
	make -C test test

deploy:
	cd api && NODE_ENV=production make deploy

publish-cli:
	npm publish ./cli

serve-documentation:
	docker run -it --rm \
		-p 4000:4000 \
		-v "${PWD}/docs:/usr/src/app" \
		starefossen/github-pages:onbuild \
		jekyll serve \
			--host=0.0.0.0 \
			--incremental
