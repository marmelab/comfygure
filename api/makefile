SERVERLESS := node_modules/.bin/serverless
DATABASE ?= comfy

export PGUSER ?= postgres
export PGHOST ?= localhost

install:
	npm i

install-db:
	docker run --name comfy-db -p 5432:5432 -d postgres:9.6
	sleep 5s
	psql -c "CREATE DATABASE ${DATABASE}"

start-db:
	docker start comfy-db

stop-db:
	docker stop comfy-db

connect-db:
	psql comfy

run:
	$(SERVERLESS) offline start --host=0.0.0.0 --port=3000

deploy:
	NODE_ENV=production $(SERVERLESS) deploy --stage prod

undeploy:
	NODE_ENV=production $(SERVERLESS) remove --stage prod

test:
	NODE_ENV=test ./node_modules/.bin/jest

test-watch:
	NODE_ENV=test ./node_modules/.bin/jest --watch
