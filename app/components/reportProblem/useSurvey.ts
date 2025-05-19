import { type Survey } from "posthog-js";
import { usePosthogWithConsent } from "../cookieBanner/usePosthogWithConsent";

const FEEDBACK_SURVEY_ID = "01956b7e-2774-0000-49d7-d34d26811373";

/**
 * A hook to fetch a survey with a given ID. If the PostHog instance is not initialized or if tracking consent is not given, returns null.
 * The hook returns an object with a single property, `fetchSurvey`, which is a function that returns a promise that resolves to the survey data.
 */
export function useSurvey() {
  const { posthog, hasTrackingConsent } = usePosthogWithConsent();

  const fetchSurvey = () => {
    // no posthog and no consent
    if (!posthog && !hasTrackingConsent) return Promise.resolve(null);
    // posthog and no consent
    if (posthog && !hasTrackingConsent) return Promise.resolve(null);
    // posthog exists and consent is given

    function findSurveyById(surveys: Survey[]): Survey | null {
      return surveys.find((survey) => survey.id === FEEDBACK_SURVEY_ID) ?? null;
    }
    return new Promise<Survey | null>((resolve) => {
      // getSurveys returns a callback with an array of surveys
      posthog.getSurveys((surveys: Survey[]) => {
        const survey = findSurveyById(surveys);
        resolve(survey ?? null);
      });
    });
  };
  return { fetchSurvey };
}
