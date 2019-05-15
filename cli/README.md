[![npm version](https://badge.fury.io/js/comfygure.svg)](https://badge.fury.io/js/comfygure) ![CLI dependencies](https://img.shields.io/david/marmelab/comfygure.svg?label=CLI%20dependencies&path=cli) ![API dependencies](https://img.shields.io/david/marmelab/comfygure.svg?label=API%20dependencies&path=api) [![npm downloads](https://img.shields.io/npm/dt/comfygure.svg)](http://npmjs.com/comfygure) [![docker pulls](https://img.shields.io/docker/pulls/marmelab/comfygure.svg)](https://hub.docker.com/r/marmelab/comfygure) [![Build Status](https://travis-ci.org/marmelab/comfygure.png?branch=master)](https://travis-ci.org/marmelab/comfygure)

# comfygure

Encrypted and versioned configuration storage built with collaboration in mind.

[Source](https://github.com/marmelab/comfygure) - [Releases](https://github.com/marmelab/comfygure/releases) - [Stack Overflow](https://stackoverflow.com/questions/tagged/comfy/)

[![asciicast](https://asciinema.org/a/137703.png)](https://asciinema.org/a/137703)

## Features

-   Simple CLI
-   End-to-end AES-256 encryption
-   Multiple formats support (JSON, YAML, environment variables)
-   Git-like Versioning
-   Easy to host on your own

Comfygure is great to manage application configurations for multiple environments, toggle feature flags quickly, manage A/B testing based on configuration files.

It is not a [Secret Management Tool](https://gist.github.com/maxvt/bb49a6c7243163b8120625fc8ae3f3cd), it focus on configurations files, their history, and how teams collaborate with them.

## Get Started

On every server that needs access to the settings of an app, install the `comfy` CLI using `npm`:

```bash
npm install -g comfygure
comfy help
```

## Usage

Initialize comfygure in a project directory with `comfy init`:

```bash
> cd myproject
> comfy init

Initializing project configuration...
Project created on comfy server https://comfy.marmelab.com
Configuration saved locally in .comfy/config
comfy project successfully created
```

This creates a unique key to access the settings for `myproject`, and stores the key in `.comfy/config`. You can copy this file to share the credentials with co-workers or other computers.

**Note**: By default, the `comfy` command stores encrypted settings in the `comfy.marmelab.com` server. To host your own comfy server, see [the related documentation](https://marmelab.com/comfygure/HostYourOwn.html#host-your-own-comfy-server).

Import an existing settings file to comfygure using `comfy setall`:

```bash
> echo '{"login": "admin", "password": "S3cr3T"}' > config.json
> comfy setall development config.json
Great! Your configuration was successfully saved.
```

From any computer sharing the same credentials, grab these settings using `comfy get`:

```bash
> comfy get development
{"login": "admin", "password": "S3cr3T"}
> comfy get development --envvars
export LOGIN='admin';
export PASSWORD='S3cr3T';
```

To turn settings grabbed from comfygure into environment variables, use the following:

```bash
> comfy get development --envvars | source /dev/stdin
> echo $LOGIN
admin
```

See the [documentation](https://marmelab.com/comfygure/) to know more about how it works and the remote usage.

## License

Comfygure is licensed under the [MIT License](https://github.com/marmelab/comfygure/blob/master/LICENSE), sponsored and supported by [marmelab](http://marmelab.com).
