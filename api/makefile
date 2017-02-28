
serve:
	BABEL_ENV=node SLS_DEBUG=true node_modules/serverless/bin/serverless webpack serve --port 3000 --host 0.0.0.0

start-db:
	docker run --name comfy-db -p 5432:5432 -d postgres:9.6 || docker start comfy-db
