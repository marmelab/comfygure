Want to open a PR on comfy? Thank you! Here are a few things you need to know.

**Requirements**

- NodeJS LTS

# Project organisation
This repository is splitted into a few parts.

- The serverless API
- The console client
- The utils & tests

They all contain their own `makefile` and `package.json`.

```bash
.
├── api        # The serverless API (https://comfy.marmelab.com)
├── cli        # The console client (comfygure, that you can install from npm)
├── docs       # Built website served by GitHub pages (https://marmelab.com/comfygure)
└── test       # E2E tests for the API & client
```

# Installation

```bash
git clone git@github.com:marmelab/comfygure.git
cd comfygure/
make install # Install the dependencies of all the projects
make -C api install-db  # Create a database into a docker container on port 5432
```

# Run the project

```bash
make -C api run                                        # Run comfy server API on port 3000
./cli/bin/comfy.js init --origin http://localhost:3000 # Initialize a project on the local API
```

Use `./cli/bin/comfy.js` instead of the global `comfy` command.

# Testing

No PR will be merged if the tests don't pass.

```bash
make test            # Run ALL the tests (⌐■_■)

make -C api test     # Run API unit tests only
make -C cli test     # Run cli unit tests only
make -C test test    # Run E2E tests only
```
