#!/bin/sh
PREVIEW_URL="https://a2j-rast-preview.dev.ds4g.net"
TEXT="Justiz-Services"

if curl -s $PRODUCTION_URL | grep -o "$TEXT"; then
  echo "Text found"
  exit 0
else
  echo "Text '$TEXT' not found on '$PRODUCTION_URL'"
  exit 1
fi
