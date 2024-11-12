import { data } from "@remix-run/node";

export function getRedirectForNonRelativeUrl(searchParameterUrl: string) {
  if (!searchParameterUrl.startsWith("/")) {
    return data({ success: false }, { status: 400 });
  }
}
