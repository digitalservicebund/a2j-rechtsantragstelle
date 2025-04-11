import { posthog as posthogJS } from "posthog-js";
import { type PostHog } from "posthog-node";
import { createContext, useContext } from "react";
import { fetchSurvey } from "~/services/analytics/posthogHelpers";

const feedbackSurveyId = "01956b7e-2774-0000-49d7-d34d26811373";

type PosthogContext = {
  posthog: Partial<PostHog> | undefined;
  /**
   * Need to expose cookie header here as we're using it to uniquely identify users upon event capture
   */
  cookieHeader: string | null;
};

export const PosthogContext = createContext<PosthogContext>({
  posthog: undefined,
  cookieHeader: null,
});

export function usePosthog() {
  const { posthog, cookieHeader } = useContext(PosthogContext);
  return {
    posthog,
    cookieHeader,
    /**
     * Surveys aren't yet supported in the NodeJS PostHog SDK, so we have to fall back to the JS version :/
     */
    fetchSurvey: (surveyId: string = feedbackSurveyId) => {
      if (!posthogJS.__loaded) {
        posthogJS.init(posthog?.apiKey ?? "", {
          api_host: posthog?.host,
          session_recording: {
            // Masking input and text elements to prevent sensitive data being shown on pages
            maskTextSelector: "*",
            maskAllInputs: true,
          },

          cross_subdomain_cookie: false, // set cookie for subdomain only

          opt_out_persistence_by_default: true,
          loaded: () => {
            return fetchSurvey(surveyId);
          },
        });
      }
      return fetchSurvey(surveyId);
    },
  };
}
