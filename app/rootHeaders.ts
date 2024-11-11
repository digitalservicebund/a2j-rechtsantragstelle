import type { HeadersArgs } from "@remix-run/node";

export const defaultHeaders = {
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "accelerometer=(),autoplay=(),camera=(),display-capture=(),document-domain=(),encrypted-media=(),fullscreen=(),gamepad=(),geolocation=(),gyroscope=(),magnetometer=(),microphone=(),midi=(),payment=(),picture-in-picture=(),publickey-credentials-get=(),sync-xhr=(self),usb=(),screen-wake-lock=(),web-share=(),xr-spatial-tracking=()", // see https://github.com/w3c/webappsec-permissions-policy/blob/main/features.md
};

export const headers = ({ loaderHeaders }: HeadersArgs) => ({
  ...defaultHeaders,
  ...(loaderHeaders.get("shouldAddCacheControl") === "true" && {
    "Cache-Control": "no-store",
  }),
});
