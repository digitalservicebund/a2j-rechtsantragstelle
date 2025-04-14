import { parse } from "cookie";
import { posthog, type Survey } from "posthog-js";
import { config } from "~/services/env/web";

export function fetchSurvey(surveyId: string) {
  let survey: Survey | undefined;
  posthog.getSurveys((surveys) => {
    survey = surveys.find((survey) => survey.id === surveyId);
  });
  return survey;
}

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
