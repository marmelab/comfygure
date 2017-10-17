---
layout: default
title: "Documentation"
---
# Comfygure

Store and deploy settings across development, test, and production environments, using an encrypted key-value store.

<div style="text-align: center" markdown="1">
<i class="octicon octicon-mark-github"></i> [Source](https://github.com/marmelab/comfygure) -
<i class="octicon octicon-megaphone"></i> [Releases](https://github.com/marmelab/comfygure/releases) -
<i class="octicon octicon-comment-discussion"></i> [StackOverflow](https://stackoverflow.com/questions/tagged/comfy/)
</div>

Comfygure assumes that you deploy artefacts that require settings to run in various environment. Comfygure solves the problem of managing, storing, and deploying these settings.

<script type="text/javascript" src="https://asciinema.org/a/137703.js" id="asciicast-137703" async></script>

Unlike many other [Secret Management Tools](https://gist.github.com/maxvt/bb49a6c7243163b8120625fc8ae3f3cd), comfygure doesn't try do pack too many features into one tool. Comfygure tries to do one thing (settings deployment), and do it well.

## Features

* Simple CLI tool
* Web GUI
* Multi-environment (dev, test, staging, production, etc.)
* End-to-end encryption using AES-256
* Read/Write permissions
* Input and output in multiple formats (JSON, YAML, environment variables)
* Versioning (git-like)
* Easy to host

## Command Line Installation

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

**Tip**: By default, the `comfy` command stores encrypted settings in the `comfy.marmelab.com` server. To host your own comfy server, see [the related documentation](./AdvancedUsage.html#host-your-own-comfy-server).

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
