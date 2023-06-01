PRODUCTION_URL="https://a2j-rast.prod.ds4g.net/"
TEXT="Onlineservices der Justiz"

if curl -s $PRODUCTION_URL --header "Authorization: Basic $1" | grep -o $TEXT; then
  echo "Text found"
  exit 0
else
  echo "Text '$TEXT' not found on '$PRODUCTION_URL'"
  exit 1
fi
