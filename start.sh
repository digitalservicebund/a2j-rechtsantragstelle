#!/bin/sh

export GERICHTSFINDER_ENCRYPTION_KEY=$(cat /etc/courtdata-secrets/password)
export SENTRY_DSN=$(cat /etc/sentry-secrets/password)
export STRAPI_ACCESS_KEY=$(cat /etc/strapi-access-key-secret/password)
export STRAPI_API=$(cat /etc/strapi-api-secret/password)

node ./server.js
