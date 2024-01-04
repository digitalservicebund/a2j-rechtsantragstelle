#!/bin/sh
PREVIEW_URL="https://a2j-preview.dev.ds4g.net"
TEXT="Justiz-Services"

if curl -s $PREVIEW_URL | grep -o "$TEXT"; then
  echo "Text found"
  exit 0
else
  echo "Text '$TEXT' not found on '$PREVIEW_URL'"
  exit 1
fi
