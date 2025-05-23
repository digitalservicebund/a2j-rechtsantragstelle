import { parse } from "cookie";
import { config } from "~/services/env/web";

export function idFromCookie(cookie: string | null) {
  // Note: can't use cookie.parse(): https://github.com/remix-run/remix/discussions/5198
  // Returns ENVIRONMENT if posthog's distinct_id can't be extracted
  const { POSTHOG_API_KEY, ENVIRONMENT } = config();
  const envId = `client-${ENVIRONMENT}`;
  if (!POSTHOG_API_KEY) return envId;
  const parsedCookie = parse(cookie ?? "");
  const phCookieString = parsedCookie[`ph_${POSTHOG_API_KEY}_posthog`] ?? "{}";
  const phCookieObject = JSON.parse(phCookieString) as Record<string, string>;
  return phCookieObject.distinct_id ?? envId;
}
