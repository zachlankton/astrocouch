#!/bin/bash

npm ci
npm run prepare
./.devcontainer/seed_db.sh