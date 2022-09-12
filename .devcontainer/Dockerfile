# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 18, 16, 14, 18-bullseye, 16-bullseye, 14-bullseye, 18-buster, 16-buster, 14-buster
ARG VARIANT=latest
FROM couchdb:${VARIANT}

USER root

RUN apt update && apt upgrade -y
RUN apt install git -y
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g npm@latest

COPY ./.devcontainer/couchdb.local.ini /opt/couchdb/etc/local.ini

# These lines are necessary if the user has cloned the repo to their local machine
# and clicked the "Reopen in container button"
RUN mkdir -p /workspaces/astrocouch
WORKDIR /workspaces/astrocouch
COPY . .

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node modules
# RUN su node -c "npm install -g <your-package-list-here>"
