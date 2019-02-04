#!/bin/bash

# Set up environment
# Python Virtual Environment (https://docs.python.org/3/tutorial/venv.html)
# Node Virtual Environment (https://github.com/ekalinin/nodeenv)

NODE_ENV_DIR="node-env"
NODE_VERSION="10.15.0"
NPM_VERSION="latest"

if [ -d "$NODE_ENV_DIR" ]; then
  echo "The directory $NODE_ENV_DIR already exists. Abort..."
  exit 1;
fi
virtualenv "$NODE_ENV_DIR"
. "$NODE_ENV_DIR"/bin/activate

pip install -e git+https://github.com/ekalinin/nodeenv.git#egg=nodeenv

nodeenv --node="$NODE_VERSION" --npm="$NPM_VERSION" -p

deactivate
. "$NODE_ENV_DIR"/bin/activate

## Checking versions
echo "Current PATH  : $PATH"
echo "Installed node: $(node -v)"
echo "Installed npm : $(npm -v)"

