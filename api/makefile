SERVERLESS := SLS_DEBUG=* node_modules/.bin/serverless

install:
	npm i
	docker run --name comfy-db -p 5432:5432 -d postgres:9.6

start-db:
	docker start comfy-db

stop-db:
	docker stop comfy-db

run:
	$(SERVERLESS) offline --location=.webpack --host=0.0.0.0 --port=3000

deploy:
	NODE_ENV=production $(SERVERLESS) deploy

undeploy:
	NODE_ENV=production $(SERVERLESS) remove
