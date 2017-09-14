[![npm version](https://badge.fury.io/js/comfygure.svg)](https://badge.fury.io/js/comfygure) [![Build Status](https://travis-ci.org/marmelab/comfygure.png?branch=master)](https://travis-ci.org/marmelab/comfygure)

# Comfygure

Store encrypted project configuration in a centralised place, then check it out and decrypt locally for development, test and deployment.

## The Problem: Managing Application Configuration

How do you store the configuration for a web application?

Most developers use configuration files (`config.json`, `parameters.yaml`, `root.xml`, etc). But these files should not be committed to source control (git), because they contain sensible information (db passwords, service credentials, etc), and because they can change with each developer. So developers usually commit fake config files (like `parameters.yml-dist`) and keep a real config file locally (and ignored by source control). This leads to problems when one developer adds a new key to the configuration but another developer doesn't know about it.

Another solution is to use environment variables. This makes sharing the configuration between developers and between environments even harder.

## The solution

Comfygure proposes to solve that problem by storing configuration on a remote server (like a remote git), encrypted. A comfygure client knows how to read and write from that remote server, and decrypt the configuration to dump it locally.

![comfygure workflow](./comfy.png)

Ultimately, this lets you execute the following command from any server (development, test, production):

```sh
> comfy get development --envvars
export LOGIN='admin';
export PASSWORD='S3cr3T';
```

Developers store the decryption key locally, allowing them to decrypt and/or update the configuration. In a similar fashion, CI servers can also check out the configuration with a simple decryption key, then build an artifact to be deployed to production.

Comfy handles environments (dev, test, staging, production, etc.), versioning, read/write permissions. It allows to dump the configuration to the format you like (env vars, json, yaml).

From a security standpoint, if the remote server is owned, the attacker can only access the encrypted data. Since the server never stores the decryption key, the attacker can't decrypt the configuration.

By default, the server is comfy.marmelab.com (run by marmelab), but it can be a server that you host yourself (this repository contains the server code).

## Installation

### Installing the Client

```sh
> npm install -g comfygure
```

Now the `comfy` command is available on your system.

### Installing the Server (optional)

Install the server if you don't want to use `confy.marmelab.com` to store your encrypted configuration.

```
> git clone git@github.com:marmelab/comfygure.git
> cd comfygure/api
> make install
```

To run the server locally (requires docker):

```sh
> make install-db
> make start-db
> make run
```

To run the server on AWS lambda, edit the `api/serverless.yml` fil with your AWS preferences, then run:

```
> make deploy
```

**Tip**: If you use a remote server, you must change the comfy configuration for your projects:

```config
# in .comfy/config
[project]
origin=http://my.custom.config.server.com
```

## Basic Usage

In a project directory, initialize a new configuration with `comfy init`:

```sh
> comfy init

Initializing project configuration...
Project created on comfy server https://comfy.marmelab.com
Configuration saved locally in .comfy/config
comfy project successfully created
```

Set the configuration for a particular environment based on the content of an existing file using `comfy setall`:

```sh
> echo '{"login": "admin", "password": "S3cr3T"}' > config.json
> comfy setall development config.json
Great! Your configuration was successfully saved.
```

Grab that configuration from any server using `comfy get`:

```sh
> comfy get development
{"login": "admin", "password": "S3cr3T"}
> comfy get development --envvars
export LOGIN='admin';
export PASSWORD='S3cr3T';
```

To store a remote configuration in the environment, use:

```sh
> comfy get development | source /dev/stdin
```

To launch admin webApp on localhost:3000:

```sh
> comfy admin
```
