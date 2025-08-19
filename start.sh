#!/bin/sh
set -euf

# Exporting only if not already set, see https://stackoverflow.com/a/11686912

# NODE_ENV is only used by express, see https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production
NODE_ENV=production node ./server.js
