SERVERLESS := SLS_DEBUG=* node_modules/.bin/serverless
DATABASE ?= comfy

export PGUSER ?= postgres
export PGHOST ?= localhost

install:
	npm i

install-db:
	docker run --name comfy-db -p 5432:5432 -d postgres:9.6
	sleep 5s
	psql -c "CREATE DATABASE ${DATABASE}"
	make migrate

migrate:
	./node_modules/db-migrate/bin/db-migrate up --config ./config/database.js

start-db:
	docker start comfy-db

stop-db:
	docker stop comfy-db

run:
	$(SERVERLESS) offline --location=.webpack --host=0.0.0.0 --port=3000

deploy:
	NODE_ENV=production $(SERVERLESS) deploy --stage beta

undeploy:
	NODE_ENV=production $(SERVERLESS) remove --stage beta

test:
	NODE_ENV=test ./node_modules/.bin/mocha --compilers js:babel-core/register "src/**/*.spec.js"

test-watch:
	NODE_ENV=test ./node_modules/.bin/mocha --compilers js:babel-core/register "src/**/*.spec.js" --watch --min
