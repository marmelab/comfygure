---
layout: default
title: "Advanced Usage"
---

## Host Your Own Comfy Server

Marmelab hosts the default comfygure server at `https://comfy.marmelab.com`. You can use it for free, for your tests, with no warranties of availability. We reserve the right to suspend usage in case of abuse.

In production, you'll probably want to host your own comfygure server. Fortunately, the comfygure server code is open-source and [available on GitHub](https://github.com/marmelab/comfygure).

Comfygure is developed to be deployed through a few [AWS Lambdas](https://aws.amazon.com/fr/lambda/) thanks to [the serverless framework](https://serverless.com/). As for the database, you have to deal with it.

Once your server is configured, use the standard `comfy` client to initialize your project, and pass your server URL in the `--origin` option:

```bash
comfy init --origin https://my.custom.host
```
