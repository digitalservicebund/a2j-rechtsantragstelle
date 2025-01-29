#!/bin/sh
set -euf

# Exporting only if not already set, see https://stackoverflow.com/a/11686912
export GERICHTSFINDER_ENCRYPTION_KEY="${GERICHTSFINDER_ENCRYPTION_KEY:=$(cat /etc/courtdata-secrets/password)}"
export SENTRY_DSN="${SENTRY_DSN:=$(cat /etc/sentry-secrets/password)}"
export STRAPI_API="${STRAPI_API:=$(cat /etc/strapi-api-secret/password)}"
export STRAPI_ACCESS_KEY="${STRAPI_ACCESS_KEY:=$(cat /etc/strapi-access-key-secret/password)}"
export POSTHOG_API_KEY="${POSTHOG_API_KEY:=$(cat /etc/posthog-secrets/password)}"
export COOKIE_SESSION_SECRET="${COOKIE_SESSION_SECRET:=$(cat /etc/cookie-session-secret/password)}"
export REDIS_PASSWORD="${REDIS_PASSWORD:=$(cat /etc/redis-password-secret/password)}"
export SAML_IDP_CERT="${SAML_IDP_CERT:=$(cat /etc/saml/idp_cert)}"
export S3_DATA_STORAGE_ACCESS_KEY="${S3_DATA_STORAGE_ACCESS_KEY:=$(cat /etc/s3-data-storage-credentials-secret-access-key/password)}"
export S3_DATA_STORAGE_SECRET_KEY="${S3_DATA_STORAGE_SECRET_KEY:=$(cat /etc/s3-data-storage-credentials-secret-key/password)}"

# NODE_ENV is only used by express, see https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production
NODE_ENV=production node ./server.js
