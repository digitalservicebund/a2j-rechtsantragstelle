import { json } from "@remix-run/node";

export function getRedirectForNonRelativeUrl(searchParameterUrl: string) {
  if (!searchParameterUrl.startsWith("/")) {
    return json({ success: false }, { status: 400 });
  }
}
