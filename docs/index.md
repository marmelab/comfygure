---
layout: default
title: "Documentation"
---
# comfygure

A cli to help you manage your configurations for development, test and deployment. Open sourced and maintained by [marmelab](https://marmelab.com/).

<div style="text-align: center" markdown="1">
<i class="octicon octicon-mark-github"></i> [Source](https://github.com/marmelab/comfygure) -
<i class="octicon octicon-megaphone"></i> [Releases](https://github.com/marmelab/comfygure/releases) -
<i class="octicon octicon-comment-discussion"></i> [StackOverflow](https://stackoverflow.com/questions/tagged/comfy/)
</div>

<script type="text/javascript" src="https://asciinema.org/a/137703.js" id="asciicast-137703" async></script>

## Features

* End-to-end encryption
* Multiple format supports (JSON, YAML, Environment variables)
* Configuration versioning (git-like)

## Installation

comfygure is available from npm. You can install it (and its required dependencies)
using:

```bash
npm install -g comfygure
comfy help
```

## Usage

In a project directory, initialize a new configuration with `comfy init`:

```bash
> comfy init

Initializing project configuration...
Project created on comfy server https://comfy.marmelab.com
Configuration saved locally in .comfy/config
comfy project successfully created
```

Set the configuration for a particular environment based on the content of an existing file using `comfy setall`:

```bash
> echo '{"login": "admin", "password": "S3cr3T"}' > config.json
> comfy setall development config.json
Great! Your configuration was successfully saved.
```

Grab that configuration from any server using `comfy get`:

```bash
> comfy get development
{"login": "admin", "password": "S3cr3T"}
> comfy get development --envvars
export LOGIN='admin';
export PASSWORD='S3cr3T';
```

To store a remote configuration in the environment, use:

```bash
> comfy get development | source /dev/stdin
> echo $LOGIN
admin
```

You now have all your credentials in `.comfy/config`, you can give them to your co-workers or use them on your remote server.

See the [documentation](https://marmelab.com/comfygure/) to know more about how it works and the remote usage.

## License

comfygure is licensed under the [MIT Licence](https://github.com/marmelab/admin-on-rest/blob/master/LICENSE.md), sponsored and supported by [marmelab](http://marmelab.com).
