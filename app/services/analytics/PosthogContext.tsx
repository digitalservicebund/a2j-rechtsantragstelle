import { type PostHog } from "posthog-js";
import { createContext, useContext } from "react";

// const feedbackSurveyId = "01956b7e-2774-0000-49d7-d34d26811373";

type PosthogContext = {
  posthogClient: Partial<PostHog> | undefined;
  /**
   * Need to expose cookie header here as we're using it to uniquely identify users upon event capture
   */
  // cookieHeader: string | null;
};

export const PosthogContext = createContext<PosthogContext>({
  posthogClient: undefined,
  // cookieHeader: null,
});

export function usePosthog() {
  const { posthogClient /* , cookieHeader */ } = useContext(PosthogContext);
  return {
    posthogClient,
    // cookieHeader,
    // fetchSurvey: (surveyId: string = feedbackSurveyId) => {
    //   if (!posthog.__loaded) {
    //     posthog.init(POSTHOG_API_KEY ?? "", {
    //       api_host: POSTHOG_API_HOST,
    //       session_recording: {
    //         // Masking input and text elements to prevent sensitive data being shown on pages
    //         maskTextSelector: "*",
    //         maskAllInputs: true,
    //       },

    //       cross_subdomain_cookie: false, // set cookie for subdomain only

    //       opt_out_persistence_by_default: true,
    //       loaded: () => {
    //         return fetchSurvey(surveyId);
    //       },
    //     });
    //   }
    //   return fetchSurvey(surveyId);
    // },
  };
}
