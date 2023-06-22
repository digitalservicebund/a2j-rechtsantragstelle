#!/bin/sh
set -euf

# Declare and assign separately to avoid masking return values, see https://www.shellcheck.net/wiki/SC2155
GERICHTSFINDER_ENCRYPTION_KEY=$(cat /etc/courtdata-secrets/password) || true
export GERICHTSFINDER_ENCRYPTION_KEY
SENTRY_DSN=$(cat /etc/sentry-secrets/password) || true
export SENTRY_DSN
STRAPI_ACCESS_KEY=$(cat /etc/strapi-access-key-secret/password) || true
export STRAPI_ACCESS_KEY
STRAPI_API=$(cat /etc/strapi-api-secret/password) || true
export STRAPI_API
POSTHOG_API_KEY=$(cat /etc/posthog-secrets/password) || true
export POSTHOG_API_KEY

node ./server.js
