import { data } from "react-router";

export function getRedirectForNonRelativeUrl(searchParameterUrl: string) {
  if (!searchParameterUrl.startsWith("/")) {
    return data({ success: false }, { status: 400 });
  }
}
