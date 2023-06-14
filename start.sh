#!/bin/sh

export GERICHTSFINDER_ENCRYPTION_KEY=$(cat /etc/courtdata-secrets/password)
export SENTRY_DSN=$(cat /etc/sentry-secrets/password)
node ./server.js
