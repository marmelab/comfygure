SERVERLESS := node_modules/.bin/serverless
DATABASE ?= comfy

export PGUSER ?= postgres
export PGHOST ?= localhost
export PGPASSWORD ?= password

install:
	npm i

install-db:
	docker run \
		-e POSTGRES_PASSWORD=${PGPASSWORD} \
		--name comfy-db \
		-p 5432:5432 \
		-d postgres:9.6
	sleep 5s
	psql -c "CREATE DATABASE ${DATABASE}"
	psql -h localhost -U postgres -d comfy -f ./var/schema.sql

start-db:
	docker start comfy-db

stop-db:
	docker stop comfy-db

connect-db:
	psql comfy

run:
	$(SERVERLESS) offline start --host=0.0.0.0 --port=3000 --noPrependStageInUrl

deploy:
	NODE_ENV=production $(SERVERLESS) deploy --stage prod

undeploy:
	NODE_ENV=production $(SERVERLESS) remove --stage prod

test:
	NODE_ENV=test ./node_modules/.bin/jest

test-watch:
	NODE_ENV=test ./node_modules/.bin/jest --watch
