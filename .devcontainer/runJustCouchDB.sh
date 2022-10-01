#!/bin/bash

docker run -d \
    --name my-couchdb \
    -p 5984:5984 \
    -e COUCHDB_USER=admin \
    -e COUCHDB_PASSWORD=admin \
    -e COUCHDB_SECRET=superSensitiveSecret \
    -e NODENAME=node \
    -e ERL_FLAGS='-setcookie "brumbrum"' \
    couchdb:3.2