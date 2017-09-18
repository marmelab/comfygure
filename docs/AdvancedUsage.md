---
layout: default
title: "Advanced Usage"
---

## Host your own comfy server

Marmelab host the default comfy server at `https://comfy.marmelab.com` that you can use for free.

But if you want to or your project / company requires to host it on your own, you can: the code is open-source and [available on GitHub](https://github.com/marmelab/comfygure).

Comfy is developed to be deployed through a few [AWS Lambdas](https://aws.amazon.com/fr/lambda/) thanks to the [serverless](https://serverless.com/) library, and you have to deal with your own database.

Once your server is configured, you can use the standard comfy client to initialize your project:

```bash
comfy init --origin https://my.custom.host
```

If you want to improve comfy without installing your own server, feel free to open [an issue](https://github.com/marmelab/comfygure/issues/new) or [a pull-request](https://github.com/marmelab/comfygure/tree/master/.github/CONTRIBUTING.md)
