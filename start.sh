#!/bin/sh

export GERICHTSFINDER_ENCRYPTION_KEY=$(cat /etc/courtdata-secrets/password)
node ./server.js
