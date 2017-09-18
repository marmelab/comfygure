---
layout: default
title: "Basic Usage"
---

## Installation

comfygure is available from npm. You can install it (and its required dependencies) using:

```sh
> npm install -g comfygure
```

`comfy` will be now be available. Type `comfy help` to list the commands.

## Project Initialization

First things first, you need to initialize your repository. To do so, go to the repository folder and type `comfy init`.

```bash
> cd dev/my-project
> comfy init

Initializing project configuration...
Project created on comfy server https://comfy.marmelab.com
Configuration saved locally in .comfy/config
comfy project successfully created
```

By default, the server origin is `https://comfy.marmelab.com`. But if you can change it with the `--origin` argument.
More about custom comfy server hosting on the [Advanced Usage](./AdvancedUsage.html) section of this documentation.

### Comfy folder

Once the initialization is finished, you should have:

* A new file at `.comfy/config` containing all your project informations and credentials
* A new line on your `.gitignore` in order to avoid to commit this file (if a `.git` folder is found in the current folder)

```bash
> cat .comfy/config

[project]
# Your project ID to identify your project, useful to debug
projectId=1111111111-1111-1111-1111-1111111111111
# Your credentials to access to the comfy server
accessKey=XXXXXXXXXXXXXXXX
secretToken=YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
# The comfy server URI
origin=https://comfy.marmelab.com
# The private key used to encrypt your configuration, never sent to the server
privateKey=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# The HMAC key used to sign and verify the integrity of your configuration, never sent to the server
hmacKey=yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

The comfy server don't have access to your private and HMAC keys, ever. Be sure to keep these informations safe and secure.

If you lose one of these informations, you will be no longer able to retrieve your configurations and no one will be able to help you, not even the server administrators.

## Managing Environments

By default, comfy creates your first environment `development`. But you can chose its name with:

```bash
comfy init --env production
```

At any time, you can list or create an environment.

```bash
> comfy env ls
development

> comfy env add production
Environment successfully created
You can now set a configuration for this environment using comfy setall production

> comfy env ls
development
production
```

## Add a configuration version

When you create an environment, the first version of its configuration is empty.

```bash
> comfy get development
{}
```

In order to add a new configuration version, you have to use the following command with a file containing your config.

```
> cat config.json
{ "login": "admin", "password": "S3cret!" }

> comfy setall development config.json
comfy configuration successfully saved
```

## Retrieve a configuration

To retrieve a configuration, you can type:

```bash
> comfy get development
{
    "login": "admin",
    "password": "S3cret!"
}
```

As an option, you can also format your configuration into a YAML or as environment variables.

```bash
> comfy get development --yml
login: admin
password: S3cret!

> comfy get development --envvars
export LOGIN='admin';
export PASSWORD='S3cret!';
```

You can then use the standard output to create a new file or source your environment variables.

```bash
> comfy get development --yml > src/config/development.yml
> cat src/config/development.yml
login: admin
password: S3cret!

> comfy get development --envvars | source /dev/stdin
> echo $LOGIN
admin
```

## Collaborate with your team

To be able to retrieve your configuration, comfy needs all the informations you can find in `.comfy/config`.

If you want to give the ability to Bob, your co-worker, to fetch the config, just give him this file.

```bash
scp .comfy/config bob@bob-workstation:~/repository/.comfy/config
```

You and Bob will share the same configurations. If someone edit a config, everyone can retrieve it immediatly.

## Deployment

The file `.comfy/config` is convenient for tests and developments but not for real deployment.

To this end, if comfy doesn't find `.comfy/config` from the current folder, it asks for the same infos from environment variables.

Say, you have the following `.comfy/config` file:

```ini
[project]
projectId=1111111111-1111-1111-1111-1111111111111
accessKey=XXXXXXXXXXXXXXXX
secretToken=YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
origin=https://comfy.marmelab.com
privateKey=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
hmacKey=yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

You can specify the following environment variables to replace it:

```bash
export COMFY_PROJECT_ID=1111111111-1111-1111-1111-1111111111111;
export COMFY_ACCESS_KEY=XXXXXXXXXXXXXXXX;
export COMFY_SECRET_TOKEN=YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY;
export COMFY_ORIGIN=https://comfy.marmelab.com;
export COMFY_PRIVATE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx;
export COMFY_HMAC_KEY=yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy;

comfy get production
```

You can now set these environment variables in your CI configuration, code builder, or any continuous delivery system you have.
The advantage is that you only have to do it once.

**Note:** These environment variables will be easier in the future.
