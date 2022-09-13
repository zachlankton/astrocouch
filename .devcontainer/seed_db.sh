#!/bin/bash

# Get Basic Auth Base64 Token
COUCH_AUTH=$(echo -n 'admin:admin' | base64)

# Create Test Database
curl -X PUT http://127.0.0.1:5984/test \
   -H "Authorization: Basic $COUCH_AUTH"