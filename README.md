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

From  security standpoint, if the remote server is owned, the attacker will only have the encrypted data. Since the server never stores the key, the attacker will not be able to decrypt it.

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

## Usage

In a project directory, initialize a new configuration with `comfy init`:

```sh
> comfy init
We just need a few informations about your project:
- What is your project name? [myproject]
- What is your first environment? [development]
- What is your encryption passphrase? [generated]

Creating your new project ...

Nice. We will save your credentials under .comfy/config.

comfy is now configured! Here are what you need to know about your project:

Project name: myproject
Environments: development

Access Token: QMOLAWWJCPPBOWAARHQP
Secret Read Token: 6CJVFlieUCUqgiOBDWvkYDEASXkjtFEJs0EKIjTb
Secret Write Token: QGBsW8e9m7MfTsvs8up3iazsc5TPYUbznS1HW7bV

Passphrase to decrypt your configs:
[...]
```

Add a configuration from a config file for a particular environment using `comfy add`:

```sh
> echo '{"login": "admin", "password": "S3cr3T"}' > config.json
> comfy add development -f config.json
Great! Your configuration was successfuly saved.
```

Grab that configuration from any server using `comfy get`:

```sh
> comfy get development
{"login": "admin", "password": "S3cr3T"}
> comfy get development --envvars
export LOGIN='admin';
export PASSWORD='S3cr3T';
```

To store a remore configuration in the environment, use:

```sh
> comfy get development | source /dev/stdin
```
