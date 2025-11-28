#!/usr/bin/env bash
# Get the latest content data from Strapi before run the tests
pnpm run build:localContent
CMS="FILE"
# After get the latest content data from Strapi, run the tests
npx vitest run --project=integration
