---
layout: default
title: 'Host Your Own Comfygure Origin Server'
---

# Host Your Own Comfygure Origin Server

Marmelab hosts the default comfygure server at `https://comfy.marmelab.com`. You can use it for free, for your tests, with no warranties of availability. We reserve the right to suspend usage in case of abuse.

In production, you'll probably want to host your own comfygure server. Fortunately, the comfygure server code is open-source and [available on GitHub](https://github.com/marmelab/comfygure).

Once your server is configured, use the standard `comfy` client to initialize your project, and pass your server URL in the `--origin` option:

```bash
# The origin will be stored in .comfy/config
# Feel free to edit this file if you want to change your origin server
comfy init --origin https://my.custom.host
```

Now, how to setup an origin server? There are a few options.

## With The Docker Image

The comfygure API is published as a docker image : [marmelab/comfygure](https://hub.docker.com/r/marmelab/comfygure).

It requires a [PostgreSQL instance](https://hub.docker.com/_/postgres) to store the configs, so let's start by that :

```bash
# Create a docker network in order to let comfygure reach the postgres container
docker network create comfy-network

# Grab the initial database schema on the repo
wget https://raw.githubusercontent.com/marmelab/comfygure/master/api/var/schema.sql

# Start the postgres container with the initial schema
docker run --name comfy-postgres \
    -e POSTGRES_PASSWORD=mysecretpassword \
    -v `pwd`/schema.sql:/docker-entrypoint-initdb.d/schema.sql \
    --network comfy-network \
    -d  postgres

# Run comfygure container and expose its port
docker run --name comfygure-api \
    -e PGHOST=comfy-postgres \
    -e PGDATABASE=postgres \
    -e PGPASSWORD=mysecretpassword \
    --network comfy-network \
    -p 3000:80 \
    -d marmelab/comfygure
```

Your comfygure API container is now up and running at http://localhost:3000, and you can use it with the comfy CLI to manage your configs.

```bash
npm install -g comfygure
comfy init --origin http://localhost:3000

Initializing project configuration...
Project created on comfy server http://localhost:3000
Configuration saved locally in .comfy/config
comfy project successfully created
```

## With ZEIT's Now

Now make deployment easy. Just like with a docker container, you have to configure your postgres instance.

But if you have to deploy the API, feel free to clone the GitHub repository and use pre-filled `now.json` file.

```bash
git clone git@github.com:marmelab/comfygure.git
cd comfygure/api
```

Edit `now.json` to add your environment variables

```json
{
    "name": "comfygure",
    "version": 2,
    "builds": [
        {
            "src": "build/index.js",
            "use": "@now/node"
        }
    ],
    "routes": [{ "src": ".*", "dest": "/build" }],
    "env": {
        "PGHOST": "@comfy-pghost",
        "PGDATABASE": "@comfy-pgdatabase",
        "PGUSER": "@comfy-pguser",
        "PGPASSWORD": "@comfy-pgpassword"
    }
}
```

You can then starting the server locally by running `now dev` or deploying directly with `now`.

Don't forget to write down your environment variables in a `.env` file, or with [`now secret`](https://zeit.co/docs/v2/deployments/environment-variables-and-secrets).

## Environment Variables

The comfygure API doesn't require much configuration other than to plug the postgres, here are all the environment variables you can use to tune it.

To be noted that the container has a configuration validation at the server start : if one of these environment variables is invalid, the container will crash at start.

**`COMFY_LOG_DEBUG`** (default: false)

**`PGHOST`** (default: localhost)

**`PGPORT`** (default: 5432)

**`PGDATABASE`** (default: comfy)

**`PGUSER`** (default: postgres)

**`PGPASSWORD`** (default: '')

It is **highly** recommended to set a default root password.
